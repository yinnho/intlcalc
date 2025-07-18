const fs = require('fs');
const path = require('path');

// 检查生成的文件
const generatedPagesDir = './generated_pages';

if (!fs.existsSync(generatedPagesDir)) {
    console.error('❌ generated_pages 目录不存在，请先运行 deploy-complete-data.js');
    process.exit(1);
}

// 统计文件数量
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

console.log('📊 部署统计:');
console.log(`📁 总文件数: ${totalFiles}`);
console.log(`📦 总大小: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
console.log('');

// 显示目录结构
console.log('📂 目录结构:');
const languages = ['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko', 'pt', 'ru', 'ar'];

languages.forEach(lang => {
    const langDir = path.join(generatedPagesDir, lang);
    if (fs.existsSync(langDir)) {
        const calcDir = path.join(langDir, 'calc');
        const convertDir = path.join(langDir, 'convert');
        
        let calcCount = 0;
        let convertCount = 0;
        
        if (fs.existsSync(calcDir)) {
            calcCount = fs.readdirSync(calcDir).filter(f => f.endsWith('.html')).length;
        }
        if (fs.existsSync(convertDir)) {
            convertCount = fs.readdirSync(convertDir).filter(f => f.endsWith('.html')).length;
        }
        
        console.log(`  ${lang}/ - ${calcCount} calculators, ${convertCount} converters`);
    }
});

console.log('');
console.log('🚀 部署说明:');
console.log('1. 将 generated_pages 目录的内容上传到 Cloudflare Pages');
console.log('2. 主站: intlcalc.com -> generated_pages/');
console.log('3. 语言子站:');
languages.forEach(lang => {
    console.log(`   - ${lang}.intlcalc.com -> generated_pages/${lang}/`);
});

console.log('');
console.log('📋 部署步骤:');
console.log('1. 在 Cloudflare Pages 中创建新的项目');
console.log('2. 连接 GitHub 仓库（如果使用）或直接上传文件');
console.log('3. 设置构建命令（如果使用静态生成）');
console.log('4. 设置输出目录为 generated_pages');
console.log('5. 配置自定义域名');

console.log('');
console.log('🔗 域名配置:');
console.log('主站: intlcalc.com');
languages.forEach(lang => {
    console.log(`${lang}子站: ${lang}.intlcalc.com`);
});

console.log('');
console.log('✅ 准备就绪！可以开始部署了。'); 