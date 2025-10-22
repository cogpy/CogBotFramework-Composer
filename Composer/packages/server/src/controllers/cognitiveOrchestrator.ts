// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Request, Response } from 'express';
import { cognitiveOrchestrator } from '../services/opencog/cognitiveOrchestrator';
import { synergyArchitecture } from '../services/opencog/synergyArchitecture';
import { TelemetryService } from '../services/telemetry';
import log from '../logger';

/**
 * CognitiveOrchestratorController manages OpenCog-based autonomous orchestration
 * for Bot Framework Composer. This controller provides endpoints for cognitive
 * reasoning, synergy architecture management, and autonomous decision-making.
 */
class CognitiveOrchestratorController {
  /**
   * Process cognitive input through OpenCog orchestrator
   */
  public processInput = async (req: Request, res: Response) => {
    try {
      const { input, options } = req.body;
      
      if (!input) {
        return res.status(400).json({ error: 'Input is required' });
      }

      TelemetryService.startEvent('CognitiveProcessing', 'CognitiveOrchestrator');
      
      const startTime = Date.now();
      const result = await cognitiveOrchestrator.processInput(input);
      const processingTime = Date.now() - startTime;
      
      TelemetryService.endEvent('CognitiveProcessing', 'CognitiveOrchestrator');
      
      res.json({
        success: true,
        result,
        processingTime,
        timestamp: Date.now(),
      });
      
      log('Cognitive processing completed', { 
        inputType: input?.type, 
        confidence: result.confidence,
        synergyLevel: result.synergyLevel,
        processingTime 
      });
      
    } catch (error) {
      log.error('Error in cognitive processing:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Cognitive processing failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * Get current cognitive state
   */
  public getCognitiveState = async (req: Request, res: Response) => {
    try {
      const cognitiveState = cognitiveOrchestrator.getCognitiveState();
      const statistics = cognitiveOrchestrator.getCognitiveStatistics();
      
      res.json({
        success: true,
        cognitiveState,
        statistics,
        timestamp: Date.now(),
      });
      
    } catch (error) {
      log.error('Error getting cognitive state:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to get cognitive state',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * Get synergy architecture state
   */
  public getArchitecturalState = async (req: Request, res: Response) => {
    try {
      const architecturalState = synergyArchitecture.getArchitecturalState();
      const statistics = synergyArchitecture.getArchitecturalStatistics();
      
      res.json({
        success: true,
        architecturalState,
        statistics,
        timestamp: Date.now(),
      });
      
    } catch (error) {
      log.error('Error getting architectural state:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to get architectural state',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * Configure cognitive orchestrator settings
   */
  public configureCognition = async (req: Request, res: Response) => {
    try {
      const { autonomousMode, learningEnabled, adaptationThreshold, synergyThreshold } = req.body;
      
      if (autonomousMode !== undefined) {
        cognitiveOrchestrator.setAutonomousMode(autonomousMode);
      }
      
      if (learningEnabled !== undefined) {
        cognitiveOrchestrator.setLearningEnabled(learningEnabled);
      }
      
      if (adaptationThreshold !== undefined) {
        cognitiveOrchestrator.setAdaptationThreshold(adaptationThreshold);
      }
      
      if (synergyThreshold !== undefined) {
        synergyArchitecture.setSynergyThreshold(synergyThreshold);
      }
      
      res.json({
        success: true,
        message: 'Cognitive configuration updated',
        configuration: {
          autonomousMode,
          learningEnabled,
          adaptationThreshold,
          synergyThreshold,
        },
        timestamp: Date.now(),
      });
      
      log('Cognitive configuration updated', { 
        autonomousMode, 
        learningEnabled, 
        adaptationThreshold, 
        synergyThreshold 
      });
      
    } catch (error) {
      log.error('Error configuring cognition:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to configure cognition',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * Add custom cognitive pattern
   */
  public addCognitivePattern = async (req: Request, res: Response) => {
    try {
      const { pattern } = req.body;
      
      if (!pattern || !pattern.id || !pattern.name) {
        return res.status(400).json({ 
          error: 'Pattern with id and name is required' 
        });
      }
      
      cognitiveOrchestrator.addCognitivePattern(pattern);
      
      res.json({
        success: true,
        message: 'Cognitive pattern added successfully',
        patternId: pattern.id,
        timestamp: Date.now(),
      });
      
      log('Cognitive pattern added', { patternId: pattern.id, patternName: pattern.name });
      
    } catch (error) {
      log.error('Error adding cognitive pattern:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to add cognitive pattern',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * Remove cognitive pattern
   */
  public removeCognitivePattern = async (req: Request, res: Response) => {
    try {
      const { patternId } = req.params;
      
      if (!patternId) {
        return res.status(400).json({ error: 'Pattern ID is required' });
      }
      
      cognitiveOrchestrator.removeCognitivePattern(patternId);
      
      res.json({
        success: true,
        message: 'Cognitive pattern removed successfully',
        patternId,
        timestamp: Date.now(),
      });
      
      log('Cognitive pattern removed', { patternId });
      
    } catch (error) {
      log.error('Error removing cognitive pattern:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to remove cognitive pattern',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * Reset cognitive system
   */
  public resetCognition = async (req: Request, res: Response) => {
    try {
      cognitiveOrchestrator.reset();
      
      res.json({
        success: true,
        message: 'Cognitive system reset successfully',
        timestamp: Date.now(),
      });
      
      log('Cognitive system reset');
      
    } catch (error) {
      log.error('Error resetting cognitive system:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to reset cognitive system',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * Get cognitive orchestration recommendations for bot project
   */
  public getOrchestrationRecommendations = async (req: Request, res: Response) => {
    try {
      const { projectId, botSchema, currentDialog } = req.body;
      
      const analysisInput = {
        type: 'orchestration_analysis',
        projectId,
        botSchema,
        currentDialog,
        requiresResponse: true,
        timestamp: Date.now(),
      };
      
      const recommendations = await cognitiveOrchestrator.processInput(analysisInput);
      
      res.json({
        success: true,
        recommendations: {
          cognitiveInsights: recommendations.content,
          suggestedPatterns: this.extractPatternSuggestions(recommendations),
          optimizationOpportunities: recommendations.adaptations,
          synergyScore: recommendations.synergyLevel,
          confidence: recommendations.confidence,
          processingPath: recommendations.metadata.processingPath,
        },
        timestamp: Date.now(),
      });
      
      log('Orchestration recommendations generated', { 
        projectId, 
        confidence: recommendations.confidence,
        synergyScore: recommendations.synergyLevel
      });
      
    } catch (error) {
      log.error('Error generating orchestration recommendations:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to generate orchestration recommendations',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * Optimize bot dialog flow using cognitive reasoning
   */
  public optimizeDialogFlow = async (req: Request, res: Response) => {
    try {
      const { dialogFlow, userIntent, context } = req.body;
      
      const optimizationInput = {
        type: 'dialog_optimization',
        dialogFlow,
        userIntent,
        context,
        requiresResponse: true,
        dialog: true,
        timestamp: Date.now(),
      };
      
      const optimization = await cognitiveOrchestrator.processInput(optimizationInput);
      
      res.json({
        success: true,
        optimization: {
          recommendedFlow: this.generateOptimizedFlow(dialogFlow, optimization),
          cognitiveReasoning: optimization.content,
          improvementAreas: optimization.adaptations,
          synergyLevel: optimization.synergyLevel,
          confidence: optimization.confidence,
          activePatterns: optimization.metadata.activePatterns,
        },
        timestamp: Date.now(),
      });
      
      log('Dialog flow optimized', { 
        confidence: optimization.confidence,
        synergyLevel: optimization.synergyLevel
      });
      
    } catch (error) {
      log.error('Error optimizing dialog flow:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to optimize dialog flow',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * Generate adaptive bot responses using cognitive synergy
   */
  public generateAdaptiveResponse = async (req: Request, res: Response) => {
    try {
      const { userMessage, conversationHistory, botPersonality, context } = req.body;
      
      const responseInput = {
        type: 'adaptive_response',
        text: userMessage,
        conversationHistory,
        botPersonality,
        context,
        requiresResponse: true,
        timestamp: Date.now(),
      };
      
      const adaptiveResponse = await cognitiveOrchestrator.processInput(responseInput);
      
      res.json({
        success: true,
        response: {
          generatedText: adaptiveResponse.content,
          cognitiveAnalysis: this.extractCognitiveAnalysis(adaptiveResponse),
          adaptationLevel: adaptiveResponse.synergyLevel,
          confidence: adaptiveResponse.confidence,
          learningInsights: adaptiveResponse.adaptations,
        },
        timestamp: Date.now(),
      });
      
      log('Adaptive response generated', { 
        confidence: adaptiveResponse.confidence,
        synergyLevel: adaptiveResponse.synergyLevel
      });
      
    } catch (error) {
      log.error('Error generating adaptive response:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to generate adaptive response',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * Enable autogenesis for continuous evolution
   */
  public enableAutogenesis = async (req: Request, res: Response) => {
    try {
      const { enabled } = req.body;
      
      synergyArchitecture.setAutogenesisEnabled(enabled);
      
      res.json({
        success: true,
        message: `Autogenesis ${enabled ? 'enabled' : 'disabled'}`,
        autogenesisEnabled: enabled,
        timestamp: Date.now(),
      });
      
      log(`Autogenesis ${enabled ? 'enabled' : 'disabled'}`);
      
    } catch (error) {
      log.error('Error configuring autogenesis:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to configure autogenesis',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * Get real-time cognitive monitoring data
   */
  public getCognitiveMonitoring = async (req: Request, res: Response) => {
    try {
      const cognitiveStats = cognitiveOrchestrator.getCognitiveStatistics();
      const architecturalStats = synergyArchitecture.getArchitecturalStatistics();
      
      res.json({
        success: true,
        monitoring: {
          cognitive: {
            totalNodes: cognitiveStats.totalNodes,
            activeNodes: cognitiveStats.activeNodes,
            synergyLevel: cognitiveStats.synergyLevel,
            learningRate: cognitiveStats.learningRate,
            averageEffectiveness: cognitiveStats.averageEffectiveness,
          },
          architecture: {
            totalComponents: architecturalStats.totalComponents,
            activeComponents: architecturalStats.activeComponents,
            emergentBehaviors: architecturalStats.emergentBehaviors,
            coherence: architecturalStats.coherence,
            resilience: architecturalStats.resilience,
            autonomyLevel: architecturalStats.autonomyLevel,
            evolutionCount: architecturalStats.evolutionCount,
          },
          performance: {
            processingEfficiency: (cognitiveStats.synergyLevel + architecturalStats.coherence) / 2,
            adaptationCapability: cognitiveStats.learningRate * architecturalStats.autonomyLevel,
            systemResilience: architecturalStats.resilience,
            emergenceLevel: architecturalStats.emergentBehaviors / 10, // Normalized
          },
        },
        timestamp: Date.now(),
      });
      
    } catch (error) {
      log.error('Error getting cognitive monitoring data:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to get cognitive monitoring data',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * Extract pattern suggestions from cognitive response
   */
  private extractPatternSuggestions(response: any): string[] {
    const suggestions: string[] = [];
    
    if (response.synergyLevel > 0.8) {
      suggestions.push('High synergy detected - consider implementing advanced cognitive patterns');
    }
    
    if (response.confidence > 0.9) {
      suggestions.push('High confidence reasoning - suitable for autonomous decision making');
    }
    
    if (response.adaptations && response.adaptations.length > 0) {
      suggestions.push('Adaptation opportunities identified - implement continuous learning');
    }
    
    return suggestions;
  }

  /**
   * Generate optimized dialog flow based on cognitive analysis
   */
  private generateOptimizedFlow(originalFlow: any, optimization: any): any {
    // Simple optimization simulation
    const optimizedFlow = { ...originalFlow };
    
    if (optimization.synergyLevel > 0.7) {
      optimizedFlow.cognitiveEnhancement = {
        synergyBoost: true,
        adaptiveResponses: true,
        contextAwareness: 'enhanced',
      };
    }
    
    if (optimization.confidence > 0.8) {
      optimizedFlow.autonomousDecisions = {
        enabled: true,
        confidenceThreshold: optimization.confidence,
        fallbackStrategy: 'human_review',
      };
    }
    
    return optimizedFlow;
  }

  /**
   * Extract cognitive analysis from response
   */
  private extractCognitiveAnalysis(response: any): any {
    return {
      reasoningPath: response.metadata?.processingPath || [],
      activePatterns: response.metadata?.activePatterns || [],
      cognitiveState: {
        synergyLevel: response.synergyLevel,
        confidence: response.confidence,
        adaptationPotential: response.adaptations?.length || 0,
      },
      insights: {
        processingEfficiency: response.synergyLevel > 0.7 ? 'high' : 'moderate',
        learningOpportunity: response.adaptations?.length > 0 ? 'available' : 'limited',
        autonomyReadiness: response.confidence > 0.8 ? 'ready' : 'needs_supervision',
      },
    };
  }
}

export default new CognitiveOrchestratorController();