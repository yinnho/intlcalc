const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs-extra');
const handlebars = require('handlebars');
const prettier = require('prettier');
const UglifyJS = require('uglify-js');

class PageGenerator {
    constructor() {
        this.dbPath = path.join(__dirname, '../../data/calculators.db');
        this.db = null;
        this.outputDir = path.join(__dirname, '../../generated_pages');
        this.templateDir = path.join(__dirname, '../templates');
        this.parsedDataDir = path.join(__dirname, '../../parsed_data');
        
        // 支持的语言
        this.languages = ['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko', 'pt', 'ru', 'ar'];
        
        // 注册Handlebars助手
        this.registerHandlebarsHelpers();
    }

    async init() {
        this.db = new sqlite3.Database(this.dbPath);
        
        // 确保输出目录存在
        await fs.ensureDir(this.outputDir);
        await fs.ensureDir(this.templateDir);
        
        // 为每种语言创建目录
        for (const lang of this.languages) {
            await fs.ensureDir(path.join(this.outputDir, lang));
            await fs.ensureDir(path.join(this.outputDir, lang, 'css'));
            await fs.ensureDir(path.join(this.outputDir, lang, 'js'));
            await fs.ensureDir(path.join(this.outputDir, lang, 'images'));
        }
        
        // 创建共享资源目录
        await fs.ensureDir(path.join(this.outputDir, 'shared'));
        await fs.ensureDir(path.join(this.outputDir, 'shared', 'css'));
        await fs.ensureDir(path.join(this.outputDir, 'shared', 'js'));
        
        console.log('页面生成器初始化完成');
    }

    async generateAllPages() {
        console.log('开始生成所有计算器页面...');
        
        // 获取所有活跃的计算器
        const calculators = await this.queryDatabase(
            'SELECT * FROM calculators WHERE status = "active"'
        );
        
        console.log('找到 ${calculators.length} 个计算器需要生成页面');
        
        // 首先生成基础模板和共享资源
        await this.generateBaseTemplates();
        await this.generateSharedResources();
        
        // 生成首页和索引页面
        await this.generateIndexPages(calculators);
        
        // 为每个计算器生成页面
        for (const calculator of calculators) {
            try {
                await this.generateCalculatorPages(calculator);
                console.log('成功生成页面: ${calculator.name}');
            } catch (error) {
                console.error('生成页面失败 ${calculator.name}:', error);
            }
        }
        
        // 生成站点地图
        await this.generateSitemap(calculators);
        
        console.log('所有页面生成完成');
    }

    async generateCalculatorPages(calculator) {
        // 加载解析数据
        const analysisPath = path.join(this.parsedDataDir, '${calculator.id}_analysis.json');
        let analysisData = {};
        
        try {
            if (await fs.pathExists(analysisPath)) {
                const content = await fs.readFile(analysisPath, 'utf8');
                analysisData = JSON.parse(content);
            }
        } catch (error) {
            console.warn('无法加载解析数据:', error.message);
        }
        
        // 获取计算器的详细数据
        const detailedData = await this.getCalculatorDetailedData(calculator.id);
        
        // 为每种语言生成页面
        for (const lang of this.languages) {
            await this.generateCalculatorPageForLanguage(
                calculator, 
                detailedData, 
                analysisData, 
                lang
            );
        }
    }

    async generateCalculatorPageForLanguage(calculator, detailedData, analysisData, lang) {
        // 准备页面数据
        const pageData = await this.preparePageData(calculator, detailedData, analysisData, lang);
        
        // 选择合适的模板
        const template = this.selectTemplate(calculator.calculator_type);
        
        // 生成HTML
        const html = await this.generateHTML(template, pageData);
        
        // 生成CSS
        const css = await this.generateCSS(pageData, analysisData.cssAnalysis);
        
        // 生成JavaScript
        const js = await this.generateJavaScript(pageData, analysisData.jsAnalysis);
        
        // 保存文件
        const outputPath = path.join(this.outputDir, lang, calculator.slug);
        await fs.ensureDir(outputPath);
        
        // 保存HTML文件
        await fs.writeFile(
            path.join(outputPath, 'index.html'),
            await this.formatHTML(html),
            'utf8'
        );
        
        // 保存CSS文件
        await fs.writeFile(
            path.join(outputPath, 'style.css'),
            await this.formatCSS(css),
            'utf8'
        );
        
        // 保存JavaScript文件
        await fs.writeFile(
            path.join(outputPath, 'script.js'),
            await this.formatJavaScript(js),
            'utf8'
        );
        
        // 生成示例数据文件
        await this.generateExampleData(calculator, lang, outputPath);
        
        console.log('生成 ${lang} 页面: ${calculator.name}');
    }

    async preparePageData(calculator, detailedData, analysisData, lang) {
        // 获取多语言内容
        const multilangContent = await this.getMultilangContent(calculator.id, lang);
        
        const pageData = {
            // 基本信息
            calculator: {
                id: calculator.id,
                name: this.getLocalizedText(multilangContent, 'name', calculator.name),
                slug: calculator.slug,
                title: this.getLocalizedText(multilangContent, 'title', calculator.title),
                description: this.getLocalizedText(multilangContent, 'description', calculator.description),
                keywords: calculator.keywords,
                category: calculator.category,
                type: calculator.calculator_type,
                url: calculator.url
            },
            
            // 语言信息
            lang: {
                code: lang,
                name: this.getLanguageName(lang),
                direction: this.getTextDirection(lang)
            },
            
            // UI组件
            ui: {
                inputs: this.prepareInputComponents(detailedData.inputs, multilangContent, lang),
                outputs: this.prepareOutputComponents(detailedData.outputs, multilangContent, lang),
                buttons: this.prepareButtonComponents(multilangContent, lang)
            },
            
            // 计算逻辑
            calculation: {
                formulas: detailedData.formulas || [],
                steps: analysisData.calculationAnalysis?.steps || [],
                variables: analysisData.calculationAnalysis?.variables || []
            },
            
            // 页面内容
            content: {
                examples: this.generateExamples(calculator, lang),
                helpText: this.getLocalizedText(multilangContent, 'help_text', ''),
                relatedLinks: await this.getRelatedCalculators(calculator, lang)
            },
            
            // SEO数据
            seo: {
                canonicalUrl: this.buildCanonicalUrl(calculator.slug, lang),
                alternateUrls: this.buildAlternateUrls(calculator.slug),
                structuredData: this.generateStructuredData(calculator, lang)
            },
            
            // 模板变量
            year: new Date().getFullYear(),
            buildTime: new Date().toISOString(),
            version: '1.0.0'
        };
        
        return pageData;
    }

    selectTemplate(calculatorType) {
        const templateMap = {
            'scientific': 'scientific-calculator.hbs',
            'formula': 'formula-calculator.hbs',
            'converter': 'unit-converter.hbs',
            'statistical': 'statistical-calculator.hbs',
            'query': 'data-query.hbs'
        };
        
        return templateMap[calculatorType] || 'formula-calculator.hbs';
    }

    async generateHTML(templateName, pageData) {
        const templatePath = path.join(this.templateDir, templateName);
        
        // 如果模板不存在，使用默认模板
        if (!await fs.pathExists(templatePath)) {
            return this.generateDefaultHTML(pageData);
        }
        
        const templateContent = await fs.readFile(templatePath, 'utf8');
        const template = handlebars.compile(templateContent);
        
        return template(pageData);
    }

    generateDefaultHTML(pageData) {
        const { calculator, lang, ui, content, seo } = pageData;
        
        return `<!DOCTYPE html>
<html lang="${lang.code}" dir="${lang.direction}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${calculator.title} - ${this.getLocalizedText({}, 'calculator', 'Calculator')}</title>
    <meta name="description" content="${calculator.description}">
    <meta name="keywords" content="${calculator.keywords}">
    <link rel="canonical" href="${seo.canonicalUrl}">
    ${seo.alternateUrls.map(url => '<link rel="alternate" hreflang="' + url.lang + '" href="' + url.url + '">').join('\n    ')}
    <link rel="stylesheet" href="style.css">
    <script type="application/ld+json">${JSON.stringify(seo.structuredData)}</script>
</head>
<body>
    <header class="calculator-header">
        <nav class="breadcrumb">
            <a href="/">${this.getLocalizedText({}, 'home', 'Home')}</a> &gt;
            <a href="/calculators">${this.getLocalizedText({}, 'calculators', 'Calculators')}</a> &gt;
            <span>${calculator.name}</span>
        </nav>
        <h1>${calculator.title}</h1>
        <p class="description">${calculator.description}</p>
    </header>

    <main class="calculator-main">
        <div class="calculator-container">
            <form class="calculator-form" onsubmit="return false;">
                <div class="input-section">
                    <h2>${this.getLocalizedText({}, 'inputs', 'Inputs')}</h2>
                    ${ui.inputs.map(input => this.generateInputHTML(input)).join('\n                    ')}
                </div>

                <div class="control-section">
                    ${ui.buttons.map(button => this.generateButtonHTML(button)).join('\n                    ')}
                </div>

                <div class="output-section">
                    <h2>${this.getLocalizedText({}, 'results', 'Results')}</h2>
                    ${ui.outputs.map(output => this.generateOutputHTML(output)).join('\n                    ')}
                </div>
            </form>
        </div>

        <div class="content-section">
            <div class="examples">
                <h2>${this.getLocalizedText({}, 'examples', 'Examples')}</h2>
                ${content.examples.map(example => this.generateExampleHTML(example)).join('\n                ')}
            </div>

            <div class="help">
                <h2>${this.getLocalizedText({}, 'how_to_use', 'How to Use')}</h2>
                <p>${content.helpText}</p>
            </div>

            <div class="related">
                <h2>${this.getLocalizedText({}, 'related_calculators', 'Related Calculators')}</h2>
                <ul>
                    ${content.relatedLinks.map(link => '<li><a href="' + link.url + '">' + link.title + '</a></li>').join('\n                    ')}
                </ul>
            </div>
        </div>
    </main>

    <footer class="calculator-footer">
        <p>&copy; ${pageData.year} Calculator Website. All rights reserved.</p>
    </footer>

    <script src="script.js"></script>
</body>
</html>`;
    }

    async generateCSS(pageData, cssAnalysis) {
        const { lang } = pageData;
        
        let css = `/* Calculator Styles - ${lang.code} */\n\n`;
        
        // 基础样式
        css += `* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f8f9fa;
    direction: ${lang.direction};
}

.calculator-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 2rem 1rem;
    text-align: center;
}

.breadcrumb {
    margin-bottom: 1rem;
    font-size: 0.9rem;
}

.breadcrumb a {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
}

.breadcrumb a:hover {
    color: white;
}

.calculator-header h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    font-weight: 300;
}

.description {
    font-size: 1.1rem;
    opacity: 0.9;
    max-width: 600px;
    margin: 0 auto;
}

.calculator-main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 2rem;
}

.calculator-container {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.input-section, .output-section {
    margin: 1.5rem 0;
}

.input-section h2, .output-section h2 {
    color: #495057;
    margin-bottom: 1rem;
    font-size: 1.2rem;
}

.input-group {
    margin-bottom: 1rem;
}

.input-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #495057;
}

.input-group input, .input-group select {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e9ecef;
    border-radius: 6px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
}

.input-group input:focus, .input-group select:focus {
    outline: none;
    border-color: #667eea;
}

.control-section {
    text-align: center;
    margin: 2rem 0;
}

.btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 0.75rem 2rem;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    transition: transform 0.2s ease;
}

.btn:hover {
    transform: translateY(-2px);
}

.output-group {
    background: #f8f9fa;
    padding: 1rem;
    border-radius: 6px;
    margin-bottom: 1rem;
}

.output-label {
    font-weight: 500;
    color: #495057;
    margin-bottom: 0.5rem;
}

.output-value {
    font-size: 1.5rem;
    font-weight: bold;
    color: #667eea;
}

.content-section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.examples, .help, .related {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.examples h2, .help h2, .related h2 {
    color: #495057;
    margin-bottom: 1rem;
    font-size: 1.1rem;
}

.calculator-footer {
    background: #343a40;
    color: white;
    text-align: center;
    padding: 1rem;
    margin-top: 2rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .calculator-main {
        grid-template-columns: 1fr;
        gap: 1rem;
        padding: 1rem;
    }
    
    .calculator-header h1 {
        font-size: 2rem;
    }
    
    .calculator-container {
        padding: 1rem;
    }
}`;

        // 如果有分析的CSS数据，合并样式
        if (cssAnalysis && cssAnalysis.theme) {
            css += '\n\n/* 从原网站提取的主题样式 */\n';
            
            if (cssAnalysis.theme.colors) {
                Object.entries(cssAnalysis.theme.colors).forEach(([prop, value]) => {
                    css += `:root { --${prop}: ${value}; }\n`;
                });
            }
        }
        
        return css;
    }

    async generateJavaScript(pageData, jsAnalysis) {
        const { calculation } = pageData;
        
        let js = `// Calculator JavaScript - Generated automatically\n\n`;
        
        // 主计算函数
        js += `function calculate() {
    try {
        // 清除之前的错误
        clearErrors();
        
        // 获取输入值
        const inputs = getInputValues();
        
        // 验证输入
        if (!validateInputs(inputs)) {
            return;
        }
        
        // 执行计算
        const results = performCalculation(inputs);
        
        // 显示结果
        displayResults(results);
        
    } catch (error) {
        console.error('计算错误:', error);
        showError('计算过程中发生错误，请检查输入值');
    }
}

function getInputValues() {
    const inputs = {};
    const inputElements = document.querySelectorAll('.input-group input, .input-group select');
    
    inputElements.forEach(element => {
        const name = element.name || element.id;
        if (name) {
            inputs[name] = element.type === 'number' ? parseFloat(element.value) : element.value;
        }
    });
    
    return inputs;
}

function validateInputs(inputs) {
    let isValid = true;
    
    // 基础验证
    Object.entries(inputs).forEach(([name, value]) => {
        const element = document.querySelector('[name="' + name + '"], [id="' + name + '"]');
        
        if (element && element.hasAttribute('required') && (!value || value === '')) {
            showFieldError(element, '此字段为必填项');
            isValid = false;
        }
        
        if (element && element.type === 'number') {
            if (isNaN(value)) {
                showFieldError(element, '请输入有效数字');
                isValid = false;
            }
            
            const min = element.getAttribute('min');
            const max = element.getAttribute('max');
            
            if (min !== null && value < parseFloat(min)) {
                showFieldError(element, '值不能小于 ' + min);
                isValid = false;
            }
            
            if (max !== null && value > parseFloat(max)) {
                showFieldError(element, '值不能大于 ' + max);
                isValid = false;
            }
        }
    });
    
    return isValid;
}

function performCalculation(inputs) {
    const results = {};
    
    // 这里会根据具体的计算类型生成不同的计算逻辑
    ${this.generateCalculationLogic(calculation)}
    
    return results;
}

function displayResults(results) {
    Object.entries(results).forEach(([key, value]) => {
        const element = document.getElementById(key) || document.querySelector('[data-result="' + key + '"]');
        if (element) {
            if (typeof value === 'number') {
                element.textContent = formatNumber(value);
            } else {
                element.textContent = value;
            }
        }
    });
}

function formatNumber(num, decimals = 2) {
    if (isNaN(num)) return 'N/A';
    
    return num.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = 'background: #f8d7da; color: #721c24; padding: 1rem; border-radius: 4px; margin: 1rem 0;';
    
    const container = document.querySelector('.calculator-container');
    container.insertBefore(errorDiv, container.firstChild);
    
    setTimeout(() => errorDiv.remove(), 5000);
}

function showFieldError(element, message) {
    // 移除现有错误
    const existingError = element.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // 添加错误消息
    const errorSpan = document.createElement('span');
    errorSpan.className = 'field-error';
    errorSpan.textContent = message;
    errorSpan.style.cssText = 'color: #dc3545; font-size: 0.8rem; margin-top: 0.25rem; display: block;';
    
    element.style.borderColor = '#dc3545';
    element.parentNode.appendChild(errorSpan);
}

function clearErrors() {
    // 清除全局错误
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    
    // 清除字段错误
    document.querySelectorAll('.field-error').forEach(el => el.remove());
    document.querySelectorAll('input, select').forEach(el => {
        el.style.borderColor = '';
    });
}

// 实时计算（如果需要）
function enableRealTimeCalculation() {
    document.querySelectorAll('.input-group input').forEach(input => {
        input.addEventListener('input', debounce(calculate, 500));
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 绑定计算按钮
    const calculateBtn = document.querySelector('.btn[onclick*="calculate"], .calculate-btn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculate);
    }
    
    // 绑定表单提交
    const form = document.querySelector('.calculator-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            calculate();
        });
    }
    
    // 启用实时计算（可选）
    // enableRealTimeCalculation();
    
    console.log('计算器已初始化');
});`;

        // 如果有分析的JS数据，添加特定函数
        if (jsAnalysis && jsAnalysis.calculations) {
            js += '\n\n// 从原网站提取的计算函数\n';
            jsAnalysis.calculations.forEach(calc => {
                js += `// ${calc.name}\n`;
                js += `function ${calc.name}(${calc.parameters.join(', ')}) {\n`;
                js += `    // TODO: 实现具体计算逻辑\n`;
                js += `    return 0;\n`;
                js += `}\n\n`;
            });
        }
        
        return js;
    }

    generateCalculationLogic(calculation) {
        if (!calculation || !calculation.formulas || calculation.formulas.length === 0) {
            return '// 请根据具体需求实现计算逻辑\nresults.result = 0;';
        }
        
        let logic = '';
        
        calculation.formulas.forEach((formula, index) => {
            logic += `    // ${formula.formula_name || 'Formula ' + (index + 1)}\n`;
            if (formula.formula_expression) {
                // 尝试转换数学表达式为JavaScript
                const jsExpression = this.convertMathToJS(formula.formula_expression);
                logic += `    results.${formula.formula_name || 'result' + index} = ${jsExpression};\n`;
            } else {
                logic += `    results.${formula.formula_name || 'result' + index} = 0; // TODO: 实现计算逻辑\n`;
            }
        });
        
        return logic;
    }

    convertMathToJS(expression) {
        // 简单的数学表达式转换
        return expression
            .replace(/π/g, 'Math.PI')
            .replace(/sin\(/g, 'Math.sin(')
            .replace(/cos\(/g, 'Math.cos(')
            .replace(/tan\(/g, 'Math.tan(')
            .replace(/log\(/g, 'Math.log(')
            .replace(/ln\(/g, 'Math.log(')
            .replace(/sqrt\(/g, 'Math.sqrt(')
            .replace(/\^/g, '**')
            .replace(/([a-zA-Z_][a-zA-Z0-9_]*)/g, 'inputs.$1'); // 变量引用
    }

    // 辅助方法
    async getCalculatorDetailedData(calculatorId) {
        const data = {};
        
        data.inputs = await this.queryDatabase(
            'SELECT * FROM input_configs WHERE calculator_id = ? ORDER BY position_order',
            [calculatorId]
        );
        
        data.outputs = await this.queryDatabase(
            'SELECT * FROM output_configs WHERE calculator_id = ? ORDER BY position_order',
            [calculatorId]
        );
        
        data.formulas = await this.queryDatabase(
            'SELECT * FROM calculation_formulas WHERE calculator_id = ?',
            [calculatorId]
        );
        
        return data;
    }

    async getMultilangContent(calculatorId, lang) {
        const content = await this.queryDatabase(
            'SELECT * FROM multilang_content WHERE calculator_id = ? AND language_code = ?',
            [calculatorId, lang]
        );
        
        const contentMap = {};
        content.forEach(item => {
            contentMap[item.content_key] = item.content_value;
        });
        
        return contentMap;
    }

    getLocalizedText(multilangContent, key, defaultText) {
        return multilangContent[key] || defaultText;
    }

    // 添加缺失的核心方法
    async generateBaseTemplates() {
        // 生成基础HTML模板
        const baseTemplate = `<!DOCTYPE html>
<html lang="{{lang}}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
    <meta name="description" content="{{description}}">
    <link rel="stylesheet" href="/assets/css/main.css">
</head>
<body>
    <div class="container">
        {{> header}}
        <main>
            {{{content}}}
        </main>
        {{> footer}}
    </div>
    <script src="/assets/js/main.js"></script>
</body>
</html>`;

        await this.ensureDirectoryExists(`${this.outputDir}/templates`);
        await this.writeFile(`${this.outputDir}/templates/base.hbs`, baseTemplate);
        console.log('基础模板生成完成');
    }

    async generateSharedResources() {
        // 生成共享CSS
        const mainCSS = `
/* 全局样式 */
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
.container { max-width: 1200px; margin: 0 auto; padding: 20px; }
.calculator-form { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
.form-group { margin-bottom: 15px; }
label { display: block; margin-bottom: 5px; font-weight: bold; }
input, select { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
button { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
button:hover { background: #0056b3; }
.result { background: #e9ecef; padding: 15px; border-radius: 4px; margin-top: 20px; }
`;

        // 生成共享JavaScript
        const mainJS = `
// 全局工具函数
function formatNumber(num, decimals = 2) {
    return Number(num).toFixed(decimals);
}

function validateInput(value, type = 'number') {
    if (type === 'number') {
        return !isNaN(value) && isFinite(value);
    }
    return value && value.trim().length > 0;
}

function showResult(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value;
    }
}
`;

        await this.ensureDirectoryExists(`${this.outputDir}/assets/css`);
        await this.ensureDirectoryExists(`${this.outputDir}/assets/js`);
        
        await this.writeFile(`${this.outputDir}/assets/css/main.css`, mainCSS);
        await this.writeFile(`${this.outputDir}/assets/js/main.js`, mainJS);
        
        console.log('共享资源生成完成');
    }

    async generateIndexPages(calculators) {
        // 生成各种语言的首页
        for (const lang of this.supportedLanguages) {
            const indexContent = `
<h1>${this.getTranslation('site_title', lang)}</h1>
<p>${this.getTranslation('site_description', lang)}</p>

<div class="calculator-grid">
${calculators.map(calc => `
    <div class="calculator-card">
        <h3><a href="/${lang}/${calc.slug}/">${calc.name}</a></h3>
        <p>${calc.description || ''}</p>
    </div>
`).join('')}
</div>
`;

            await this.ensureDirectoryExists(`${this.outputDir}/${lang}`);
            await this.writeFile(`${this.outputDir}/${lang}/index.html`, 
                this.applyBaseTemplate(indexContent, {
                    title: this.getTranslation('site_title', lang),
                    description: this.getTranslation('site_description', lang),
                    lang: lang
                })
            );
        }
        console.log('索引页面生成完成');
    }

    async generateSitemap(calculators) {
        const urls = [];
        
        // 添加首页URLs
        for (const lang of this.supportedLanguages) {
            urls.push(`https://example.com/${lang}/`);
        }
        
        // 添加计算器页面URLs
        for (const calculator of calculators) {
            for (const lang of this.supportedLanguages) {
                urls.push(`https://example.com/${lang}/${calculator.slug}/`);
            }
        }
        
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `
    <url>
        <loc>${url}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
`).join('')}
</urlset>`;

        await this.writeFile(`${this.outputDir}/sitemap.xml`, sitemap);
        console.log('站点地图生成完成');
    }

    applyBaseTemplate(content, data) {
        return `<!DOCTYPE html>
<html lang="${data.lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.title}</title>
    <meta name="description" content="${data.description}">
    <link rel="stylesheet" href="/assets/css/main.css">
</head>
<body>
    <div class="container">
        <header>
            <nav>
                <a href="/${data.lang}/">Home</a>
            </nav>
        </header>
        <main>
            ${content}
        </main>
        <footer>
            <p>&copy; 2024 Calculator Hub</p>
        </footer>
    </div>
    <script src="/assets/js/main.js"></script>
</body>
</html>`;
    }

    getTranslation(key, lang) {
        const translations = {
            'en': {
                'site_title': 'Calculator Hub',
                'site_description': 'Professional online calculators for all your calculation needs'
            },
            'zh': {
                'site_title': '计算器中心',
                'site_description': '专业的在线计算器，满足您的所有计算需求'
            }
        };
        
        return translations[lang]?.[key] || translations['en']?.[key] || key;
    }

    // 其他辅助方法
    async ensureDirectoryExists(dirPath) {
        const path = require('path');
        const fs = require('fs-extra');
        
        await fs.ensureDir(dirPath);
    }

    async writeFile(filePath, content) {
        const fs = require('fs-extra');
        await fs.writeFile(filePath, content, 'utf8');
    }

    registerHandlebarsHelpers() {
        handlebars.registerHelper('eq', (a, b) => a === b);
        handlebars.registerHelper('json', (obj) => JSON.stringify(obj));
        handlebars.registerHelper('formatDate', (date) => new Date(date).toLocaleDateString());
    }

    queryDatabase(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    async formatHTML(html) {
        try {
            return await prettier.format(html, { parser: 'html' });
        } catch (error) {
            return html;
        }
    }

    async formatCSS(css) {
        try {
            return await prettier.format(css, { parser: 'css' });
        } catch (error) {
            return css;
        }
    }

    async formatJavaScript(js) {
        try {
            const result = UglifyJS.minify(js, { 
                mangle: false, 
                compress: false,
                output: { beautify: true, indent_level: 4 }
            });
            return result.code || js;
        } catch (error) {
            return js;
        }
    }

    close() {
        if (this.db) {
            this.db.close();
        }
    }
}

// 主执行函数
async function main() {
    const generator = new PageGenerator();
    
    try {
        await generator.init();
        await generator.generateAllPages();
        console.log('所有页面生成完成');
    } catch (error) {
        console.error('页面生成过程中发生错误:', error);
    } finally {
        generator.close();
    }
}

if (require.main === module) {
    main();
}

module.exports = PageGenerator; 