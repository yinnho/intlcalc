# Cloudflare Pages 部署指南

## ✅ 第一步：代码已推送到GitHub
- 仓库：https://github.com/yinnho/intlcalc.git
- 分支：main
- 文件数：873个对象
- 大小：2.24 MiB

## 🚀 第二步：在Cloudflare Pages中部署

### 1. 登录Cloudflare Dashboard
1. 访问 https://dash.cloudflare.com
2. 使用您的Cloudflare账号登录

### 2. 创建Pages项目
1. 在左侧菜单中找到 "Pages"
2. 点击 "Create a project"
3. 选择 "Connect to Git"

### 3. 连接GitHub仓库
1. 选择 "GitHub" 作为Git提供商
2. 授权Cloudflare访问您的GitHub账号
3. 选择仓库：`yinnho/intlcalc`
4. 点击 "Begin setup"

### 4. 配置构建设置
```
Project name: intlcalc
Production branch: main
Framework preset: None
Build command: (留空)
Build output directory: generated_pages
Root directory: (留空)
```

### 5. 环境变量（可选）
暂时不需要设置环境变量

### 6. 点击 "Save and Deploy"

## 🌐 第三步：配置自定义域名

### 主站配置
1. 在项目设置中找到 "Custom domains"
2. 添加域名：`intlcalc.com`
3. 点击 "Continue"
4. 选择 "Proxied" 模式

### 语言子站配置
为每个语言版本创建子域名：
- `en.intlcalc.com`
- `zh.intlcalc.com`
- `es.intlcalc.com`
- `fr.intlcalc.com`
- `de.intlcalc.com`
- `ja.intlcalc.com`
- `ko.intlcalc.com`
- `pt.intlcalc.com`
- `ru.intlcalc.com`
- `ar.intlcalc.com`

## 📊 部署验证

部署成功后，您应该能看到：
- 主站：https://intlcalc.com
- 英语版：https://en.intlcalc.com
- 中文版：https://zh.intlcalc.com
- 其他语言版本类似

## 🔧 自动部署

设置完成后：
- 每次推送代码到GitHub的main分支
- Cloudflare Pages会自动重新部署
- 部署时间约1-2分钟

## 📝 更新流程

1. 修改本地代码
2. 提交到Git：
   ```bash
   git add .
   git commit -m "Update description"
   git push
   ```
3. Cloudflare Pages自动部署

## 🎯 预期结果

部署成功后，您将拥有：
- 10种语言版本的计算器网站
- 每个版本13个专业计算器
- 完整的计算功能和界面
- 响应式设计，支持移动端
- 快速加载（Cloudflare CDN） 