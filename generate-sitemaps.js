#!/usr/bin/env node

/**
 * 网站地图生成脚本
 * 为 IntlCalc.com 的所有语言版本生成 XML 网站地图
 */

const fs = require('fs');
const path = require('path');

// 网站配置
const SITE_CONFIG = {
    baseUrls: {
        main: 'https://intlcalc.com',
        en: 'https://en.intlcalc.com',
        zh: 'https://zh.intlcalc.com',
        es: 'https://es.intlcalc.com',
        fr: 'https://fr.intlcalc.com',
        de: 'https://de.intlcalc.com',
        ja: 'https://ja.intlcalc.com',
        ko: 'https://ko.intlcalc.com',
        pt: 'https://pt.intlcalc.com',
        ru: 'https://ru.intlcalc.com',
        ar: 'https://ar.intlcalc.com'
    },
    languages: ['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko', 'pt', 'ru', 'ar'],
    calculatorCategories: {
        calc: {
            math: ['calculator', 'scientific-calculator', 'percentage-calculator', 'fraction-calculator', 'average-calculator'],
            finance: ['interest-calculator', 'compound-interest-calculator', 'loan-calculator', 'mortgage-calculator', 'discount-calculator'],
            electric: ['power-calculator', 'ohms-law-calculator', 'voltage-divider-calculator'],
            time: ['age-calculator', 'date-calculator', 'time-zone-converter', 'work-hours-calculator'],
            body: ['bmi-calculator', 'calorie-calculator', 'body-fat-calculator', 'ideal-weight-calculator'],
            grade: ['gpa-calculator', 'grade-calculator', 'final-grade-calculator'],
            light: ['lumen-calculator', 'lux-calculator', 'candela-calculator'],
            wire: ['wire-gauge-calculator', 'cable-size-calculator'],
            baby: ['baby-growth-calculator', 'due-date-calculator']
        },
        convert: {
            length: ['length-converter', 'meter-to-feet', 'inch-to-cm'],
            weight: ['weight-converter', 'kg-to-pounds', 'gram-to-ounce'],
            temperature: ['temperature-converter', 'celsius-to-fahrenheit', 'kelvin-converter'],
            power: ['power-converter', 'watt-to-hp', 'kw-to-btu'],
            energy: ['energy-converter', 'joule-to-calorie', 'kwh-converter'],
            frequency: ['frequency-converter', 'hz-to-mhz', 'ghz-converter'],
            voltage: ['voltage-converter', 'volt-converter'],
            electric: ['watt-to-amp', 'kw-to-kva', 'ohm-converter'],
            color: ['color-converter', 'rgb-to-hex', 'hsl-converter'],
            number: ['number-converter', 'binary-converter', 'hex-converter'],
            chemistry: ['molarity-calculator', 'ph-calculator'],
            charge: ['charge-converter', 'coulomb-converter'],
            image: ['image-converter', 'pixel-converter']
        }
    }
};

// 生成单个 URL 条目
function createUrlEntry(url, lastmod = null, changefreq = 'weekly', priority = '0.8') {
    const lastmodStr = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : '';
    return `  <url>
    <loc>${url}</loc>${lastmodStr}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

// 生成网站地图 XML
function generateSitemap(urls) {
    const urlEntries = urls.map(url => createUrlEntry(url.loc, url.lastmod, url.changefreq, url.priority)).join('\n');
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

// 生成主网站地图（语言选择页面）
function generateMainSitemap() {
    const urls = [
        {
            loc: SITE_CONFIG.baseUrls.main,
            lastmod: new Date().toISOString().split('T')[0],
            changefreq: 'daily',
            priority: '1.0'
        }
    ];
    
    return generateSitemap(urls);
}

// 生成语言版本网站地图
function generateLanguageSitemap(lang) {
    const baseUrl = SITE_CONFIG.baseUrls[lang];
    const urls = [];
    
    // 添加主页
    urls.push({
        loc: baseUrl,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'daily',
        priority: '1.0'
    });
    
    // 添加计算器页面
    Object.entries(SITE_CONFIG.calculatorCategories).forEach(([mainCategory, categories]) => {
        Object.entries(categories).forEach(([category, calculators]) => {
            calculators.forEach(calculator => {
                urls.push({
                    loc: `${baseUrl}/${mainCategory}/${category}/${calculator}.html`,
                    lastmod: new Date().toISOString().split('T')[0],
                    changefreq: 'weekly',
                    priority: '0.8'
                });
            });
        });
    });
    
    return generateSitemap(urls);
}

// 生成网站地图索引文件
function generateSitemapIndex() {
    const sitemaps = [];
    
    // 主网站地图
    sitemaps.push({
        loc: `${SITE_CONFIG.baseUrls.main}/sitemap.xml`,
        lastmod: new Date().toISOString().split('T')[0]
    });
    
    // 各语言版本网站地图
    SITE_CONFIG.languages.forEach(lang => {
        sitemaps.push({
            loc: `${SITE_CONFIG.baseUrls[lang]}/sitemap.xml`,
            lastmod: new Date().toISOString().split('T')[0]
        });
    });
    
    const sitemapEntries = sitemaps.map(sitemap => 
        `  <sitemap>
    <loc>${sitemap.loc}</loc>
    <lastmod>${sitemap.lastmod}</lastmod>
  </sitemap>`
    ).join('\n');
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</sitemapindex>`;
}

// 生成 robots.txt 文件
function generateRobotsTxt() {
    const sitemapUrls = [SITE_CONFIG.baseUrls.main, ...SITE_CONFIG.languages.map(lang => SITE_CONFIG.baseUrls[lang])]
        .map(url => `Sitemap: ${url}/sitemap.xml`)
        .join('\n');
    
    return `User-agent: *
Allow: /

# Sitemaps
${sitemapUrls}

# Specific rules for better crawling
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

# Disallow common unwanted paths
Disallow: /temp/
Disallow: /.well-known/
Disallow: /api/
Disallow: /*?
`;
}

// 主函数
function main() {
    console.log('🗺️ 开始生成 IntlCalc.com 网站地图...\n');
    
    try {
        // 生成主网站地图
        console.log('📋 生成主网站地图...');
        const mainSitemap = generateMainSitemap();
        fs.writeFileSync('generated_pages/sitemap.xml', mainSitemap, 'utf8');
        console.log('✅ 主网站地图: generated_pages/sitemap.xml');
        
        // 生成各语言版本网站地图
        SITE_CONFIG.languages.forEach(lang => {
            console.log(`📋 生成 ${lang} 版本网站地图...`);
            const langSitemap = generateLanguageSitemap(lang);
            
            // 确保目录存在
            const langDir = `generated_pages/${lang}`;
            if (!fs.existsSync(langDir)) {
                fs.mkdirSync(langDir, { recursive: true });
            }
            
            fs.writeFileSync(`${langDir}/sitemap.xml`, langSitemap, 'utf8');
            console.log(`✅ ${lang} 网站地图: ${langDir}/sitemap.xml`);
        });
        
        // 生成网站地图索引
        console.log('📋 生成网站地图索引...');
        const sitemapIndex = generateSitemapIndex();
        fs.writeFileSync('generated_pages/sitemap-index.xml', sitemapIndex, 'utf8');
        console.log('✅ 网站地图索引: generated_pages/sitemap-index.xml');
        
        // 生成 robots.txt
        console.log('📋 生成 robots.txt...');
        const robotsTxt = generateRobotsTxt();
        fs.writeFileSync('generated_pages/robots.txt', robotsTxt, 'utf8');
        console.log('✅ robots.txt: generated_pages/robots.txt');
        
        // 为每个语言版本也生成 robots.txt
        SITE_CONFIG.languages.forEach(lang => {
            const langRobotsTxt = `User-agent: *
Allow: /

Sitemap: ${SITE_CONFIG.baseUrls[lang]}/sitemap.xml

# Language-specific robots.txt for ${lang}
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /
`;
            fs.writeFileSync(`generated_pages/${lang}/robots.txt`, langRobotsTxt, 'utf8');
            console.log(`✅ ${lang} robots.txt: generated_pages/${lang}/robots.txt`);
        });
        
        console.log('\n🎉 网站地图生成完成！');
        console.log('\n📝 统计信息:');
        console.log(`- 主网站地图: 1 个页面`);
        SITE_CONFIG.languages.forEach(lang => {
            const totalPages = 1 + Object.values(SITE_CONFIG.calculatorCategories)
                .reduce((sum, categories) => 
                    sum + Object.values(categories).reduce((catSum, calculators) => catSum + calculators.length, 0), 0);
            console.log(`- ${lang} 网站地图: ${totalPages} 个页面`);
        });
        
        console.log('\n📋 下一步操作:');
        console.log('1. 重新部署网站到 Cloudflare Pages');
        console.log('2. 在 Google Search Console 中添加并验证所有域名');
        console.log('3. 为每个域名提交对应的网站地图');
        console.log('4. 监控索引状态和搜索表现');
        
    } catch (error) {
        console.error('❌ 生成网站地图时出错:', error.message);
        process.exit(1);
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    main();
}

module.exports = { 
    generateMainSitemap, 
    generateLanguageSitemap, 
    generateSitemapIndex, 
    generateRobotsTxt,
    SITE_CONFIG 
}; 