import { test, describe } from 'node:test';
import assert from 'node:assert';

/**
 * Tests for Fantasy Football Module
 */

describe('Fantasy Football Module Tests', () => {
  let FantasyFootballModule;
  let mockAgent;

  // Setup before tests
  test('can import fantasy football module', async () => {
    try {
      const module = await import('../src/modules/fantasy-football.js');
      FantasyFootballModule = module.FantasyFootballModule;
      assert.ok(FantasyFootballModule, 'FantasyFootballModule should be importable');
    } catch (error) {
      assert.fail(`Module import failed: ${error.message}`);
    }
  });

  test('can create fantasy football module instance', () => {
    mockAgent = {
      memory: {
        saveTask: async () => {},
        getPreference: async () => null,
      },
    };

    const ffModule = new FantasyFootballModule(mockAgent);
    assert.ok(ffModule, 'Module instance should be created');
    assert.ok(ffModule.scoringSettings, 'Should have scoring settings');
    assert.equal(ffModule.scoringSettings.passingTD, 4, 'Should have correct default scoring');
  });

  describe('Action Detection', () => {
    let ffModule;

    test('setup module for action detection tests', () => {
      ffModule = new FantasyFootballModule(mockAgent);
      assert.ok(ffModule, 'Module should be ready for testing');
    });

    test('detects player comparison requests', () => {
      const action = ffModule._determineAction('compare Patrick Mahomes vs Josh Allen');
      assert.equal(action, 'compare', 'Should detect comparison action');
    });

    test('detects lineup optimization requests', () => {
      const action = ffModule._determineAction('optimize my lineup for week 12');
      assert.equal(action, 'optimize', 'Should detect optimization action');
    });

    test('detects trade analysis requests', () => {
      const action = ffModule._determineAction('should I trade my RB for a WR');
      assert.equal(action, 'analyze_trade', 'Should detect trade analysis action');
    });

    test('detects matchup analysis requests', () => {
      const action = ffModule._determineAction('analyze matchup for player against defense');
      assert.equal(action, 'matchup', 'Should detect matchup action');
    });

    test('detects injury impact requests', () => {
      const action = ffModule._determineAction('what is the injury impact for player');
      assert.equal(action, 'injury_impact', 'Should detect injury impact action');
    });

    test('detects scenario simulation requests', () => {
      const action = ffModule._determineAction('simulate what if scenario');
      assert.equal(action, 'scenario', 'Should detect scenario action');
    });

    test('detects waiver wire requests', () => {
      const action = ffModule._determineAction('should I add this player on waivers');
      assert.equal(action, 'waiver', 'Should detect waiver action');
    });

    test('detects ROS ranking requests', () => {
      const action = ffModule._determineAction('rest of season rankings for RBs');
      assert.equal(action, 'ros_ranking', 'Should detect ROS ranking action');
    });
  });

  describe('Player Comparison', () => {
    let ffModule;

    test('setup module for comparison tests', () => {
      ffModule = new FantasyFootballModule(mockAgent);
      assert.ok(ffModule);
    });

    test('handles comparison with insufficient players', async () => {
      const result = await ffModule._comparePlayers({
        description: 'compare Josh Allen',
      });

      assert.equal(result.success, false, 'Should fail with only one player');
      assert.ok(result.message.includes('at least 2 players'), 'Should have appropriate error message');
    });

    test('successfully compares multiple players', async () => {
      const result = await ffModule._comparePlayers({
        description: 'compare Patrick Mahomes vs Josh Allen',
      });

      assert.equal(result.success, true, 'Should succeed with multiple players');
      assert.ok(result.comparison, 'Should have comparison data');
      assert.ok(result.recommendation, 'Should have recommendation');
    });
  });

  describe('Position Extraction', () => {
    let ffModule;

    test('setup module for position extraction tests', () => {
      ffModule = new FantasyFootballModule(mockAgent);
      assert.ok(ffModule);
    });

    test('extracts QB position', () => {
      const position = ffModule._extractPosition('rank the top QBs');
      assert.equal(position, 'QB', 'Should extract QB position');
    });

    test('extracts RB position', () => {
      const position = ffModule._extractPosition('best RB rankings');
      assert.equal(position, 'RB', 'Should extract RB position');
    });

    test('extracts WR position', () => {
      const position = ffModule._extractPosition('WR rest of season');
      assert.equal(position, 'WR', 'Should extract WR position');
    });

    test('extracts TE position', () => {
      const position = ffModule._extractPosition('tight end rankings TE');
      assert.equal(position, 'TE', 'Should extract TE position');
    });

    test('defaults to ALL for unknown position', () => {
      const position = ffModule._extractPosition('overall rankings');
      assert.equal(position, 'ALL', 'Should default to ALL position');
    });
  });

  describe('Injury Severity Detection', () => {
    let ffModule;

    test('setup module for injury tests', () => {
      ffModule = new FantasyFootballModule(mockAgent);
      assert.ok(ffModule);
    });

    test('detects OUT status', () => {
      const severity = ffModule._extractInjurySeverity('player is out for the game');
      assert.equal(severity, 'OUT', 'Should detect OUT status');
    });

    test('detects DOUBTFUL status', () => {
      const severity = ffModule._extractInjurySeverity('player is doubtful to play');
      assert.equal(severity, 'DOUBTFUL', 'Should detect DOUBTFUL status');
    });

    test('detects QUESTIONABLE status', () => {
      const severity = ffModule._extractInjurySeverity('player is questionable');
      assert.equal(severity, 'QUESTIONABLE', 'Should detect QUESTIONABLE status');
    });

    test('defaults to UNKNOWN for unclear status', () => {
      const severity = ffModule._extractInjurySeverity('player might be injured');
      assert.equal(severity, 'UNKNOWN', 'Should default to UNKNOWN');
    });
  });

  describe('Lineup Optimization', () => {
    let ffModule;

    test('setup module for lineup tests', () => {
      ffModule = new FantasyFootballModule(mockAgent);
      assert.ok(ffModule);
    });

    test('successfully optimizes lineup', async () => {
      const result = await ffModule._optimizeLineup({
        description: 'optimize my lineup for this week',
      });

      assert.equal(result.success, true, 'Should succeed');
      assert.ok(result.lineup, 'Should have lineup data');
      assert.ok(result.lineup.insights, 'Should have insights');
      assert.ok(Array.isArray(result.lineup.insights), 'Insights should be an array');
    });
  });

  describe('Trade Analysis', () => {
    let ffModule;

    test('setup module for trade tests', () => {
      ffModule = new FantasyFootballModule(mockAgent);
      assert.ok(ffModule);
    });

    test('analyzes trade scenario', async () => {
      const result = await ffModule._analyzeTrade({
        description: 'trade Christian McCaffrey for Justin Jefferson',
      });

      assert.equal(result.success, true, 'Should succeed');
      assert.ok(result.analysis, 'Should have analysis');
      assert.ok(result.analysis.verdict, 'Should have verdict');
      assert.ok(Array.isArray(result.analysis.factors), 'Should have factors array');
    });
  });

  describe('Matchup Analysis', () => {
    let ffModule;

    test('setup module for matchup tests', () => {
      ffModule = new FantasyFootballModule(mockAgent);
      assert.ok(ffModule);
    });

    test('analyzes player matchup', async () => {
      const result = await ffModule._analyzeMatchup({
        description: 'Josh Allen vs DAL this week',
      });

      assert.equal(result.success, true, 'Should succeed');
      assert.ok(result.analysis, 'Should have analysis');
      assert.ok(result.analysis.rating, 'Should have rating');
    });

    test('extracts opponent correctly', () => {
      const opponent1 = ffModule._extractOpponent('player vs. DAL');
      assert.equal(opponent1, 'DAL', 'Should extract opponent with vs.');

      const opponent2 = ffModule._extractOpponent('player @ KC');
      assert.equal(opponent2, 'KC', 'Should extract opponent with @');
    });
  });

  describe('Waiver Wire Analysis', () => {
    let ffModule;

    test('setup module for waiver tests', () => {
      ffModule = new FantasyFootballModule(mockAgent);
      assert.ok(ffModule);
    });

    test('analyzes waiver pickup', async () => {
      const result = await ffModule._analyzeWaiverPick({
        description: 'should I add Tyreek Hill and drop Michael Thomas',
      });

      assert.equal(result.success, true, 'Should succeed');
      assert.ok(result.analysis, 'Should have analysis');
      assert.ok(result.analysis.priority, 'Should have priority recommendation');
      assert.ok(Array.isArray(result.analysis.rationale), 'Should have rationale array');
    });
  });

  describe('ROS Rankings', () => {
    let ffModule;

    test('setup module for ROS tests', () => {
      ffModule = new FantasyFootballModule(mockAgent);
      assert.ok(ffModule);
    });

    test('generates ROS rankings', async () => {
      const result = await ffModule._generateROSRankings({
        description: 'rest of season rankings for RB',
      });

      assert.equal(result.success, true, 'Should succeed');
      assert.ok(result.rankings, 'Should have rankings');
      assert.ok(Array.isArray(result.rankings.insights), 'Should have insights array');
    });
  });

  describe('Injury Impact Analysis', () => {
    let ffModule;

    test('setup module for injury impact tests', () => {
      ffModule = new FantasyFootballModule(mockAgent);
      assert.ok(ffModule);
    });

    test('analyzes injury impact', async () => {
      const result = await ffModule._analyzeInjuryImpact({
        description: 'Christian McCaffrey is out with injury',
      });

      assert.equal(result.success, true, 'Should succeed');
      assert.ok(result.analysis, 'Should have analysis');
      assert.ok(Array.isArray(result.analysis.recommendations), 'Should have recommendations');
    });
  });

  describe('Scenario Simulation', () => {
    let ffModule;

    test('setup module for scenario tests', () => {
      ffModule = new FantasyFootballModule(mockAgent);
      assert.ok(ffModule);
    });

    test('simulates scenario', async () => {
      const result = await ffModule._simulateScenario({
        description: 'simulate what if I start player A instead of B',
      });

      assert.equal(result.success, true, 'Should succeed');
      assert.ok(result.simulation, 'Should have simulation');
      assert.ok(Array.isArray(result.simulation.outcomes), 'Should have outcomes array');
      assert.ok(result.simulation.recommendation, 'Should have recommendation');
    });
  });
});

describe('Integration with Task Executor', () => {
  test('executor can detect fantasy football tasks', async () => {
    try {
      const { TaskExecutor } = await import('../src/core/executor.js');
      const mockAgent = {
        memory: {
          saveTask: async () => {},
        },
      };

      const executor = new TaskExecutor(mockAgent);

      const taskType = executor._determineTaskType({
        description: 'compare fantasy football players',
      });

      assert.equal(taskType, 'fantasy-football', 'Executor should route fantasy tasks correctly');
    } catch (error) {
      assert.fail(`Integration test failed: ${error.message}`);
    }
  });
});

console.log('Running Fantasy Football Module tests...');
