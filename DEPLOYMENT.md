# IntlCalc 部署说明

## 🚀 部署到 Cloudflare Pages

### 1. 创建 GitHub 仓库

1. 在 GitHub 上创建新仓库：`intlcalc`
2. 推送代码到仓库：
   ```bash
   git remote add origin https://github.com/yourusername/intlcalc.git
   git push -u origin main
   ```

### 2. 在 Cloudflare Pages 中部署

1. 登录 Cloudflare Dashboard
2. 进入 Pages 部分
3. 点击 "Create a project"
4. 选择 "Connect to Git"
5. 选择你的 `intlcalc` 仓库
6. 配置构建设置：
   - **Framework preset**: None
   - **Build command**: 留空
   - **Build output directory**: `generated_pages`
   - **Root directory**: 留空

### 3. 配置自定义域名

#### 主站配置
- **域名**: `intlcalc.com`
- **目录**: `generated_pages/`

#### 语言子站配置
- **英语**: `en.intlcalc.com` → `generated_pages/en/`
- **中文**: `zh.intlcalc.com` → `generated_pages/zh/`
- **西班牙语**: `es.intlcalc.com` → `generated_pages/es/`
- **法语**: `fr.intlcalc.com` → `generated_pages/fr/`
- **德语**: `de.intlcalc.com` → `generated_pages/de/`
- **日语**: `ja.intlcalc.com` → `generated_pages/ja/`
- **韩语**: `ko.intlcalc.com` → `generated_pages/ko/`
- **葡萄牙语**: `pt.intlcalc.com` → `generated_pages/pt/`
- **俄语**: `ru.intlcalc.com` → `generated_pages/ru/`
- **阿拉伯语**: `ar.intlcalc.com` → `generated_pages/ar/`

### 4. DNS 配置

在 Cloudflare DNS 中配置以下 CNAME 记录：

```
CNAME  intlcalc.com    intlcalc.pages.dev
CNAME  en              intlcalc-en.pages.dev
CNAME  zh              intlcalc-zh.pages.dev
CNAME  es              intlcalc-es.pages.dev
CNAME  fr              intlcalc-fr.pages.dev
CNAME  de              intlcalc-de.pages.dev
CNAME  ja              intlcalc-ja.pages.dev
CNAME  ko              intlcalc-ko.pages.dev
CNAME  pt              intlcalc-pt.pages.dev
CNAME  ru              intlcalc-ru.pages.dev
CNAME  ar              intlcalc-ar.pages.dev
```

## 📊 项目统计

- **总文件数**: 186
- **总大小**: 3.31 MB
- **计算器数量**: 每个语言版本 13 个计算器
- **支持语言**: 10 种语言

## 🧮 包含的计算器

1. Percentage Calculator
2. Scientific Calculator
3. BMI Calculator
4. Mortgage Calculator
5. Compound Interest Calculator
6. Grade Calculator
7. Average Calculator
8. Fraction Calculator
9. Final Grade Calculator
10. Percentage Change Calculator
11. Percentage Increase Calculator
12. Wire Gauge Calculator
13. ${slug} Calculator

## 🔧 技术栈

- **前端**: HTML5, CSS3, JavaScript
- **部署**: Cloudflare Pages
- **域名**: Cloudflare DNS
- **数据源**: RapidTables.com (已解析的完整数据)

## 📝 更新流程

1. 修改代码
2. 提交到 Git：
   ```bash
   git add .
   git commit -m "Update description"
   git push
   ```
3. Cloudflare Pages 自动部署

## 🌐 访问地址

- **主站**: https://intlcalc.com
- **英语版**: https://en.intlcalc.com
- **中文版**: https://zh.intlcalc.com
- **其他语言**: 类似格式 