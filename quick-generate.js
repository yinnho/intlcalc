const fs = require('fs-extra');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

class QuickPageGenerator {
    constructor() {
        this.languages = ['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko', 'pt', 'ru', 'ar'];
        this.outputDir = path.join(__dirname, 'generated_pages');
        this.sourceDir = path.join(__dirname, 'generated_calculators');
        this.dbPath = path.join(__dirname, 'data/calculators.db');
    }

    async init() {
        // 确保数据库连接
        this.db = new sqlite3.Database(this.dbPath);
        
        // 确保输出目录存在
        await fs.ensureDir(this.outputDir);
    }

    async loadExistingCalculators() {
        console.log('📋 加载现有计算器文件...');
        
        const files = await fs.readdir(this.sourceDir);
        const calculators = [];
        
        for (const file of files) {
            if (file.endsWith('.html') && file !== 'index.html') {
                const name = file.replace('.html', '');
                const slug = name.toLowerCase().replace(/[^a-z0-9-]/g, '-');
                
                calculators.push({
                    id: calculators.length + 1,
                    name: this.formatName(name),
                    slug: slug,
                    filename: file,
                    category: this.detectCategory(name),
                    type: this.detectType(name)
                });
            }
        }
        
        console.log(`发现 ${calculators.length} 个计算器文件`);
        return calculators;
    }

    formatName(name) {
        return name.split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    detectCategory(name) {
        const lowerName = name.toLowerCase();
        
        if (lowerName.includes('converter') || lowerName.includes('convert')) return 'convert';
        if (lowerName.includes('percentage') || lowerName.includes('percent')) return 'calc';
        if (lowerName.includes('loan') || lowerName.includes('interest') || lowerName.includes('finance')) return 'calc';
        if (lowerName.includes('scientific') || lowerName.includes('math') || lowerName.includes('basic')) return 'calc';
        if (lowerName.includes('bmi') || lowerName.includes('age') || lowerName.includes('body')) return 'calc';
        if (lowerName.includes('temperature') || lowerName.includes('length') || lowerName.includes('weight')) return 'convert';
        
        return 'calc'; // 默认分类
    }

    detectType(name) {
        const lowerName = name.toLowerCase();
        
        if (lowerName.includes('converter') || lowerName.includes('convert')) return 'converter';
        if (lowerName.includes('scientific')) return 'scientific';
        if (lowerName.includes('basic')) return 'basic';
        
        return 'formula'; // 默认类型
    }

    async generateLanguageStructure() {
        console.log('🏗️  生成语言目录结构...');
        
        for (const lang of this.languages) {
            const langDir = path.join(this.outputDir, lang);
            await fs.ensureDir(langDir);
            await fs.ensureDir(path.join(langDir, 'calc'));
            await fs.ensureDir(path.join(langDir, 'convert'));
            await fs.ensureDir(path.join(langDir, 'css'));
            await fs.ensureDir(path.join(langDir, 'js'));
            await fs.ensureDir(path.join(langDir, 'images'));
        }
    }

    async copyCalculatorFiles(calculators) {
        console.log('📁 复制计算器文件到各语言目录...');
        
        for (const calculator of calculators) {
            const sourceFile = path.join(this.sourceDir, calculator.filename);
            const content = await fs.readFile(sourceFile, 'utf8');
            
            for (const lang of this.languages) {
                const targetDir = path.join(this.outputDir, lang, calculator.category);
                const targetFile = path.join(targetDir, calculator.filename);
                
                // 生成本地化内容
                const localizedContent = this.localizeContent(content, lang, calculator);
                
                await fs.writeFile(targetFile, localizedContent, 'utf8');
            }
        }
    }

    localizeContent(content, lang, calculator) {
        // 基本本地化 - 替换标题和一些文本
        const translations = this.getTranslations(lang);
        
        let localized = content;
        
        // 替换 lang 属性
        localized = localized.replace(/lang="en"/g, `lang="${lang}"`);
        
        // 替换一些通用文本
        Object.keys(translations).forEach(key => {
            const pattern = new RegExp(key, 'gi');
            localized = localized.replace(pattern, translations[key]);
        });
        
        return localized;
    }

    getTranslations(lang) {
        const translations = {
            'en': {
                'Calculator': 'Calculator',
                'Calculate': 'Calculate',
                'Clear': 'Clear',
                'Result': 'Result'
            },
            'zh': {
                'Calculator': '计算器',
                'Calculate': '计算',
                'Clear': '清除',
                'Result': '结果'
            },
            'es': {
                'Calculator': 'Calculadora',
                'Calculate': 'Calcular',
                'Clear': 'Limpiar',
                'Result': 'Resultado'
            },
            'fr': {
                'Calculator': 'Calculatrice',
                'Calculate': 'Calculer',
                'Clear': 'Effacer',
                'Result': 'Résultat'
            },
            'de': {
                'Calculator': 'Rechner',
                'Calculate': 'Berechnen',
                'Clear': 'Löschen',
                'Result': 'Ergebnis'
            },
            'ja': {
                'Calculator': '計算機',
                'Calculate': '計算',
                'Clear': 'クリア',
                'Result': '結果'
            },
            'ko': {
                'Calculator': '계산기',
                'Calculate': '계산',
                'Clear': '지우기',
                'Result': '결과'
            },
            'pt': {
                'Calculator': 'Calculadora',
                'Calculate': 'Calcular',
                'Clear': 'Limpar',
                'Result': 'Resultado'
            },
            'ru': {
                'Calculator': 'Калькулятор',
                'Calculate': 'Вычислить',
                'Clear': 'Очистить',
                'Result': 'Результат'
            },
            'ar': {
                'Calculator': 'آلة حاسبة',
                'Calculate': 'احسب',
                'Clear': 'مسح',
                'Result': 'النتيجة'
            }
        };
        
        return translations[lang] || translations['en'];
    }

    async generateIndexPages(calculators) {
        console.log('📝 生成索引页面...');
        
        for (const lang of this.languages) {
            const translations = this.getTranslations(lang);
            const langName = this.getLanguageName(lang);
            
            const indexContent = this.generateIndexHTML(calculators, lang, translations, langName);
            const indexFile = path.join(this.outputDir, lang, 'index.html');
            
            await fs.writeFile(indexFile, indexContent, 'utf8');
        }
    }

    getLanguageName(lang) {
        const names = {
            'en': 'English',
            'zh': '中文',
            'es': 'Español',
            'fr': 'Français',
            'de': 'Deutsch',
            'ja': '日本語',
            'ko': '한국어',
            'pt': 'Português',
            'ru': 'Русский',
            'ar': 'العربية'
        };
        return names[lang] || lang;
    }

    generateIndexHTML(calculators, lang, translations, langName) {
        const calcList = calculators.filter(c => c.category === 'calc');
        const convertList = calculators.filter(c => c.category === 'convert');
        
        return `<!DOCTYPE html>
<html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>International ${translations.Calculator} - Online Tools</title>
    <meta name="description" content="Professional online calculators and converters for all your calculation needs">
    <style>
        body { font-family: system-ui, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { text-align: center; color: #333; margin-bottom: 30px; }
        .category { margin-bottom: 40px; }
        .category h2 { color: #2196F3; border-bottom: 2px solid #2196F3; padding-bottom: 10px; }
        .calculator-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
        .calculator-card { background: #f8f9fa; padding: 20px; border-radius: 6px; border-left: 4px solid #2196F3; }
        .calculator-card h3 { margin: 0 0 10px 0; }
        .calculator-card a { color: #2196F3; text-decoration: none; font-weight: 500; }
        .calculator-card a:hover { text-decoration: underline; }
        .language-info { text-align: center; margin-bottom: 20px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="language-info">🌍 ${langName}</div>
        <h1>International ${translations.Calculator}</h1>
        
        <div class="category">
            <h2>📊 ${translations.Calculator}s</h2>
            <div class="calculator-grid">
                ${calcList.map(calc => `
                    <div class="calculator-card">
                        <h3><a href="calc/${calc.filename}">${calc.name}</a></h3>
                        <p>Professional ${calc.name.toLowerCase()} tool</p>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="category">
            <h2>🔄 Converters</h2>
            <div class="calculator-grid">
                ${convertList.map(calc => `
                    <div class="calculator-card">
                        <h3><a href="convert/${calc.filename}">${calc.name}</a></h3>
                        <p>Convert units easily with ${calc.name.toLowerCase()}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    </div>
</body>
</html>`;
    }

    async run() {
        console.log('🚀 开始快速页面生成...\n');
        
        await this.init();
        
        // 加载现有计算器
        const calculators = await this.loadExistingCalculators();
        
        // 生成目录结构
        await this.generateLanguageStructure();
        
        // 复制和本地化计算器文件
        await this.copyCalculatorFiles(calculators);
        
        // 生成索引页面
        await this.generateIndexPages(calculators);
        
        console.log('\n✅ 快速页面生成完成！');
        console.log(`📁 输出目录: ${this.outputDir}`);
        console.log(`🌍 支持语言: ${this.languages.join(', ')}`);
        console.log(`📊 计算器数量: ${calculators.length}`);
        
        // 显示生成的结构
        console.log('\n📋 生成的页面结构:');
        for (const lang of this.languages) {
            console.log(`  ${lang}/`);
            console.log(`    index.html`);
            console.log(`    calc/ (${calculators.filter(c => c.category === 'calc').length} 个计算器)`);
            console.log(`    convert/ (${calculators.filter(c => c.category === 'convert').length} 个转换器)`);
        }
    }
}

// 运行生成器
if (require.main === module) {
    const generator = new QuickPageGenerator();
    generator.run().catch(console.error);
}

module.exports = QuickPageGenerator; 