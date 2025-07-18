const { execSync } = require('child_process');
const https = require('https');

class DomainChecker {
    constructor() {
        this.accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
        this.apiToken = process.env.CLOUDFLARE_API_TOKEN;
        this.projects = [
            'intlcalc',
            'intlcalc-en', 
            'intlcalc-zh',
            'intlcalc-es',
            'intlcalc-fr', 
            'intlcalc-de',
            'intlcalc-ja',
            'intlcalc-ko',
            'intlcalc-pt',
            'intlcalc-ru',
            'intlcalc-ar'
        ];
    }

    async makeRequest(url, method = 'GET', data = null) {
        return new Promise((resolve, reject) => {
            const urlObj = new URL(url);
            const options = {
                hostname: urlObj.hostname,
                port: 443,
                path: urlObj.pathname + urlObj.search,
                method: method,
                headers: {
                    'Authorization': `Bearer ${this.apiToken}`,
                    'Content-Type': 'application/json'
                }
            };

            const req = https.request(options, (res) => {
                let responseData = '';
                res.on('data', (chunk) => {
                    responseData += chunk;
                });
                res.on('end', () => {
                    try {
                        const parsed = JSON.parse(responseData);
                        resolve(parsed);
                    } catch (e) {
                        resolve({ error: 'JSON parse failed', raw: responseData });
                    }
                });
            });

            req.on('error', (error) => {
                reject(error);
            });

            if (data) {
                req.write(JSON.stringify(data));
            }
            
            req.end();
        });
    }

    async checkProjectDomains(projectName) {
        try {
            const url = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/pages/projects/${projectName}/domains`;
            const response = await this.makeRequest(url);
            
            if (response.success) {
                return response.result || [];
            } else {
                console.error(`项目 ${projectName} 查询失败:`, response.errors);
                return [];
            }
        } catch (error) {
            console.error(`项目 ${projectName} 请求失败:`, error.message);
            return [];
        }
    }

    async addDomainToProject(projectName, domainName) {
        try {
            const url = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/pages/projects/${projectName}/domains`;
            const response = await this.makeRequest(url, 'POST', { name: domainName });
            
            if (response.success) {
                console.log(`✅ 成功添加域名 ${domainName} 到项目 ${projectName}`);
                return true;
            } else {
                console.error(`❌ 添加域名 ${domainName} 失败:`, response.errors);
                return false;
            }
        } catch (error) {
            console.error(`❌ 请求失败:`, error.message);
            return false;
        }
    }

    async checkAllDomains() {
        console.log('🔍 检查所有项目的域名配置...\n');
        
        const results = [];
        
        for (const project of this.projects) {
            console.log(`--- 检查项目: ${project} ---`);
            const domains = await this.checkProjectDomains(project);
            
            const customDomains = domains.filter(d => !d.name.includes('.pages.dev'));
            const pagesDomains = domains.filter(d => d.name.includes('.pages.dev'));
            
            console.log(`  📄 Pages域名: ${pagesDomains.map(d => d.name).join(', ') || '无'}`);
            console.log(`  🌐 自定义域名: ${customDomains.map(d => d.name).join(', ') || '无'}`);
            
            results.push({
                project,
                customDomains: customDomains.length,
                domains: domains
            });
            
            console.log('');
        }
        
        // 汇总报告
        console.log('📊 域名配置汇总:');
        console.log('==========================================');
        
        for (const result of results) {
            const status = result.customDomains > 0 ? '✅' : '❌';
            console.log(`${status} ${result.project}: ${result.customDomains} 个自定义域名`);
        }
        
        const totalWithCustom = results.filter(r => r.customDomains > 0).length;
        console.log(`\n📈 配置状态: ${totalWithCustom}/${results.length} 个项目有自定义域名`);
        
        return results;
    }

    async setupMissingDomains() {
        console.log('🚀 开始配置缺失的域名...\n');
        
        const domainMappings = {
            'intlcalc': 'intlcalc.com',      // 已存在
            'intlcalc-en': 'en.intlcalc.com', // 已存在
            'intlcalc-zh': 'zh.intlcalc.com',
            'intlcalc-es': 'es.intlcalc.com',
            'intlcalc-fr': 'fr.intlcalc.com',
            'intlcalc-de': 'de.intlcalc.com',
            'intlcalc-ja': 'ja.intlcalc.com',
            'intlcalc-ko': 'ko.intlcalc.com',
            'intlcalc-pt': 'pt.intlcalc.com',
            'intlcalc-ru': 'ru.intlcalc.com',
            'intlcalc-ar': 'ar.intlcalc.com'
        };
        
        const results = await this.checkAllDomains();
        const toSetup = [];
        
        for (const result of results) {
            const expectedDomain = domainMappings[result.project];
            const hasDomain = result.domains.some(d => d.name === expectedDomain);
            
            if (!hasDomain && expectedDomain) {
                toSetup.push({
                    project: result.project,
                    domain: expectedDomain
                });
            }
        }
        
        if (toSetup.length === 0) {
            console.log('🎉 所有域名都已正确配置！');
            return;
        }
        
        console.log(`\n需要配置 ${toSetup.length} 个域名:`);
        for (const item of toSetup) {
            console.log(`  ${item.domain} → ${item.project}`);
        }
        
        console.log('\n开始配置...');
        
        for (const item of toSetup) {
            console.log(`\n--- 配置: ${item.domain} → ${item.project} ---`);
            const success = await this.addDomainToProject(item.project, item.domain);
            
            if (success) {
                console.log('✅ 配置成功');
            } else {
                console.log('❌ 配置失败');
            }
            
            // 短暂延迟
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        console.log('\n🎉 域名配置完成！');
    }
}

// 运行检查器
if (require.main === module) {
    const checker = new DomainChecker();
    
    const action = process.argv[2];
    
    if (action === 'setup') {
        checker.setupMissingDomains().catch(console.error);
    } else {
        checker.checkAllDomains().catch(console.error);
    }
}

module.exports = DomainChecker; 