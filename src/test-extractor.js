const FunctionExtractor = require('./extractor/function-extractor');

async function main() {
    console.log('🚀 开始构建计算函数库...\n');
    
    const extractor = new FunctionExtractor();
    
    try {
        // 提取所有计算函数
        const functions = await extractor.extractAllFunctions();
        
        console.log('\n✅ 计算函数库构建完成!');
        console.log('📂 函数已保存到: ./extracted_functions/');
        console.log('📋 查看报告: ./extracted_functions/extraction_report.json');
        
        // 显示函数类别概览
        console.log('\n📊 函数分类概览:');
        for (const [category, subcategories] of Object.entries(functions)) {
            console.log(`\n🏷️  ${category.toUpperCase()}:`);
            for (const [subcat, funcs] of Object.entries(subcategories)) {
                if (funcs.length > 0) {
                    console.log(`   - ${subcat}: ${funcs.length} 个函数`);
                }
            }
        }
        
    } catch (error) {
        console.error('❌ 提取过程中出现错误:', error.message);
    }
}

// 运行测试
main().catch(console.error); 