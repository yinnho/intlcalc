const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testAPI() {
    console.log('🧪 测试 API 连接...\n');
    
    try {
        // 测试语言API
        console.log('1. 测试语言API...');
        const langResponse = await fetch('https://768b5823.intlcalc.pages.dev/api/languages');
        const langData = await langResponse.json();
        console.log('语言数据:', langData);
        
        // 测试计算器API
        console.log('\n2. 测试计算器API (中文)...');
        const calcResponse = await fetch('https://768b5823.intlcalc.pages.dev/api/calculators?lang=zh');
        const calcData = await calcResponse.json();
        console.log('计算器数据:', JSON.stringify(calcData, null, 2));
        
    } catch (error) {
        console.error('❌ API测试失败:', error.message);
    }
}

testAPI(); 