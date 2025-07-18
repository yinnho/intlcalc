const fs = require('fs');
const path = require('path');

class RequirementAnalyzer {
    constructor() {
        this.functionLibrary = {};
        this.keywords = {
            math: {
                basic: ['加法', '减法', '乘法', '除法', 'add', 'subtract', 'multiply', 'divide', '+', '-', '*', '/', '计算', '四则运算'],
                percentage: ['百分比', '百分数', '折扣', 'percentage', 'percent', '%', '比例', '增长率', '利率'],
                advanced: ['三角函数', '对数', '指数', 'sin', 'cos', 'tan', 'log', 'sqrt', 'pow', '开方', '平方根'],
                statistics: ['平均数', '方差', '标准差', 'average', 'mean', 'variance', 'deviation', '统计']
            },
            conversion: {
                length: ['长度', '距离', '厘米', '米', '英寸', '英尺', 'cm', 'meter', 'inch', 'feet', 'mm', '转换'],
                weight: ['重量', '质量', '公斤', '磅', 'kg', 'pound', 'gram', '克', '重量转换'],
                temperature: ['温度', '摄氏度', '华氏度', '开尔文', 'celsius', 'fahrenheit', 'kelvin', '温度转换'],
                currency: ['货币', '汇率', '美元', '人民币', 'usd', 'cny', '货币转换']
            },
            physics: {
                electrical: ['电压', '电流', '电阻', '功率', 'voltage', 'current', 'resistance', 'power', '欧姆定律', 'ohm'],
                mechanical: ['力学', '速度', '加速度', 'force', 'velocity', 'acceleration'],
                thermal: ['热力学', '热量', 'thermal', 'heat']
            },
            finance: {
                interest: ['利息', '贷款', '投资', 'interest', 'loan', 'mortgage', '复利', '单利'],
                investment: ['投资', '股票', '基金', 'investment', 'stock', 'fund'],
                loan: ['贷款', '房贷', '车贷', 'loan', 'mortgage']
            }
        };
        
        this.uiTemplates = {
            basic_calculator: 'basic-calculator',
            conversion_calculator: 'conversion-calculator', 
            scientific_calculator: 'scientific-calculator',
            financial_calculator: 'financial-calculator'
        };
    }

    // 加载函数库
    async loadFunctionLibrary() {
        const libraryPath = path.join(process.cwd(), 'extracted_functions');
        
        if (!fs.existsSync(libraryPath)) {
            throw new Error('函数库不存在，请先运行函数提取器');
        }

        // 递归加载所有分类的函数
        await this.loadCategoryFunctions(libraryPath, this.functionLibrary);
        
        console.log('📚 函数库加载完成');
        return this.functionLibrary;
    }

    // 递归加载分类函数
    async loadCategoryFunctions(dirPath, target) {
        const files = fs.readdirSync(dirPath);
        
        for (const file of files) {
            const filePath = path.join(dirPath, file);
            const stat = fs.statSync(filePath);
            
            if (stat.isDirectory()) {
                target[file] = {};
                await this.loadCategoryFunctions(filePath, target[file]);
            } else if (file.endsWith('.json')) {
                const categoryName = path.basename(file, '.json');
                const functions = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                target[categoryName] = functions;
            }
        }
    }

    // 分析用户需求
    analyzeRequirement(userInput) {
        console.log(`🔍 分析需求: "${userInput}"`);
        
        const requirement = {
            input: userInput,
            categories: [],
            functions: [],
            uiTemplate: '',
            complexity: 'simple',
            features: []
        };

        // 转换为小写便于匹配
        const input = userInput.toLowerCase();
        
        // 匹配计算类型
        this.matchCategories(input, requirement);
        
        // 选择合适的函数
        this.selectFunctions(requirement);
        
        // 确定UI模板
        this.determineUITemplate(requirement);
        
        // 分析复杂度和特性
        this.analyzeComplexity(input, requirement);
        
        console.log('📋 需求分析结果:', requirement);
        return requirement;
    }

    // 匹配计算类型
    matchCategories(input, requirement) {
        for (const [mainCategory, subCategories] of Object.entries(this.keywords)) {
            for (const [subCategory, keywords] of Object.entries(subCategories)) {
                if (keywords.some(keyword => input.includes(keyword))) {
                    requirement.categories.push({
                        main: mainCategory,
                        sub: subCategory,
                        confidence: this.calculateConfidence(input, keywords)
                    });
                }
            }
        }

        // 按置信度排序
        requirement.categories.sort((a, b) => b.confidence - a.confidence);
    }

    // 计算匹配置信度
    calculateConfidence(input, keywords) {
        let matches = 0;
        let totalKeywords = keywords.length;
        
        for (const keyword of keywords) {
            if (input.includes(keyword)) {
                matches++;
            }
        }
        
        return (matches / totalKeywords) * 100;
    }

    // 选择合适的函数
    selectFunctions(requirement) {
        if (requirement.categories.length === 0) {
            // 默认基础计算器
            requirement.categories.push({
                main: 'math',
                sub: 'basic',
                confidence: 50
            });
        }

        for (const category of requirement.categories) {
            const functions = this.getFunctionsFromCategory(category.main, category.sub);
            if (functions) {
                requirement.functions.push({
                    category: category,
                    functions: this.filterRelevantFunctions(functions, requirement.input)
                });
            }
        }
    }

    // 从函数库获取指定分类的函数
    getFunctionsFromCategory(mainCategory, subCategory) {
        try {
            return this.functionLibrary[mainCategory]?.[subCategory] || [];
        } catch (error) {
            console.log(`⚠️ 无法获取函数: ${mainCategory}/${subCategory}`);
            return [];
        }
    }

    // 过滤相关函数
    filterRelevantFunctions(functions, userInput) {
        if (!functions || functions.length === 0) return [];
        
        // 简单过滤：选择名称包含计算相关关键词的函数
        const calcKeywords = ['calc', 'compute', 'convert', 'add', 'subtract', 'multiply', 'divide'];
        
        return functions.filter(func => {
            const name = func.name.toLowerCase();
            const code = func.code.toLowerCase();
            
            return calcKeywords.some(keyword => 
                name.includes(keyword) || 
                code.includes(keyword + '(')
            );
        }).slice(0, 10); // 限制数量
    }

    // 确定UI模板
    determineUITemplate(requirement) {
        if (requirement.categories.length === 0) {
            requirement.uiTemplate = 'basic-calculator';
            return;
        }

        const primaryCategory = requirement.categories[0];
        
        switch (primaryCategory.main) {
            case 'math':
                if (primaryCategory.sub === 'basic') {
                    requirement.uiTemplate = 'basic-calculator';
                } else {
                    requirement.uiTemplate = 'scientific-calculator';
                }
                break;
            case 'conversion':
                requirement.uiTemplate = 'conversion-calculator';
                break;
            case 'finance':
                requirement.uiTemplate = 'financial-calculator';
                break;
            case 'physics':
                requirement.uiTemplate = 'scientific-calculator';
                break;
            default:
                requirement.uiTemplate = 'basic-calculator';
        }
    }

    // 分析复杂度和特性
    analyzeComplexity(input, requirement) {
        // 复杂度判断
        if (input.includes('高级') || input.includes('复杂') || input.includes('科学')) {
            requirement.complexity = 'advanced';
        } else if (input.includes('简单') || input.includes('基础') || input.includes('基本')) {
            requirement.complexity = 'simple';
        } else {
            requirement.complexity = 'medium';
        }

        // 特性识别
        if (input.includes('图表') || input.includes('可视化')) {
            requirement.features.push('visualization');
        }
        if (input.includes('历史') || input.includes('记录')) {
            requirement.features.push('history');
        }
        if (input.includes('导出') || input.includes('保存')) {
            requirement.features.push('export');
        }
        if (input.includes('分步') || input.includes('步骤')) {
            requirement.features.push('step-by-step');
        }
    }

    // 生成计算器规格
    generateCalculatorSpec(requirement) {
        const spec = {
            title: this.generateTitle(requirement),
            description: this.generateDescription(requirement),
            uiTemplate: requirement.uiTemplate,
            complexity: requirement.complexity,
            features: requirement.features,
            functions: requirement.functions,
            css: this.generateCSSRequirements(requirement),
            js: this.generateJSRequirements(requirement)
        };

        return spec;
    }

    // 生成标题
    generateTitle(requirement) {
        if (requirement.categories.length === 0) {
            return '基础计算器';
        }

        const primaryCategory = requirement.categories[0];
        const titles = {
            'math-basic': '基础数学计算器',
            'math-percentage': '百分比计算器', 
            'math-advanced': '科学计算器',
            'conversion-length': '长度转换器',
            'conversion-weight': '重量转换器',
            'conversion-temperature': '温度转换器',
            'physics-electrical': '电力计算器',
            'finance-interest': '利息计算器'
        };

        const key = `${primaryCategory.main}-${primaryCategory.sub}`;
        return titles[key] || `${primaryCategory.sub}计算器`;
    }

    // 生成描述
    generateDescription(requirement) {
        const input = requirement.input;
        return `根据您的需求"${input}"自动生成的计算器`;
    }

    // 生成CSS需求
    generateCSSRequirements(requirement) {
        return {
            theme: requirement.complexity === 'simple' ? 'minimal' : 'professional',
            layout: requirement.uiTemplate === 'conversion-calculator' ? 'two-column' : 'single-column',
            colors: 'blue-theme'
        };
    }

    // 生成JS需求
    generateJSRequirements(requirement) {
        return {
            validation: true,
            realTimeCalculation: requirement.complexity !== 'advanced',
            errorHandling: true,
            formatting: true
        };
    }
}

module.exports = RequirementAnalyzer; 