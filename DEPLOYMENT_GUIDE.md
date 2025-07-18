# 计算器网站 Cloudflare 部署指南

## 概述
- **总成本**: 约 $12/年
- **域名**: Cloudflare Registrar
- **托管**: Cloudflare Pages (免费)
- **特性**: 全球CDN、免费SSL、多语言支持

## 第一步：注册 Cloudflare 账户

1. 访问 [Cloudflare.com](https://www.cloudflare.com)
2. 点击 "Sign Up" 创建免费账户
3. 验证邮箱地址

## 第二步：域名注册

### 选项A：Cloudflare Registrar（推荐）
1. 登录 Cloudflare Dashboard
2. 点击侧边栏 "Domain Registration"
3. 搜索您想要的域名（如：mycalculators.com）
4. 选择域名并完成购买（约 $10-15/年）

### 选项B：Namecheap（备选）
1. 访问 [Namecheap.com](https://www.namecheap.com)
2. 搜索并购买域名
3. 稍后将域名DNS指向Cloudflare

## 第三步：设置 Cloudflare Pages

1. 在 Cloudflare Dashboard 中点击 "Pages"
2. 点击 "Create a project"
3. 选择 "Upload assets" 选项
4. 项目名称：calculator-website
5. 暂时跳过上传，先完成配置

## 第四步：准备网站文件

### 创建多语言目录结构
```
website/
├── index.html (主页重定向)
├── en/ (英语版本)
│   ├── index.html
│   ├── calc/
│   └── convert/
├── zh/ (中文版本)
│   ├── index.html  
│   ├── calc/
│   └── convert/
├── es/ (西班牙语)
├── fr/ (法语)
├── de/ (德语)
├── ja/ (日语)
├── ko/ (韩语)
├── pt/ (葡萄牙语)
├── ru/ (俄语)
└── ar/ (阿拉伯语)
```

## 第五步：配置多语言支持

### 主页重定向设置
创建根目录 `index.html` 文件，根据用户语言自动重定向：

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Calculator Tools - Multiple Languages</title>
    <script>
        // 自动语言检测和重定向
        const userLang = navigator.language.substr(0, 2);
        const supportedLangs = ['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko', 'pt', 'ru', 'ar'];
        const targetLang = supportedLangs.includes(userLang) ? userLang : 'en';
        window.location.href = `/${targetLang}/`;
    </script>
</head>
<body>
    <p>Redirecting to your language...</p>
    <p><a href="/en/">English</a> | <a href="/zh/">中文</a> | <a href="/es/">Español</a></p>
</body>
</html>
```

## 第六步：配置子域名（可选）

如果要使用子域名（如 zh.domain.com），在 Cloudflare DNS 中添加：

1. 点击 "DNS" 标签
2. 添加 CNAME 记录：
   - Name: zh
   - Target: calculator-website.pages.dev
   - TTL: Auto
3. 重复添加其他语言子域名

## 第七步：上传网站文件

1. 将准备好的网站文件压缩为 ZIP
2. 在 Cloudflare Pages 中上传 ZIP 文件
3. 等待部署完成（通常 1-2 分钟）

## 第八步：配置自定义域名

1. 在 Pages 项目中点击 "Custom domains"
2. 点击 "Set up a custom domain"
3. 输入您的域名（如 mycalculators.com）
4. Cloudflare 将自动配置 DNS 记录
5. 等待 SSL 证书自动部署

## 第九步：优化配置

### 设置缓存规则
1. 在域名的 "Caching" 设置中
2. 启用 "Always Online"
3. 设置 Browser Cache TTL 为 "1 month"

### 配置安全设置
1. 启用 "Always Use HTTPS"
2. 设置 SSL/TLS 为 "Full (strict)"
3. 启用 "Automatic HTTPS Rewrites"

## 第十步：SEO 和分析

### Google Search Console
1. 访问 [Google Search Console](https://search.google.com/search-console)
2. 添加您的域名属性
3. 验证域名所有权
4. 提交网站地图

### Google Analytics（可选）
1. 创建 Google Analytics 账户
2. 获取跟踪代码
3. 将代码添加到所有页面的 `<head>` 部分

## 成本总结

- **域名注册**: $10-15/年
- **Cloudflare Pages托管**: 免费
- **SSL证书**: 免费
- **CDN服务**: 免费
- **总计**: $10-15/年

## 性能特性

- **全球CDN**: 200+ 数据中心
- **加载速度**: 通常 < 500ms
- **可靠性**: 99.9% 正常运行时间
- **带宽**: 无限制
- **并发用户**: 无限制

## 维护和更新

### 更新网站内容
1. 准备新的文件
2. 在 Cloudflare Pages 中重新上传
3. 自动部署新版本

### 监控网站状态
1. Cloudflare Dashboard 提供实时分析
2. 查看访问量、地理分布、性能指标
3. 设置邮件通知

## 故障排除

### 常见问题
1. **DNS传播延迟**: 最多24小时
2. **SSL证书问题**: 通常自动解决，可强制刷新
3. **缓存问题**: 使用 "Purge Everything" 清除缓存

### 技术支持
- Cloudflare 社区论坛
- 详细的帮助文档
- 邮件支持（免费账户）

## 下一步

部署完成后，您可以：
1. 继续生成更多计算器
2. 优化SEO设置
3. 添加更多语言版本
4. 监控网站性能和用户数据

---

**注意**: 这个方案比之前的 Google Cloud + Firebase 方案成本降低了 70%，同时提供更好的性能和更简单的管理。 