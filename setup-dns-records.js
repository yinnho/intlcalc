const https = require('https');

const API_TOKEN = '0PwE0LEvwlflNfSBLueN-8Rp4q0K3AkiWntoEn7J';
const ZONE_ID = '4df762e33fd0b7fa57ca734d8b32d296'; // intlcalc.com的Zone ID

const domains = [
    { name: 'zh', target: 'intlcalc-zh.pages.dev' },
    { name: 'es', target: 'intlcalc-es.pages.dev' },
    { name: 'fr', target: 'intlcalc-fr.pages.dev' },
    { name: 'de', target: 'intlcalc-de.pages.dev' },
    { name: 'ja', target: 'intlcalc-ja.pages.dev' },
    { name: 'ko', target: 'intlcalc-ko.pages.dev' },
    { name: 'pt', target: 'intlcalc-pt.pages.dev' },
    { name: 'ru', target: 'intlcalc-ru.pages.dev' },
    { name: 'ar', target: 'intlcalc-ar.pages.dev' }
];

function makeApiRequest(method, path, data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.cloudflare.com',
            port: 443,
            path,
            method,
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const result = JSON.parse(body);
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            });
        });

        req.on('error', reject);
        
        if (data) {
            req.write(JSON.stringify(data));
        }
        
        req.end();
    });
}

async function getDnsRecords() {
    console.log('🔍 获取当前DNS记录...');
    try {
        const result = await makeApiRequest('GET', `/client/v4/zones/${ZONE_ID}/dns_records`);
        
        if (!result.success) {
            throw new Error(`API错误: ${JSON.stringify(result.errors)}`);
        }

        return result.result;
    } catch (error) {
        throw new Error(`获取DNS记录失败: ${error.message}`);
    }
}

async function createDnsRecord(name, target) {
    console.log(`📝 创建DNS记录: ${name}.intlcalc.com -> ${target}`);
    
    const data = {
        type: 'CNAME',
        name: name,
        content: target,
        ttl: 1, // 自动
        proxied: true // 开启代理
    };

    try {
        const result = await makeApiRequest('POST', `/client/v4/zones/${ZONE_ID}/dns_records`, data);
        
        if (!result.success) {
            throw new Error(`API错误: ${JSON.stringify(result.errors)}`);
        }

        console.log(`✅ 成功创建: ${name}.intlcalc.com`);
        return result.result;
    } catch (error) {
        throw new Error(`创建DNS记录失败: ${error.message}`);
    }
}

async function main() {
    try {
        console.log('🌐 开始设置DNS记录...\n');

        // 获取现有DNS记录
        const existingRecords = await getDnsRecords();
        console.log(`📋 当前DNS记录数量: ${existingRecords.length}\n`);

        // 显示现有CNAME记录
        const cnameRecords = existingRecords.filter(record => record.type === 'CNAME');
        console.log('📄 现有CNAME记录:');
        cnameRecords.forEach(record => {
            console.log(`  ${record.name} -> ${record.content} (代理: ${record.proxied ? '是' : '否'})`);
        });
        console.log();

        // 检查需要创建的记录
        const existingNames = cnameRecords.map(record => 
            record.name.replace('.intlcalc.com', '').replace('intlcalc.com', '@')
        );

        console.log('🔍 检查缺失的DNS记录...');
        const missingDomains = domains.filter(domain => 
            !existingNames.includes(domain.name)
        );

        if (missingDomains.length === 0) {
            console.log('✅ 所有DNS记录都已存在！');
            return;
        }

        console.log(`📝 需要创建 ${missingDomains.length} 个DNS记录:\n`);

        // 创建缺失的DNS记录
        for (const domain of missingDomains) {
            try {
                await createDnsRecord(domain.name, domain.target);
                // 添加延迟避免API限制
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                console.error(`❌ 创建 ${domain.name} 失败: ${error.message}`);
            }
        }

        console.log('\n🎉 DNS记录设置完成！');
        console.log('\n⏰ DNS传播需要5-10分钟时间。');
        console.log('🔗 稍后可以访问以下域名测试:');
        domains.forEach(domain => {
            console.log(`   https://${domain.name}.intlcalc.com`);
        });

    } catch (error) {
        console.error('❌ 脚本执行失败:', error.message);
        process.exit(1);
    }
}

main(); 