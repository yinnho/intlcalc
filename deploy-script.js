#!/usr/bin/env node

/**
 * IntlCalc.com 自动化部署脚本
 * 使用 Cloudflare Pages API 和 Wrangler CLI 自动部署多语言计算器网站
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const util = require('util');

const execAsync = util.promisify(exec);

// 配置
const CONFIG = {
    mainDomain: 'intlcalc.com',
    languages: ['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko', 'pt', 'ru', 'ar'],
    projects: {
        main: {
            name: 'intlcalc-main',
            domain: 'intlcalc.com',
            dir: 'generated_pages',
            files: ['index.html']
        }
    }
};

// 为每种语言添加项目配置
CONFIG.languages.forEach(lang => {
    CONFIG.projects[lang] = {
        name: `intlcalc-${lang}`,
        domain: `${lang}.intlcalc.com`,
        dir: `generated_pages/${lang}`,
        files: '*'
    };
});

class CloudflareDeployer {
    constructor(apiToken, accountId) {
        this.apiToken = apiToken;
        this.accountId = accountId;
        this.baseUrl = 'https://api.cloudflare.com/client/v4';
    }

    async validateCredentials() {
        console.log('🔍 验证 Cloudflare 凭据...');
        
        try {
            const { stdout } = await execAsync('npx wrangler whoami');
            console.log('✅ Wrangler 认证成功');
            console.log(stdout);
            return true;
        } catch (error) {
            console.error('❌ Wrangler 认证失败:', error.message);
            console.log('请先运行: npx wrangler login');
            return false;
        }
    }

    async createProject(projectConfig) {
        console.log(`📦 创建项目: ${projectConfig.name}`);
        
        try {
            const { stdout } = await execAsync(`npx wrangler pages project create ${projectConfig.name} --production-branch=main`);
            console.log(`✅ 项目 ${projectConfig.name} 创建成功`);
            return true;
        } catch (error) {
            if (error.message.includes('already exists')) {
                console.log(`ℹ️ 项目 ${projectConfig.name} 已存在`);
                return true;
            }
            console.error(`❌ 创建项目失败:`, error.message);
            return false;
        }
    }

    async deployProject(projectConfig) {
        console.log(`🚀 部署项目: ${projectConfig.name}`);
        
        const deployDir = projectConfig.files === '*' ? projectConfig.dir : '.';
        
        try {
            let command;
            if (projectConfig.files === '*') {
                // 部署整个目录
                command = `npx wrangler pages deploy ${projectConfig.dir} --project-name=${projectConfig.name}`;
            } else {
                // 只部署特定文件 (主项目)
                const tempDir = `temp_${projectConfig.name}`;
                
                // 创建临时目录并复制文件
                if (!fs.existsSync(tempDir)) {
                    fs.mkdirSync(tempDir);
                }
                
                projectConfig.files.forEach(file => {
                    const srcFile = path.join(projectConfig.dir, file);
                    const destFile = path.join(tempDir, file);
                    if (fs.existsSync(srcFile)) {
                        fs.copyFileSync(srcFile, destFile);
                    }
                });
                
                command = `npx wrangler pages deploy ${tempDir} --project-name=${projectConfig.name}`;
            }
            
            const { stdout } = await execAsync(command);
            console.log(`✅ 项目 ${projectConfig.name} 部署成功`);
            console.log(stdout);
            return true;
        } catch (error) {
            console.error(`❌ 部署项目失败:`, error.message);
            return false;
        }
    }

    async addCustomDomain(projectName, domain) {
        console.log(`🔗 添加自定义域名: ${domain} → ${projectName}`);
        
        try {
            const { stdout } = await execAsync(
                `npx wrangler pages project deployment list ${projectName} --limit 1`
            );
            
            // 通过 Cloudflare API 添加自定义域名
            const response = await fetch(`${this.baseUrl}/accounts/${this.accountId}/pages/projects/${projectName}/domains`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: domain
                })
            });

            if (response.ok) {
                console.log(`✅ 域名 ${domain} 添加成功`);
                return true;
            } else {
                const error = await response.json();
                if (error.errors && error.errors[0]?.message?.includes('already exists')) {
                    console.log(`ℹ️ 域名 ${domain} 已存在`);
                    return true;
                }
                console.error('❌ 添加域名失败:', error);
                return false;
            }
        } catch (error) {
            console.error(`❌ 添加域名失败:`, error.message);
            return false;
        }
    }

    async deployAll() {
        console.log('🌍 开始部署 IntlCalc.com 多语言计算器网站...\n');

        // 1. 验证凭据
        if (!await this.validateCredentials()) {
            return false;
        }

        // 2. 检查必要的目录和文件
        console.log('📁 检查文件结构...');
        if (!fs.existsSync('generated_pages/index.html')) {
            console.error('❌ 主页文件不存在: generated_pages/index.html');
            return false;
        }

        if (!fs.existsSync('generated_pages/en/index.html')) {
            console.error('❌ 英文版主页不存在: generated_pages/en/index.html');
            return false;
        }

        console.log('✅ 文件结构检查通过\n');

        // 3. 部署所有项目
        const results = {};
        
        for (const [key, projectConfig] of Object.entries(CONFIG.projects)) {
            console.log(`\n--- 处理项目: ${key} ---`);
            
            // 创建项目
            const created = await this.createProject(projectConfig);
            if (!created) {
                results[key] = { created: false, deployed: false, domain: false };
                continue;
            }
            
            // 部署项目
            const deployed = await this.deployProject(projectConfig);
            if (!deployed) {
                results[key] = { created: true, deployed: false, domain: false };
                continue;
            }
            
            // 添加自定义域名
            const domainAdded = await this.addCustomDomain(projectConfig.name, projectConfig.domain);
            
            results[key] = { 
                created: true, 
                deployed: true, 
                domain: domainAdded 
            };
            
            // 清理临时文件
            const tempDir = `temp_${projectConfig.name}`;
            if (fs.existsSync(tempDir)) {
                fs.rmSync(tempDir, { recursive: true });
            }
        }

        // 4. 输出部署结果
        console.log('\n🎉 部署完成！结果汇总:');
        console.log('==========================================');
        
        for (const [key, result] of Object.entries(results)) {
            const project = CONFIG.projects[key];
            const status = result.created && result.deployed && result.domain ? '✅' : '❌';
            console.log(`${status} ${project.domain} (${project.name})`);
            
            if (result.created && result.deployed && result.domain) {
                console.log(`   🌐 https://${project.domain}`);
            }
        }

        console.log('\n📝 后续步骤:');
        console.log('1. 等待 DNS 传播 (通常 5-10 分钟)');
        console.log('2. 检查 SSL 证书自动配置');
        console.log('3. 测试所有语言版本的访问');
        console.log('4. 配置 Google Analytics');
        console.log('5. 提交到 Google Search Console');

        return Object.values(results).every(r => r.created && r.deployed && r.domain);
    }
}

// 主函数
async function main() {
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;

    if (!apiToken || !accountId) {
        console.error('❌ 缺少环境变量:');
        console.log('请设置以下环境变量:');
        console.log('- CLOUDFLARE_API_TOKEN: 你的 Cloudflare API Token');
        console.log('- CLOUDFLARE_ACCOUNT_ID: 你的 Cloudflare Account ID');
        console.log('\n获取方法:');
        console.log('1. API Token: Cloudflare Dashboard → My Profile → API Tokens');
        console.log('2. Account ID: Cloudflare Dashboard → 右侧边栏 → Account ID');
        process.exit(1);
    }

    const deployer = new CloudflareDeployer(apiToken, accountId);
    const success = await deployer.deployAll();
    
    process.exit(success ? 0 : 1);
}

// 如果直接运行此脚本
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { CloudflareDeployer, CONFIG }; 