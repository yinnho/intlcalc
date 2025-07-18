# Cloudflare Pages 详细设置步骤

## 🚀 第一步：登录Cloudflare Dashboard

1. 打开浏览器，访问：https://dash.cloudflare.com
2. 使用您的Cloudflare账号登录
3. 确保您已经添加了 `intlcalc.com` 域名到Cloudflare

## 📋 第二步：创建Pages项目

1. 在左侧菜单中找到 **"Pages"**
2. 点击 **"Create a project"**
3. 选择 **"Connect to Git"**

## 🔗 第三步：连接GitHub仓库

1. 选择 **"GitHub"** 作为Git提供商
2. 如果首次使用，需要授权Cloudflare访问GitHub：
   - 点击 **"Install GitHub app"**
   - 选择 **"All repositories"** 或 **"Only select repositories"**
   - 如果选择后者，请选择 `yinnho/intlcalc` 仓库
   - 点击 **"Install"**

3. 回到Cloudflare Pages，选择仓库：**`yinnho/intlcalc`**
4. 点击 **"Begin setup"**

## ⚙️ 第四步：配置构建设置

在项目设置页面，填写以下信息：

```
Project name: intlcalc
Production branch: main
Framework preset: None
Build command: (留空)
Build output directory: generated_pages
Root directory: (留空)
```

**重要设置说明：**
- **Framework preset**: 选择 "None"（因为我们使用静态HTML）
- **Build command**: 留空（不需要构建）
- **Build output directory**: 填写 `generated_pages`（这是我们生成的文件目录）

## 🔧 第五步：环境变量设置

暂时不需要设置环境变量，直接点击 **"Save and Deploy"**

## ⏳ 第六步：等待部署

1. 点击 **"Save and Deploy"** 后，Cloudflare会开始部署
2. 部署过程大约需要1-2分钟
3. 您可以在部署页面看到实时进度

## 🌐 第七步：配置自定义域名

### 主站域名配置
1. 部署完成后，点击项目名称进入项目设置
2. 找到 **"Custom domains"** 部分
3. 点击 **"Set up a custom domain"**
4. 输入域名：`intlcalc.com`
5. 点击 **"Continue"**
6. 选择 **"Proxied"** 模式
7. 点击 **"Add custom domain"**

### 语言子站域名配置
为每个语言版本添加子域名：

1. 在同一个 **"Custom domains"** 页面
2. 点击 **"Add custom domain"**
3. 依次添加以下域名：
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

## 📊 第八步：验证部署

部署完成后，访问以下地址验证：

- **主站**: https://intlcalc.com
- **英语版**: https://en.intlcalc.com
- **中文版**: https://zh.intlcalc.com
- **其他语言**: 类似格式

## 🔄 第九步：自动部署设置

设置完成后，每次您运行 `node quick-deploy.js` 时：
1. 代码会自动推送到GitHub
2. Cloudflare Pages会自动检测到更改
3. 自动重新部署（约1-2分钟）

## 📱 第十步：移动端测试

在手机上访问网站，确保：
- 界面响应式正常
- 计算器功能正常
- 语言切换正常

## 🎯 预期结果

设置完成后，您将拥有：
- ✅ 10种语言版本的计算器网站
- ✅ 每个版本13个专业计算器
- ✅ 完整的计算功能和界面
- ✅ 响应式设计，支持移动端
- ✅ 快速加载（Cloudflare CDN）
- ✅ 自动部署功能

## 🆘 常见问题

### 问题1：部署失败
- 检查GitHub仓库是否正确连接
- 确认 `generated_pages` 目录存在
- 查看部署日志中的错误信息

### 问题2：域名无法访问
- 确认域名已添加到Cloudflare
- 检查DNS记录是否正确
- 等待DNS传播（最多24小时）

### 问题3：计算器功能异常
- 检查JavaScript文件是否正确加载
- 确认CSS样式文件路径正确
- 查看浏览器控制台错误信息

---

**🎉 完成这些步骤后，您的IntlCalc网站就正式上线了！** 