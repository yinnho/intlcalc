const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

class UpdateDeployer {
    constructor() {
        this.sourceDir = path.join(__dirname, 'generated_pages');
        this.projects = [
            { name: 'intlcalc', dir: '' },          // 主站点
            { name: 'intlcalc-en', dir: 'en' },
            { name: 'intlcalc-zh', dir: 'zh' },
            { name: 'intlcalc-es', dir: 'es' },
            { name: 'intlcalc-fr', dir: 'fr' },
            { name: 'intlcalc-de', dir: 'de' },
            { name: 'intlcalc-ja', dir: 'ja' },
            { name: 'intlcalc-ko', dir: 'ko' },
            { name: 'intlcalc-pt', dir: 'pt' },
            { name: 'intlcalc-ru', dir: 'ru' },
            { name: 'intlcalc-ar', dir: 'ar' }
        ];
    }

    async validateEnvironment() {
        const token = process.env.CLOUDFLARE_API_TOKEN;
        const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
        
        if (!token || !accountId) {
            console.error('❌ 缺少环境变量:');
            console.error('  CLOUDFLARE_API_TOKEN');
            console.error('  CLOUDFLARE_ACCOUNT_ID');
            process.exit(1);
        }
        
        console.log('✅ 环境变量配置正确');
    }

    async deployProject(project) {
        console.log(`\n--- 部署项目: ${project.name} ---`);
        
        try {
            let deployDir;
            if (project.dir === '') {
                // 主站点使用根目录的 index.html 和其他文件
                deployDir = this.sourceDir;
            } else {
                // 语言站点使用对应的语言目录
                deployDir = path.join(this.sourceDir, project.dir);
            }
            
            if (!await fs.pathExists(deployDir)) {
                console.log(`⚠️  目录不存在: ${deployDir}`);
                return false;
            }
            
            console.log(`📁 部署目录: ${deployDir}`);
            console.log(`🚀 开始部署到 ${project.name}...`);
            
            const deployCommand = `npx wrangler pages deployment create ${deployDir} --project-name=${project.name}`;
            
            console.log(`执行命令: ${deployCommand}`);
            const output = execSync(deployCommand, { 
                encoding: 'utf8', 
                cwd: __dirname,
                timeout: 120000 // 2分钟超时
            });
            
            console.log('✅ 部署成功');
            
            // 提取部署URL
            const urlMatch = output.match(/https:\/\/[a-f0-9-]+\.([a-z0-9-]+\.pages\.dev)/);
            if (urlMatch) {
                console.log(`🌐 部署地址: ${urlMatch[0]}`);
            }
            
            return true;
            
        } catch (error) {
            console.error(`❌ 部署失败: ${error.message}`);
            return false;
        }
    }

    async deployAll() {
        console.log('🌍 开始部署完整的多语言计算器网站...\n');
        
        await this.validateEnvironment();
        
        const results = [];
        
        for (const project of this.projects) {
            const success = await this.deployProject(project);
            results.push({ project: project.name, success });
            
            // 部署间隔，避免过于频繁
            if (results.length < this.projects.length) {
                console.log('⏳ 等待 3 秒...');
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        }
        
        // 显示结果汇总
        console.log('\n🎉 部署完成！结果汇总:');
        console.log('==========================================');
        
        for (const result of results) {
            const status = result.success ? '✅' : '❌';
            console.log(`${status} ${result.project}`);
        }
        
        const successCount = results.filter(r => r.success).length;
        console.log(`\n📊 成功率: ${successCount}/${results.length} (${Math.round(successCount/results.length*100)}%)`);
        
        if (successCount === results.length) {
            console.log('\n🎊 全部部署成功！');
            console.log('\n🌐 访问地址:');
            console.log('  主站点: https://intlcalc.com');
            console.log('  英文版: https://en.intlcalc.com');
            console.log('  中文版: https://zh.intlcalc.com');
            console.log('  其他语言版本: https://[lang].intlcalc.com');
        }
    }
}

// 运行部署
if (require.main === module) {
    const deployer = new UpdateDeployer();
    deployer.deployAll().catch(console.error);
}

module.exports = UpdateDeployer; 