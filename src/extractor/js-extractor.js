const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs-extra');
const { Parser } = require('acorn');
const { simple: walkSimple } = require('acorn-walk');

class JavaScriptExtractor {
    constructor() {
        this.dbPath = path.join(__dirname, '../../data/calculators.db');
        this.db = null;
        this.outputDir = path.join(__dirname, '../../extracted_js');
        
        // JS代码分类
        this.categories = {
            calculations: [],      // 计算函数
            validations: [],       // 验证函数
            formatters: [],        // 格式化函数
            utilities: [],         // 工具函数
            eventHandlers: [],     // 事件处理器
            uiComponents: [],      // UI组件
            mathLibrary: [],       // 数学函数库
            converters: []         // 转换函数
        };
        
        // 函数模式识别
        this.patterns = {
            calculation: [
                /calculate/i, /compute/i, /eval/i, /formula/i, 
                /math/i, /arithmetic/i, /sum/i, /average/i,
                /percentage/i, /ratio/i, /convert/i
            ],
            validation: [
                /validate/i, /check/i, /verify/i, /test/i,
                /isvalid/i, /isnumber/i, /isempty/i
            ],
            formatting: [
                /format/i, /display/i, /show/i, /render/i,
                /tostring/i, /tolocale/i, /round/i, /precision/i
            ],
            utility: [
                /util/i, /helper/i, /tool/i, /common/i,
                /getvalue/i, /setvalue/i, /clear/i, /reset/i
            ],
            eventHandler: [
                /onclick/i, /onchange/i, /onkeyup/i, /onsubmit/i,
                /handle/i, /trigger/i, /fire/i, /emit/i
            ],
            mathFunction: [
                /sin|cos|tan|log|ln|sqrt|pow|abs|ceil|floor|round/i,
                /pi|e|rad|deg|angle/i, /factorial/i, /prime/i
            ]
        };
    }

    async init() {
        this.db = new sqlite3.Database(this.dbPath);
        await fs.ensureDir(this.outputDir);
        
        // 为每个分类创建目录
        for (const category of Object.keys(this.categories)) {
            await fs.ensureDir(path.join(this.outputDir, category));
        }
        
        console.log('JavaScript提取器初始化完成');
    }

    async extractAllJavaScript() {
        console.log('开始提取所有JavaScript代码...');
        
        // 获取所有JavaScript代码
        const jsCode = await this.queryDatabase(
            'SELECT * FROM javascript_code ORDER BY calculator_id, function_type'
        );
        
        console.log(`找到 ${jsCode.length} 个JavaScript代码片段`);
        
        // 处理每个代码片段
        for (const codeEntry of jsCode) {
            await this.processCodeEntry(codeEntry);
        }
        
        // 生成函数库
        await this.generateFunctionLibraries();
        
        // 生成使用文档
        await this.generateDocumentation();
        
        console.log('JavaScript代码提取完成');
    }

    async processCodeEntry(codeEntry) {
        try {
            // 解析JavaScript代码
            const ast = this.parseJavaScript(codeEntry.code_content);
            if (!ast) return;
            
            // 提取函数
            const functions = this.extractFunctions(ast);
            
            // 分类函数
            for (const func of functions) {
                const category = this.categorizeFunction(func);
                const processedFunc = this.processFunction(func, codeEntry);
                
                this.categories[category].push(processedFunc);
            }
            
            // 提取变量和常量
            const variables = this.extractVariables(ast);
            if (variables.length > 0) {
                this.categories.utilities.push({
                    type: 'variables',
                    name: `variables_${codeEntry.calculator_id}`,
                    variables: variables,
                    source: codeEntry
                });
            }
            
        } catch (error) {
            console.warn(`处理代码失败 (ID: ${codeEntry.id}):`, error.message);
        }
    }

    parseJavaScript(code) {
        try {
            return Parser.parse(code, { 
                ecmaVersion: 2020,
                sourceType: 'script',
                allowReturnOutsideFunction: true
            });
        } catch (error) {
            // 尝试作为表达式解析
            try {
                return Parser.parseExpressionAt(code, 0, { ecmaVersion: 2020 });
            } catch (error2) {
                console.warn('JavaScript解析失败:', error.message);
                return null;
            }
        }
    }

    extractFunctions(ast) {
        const functions = [];
        
        walkSimple(ast, {
            FunctionDeclaration(node) {
                functions.push({
                    type: 'declaration',
                    name: node.id ? node.id.name : 'anonymous',
                    params: node.params.map(param => ({
                        name: param.name,
                        type: this.inferParameterType(param)
                    })),
                    body: this.extractFunctionBody(node.body),
                    async: node.async,
                    generator: node.generator,
                    node: node
                });
            },
            
            FunctionExpression(node) {
                functions.push({
                    type: 'expression',
                    name: node.id ? node.id.name : 'anonymous',
                    params: node.params.map(param => ({
                        name: param.name,
                        type: this.inferParameterType(param)
                    })),
                    body: this.extractFunctionBody(node.body),
                    async: node.async,
                    generator: node.generator,
                    node: node
                });
            },
            
            ArrowFunctionExpression(node) {
                functions.push({
                    type: 'arrow',
                    name: 'arrow_function',
                    params: node.params.map(param => ({
                        name: param.name,
                        type: this.inferParameterType(param)
                    })),
                    body: this.extractFunctionBody(node.body),
                    async: node.async,
                    node: node
                });
            }
        });
        
        return functions;
    }

    extractVariables(ast) {
        const variables = [];
        
        walkSimple(ast, {
            VariableDeclarator(node) {
                if (node.id.type === 'Identifier') {
                    variables.push({
                        name: node.id.name,
                        type: this.inferVariableType(node.init),
                        value: this.extractLiteralValue(node.init),
                        constant: false
                    });
                }
            },
            
            AssignmentExpression(node) {
                if (node.left.type === 'Identifier') {
                    variables.push({
                        name: node.left.name,
                        type: this.inferVariableType(node.right),
                        value: this.extractLiteralValue(node.right),
                        constant: false
                    });
                }
            }
        });
        
        return variables;
    }

    categorizeFunction(func) {
        const name = func.name.toLowerCase();
        const body = func.body.toLowerCase();
        
        // 检查每个模式分类
        for (const [category, patterns] of Object.entries(this.patterns)) {
            if (patterns.some(pattern => pattern.test(name) || pattern.test(body))) {
                return this.mapCategoryName(category);
            }
        }
        
        // 基于函数体内容进一步分析
        if (this.containsMathOperations(body)) {
            return 'calculations';
        }
        
        if (this.containsValidationLogic(body)) {
            return 'validations';
        }
        
        if (this.containsFormatting(body)) {
            return 'formatters';
        }
        
        if (this.containsUIManipulation(body)) {
            return 'uiComponents';
        }
        
        return 'utilities';
    }

    mapCategoryName(patternCategory) {
        const mapping = {
            calculation: 'calculations',
            validation: 'validations',
            formatting: 'formatters',
            utility: 'utilities',
            eventHandler: 'eventHandlers',
            mathFunction: 'mathLibrary'
        };
        
        return mapping[patternCategory] || 'utilities';
    }

    processFunction(func, codeEntry) {
        return {
            id: `${codeEntry.calculator_id}_${func.name}`,
            name: func.name,
            type: func.type,
            description: this.generateFunctionDescription(func),
            parameters: func.params,
            returnType: this.inferReturnType(func),
            body: func.body,
            usage: this.generateUsageExample(func),
            source: {
                calculatorId: codeEntry.calculator_id,
                functionType: codeEntry.function_type,
                originalCode: codeEntry.code_content
            },
            complexity: this.calculateComplexity(func),
            dependencies: this.extractDependencies(func.body),
            testable: this.isTestable(func),
            reusable: this.isReusable(func)
        };
    }

    generateFunctionDescription(func) {
        const name = func.name;
        
        if (this.patterns.calculation.some(p => p.test(name))) {
            return `计算函数：${name}`;
        }
        
        if (this.patterns.validation.some(p => p.test(name))) {
            return `验证函数：检查输入值的有效性`;
        }
        
        if (this.patterns.formatting.some(p => p.test(name))) {
            return `格式化函数：格式化数值或文本显示`;
        }
        
        return `工具函数：${name}`;
    }

    inferReturnType(func) {
        const body = func.body.toLowerCase();
        
        if (body.includes('return true') || body.includes('return false')) {
            return 'boolean';
        }
        
        if (body.includes('return ') && /return\s+[\d.]+/.test(body)) {
            return 'number';
        }
        
        if (body.includes('return ') && /return\s+["'`]/.test(body)) {
            return 'string';
        }
        
        if (body.includes('return [') || body.includes('return array')) {
            return 'array';
        }
        
        if (body.includes('return {') || body.includes('return object')) {
            return 'object';
        }
        
        return 'unknown';
    }

    generateUsageExample(func) {
        const params = func.params.map(p => {
            switch (p.type) {
                case 'number': return '10';
                case 'string': return '"example"';
                case 'boolean': return 'true';
                case 'array': return '[1, 2, 3]';
                default: return 'value';
            }
        }).join(', ');
        
        return `${func.name}(${params})`;
    }

    calculateComplexity(func) {
        const body = func.body;
        let complexity = 1; // 基础复杂度
        
        // 统计条件语句
        complexity += (body.match(/if\s*\(/g) || []).length;
        complexity += (body.match(/for\s*\(/g) || []).length;
        complexity += (body.match(/while\s*\(/g) || []).length;
        complexity += (body.match(/switch\s*\(/g) || []).length;
        complexity += (body.match(/case\s+/g) || []).length;
        
        if (complexity <= 3) return 'low';
        if (complexity <= 7) return 'medium';
        return 'high';
    }

    extractDependencies(body) {
        const dependencies = [];
        
        // 查找函数调用
        const functionCalls = body.match(/\b\w+\s*\(/g) || [];
        functionCalls.forEach(call => {
            const funcName = call.replace(/\s*\(/, '');
            if (!['console', 'parseInt', 'parseFloat', 'Math', 'Array', 'Object'].includes(funcName)) {
                dependencies.push(funcName);
            }
        });
        
        // 查找全局变量引用
        const globalRefs = body.match(/\b[A-Z][A-Z_]+\b/g) || [];
        dependencies.push(...globalRefs);
        
        return [...new Set(dependencies)];
    }

    isTestable(func) {
        // 纯函数更容易测试
        const body = func.body.toLowerCase();
        
        // 如果包含副作用，测试性较低
        if (body.includes('document.') || 
            body.includes('window.') || 
            body.includes('alert(') ||
            body.includes('console.')) {
            return false;
        }
        
        // 如果有明确的输入输出，测试性较高
        if (func.params.length > 0 && body.includes('return ')) {
            return true;
        }
        
        return false;
    }

    isReusable(func) {
        const body = func.body.toLowerCase();
        
        // 包含硬编码的DOM选择器或特定ID，复用性较低
        if (body.includes('getelementbyid') || 
            body.includes('queryselector')) {
            return false;
        }
        
        // 纯计算函数复用性较高
        if (this.containsMathOperations(body) && 
            !body.includes('document.') && 
            !body.includes('window.')) {
            return true;
        }
        
        return true;
    }

    // 辅助方法
    containsMathOperations(body) {
        return /[\+\-\*\/\%]/.test(body) || 
               /math\./i.test(body) ||
               /\b(sin|cos|tan|log|sqrt|pow|abs)\b/i.test(body);
    }

    containsValidationLogic(body) {
        return /\b(isnan|null|undefined|empty|valid)\b/i.test(body) ||
               /\b(test|match|check)\b/i.test(body);
    }

    containsFormatting(body) {
        return /\b(tostring|tofixed|toprecision|tolocalestring)\b/i.test(body) ||
               /\b(format|display|show)\b/i.test(body);
    }

    containsUIManipulation(body) {
        return /\b(innerhtml|textcontent|value|style)\b/i.test(body) ||
               /\b(addeventlistener|onclick|onchange)\b/i.test(body);
    }

    extractFunctionBody(bodyNode) {
        // 简化的函数体提取
        if (bodyNode.type === 'BlockStatement') {
            return bodyNode.body.map(stmt => this.nodeToString(stmt)).join('\n');
        } else {
            return this.nodeToString(bodyNode);
        }
    }

    nodeToString(node) {
        // 简化的AST节点转字符串
        if (!node) return '';
        
        if (node.type === 'Literal') {
            return String(node.value);
        }
        
        if (node.type === 'Identifier') {
            return node.name;
        }
        
        // 对于复杂节点，返回类型信息
        return `[${node.type}]`;
    }

    inferParameterType(param) {
        if (!param) return 'unknown';
        
        // 基于参数名推断类型
        const name = param.name.toLowerCase();
        
        if (name.includes('num') || name.includes('count') || name.includes('value')) {
            return 'number';
        }
        
        if (name.includes('str') || name.includes('text') || name.includes('name')) {
            return 'string';
        }
        
        if (name.includes('flag') || name.includes('is') || name.includes('has')) {
            return 'boolean';
        }
        
        if (name.includes('arr') || name.includes('list') || name.includes('items')) {
            return 'array';
        }
        
        return 'unknown';
    }

    inferVariableType(initNode) {
        if (!initNode) return 'unknown';
        
        switch (initNode.type) {
            case 'Literal':
                if (typeof initNode.value === 'number') return 'number';
                if (typeof initNode.value === 'string') return 'string';
                if (typeof initNode.value === 'boolean') return 'boolean';
                return 'literal';
            case 'ArrayExpression':
                return 'array';
            case 'ObjectExpression':
                return 'object';
            case 'FunctionExpression':
            case 'ArrowFunctionExpression':
                return 'function';
            default:
                return 'unknown';
        }
    }

    extractLiteralValue(node) {
        if (node && node.type === 'Literal') {
            return node.value;
        }
        return null;
    }

    async generateFunctionLibraries() {
        console.log('生成函数库文件...');
        
        for (const [category, functions] of Object.entries(this.categories)) {
            if (functions.length === 0) continue;
            
            const library = this.createLibraryFile(category, functions);
            const filePath = path.join(this.outputDir, category, `${category}-library.js`);
            
            await fs.writeFile(filePath, library, 'utf8');
            
            // 生成TypeScript定义文件
            const typeDefs = this.createTypeDefinitions(category, functions);
            const typeFilePath = path.join(this.outputDir, category, `${category}-library.d.ts`);
            
            await fs.writeFile(typeFilePath, typeDefs, 'utf8');
            
            console.log(`生成 ${category} 库: ${functions.length} 个函数`);
        }
    }

    createLibraryFile(category, functions) {
        let content = `/**\n * ${category.toUpperCase()} Function Library\n * Auto-generated from calculator websites\n */\n\n`;
        
        // 生成每个函数
        functions.forEach(func => {
            content += `/**\n * ${func.description}\n`;
            func.parameters.forEach(param => {
                content += ` * @param {${param.type}} ${param.name}\n`;
            });
            content += ` * @returns {${func.returnType}}\n`;
            content += ` * @example ${func.usage}\n`;
            content += ` */\n`;
            
            content += `function ${func.name}(${func.parameters.map(p => p.name).join(', ')}) {\n`;
            content += `    ${func.body.split('\n').join('\n    ')}\n`;
            content += `}\n\n`;
        });
        
        // 生成导出
        content += `// Export all functions\n`;
        content += `module.exports = {\n`;
        functions.forEach((func, index) => {
            content += `    ${func.name}${index < functions.length - 1 ? ',' : ''}\n`;
        });
        content += `};\n`;
        
        return content;
    }

    createTypeDefinitions(category, functions) {
        let content = `/**\n * TypeScript definitions for ${category} library\n */\n\n`;
        
        functions.forEach(func => {
            const params = func.parameters.map(p => `${p.name}: ${this.mapJSTypeToTS(p.type)}`).join(', ');
            const returnType = this.mapJSTypeToTS(func.returnType);
            
            content += `export declare function ${func.name}(${params}): ${returnType};\n`;
        });
        
        return content;
    }

    mapJSTypeToTS(jsType) {
        const mapping = {
            'number': 'number',
            'string': 'string',
            'boolean': 'boolean',
            'array': 'any[]',
            'object': 'object',
            'function': 'Function',
            'unknown': 'any'
        };
        
        return mapping[jsType] || 'any';
    }

    async generateDocumentation() {
        console.log('生成文档...');
        
        const doc = {
            title: 'JavaScript函数库文档',
            generatedAt: new Date().toISOString(),
            categories: {}
        };
        
        for (const [category, functions] of Object.entries(this.categories)) {
            if (functions.length === 0) continue;
            
            doc.categories[category] = {
                name: category,
                count: functions.length,
                functions: functions.map(func => ({
                    name: func.name,
                    description: func.description,
                    parameters: func.parameters,
                    returnType: func.returnType,
                    usage: func.usage,
                    complexity: func.complexity,
                    testable: func.testable,
                    reusable: func.reusable
                }))
            };
        }
        
        // 保存JSON文档
        await fs.writeFile(
            path.join(this.outputDir, 'documentation.json'),
            JSON.stringify(doc, null, 2),
            'utf8'
        );
        
        // 生成Markdown文档
        const markdown = this.generateMarkdownDoc(doc);
        await fs.writeFile(
            path.join(this.outputDir, 'README.md'),
            markdown,
            'utf8'
        );
        
        console.log('文档生成完成');
    }

    generateMarkdownDoc(doc) {
        let md = `# JavaScript函数库文档\n\n`;
        md += `> 自动生成时间: ${doc.generatedAt}\n\n`;
        
        md += `## 概览\n\n`;
        md += `本函数库包含从计算器网站提取的JavaScript函数，按功能分类整理。\n\n`;
        
        Object.entries(doc.categories).forEach(([category, info]) => {
            md += `### ${info.name}\n\n`;
            md += `函数数量: ${info.count}\n\n`;
            
            info.functions.forEach(func => {
                md += `#### ${func.name}\n\n`;
                md += `${func.description}\n\n`;
                md += `**参数:**\n`;
                func.parameters.forEach(param => {
                    md += `- \`${param.name}\` (${param.type})\n`;
                });
                md += `\n**返回值:** ${func.returnType}\n\n`;
                md += `**示例:**\n\`\`\`javascript\n${func.usage}\n\`\`\`\n\n`;
                md += `**复杂度:** ${func.complexity} | **可测试:** ${func.testable ? '是' : '否'} | **可复用:** ${func.reusable ? '是' : '否'}\n\n`;
                md += `---\n\n`;
            });
        });
        
        return md;
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

    close() {
        if (this.db) {
            this.db.close();
        }
    }
}

// 主执行函数
async function main() {
    const extractor = new JavaScriptExtractor();
    
    try {
        await extractor.init();
        await extractor.extractAllJavaScript();
        console.log('JavaScript提取完成');
    } catch (error) {
        console.error('JavaScript提取过程中发生错误:', error);
    } finally {
        extractor.close();
    }
}

if (require.main === module) {
    main();
}

module.exports = JavaScriptExtractor; 