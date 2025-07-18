const { execSync } = require('child_process');

const allLanguages = [
    { code: 'zh', project: 'intlcalc-zh' },
    { code: 'es', project: 'intlcalc-es' },
    { code: 'fr', project: 'intlcalc-fr' },
    { code: 'de', project: 'intlcalc-de' },
    { code: 'ja', project: 'intlcalc-ja' },
    { code: 'ko', project: 'intlcalc-ko' },
    { code: 'pt', project: 'intlcalc-pt' },
    { code: 'ru', project: 'intlcalc-ru' },
    { code: 'ar', project: 'intlcalc-ar' }
];

// 处理命令行参数
const args = process.argv.slice(2);
let languagesToDeploy = [];

if (args.length === 0) {
    // 如果没有参数，部署所有语言
    languagesToDeploy = allLanguages;
} else {
    // 根据参数选择要部署的语言
    for (const arg of args) {
        if (arg === 'main') {
            // 主站点部署
            languagesToDeploy.push({ code: 'main', project: 'intlcalc' });
        } else if (arg === 'en') {
            // 英语站点部署
            languagesToDeploy.push({ code: 'en', project: 'intlcalc-en' });
        } else {
            // 其他语言
            const lang = allLanguages.find(l => l.code === arg);
            if (lang) {
                languagesToDeploy.push(lang);
            } else {
                console.log(`⚠️ 未知语言代码: ${arg}`);
            }
        }
    }
}

console.log('🚀 开始批量部署多语言网站...\n');
console.log(`📋 将要部署的项目: ${languagesToDeploy.map(l => l.code).join(', ')}\n`);

let successCount = 0;
let errorCount = 0;

for (const lang of languagesToDeploy) {
    try {
        console.log(`📝 正在部署 ${lang.code} (${lang.project})...`);
        
        let command;
        if (lang.code === 'main') {
            // 主站使用专门的 main_site 目录
            command = `npx wrangler pages deploy main_site --project-name=${lang.project} --skip-caching`;
        } else if (lang.code === 'en') {
            // 英语站使用 en 目录
            command = `npx wrangler pages deploy generated_pages/en --project-name=${lang.project} --skip-caching`;
        } else {
            // 其他语言使用对应的语言目录
            command = `npx wrangler pages deploy generated_pages/${lang.code} --project-name=${lang.project} --skip-caching`;
        }
        
        execSync(command, { stdio: 'inherit' });
        
        console.log(`✅ ${lang.code} 部署成功\n`);
        successCount++;
        
    } catch (error) {
        console.error(`❌ ${lang.code} 部署失败:`, error.message);
        errorCount++;
    }
}

console.log('🎉 批量部署完成！');
console.log(`📊 部署结果:`);
console.log(`   ✅ 成功: ${successCount} 个项目`);
console.log(`   ❌ 失败: ${errorCount} 个项目`);

if (errorCount === 0) {
    console.log('\n🌟 指定的语言版本都已成功部署！');
} 