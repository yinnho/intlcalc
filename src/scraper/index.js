const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const path = require('path');
const DatabaseInitializer = require('../database/init');
const sqlite3 = require('sqlite3').verbose();

class CalculatorScraper {
    constructor() {
        this.browser = null;
        this.db = null;
        this.dbPath = path.join(__dirname, '../../data/calculators.db');
        this.outputDir = path.join(__dirname, '../../scraped_data');
        
        // 目标网站配置 - 扩展为完整抓取策略
        this.targetSites = {
            rapidtables: {
                baseUrl: 'https://www.rapidtables.com',
                // 主要分类页面 - 扩展完整覆盖
                categoryPages: [
                    // 主索引页面
                    'https://www.rapidtables.com/calc/index.html',
                    'https://www.rapidtables.com/',
                    
                    // 计算器分类
                    'https://www.rapidtables.com/calc/math/index.html',      // 数学计算器
                    'https://www.rapidtables.com/calc/finance/index.html',   // 金融计算器
                    'https://www.rapidtables.com/calc/electric/index.html',  // 电气计算器  
                    'https://www.rapidtables.com/calc/physics/index.html',   // 物理计算器
                    'https://www.rapidtables.com/calc/health/index.html',    // 健康计算器
                    'https://www.rapidtables.com/calc/time/index.html',      // 时间计算器
                    'https://www.rapidtables.com/calc/graph/index.html',     // 图形计算器
                    'https://www.rapidtables.com/calc/color/index.html',     // 颜色计算器
                    'https://www.rapidtables.com/calc/geometry/index.html',  // 几何计算器
                    'https://www.rapidtables.com/calc/wire/index.html',      // 线路计算器
                    'https://www.rapidtables.com/calc/lighting/index.html',  // 照明计算器
                    
                    // 转换/计算分类（这里有大量计算器）
                    'https://www.rapidtables.com/convert/electric/index.html', // 电气转换计算
                    'https://www.rapidtables.com/convert/power/index.html',    // 功率转换
                    'https://www.rapidtables.com/convert/energy/index.html',   // 能量转换  
                    'https://www.rapidtables.com/convert/temperature/index.html', // 温度转换
                    'https://www.rapidtables.com/convert/weight/index.html',   // 重量转换
                    'https://www.rapidtables.com/convert/length/index.html',   // 长度转换
                    'https://www.rapidtables.com/convert/volume/index.html',   // 体积转换
                    'https://www.rapidtables.com/convert/time/index.html',     // 时间转换
                    'https://www.rapidtables.com/convert/frequency/index.html', // 频率转换
                ],
                // 直接计算器页面模式
                directPatterns: [
                    '/calc/math/',
                    '/calc/finance/', 
                    '/calc/electric/',
                    '/calc/wire/',
                    '/calc/time/',
                    '/calc/health/',
                    '/calc/physics/',
                    '/calc/graph/',
                    '/calc/color/',
                    '/calc/geometry/'
                ]
            }
        };
        
        this.scraped_urls = new Set();
    }

    async init() {
        // 初始化数据库
        const dbInit = new DatabaseInitializer();
        await dbInit.init();
        dbInit.close();
        
        // 连接数据库
        this.db = new sqlite3.Database(this.dbPath);
        
        // 确保输出目录存在
        await fs.ensureDir(this.outputDir);
        await fs.ensureDir(path.join(this.outputDir, 'html'));
        await fs.ensureDir(path.join(this.outputDir, 'css'));
        await fs.ensureDir(path.join(this.outputDir, 'js'));
        
        console.log('抓取器初始化完成');
    }

    async startBrowser() {
        this.browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-web-security',
                '--disable-features=VizDisplayCompositor'
            ]
        });
        console.log('浏览器启动成功');
    }

    async scrapeCalculatorIndex() {
        console.log('🚀 开始暴力抓取所有计算器页面...');
        console.log('策略：先发现所有链接，再逐个深度抓取');
        
        const allCalculatorLinks = new Map(); // 使用Map去重
        const toVisit = [...this.targetSites.rapidtables.categoryPages]; // 待访问页面队列
        const visited = new Set(); // 已访问页面
        
        // 广度优先搜索，递归发现所有计算器链接
        while (toVisit.length > 0) {
            const currentUrl = toVisit.shift();
            
            if (visited.has(currentUrl)) continue;
            visited.add(currentUrl);
            
            console.log(`🔍 正在扫描页面: ${currentUrl}`);
            
            try {
                const links = await this.extractLinksFromPage(currentUrl);
                let newLinksCount = 0;
                
                // 处理发现的链接
                let newCalculators = 0;
                let newIndexPages = 0;
                
                links.forEach(link => {
                    if (link.type === 'calculator') {
                        // 计算器页面：添加到结果集
                        if (!allCalculatorLinks.has(link.url)) {
                            allCalculatorLinks.set(link.url, link);
                            newCalculators++;
                        }
                    } else if (link.type === 'index') {
                        // 索引页面：添加到待访问队列进行进一步发现
                        if (!visited.has(link.url) && !toVisit.includes(link.url)) {
                            toVisit.push(link.url);
                            newIndexPages++;
                        }
                    }
                });
                
                console.log(`   📊 发现 ${links.length} 个链接：${newCalculators} 个新计算器，${newIndexPages} 个新索引页`);
                console.log(`   📋 队列中还有 ${toVisit.length} 个页面待扫描，已发现 ${allCalculatorLinks.size} 个计算器`);
                
            } catch (error) {
                console.error(`   ❌ 扫描失败: ${error.message}`);
            }
            
            // 防止过快请求
            await this.delay(1000);
        }
        
        const totalLinks = Array.from(allCalculatorLinks.values());
        console.log(`\n🎯 链接发现完成！总计发现 ${totalLinks.length} 个唯一计算器页面`);
        console.log('🔄 开始逐个深度抓取计算器内容...\n');
        
        // 抓取每个计算器页面的完整内容
        let completed = 0;
        let failed = 0;
        
        for (const link of totalLinks) {
            if (!this.scraped_urls.has(link.url)) {
                try {
                    await this.scrapeCalculatorPage(link);
                    this.scraped_urls.add(link.url);
                    completed++;
                    
                    console.log(`   ✅ 进度: ${completed}/${totalLinks.length} - ${link.title}`);
                    
                    // 每10个计算器打印一次进度报告
                    if (completed % 10 === 0) {
                        console.log(`\n📊 中期报告: 已完成 ${completed}/${totalLinks.length}, 失败 ${failed} 个\n`);
                    }
                    
                    // 延迟以避免过度请求
                    await this.delay(1500);
                    
                } catch (error) {
                    failed++;
                    console.error(`   ❌ 抓取失败: ${link.title} - ${error.message}`);
                }
            }
        }
        
        console.log(`\n🎉 抓取完成！成功: ${completed} 个，失败: ${failed} 个，总计尝试: ${totalLinks.length} 个`);
    }
    
    async extractLinksFromPage(pageUrl) {
        const page = await this.browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        
        const links = [];
        
        try {
            await page.goto(pageUrl, { 
                waitUntil: 'networkidle2',
                timeout: 30000 
            });
            
            const content = await page.content();
            const $ = cheerio.load(content);
            
            // 暴力全面的链接提取策略
            const selectors = [
                // 主要计算器页面模式
                'a[href*="/calc/"][href$=".html"]',           // 直接计算器页面
                'a[href*="/convert/"][href$=".html"]',        // 转换计算器页面
                'a[href*="/calculate/"]',                     // calculate页面
                'a[href*="calculator"]',                      // 包含calculator的所有链接
                'a[href*="conversion"]',                      // 包含conversion的链接
                
                // 各种容器中的链接
                'td a[href*="/calc/"]',                       // 表格中的计算器链接
                'td a[href*="/convert/"]',                    // 表格中的转换链接  
                'li a[href*="/calc/"]',                       // 列表中的计算器链接
                'li a[href*="/convert/"]',                    // 列表中的转换链接
                'div a[href*="/calc/"]',                      // div中的计算器链接
                'div a[href*="/convert/"]',                   // div中的转换链接
                'nav a[href*="/calc/"]',                      // 导航中的计算器链接
                'nav a[href*="/convert/"]',                   // 导航中的转换链接
                
                // 侧边栏和相关链接
                '.sidebar a[href*="/calc/"]',                 // 侧边栏计算器
                '.related a[href*="/calc/"]',                 // 相关计算器
                '.menu a[href*="/calc/"]',                    // 菜单中的计算器
                '.links a[href*="/calc/"]',                   // 链接区域
                
                // 特定类名（常见的网站结构）
                '.calc-list a',                               // 计算器列表
                '.calculator-link',                           // 计算器链接类
                '.tool-link',                                 // 工具链接
                '.convert-link',                              // 转换链接
                
                // 更宽泛的模式匹配
                'a[href*="/calc/"][href*="/"]',               // 所有calc目录下的链接
                'a[href*="/convert/"][href*="/"]',            // 所有convert目录下的链接
                'a[href*="index.html"]',                      // 索引页面（用于进一步发现）
            ];
            
            selectors.forEach(selector => {
                $(selector).each((index, element) => {
                    const href = $(element).attr('href');
                    const text = $(element).text().trim();
                    
                    if (href && text) {
                        const fullUrl = href.startsWith('http') ? href : this.targetSites.rapidtables.baseUrl + href;
                        
                        // 更宽松的过滤条件：只要是RapidTables网站的相关页面就收集
                        const isRapidTablesUrl = fullUrl.includes('rapidtables.com');
                        const isRelevantPath = fullUrl.includes('/calc/') || fullUrl.includes('/convert/') || fullUrl.includes('calculator');
                        const hasValidText = text.length > 1 && !text.match(/^[^a-zA-Z]*$/); // 排除纯符号文本
                        const notFragment = !fullUrl.includes('#'); // 排除页面内锚点
                        const notImage = !fullUrl.match(/\.(jpg|jpeg|png|gif|svg|css|js)$/i); // 排除资源文件
                        
                        if (isRapidTablesUrl && isRelevantPath && hasValidText && notFragment && notImage) {
                            // 进一步分类：计算器页面 vs 索引页面
                            const isCalculatorPage = fullUrl.includes('.html') && !fullUrl.includes('/index.html');
                            const isIndexPage = fullUrl.includes('/index.html') || fullUrl.endsWith('/');
                            
                            links.push({
                                url: fullUrl,
                                title: this.cleanTitle(text),
                                category: this.extractCategory(href),
                                type: isCalculatorPage ? 'calculator' : 'index'
                            });
                        }
                    }
                });
            });
            
        } catch (error) {
            console.error(`抓取页面失败 ${pageUrl}:`, error.message);
        } finally {
            await page.close();
        }
        
        return links;
    }
    
    cleanTitle(title) {
        return title.replace(/\s+/g, ' ')
                   .replace(/[^\w\s\-\+\(\)]/g, '')
                   .trim()
                   .substring(0, 100);
    }

    async scrapeCalculatorPage(linkInfo) {
        console.log(`抓取页面: ${linkInfo.title} - ${linkInfo.url}`);
        
        const page = await this.browser.newPage();
        
        try {
            // 监听网络请求，获取额外的资源文件
            const resources = {
                css: [],
                js: [],
                images: []
            };
            
            page.on('response', async (response) => {
                const url = response.url();
                const contentType = response.headers()['content-type'] || '';
                
                if (contentType.includes('text/css')) {
                    try {
                        const cssContent = await response.text();
                        resources.css.push({ url, content: cssContent });
                    } catch (e) {}
                } else if (contentType.includes('javascript')) {
                    try {
                        const jsContent = await response.text();
                        resources.js.push({ url, content: jsContent });
                    } catch (e) {}
                }
            });
            
            await page.goto(linkInfo.url, { 
                waitUntil: 'networkidle2',
                timeout: 30000 
            });
            
            // 等待页面完全加载
            await page.waitForTimeout(3000);
            
            // 获取页面内容
            const content = await page.content();
            const $ = cheerio.load(content);
            
            // 提取页面数据
            const calculatorData = await this.extractCalculatorData($, linkInfo, resources);
            
            // 保存到数据库
            await this.saveCalculatorData(calculatorData);
            
            // 保存原始文件
            await this.saveRawFiles(calculatorData, content);
            
            console.log(`成功抓取: ${linkInfo.title}`);
            
        } catch (error) {
            console.error('抓取页面失败 ${linkInfo.url}:', error);
        } finally {
            await page.close();
        }
    }

    extractCalculatorData($, linkInfo, resources) {
        const data = {
            basic: {
                name: linkInfo.title,
                slug: this.generateSlug(linkInfo.title),
                category: linkInfo.category,
                url: linkInfo.url,
                title: $('title').text(),
                description: $('meta[name="description"]').attr('content') || '',
                keywords: $('meta[name="keywords"]').attr('content') || ''
            },
            html: {
                calculator_container: this.findCalculatorContainer($),
                input_elements: this.extractInputElements($),
                output_elements: this.extractOutputElements($),
                button_elements: this.extractButtons($),
                full_html: $.html()
            },
            css: {
                inline_styles: this.extractInlineStyles($),
                internal_styles: this.extractInternalStyles($),
                external_styles: resources.css
            },
            javascript: {
                inline_scripts: this.extractInlineScripts($),
                external_scripts: resources.js,
                event_handlers: this.extractEventHandlers($)
            },
            calculations: {
                formulas: this.extractFormulas($),
                functions: this.extractCalculationFunctions($)
            }
        };
        
        return data;
    }

    findCalculatorContainer($) {
        // 尝试找到计算器主容器
        const selectors = [
            '.calculator',
            '#calculator', 
            '[class*="calc"]',
            '.content table',
            'form',
            '.main-content'
        ];
        
        for (const selector of selectors) {
            const element = $(selector);
            if (element.length > 0) {
                return {
                    selector: selector,
                    html: element.html(),
                    text: element.text()
                };
            }
        }
        
        return null;
    }

    extractInputElements($) {
        const inputs = [];
        
        $('input, select, textarea').each((index, element) => {
            const $el = $(element);
            inputs.push({
                tag: element.tagName.toLowerCase(),
                type: $el.attr('type') || 'text',
                name: $el.attr('name') || '',
                id: $el.attr('id') || '',
                class: $el.attr('class') || '',
                placeholder: $el.attr('placeholder') || '',
                value: $el.attr('value') || '',
                required: $el.attr('required') ? true : false,
                min: $el.attr('min') || null,
                max: $el.attr('max') || null,
                step: $el.attr('step') || null
            });
        });
        
        return inputs;
    }

    extractOutputElements($) {
        const outputs = [];
        
        // 查找可能的输出元素
        $('[id*="result"], [class*="result"], [id*="output"], [class*="output"]').each((index, element) => {
            const $el = $(element);
            outputs.push({
                tag: element.tagName.toLowerCase(),
                id: $el.attr('id') || '',
                class: $el.attr('class') || '',
                text: $el.text(),
                html: $el.html()
            });
        });
        
        return outputs;
    }

    extractButtons($) {
        const buttons = [];
        
        $('button, input[type="button"], input[type="submit"]').each((index, element) => {
            const $el = $(element);
            buttons.push({
                tag: element.tagName.toLowerCase(),
                type: $el.attr('type') || 'button',
                id: $el.attr('id') || '',
                class: $el.attr('class') || '',
                onclick: $el.attr('onclick') || '',
                text: $el.text() || $el.attr('value') || ''
            });
        });
        
        return buttons;
    }

    extractInlineStyles($) {
        const styles = [];
        
        $('[style]').each((index, element) => {
            const $el = $(element);
            styles.push({
                element: element.tagName.toLowerCase(),
                id: $el.attr('id') || '',
                class: $el.attr('class') || '',
                style: $el.attr('style')
            });
        });
        
        return styles;
    }

    extractInternalStyles($) {
        const styles = [];
        
        $('style').each((index, element) => {
            styles.push($(element).html());
        });
        
        return styles.join('\n');
    }

    extractInlineScripts($) {
        const scripts = [];
        
        $('script').each((index, element) => {
            const $el = $(element);
            const src = $el.attr('src');
            
            if (!src && $el.html()) {
                scripts.push({
                    content: $el.html(),
                    type: $el.attr('type') || 'text/javascript'
                });
            }
        });
        
        return scripts;
    }

    extractEventHandlers($) {
        const handlers = [];
        
        $('[onclick], [onchange], [onkeyup], [onsubmit]').each((index, element) => {
            const $el = $(element);
            
            ['onclick', 'onchange', 'onkeyup', 'onsubmit'].forEach(event => {
                const handler = $el.attr(event);
                if (handler) {
                    handlers.push({
                        element: element.tagName.toLowerCase(),
                        id: $el.attr('id') || '',
                        class: $el.attr('class') || '',
                        event: event,
                        handler: handler
                    });
                }
            });
        });
        
        return handlers;
    }

    extractFormulas($) {
        // 尝试从页面内容中提取数学公式
        const formulas = [];
        const text = $.text();
        
        // 简单的公式匹配模式
        const formulaPatterns = [
            /([A-Za-z]+)\s*=\s*([^\\n]+)/g,
            /Formula:\s*([^\\n]+)/gi,
            /Calculation:\s*([^\\n]+)/gi
        ];
        
        formulaPatterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(text)) !== null) {
                formulas.push({
                    name: match[1] || 'unknown',
                    expression: match[2] || match[1] || match[0],
                    source: 'content_extraction'
                });
            }
        });
        
        return formulas;
    }

    extractCalculationFunctions($) {
        const functions = [];
        
        // 从内联脚本中提取函数
        $('script').each((index, element) => {
            const content = $(element).html();
            if (content) {
                // 简单的函数匹配
                const functionMatches = content.match(/function\\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\\s*\\([^)]*\\)\\s*{[^}]*}/g);
                
                if (functionMatches) {
                    functionMatches.forEach(func => {
                        const nameMatch = func.match(/function\\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/);
                        functions.push({
                            name: nameMatch ? nameMatch[1] : 'anonymous',
                            code: func,
                            type: 'function'
                        });
                    });
                }
            }
        });
        
        return functions;
    }

    async saveCalculatorData(data) {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare(`
                INSERT INTO calculators (
                    name, slug, category, url, title, description, keywords,
                    calculator_type, scraped_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
            `);
            
            const self = this; // 保存this上下文
            stmt.run([
                data.basic.name,
                data.basic.slug,
                data.basic.category,
                data.basic.url,
                data.basic.title,
                data.basic.description,
                data.basic.keywords,
                this.detectCalculatorType(data),
            ], function(err) {
                if (err) {
                    reject(err);
                } else {
                    const calculatorId = this.lastID;
                    resolve(calculatorId);
                    
                    // 异步保存其他数据
                    self.saveDetailedData(calculatorId, data);
                }
            });
        });
    }

    async saveDetailedData(calculatorId, data) {
        // 保存HTML结构
        if (data.html.input_elements) {
            data.html.input_elements.forEach(input => {
                this.db.run(`
                    INSERT INTO html_structures (
                        calculator_id, element_type, element_tag, element_classes,
                        element_id, element_html, is_input
                    ) VALUES (?, ?, ?, ?, ?, ?, 1)
                `, [calculatorId, 'input', input.tag, input.class, input.id, JSON.stringify(input)]);
            });
        }
        
        // 保存CSS样式
        if (data.css.internal_styles) {
            this.db.run(`
                INSERT INTO css_styles (calculator_id, css_rules, css_type)
                VALUES (?, ?, 'internal')
            `, [calculatorId, data.css.internal_styles]);
        }
        
        // 保存JavaScript代码
        if (data.javascript.inline_scripts) {
            data.javascript.inline_scripts.forEach(script => {
                this.db.run(`
                    INSERT INTO javascript_code (
                        calculator_id, function_type, code_content
                    ) VALUES (?, 'calculation', ?)
                `, [calculatorId, script.content]);
            });
        }
        
        // 保存计算公式
        if (data.calculations.formulas) {
            data.calculations.formulas.forEach(formula => {
                this.db.run(`
                    INSERT INTO calculation_formulas (
                        calculator_id, formula_name, formula_expression
                    ) VALUES (?, ?, ?)
                `, [calculatorId, formula.name, formula.expression]);
            });
        }
    }

    async saveRawFiles(data, content) {
        const slug = data.basic.slug;
        
        // 保存HTML文件
        await fs.writeFile(
            path.join(this.outputDir, 'html', `${slug}.html`),
            content,
            'utf8'
        );
        
        // 保存提取的数据为JSON
        await fs.writeFile(
            path.join(this.outputDir, `${slug}_data.json`),
            JSON.stringify(data, null, 2),
            'utf8'
        );
        
        console.log(`原始文件已保存: ${slug}`);
    }

    extractCategory(url) {
        const patterns = {
            'math': '数学计算',
            'finance': '金融计算',
            'electric': '电气计算',
            'wire': '线缆计算',
            'time': '时间计算',
            'health': '健康计算'
        };
        
        for (const [key, value] of Object.entries(patterns)) {
            if (url.includes(key)) {
                return value;
            }
        }
        
        return '其他';
    }

    generateSlug(title) {
        return title.toLowerCase()
            .replace(/[^a-z0-9\\s-]/g, '')
            .replace(/\\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');
    }

    detectCalculatorType(data) {
        const title = data.basic.title.toLowerCase();
        
        if (title.includes('scientific') || title.includes('complex')) {
            return 'scientific';
        } else if (title.includes('convert') || title.includes('unit')) {
            return 'converter';
        } else if (title.includes('average') || title.includes('statistic')) {
            return 'statistical';
        } else if (title.includes('chart') || title.includes('table')) {
            return 'query';
        }
        
        return 'formula';
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
        }
        
        if (this.db) {
            this.db.close();
        }
        
        console.log('抓取器已关闭');
    }
}

// 主要执行函数
async function main() {
    const scraper = new CalculatorScraper();
    
    try {
        await scraper.init();
        await scraper.startBrowser();
        await scraper.scrapeCalculatorIndex();
        
        console.log('所有抓取任务完成');
        
    } catch (error) {
        console.error('抓取过程中发生错误:', error);
    } finally {
        await scraper.close();
    }
}

// 如果直接运行此文件
if (require.main === module) {
    main();
}

module.exports = CalculatorScraper; 