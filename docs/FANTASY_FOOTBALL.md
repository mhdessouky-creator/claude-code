# 🏈 Fantasy Football Module Documentation

## Overview

The Fantasy Football Module is a comprehensive analysis tool integrated into the Digital Life AI Agent. It provides intelligent insights and recommendations for fantasy football decision-making.

## Features

### 1. Player Comparison 🆚
Compare multiple players to make start/sit decisions.

**Example Usage:**
```bash
npm run cli task "compare Patrick Mahomes vs Josh Allen for week 12"
npm run cli task "who should I start: Christian McCaffrey or Austin Ekeler?"
```

**Analysis Includes:**
- Recent performance trends
- Target share and usage patterns
- Current week matchup strength
- Ceiling and floor projections
- Comparative scoring

### 2. Lineup Optimization 📊
Optimize your entire lineup based on projections and constraints.

**Example Usage:**
```bash
npm run cli task "optimize my fantasy lineup for this week"
npm run cli task "best lineup for PPR scoring"
```

**Considerations:**
- Player projections and recent performance
- Matchup difficulty and defensive rankings
- Injury status and snap count trends
- Weather conditions for outdoor games
- Scoring format (PPR, Half-PPR, Standard)

### 3. Trade Analysis 🤝
Evaluate trade proposals and get recommendations.

**Example Usage:**
```bash
npm run cli task "should I trade Christian McCaffrey for Justin Jefferson?"
npm run cli task "analyze trade: my Tyreek Hill for Travis Kelce"
```

**Evaluation Factors:**
- Player value comparison
- Team needs assessment
- Playoff schedule strength (weeks 15-17)
- Injury risk evaluation
- Rest of season outlook

### 4. Matchup Analysis 🎯
Analyze specific player matchups against defenses.

**Example Usage:**
```bash
npm run cli task "analyze Josh Allen matchup vs. DAL"
npm run cli task "how does Stefon Diggs perform against KC defense?"
```

**Analysis Includes:**
- Defensive ranking against position
- Recent performance against position
- Expected game script and pace
- Home/away performance splits
- Matchup rating (1-10 scale)

### 5. Injury Impact Assessment 🏥
Understand how injuries affect player values and team dynamics.

**Example Usage:**
```bash
npm run cli task "analyze injury impact for Christian McCaffrey out"
npm run cli task "who benefits from Travis Kelce injury?"
```

**Provides:**
- Injury severity assessment
- Potential beneficiaries identification
- Team offensive impact
- Handcuff recommendations
- Timeline expectations

### 6. Scenario Simulation 🎲
Simulate "what-if" scenarios for lineup decisions.

**Example Usage:**
```bash
npm run cli task "simulate what if I start player A instead of B"
npm run cli task "what are my chances if I bench my QB"
```

**Simulations Include:**
- Best case scenario (ceiling projections)
- Expected case (median projections)
- Worst case scenario (floor projections)
- Probability distributions
- Risk-reward analysis

### 7. Waiver Wire Analysis 📝
Evaluate waiver wire pickups and drops.

**Example Usage:**
```bash
npm run cli task "should I add Raheem Mostert and drop James Conner?"
npm run cli task "waiver wire priority for Gabe Davis"
```

**Evaluation Criteria:**
- Recent performance trends
- Opportunity and role changes
- Upcoming schedule analysis
- Roster fit assessment
- FAAB bid recommendations

### 8. Rest of Season Rankings 📈
Generate rest of season rankings by position.

**Example Usage:**
```bash
npm run cli task "rest of season rankings for RB"
npm run cli task "top ROS WRs for playoffs"
```

**Rankings Consider:**
- Playoff schedule strength (weeks 15-17)
- Injury concerns and durability
- Trending usage patterns
- Top players by position
- Risers and fallers

## Scoring Settings

The module supports customizable scoring settings. Default settings:

```javascript
{
  passingYards: 0.04,    // 1 point per 25 yards
  passingTD: 4,          // 4 points per TD
  passingInt: -2,        // -2 points per INT
  rushingYards: 0.1,     // 1 point per 10 yards
  rushingTD: 6,          // 6 points per TD
  receivingYards: 0.1,   // 1 point per 10 yards
  receivingTD: 6,        // 6 points per TD
  reception: 1,          // 1 point per reception (PPR)
  fumble: -2,            // -2 points per fumble
}
```

## Position Abbreviations

- **QB** - Quarterback
- **RB** - Running Back
- **WR** - Wide Receiver
- **TE** - Tight End
- **FLEX** - Flexible position (RB/WR/TE)
- **DST** - Defense/Special Teams
- **K** - Kicker

## Tips for Best Results

1. **Be Specific**: Include player names, positions, and context
   ```
   ❌ "compare players"
   ✅ "compare Patrick Mahomes vs Josh Allen for week 12"
   ```

2. **Include Scoring Format**: Mention if you use PPR, Half-PPR, or Standard
   ```
   ✅ "optimize my PPR lineup"
   ```

3. **Provide Context**: Include relevant details like injuries, trades, etc.
   ```
   ✅ "analyze trade: my injured Christian McCaffrey for healthy Justin Jefferson"
   ```

4. **Ask Follow-ups**: The agent remembers context, so ask follow-up questions
   ```
   User: "compare Christian McCaffrey vs Austin Ekeler"
   Agent: [provides analysis]
   User: "what if Ekeler is questionable?"
   ```

## Integration with Other Modules

The fantasy football module integrates seamlessly with other agent capabilities:

- **Web Search**: Can fetch latest news and injury updates
- **Scheduling**: Set up weekly lineup optimization reminders
- **Memory**: Remembers your team composition and preferences

## Example Workflows

### Weekly Lineup Decision
```bash
# 1. Check injury reports
npm run cli task "latest injury updates for my players"

# 2. Compare players at same position
npm run cli task "compare my RBs for best starts"

# 3. Optimize full lineup
npm run cli task "optimize my PPR lineup for week 12"
```

### Trade Evaluation
```bash
# 1. Analyze the trade
npm run cli task "analyze trade: my McCaffrey for Jefferson"

# 2. Check ROS rankings
npm run cli task "ROS rankings for RB and WR"

# 3. Get final recommendation
npm run cli task "should I accept this trade?"
```

### Waiver Wire Planning
```bash
# 1. Identify needs
npm run cli task "what positions do I need help at?"

# 2. Analyze pickups
npm run cli task "waiver priority for top RB pickups"

# 3. Make decision
npm run cli task "add Raheem Mostert drop James Conner"
```

## Advanced Features (Coming Soon)

- Real-time data integration with fantasy platforms
- Historical player performance analysis
- Advanced statistical modeling
- Playoff bracket simulations
- Draft assistance and mock draft analysis
- Dynasty league support

## Troubleshooting

**Q: The analysis doesn't include specific player stats**
A: The current version uses analytical frameworks. For real-time stats, ensure web search is enabled.

**Q: How do I customize scoring settings?**
A: Scoring settings can be customized in the module configuration. Contact support for custom setups.

**Q: Can it connect to my fantasy league?**
A: Direct league integration is planned for future releases. Currently works with manual input.

## Support

For questions, issues, or feature requests:
1. Check the [main documentation](../README.md)
2. Review [examples](../examples/)
3. Open an issue on GitHub

---

**Happy Fantasy Football Season! 🏈🏆**
