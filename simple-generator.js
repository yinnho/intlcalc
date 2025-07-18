const fs = require('fs').promises;
const path = require('path');

// 模拟数据（先不用API，直接写死测试）
const mockData = {
    languages: [
        { code: 'zh', name: 'Chinese', native_name: '中文版', domain: 'zh.intlcalc.com' },
        { code: 'en', name: 'English', native_name: 'English', domain: 'en.intlcalc.com' },
        { code: 'es', name: 'Spanish', native_name: 'Español', domain: 'es.intlcalc.com' }
    ],
    categories: {
        zh: [
            {
                name: '金融计算器',
                description: '计算贷款、利息、投资等',
                calculators: [
                    { title: '利息计算器', slug: 'interest', description: '计算单利和复利' },
                    { title: '贷款计算器', slug: 'loan', description: '计算贷款付款和计划' }
                ]
            },
            {
                name: '数学计算器',
                description: '基础和高级数学计算',
                calculators: [
                    { title: '基础数学计算器', slug: 'basic-math', description: '简单算术计算' },
                    { title: '科学计算器', slug: 'scientific', description: '高级数学函数' }
                ]
            }
        ],
        en: [
            {
                name: 'Financial Calculators',
                description: 'Calculate loans, interest, investments and more',
                calculators: [
                    { title: 'Interest Calculator', slug: 'interest', description: 'Calculate simple and compound interest' },
                    { title: 'Loan Calculator', slug: 'loan', description: 'Calculate loan payments and schedules' }
                ]
            },
            {
                name: 'Math Calculators',
                description: 'Basic and advanced mathematical calculations',
                calculators: [
                    { title: 'Basic Math Calculator', slug: 'basic-math', description: 'Simple arithmetic calculations' },
                    { title: 'Scientific Calculator', slug: 'scientific', description: 'Advanced mathematical functions' }
                ]
            }
        ]
    }
};

// 生成主站首页
function generateMainPage() {
    let html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IntlCalc - Free Online Calculators</title>
    <meta name="description" content="Free online calculators in multiple languages">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background: #fff; color: #000; line-height: 1.6; }
        .header { border-bottom: 1px solid #ccc; padding: 20px 0; background: #f9f9f9; }
        .header-content { max-width: 1200px; margin: 0 auto; padding: 0 20px; text-align: center; }
        .logo { font-size: 32px; font-weight: bold; color: #000; }
        .subtitle { font-size: 18px; color: #666; margin-top: 10px; }
        .main-container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .language-section { margin-bottom: 40px; border: 1px solid #ccc; border-radius: 8px; padding: 20px; }
        .language-title { font-size: 24px; margin-bottom: 20px; color: #007cba; border-bottom: 2px solid #007cba; padding-bottom: 10px; }
        .category-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .category-card { border: 1px solid #ccc; padding: 15px; border-radius: 5px; background: #f9f9f9; }
        .category-name { font-size: 18px; margin-bottom: 10px; color: #333; }
        .calculator-list { list-style: none; }
        .calculator-list li { margin-bottom: 8px; }
        .calculator-list a { color: #007cba; text-decoration: none; }
        .calculator-list a:hover { text-decoration: underline; }
        .footer { margin-top: 50px; border-top: 1px solid #ccc; padding: 20px 0; text-align: center; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <header class="header">
        <div class="header-content">
            <div class="logo">IntlCalc</div>
            <div class="subtitle">Free Online Calculators in Multiple Languages</div>
        </div>
    </header>
    
    <div class="main-container">
        <h1 style="text-align: center; margin-bottom: 40px; font-size: 28px;">All Calculators by Language</h1>
    `;

    // 为每种语言生成区域
    mockData.languages.forEach(lang => {
        const categories = mockData.categories[lang.code] || [];
        
        html += `
        <div class="language-section">
            <h2 class="language-title">${lang.native_name} (${lang.domain})</h2>
            <div class="category-grid">
        `;
        
        categories.forEach(category => {
            html += `
                <div class="category-card">
                    <h3 class="category-name">${category.name}</h3>
                    <p style="margin-bottom: 15px; color: #666;">${category.description}</p>
                    <ul class="calculator-list">
            `;
            
            category.calculators.forEach(calc => {
                html += `<li><a href="https://${lang.domain}/calc/${calc.slug}">${calc.title}</a></li>`;
            });
            
            html += `
                    </ul>
                </div>
            `;
        });
        
        html += `
            </div>
        </div>
        `;
    });

    html += `
    </div>
    
    <footer class="footer">
        <p>&copy; 2024 IntlCalc.com. All rights reserved.</p>
    </footer>
</body>
</html>
    `;

    return html;
}

// 生成语言子站首页
function generateLanguageHomePage(langCode) {
    const categories = mockData.categories[langCode] || [];
    const lang = mockData.languages.find(l => l.code === langCode);
    
    let html = `
<!DOCTYPE html>
<html lang="${langCode}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IntlCalc - ${lang.native_name}</title>
    <meta name="description" content="Free online calculators in ${lang.native_name}">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background: #fff; color: #000; line-height: 1.6; }
        .header { border-bottom: 1px solid #ccc; padding: 10px 0; background: #f9f9f9; }
        .header-content { max-width: 1200px; margin: 0 auto; padding: 0 20px; display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 24px; font-weight: bold; text-decoration: none; color: #000; }
        .lang-switcher { display: flex; gap: 10px; }
        .lang-switcher a { padding: 5px 10px; text-decoration: none; color: #666; border: 1px solid #ccc; border-radius: 3px; }
        .lang-switcher a.active { background: #007cba; color: white; border-color: #007cba; }
        .main-container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .hero-section { text-align: center; margin-bottom: 40px; padding: 40px 0; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); border-radius: 10px; }
        .hero-section h1 { font-size: 2.5rem; margin-bottom: 20px; color: #333; }
        .category-section { margin-bottom: 40px; }
        .category-section h2 { border-bottom: 2px solid #007cba; padding-bottom: 10px; margin-bottom: 20px; color: #333; }
        .calculator-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
        .calculator-card { border: 1px solid #ccc; padding: 20px; border-radius: 5px; background: #f9f9f9; }
        .calculator-card h3 { margin-bottom: 10px; color: #007cba; }
        .calculator-card a { color: #007cba; text-decoration: none; }
        .footer { margin-top: 50px; border-top: 1px solid #ccc; padding: 20px 0; text-align: center; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <header class="header">
        <div class="header-content">
            <a href="/${langCode}/" class="logo">IntlCalc</a>
            <div class="lang-switcher">
    `;
    
    mockData.languages.forEach(l => {
        const isActive = l.code === langCode;
        html += `<a href="https://${l.domain}/" class="${isActive ? 'active' : ''}">${l.native_name}</a>`;
    });
    
    html += `
            </div>
        </div>
    </header>
    
    <div class="main-container">
        <div class="hero-section">
            <h1>${langCode === 'zh' ? '免费在线计算器' : 'Free Online Calculators'}</h1>
            <p>${langCode === 'zh' ? '专业的在线计算器和转换工具' : 'Professional online calculators and converters'}</p>
        </div>
    `;
    
    categories.forEach(category => {
        html += `
        <div class="category-section">
            <h2>${category.name}</h2>
            <p>${category.description}</p>
            <div class="calculator-grid">
        `;
        
        category.calculators.forEach(calc => {
            html += `
                <div class="calculator-card">
                    <h3><a href="/${langCode}/calc/${calc.slug}">${calc.title}</a></h3>
                    <p>${calc.description}</p>
                </div>
            `;
        });
        
        html += `
            </div>
        </div>
        `;
    });
    
    html += `
    </div>
    
    <footer class="footer">
        <p>&copy; 2024 IntlCalc.com. All rights reserved.</p>
    </footer>
</body>
</html>
    `;
    
    return html;
}

async function generatePages() {
    console.log('🚀 开始生成页面...\n');
    
    try {
        // 确保dist目录存在
        await fs.mkdir('dist', { recursive: true });
        
        // 生成主站首页
        console.log('📝 生成主站首页...');
        const mainPage = generateMainPage();
        await fs.writeFile('dist/index.html', mainPage);
        
        // 为每种语言生成子站首页
        for (const lang of mockData.languages) {
            console.log(`📝 生成 ${lang.native_name} 首页...`);
            const langDir = `dist/${lang.code}`;
            await fs.mkdir(langDir, { recursive: true });
            
            const langPage = generateLanguageHomePage(lang.code);
            await fs.writeFile(`${langDir}/index.html`, langPage);
        }
        
        console.log('✅ 页面生成完成！');
        console.log('\n📁 生成的文件:');
        console.log('- dist/index.html (主站首页)');
        mockData.languages.forEach(lang => {
            console.log(`- dist/${lang.code}/index.html (${lang.native_name}首页)`);
        });
        
    } catch (error) {
        console.error('❌ 生成失败:', error.message);
    }
}

generatePages(); 