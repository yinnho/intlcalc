const fs = require('fs');
const path = require('path');

// 清理重复文件，只保留完整的数据版本
const generatedPagesDir = './generated_pages';
const languages = ['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko', 'pt', 'ru', 'ar'];

console.log('🧹 开始清理重复文件...');

// 要删除的简化版本文件名
const filesToRemove = [
    'interest-calculator.html',
    'basic-math-calculator.html',
    'scientific-calculator.html',
    'loan-calculator.html',
    'percentage-calculator.html',
    'bmi-calculator.html',
    'age-calculator.html',
    'basic-calculator.html',
    'temperature-converter.html',
    'length-converter.html'
];

// 要保留的完整数据文件名
const filesToKeep = [
    'percentagecalculator.html',
    'scientificcalculator.html',
    'bmicalculator.html',
    'mortgagecalculator.html',
    'compoundinterestcalculator.html',
    'gradecalculator.html',
    'averagecalculator.html',
    'fractioncalculator.html',
    'finalgradecalculator.html',
    'percentagechangecalculator.html',
    'percentageincreasecalculator.html',
    'wiregaugecalculator.html',
    '${slug}.html'
];

languages.forEach(lang => {
    const calcDir = path.join(generatedPagesDir, lang, 'calc');
    const convertDir = path.join(generatedPagesDir, lang, 'convert');
    
    if (fs.existsSync(calcDir)) {
        console.log(`清理 ${lang}/calc/ 目录...`);
        filesToRemove.forEach(file => {
            const filePath = path.join(calcDir, file);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`  删除: ${file}`);
            }
        });
    }
    
    if (fs.existsSync(convertDir)) {
        console.log(`清理 ${lang}/convert/ 目录...`);
        filesToRemove.forEach(file => {
            const filePath = path.join(convertDir, file);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`  删除: ${file}`);
            }
        });
    }
});

console.log('✅ 清理完成！');

// 更新语言首页的计算器列表
console.log('📝 更新语言首页...');

languages.forEach(lang => {
    const langIndexPath = path.join(generatedPagesDir, lang, 'index.html');
    if (fs.existsSync(langIndexPath)) {
        let content = fs.readFileSync(langIndexPath, 'utf8');
        
        // 更新计算器列表
        const newCalculatorList = filesToKeep.map(file => {
            const name = file.replace('.html', '').replace(/([A-Z])/g, ' $1').trim();
            return `<li><a href="/${lang}/calc/${file}">${name}</a></li>`;
        }).join('\n                    ');
        
        // 替换计算器列表
        const regex = /<li><a href="\/[^"]*\/calc\/[^"]*">[^<]*<\/a><\/li>/g;
        content = content.replace(regex, newCalculatorList);
        
        fs.writeFileSync(langIndexPath, content);
        console.log(`  更新: ${lang}/index.html`);
    }
});

// 统计最终文件
console.log('\n📊 最终统计:');
let totalFiles = 0;
let totalSize = 0;

function countFiles(dir) {
    const items = fs.readdirSync(dir);
    items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            countFiles(fullPath);
        } else {
            totalFiles++;
            totalSize += stat.size;
        }
    });
}

countFiles(generatedPagesDir);

console.log(`📁 总文件数: ${totalFiles}`);
console.log(`📦 总大小: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);

// 显示每个语言版本的计算器数量
console.log('\n📂 各语言版本计算器数量:');
languages.forEach(lang => {
    const calcDir = path.join(generatedPagesDir, lang, 'calc');
    if (fs.existsSync(calcDir)) {
        const calcFiles = fs.readdirSync(calcDir).filter(f => f.endsWith('.html'));
        console.log(`  ${lang}: ${calcFiles.length} 个计算器`);
    }
});

console.log('\n🚀 现在可以部署了！');
console.log('主站: intlcalc.com -> generated_pages/');
languages.forEach(lang => {
    console.log(`${lang}子站: ${lang}.intlcalc.com -> generated_pages/${lang}/`);
}); 