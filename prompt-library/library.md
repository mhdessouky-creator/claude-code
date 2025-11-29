# 📚 Prompt Library - مكتبة Prompts الشاملة

## 🎯 Purpose
مكتبة شاملة من الـ prompts لاستخدام جميع الأدوات والخدمات المتاحة عبر MCP servers

---

## 📧 Gmail & Email Management

### Send Important Email
```
Send an email to [recipient@example.com] with subject "[subject]" and the following content:
[email body]

Use Gmail to ensure delivery and track if it was sent successfully.
```

### Check Unread Emails
```
Check my unread emails and summarize the most important ones.
Focus on emails from [specific sender] or about [specific topic].
```

### Search Emails by Topic
```
Search my Gmail for all emails related to [topic] from the last [timeframe].
Provide a summary of the key points discussed.
```

---

## 📅 Calendar & Scheduling

### Create Meeting
```
Create a calendar event for [date and time] titled "[meeting title]".
Add [attendee1@example.com, attendee2@example.com] as attendees.
Include this description: [meeting description]
Set location to [location or Zoom/Meet link]
```

### Check Today's Schedule
```
Show me all my calendar events for today and summarize what I have scheduled.
Highlight any conflicts or back-to-back meetings.
```

### Find Available Time Slots
```
Check my calendar and find available 1-hour time slots this week between 9 AM and 5 PM.
I need to schedule a meeting with [person/team].
```

---

## 📁 Google Drive & File Management

### Search for Files
```
Search my Google Drive for files related to [topic/keyword].
Show me the most recent files and their locations.
```

### Create and Share Document
```
Create a new Google Doc titled "[title]" with the following content:
[content]

Share it with [email] with [view/edit] permissions.
```

### Organize Files
```
Find all files in my Drive related to [project name] and list them.
Help me organize them into appropriate folders.
```

---

## 📊 Google Sheets & Data Management

### Create Spreadsheet
```
Create a new Google Sheet titled "[title]" with these columns:
[column1, column2, column3, ...]

Populate it with this data:
[provide data or format]
```

### Analyze Sheet Data
```
Read the data from this Google Sheet: [sheet_id]
Analyze it and provide insights about [specific aspect].
```

### Update Sheet
```
Add these rows to my Google Sheet [sheet_id]:
[provide data rows]
```

---

## 📝 Notion & Note-Taking

### Create Notion Page
```
Create a new Notion page in [database/parent] with title "[title]".
Add these properties:
- Status: [status]
- Priority: [priority]
- Tags: [tags]

Content:
[page content]
```

### Search Notion
```
Search my Notion workspace for information about [topic].
Show me all relevant pages and summarize key information.
```

### Update Notion Database
```
Add a new entry to my [database name] in Notion with:
- [property1]: [value1]
- [property2]: [value2]
```

---

## 📋 Airtable & Database Operations

### Add Record
```
Add a new record to my Airtable base [base_name] in table [table_name]:
- [field1]: [value1]
- [field2]: [value2]
- [field3]: [value3]
```

### Query Airtable
```
Search my Airtable table [table_name] for records where [field] equals [value].
Show me all matching records.
```

### Batch Update
```
Update all records in [table_name] where [condition] to set [field] to [new_value].
```

---

## 💬 Telegram Bot

### Send Telegram Message
```
Send a message to Telegram chat [chat_id]:
[message content]
```

### Send Telegram Alert
```
Send an urgent notification to my Telegram about:
[alert content]

Include relevant details and action items.
```

### Send Media
```
Send this [image/document/video] to Telegram chat [chat_id] with caption:
[caption]
```

---

## 📱 WhatsApp Business

### Send WhatsApp Message
```
Send a WhatsApp message to [phone_number]:
[message content]
```

### Send WhatsApp Template
```
Send WhatsApp template "[template_name]" to [phone_number] with these parameters:
[parameter values]
```

### Send Interactive Message
```
Send an interactive WhatsApp message to [phone_number] with:
- Text: [message]
- Buttons: [button1, button2, button3]
```

---

## 🐦 X (Twitter)

### Post Tweet
```
Post a tweet:
[tweet content - max 280 characters]

[Optional: Include image/media]
```

### Thread Creation
```
Create a Twitter thread about [topic]:

1. [First tweet]
2. [Second tweet]
3. [Third tweet]
...
```

### Search Twitter
```
Search Twitter for tweets about [topic] from the last [timeframe].
Summarize the key discussions and trends.
```

### Engage with Tweet
```
Reply to tweet [tweet_id] with:
[reply content]
```

---

## 🔴 Reddit

### Post to Subreddit
```
Post to r/[subreddit] with title "[title]":
[post content]
```

### Search Reddit
```
Search r/[subreddit] for posts about [topic].
Show me the top posts and key discussions.
```

### Monitor Subreddit
```
Get the hot posts from r/[subreddit] and summarize what's trending.
Focus on posts related to [specific topic].
```

---

## 📂 Filesystem Operations

### Read File
```
Read the file at [file_path] and show me its contents.
```

### Create File
```
Create a new file at [file_path] with this content:
[content]
```

### Search Files
```
Search for files matching pattern [*.js, *.py, etc.] in [directory].
List all matches.
```

### Organize Files
```
List all files in [directory] and help me organize them by [criteria].
```

---

## 🔄 Multi-Tool Workflows

### Daily Briefing
```
Create my daily briefing:
1. Check unread emails (Gmail)
2. Show today's calendar events
3. List pending tasks from Notion
4. Summarize trending topics from Reddit/Twitter
```

### Project Setup
```
Set up a new project called "[project_name]":
1. Create a Notion page for project tracking
2. Create a Google Sheet for data collection
3. Create a Telegram group notification
4. Set up a GitHub repository (if applicable)
```

### Content Distribution
```
I have this content: [content]

Please distribute it:
1. Post as a tweet thread on Twitter
2. Share in relevant subreddit r/[subreddit]
3. Send to Telegram channel
4. Save to Notion for reference
```

### Research & Compile
```
Research [topic]:
1. Search Twitter for recent discussions
2. Find top Reddit posts
3. Search my Gmail for related emails
4. Check my Google Drive for relevant documents
5. Compile findings in a Google Doc
```

### Weekly Report
```
Generate my weekly report:
1. Summarize calendar events from the past week
2. List completed tasks from Notion
3. Analyze email activity from Gmail
4. Compile social media engagement (Twitter, Reddit)
5. Create a summary document in Google Docs
```

---

## 🔧 Automation Examples

### Auto-Save Important Emails
```
Monitor my Gmail for emails from [important contacts].
When found, save them to:
- Notion database
- Google Drive folder
- Send summary to Telegram
```

### Social Media Scheduler
```
Schedule this content for posting:
- Twitter: [content adapted for Twitter]
- Reddit: [content adapted for Reddit]
- Save original in Notion

Post at optimal times based on engagement history.
```

### Task Tracker Sync
```
Sync tasks between:
- Notion database
- Google Tasks
- Airtable tracker

Ensure consistency across all platforms.
```

---

## 💡 Best Practices

### Clear Instructions
```
When giving instructions:
- Be specific about which service to use
- Provide exact IDs, emails, or identifiers
- Specify desired format for results
- Include error handling preferences
```

### Data Privacy
```
- Never share sensitive credentials in prompts
- Use environment variables for API keys
- Be cautious with personal information
- Review output before sharing
```

### Optimization
```
- Batch similar operations together
- Use appropriate tools for each task
- Leverage parallel execution when possible
- Cache frequently accessed data
```

---

## 🎓 Advanced Prompts

### AI-Powered Content Creation
```
Using all available tools:
1. Research [topic] from Twitter, Reddit, and my saved documents
2. Generate comprehensive content
3. Save draft to Google Docs
4. Create summary for social media
5. Schedule distribution across platforms
```

### Automated Reporting
```
Create a comprehensive report on [topic/project]:
1. Gather data from Airtable
2. Analyze trends from Google Sheets
3. Include relevant emails from Gmail
4. Reference Notion documentation
5. Compile in formatted Google Doc
6. Share via Telegram with stakeholders
```

### Cross-Platform Monitoring
```
Monitor mentions of [keyword/topic] across:
- Twitter (recent tweets)
- Reddit (relevant subreddits)
- Gmail (incoming emails)

Send digest to Telegram every [timeframe].
```

---

## 📖 Template Prompts

### Meeting Follow-up
```
After my meeting about [topic]:
1. Create follow-up tasks in Notion
2. Send summary email via Gmail to attendees
3. Update project status in Airtable
4. Schedule next meeting in Calendar
5. Archive notes in Google Drive
```

### Content Pipeline
```
For content piece "[title]":
1. Draft in Google Docs
2. Review and edit
3. Create social media versions
4. Schedule Twitter thread
5. Post to relevant subreddit
6. Share in Telegram channel
7. Track engagement in Airtable
```

---

**🎯 الهدف النهائي:** استخدم هذه المكتبة لتعظيم الإنتاجية وأتمتة المهام المتكررة!
