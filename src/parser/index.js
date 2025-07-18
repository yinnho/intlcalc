const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs-extra');
const { parse } = require('node-html-parser');
const { Parser } = require('acorn');
const cssTree = require('css-tree');

class CalculatorParser {
    constructor() {
        this.dbPath = path.join(__dirname, '../../data/calculators.db');
        this.db = null;
        this.parsedData = {};
    }

    async init() {
        this.db = new sqlite3.Database(this.dbPath);
        console.log('解析器初始化完成');
    }

    async parseAllCalculators() {
        console.log('开始解析所有计算器数据...');
        
        return new Promise((resolve, reject) => {
            this.db.all('SELECT * FROM calculators WHERE status = "active"', async (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                console.log('找到 ${rows.length} 个计算器待解析');
                
                for (const calculator of rows) {
                    try {
                        await this.parseCalculator(calculator);
                        console.log('完成解析: ${calculator.name}');
                    } catch (error) {
                        console.error('解析失败 ${calculator.name}:', error);
                    }
                }
                
                resolve();
            });
        });
    }

    async parseCalculator(calculator) {
        const calculatorId = calculator.id;
        
        // 获取计算器的所有相关数据
        const data = await this.getCalculatorData(calculatorId);
        
        // 解析HTML结构
        const htmlAnalysis = this.analyzeHtmlStructure(data.html_structures);
        
        // 解析JavaScript代码
        const jsAnalysis = this.analyzeJavaScriptCode(data.javascript_code);
        
        // 解析CSS样式
        const cssAnalysis = this.analyzeCssStyles(data.css_styles);
        
        // 分析计算逻辑
        const calculationAnalysis = this.analyzeCalculationLogic(data.formulas, jsAnalysis);
        
        // 识别UI组件
        const componentAnalysis = this.identifyUIComponents(htmlAnalysis, cssAnalysis);
        
        // 生成组件配置
        const componentConfig = this.generateComponentConfig(
            calculator, 
            htmlAnalysis, 
            jsAnalysis, 
            calculationAnalysis,
            componentAnalysis
        );
        
        // 保存解析结果
        await this.saveParseResults(calculatorId, {
            htmlAnalysis,
            jsAnalysis,
            cssAnalysis,
            calculationAnalysis,
            componentAnalysis,
            componentConfig
        });
        
        return componentConfig;
    }

    async getCalculatorData(calculatorId) {
        const data = {};
        
        // 获取HTML结构
        data.html_structures = await this.queryDatabase(
            'SELECT * FROM html_structures WHERE calculator_id = ?',
            [calculatorId]
        );
        
        // 获取JavaScript代码
        data.javascript_code = await this.queryDatabase(
            'SELECT * FROM javascript_code WHERE calculator_id = ?',
            [calculatorId]
        );
        
        // 获取CSS样式
        data.css_styles = await this.queryDatabase(
            'SELECT * FROM css_styles WHERE calculator_id = ?',
            [calculatorId]
        );
        
        // 获取计算公式
        data.formulas = await this.queryDatabase(
            'SELECT * FROM calculation_formulas WHERE calculator_id = ?',
            [calculatorId]
        );
        
        return data;
    }

    analyzeHtmlStructure(htmlStructures) {
        const analysis = {
            inputElements: [],
            outputElements: [],
            buttonElements: [],
            containerStructure: null,
            formStructure: null,
            tableStructure: null
        };
        
        htmlStructures.forEach(structure => {
            const elementData = JSON.parse(structure.element_html || '{}');
            
            if (structure.is_input) {
                analysis.inputElements.push({
                    id: structure.id,
                    type: elementData.type || 'text',
                    name: elementData.name || '',
                    label: this.extractLabel(elementData),
                    validation: this.extractValidation(elementData),
                    defaultValue: elementData.value || '',
                    required: elementData.required || false
                });
            }
            
            if (structure.is_output) {
                analysis.outputElements.push({
                    id: structure.id,
                    format: this.detectOutputFormat(structure.element_text),
                    displayType: this.detectDisplayType(elementData)
                });
            }
            
            // 分析容器结构
            if (structure.element_type === 'container') {
                analysis.containerStructure = this.analyzeContainerLayout(structure);
            }
        });
        
        return analysis;
    }

    analyzeJavaScriptCode(javascriptCode) {
        const analysis = {
            functions: [],
            calculations: [],
            eventHandlers: [],
            validations: [],
            utilities: []
        };
        
        javascriptCode.forEach(codeEntry => {
            try {
                const ast = this.parseJavaScript(codeEntry.code_content);
                
                if (ast) {
                    const functions = this.extractFunctions(ast);
                    
                    functions.forEach(func => {
                        const funcAnalysis = this.analyzeFunctionPurpose(func);
                        
                        switch (funcAnalysis.purpose) {
                            case 'calculation':
                                analysis.calculations.push({
                                    name: func.name,
                                    parameters: func.parameters,
                                    body: func.body,
                                    returnType: funcAnalysis.returnType,
                                    formula: this.extractFormulaFromFunction(func)
                                });
                                break;
                                
                            case 'validation':
                                analysis.validations.push({
                                    name: func.name,
                                    rules: this.extractValidationRules(func)
                                });
                                break;
                                
                            case 'event':
                                analysis.eventHandlers.push({
                                    name: func.name,
                                    eventType: funcAnalysis.eventType,
                                    targetElement: funcAnalysis.targetElement
                                });
                                break;
                                
                            default:
                                analysis.utilities.push(func);
                        }
                    });
                }
            } catch (error) {
                console.warn('JavaScript解析失败:', error.message);
            }
        });
        
        return analysis;
    }

    analyzeCssStyles(cssStyles) {
        const analysis = {
            layout: {
                type: 'unknown',
                gridColumns: null,
                flexDirection: null
            },
            components: {
                buttons: [],
                inputs: [],
                outputs: []
            },
            theme: {
                colors: {},
                fonts: {},
                spacing: {}
            },
            responsive: {
                breakpoints: [],
                mediaQueries: []
            }
        };
        
        cssStyles.forEach(styleEntry => {
            try {
                const ast = cssTree.parse(styleEntry.css_rules);
                
                cssTree.walk(ast, (node) => {
                    if (node.type === 'Rule') {
                        const selector = cssTree.generate(node.prelude);
                        const declarations = this.extractCssDeclarations(node.block);
                        
                        // 分析布局类型
                        if (declarations.display) {
                            if (declarations.display.includes('grid')) {
                                analysis.layout.type = 'grid';
                                analysis.layout.gridColumns = declarations['grid-template-columns'];
                            } else if (declarations.display.includes('flex')) {
                                analysis.layout.type = 'flex';
                                analysis.layout.flexDirection = declarations['flex-direction'];
                            }
                        }
                        
                        // 分析组件样式
                        if (selector.includes('button') || selector.includes('btn')) {
                            analysis.components.buttons.push({
                                selector,
                                styles: declarations
                            });
                        }
                        
                        if (selector.includes('input') || selector.includes('field')) {
                            analysis.components.inputs.push({
                                selector,
                                styles: declarations
                            });
                        }
                        
                        // 提取主题色彩
                        Object.keys(declarations).forEach(prop => {
                            if (prop.includes('color') || prop === 'background') {
                                analysis.theme.colors[prop] = declarations[prop];
                            }
                            
                            if (prop.includes('font')) {
                                analysis.theme.fonts[prop] = declarations[prop];
                            }
                            
                            if (prop.includes('margin') || prop.includes('padding')) {
                                analysis.theme.spacing[prop] = declarations[prop];
                            }
                        });
                    }
                    
                    // 分析媒体查询
                    if (node.type === 'Atrule' && node.name === 'media') {
                        const mediaQuery = cssTree.generate(node.prelude);
                        analysis.responsive.mediaQueries.push(mediaQuery);
                    }
                });
                
            } catch (error) {
                console.warn('CSS解析失败:', error.message);
            }
        });
        
        return analysis;
    }

    analyzeCalculationLogic(formulas, jsAnalysis) {
        const analysis = {
            mainFormula: null,
            steps: [],
            variables: [],
            operations: [],
            validationRules: []
        };
        
        // 分析数据库中的公式
        if (formulas && formulas.length > 0) {
            const mainFormula = formulas[0]; // 假设第一个是主公式
            analysis.mainFormula = {
                name: mainFormula.formula_name,
                expression: mainFormula.formula_expression,
                description: mainFormula.formula_description,
                variables: this.extractVariables(mainFormula.formula_expression)
            };
        }
        
        // 分析JavaScript中的计算逻辑
        jsAnalysis.calculations.forEach(calc => {
            if (calc.formula) {
                analysis.steps.push({
                    name: calc.name,
                    formula: calc.formula,
                    parameters: calc.parameters,
                    description: this.generateStepDescription(calc)
                });
            }
        });
        
        // 提取变量
        const allVariables = new Set();
        analysis.steps.forEach(step => {
            step.parameters.forEach(param => allVariables.add(param));
        });
        
        analysis.variables = Array.from(allVariables).map(varName => ({
            name: varName,
            type: this.inferVariableType(varName),
            description: this.generateVariableDescription(varName)
        }));
        
        return analysis;
    }

    identifyUIComponents(htmlAnalysis, cssAnalysis) {
        const components = {
            inputComponents: [],
            outputComponents: [],
            controlComponents: [],
            layoutComponents: []
        };
        
        // 基于HTML和CSS分析识别组件类型
        htmlAnalysis.inputElements.forEach(input => {
            const componentType = this.determineInputComponentType(input, cssAnalysis);
            components.inputComponents.push({
                type: componentType,
                config: this.generateInputConfig(input, componentType),
                styles: this.findMatchingStyles(input, cssAnalysis)
            });
        });
        
        htmlAnalysis.outputElements.forEach(output => {
            const componentType = this.determineOutputComponentType(output, cssAnalysis);
            components.outputComponents.push({
                type: componentType,
                config: this.generateOutputConfig(output, componentType),
                styles: this.findMatchingStyles(output, cssAnalysis)
            });
        });
        
        // 识别布局组件
        if (cssAnalysis.layout.type !== 'unknown') {
            components.layoutComponents.push({
                type: cssAnalysis.layout.type,
                config: cssAnalysis.layout
            });
        }
        
        return components;
    }

    generateComponentConfig(calculator, htmlAnalysis, jsAnalysis, calculationAnalysis, componentAnalysis) {
        const config = {
            calculator: {
                id: calculator.id,
                name: calculator.name,
                slug: calculator.slug,
                type: calculator.calculator_type,
                category: calculator.category
            },
            ui: {
                layout: componentAnalysis.layoutComponents[0] || { type: 'form' },
                inputs: componentAnalysis.inputComponents,
                outputs: componentAnalysis.outputComponents,
                controls: componentAnalysis.controlComponents
            },
            logic: {
                mainCalculation: calculationAnalysis.mainFormula,
                steps: calculationAnalysis.steps,
                validations: jsAnalysis.validations
            },
            template: {
                html: this.generateHtmlTemplate(componentAnalysis),
                css: this.generateCssTemplate(componentAnalysis),
                js: this.generateJsTemplate(calculationAnalysis, jsAnalysis)
            }
        };
        
        return config;
    }

    generateHtmlTemplate(componentAnalysis) {
        let template = '<div class="calculator-container">\n';
        
        // 生成输入区域
        if (componentAnalysis.inputComponents.length > 0) {
            template += '  <div class="input-section">\n';
            componentAnalysis.inputComponents.forEach(input => {
                template += '    ${this.generateInputHtml(input)}\n';
            });
            template += '  </div>\n';
        }
        
        // 生成控制按钮
        template += '  <div class="control-section">\n';
        template += '    <button class="calculate-btn" onclick="calculate()">计算</button>\n';
        template += '  </div>\n';
        
        // 生成输出区域
        if (componentAnalysis.outputComponents.length > 0) {
            template += '  <div class="output-section">\n';
            componentAnalysis.outputComponents.forEach(output => {
                template += '    ${this.generateOutputHtml(output)}\n';
            });
            template += '  </div>\n';
        }
        
        template += '</div>';
        return template;
    }

    generateCssTemplate(componentAnalysis) {
        let css = `.calculator-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-family: Arial, sans-serif;
}

.input-section, .output-section {
    margin: 20px 0;
}

.control-section {
    text-align: center;
    margin: 20px 0;
}

.calculate-btn {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
}

.calculate-btn:hover {
    background-color: #0056b3;
}

.input-group {
    margin: 10px 0;
}

.input-group label {
    display: inline-block;
    width: 120px;
    font-weight: bold;
}

.input-group input {
    width: 200px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.output-group {
    margin: 10px 0;
    padding: 10px;
    background-color: #f8f9fa;
    border-radius: 4px;
}

.output-label {
    font-weight: bold;
    color: #333;
}

.output-value {
    font-size: 18px;
    color: #007bff;
    margin-left: 10px;
}`;
        
        return css;
    }

    generateJsTemplate(calculationAnalysis, jsAnalysis) {
        let js = 'function calculate() {\n';
        js += '    try {\n';
        
        // 获取输入值
        if (calculationAnalysis.variables) {
            calculationAnalysis.variables.forEach(variable => {
                js += '        const ${variable.name} = parseFloat(document.getElementById("${variable.name}").value);\n';
                js += '        if (isNaN(${variable.name})) {\n';
                js += '            alert("请输入有效的${variable.description || variable.name}");\n';
                js += '            return;\n';
                js += '        }\n';
            });
        }
        
        // 执行计算
        if (calculationAnalysis.mainFormula) {
            js += '\n        // 主要计算公式\n';
            js += '        const result = ${this.convertFormulaToJs(calculationAnalysis.mainFormula.expression)};\n';
        }
        
        // 显示结果
        js += '\n        // 显示结果\n';
        js += '        document.getElementById("result").textContent = result.toFixed(2);\n';
        
        js += '    } catch (error) {\n';
        js += '        console.error("计算错误:", error);\n';
        js += '        alert("计算过程中发生错误，请检查输入");\n';
        js += '    }\n';
        js += '}\n\n';
        
        // 添加验证函数
        if (jsAnalysis.validations.length > 0) {
            js += '// 验证函数\n';
            jsAnalysis.validations.forEach(validation => {
                js += 'function ${validation.name}(value) {\n';
                js += '    // 验证逻辑\n';
                js += '    return true;\n';
                js += '}\n\n';
            });
        }
        
        return js;
    }

    // 辅助方法
    extractLabel(elementData) {
        // 从元素数据中提取标签文本
        return elementData.placeholder || elementData.name || '输入值';
    }

    extractValidation(elementData) {
        const validation = {};
        
        if (elementData.required) validation.required = true;
        if (elementData.min !== null) validation.min = elementData.min;
        if (elementData.max !== null) validation.max = elementData.max;
        if (elementData.step !== null) validation.step = elementData.step;
        
        return validation;
    }

    detectOutputFormat(text) {
        if (!text) return 'text';
        
        if (text.includes('%')) return 'percentage';
        if (text.includes('$') || text.includes('￥')) return 'currency';
        if (/\\d+\\.\\d+/.test(text)) return 'decimal';
        if (/\\d+/.test(text)) return 'integer';
        
        return 'text';
    }

    parseJavaScript(code) {
        try {
            return Parser.parse(code, { ecmaVersion: 2020 });
        } catch (error) {
            console.warn('JavaScript解析失败:', error.message);
            return null;
        }
    }

    extractFunctions(ast) {
        const functions = [];
        
        // 遍历AST查找函数声明
        const walk = (node) => {
            if (node.type === 'FunctionDeclaration') {
                functions.push({
                    name: node.id.name,
                    parameters: node.params.map(param => param.name),
                    body: node.body
                });
            }
            
            // 递归遍历子节点
            for (const key in node) {
                if (node[key] && typeof node[key] === 'object') {
                    if (Array.isArray(node[key])) {
                        node[key].forEach(walk);
                    } else {
                        walk(node[key]);
                    }
                }
            }
        };
        
        walk(ast);
        return functions;
    }

    analyzeFunctionPurpose(func) {
        const name = func.name.toLowerCase();
        
        if (name.includes('calculate') || name.includes('compute')) {
            return { purpose: 'calculation', returnType: 'number' };
        }
        
        if (name.includes('validate') || name.includes('check')) {
            return { purpose: 'validation', returnType: 'boolean' };
        }
        
        if (name.includes('onclick') || name.includes('onchange') || name.includes('event')) {
            return { purpose: 'event', eventType: 'click' };
        }
        
        return { purpose: 'utility', returnType: 'unknown' };
    }

    async saveParseResults(calculatorId, results) {
        // 保存解析结果到数据库或文件
        const resultsPath = path.join(__dirname, '../../parsed_data', '${calculatorId}_analysis.json');
        await fs.ensureDir(path.dirname(resultsPath));
        await fs.writeFile(resultsPath, JSON.stringify(results, null, 2));
        
        console.log('解析结果已保存: calculator_${calculatorId}');
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
    const parser = new CalculatorParser();
    
    try {
        await parser.init();
        await parser.parseAllCalculators();
        console.log('所有解析任务完成');
    } catch (error) {
        console.error('解析过程中发生错误:', error);
    } finally {
        parser.close();
    }
}

if (require.main === module) {
    main();
}

module.exports = CalculatorParser; 