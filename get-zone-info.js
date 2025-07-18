const https = require('https');

const API_TOKEN = '0PwE0LEvwlflNfSBLueN-8Rp4q0K3AkiWntoEn7J';

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

async function getZones() {
    console.log('🔍 获取账户中的所有域名...');
    try {
        const result = await makeApiRequest('GET', '/client/v4/zones');
        
        if (!result.success) {
            throw new Error(`API错误: ${JSON.stringify(result.errors)}`);
        }

        return result.result;
    } catch (error) {
        throw new Error(`获取域名失败: ${error.message}`);
    }
}

async function getTokenInfo() {
    console.log('🔑 验证API Token权限...');
    try {
        const result = await makeApiRequest('GET', '/client/v4/user/tokens/verify');
        
        if (!result.success) {
            throw new Error(`API错误: ${JSON.stringify(result.errors)}`);
        }

        return result.result;
    } catch (error) {
        throw new Error(`验证Token失败: ${error.message}`);
    }
}

async function main() {
    try {
        console.log('🌐 检查Cloudflare账户信息...\n');

        // 验证API Token
        const tokenInfo = await getTokenInfo();
        console.log('✅ API Token验证成功');
        console.log(`🏷️  Token状态: ${tokenInfo.status}`);
        console.log(`⏰ 过期时间: ${tokenInfo.expires_on || '无限期'}\n`);

        // 获取所有域名
        const zones = await getZones();
        console.log(`📋 账户中的域名数量: ${zones.length}\n`);

        // 查找intlcalc.com
        const intlcalcZone = zones.find(zone => zone.name === 'intlcalc.com');
        
        if (!intlcalcZone) {
            console.log('❌ 未找到 intlcalc.com 域名');
            console.log('📄 账户中的域名:');
            zones.forEach(zone => {
                console.log(`   ${zone.name} (ID: ${zone.id}, 状态: ${zone.status})`);
            });
            return;
        }

        console.log('✅ 找到目标域名:');
        console.log(`   域名: ${intlcalcZone.name}`);
        console.log(`   Zone ID: ${intlcalcZone.id}`);
        console.log(`   状态: ${intlcalcZone.status}`);
        console.log(`   名称服务器: ${intlcalcZone.name_servers?.join(', ') || '未知'}`);
        console.log(`   计划: ${intlcalcZone.plan?.name || '未知'}\n`);

        // 获取DNS记录
        console.log('🔍 获取DNS记录...');
        const dnsResult = await makeApiRequest('GET', `/client/v4/zones/${intlcalcZone.id}/dns_records`);
        
        if (!dnsResult.success) {
            throw new Error(`获取DNS记录失败: ${JSON.stringify(dnsResult.errors)}`);
        }

        const records = dnsResult.result;
        console.log(`📋 DNS记录总数: ${records.length}\n`);

        // 显示CNAME记录
        const cnameRecords = records.filter(record => record.type === 'CNAME');
        console.log(`📄 CNAME记录 (${cnameRecords.length}条):`);
        cnameRecords.forEach(record => {
            console.log(`   ${record.name} -> ${record.content} (代理: ${record.proxied ? '是' : '否'})`);
        });

        // 显示A记录
        const aRecords = records.filter(record => record.type === 'A');
        if (aRecords.length > 0) {
            console.log(`\n📄 A记录 (${aRecords.length}条):`);
            aRecords.forEach(record => {
                console.log(`   ${record.name} -> ${record.content} (代理: ${record.proxied ? '是' : '否'})`);
            });
        }

        // 显示TXT记录
        const txtRecords = records.filter(record => record.type === 'TXT');
        if (txtRecords.length > 0) {
            console.log(`\n📄 TXT记录 (${txtRecords.length}条):`);
            txtRecords.forEach(record => {
                console.log(`   ${record.name} -> ${record.content}`);
            });
        }

    } catch (error) {
        console.error('❌ 脚本执行失败:', error.message);
        process.exit(1);
    }
}

main(); 