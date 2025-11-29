# 🔌 MCP Integration Guide - دليل تكامل MCP

## ما هو MCP؟

**MCP (Model Context Protocol)** هو بروتوكول يسمح للـ AI Agent بالاتصال بخوادم خارجية للوصول إلى أدوات وقدرات إضافية.

## ✨ الميزات

- 🔌 الاتصال بـ MCP servers خارجية
- 🛠️ الوصول لأدوات إضافية
- 💾 حفظ إعدادات الخوادم
- 🔍 اكتشاف الأدوات المتاحة
- ⚙️ إدارة سهلة عبر CLI

## 🚀 البدء السريع

### 1. إضافة MCP Server

```bash
# إضافة server بدون token
npm run cli mcp:add example-server https://example-server.modelcontextprotocol.io/sse

# إضافة server مع token
npm run cli mcp:add my-server https://api.example.com/mcp --token YOUR_TOKEN
```

### 2. عرض الخوادم المضافة

```bash
npm run cli mcp:list
```

الناتج:
```
🔌 MCP Servers

Total: 2
Enabled: 2
Disabled: 0

Servers:
  ✓ example-server
    https://example-server.modelcontextprotocol.io/sse
    Type: url
  ✓ my-server
    https://api.example.com/mcp
    Type: url
```

### 3. اكتشاف الأدوات المتاحة

```bash
npm run cli mcp:discover
```

سيظهر جميع الأدوات المتاحة من الخوادم المضافة.

### 4. حذف Server

```bash
npm run cli mcp:remove example-server
```

## 💻 الاستخدام البرمجي

### إضافة Server

```javascript
import { AIAgent } from './src/index.js';

const agent = new AIAgent();
await agent.initialize();

// إضافة server
await agent.addMCPServer({
  name: 'my-mcp-server',
  url: 'https://example.com/mcp',
  type: 'url',
  authorization_token: 'YOUR_TOKEN' // اختياري
});
```

### استخدام الوكيل مع MCP

```javascript
// MCP يُستخدم تلقائياً عند وجود servers مضافة
const response = await agent.processMessage(
  'استخدم الأدوات المتاحة للبحث عن معلومات'
);

console.log(response.response);
```

### اكتشاف الأدوات

```javascript
const tools = await agent.discoverMCPTools();

if (tools.success) {
  console.log('Available tools:', tools.response);
}
```

### إلغاء تفعيل MCP

```javascript
const agent = new AIAgent({
  enableMCP: false // تعطيل MCP
});
```

## 📋 أمثلة MCP Servers

### Example Server من Anthropic

```bash
npm run cli mcp:add example-mcp https://example-server.modelcontextprotocol.io/sse
```

### Custom Server

```bash
npm run cli mcp:add custom-tools https://my-company.com/mcp/api --token abc123
```

## 🔐 الأمان

### Best Practices

1. **لا تشارك Tokens**: احفظ authorization tokens بشكل آمن
2. **استخدم HTTPS فقط**: تأكد من أن الـ URLs تبدأ بـ `https://`
3. **راجع الأدوات**: استخدم `mcp:discover` للتحقق من الأدوات قبل الاستخدام
4. **Servers موثوقة**: أضف فقط servers من مصادر موثوقة

### Environment Variables

يمكنك تعطيل MCP عبر `.env`:

```bash
ENABLE_MCP=false
```

## 🛠️ API Reference

### Agent Methods

#### `addMCPServer(config)`

```javascript
await agent.addMCPServer({
  name: 'server-name',
  url: 'https://server-url.com/sse',
  type: 'url',
  authorization_token: 'token' // optional
});
```

#### `removeMCPServer(name)`

```javascript
await agent.removeMCPServer('server-name');
```

#### `discoverMCPTools()`

```javascript
const result = await agent.discoverMCPTools();
// { success: true, response: '...', tools: [...] }
```

### CLI Commands

| Command | Description |
|---------|-------------|
| `mcp:add <name> <url>` | إضافة MCP server |
| `mcp:add <name> <url> -t <token>` | إضافة server مع token |
| `mcp:remove <name>` | حذف server |
| `mcp:list` | عرض جميع الخوادم |
| `mcp:discover` | اكتشاف الأدوات المتاحة |

## 📚 مثال كامل

```javascript
import { AIAgent } from './src/index.js';

async function mcpExample() {
  // إنشاء الوكيل
  const agent = new AIAgent({
    enableMCP: true
  });

  await agent.initialize();

  // إضافة MCP server
  await agent.addMCPServer({
    name: 'example-tools',
    url: 'https://tools.example.com/mcp',
    type: 'url'
  });

  // اكتشاف الأدوات
  const tools = await agent.discoverMCPTools();
  console.log('Available tools:', tools.response);

  // استخدام الوكيل (MCP يُستخدم تلقائياً)
  const response = await agent.processMessage(
    'ابحث عن أحدث الأخبار باستخدام الأدوات المتاحة'
  );

  console.log(response.response);

  // إيقاف الوكيل
  await agent.shutdown();
}

mcpExample();
```

## 🔧 استكشاف الأخطاء

### المشكلة: "No MCP servers configured"

**الحل**: أضف server باستخدام:
```bash
npm run cli mcp:add server-name https://server-url.com
```

### المشكلة: فشل الاتصال بالـ Server

**التحقق من**:
- هل الـ URL صحيح؟
- هل الـ server يعمل؟
- هل تحتاج authorization token؟

### المشكلة: الأدوات لا تظهر

**الحل**:
```bash
npm run cli mcp:discover
```

## 🌟 حالات استخدام متقدمة

### تكامل مع API خاصة

```javascript
// إضافة API خاصة بشركتك
await agent.addMCPServer({
  name: 'company-api',
  url: 'https://internal.company.com/mcp',
  authorization_token: process.env.COMPANY_API_TOKEN
});
```

### استخدام عدة Servers

```javascript
// إضافة عدة servers
await agent.addMCPServer({
  name: 'search-tools',
  url: 'https://search.example.com/mcp'
});

await agent.addMCPServer({
  name: 'data-tools',
  url: 'https://data.example.com/mcp'
});

// الوكيل سيستخدم جميع الأدوات المتاحة
const response = await agent.processMessage(
  'ابحث وحلل البيانات'
);
```

## 📖 المزيد من الموارد

- [MCP Documentation](https://modelcontextprotocol.io)
- [Anthropic MCP Guide](https://docs.anthropic.com/claude/docs/mcp)
- [Example MCP Servers](https://github.com/modelcontextprotocol/servers)

---

**مُفعّل بواسطة Model Context Protocol** 🔌
