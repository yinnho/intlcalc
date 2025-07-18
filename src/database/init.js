const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class DatabaseInitializer {
    constructor() {
        this.dbPath = path.join(__dirname, '../../data/calculators.db');
        this.db = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(this.dbPath, (err) => {
                if (err) {
                    console.error('数据库连接失败:', err);
                    reject(err);
                } else {
                    console.log('数据库连接成功');
                    this.createTables().then(resolve).catch(reject);
                }
            });
        });
    }

    async createTables() {
        const tables = [
            // 计算器主表
            `CREATE TABLE IF NOT EXISTS calculators (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(255) NOT NULL,
                slug VARCHAR(255) UNIQUE NOT NULL,
                category VARCHAR(100) NOT NULL,
                subcategory VARCHAR(100),
                url VARCHAR(500) NOT NULL,
                title VARCHAR(500),
                description TEXT,
                keywords TEXT,
                calculator_type TEXT DEFAULT 'formula' CHECK (calculator_type IN ('scientific', 'formula', 'converter', 'statistical', 'query')),
                input_type VARCHAR(100),
                output_type VARCHAR(100),
                scraped_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'processing'))
            )`,

            // HTML结构表
            `CREATE TABLE IF NOT EXISTS html_structures (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                calculator_id INTEGER NOT NULL,
                element_type VARCHAR(100) NOT NULL,
                element_tag VARCHAR(50),
                element_classes TEXT,
                element_id VARCHAR(100),
                element_html TEXT,
                element_text TEXT,
                parent_element_id INTEGER,
                position_order INTEGER DEFAULT 0,
                is_input BOOLEAN DEFAULT FALSE,
                is_output BOOLEAN DEFAULT FALSE,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (calculator_id) REFERENCES calculators(id)
            )`,

            // CSS样式表
            `CREATE TABLE IF NOT EXISTS css_styles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                calculator_id INTEGER NOT NULL,
                selector_text VARCHAR(500),
                css_rules TEXT NOT NULL,
                media_query VARCHAR(200),
                css_type TEXT DEFAULT 'internal' CHECK (css_type IN ('inline', 'internal', 'external')),
                file_url VARCHAR(500),
                priority INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (calculator_id) REFERENCES calculators(id)
            )`,

            // JavaScript代码表
            `CREATE TABLE IF NOT EXISTS javascript_code (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                calculator_id INTEGER NOT NULL,
                function_name VARCHAR(200),
                function_type TEXT DEFAULT 'calculation' CHECK (function_type IN ('calculation', 'ui', 'validation', 'utility', 'event')),
                code_content TEXT NOT NULL,
                parameters TEXT,
                return_type VARCHAR(100),
                dependencies TEXT,
                is_main_function BOOLEAN DEFAULT FALSE,
                file_url VARCHAR(500),
                line_start INTEGER,
                line_end INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (calculator_id) REFERENCES calculators(id)
            )`,

            // 计算公式表
            `CREATE TABLE IF NOT EXISTS calculation_formulas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                calculator_id INTEGER NOT NULL,
                formula_name VARCHAR(200) NOT NULL,
                formula_expression TEXT NOT NULL,
                formula_description TEXT,
                input_variables TEXT,
                output_variable VARCHAR(100),
                validation_rules TEXT,
                example_input TEXT,
                example_output TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (calculator_id) REFERENCES calculators(id)
            )`,

            // 输入配置表
            `CREATE TABLE IF NOT EXISTS input_configs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                calculator_id INTEGER NOT NULL,
                input_name VARCHAR(200) NOT NULL,
                input_type TEXT DEFAULT 'number' CHECK (input_type IN ('number', 'text', 'select', 'radio', 'checkbox', 'range', 'date')),
                input_label VARCHAR(300),
                placeholder_text VARCHAR(300),
                default_value VARCHAR(200),
                min_value DECIMAL(20,6),
                max_value DECIMAL(20,6),
                step_value DECIMAL(20,6),
                required BOOLEAN DEFAULT FALSE,
                validation_pattern VARCHAR(500),
                options_json TEXT,
                position_order INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (calculator_id) REFERENCES calculators(id)
            )`,

            // 输出配置表
            `CREATE TABLE IF NOT EXISTS output_configs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                calculator_id INTEGER NOT NULL,
                output_name VARCHAR(200) NOT NULL,
                output_label VARCHAR(300),
                output_type TEXT DEFAULT 'number' CHECK (output_type IN ('number', 'text', 'chart', 'table', 'list')),
                format_pattern VARCHAR(200),
                decimal_places INTEGER DEFAULT 2,
                unit VARCHAR(50),
                description TEXT,
                position_order INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (calculator_id) REFERENCES calculators(id)
            )`,

            // 多语言内容表
            `CREATE TABLE IF NOT EXISTS multilang_content (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                calculator_id INTEGER NOT NULL,
                language_code VARCHAR(10) NOT NULL DEFAULT 'en',
                content_key VARCHAR(200) NOT NULL,
                content_value TEXT NOT NULL,
                content_type TEXT DEFAULT 'label' CHECK (content_type IN ('title', 'description', 'label', 'placeholder', 'help_text', 'example')),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (calculator_id) REFERENCES calculators(id),
                UNIQUE(calculator_id, language_code, content_key)
            )`,

            // 页面模板表
            `CREATE TABLE IF NOT EXISTS page_templates (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                template_name VARCHAR(200) NOT NULL UNIQUE,
                template_type TEXT DEFAULT 'calculator' CHECK (template_type IN ('layout', 'calculator', 'component')),
                html_template TEXT NOT NULL,
                css_template TEXT,
                js_template TEXT,
                variables_json TEXT,
                description TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,

            // 生成历史表
            `CREATE TABLE IF NOT EXISTS generation_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                calculator_id INTEGER NOT NULL,
                generated_files_json TEXT,
                generation_status TEXT DEFAULT 'processing' CHECK (generation_status IN ('success', 'failed', 'processing')),
                error_message TEXT,
                output_directory VARCHAR(500),
                generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (calculator_id) REFERENCES calculators(id)
            )`
        ];

        for (const tableSQL of tables) {
            await this.executeSQL(tableSQL);
        }

        // 创建索引
        const indexes = [
            'CREATE INDEX IF NOT EXISTS idx_calculators_slug ON calculators(slug)',
            'CREATE INDEX IF NOT EXISTS idx_calculators_category ON calculators(category)',
            'CREATE INDEX IF NOT EXISTS idx_html_calculator_id ON html_structures(calculator_id)',
            'CREATE INDEX IF NOT EXISTS idx_css_calculator_id ON css_styles(calculator_id)',
            'CREATE INDEX IF NOT EXISTS idx_js_calculator_id ON javascript_code(calculator_id)',
            'CREATE INDEX IF NOT EXISTS idx_formula_calculator_id ON calculation_formulas(calculator_id)',
            'CREATE INDEX IF NOT EXISTS idx_multilang_calculator_lang ON multilang_content(calculator_id, language_code)'
        ];

        for (const indexSQL of indexes) {
            await this.executeSQL(indexSQL);
        }

        console.log('所有数据表和索引创建完成');
    }

    executeSQL(sql) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, (err) => {
                if (err) {
                    console.error('SQL执行失败:', err);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    close() {
        if (this.db) {
            this.db.close((err) => {
                if (err) {
                    console.error('数据库关闭失败:', err);
                } else {
                    console.log('数据库连接已关闭');
                }
            });
        }
    }
}

// 如果直接运行此文件，初始化数据库
if (require.main === module) {
    const initializer = new DatabaseInitializer();
    initializer.init()
        .then(() => {
            console.log('数据库初始化完成');
            initializer.close();
        })
        .catch((err) => {
            console.error('数据库初始化失败:', err);
            initializer.close();
        });
}

module.exports = DatabaseInitializer; 