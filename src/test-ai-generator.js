const RequirementAnalyzer = require('./ai/requirement-analyzer');
const CalculatorGenerator = require('./ai/calculator-generator');

class AICalculatorSystem {
    constructor() {
        this.analyzer = new RequirementAnalyzer();
        this.generator = new CalculatorGenerator();
        this.isInitialized = false;
    }

    // 初始化系统
    async initialize() {
        console.log('🚀 初始化AI计算器生成系统...\n');
        
        try {
            // 加载函数库
            await this.analyzer.loadFunctionLibrary();
            this.isInitialized = true;
            console.log('✅ 系统初始化完成!\n');
        } catch (error) {
            console.error('❌ 初始化失败:', error.message);
            throw error;
        }
    }

    // 根据用户需求生成计算器
    async generateCalculator(userRequirement) {
        if (!this.isInitialized) {
            await this.initialize();
        }

        console.log(`🎯 用户需求: "${userRequirement}"\n`);

        try {
            // 1. 分析需求
            const requirement = this.analyzer.analyzeRequirement(userRequirement);
            
            // 2. 生成规格
            const spec = this.analyzer.generateCalculatorSpec(requirement);
            
            console.log(`📋 生成规格: ${spec.title}`);
            console.log(`📐 UI模板: ${spec.uiTemplate}`);
            console.log(`🔧 复杂度: ${spec.complexity}\n`);
            
            // 3. 生成计算器
            const calculator = await this.generator.generateCalculator(spec);
            
            return {
                requirement,
                spec,
                calculator,
                success: true
            };
            
        } catch (error) {
            console.error('❌ 生成失败:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// 测试用例
async function runTests() {
    console.log('🧪 开始测试AI计算器生成系统\n');
    console.log('='.repeat(50));
    
    const aiSystem = new AICalculatorSystem();
    
    const testCases = [
        '我要计算加减法',
        '我需要一个百分比计算器',
        '帮我做长度转换，厘米转英寸',
        '我要计算贷款利息',
        '创建一个科学计算器，包含三角函数'
    ];

    for (let i = 0; i < testCases.length; i++) {
        console.log(`\n📝 测试案例 ${i + 1}/${testCases.length}`);
        console.log('-'.repeat(30));
        
        const result = await aiSystem.generateCalculator(testCases[i]);
        
        if (result.success) {
            console.log(`✅ 成功生成: ${result.spec.title}`);
            console.log(`📄 文件类型: ${result.spec.uiTemplate}`);
            console.log(`📊 包含功能: ${result.spec.features.join(', ') || '基础功能'}`);
        } else {
            console.log(`❌ 生成失败: ${result.error}`);
        }
        
        console.log('-'.repeat(30));
    }
    
    console.log('\n✅ 所有测试完成!');
    console.log('📁 生成的计算器保存在: ./generated_calculators/');
}

// 交互式测试
async function interactiveTest() {
    console.log('\n🎮 交互式测试模式');
    console.log('输入您的计算器需求，我将为您生成专属计算器!\n');
    
    const aiSystem = new AICalculatorSystem();
    
    // 示例需求
    const exampleRequirements = [
        '我要一个简单的计算器，只要加减乘除',
        '帮我做温度转换，摄氏度和华氏度互转',
        '我需要计算房贷月供，包含本金和利息',
        '创建一个可以计算sin、cos、tan的计算器'
    ];
    
    console.log('🎯 示例需求 (您可以参考):');
    exampleRequirements.forEach((req, index) => {
        console.log(`${index + 1}. ${req}`);
    });
    
    console.log('\n开始自动测试所有示例...\n');
    
    for (const requirement of exampleRequirements) {
        console.log('='.repeat(60));
        const result = await aiSystem.generateCalculator(requirement);
        
        if (result.success) {
            console.log(`🎉 成功! 您的"${result.spec.title}"已生成完成!`);
            console.log(`📱 界面类型: ${result.spec.uiTemplate}`);
            console.log(`⚙️ 复杂度: ${result.spec.complexity}`);
            
            if (result.spec.features.length > 0) {
                console.log(`🔧 特殊功能: ${result.spec.features.join(', ')}`);
            }
        } else {
            console.log(`❌ 抱歉，生成失败: ${result.error}`);
        }
        console.log('');
    }
}

// 显示系统信息
function showSystemInfo() {
    console.log('🤖 AI计算器生成系统 v1.0');
    console.log('==================================');
    console.log('📋 支持的计算器类型:');
    console.log('  • 基础计算器 (加减乘除)');
    console.log('  • 科学计算器 (三角函数、对数等)');
    console.log('  • 单位转换器 (长度、重量、温度)');
    console.log('  • 金融计算器 (利息、贷款等)');
    console.log('');
    console.log('🔧 主要功能:');
    console.log('  • 自然语言需求理解');
    console.log('  • 智能函数匹配');
    console.log('  • 自动UI生成');
    console.log('  • 响应式设计');
    console.log('  • 键盘快捷键支持');
    console.log('');
    console.log('💡 使用示例:');
    console.log('  "我要计算加减法" → 基础计算器');
    console.log('  "帮我转换长度单位" → 长度转换器');
    console.log('  "计算房贷利息" → 金融计算器');
    console.log('');
}

// 主函数
async function main() {
    showSystemInfo();
    
    // 运行预设测试
    await runTests();
    
    // 交互式测试
    await interactiveTest();
    
    console.log('\n🎊 测试完成! 请查看 generated_calculators 目录中的生成结果。');
}

// 运行测试
if (require.main === module) {
    main().catch(console.error);
}

module.exports = AICalculatorSystem; 