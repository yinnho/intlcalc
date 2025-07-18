const fs = require('fs');
const path = require('path');
const jsParser = require('acorn');
const walk = require('acorn-walk');

class FunctionExtractor {
    constructor() {
        this.functions = {
            math: {
                basic: [],      // 基础运算：加减乘除
                advanced: [],   // 高级数学：三角函数、对数等
                percentage: [], // 百分比计算
                statistics: []  // 统计计算
            },
            physics: {
                electrical: [], // 电力计算
                mechanical: [], // 机械计算
                thermal: []     // 热力计算
            },
            conversion: {
                length: [],     // 长度转换
                weight: [],     // 重量转换
                temperature: [], // 温度转换
                currency: []    // 货币转换
            },
            finance: {
                interest: [],   // 利息计算
                loan: [],      // 贷款计算
                investment: [] // 投资计算
            },
            utility: {
                date: [],      // 日期计算
                text: [],      // 文本处理
                validator: []  // 验证函数
            }
        };
        
        this.extractedCount = 0;
        this.processedFiles = 0;
    }

    // 从镜像站点提取所有函数
    async extractAllFunctions() {
        console.log('🔍 开始提取计算函数...');
        
        const mirrorDir = path.join(process.cwd(), 'mirrored_site');
        await this.processDirectory(mirrorDir);
        
        console.log(`✅ 处理完成! 共处理 ${this.processedFiles} 个文件，提取 ${this.extractedCount} 个函数`);
        
        // 保存提取结果
        await this.saveFunctions();
        
        return this.functions;
    }

    // 递归处理目录
    async processDirectory(dirPath) {
        if (!fs.existsSync(dirPath)) return;
        
        const files = fs.readdirSync(dirPath);
        
        for (const file of files) {
            const filePath = path.join(dirPath, file);
            const stat = fs.statSync(filePath);
            
            if (stat.isDirectory()) {
                await this.processDirectory(filePath);
            } else if (file.endsWith('.html')) {
                await this.extractFromHTML(filePath);
            }
        }
    }

    // 从HTML文件提取JavaScript函数
    async extractFromHTML(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            this.processedFiles++;
            
            // 提取<script>标签中的代码
            const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
            let match;
            
            while ((match = scriptRegex.exec(content)) !== null) {
                const jsCode = match[1];
                if (jsCode.trim()) {
                    await this.extractFunctionsFromJS(jsCode, filePath);
                }
            }
            
            // 提取内联事件处理器
            this.extractInlineHandlers(content, filePath);
            
        } catch (error) {
            console.log(`⚠️ 处理文件失败: ${filePath} - ${error.message}`);
        }
    }

    // 从JavaScript代码中提取函数
    async extractFunctionsFromJS(jsCode, sourceFile) {
        try {
            // 清理代码
            jsCode = this.cleanJSCode(jsCode);
            
            // 解析JavaScript
            const ast = jsParser.parse(jsCode, { 
                ecmaVersion: 2020, 
                allowReturnOutsideFunction: true,
                loose: true 
            });
            
            // 遍历AST提取函数
            walk.simple(ast, {
                FunctionDeclaration: (node) => {
                    this.processFunctionNode(node, jsCode, sourceFile);
                },
                FunctionExpression: (node) => {
                    this.processFunctionNode(node, jsCode, sourceFile);
                },
                ArrowFunctionExpression: (node) => {
                    this.processFunctionNode(node, jsCode, sourceFile);
                }
            });
            
        } catch (error) {
            // 忽略解析错误，很多HTML中的JS代码可能不完整
        }
    }

    // 处理函数节点
    processFunctionNode(node, fullCode, sourceFile) {
        const functionInfo = this.extractFunctionInfo(node, fullCode, sourceFile);
        if (functionInfo && this.isCalculationFunction(functionInfo)) {
            this.categorizeFuction(functionInfo);
            this.extractedCount++;
        }
    }

    // 提取函数信息
    extractFunctionInfo(node, fullCode, sourceFile) {
        try {
            const start = node.start;
            const end = node.end;
            const code = fullCode.substring(start, end);
            
            return {
                name: node.id ? node.id.name : 'anonymous',
                code: code,
                params: node.params.map(p => p.name || 'param'),
                sourceFile: sourceFile,
                type: node.type,
                lineStart: this.getLineNumber(fullCode, start),
                lineEnd: this.getLineNumber(fullCode, end)
            };
        } catch (error) {
            return null;
        }
    }

    // 判断是否为计算函数
    isCalculationFunction(funcInfo) {
        const calcKeywords = [
            'calc', 'compute', 'convert', 'calculate', 
            'add', 'subtract', 'multiply', 'divide',
            'percent', 'interest', 'power', 'voltage',
            'temperature', 'length', 'weight', 'currency',
            'sin', 'cos', 'tan', 'log', 'sqrt', 'pow',
            'round', 'format', 'validate'
        ];
        
        const code = funcInfo.code.toLowerCase();
        const name = funcInfo.name.toLowerCase();
        
        // 检查函数名和代码内容是否包含计算相关关键词
        return calcKeywords.some(keyword => 
            name.includes(keyword) || 
            code.includes(keyword + '(') ||
            code.includes('math.') ||
            code.includes('parseFloat') ||
            code.includes('parseInt') ||
            code.includes('number(') ||
            code.includes('*') || code.includes('/') ||
            code.includes('return') && (code.includes('+') || code.includes('-'))
        );
    }

    // 函数分类
    categorizeFuction(funcInfo) {
        const name = funcInfo.name.toLowerCase();
        const code = funcInfo.code.toLowerCase();
        const file = funcInfo.sourceFile.toLowerCase();
        
        // 数学分类
        if (this.isBasicMath(name, code)) {
            this.functions.math.basic.push(funcInfo);
        } else if (this.isAdvancedMath(name, code)) {
            this.functions.math.advanced.push(funcInfo);
        } else if (this.isPercentage(name, code, file)) {
            this.functions.math.percentage.push(funcInfo);
        } else if (this.isStatistics(name, code)) {
            this.functions.math.statistics.push(funcInfo);
        }
        
        // 物理分类
        else if (this.isElectrical(name, code, file)) {
            this.functions.physics.electrical.push(funcInfo);
        }
        
        // 转换分类
        else if (this.isLengthConversion(name, code, file)) {
            this.functions.conversion.length.push(funcInfo);
        } else if (this.isWeightConversion(name, code, file)) {
            this.functions.conversion.weight.push(funcInfo);
        } else if (this.isTemperatureConversion(name, code, file)) {
            this.functions.conversion.temperature.push(funcInfo);
        }
        
        // 金融分类
        else if (this.isFinance(name, code, file)) {
            this.functions.finance.interest.push(funcInfo);
        }
        
        // 默认归类为工具函数
        else {
            this.functions.utility.validator.push(funcInfo);
        }
    }

    // 分类判断方法
    isBasicMath(name, code) {
        return ['add', 'subtract', 'multiply', 'divide', 'sum'].some(op => name.includes(op));
    }

    isAdvancedMath(name, code) {
        return ['sin', 'cos', 'tan', 'log', 'sqrt', 'pow', 'exp'].some(op => 
            name.includes(op) || code.includes('math.' + op));
    }

    isPercentage(name, code, file) {
        return name.includes('percent') || code.includes('100') || file.includes('percentage');
    }

    isStatistics(name, code) {
        return ['average', 'mean', 'median', 'variance', 'deviation'].some(op => name.includes(op));
    }

    isElectrical(name, code, file) {
        return file.includes('electric') || ['volt', 'amp', 'watt', 'ohm', 'power'].some(op => 
            name.includes(op) || code.includes(op));
    }

    isLengthConversion(name, code, file) {
        return file.includes('length') || ['inch', 'feet', 'meter', 'cm', 'mm'].some(unit => 
            name.includes(unit) || file.includes(unit));
    }

    isWeightConversion(name, code, file) {
        return file.includes('weight') || ['kg', 'gram', 'pound', 'ounce'].some(unit => 
            name.includes(unit) || file.includes(unit));
    }

    isTemperatureConversion(name, code, file) {
        return file.includes('temperature') || ['celsius', 'fahrenheit', 'kelvin'].some(unit => 
            name.includes(unit) || file.includes(unit));
    }

    isFinance(name, code, file) {
        return file.includes('finance') || ['interest', 'loan', 'mortgage', 'payment'].some(op => 
            name.includes(op) || code.includes(op));
    }

    // 提取内联事件处理器
    extractInlineHandlers(html, sourceFile) {
        const inlineRegex = /on\w+\s*=\s*["']([^"']+)["']/gi;
        let match;
        
        while ((match = inlineRegex.exec(html)) !== null) {
            const handlerCode = match[1];
            if (handlerCode.includes('calc') || handlerCode.includes('compute')) {
                this.functions.utility.validator.push({
                    name: 'inline_handler',
                    code: handlerCode,
                    params: [],
                    sourceFile: sourceFile,
                    type: 'InlineHandler'
                });
                this.extractedCount++;
            }
        }
    }

    // 清理JavaScript代码
    cleanJSCode(code) {
        // 移除HTML实体
        code = code.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
        
        // 移除注释
        code = code.replace(/\/\*[\s\S]*?\*\//g, '');
        code = code.replace(/\/\/.*$/gm, '');
        
        return code;
    }

    // 获取行号
    getLineNumber(code, position) {
        return code.substring(0, position).split('\n').length;
    }

    // 保存提取的函数
    async saveFunctions() {
        const outputDir = path.join(process.cwd(), 'extracted_functions');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // 保存分类后的函数
        for (const [category, subcategories] of Object.entries(this.functions)) {
            const categoryDir = path.join(outputDir, category);
            if (!fs.existsSync(categoryDir)) {
                fs.mkdirSync(categoryDir, { recursive: true });
            }

            for (const [subcat, functions] of Object.entries(subcategories)) {
                if (functions.length > 0) {
                    const filePath = path.join(categoryDir, `${subcat}.json`);
                    fs.writeFileSync(filePath, JSON.stringify(functions, null, 2));
                    console.log(`📁 ${category}/${subcat}: ${functions.length} 个函数`);
                }
            }
        }

        // 生成统计报告
        const stats = this.generateStats();
        fs.writeFileSync(
            path.join(outputDir, 'extraction_report.json'), 
            JSON.stringify(stats, null, 2)
        );

        console.log('\n📊 提取统计:');
        console.log(`总函数数: ${stats.totalFunctions}`);
        console.log(`分类数: ${stats.categories}`);
        console.log(`处理文件数: ${stats.processedFiles}`);
    }

    // 生成统计信息
    generateStats() {
        let totalFunctions = 0;
        const categoryStats = {};

        for (const [category, subcategories] of Object.entries(this.functions)) {
            categoryStats[category] = {};
            for (const [subcat, functions] of Object.entries(subcategories)) {
                categoryStats[category][subcat] = functions.length;
                totalFunctions += functions.length;
            }
        }

        return {
            totalFunctions,
            categories: Object.keys(this.functions).length,
            processedFiles: this.processedFiles,
            categoryBreakdown: categoryStats,
            extractionDate: new Date().toISOString()
        };
    }
}

module.exports = FunctionExtractor; 