# 计算器网站数据抓取和页面生成系统

这是一个完整的自动化系统，用于抓取计算器网站的数据，分析其结构和功能，并自动生成多语言计算器页面。

## 🚀 功能特色

- **🕸️ 智能数据抓取**: 自动抓取RapidTables等计算器网站的HTML、CSS、JavaScript
- **🔍 深度数据解析**: 解析网页结构，提取计算逻辑和UI组件
- **⚡ JavaScript提取**: 分析和分类JavaScript函数，构建可复用代码库
- **🛠️ 自动页面生成**: 根据抓取数据生成完整的多语言计算器页面
- **🌍 多语言支持**: 支持10种语言（英文、中文、西班牙文、法文等）
- **📊 完整数据库**: SQLite数据库存储所有抓取和分析数据

## 📋 系统架构

```
📁 项目结构
├── src/
│   ├── database/          # 数据库初始化和管理
│   │   └── init.js
│   ├── scraper/           # 网页数据抓取器
│   │   └── index.js
│   ├── parser/            # 数据解析器
│   │   └── index.js
│   ├── generator/         # 页面生成器
│   │   └── index.js
│   ├── extractor/         # JavaScript代码提取器
│   │   └── js-extractor.js
│   └── index.js           # 主入口文件
├── data/                  # 数据库文件
├── scraped_data/          # 抓取的原始数据
├── parsed_data/           # 解析后的结构化数据
├── extracted_js/          # 提取的JavaScript库
├── generated_pages/       # 生成的多语言页面
└── package.json
```

## 🛠️ 安装和设置

### 1. 环境要求

- Node.js 16.0 或更高版本
- npm 或 yarn
- 至少 2GB 可用磁盘空间

### 2. 安装依赖

```bash
# 克隆项目
git clone <repository-url>
cd calculator-scraper-generator

# 安装依赖
npm install

# 或使用 yarn
yarn install
```

### 3. 初始化数据库

```bash
# 初始化数据库结构
npm run init-db

# 或手动运行
node src/database/init.js
```

## 🚦 使用方法

### 快速开始

运行完整的数据处理流水线：

```bash
# 运行完整流水线
npm start

# 或直接运行
node src/index.js
```

### 分步执行

你可以选择只运行特定的步骤：

```bash
# 只运行数据抓取
npm run scrape
# 或 node src/index.js --step scraping

# 只运行数据解析  
npm run parse
# 或 node src/index.js --step parsing

# 只运行JavaScript提取
node src/index.js --step extraction

# 只运行页面生成
npm run generate
# 或 node src/index.js --step generation
```

### 跳过特定步骤

如果你已经有了某些数据，可以跳过相应步骤：

```bash
# 跳过数据抓取，从解析开始
node src/index.js --skip-scraping

# 跳过数据抓取和解析
node src/index.js --skip-scraping --skip-parsing

# 只运行页面生成
node src/index.js --skip-scraping --skip-parsing --skip-extraction
```

## 📊 数据库结构

系统使用SQLite数据库存储所有数据，主要表结构：

### 核心表

- **calculators**: 计算器元数据
- **html_structures**: HTML结构分析
- **css_styles**: CSS样式提取
- **javascript_code**: JavaScript代码片段
- **calculation_formulas**: 计算公式
- **input_configs**: 输入配置
- **output_configs**: 输出配置
- **multilang_content**: 多语言内容

### 查看数据库

```bash
# 安装SQLite命令行工具后
sqlite3 data/calculators.db

# 查看表结构
.schema

# 查看抓取的计算器
SELECT name, category, url FROM calculators LIMIT 10;
```

## 🎯 输出结果

### 1. 抓取数据 (`scraped_data/`)
- 原始HTML文件
- 提取的数据JSON
- 网页截图（可选）

### 2. 解析结果 (`parsed_data/`)
- 结构化分析数据
- 组件配置文件
- 计算逻辑分析

### 3. JavaScript库 (`extracted_js/`)
- 按功能分类的JS函数库
- TypeScript定义文件
- 函数使用文档

### 4. 生成页面 (`generated_pages/`)
```
generated_pages/
├── en/                    # 英文页面
│   ├── scientific-calculator/
│   │   ├── index.html
│   │   ├── style.css
│   │   └── script.js
│   └── percentage-calculator/
├── zh/                    # 中文页面
├── es/                    # 西班牙文页面
└── shared/                # 共享资源
    ├── css/
    └── js/
```

## ⚙️ 配置选项

### 环境变量

创建 `.env` 文件来配置系统：

```env
# 数据库配置
DB_PATH=./data/calculators.db

# 抓取配置
SCRAPER_DELAY=2000
SCRAPER_TIMEOUT=30000
SCRAPER_MAX_PAGES=100

# 生成配置
SUPPORTED_LANGUAGES=en,zh,es,fr,de,ja,ko,pt,ru,ar
OUTPUT_DIR=./generated_pages

# 浏览器配置
PUPPETEER_HEADLESS=true
PUPPETEER_VIEWPORT_WIDTH=1920
PUPPETEER_VIEWPORT_HEIGHT=1080
```

### 自定义配置

```javascript
const CalculatorSystemManager = require('./src/index');

const customOptions = {
    languages: ['en', 'zh', 'fr'],      // 只生成这三种语言
    maxConcurrent: 2,                   // 最大并发数
    delay: 3000,                        // 抓取延迟
    skipScraping: false,                // 是否跳过抓取
    // ... 其他选项
};

const manager = new CalculatorSystemManager(customOptions);
await manager.runFullPipeline();
```

## 🔧 高级用法

### 1. 添加新的抓取目标

编辑 `src/scraper/index.js` 中的 `targetSites` 配置：

```javascript
this.targetSites = {
    rapidtables: {
        baseUrl: 'https://www.rapidtables.com',
        indexUrl: 'https://www.rapidtables.com/calc/index.html',
        patterns: ['/calc/math/', '/calc/finance/']
    },
    // 添加新站点
    calculator_net: {
        baseUrl: 'https://www.calculator.net',
        indexUrl: 'https://www.calculator.net',
        patterns: ['/calculators/']
    }
};
```

### 2. 自定义页面模板

在 `src/templates/` 目录下创建Handlebars模板：

```handlebars
<!-- src/templates/custom-calculator.hbs -->
<!DOCTYPE html>
<html lang="{{lang.code}}">
<head>
    <title>{{calculator.title}}</title>
    <!-- 自定义头部 -->
</head>
<body>
    <!-- 自定义页面结构 -->
</body>
</html>
```

### 3. 扩展JavaScript分析

在 `src/extractor/js-extractor.js` 中添加新的函数模式：

```javascript
this.patterns = {
    // 现有模式...
    customPattern: [
        /mycustom/i, /special/i
    ]
};
```

## 📈 性能优化

### 1. 并发控制

```bash
# 调整并发数（默认为3）
node src/index.js --max-concurrent 5
```

### 2. 内存优化

对于大量数据处理，建议：

- 增加Node.js内存限制：`node --max-old-space-size=4096 src/index.js`
- 分批处理数据：使用 `--skip-*` 参数分步执行

### 3. 网络优化

```javascript
// 自定义抓取延迟
const options = {
    delay: 1000,        // 减少延迟（注意可能被反爬虫）
    timeout: 60000      // 增加超时时间
};
```

## 🐛 故障排除

### 常见问题

1. **Puppeteer安装失败**
   ```bash
   # 手动安装Chromium
   PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true npm install puppeteer
   ```

2. **数据库锁定错误**
   ```bash
   # 删除数据库文件重新初始化
   rm data/calculators.db
   npm run init-db
   ```

3. **生成页面失败**
   - 检查 `parsed_data/` 目录是否有数据
   - 确保模板文件语法正确

### 调试模式

```bash
# 启用详细日志
DEBUG=* node src/index.js

# 使用非无头模式调试浏览器
PUPPETEER_HEADLESS=false node src/index.js --step scraping
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'Add amazing feature'`
4. 推送分支：`git push origin feature/amazing-feature`
5. 创建Pull Request

### 代码规范

- 使用ESLint检查代码风格
- 添加适当的注释和文档
- 编写测试用例

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🙋 常见问题

**Q: 可以抓取其他类型的网站吗？**
A: 是的，通过修改 `targetSites` 配置和抓取逻辑，可以适配其他类型的网站。

**Q: 生成的页面可以直接部署吗？**
A: 是的，生成的页面是完整的静态HTML/CSS/JS文件，可以直接部署到任何Web服务器。

**Q: 如何添加新的语言支持？**
A: 在 `languages` 配置中添加语言代码，并在数据库中添加对应的翻译内容。

**Q: 系统支持哪些类型的计算器？**
A: 目前支持科学计算器、公式计算器、单位转换器、统计计算器和数据查询类型。

## 📞 支持

如有问题或建议，请：

1. 查看[Wiki文档](../../wiki)
2. 提交[Issue](../../issues)
3. 参与[讨论](../../discussions)

---

**让计算器网站的创建变得简单高效！** 🚀 #   i n t l c a l c  
 