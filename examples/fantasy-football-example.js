/**
 * Fantasy Football Module Example
 * Demonstrates various fantasy football analysis capabilities
 */

import { AIAgent } from '../src/core/agent.js';

async function runFantasyFootballExamples() {
  console.log('🏈 Fantasy Football Module Examples\n');

  // Initialize the AI Agent
  const agent = new AIAgent({
    apiKey: process.env.ANTHROPIC_API_KEY,
    name: 'Fantasy Football Assistant',
  });

  await agent.initialize();

  try {
    // Example 1: Player Comparison
    console.log('📊 Example 1: Player Comparison');
    console.log('━'.repeat(50));
    const comparison = await agent.executeTask(
      'compare Patrick Mahomes vs Josh Allen for this week'
    );
    console.log('Result:', JSON.stringify(comparison, null, 2));
    console.log('\n');

    // Example 2: Lineup Optimization
    console.log('⚡ Example 2: Lineup Optimization');
    console.log('━'.repeat(50));
    const lineup = await agent.executeTask(
      'optimize my PPR fantasy lineup for week 12'
    );
    console.log('Result:', JSON.stringify(lineup, null, 2));
    console.log('\n');

    // Example 3: Trade Analysis
    console.log('🤝 Example 3: Trade Analysis');
    console.log('━'.repeat(50));
    const trade = await agent.executeTask(
      'should I trade Christian McCaffrey for Justin Jefferson?'
    );
    console.log('Result:', JSON.stringify(trade, null, 2));
    console.log('\n');

    // Example 4: Matchup Analysis
    console.log('🎯 Example 4: Matchup Analysis');
    console.log('━'.repeat(50));
    const matchup = await agent.executeTask(
      'analyze Josh Allen matchup vs DAL this week'
    );
    console.log('Result:', JSON.stringify(matchup, null, 2));
    console.log('\n');

    // Example 5: Injury Impact
    console.log('🏥 Example 5: Injury Impact Analysis');
    console.log('━'.repeat(50));
    const injury = await agent.executeTask(
      'analyze injury impact for Christian McCaffrey out this week'
    );
    console.log('Result:', JSON.stringify(injury, null, 2));
    console.log('\n');

    // Example 6: Waiver Wire
    console.log('📝 Example 6: Waiver Wire Analysis');
    console.log('━'.repeat(50));
    const waiver = await agent.executeTask(
      'should I add Raheem Mostert and drop James Conner on waivers?'
    );
    console.log('Result:', JSON.stringify(waiver, null, 2));
    console.log('\n');

    // Example 7: ROS Rankings
    console.log('📈 Example 7: Rest of Season Rankings');
    console.log('━'.repeat(50));
    const rankings = await agent.executeTask(
      'rest of season rankings for RB position'
    );
    console.log('Result:', JSON.stringify(rankings, null, 2));
    console.log('\n');

    // Example 8: Scenario Simulation
    console.log('🎲 Example 8: Scenario Simulation');
    console.log('━'.repeat(50));
    const scenario = await agent.executeTask(
      'simulate what if I start Derrick Henry instead of Tony Pollard'
    );
    console.log('Result:', JSON.stringify(scenario, null, 2));
    console.log('\n');

    // Example 9: Interactive Conversation
    console.log('💬 Example 9: Interactive Conversation');
    console.log('━'.repeat(50));

    const msg1 = await agent.processMessage(
      'I need help deciding between two RBs'
    );
    console.log('User: I need help deciding between two RBs');
    console.log('Agent:', msg1.response);
    console.log('\n');

    const msg2 = await agent.processMessage(
      'Austin Ekeler vs Rhamondre Stevenson, PPR league'
    );
    console.log('User: Austin Ekeler vs Rhamondre Stevenson, PPR league');
    console.log('Agent:', msg2.response);
    console.log('\n');

    // Example 10: Weekly Workflow
    console.log('🗓️ Example 10: Complete Weekly Workflow');
    console.log('━'.repeat(50));

    console.log('Step 1: Check injury reports');
    const injuries = await agent.executeTask(
      'what are the injury concerns for my players this week?'
    );
    console.log('Result:', JSON.stringify(injuries, null, 2));

    console.log('\nStep 2: Analyze matchups');
    const matchups = await agent.executeTask(
      'analyze matchups for all my starting players'
    );
    console.log('Result:', JSON.stringify(matchups, null, 2));

    console.log('\nStep 3: Optimize lineup');
    const finalLineup = await agent.executeTask(
      'optimize my final lineup with all this information'
    );
    console.log('Result:', JSON.stringify(finalLineup, null, 2));

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await agent.shutdown();
    console.log('\n✅ Examples completed!');
  }
}

// Run examples if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runFantasyFootballExamples().catch(console.error);
}

export { runFantasyFootballExamples };
