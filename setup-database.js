const { execSync } = require('child_process');

console.log('🚀 开始设置 IntlCalc 数据库架构...\n');

// 1. 创建 D1 数据库
console.log('📊 创建 D1 数据库...');
try {
    execSync('npx wrangler d1 create intlcalc-db', { stdio: 'inherit' });
    console.log('✅ D1 数据库创建成功\n');
} catch (error) {
    console.log('⚠️ 数据库可能已存在，继续下一步...\n');
}

// 2. 创建数据库迁移文件
console.log('📝 创建数据库迁移文件...');

const migrationSQL = `
-- 语言配置表
CREATE TABLE IF NOT EXISTS languages (
    id INTEGER PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    native_name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 计算器分类表
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 分类多语言内容表
CREATE TABLE IF NOT EXISTS category_translations (
    id INTEGER PRIMARY KEY,
    category_id INTEGER,
    language_code TEXT,
    name TEXT NOT NULL,
    description TEXT,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (language_code) REFERENCES languages(code)
);

-- 计算器表
CREATE TABLE IF NOT EXISTS calculators (
    id INTEGER PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    category_id INTEGER,
    icon TEXT,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- 计算器多语言内容表
CREATE TABLE IF NOT EXISTS calculator_translations (
    id INTEGER PRIMARY KEY,
    calculator_id INTEGER,
    language_code TEXT,
    title TEXT NOT NULL,
    description TEXT,
    instructions TEXT,
    FOREIGN KEY (calculator_id) REFERENCES calculators(id),
    FOREIGN KEY (language_code) REFERENCES languages(code)
);

-- 计算器配置表
CREATE TABLE IF NOT EXISTS calculator_configs (
    id INTEGER PRIMARY KEY,
    calculator_id INTEGER,
    config TEXT NOT NULL,
    FOREIGN KEY (calculator_id) REFERENCES calculators(id)
);

-- 插入基础语言数据
INSERT OR IGNORE INTO languages (code, name, native_name) VALUES
('en', 'English', 'English'),
('zh', 'Chinese', '中文'),
('es', 'Spanish', 'Español'),
('fr', 'French', 'Français'),
('de', 'German', 'Deutsch'),
('ja', 'Japanese', '日本語'),
('ko', 'Korean', '한국어'),
('pt', 'Portuguese', 'Português'),
('ru', 'Russian', 'Русский'),
('ar', 'Arabic', 'العربية');

-- 插入基础分类
INSERT OR IGNORE INTO categories (slug) VALUES
('financial'),
('math'),
('health'),
('conversion'),
('time'),
('other');

-- 插入分类翻译
INSERT OR IGNORE INTO category_translations (category_id, language_code, name, description) VALUES
(1, 'en', 'Financial Calculators', 'Calculate loans, interest, investments and more'),
(1, 'zh', '金融计算器', '计算贷款、利息、投资等'),
(2, 'en', 'Math Calculators', 'Basic and advanced mathematical calculations'),
(2, 'zh', '数学计算器', '基础和高级数学计算'),
(3, 'en', 'Health & Fitness', 'BMI, calorie, and health-related calculations'),
(3, 'zh', '健康与健身', 'BMI、卡路里和健康相关计算'),
(4, 'en', 'Unit Converters', 'Convert between different units of measurement'),
(4, 'zh', '单位转换器', '在不同测量单位之间转换'),
(5, 'en', 'Time & Date', 'Age, date, and time calculations'),
(5, 'zh', '时间与日期', '年龄、日期和时间计算'),
(6, 'en', 'Other Tools', 'Miscellaneous calculation tools'),
(6, 'zh', '其他工具', '杂项计算工具');

-- 插入基础计算器
INSERT OR IGNORE INTO calculators (slug, category_id, icon) VALUES
('basic-math', 2, 'calculator'),
('scientific', 2, 'function'),
('percentage', 2, 'percent'),
('interest', 1, 'trending-up'),
('loan', 1, 'credit-card'),
('bmi', 3, 'activity'),
('age', 5, 'calendar'),
('length-converter', 4, 'ruler');

-- 插入计算器翻译
INSERT OR IGNORE INTO calculator_translations (calculator_id, language_code, title, description) VALUES
(1, 'en', 'Basic Math Calculator', 'Simple arithmetic calculations'),
(1, 'zh', '基础数学计算器', '简单算术计算'),
(2, 'en', 'Scientific Calculator', 'Advanced mathematical functions'),
(2, 'zh', '科学计算器', '高级数学函数'),
(3, 'en', 'Percentage Calculator', 'Calculate percentages and changes'),
(3, 'zh', '百分比计算器', '计算百分比和变化'),
(4, 'en', 'Interest Calculator', 'Calculate simple and compound interest'),
(4, 'zh', '利息计算器', '计算单利和复利'),
(5, 'en', 'Loan Calculator', 'Calculate loan payments and schedules'),
(5, 'zh', '贷款计算器', '计算贷款付款和计划'),
(6, 'en', 'BMI Calculator', 'Calculate Body Mass Index'),
(6, 'zh', 'BMI计算器', '计算身体质量指数'),
(7, 'en', 'Age Calculator', 'Calculate age from birth date'),
(7, 'zh', '年龄计算器', '根据出生日期计算年龄'),
(8, 'en', 'Length Converter', 'Convert between length units'),
(8, 'zh', '长度转换器', '在长度单位之间转换');

-- 插入计算器配置
INSERT OR IGNORE INTO calculator_configs (calculator_id, config) VALUES
(1, '{"type": "basic", "fields": [], "operations": ["add", "subtract", "multiply", "divide"]}'),
(2, '{"type": "scientific", "fields": [], "operations": ["sin", "cos", "tan", "log", "ln", "sqrt", "power"]}'),
(3, '{"type": "percentage", "fields": [{"name": "value", "label": "Value", "type": "number"}, {"name": "percentage", "label": "Percentage", "type": "number"}]}'),
(4, '{"type": "interest", "fields": [{"name": "principal", "label": "Principal", "type": "number"}, {"name": "rate", "label": "Rate (%)", "type": "number"}, {"name": "time", "label": "Time (years)", "type": "number"}]}'),
(5, '{"type": "loan", "fields": [{"name": "amount", "label": "Loan Amount", "type": "number"}, {"name": "rate", "label": "Interest Rate (%)", "type": "number"}, {"name": "term", "label": "Loan Term (years)", "type": "number"}]}'),
(6, '{"type": "bmi", "fields": [{"name": "weight", "label": "Weight (kg)", "type": "number"}, {"name": "height", "label": "Height (cm)", "type": "number"}]}'),
(7, '{"type": "age", "fields": [{"name": "birthdate", "label": "Birth Date", "type": "date"}]}'),
(8, '{"type": "converter", "fields": [{"name": "value", "label": "Value", "type": "number"}, {"name": "from_unit", "label": "From", "type": "select", "options": ["meters", "feet", "inches", "cm", "mm"]}, {"name": "to_unit", "label": "To", "type": "select", "options": ["meters", "feet", "inches", "cm", "mm"]}]}');
`;

// 写入迁移文件
const fs = require('fs');
const path = require('path');

// 创建 database 目录
if (!fs.existsSync('database')) {
    fs.mkdirSync('database');
}

// 写入迁移文件
fs.writeFileSync('database/001_initial_schema.sql', migrationSQL);
console.log('✅ 数据库迁移文件创建成功\n');

// 3. 创建 wrangler.toml 配置
console.log('⚙️ 创建 wrangler.toml 配置...');

const wranglerConfig = `name = "intlcalc"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"
database_name = "intlcalc-db"
database_id = "YOUR_DATABASE_ID" # 需要替换为实际的数据库ID

[functions]
directory = "functions"

[env.production]
name = "intlcalc"
compatibility_date = "2024-01-01"

[[env.production.d1_databases]]
binding = "DB"
database_name = "intlcalc-db"
database_id = "YOUR_DATABASE_ID" # 需要替换为实际的数据库ID

[env.production.functions]
directory = "functions"
`;

fs.writeFileSync('wrangler.toml', wranglerConfig);
console.log('✅ wrangler.toml 配置创建成功\n');

console.log('🎉 数据库架构设置完成！');
console.log('\n📋 下一步操作：');
console.log('1. 运行 "npx wrangler d1 execute intlcalc-db --file=./database/001_initial_schema.sql" 执行迁移');
console.log('2. 更新 wrangler.toml 中的 database_id');
console.log('3. 创建 Cloudflare Functions');
console.log('4. 部署到 Cloudflare Pages'); 