const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const path = require('path');
const url = require('url');

class SiteMirror {
    constructor() {
        this.baseUrl = 'https://www.rapidtables.com';
        this.outputDir = path.join(__dirname, '../../mirrored_site');
        this.visitedUrls = new Set();
        this.downloadedFiles = new Set();
        this.browser = null;
    }

    async init() {
        await fs.ensureDir(this.outputDir);
        console.log(`📁 输出目录: ${this.outputDir}`);
    }

    async startBrowser() {
        this.browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        console.log('🚀 浏览器启动成功');
    }

    async discoverAllPages() {
        console.log('🔍 开始发现所有计算器页面...');
        
        const startUrls = [
            'https://www.rapidtables.com/calc/index.html',
            'https://www.rapidtables.com/calc/math/index.html',
            'https://www.rapidtables.com/calc/finance/index.html',
            'https://www.rapidtables.com/calc/electric/index.html',
            'https://www.rapidtables.com/convert/electric/index.html',
        ];

        const allPages = new Set();
        const toVisit = [...startUrls];
        
        while (toVisit.length > 0) {
            const currentUrl = toVisit.shift();
            if (this.visitedUrls.has(currentUrl)) continue;
            
            console.log(`   扫描: ${currentUrl}`);
            this.visitedUrls.add(currentUrl);
            
            try {
                const links = await this.extractLinksFromPage(currentUrl);
                let newPages = 0;
                
                links.forEach(link => {
                    if (this.isCalculatorPage(link)) {
                        if (!allPages.has(link)) {
                            allPages.add(link);
                            newPages++;
                        }
                    } else if (this.isIndexPage(link)) {
                        if (!this.visitedUrls.has(link) && !toVisit.includes(link)) {
                            toVisit.push(link);
                        }
                    }
                });
                
                console.log(`   ✅ 发现 ${newPages} 个新页面，总计 ${allPages.size} 个`);
                
            } catch (error) {
                console.error(`   ❌ 扫描失败: ${error.message}`);
            }
            
            await this.delay(1000);
        }
        
        console.log(`🎯 发现完成！总计 ${allPages.size} 个计算器页面`);
        return Array.from(allPages);
    }

    async extractLinksFromPage(pageUrl) {
        const page = await this.browser.newPage();
        const links = [];
        
        try {
            await page.goto(pageUrl, { waitUntil: 'networkidle2', timeout: 30000 });
            
            const hrefs = await page.evaluate(() => {
                const elements = document.querySelectorAll('a[href]');
                return Array.from(elements).map(el => el.href);
            });
            
            hrefs.forEach(href => {
                if (href && href.includes('rapidtables.com') && 
                    (href.includes('/calc/') || href.includes('/convert/'))) {
                    links.push(href);
                }
            });
            
        } catch (error) {
            console.error(`提取链接失败: ${error.message}`);
        } finally {
            await page.close();
        }
        
        return [...new Set(links)]; // 去重
    }

    isCalculatorPage(url) {
        return url.includes('.html') && 
               !url.includes('/index.html') &&
               (url.includes('/calc/') || url.includes('/convert/'));
    }

    isIndexPage(url) {
        return url.includes('/index.html') || 
               (url.endsWith('/') && (url.includes('/calc/') || url.includes('/convert/')));
    }

    async mirrorPage(pageUrl) {
        // 检查文件是否已存在
        const relativePath = this.getRelativePath(pageUrl);
        const filePath = path.join(this.outputDir, relativePath);
        
        if (await fs.pathExists(filePath)) {
            console.log(`   ⏭️  跳过已存在: ${relativePath}`);
            return;
        }

        console.log(`   📥 下载: ${relativePath}`);
        
        const page = await this.browser.newPage();
        
        try {
            await page.goto(pageUrl, { waitUntil: 'networkidle2', timeout: 30000 });
            
            // 获取HTML内容
            const htmlContent = await page.content();
            
            // 保存HTML文件
            await fs.ensureDir(path.dirname(filePath));
            await fs.writeFile(filePath, htmlContent, 'utf8');
            
            // 提取并下载CSS/JS资源
            await this.downloadPageResources(page, pageUrl);
            
            console.log(`   ✅ 完成: ${relativePath}`);
            
        } catch (error) {
            console.error(`   ❌ 下载失败: ${relativePath} - ${error.message}`);
        } finally {
            await page.close();
        }
    }

    async downloadPageResources(page, pageUrl) {
        // 获取页面中的所有CSS和JS链接
        const resources = await page.evaluate(() => {
            const links = [];
            
            // CSS文件
            document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
                if (link.href) links.push({ type: 'css', url: link.href });
            });
            
            // JS文件
            document.querySelectorAll('script[src]').forEach(script => {
                if (script.src) links.push({ type: 'js', url: script.src });
            });
            
            return links;
        });
        
        // 下载每个资源文件
        for (const resource of resources) {
            if (resource.url.includes('rapidtables.com')) {
                await this.downloadResource(resource.url);
            }
        }
    }

    async downloadResource(resourceUrl) {
        // 检查是否已下载
        if (this.downloadedFiles.has(resourceUrl)) {
            return;
        }
        
        const relativePath = this.getRelativePath(resourceUrl);
        const filePath = path.join(this.outputDir, relativePath);
        
        // 检查文件是否已存在
        if (await fs.pathExists(filePath)) {
            this.downloadedFiles.add(resourceUrl);
            return;
        }
        
        try {
            const page = await this.browser.newPage();
            const response = await page.goto(resourceUrl, { waitUntil: 'networkidle2' });
            
            if (response && response.ok()) {
                const content = await response.text();
                
                await fs.ensureDir(path.dirname(filePath));
                await fs.writeFile(filePath, content, 'utf8');
                
                console.log(`     📎 资源: ${relativePath}`);
            }
            
            await page.close();
            this.downloadedFiles.add(resourceUrl);
            
        } catch (error) {
            console.error(`     ❌ 资源下载失败: ${relativePath} - ${error.message}`);
        }
    }

    getRelativePath(fullUrl) {
        const parsed = url.parse(fullUrl);
        let pathname = parsed.pathname;
        
        // 移除开头的斜杠
        if (pathname.startsWith('/')) {
            pathname = pathname.substring(1);
        }
        
        // 如果是目录，添加index.html
        if (pathname.endsWith('/')) {
            pathname += 'index.html';
        }
        
        return pathname;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async startMirroring() {
        await this.init();
        await this.startBrowser();
        
        // 第一步：发现所有页面
        const allPages = await this.discoverAllPages();
        
        // 第二步：下载所有页面
        console.log('\n🏗️  开始镜像所有页面...');
        let completed = 0;
        
        for (const pageUrl of allPages) {
            await this.mirrorPage(pageUrl);
            completed++;
            
            if (completed % 10 === 0) {
                console.log(`\n📊 进度: ${completed}/${allPages.length} (${Math.round(completed/allPages.length*100)}%)\n`);
            }
            
            await this.delay(1500); // 避免请求过快
        }
        
        console.log(`\n🎉 镜像完成！`);
        console.log(`📁 输出目录: ${this.outputDir}`);
        console.log(`📄 页面数量: ${allPages.length}`);
        console.log(`📎 资源文件: ${this.downloadedFiles.size}`);
        
        await this.browser.close();
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
        }
    }
}

// 主执行函数
async function main() {
    const mirror = new SiteMirror();
    
    try {
        await mirror.startMirroring();
    } catch (error) {
        console.error('镜像过程中发生错误:', error);
    } finally {
        await mirror.close();
    }
}

if (require.main === module) {
    main();
}

module.exports = SiteMirror; 