# Cloudflare Pages 多语言部署指南

## 概述
intlcalc.com 采用多个 Pages 项目的架构，每种语言一个独立项目。

## 项目结构

### 主项目：intlcalc-main
- 域名：`intlcalc.com`
- 内容：语言选择页面
- 文件：`/index.html`

### 英文项目：intlcalc-en  
- 域名：`en.intlcalc.com`
- 内容：完整英文网站
- 文件结构：
```
/
├── index.html
├── calc/
│   ├── math/
│   ├── finance/ 
│   ├── electric/
│   ├── time/
│   ├── body/
│   ├── grade/
│   ├── light/
│   ├── wire/
│   └── baby/
├── convert/
│   ├── length/
│   ├── weight/
│   ├── temperature/
│   ├── power/
│   ├── energy/
│   ├── frequency/
│   ├── voltage/
│   ├── electric/
│   ├── color/
│   ├── number/
│   ├── chemistry/
│   ├── charge/
│   └── image/
└── assets/
    ├── css/
    └── js/
```

### 中文项目：intlcalc-zh
- 域名：`zh.intlcalc.com`  
- 内容：完整中文网站
- 文件结构：同上（中文版本）

### 其他语言项目
- `intlcalc-es` → `es.intlcalc.com` (西班牙语)
- `intlcalc-fr` → `fr.intlcalc.com` (法语)  
- `intlcalc-de` → `de.intlcalc.com` (德语)
- `intlcalc-ja` → `ja.intlcalc.com` (日语)
- `intlcalc-ko` → `ko.intlcalc.com` (韩语)
- `intlcalc-pt` → `pt.intlcalc.com` (葡萄牙语)
- `intlcalc-ru` → `ru.intlcalc.com` (俄语)
- `intlcalc-ar` → `ar.intlcalc.com` (阿拉伯语)

## 部署步骤

### 1. 创建主项目 (intlcalc-main)
1. Cloudflare Dashboard → Pages → 创建项目
2. 项目名：`intlcalc-main`
3. 上传文件：只上传 `index.html` 
4. 自定义域名：`intlcalc.com`

### 2. 创建英文项目 (intlcalc-en)
1. 创建新项目：`intlcalc-en`
2. 上传文件：`generated_pages/en/` 文件夹内容
3. 自定义域名：`en.intlcalc.com`

### 3. 重复创建其他语言项目
按照同样步骤创建其他9个语言项目。

## DNS 配置

所有子域名会自动添加 CNAME 记录指向 Pages：
- `en.intlcalc.com` → `intlcalc-en.pages.dev`
- `zh.intlcalc.com` → `intlcalc-zh.pages.dev`
- 等等...

## 访问测试

部署完成后测试访问：
- https://intlcalc.com → 语言选择页面
- https://en.intlcalc.com → 英文主页
- https://zh.intlcalc.com → 中文主页
- https://en.intlcalc.com/calc/math/calculator.html → 英文计算器

## 优势

1. **独立部署** - 每个语言版本可以独立更新
2. **更好缓存** - Cloudflare CDN 为每个域名独立缓存
3. **SEO 友好** - 每个子域名有独立的内容和URL结构
4. **维护简单** - 每个项目结构清晰，便于管理
5. **扩展性好** - 新增语言只需创建新项目

## 注意事项

1. 每个项目的 `index.html` 都需要包含正确的语言切换链接
2. 计算器页面的相对路径要保持一致：`/calc/math/calculator.html`
3. CSS/JS 资源路径要正确：`/assets/css/main.css`
4. 所有页面都要包含相同的 Google Analytics 代码 