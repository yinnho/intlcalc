# IntlCalc 正确网站架构设计

## 🎯 核心思路：模板 + 数据 = 页面

### 1. **架构流程**
```
数据库数据 → API接口 → 模板引擎 → 生成HTML页面 → 部署到CDN
```

### 2. **技术栈选择**
```
模板引擎: Handlebars.js 或 EJS
数据源: Cloudflare D1 数据库
API: Cloudflare Functions
部署: Cloudflare Pages
生成器: Node.js 脚本
```

### 3. **目录结构**
```
/
├── templates/           # 模板文件
│   ├── layout.hbs      # 主布局模板
│   ├── home.hbs        # 首页模板
│   ├── calculator.hbs  # 计算器页面模板
│   └── category.hbs    # 分类页面模板
├── data/               # 数据文件
│   ├── languages.json  # 语言配置
│   ├── categories.json # 分类数据
│   └── calculators.json # 计算器数据
├── src/                # 源代码
│   ├── generator.js    # 页面生成器
│   ├── api.js          # API调用
│   └── templates.js    # 模板处理
├── dist/               # 生成的静态文件
│   ├── index.html      # 主站首页
│   ├── en/             # 英语版本
│   ├── zh/             # 中文版本
│   └── ...
└── functions/          # Cloudflare Functions (API)
```

## 🔧 实现步骤

### 第一步：创建模板系统
1. 设计 Handlebars 模板
2. 定义数据接口
3. 创建模板渲染器

### 第二步：数据获取
1. 从 D1 数据库获取数据
2. 转换为模板所需格式
3. 缓存数据文件

### 第三步：页面生成
1. 遍历所有语言
2. 为每个计算器生成页面
3. 生成分类页面和首页

### 第四步：部署
1. 生成静态文件
2. 部署到 Cloudflare Pages
3. 配置 CDN

## 📋 具体实现

### 模板示例
```handlebars
<!-- templates/layout.hbs -->
<!DOCTYPE html>
<html lang="{{lang}}">
<head>
    <meta charset="UTF-8">
    <title>{{title}} - IntlCalc</title>
    <meta name="description" content="{{description}}">
    <link rel="stylesheet" href="/css/main.css">
</head>
<body>
    <header>
        <nav>
            <a href="/{{lang}}/" class="logo">IntlCalc</a>
            <div class="lang-switcher">
                {{#each languages}}
                    <a href="/{{code}}/{{../currentPath}}" class="{{#if (eq code ../lang)}}active{{/if}}">
                        {{native_name}}
                    </a>
                {{/each}}
            </div>
        </nav>
    </header>
    
    <main>
        {{{body}}}
    </main>
    
    <footer>
        <p>&copy; 2024 IntlCalc</p>
    </footer>
</body>
</html>
```

### 数据获取
```javascript
// src/api.js
async function getLanguages() {
    const response = await fetch('https://intlcalc.pages.dev/api/languages');
    return response.json();
}

async function getCalculators(lang) {
    const response = await fetch(`https://intlcalc.pages.dev/api/calculators?lang=${lang}`);
    return response.json();
}
```

### 页面生成器
```javascript
// src/generator.js
const Handlebars = require('handlebars');
const fs = require('fs').promises;

class PageGenerator {
    constructor() {
        this.templates = {};
        this.data = {};
    }
    
    async loadTemplates() {
        // 加载所有模板
        const templateFiles = await fs.readdir('./templates');
        for (const file of templateFiles) {
            const content = await fs.readFile(`./templates/${file}`, 'utf8');
            this.templates[file.replace('.hbs', '')] = Handlebars.compile(content);
        }
    }
    
    async loadData() {
        // 从API获取数据
        this.data.languages = await getLanguages();
        this.data.calculators = {};
        
        for (const lang of this.data.languages) {
            this.data.calculators[lang.code] = await getCalculators(lang.code);
        }
    }
    
    async generatePages() {
        // 为每种语言生成页面
        for (const lang of this.data.languages) {
            await this.generateLanguagePages(lang.code);
        }
    }
    
    async generateLanguagePages(lang) {
        const calculators = this.data.calculators[lang];
        
        // 生成首页
        await this.generateHomePage(lang);
        
        // 生成分类页面
        for (const category of calculators) {
            await this.generateCategoryPage(lang, category);
        }
        
        // 生成计算器页面
        for (const category of calculators) {
            for (const calculator of category.calculators) {
                await this.generateCalculatorPage(lang, calculator);
            }
        }
    }
}
```

## 🚀 优势

### 1. **正确的架构**
- 模板与数据分离
- 一次生成，多次使用
- 静态文件性能最佳

### 2. **易于维护**
- 修改模板，重新生成
- 添加数据，自动生成页面
- 版本控制友好

### 3. **SEO友好**
- 静态HTML页面
- 完整的meta标签
- 快速加载

### 4. **多语言支持**
- 统一的模板系统
- 数据驱动的翻译
- 自动生成所有语言版本

## 🎯 下一步行动

1. **创建模板系统**
2. **实现数据获取**
3. **构建页面生成器**
4. **设置自动化部署**

这样才是正确的网站架构！您觉得这个方向对吗？ 