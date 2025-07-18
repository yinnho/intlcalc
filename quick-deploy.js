const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 IntlCalc 快速部署脚本');

try {
    // 检查Git状态
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    
    if (status.trim()) {
        console.log('📝 发现未提交的更改，正在提交...');
        execSync('git add .');
        execSync(`git commit -m "Auto update: ${new Date().toLocaleString()}"`);
    } else {
        console.log('✅ 没有未提交的更改');
    }
    
    // 推送到GitHub
    console.log('📤 推送到GitHub...');
    execSync('git push origin main');
    
    console.log('✅ 代码推送成功！');
    console.log('🌐 Cloudflare Pages 将自动部署...');
    console.log('📊 部署状态：https://dash.cloudflare.com/pages');
    console.log('🌍 网站地址：https://intlcalc.com');
    console.log('🎉 部署完成！');
    
} catch (error) {
    console.error('❌ 部署失败:', error.message);
    process.exit(1);
} 