# IntlCalc 技术架构重构方案

## 当前问题
- 静态文件部署，多语言需要重复部署
- 内容更新需要重新生成所有语言版本
- 缺乏数据库支持，无法动态管理内容
- 维护成本高，扩展性差

## 新架构方案

### 1. 技术栈选择
```
前端: React/Vue.js (SPA)
后端: Cloudflare Workers + D1 Database
部署: Cloudflare Pages + Functions
多语言: 数据库驱动的 i18n 系统
```

### 2. 数据库设计 (D1)

#### 表结构设计
```sql
-- 语言配置表
CREATE TABLE languages (
    id INTEGER PRIMARY KEY,
    code TEXT UNIQUE NOT NULL, -- en, zh, es, fr, de, ja, ko, pt, ru, ar
    name TEXT NOT NULL,
    native_name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 计算器分类表
CREATE TABLE categories (
    id INTEGER PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL, -- financial, math, health, etc.
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 分类多语言内容表
CREATE TABLE category_translations (
    id INTEGER PRIMARY KEY,
    category_id INTEGER,
    language_code TEXT,
    name TEXT NOT NULL,
    description TEXT,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (language_code) REFERENCES languages(code)
);

-- 计算器表
CREATE TABLE calculators (
    id INTEGER PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL, -- basic-math, interest, bmi, etc.
    category_id INTEGER,
    icon TEXT, -- 图标名称
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- 计算器多语言内容表
CREATE TABLE calculator_translations (
    id INTEGER PRIMARY KEY,
    calculator_id INTEGER,
    language_code TEXT,
    title TEXT NOT NULL,
    description TEXT,
    instructions TEXT,
    FOREIGN KEY (calculator_id) REFERENCES calculators(id),
    FOREIGN KEY (language_code) REFERENCES languages(code)
);

-- 计算器配置表 (JSON格式存储计算逻辑)
CREATE TABLE calculator_configs (
    id INTEGER PRIMARY KEY,
    calculator_id INTEGER,
    config JSON NOT NULL, -- 计算器配置、公式、字段定义等
    FOREIGN KEY (calculator_id) REFERENCES calculators(id)
);
```

### 3. API 设计 (Cloudflare Workers)

#### 核心 API 端点
```javascript
// 获取所有语言
GET /api/languages

// 获取指定语言的计算器列表
GET /api/calculators?lang=en

// 获取计算器详情
GET /api/calculators/{slug}?lang=en

// 执行计算
POST /api/calculate/{slug}
{
  "inputs": {...},
  "lang": "en"
}

// 获取分类列表
GET /api/categories?lang=en
```

### 4. 前端架构

#### 路由结构
```
/                    - 首页 (根据用户语言自动跳转)
/{lang}             - 指定语言首页
/{lang}/calc/{slug} - 计算器页面
/{lang}/convert     - 转换器页面
```

#### 组件设计
```javascript
// 语言切换器
<LanguageSwitcher />

// 计算器列表
<CalculatorGrid lang={lang} />

// 通用计算器组件
<Calculator 
  slug={slug}
  lang={lang}
  config={config}
/>

// 导航菜单
<Navigation lang={lang} />
```

### 5. 部署架构

#### Cloudflare Pages 配置
```toml
# wrangler.toml
[env.production]
name = "intlcalc"
compatibility_date = "2024-01-01"

[[env.production.d1_databases]]
binding = "DB"
database_name = "intlcalc-db"
database_id = "xxx"

[env.production.functions]
directory = "functions"
```

#### 目录结构
```
/
├── src/
│   ├── components/     # React 组件
│   ├── pages/         # 页面组件
│   ├── hooks/         # 自定义 hooks
│   ├── utils/         # 工具函数
│   └── i18n/          # 国际化配置
├── functions/         # Cloudflare Functions
│   ├── api/
│   │   ├── languages.js
│   │   ├── calculators.js
│   │   └── calculate.js
│   └── middleware/
├── public/            # 静态资源
└── database/          # 数据库迁移文件
```

### 6. 多语言实现

#### 语言检测
```javascript
// 自动检测用户语言
function detectLanguage() {
  const browserLang = navigator.language.split('-')[0];
  const supportedLangs = ['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko', 'pt', 'ru', 'ar'];
  return supportedLangs.includes(browserLang) ? browserLang : 'en';
}
```

#### 内容获取
```javascript
// 从数据库获取多语言内容
async function getCalculatorContent(slug, lang) {
  const response = await fetch(`/api/calculators/${slug}?lang=${lang}`);
  return response.json();
}
```

### 7. 优势

1. **统一管理**: 所有内容在数据库中统一管理
2. **动态更新**: 无需重新部署即可更新内容
3. **多语言支持**: 数据库驱动的多语言系统
4. **性能优化**: Cloudflare 全球 CDN
5. **成本控制**: 按使用量计费
6. **扩展性强**: 易于添加新计算器和语言

### 8. 迁移计划

1. **第一阶段**: 搭建基础架构
   - 创建 D1 数据库
   - 部署 Cloudflare Workers
   - 设计 API 接口

2. **第二阶段**: 前端重构
   - 使用 React/Vue.js 重构前端
   - 实现多语言路由
   - 集成 API 调用

3. **第三阶段**: 数据迁移
   - 将现有计算器数据导入数据库
   - 测试多语言功能
   - 性能优化

4. **第四阶段**: 部署上线
   - 配置域名和 CDN
   - 监控和日志
   - 用户反馈收集

这个架构将大大提升系统的可维护性和扩展性！ 