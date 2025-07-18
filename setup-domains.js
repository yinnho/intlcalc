const { execSync } = require('child_process');

class DomainSetup {
    constructor() {
        this.projects = [
            // 主项目已经有 intlcalc.com
            // { project: 'intlcalc', domain: 'intlcalc.com' },
            
            // en 项目已经有 en.intlcalc.com  
            // { project: 'intlcalc-en', domain: 'en.intlcalc.com' },
            
            // 需要配置的其他语言项目
            { project: 'intlcalc-zh', domain: 'zh.intlcalc.com' },
            { project: 'intlcalc-es', domain: 'es.intlcalc.com' },
            { project: 'intlcalc-fr', domain: 'fr.intlcalc.com' },
            { project: 'intlcalc-de', domain: 'de.intlcalc.com' },
            { project: 'intlcalc-ja', domain: 'ja.intlcalc.com' },
            { project: 'intlcalc-ko', domain: 'ko.intlcalc.com' },
            { project: 'intlcalc-pt', domain: 'pt.intlcalc.com' },
            { project: 'intlcalc-ru', domain: 'ru.intlcalc.com' },
            { project: 'intlcalc-ar', domain: 'ar.intlcalc.com' }
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

    async addCustomDomain(project, domain) {
        console.log(`\n--- 配置域名: ${domain} → ${project} ---`);
        
        try {
            // 直接使用 Cloudflare API 添加域名
            return await this.addDomainViaAPI(project, domain);
            
        } catch (error) {
            console.error(`❌ 域名配置失败: ${error.message}`);
            
            // 检查是否是域名已存在的错误
            if (error.message.includes('already exists') || error.message.includes('already configured')) {
                console.log('ℹ️  域名可能已经配置过了');
                return true;
            }
            
            return false;
        }
    }

    async addDomainViaAPI(project, domain) {
        console.log(`🔗 使用API配置域名: ${domain}`);
        
        try {
            const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
            const apiToken = process.env.CLOUDFLARE_API_TOKEN;
            
            // 使用curl调用Cloudflare API
            const curlCmd = `curl -X POST "https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${project}/domains" ` +
                           `-H "Authorization: Bearer ${apiToken}" ` +
                           `-H "Content-Type: application/json" ` +
                           `--data "{\\"name\\":\\"${domain}\\"}"`; 
            
            console.log('📡 调用Cloudflare API...');
            const output = execSync(curlCmd, { encoding: 'utf8' });
            
            let response;
            try {
                response = JSON.parse(output);
            } catch (e) {
                console.error('API响应解析失败:', output);
                return false;
            }
            
            if (response.success) {
                console.log('✅ 域名配置成功');
                if (response.result && response.result.verification_data) {
                    console.log('📝 DNS验证信息:');
                    console.log(`  CNAME: ${domain} → ${response.result.verification_data.value}`);
                }
                return true;
            } else {
                console.error('❌ API返回错误:', response.errors || response);
                return false;
            }
            
        } catch (error) {
            console.error(`❌ API调用失败: ${error.message}`);
            return false;
        }
    }

    async setupAllDomains() {
        console.log('🌐 开始配置所有语言的自定义域名...\n');
        
        await this.validateEnvironment();
        
        const results = [];
        
        for (const config of this.projects) {
            const success = await this.addCustomDomain(config.project, config.domain);
            results.push({ 
                project: config.project, 
                domain: config.domain, 
                success 
            });
            
            // 配置间隔，避免API限制
            if (results.length < this.projects.length) {
                console.log('⏳ 等待 2 秒...');
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
        
        // 显示结果汇总
        console.log('\n🎉 域名配置完成！结果汇总:');
        console.log('==========================================');
        
        for (const result of results) {
            const status = result.success ? '✅' : '❌';
            console.log(`${status} ${result.domain} → ${result.project}`);
        }
        
        const successCount = results.filter(r => r.success).length;
        console.log(`\n📊 成功率: ${successCount}/${results.length} (${Math.round(successCount/results.length*100)}%)`);
        
        if (successCount === results.length) {
            console.log('\n🎊 所有域名配置成功！');
            console.log('\n🌐 完整访问地址列表:');
            console.log('  🌍 主站点: https://intlcalc.com');
            console.log('  🇺🇸 英文版: https://en.intlcalc.com (已配置)');
            
            for (const result of results) {
                const flag = this.getCountryFlag(result.domain.split('.')[0]);
                console.log(`  ${flag} ${result.domain}: https://${result.domain}`);
            }
            
            console.log('\n⚠️  重要提示:');
            console.log('1. DNS配置可能需要5-10分钟生效');
            console.log('2. SSL证书将自动配置');
            console.log('3. 请检查Cloudflare DNS设置中的CNAME记录');
        }
    }

    getCountryFlag(lang) {
        const flags = {
            'zh': '🇨🇳',
            'es': '🇪🇸', 
            'fr': '🇫🇷',
            'de': '🇩🇪',
            'ja': '🇯🇵',
            'ko': '🇰🇷',
            'pt': '🇵🇹',
            'ru': '🇷🇺',
            'ar': '🇸🇦'
        };
        return flags[lang] || '🌐';
    }

    async checkCurrentDomains() {
        console.log('🔍 检查当前域名配置状态...\n');
        
        try {
            const output = execSync('npx wrangler pages project list', {
                encoding: 'utf8',
                cwd: __dirname
            });
            
            console.log(output);
            
        } catch (error) {
            console.error('检查失败:', error.message);
        }
    }
}

// 运行域名配置
if (require.main === module) {
    const setup = new DomainSetup();
    
    // 可以选择只检查当前状态或者执行配置
    const action = process.argv[2];
    
    if (action === 'check') {
        setup.checkCurrentDomains().catch(console.error);
    } else {
        setup.setupAllDomains().catch(console.error);
    }
}

module.exports = DomainSetup; 