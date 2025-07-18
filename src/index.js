const CalculatorScraper = require('./scraper/index');
const CalculatorParser = require('./parser/index');
const PageGenerator = require('./generator/index');
const JavaScriptExtractor = require('./extractor/js-extractor');
const DatabaseInitializer = require('./database/init');

class CalculatorSystemManager {
    constructor(options = {}) {
        this.options = {
            skipScraping: options.skipScraping || false,
            skipParsing: options.skipParsing || false,
            skipGeneration: options.skipGeneration || false,
            skipExtraction: options.skipExtraction || false,
            languages: options.languages || ['en', 'zh', 'es', 'fr', 'de'],
            maxConcurrent: options.maxConcurrent || 3,
            delay: options.delay || 2000,
            ...options
        };
        
        this.components = {
            scraper: new CalculatorScraper(),
            parser: new CalculatorParser(),
            generator: new PageGenerator(),
            extractor: new JavaScriptExtractor()
        };
        
        this.stats = {
            startTime: null,
            endTime: null,
            scrapedCount: 0,
            parsedCount: 0,
            generatedCount: 0,
            extractedCount: 0,
            errors: []
        };
    }

    async initialize() {
        console.log('🚀 初始化计算器系统管理器...');
        
        try {
            // 初始化数据库
            const dbInit = new DatabaseInitializer();
            await dbInit.init();
            dbInit.close();
            console.log('✅ 数据库初始化完成');
            
            // 初始化各个组件
            for (const [name, component] of Object.entries(this.components)) {
                await component.init();
                console.log(`✅ ${name} 初始化完成`);
            }
            
            console.log('🎉 系统初始化完成！');
            
        } catch (error) {
            console.error('❌ 系统初始化失败:', error);
            throw error;
        }
    }

    async runFullPipeline() {
        console.log('\n🔄 开始运行完整的数据处理流水线...\n');
        
        this.stats.startTime = new Date();
        
        try {
            // 第一步：数据抓取
            if (!this.options.skipScraping) {
                console.log('📥 步骤 1/4: 数据抓取');
                await this.runScraping();
                console.log('✅ 数据抓取完成\n');
            } else {
                console.log('⏭️  跳过数据抓取步骤\n');
            }
            
            // 第二步：数据解析
            if (!this.options.skipParsing) {
                console.log('🔍 步骤 2/4: 数据解析');
                await this.runParsing();
                console.log('✅ 数据解析完成\n');
            } else {
                console.log('⏭️  跳过数据解析步骤\n');
            }
            
            // 第三步：JavaScript提取
            if (!this.options.skipExtraction) {
                console.log('⚡ 步骤 3/4: JavaScript代码提取');
                await this.runExtraction();
                console.log('✅ JavaScript代码提取完成\n');
            } else {
                console.log('⏭️  跳过JavaScript提取步骤\n');
            }
            
            // 第四步：页面生成
            if (!this.options.skipGeneration) {
                console.log('🛠️  步骤 4/4: 页面生成');
                await this.runGeneration();
                console.log('✅ 页面生成完成\n');
            } else {
                console.log('⏭️  跳过页面生成步骤\n');
            }
            
            this.stats.endTime = new Date();
            this.printFinalReport();
            
        } catch (error) {
            console.error('❌ 流水线执行失败:', error);
            this.stats.errors.push({
                step: 'pipeline',
                error: error.message,
                timestamp: new Date()
            });
            throw error;
        } finally {
            await this.cleanup();
        }
    }

    async runScraping() {
        try {
            console.log('  🌐 正在抓取计算器网站数据...');
            
            await this.components.scraper.startBrowser();
            await this.components.scraper.scrapeCalculatorIndex();
            
            // 获取抓取统计
            this.stats.scrapedCount = await this.getTableCount('calculators');
            
        } catch (error) {
            console.error('  ❌ 数据抓取失败:', error.message);
            this.stats.errors.push({
                step: 'scraping',
                error: error.message,
                timestamp: new Date()
            });
            throw error;
        }
    }

    async runParsing() {
        try {
            console.log('  🔬 正在解析计算器数据...');
            
            await this.components.parser.parseAllCalculators();
            
            this.stats.parsedCount = await this.getTableCount('calculators');
            
        } catch (error) {
            console.error('  ❌ 数据解析失败:', error.message);
            this.stats.errors.push({
                step: 'parsing',
                error: error.message,
                timestamp: new Date()
            });
            throw error;
        }
    }

    async runExtraction() {
        try {
            console.log('  ⚙️  正在提取JavaScript代码...');
            
            await this.components.extractor.extractAllJavaScript();
            
            this.stats.extractedCount = await this.getTableCount('javascript_code');
            
        } catch (error) {
            console.error('  ❌ JavaScript提取失败:', error.message);
            this.stats.errors.push({
                step: 'extraction',
                error: error.message,
                timestamp: new Date()
            });
            throw error;
        }
    }

    async runGeneration() {
        try {
            console.log('  🏗️  正在生成计算器页面...');
            
            await this.components.generator.generateAllPages();
            
            this.stats.generatedCount = await this.getTableCount('calculators');
            
        } catch (error) {
            console.error('  ❌ 页面生成失败:', error.message);
            this.stats.errors.push({
                step: 'generation',
                error: error.message,
                timestamp: new Date()
            });
            throw error;
        }
    }

    async getTableCount(tableName) {
        try {
            const sqlite3 = require('sqlite3').verbose();
            const path = require('path');
            const dbPath = path.join(__dirname, '../data/calculators.db');
            
            return new Promise((resolve, reject) => {
                const db = new sqlite3.Database(dbPath);
                db.get(`SELECT COUNT(*) as count FROM ${tableName}`, (err, row) => {
                    db.close();
                    if (err) {
                        resolve(0);
                    } else {
                        resolve(row.count);
                    }
                });
            });
        } catch (error) {
            return 0;
        }
    }

    printFinalReport() {
        console.log('\n📊 ===== 最终执行报告 =====\n');
        
        const duration = this.stats.endTime - this.stats.startTime;
        const minutes = Math.floor(duration / 60000);
        const seconds = Math.floor((duration % 60000) / 1000);
        
        console.log(`⏱️  总执行时间: ${minutes}分${seconds}秒`);
        console.log(`📥 抓取的计算器: ${this.stats.scrapedCount} 个`);
        console.log(`🔍 解析的计算器: ${this.stats.parsedCount} 个`);
        console.log(`⚡ 提取的JS代码: ${this.stats.extractedCount} 个`);
        console.log(`🛠️  生成的页面: ${this.stats.generatedCount} 个`);
        
        if (this.stats.errors.length > 0) {
            console.log(`\n⚠️  执行过程中的错误 (${this.stats.errors.length} 个):`);
            this.stats.errors.forEach((error, index) => {
                console.log(`  ${index + 1}. [${error.step}] ${error.error}`);
            });
        } else {
            console.log('\n✅ 执行过程中没有错误！');
        }
        
        console.log('\n🎉 流水线执行完成！');
        console.log('\n📁 输出目录:');
        console.log('  - 抓取数据: ./scraped_data/');
        console.log('  - 解析结果: ./parsed_data/');
        console.log('  - 提取代码: ./extracted_js/');
        console.log('  - 生成页面: ./generated_pages/');
        console.log('  - 数据库: ./data/calculators.db');
        console.log('\n===============================\n');
    }

    async cleanup() {
        console.log('🧹 清理系统资源...');
        
        for (const component of Object.values(this.components)) {
            try {
                if (component.close) {
                    await component.close();
                }
            } catch (error) {
                console.warn('清理组件时发生错误:', error.message);
            }
        }
        
        console.log('✅ 资源清理完成');
    }

    // 实用方法
    async runStepByStep() {
        console.log('\n🎯 开始分步执行流水线...\n');
        
        const steps = [
            { name: '数据抓取', method: 'runScraping', skip: this.options.skipScraping },
            { name: '数据解析', method: 'runParsing', skip: this.options.skipParsing },
            { name: 'JS提取', method: 'runExtraction', skip: this.options.skipExtraction },
            { name: '页面生成', method: 'runGeneration', skip: this.options.skipGeneration }
        ];
        
        for (const [index, step] of steps.entries()) {
            if (step.skip) {
                console.log(`⏭️  步骤 ${index + 1}/4: ${step.name} (跳过)`);
                continue;
            }
            
            console.log(`🔄 步骤 ${index + 1}/4: ${step.name}`);
            
            try {
                await this[step.method]();
                console.log(`✅ ${step.name} 完成\n`);
            } catch (error) {
                console.error(`❌ ${step.name} 失败:`, error.message);
                
                const continueAnyway = await this.askUserToContinue(step.name);
                if (!continueAnyway) {
                    throw error;
                }
            }
        }
    }

    async askUserToContinue(stepName) {
        // 在实际应用中，这里可以实现用户交互
        // 目前自动继续执行
        console.log(`⚠️  ${stepName} 失败，但继续执行后续步骤...`);
        return true;
    }

    // 静态方法：快速启动
    static async quickStart(options = {}) {
        const manager = new CalculatorSystemManager(options);
        
        try {
            await manager.initialize();
            await manager.runFullPipeline();
            
            return {
                success: true,
                stats: manager.stats
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message,
                stats: manager.stats
            };
        }
    }

    // 静态方法：只运行特定步骤
    static async runStep(stepName, options = {}) {
        const skipOptions = {
            skipScraping: stepName !== 'scraping',
            skipParsing: stepName !== 'parsing',
            skipExtraction: stepName !== 'extraction',
            skipGeneration: stepName !== 'generation'
        };
        
        return CalculatorSystemManager.quickStart({
            ...options,
            ...skipOptions
        });
    }
}

// 主函数 - 命令行执行
async function main() {
    const args = process.argv.slice(2);
    const options = {};
    
    // 解析命令行参数
    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--skip-scraping':
                options.skipScraping = true;
                break;
            case '--skip-parsing':
                options.skipParsing = true;
                break;
            case '--skip-extraction':
                options.skipExtraction = true;
                break;
            case '--skip-generation':
                options.skipGeneration = true;
                break;
            case '--step':
                const step = args[++i];
                if (['scraping', 'parsing', 'extraction', 'generation'].includes(step)) {
                    const result = await CalculatorSystemManager.runStep(step, options);
                    process.exit(result.success ? 0 : 1);
                } else {
                    console.error('无效的步骤名称:', step);
                    process.exit(1);
                }
                break;
            case '--help':
                printHelp();
                process.exit(0);
                break;
        }
    }
    
    // 运行完整流水线
    const result = await CalculatorSystemManager.quickStart(options);
    process.exit(result.success ? 0 : 1);
}

function printHelp() {
    console.log(`
计算器系统管理器 - 使用说明

用法:
  node src/index.js [选项]

选项:
  --skip-scraping     跳过数据抓取步骤
  --skip-parsing      跳过数据解析步骤  
  --skip-extraction   跳过JavaScript提取步骤
  --skip-generation   跳过页面生成步骤
  --step <stepname>   只运行指定步骤 (scraping|parsing|extraction|generation)
  --help              显示此帮助信息

示例:
  # 运行完整流水线
  node src/index.js
  
  # 跳过抓取，从解析开始
  node src/index.js --skip-scraping
  
  # 只运行页面生成
  node src/index.js --step generation
`);
}

// 如果直接运行此文件
if (require.main === module) {
    main().catch(error => {
        console.error('❌ 系统执行失败:', error);
        process.exit(1);
    });
}

module.exports = CalculatorSystemManager; 