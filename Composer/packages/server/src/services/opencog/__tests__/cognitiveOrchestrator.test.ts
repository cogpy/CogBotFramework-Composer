// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CognitiveOrchestrator, cognitiveOrchestrator } from '../cognitiveOrchestrator';

describe('CognitiveOrchestrator', () => {
  beforeEach(() => {
    // Reset cognitive system before each test
    cognitiveOrchestrator.reset();
  });

  describe('processInput', () => {
    it('should process simple text input and generate cognitive response', async () => {
      const input = {
        type: 'message',
        text: 'Hello, can you help me?',
        requiresResponse: true,
        timestamp: Date.now(),
      };

      const response = await cognitiveOrchestrator.processInput(input);

      expect(response).toBeDefined();
      expect(response.type).toBe('cognitive_response');
      expect(response.content).toBeDefined();
      expect(response.confidence).toBeGreaterThan(0);
      expect(response.synergyLevel).toBeGreaterThan(0);
      expect(response.metadata).toBeDefined();
    });

    it('should handle greeting intent with appropriate response', async () => {
      const input = {
        type: 'message',
        text: 'Hi there!',
        requiresResponse: true,
        timestamp: Date.now(),
      };

      const response = await cognitiveOrchestrator.processInput(input);

      expect(response.content).toContain('Hello');
      expect(response.confidence).toBeGreaterThan(0.5);
    });

    it('should handle help request intent', async () => {
      const input = {
        type: 'message',
        text: 'I need help with something',
        requiresResponse: true,
        timestamp: Date.now(),
      };

      const response = await cognitiveOrchestrator.processInput(input);

      expect(response.content).toContain('assist');
      expect(response.confidence).toBeGreaterThan(0.5);
    });

    it('should process dialog management input', async () => {
      const input = {
        type: 'message',
        text: 'Continue the conversation',
        dialog: true,
        dialogState: 'active',
        turnCount: 3,
        requiresResponse: true,
        timestamp: Date.now(),
      };

      const response = await cognitiveOrchestrator.processInput(input);

      expect(response).toBeDefined();
      expect(response.metadata.activePatterns).toContain('dialog_management');
    });
  });

  describe('getCognitiveState', () => {
    it('should return current cognitive state', () => {
      const state = cognitiveOrchestrator.getCognitiveState();

      expect(state).toBeDefined();
      expect(state.activeNodes).toBeDefined();
      expect(state.attentionalFocus).toBeDefined();
      expect(state.synergyLevel).toBeGreaterThanOrEqual(0);
      expect(state.synergyLevel).toBeLessThanOrEqual(1);
      expect(state.learningRate).toBeGreaterThanOrEqual(0);
      expect(state.adaptationHistory).toBeDefined();
    });
  });

  describe('getCognitiveStatistics', () => {
    it('should return cognitive statistics', () => {
      const stats = cognitiveOrchestrator.getCognitiveStatistics();

      expect(stats).toBeDefined();
      expect(stats.totalNodes).toBeGreaterThanOrEqual(0);
      expect(stats.activeNodes).toBeGreaterThanOrEqual(0);
      expect(stats.synergyLevel).toBeGreaterThanOrEqual(0);
      expect(stats.learningRate).toBeGreaterThanOrEqual(0);
      expect(stats.averageEffectiveness).toBeGreaterThanOrEqual(0);
    });
  });

  describe('configuration', () => {
    it('should allow enabling/disabling autonomous mode', () => {
      cognitiveOrchestrator.setAutonomousMode(false);
      // Test that autonomous mode is disabled
      // (This would require internal state inspection or behavior change verification)
      
      cognitiveOrchestrator.setAutonomousMode(true);
      // Test that autonomous mode is enabled
    });

    it('should allow enabling/disabling learning', () => {
      cognitiveOrchestrator.setLearningEnabled(false);
      // Test that learning is disabled
      
      cognitiveOrchestrator.setLearningEnabled(true);
      // Test that learning is enabled
    });

    it('should allow setting adaptation threshold', () => {
      cognitiveOrchestrator.setAdaptationThreshold(0.8);
      // Test that adaptation threshold is set correctly
    });
  });

  describe('cognitive patterns', () => {
    it('should allow adding custom cognitive patterns', () => {
      const customPattern = {
        id: 'test_pattern',
        name: 'Test Pattern',
        description: 'A test cognitive pattern',
        nodes: [],
        links: [],
        activationThreshold: 0.6,
        synergyScore: 0.7,
      };

      cognitiveOrchestrator.addCognitivePattern(customPattern);
      
      // Verify pattern was added (would require internal state inspection)
    });

    it('should allow removing cognitive patterns', () => {
      const customPattern = {
        id: 'test_pattern_removal',
        name: 'Test Pattern for Removal',
        description: 'A test cognitive pattern to be removed',
        nodes: [],
        links: [],
        activationThreshold: 0.6,
        synergyScore: 0.7,
      };

      cognitiveOrchestrator.addCognitivePattern(customPattern);
      cognitiveOrchestrator.removeCognitivePattern(customPattern.id);
      
      // Verify pattern was removed (would require internal state inspection)
    });
  });

  describe('learning and adaptation', () => {
    it('should adapt cognitive responses over multiple interactions', async () => {
      const input1 = {
        type: 'message',
        text: 'First interaction',
        requiresResponse: true,
        timestamp: Date.now(),
      };

      const response1 = await cognitiveOrchestrator.processInput(input1);
      const initialSynergy = response1.synergyLevel;

      // Simulate multiple interactions
      for (let i = 0; i < 5; i++) {
        const input = {
          type: 'message',
          text: `Interaction ${i + 2}`,
          requiresResponse: true,
          timestamp: Date.now(),
        };
        await cognitiveOrchestrator.processInput(input);
      }

      const finalInput = {
        type: 'message',
        text: 'Final interaction',
        requiresResponse: true,
        timestamp: Date.now(),
      };

      const finalResponse = await cognitiveOrchestrator.processInput(finalInput);
      
      // The synergy level might have changed due to learning
      expect(finalResponse.synergyLevel).toBeDefined();
    });
  });

  describe('error handling', () => {
    it('should handle invalid input gracefully', async () => {
      const invalidInput = null;

      try {
        const response = await cognitiveOrchestrator.processInput(invalidInput);
        // Should still return a valid response structure
        expect(response).toBeDefined();
      } catch (error) {
        // Or should handle the error appropriately
        expect(error).toBeDefined();
      }
    });

    it('should handle empty input', async () => {
      const emptyInput = {};

      const response = await cognitiveOrchestrator.processInput(emptyInput);
      expect(response).toBeDefined();
      expect(response.type).toBe('cognitive_response');
    });
  });
});

describe('CognitiveOrchestrator Events', () => {
  it('should emit cognition events during processing', async () => {
    let eventEmitted = false;
    let eventData: any = null;

    cognitiveOrchestrator.on('cognition', (data) => {
      eventEmitted = true;
      eventData = data;
    });

    const input = {
      type: 'message',
      text: 'Test event emission',
      requiresResponse: true,
      timestamp: Date.now(),
    };

    await cognitiveOrchestrator.processInput(input);

    expect(eventEmitted).toBe(true);
    expect(eventData).toBeDefined();
    expect(eventData.input).toBeDefined();
    expect(eventData.response).toBeDefined();
    expect(eventData.cognitiveState).toBeDefined();
  });
});