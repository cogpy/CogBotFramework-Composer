// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * OpenCog Type Definitions for Bot Framework Composer Integration
 */

export interface OpenCogRequest {
  type: string;
  input?: any;
  options?: OpenCogOptions;
  timestamp: number;
}

export interface OpenCogResponse {
  success: boolean;
  result?: any;
  error?: string;
  message?: string;
  confidence?: number;
  synergyLevel?: number;
  processingTime?: number;
  timestamp: number;
}

export interface OpenCogOptions {
  enableLearning?: boolean;
  adaptationThreshold?: number;
  synergyThreshold?: number;
  autonomousMode?: boolean;
  maxProcessingTime?: number;
}

export interface CognitiveInsights {
  reasoningPath: string[];
  activePatterns: string[];
  cognitiveState: {
    synergyLevel: number;
    confidence: number;
    adaptationPotential: number;
  };
  insights: {
    processingEfficiency: 'high' | 'moderate' | 'low';
    learningOpportunity: 'available' | 'limited' | 'none';
    autonomyReadiness: 'ready' | 'needs_supervision' | 'not_ready';
  };
}

export interface OrchestrationRecommendations {
  cognitiveInsights: string;
  suggestedPatterns: string[];
  optimizationOpportunities: string[];
  synergyScore: number;
  confidence: number;
  processingPath: string[];
}

export interface DialogOptimization {
  recommendedFlow: any;
  cognitiveReasoning: string;
  improvementAreas: string[];
  synergyLevel: number;
  confidence: number;
  activePatterns: string[];
}

export interface AdaptiveResponse {
  generatedText: string;
  cognitiveAnalysis: CognitiveInsights;
  adaptationLevel: number;
  confidence: number;
  learningInsights: string[];
}

export interface CognitiveMonitoring {
  cognitive: {
    totalNodes: number;
    activeNodes: number;
    synergyLevel: number;
    learningRate: number;
    averageEffectiveness: number;
  };
  architecture: {
    totalComponents: number;
    activeComponents: number;
    emergentBehaviors: number;
    coherence: number;
    resilience: number;
    autonomyLevel: number;
    evolutionCount: number;
  };
  performance: {
    processingEfficiency: number;
    adaptationCapability: number;
    systemResilience: number;
    emergenceLevel: number;
  };
}

export interface OpenCogConfiguration {
  autonomousMode?: boolean;
  learningEnabled?: boolean;
  adaptationThreshold?: number;
  synergyThreshold?: number;
  autogenesisEnabled?: boolean;
}

export interface CognitivePatternDefinition {
  id: string;
  name: string;
  description: string;
  nodes: any[];
  links: any[];
  activationThreshold: number;
  synergyScore: number;
}

/**
 * Utility type for OpenCog event emissions
 */
export interface OpenCogEvent {
  type: 'cognition' | 'architecture_evolution' | 'emergent_behavior_detected' | 'pattern_added' | 'agent_goal_completed';
  data: any;
  timestamp: number;
}

/**
 * Health check response for OpenCog integration
 */
export interface OpenCogHealthCheck {
  version: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ERROR';
  capabilities: Record<string, string>;
  components: Record<string, 'ACTIVE' | 'INACTIVE' | 'ERROR'>;
  timestamp: number;
}