#!/usr/bin/env node

/**
 * Google Analytics 自动更新脚本
 * 为所有语言版本的页面添加对应的 GA4 追踪代码
 */

const fs = require('fs');
const path = require('path');

// Google Analytics 配置
const GA_CONFIG = {
    main: {
        measurementId: 'G-9VN63L1R8J', // 替换为实际的主网站 ID
        language: 'language_selection',
        pageType: 'homepage'
    },
    en: {
        measurementId: 'G-4V83VD69EH', // 替换为实际的英文版 ID
        language: 'en',
        pageType: 'calculator_site'
    },
    zh: {
        measurementId: 'G-93PW9WXLHD', // 替换为实际的中文版 ID
        language: 'zh',
        pageType: 'calculator_site'
    },
    es: {
        measurementId: 'G-ELH97WF268',
        language: 'es',
        pageType: 'calculator_site'
    },
    fr: {
        measurementId: 'G-BLH7TVEQRW',
        language: 'fr',
        pageType: 'calculator_site'
    },
    de: {
        measurementId: 'G-8SP31MTD8E',
        language: 'de',
        pageType: 'calculator_site'
    },
    ja: {
        measurementId: 'G-9C5MGQ791N',
        language: 'ja',
        pageType: 'calculator_site'
    },
    ko: {
        measurementId: 'G-DK931JVTZB',
        language: 'ko',
        pageType: 'calculator_site'
    },
    pt: {
        measurementId: 'G-WF673XWY3M',
        language: 'pt',
        pageType: 'calculator_site'
    },
    ru: {
        measurementId: 'G-VYR9Z1ZKX8',
        language: 'ru',
        pageType: 'calculator_site'
    },
    ar: {
        measurementId: 'G-M0B18XJVX4',
        language: 'ar',
        pageType: 'calculator_site'
    }
};

// 生成 Google Analytics 代码
function generateGACode(config, isCalculatorPage = false) {
    const calculatorEvents = isCalculatorPage ? `
    
    // 计算器专用事件追踪
    function trackCalculatorUse(calculatorType, category) {
        gtag('event', 'calculator_use', {
            calculator_type: calculatorType,
            calculator_category: category,
            language: '${config.language}'
        });
    }
    
    function trackCalculationComplete(calculatorType, resultValue) {
        gtag('event', 'calculation_complete', {
            calculator_type: calculatorType,
            result_value: resultValue,
            language: '${config.language}'
        });
    }
    
    function trackLanguageSwitch(fromLang, toLang) {
        gtag('event', 'language_switch', {
            from_language: fromLang,
            to_language: toLang,
            switch_method: 'header_link'
        });
    }
    
    // 页面加载时自动追踪
    window.addEventListener('load', function() {
        const calculatorType = document.querySelector('[data-calculator-type]')?.dataset.calculatorType;
        const calculatorCategory = document.querySelector('[data-calculator-category]')?.dataset.calculatorCategory;
        
        if (calculatorType && calculatorCategory) {
            trackCalculatorUse(calculatorType, calculatorCategory);
        }
    });` : '';

    return `    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${config.measurementId}"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        
        gtag('config', '${config.measurementId}', {
            cookie_flags: 'SameSite=None;Secure',
            custom_map: {
                'custom_parameter_1': 'language',
                'custom_parameter_2': 'calculator_type'
            }
        });
        
        // 设置页面基本信息
        gtag('event', 'page_view', {
            language: '${config.language}',
            page_type: '${config.pageType}'
        });${calculatorEvents}
    </script>`;
}

// 更新 HTML 文件中的 Google Analytics 代码
function updateGAInFile(filePath, gaCode) {
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️ 文件不存在: ${filePath}`);
        return false;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    
    // 移除现有的 GA 代码
    content = content.replace(/<!-- Global site tag.*?<\/script>/gs, '');
    content = content.replace(/GA_MEASUREMENT_ID/g, '');
    
    // 在 </body> 前插入新的 GA 代码
    if (content.includes('</body>')) {
        content = content.replace('</body>', `${gaCode}\n</body>`);
    } else {
        // 如果没有 </body> 标签，在文件末尾添加
        content += '\n' + gaCode;
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
}

// 处理单个语言版本的所有文件
function updateLanguageVersion(langCode, config) {
    console.log(`\n🔄 更新 ${langCode} 版本的 Google Analytics...`);
    
    const basePath = langCode === 'main' ? 'generated_pages' : `generated_pages/${langCode}`;
    
    if (!fs.existsSync(basePath)) {
        console.log(`❌ 目录不存在: ${basePath}`);
        return;
    }
    
    let updatedCount = 0;
    
    // 更新主页
    const indexPath = path.join(basePath, 'index.html');
    if (updateGAInFile(indexPath, generateGACode(config, false))) {
        console.log(`✅ 更新主页: ${indexPath}`);
        updatedCount++;
    }
    
    // 更新计算器页面
    const calcDirs = ['calc', 'convert'];
    
    calcDirs.forEach(calcDir => {
        const calcPath = path.join(basePath, calcDir);
        if (fs.existsSync(calcPath)) {
            // 遍历所有子目录
            const categories = fs.readdirSync(calcPath, { withFileTypes: true })
                .filter(dirent => dirent.isDirectory())
                .map(dirent => dirent.name);
            
            categories.forEach(category => {
                const categoryPath = path.join(calcPath, category);
                const files = fs.readdirSync(categoryPath)
                    .filter(file => file.endsWith('.html'));
                
                files.forEach(file => {
                    const filePath = path.join(categoryPath, file);
                    if (updateGAInFile(filePath, generateGACode(config, true))) {
                        console.log(`✅ 更新计算器: ${filePath}`);
                        updatedCount++;
                    }
                });
            });
        }
    });
    
    console.log(`📊 ${langCode} 版本更新完成，共更新 ${updatedCount} 个文件`);
}

// 主函数
function main() {
    console.log('🚀 开始更新 IntlCalc.com 所有页面的 Google Analytics 代码...\n');
    
    // 检查配置
    const missingIds = [];
    Object.entries(GA_CONFIG).forEach(([lang, config]) => {
        if (config.measurementId.includes('_ID')) {
            missingIds.push(lang);
        }
    });
    
    if (missingIds.length > 0) {
        console.log('⚠️ 警告: 以下语言版本缺少实际的 Google Analytics ID:');
        missingIds.forEach(lang => {
            console.log(`   ${lang}: ${GA_CONFIG[lang].measurementId}`);
        });
        console.log('\n请先获取实际的 Google Analytics 测量 ID 并更新脚本配置。\n');
    }
    
    // 更新所有语言版本
    let totalUpdated = 0;
    Object.entries(GA_CONFIG).forEach(([langCode, config]) => {
        updateLanguageVersion(langCode, config);
    });
    
    console.log('\n🎉 Google Analytics 更新完成！');
    console.log('\n📝 下一步操作:');
    console.log('1. 在 Google Analytics 中创建对应的数据流');
    console.log('2. 获取每个数据流的测量 ID (G-XXXXXXXXXX)');
    console.log('3. 更新此脚本中的 GA_CONFIG 配置');
    console.log('4. 重新运行此脚本');
    console.log('5. 重新部署网站到 Cloudflare Pages');
    
    if (missingIds.length === 0) {
        console.log('\n✅ 所有配置完成，可以开始追踪用户数据！');
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    main();
}

module.exports = { updateGAInFile, generateGACode, GA_CONFIG }; 