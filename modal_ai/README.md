# Modal AI 部署指南

## 📦 前置准备

### 1. 安装 Modal CLI
```bash
pip install modal
```

### 2. 登录 Modal
```bash
modal token new
```
这会打开浏览器让你登录 Modal 账户。

---

## 🔐 设置 API Token (重要!)

在 Modal 中创建一个 Secret 来存储你的 API Token：

### 方法 1: 通过 Modal Dashboard
1. 访问 https://modal.com/secrets
2. 点击 "Create new secret"
3. 名称填写: `tongue-analyzer-secrets`
4. 添加环境变量:
   - Key: `API_TOKEN`
   - Value: 生成一个安全的随机字符串 (例如: `sk_live_abc123xyz789...`)
5. 点击保存

### 方法 2: 通过命令行
```bash
modal secret create tongue-analyzer-secrets API_TOKEN=你的安全token字符串
```

---

## 🚀 部署步骤

### 本地测试
```bash
cd /Users/jbxjbx/Desktop/Nourish\ Select/webpage\ development
modal serve modal_ai/main.py
```
这会启动一个本地开发服务器，你可以测试 API。

### 正式部署
```bash
cd /Users/jbxjbx/Desktop/Nourish\ Select/webpage\ development
modal deploy modal_ai/main.py
```

部署成功后，终端会显示类似这样的输出：
```
✓ Created web endpoint analyze_tongue at https://你的用户名--tongue-analyzer-analyze-tongue.modal.run
✓ Created web endpoint health at https://你的用户名--tongue-analyzer-health.modal.run
```

---

## 🔗 在 Vercel 中配置

### 1. 获取 Modal 端点 URL
部署后，你会得到一个 URL，格式类似:
```
https://你的用户名--tongue-analyzer-analyze-tongue.modal.run
```

### 2. 在 Vercel 添加环境变量
在 Vercel 项目设置中添加以下环境变量:

| 变量名 | 值 |
|--------|-----|
| `MODAL_API_URL` | `https://你的用户名--tongue-analyzer-analyze-tongue.modal.run` |
| `MODAL_API_TOKEN` | 你在 Modal Secret 中设置的 `API_TOKEN` 值 |

### 3. 更新前端 API 调用
在你的 Next.js 代码中，调用 Modal API 时需要:

```typescript
const response = await fetch(process.env.MODAL_API_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.MODAL_API_TOKEN}`,
  },
  body: JSON.stringify({
    image_url: '图片URL'
  }),
});

const result = await response.json();
// result.data 包含分析结果
```

---

## 📡 API 使用说明

### 请求格式
```
POST https://你的用户名--tongue-analyzer-analyze-tongue.modal.run

Headers:
  Authorization: Bearer 你的API_TOKEN
  Content-Type: application/json

Body:
{
  "image_url": "https://example.com/tongue-image.jpg"
}
```

### 响应格式
```json
{
  "success": true,
  "data": {
    "score": 75,
    "constitution": "Qi Deficiency",
    "issues": ["Teeth marks indicate Qi deficiency"],
    "recommendation": {
      "name": "Ginseng Vitality Elixir",
      "desc": "Specially formulated for Qi Deficiency constitution",
      "productId": "drink-1"
    },
    "tongue_features": {
      "teeth_marks": true,
      "pale_white": false,
      "red": false,
      "cracked": false,
      "peeling": false
    },
    "symptoms": {
      "obesity": 0.45,
      "high_sugar": 0.32,
      "indigestion": 0.67,
      "fatigue": 0.78,
      "insomnia": 0.54,
      "acid_reflux": 0.23,
      "dry_mouth": 0.56,
      "constipation": 0.41,
      "irritability": 0.62
    }
  }
}
```

---

## 🔧 常用命令

| 命令 | 说明 |
|------|------|
| `modal serve modal_ai/main.py` | 本地开发/测试 |
| `modal deploy modal_ai/main.py` | 部署到生产环境 |
| `modal app list` | 查看已部署的应用 |
| `modal app logs tongue-analyzer` | 查看应用日志 |
| `modal app stop tongue-analyzer` | 停止应用 |

---

## 💡 下一步: 集成真实 AI 模型

当前代码使用模拟数据。要集成真实模型：

1. 在 `TongueAnalyzer.load_model()` 中加载你的模型
2. 在 `TongueAnalyzer.analyze()` 中实现真实推理逻辑
3. 如果模型文件较大，可以使用 Modal Volume 存储
