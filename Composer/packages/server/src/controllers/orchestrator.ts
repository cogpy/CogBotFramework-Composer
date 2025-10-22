// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Orchestrator } from '@microsoft/bf-orchestrator';
import { Request, Response } from 'express';
import { pathExists } from 'fs-extra';
import { OrchestratorModelRequest, DownloadState, IOrchestratorNLRList } from '@bfc/shared';

import { TelemetryService } from '../services/telemetry';
import { Path } from '../utility/path';
import { cognitiveOrchestrator } from '../services/opencog/cognitiveOrchestrator';
import { synergyArchitecture } from '../services/opencog/synergyArchitecture';
import log from '../logger';

class OrchestratorController {
  private errorMsg: any;
  private state: DownloadState = DownloadState.STOPPED;

  private getModelBasePath = async () => {
    let appDataPath = '';
    if (process?.versions && 'electron' in process.versions) {
      const { app } = await import('electron');
      appDataPath = app.getPath('appData');
    } else {
      appDataPath = process.env.APPDATA || process.env.HOME || '';
    }
    const baseModelPath = Path.resolve(appDataPath, 'BotFrameworkComposer', 'models');
    return baseModelPath;
  };

  private getModelPath = async (modelName: string) =>
    Path.resolve(await this.getModelBasePath(), modelName.replace('.onnx', ''));

  private isValidModelRequest(arg: any): arg is OrchestratorModelRequest {
    return arg.kind !== undefined && arg.name !== undefined;
  }

  public status = async (req: Request, res: Response) => {
    if (this.errorMsg) {
      res.status(400).send(this.errorMsg);
      return;
    }
    res.send(this.state);
  };

  public getModelList = async (req: Request, res: Response) => res.send(await Orchestrator.baseModelGetVersionsAsync());

  public downloadLanguageModel = async (req: Request, res: Response) => {
    const modelData = req.body?.modelData;
    this.errorMsg = null;

    if (!this.isValidModelRequest(modelData)) {
      return res.sendStatus(400);
    }

    const modelList: IOrchestratorNLRList = await Orchestrator.baseModelGetVersionsAsync();
    let modelName: string;

    if (modelData?.name === 'default') {
      modelName = modelList.defaults[modelData.kind];
    } else {
      if (!(modelData.name in modelList.models)) {
        throw new Error(`Invalid Model: ${modelData.name}`);
      }
      modelName = modelData.name;
    }

    const modelPath = await this.getModelPath(modelName);

    if (await pathExists(modelPath)) {
      this.state = DownloadState.ALREADYDOWNLOADED;
      return res.sendStatus(201);
    }

    const onProgress = (msg: string) => {
      this.state = DownloadState.DOWNLOADING;
    };

    const onFinish = (msg: string) => {
      TelemetryService.endEvent('OrchestratorDownloadCompleted', 'OrchestratorDownloader');
      this.state = DownloadState.STOPPED;
      
      // Notify OpenCog orchestrator about model completion
      this.notifyOpenCogModelReady(modelName);
    };

    res.send('/orchestrator/status');

    try {
      this.state = DownloadState.DOWNLOADING;
      TelemetryService.startEvent('OrchestratorDownloadStarted', 'OrchestratorDownloader');
      await Orchestrator.baseModelGetAsync(modelPath, modelName, onProgress, onFinish);
    } catch (err) {
      this.errorMsg = err;
      this.state = DownloadState.STOPPED;
    }
  };

  /**
   * Notify OpenCog orchestrator about model readiness for cognitive integration
   */
  private notifyOpenCogModelReady = async (modelName: string) => {
    try {
      const cognitiveInput = {
        type: 'model_integration',
        modelName,
        modelPath: await this.getModelPath(modelName),
        capabilities: ['language_understanding', 'intent_classification', 'entity_recognition'],
        timestamp: Date.now(),
      };

      const result = await cognitiveOrchestrator.processInput(cognitiveInput);
      
      log('OpenCog notified of model readiness', { 
        modelName, 
        cognitiveResponse: result.confidence 
      });
      
    } catch (error) {
      log('Failed to notify OpenCog orchestrator:', error);
    }
  };

  /**
   * Get cognitive orchestration insights for language model usage
   */
  public getCognitiveInsights = async (req: Request, res: Response) => {
    try {
      const { text, intent, entities } = req.body;
      
      const insightInput = {
        type: 'language_analysis',
        text,
        intent,
        entities,
        requiresResponse: true,
        timestamp: Date.now(),
      };

      const insights = await cognitiveOrchestrator.processInput(insightInput);
      
      res.json({
        success: true,
        insights: {
          cognitiveAnalysis: insights.content,
          confidenceScore: insights.confidence,
          synergyLevel: insights.synergyLevel,
          recommendations: insights.adaptations,
          processingMetadata: insights.metadata,
        },
        timestamp: Date.now(),
      });
      
    } catch (error) {
      log('Error getting cognitive insights:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to get cognitive insights',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
}

export default new OrchestratorController();
