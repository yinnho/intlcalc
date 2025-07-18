# IntlCalc.com 自动化部署指南

## 🚀 一键部署到 Cloudflare Pages

这个脚本会自动为你部署完整的多语言计算器网站！

### 📋 部署内容

**主域名项目:**
- `intlcalc.com` → 语言选择页面

**10个语言子域名项目:**
- `en.intlcalc.com` → 英文版完整网站
- `zh.intlcalc.com` → 中文版完整网站  
- `es.intlcalc.com` → 西班牙语版
- `fr.intlcalc.com` → 法语版
- `de.intlcalc.com` → 德语版
- `ja.intlcalc.com` → 日语版
- `ko.intlcalc.com` → 韩语版
- `pt.intlcalc.com` → 葡萄牙语版
- `ru.intlcalc.com` → 俄语版
- `ar.intlcalc.com` → 阿拉伯语版

### 🔐 第一步：获取 Cloudflare 凭据

#### 1. 获取 API Token
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 点击右上角头像 → **My Profile**
3. 选择 **API Tokens** → **Create Token**
4. 使用 **"Edit Cloudflare Workers"** 模板 → **Use template**
5. 或者创建自定义 Token，需要以下权限：
   - **Account**: Cloudflare Pages:Edit
   - **Zone**: Zone:Read, DNS:Edit (如果需要)

#### 2. 获取 Account ID
1. 在 Cloudflare Dashboard 中
2. 右侧边栏找到 **Account ID**
3. 点击复制

### 🛠️ 第二步：设置环境变量

在命令行中设置环境变量：

#### Windows (PowerShell):
```powershell
$env:CLOUDFLARE_API_TOKEN="你的API_TOKEN"
$env:CLOUDFLARE_ACCOUNT_ID="你的ACCOUNT_ID"
```

#### Linux/Mac:
```bash
export CLOUDFLARE_API_TOKEN="你的API_TOKEN"
export CLOUDFLARE_ACCOUNT_ID="你的ACCOUNT_ID"
```

### ⚡ 第三步：一键部署

运行部署脚本：

```bash
node deploy-script.js
```

### 🔄 部署过程

脚本会自动完成以下操作：

1. **验证凭据** - 检查 Wrangler 和 API Token
2. **检查文件** - 确保所有必要文件存在
3. **创建项目** - 为每个语言版本创建 Pages 项目
4. **部署文件** - 上传所有网站文件
5. **配置域名** - 添加自定义域名解析
6. **清理临时文件** - 自动清理部署过程中的临时文件

### 📊 部署结果

部署完成后，你会看到类似的结果：

```
🎉 部署完成！结果汇总:
==========================================
✅ intlcalc.com (intlcalc-main)
   🌐 https://intlcalc.com
✅ en.intlcalc.com (intlcalc-en)
   🌐 https://en.intlcalc.com
✅ zh.intlcalc.com (intlcalc-zh)
   🌐 https://zh.intlcalc.com
... (其他8个语言版本)
```

### 🕐 等待 DNS 传播

- DNS 传播通常需要 **5-10 分钟**
- SSL 证书会自动配置
- 全球 CDN 会自动分发内容

### 🎯 测试访问

部署完成后测试以下链接：

- https://intlcalc.com → 语言选择页面
- https://en.intlcalc.com → 英文主页
- https://en.intlcalc.com/calc/math/calculator.html → 英文计算器
- https://zh.intlcalc.com → 中文主页 (需要先创建中文版)

### 🔧 故障排除

#### 问题1：Wrangler 认证失败
```bash
npx wrangler login
```

#### 问题2：项目已存在
- 脚本会自动检测并跳过已存在的项目
- 如需重新部署，可以删除项目后重新运行

#### 问题3：域名配置失败
- 检查域名是否已在其他地方使用
- 确保 Cloudflare 管理该域名
- 检查 API Token 权限

### 📈 后续优化

部署完成后的工作：

1. **创建其他语言版本** - 目前只有英文版有完整内容
2. **配置 Google Analytics** - 添加统计代码
3. **提交 Search Console** - 提高 SEO
4. **批量生成计算器** - 生成更多计算器页面
5. **性能优化** - 图片压缩、代码压缩等

### 💡 高级功能

如果需要更新网站：

```bash
# 只更新特定语言版本
npx wrangler pages deploy generated_pages/en --project-name=intlcalc-en

# 查看部署历史
npx wrangler pages deployment list --project-name=intlcalc-en
```

---

## 🎉 恭喜！

你的多语言计算器网站现在已经部署到全球 CDN 上了！

需要帮助？请检查：
1. 环境变量是否正确设置
2. API Token 权限是否充足  
3. 域名是否在 Cloudflare 管理下
4. 网络连接是否正常 