const fs = require('fs');
const path = require('path');

// 读取解析好的数据
const scrapedDataDir = './scraped_data';
const htmlDir = path.join(scrapedDataDir, 'html');
const generatedPagesDir = './generated_pages';

// 确保目录存在
if (!fs.existsSync(generatedPagesDir)) {
    fs.mkdirSync(generatedPagesDir, { recursive: true });
}

// 读取所有解析的HTML文件
const htmlFiles = fs.readdirSync(htmlDir).filter(file => file.endsWith('.html'));

console.log('找到的HTML文件:', htmlFiles);

// 为每个语言创建目录
const languages = ['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko', 'pt', 'ru', 'ar'];

languages.forEach(lang => {
    const langDir = path.join(generatedPagesDir, lang);
    if (!fs.existsSync(langDir)) {
        fs.mkdirSync(langDir, { recursive: true });
    }
    
    // 创建calc和convert目录
    const calcDir = path.join(langDir, 'calc');
    const convertDir = path.join(langDir, 'convert');
    if (!fs.existsSync(calcDir)) {
        fs.mkdirSync(calcDir, { recursive: true });
    }
    if (!fs.existsSync(convertDir)) {
        fs.mkdirSync(convertDir, { recursive: true });
    }
});

// 复制CSS和JS文件
const cssDir = path.join(scrapedDataDir, 'css');
const jsDir = path.join(scrapedDataDir, 'js');

if (fs.existsSync(cssDir)) {
    languages.forEach(lang => {
        const langCssDir = path.join(generatedPagesDir, lang, 'css');
        if (!fs.existsSync(langCssDir)) {
            fs.mkdirSync(langCssDir, { recursive: true });
        }
        // 复制CSS文件
        const cssFiles = fs.readdirSync(cssDir);
        cssFiles.forEach(file => {
            const sourcePath = path.join(cssDir, file);
            const destPath = path.join(langCssDir, file);
            fs.copyFileSync(sourcePath, destPath);
        });
    });
}

if (fs.existsSync(jsDir)) {
    languages.forEach(lang => {
        const langJsDir = path.join(generatedPagesDir, lang, 'js');
        if (!fs.existsSync(langJsDir)) {
            fs.mkdirSync(langJsDir, { recursive: true });
        }
        // 复制JS文件
        const jsFiles = fs.readdirSync(jsDir);
        jsFiles.forEach(file => {
            const sourcePath = path.join(jsDir, file);
            const destPath = path.join(langJsDir, file);
            fs.copyFileSync(sourcePath, destPath);
        });
    });
}

// 处理每个HTML文件
htmlFiles.forEach(htmlFile => {
    const sourcePath = path.join(htmlDir, htmlFile);
    const htmlContent = fs.readFileSync(sourcePath, 'utf8');
    
    // 提取文件名（不含扩展名）
    const fileName = path.basename(htmlFile, '.html');
    
    // 确定是计算器还是转换器
    const isConverter = fileName.includes('converter') || fileName.includes('convert');
    const targetDir = isConverter ? 'convert' : 'calc';
    
    // 为每个语言创建对应的文件
    languages.forEach(lang => {
        const destDir = path.join(generatedPagesDir, lang, targetDir);
        const destPath = path.join(destDir, htmlFile);
        
        // 修改HTML内容以适应多语言
        let modifiedContent = htmlContent;
        
        // 替换标题和描述
        if (lang !== 'en') {
            // 这里可以添加翻译逻辑
            // 暂时保持英文，后续可以添加翻译
        }
        
        // 修改CSS和JS路径
        modifiedContent = modifiedContent.replace(/href="\/lib\//g, `href="/${lang}/css/`);
        modifiedContent = modifiedContent.replace(/src="\/lib\//g, `src="/${lang}/js/`);
        modifiedContent = modifiedContent.replace(/src="\/calc\//g, `src="/${lang}/calc/`);
        
        // 添加语言选择器
        const languageSelector = `
        <div style="position: fixed; top: 10px; right: 10px; z-index: 1000;">
            <select onchange="changeLanguage(this.value)" style="padding: 5px; border: 1px solid #ccc; border-radius: 3px;">
                <option value="en" ${lang === 'en' ? 'selected' : ''}>English</option>
                <option value="zh" ${lang === 'zh' ? 'selected' : ''}>中文</option>
                <option value="es" ${lang === 'es' ? 'selected' : ''}>Español</option>
                <option value="fr" ${lang === 'fr' ? 'selected' : ''}>Français</option>
                <option value="de" ${lang === 'de' ? 'selected' : ''}>Deutsch</option>
                <option value="ja" ${lang === 'ja' ? 'selected' : ''}>日本語</option>
                <option value="ko" ${lang === 'ko' ? 'selected' : ''}>한국어</option>
                <option value="pt" ${lang === 'pt' ? 'selected' : ''}>Português</option>
                <option value="ru" ${lang === 'ru' ? 'selected' : ''}>Русский</option>
                <option value="ar" ${lang === 'ar' ? 'selected' : ''}>العربية</option>
            </select>
        </div>
        <script>
        function changeLanguage(lang) {
            const currentPath = window.location.pathname;
            const newPath = currentPath.replace(/^\/([a-z]{2})\//, '/' + lang + '/');
            if (newPath !== currentPath) {
                window.location.href = newPath;
            }
        }
        </script>`;
        
        // 在body标签后添加语言选择器
        modifiedContent = modifiedContent.replace('<body>', '<body>' + languageSelector);
        
        // 写入文件
        fs.writeFileSync(destPath, modifiedContent);
        console.log(`已创建: ${destPath}`);
    });
});

// 创建主站首页
const mainIndexContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IntlCalc - International Calculator Collection</title>
    <meta name="description" content="Free online calculators and converters in multiple languages">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background: #fff; color: #000; }
        
        .header { border-bottom: 1px solid #ccc; padding: 20px 0; }
        .header-content { max-width: 1200px; margin: 0 auto; padding: 0 20px; text-align: center; }
        .logo { font-size: 36px; font-weight: bold; text-decoration: none; color: #000; }
        .subtitle { font-size: 18px; color: #666; margin-top: 10px; }
        
        .main-content { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
        
        .languages-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; margin-top: 40px; }
        .language-card { border: 1px solid #ccc; padding: 30px; text-align: center; text-decoration: none; color: #000; transition: all 0.3s; }
        .language-card:hover { box-shadow: 0 5px 15px rgba(0,0,0,0.1); transform: translateY(-2px); }
        .language-name { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        .language-native { font-size: 16px; color: #666; margin-bottom: 15px; }
        .calculator-count { font-size: 14px; color: #999; }
        
        .footer { margin-top: 50px; border-top: 1px solid #ccc; padding: 20px 0; text-align: center; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <header class="header">
        <div class="header-content">
            <a href="/" class="logo">🧮 IntlCalc</a>
            <p class="subtitle">International Calculator Collection</p>
        </div>
    </header>

    <main class="main-content">
        <h1 style="text-align: center; margin-bottom: 20px;">Choose Your Language</h1>
        <p style="text-align: center; color: #666; margin-bottom: 40px;">Select your preferred language to access calculators and converters</p>
        
        <div class="languages-grid">
            <a href="/en/" class="language-card">
                <div class="language-name">English</div>
                <div class="language-native">English</div>
                <div class="calculator-count">12 calculators available</div>
            </a>
            <a href="/zh/" class="language-card">
                <div class="language-name">中文</div>
                <div class="language-native">Chinese</div>
                <div class="calculator-count">12 calculators available</div>
            </a>
            <a href="/es/" class="language-card">
                <div class="language-name">Español</div>
                <div class="language-native">Spanish</div>
                <div class="calculator-count">12 calculators available</div>
            </a>
            <a href="/fr/" class="language-card">
                <div class="language-name">Français</div>
                <div class="language-native">French</div>
                <div class="calculator-count">12 calculators available</div>
            </a>
            <a href="/de/" class="language-card">
                <div class="language-name">Deutsch</div>
                <div class="language-native">German</div>
                <div class="calculator-count">12 calculators available</div>
            </a>
            <a href="/ja/" class="language-card">
                <div class="language-name">日本語</div>
                <div class="language-native">Japanese</div>
                <div class="calculator-count">12 calculators available</div>
            </a>
            <a href="/ko/" class="language-card">
                <div class="language-name">한국어</div>
                <div class="language-native">Korean</div>
                <div class="calculator-count">12 calculators available</div>
            </a>
            <a href="/pt/" class="language-card">
                <div class="language-name">Português</div>
                <div class="language-native">Portuguese</div>
                <div class="calculator-count">12 calculators available</div>
            </a>
            <a href="/ru/" class="language-card">
                <div class="language-name">Русский</div>
                <div class="language-native">Russian</div>
                <div class="calculator-count">12 calculators available</div>
            </a>
            <a href="/ar/" class="language-card">
                <div class="language-name">العربية</div>
                <div class="language-native">Arabic</div>
                <div class="calculator-count">12 calculators available</div>
            </a>
        </div>
    </main>

    <footer class="footer">
        <p>© 2024 IntlCalc. All rights reserved.</p>
    </footer>
</body>
</html>`;

fs.writeFileSync(path.join(generatedPagesDir, 'index.html'), mainIndexContent);

// 为每个语言创建首页
languages.forEach(lang => {
    const langDir = path.join(generatedPagesDir, lang);
    const langIndexContent = `<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IntlCalc - ${lang.toUpperCase()}</title>
    <meta name="description" content="Free online calculators and converters">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background: #fff; color: #000; }
        
        .header { border-bottom: 1px solid #ccc; padding: 10px 0; }
        .header-content { max-width: 1200px; margin: 0 auto; padding: 0 20px; display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 24px; font-weight: bold; text-decoration: none; color: #000; }
        
        .main-content { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .page-title { font-size: 28px; margin-bottom: 10px; }
        .page-description { font-size: 16px; color: #333; margin-bottom: 30px; }
        
        .categories { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; }
        .category { border: 1px solid #ccc; padding: 20px; }
        .category-title { font-size: 20px; margin-bottom: 15px; }
        .calculator-list { list-style: none; }
        .calculator-list li { margin-bottom: 8px; }
        .calculator-list a { color: #0000ee; text-decoration: none; }
        .calculator-list a:hover { text-decoration: underline; }
        
        .footer { margin-top: 50px; border-top: 1px solid #ccc; padding: 20px 0; text-align: center; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <header class="header">
        <div class="header-content">
            <a href="/${lang}/" class="logo">🧮 IntlCalc</a>
            <div>
                <select onchange="changeLanguage(this.value)">
                    <option value="en" ${lang === 'en' ? 'selected' : ''}>English</option>
                    <option value="zh" ${lang === 'zh' ? 'selected' : ''}>中文</option>
                    <option value="es" ${lang === 'es' ? 'selected' : ''}>Español</option>
                    <option value="fr" ${lang === 'fr' ? 'selected' : ''}>Français</option>
                    <option value="de" ${lang === 'de' ? 'selected' : ''}>Deutsch</option>
                    <option value="ja" ${lang === 'ja' ? 'selected' : ''}>日本語</option>
                    <option value="ko" ${lang === 'ko' ? 'selected' : ''}>한국어</option>
                    <option value="pt" ${lang === 'pt' ? 'selected' : ''}>Português</option>
                    <option value="ru" ${lang === 'ru' ? 'selected' : ''}>Русский</option>
                    <option value="ar" ${lang === 'ar' ? 'selected' : ''}>العربية</option>
                </select>
            </div>
        </div>
    </header>

    <main class="main-content">
        <h1 class="page-title">Calculators & Converters</h1>
        <p class="page-description">Free online calculators and converters for various calculations and conversions.</p>
        
        <div class="categories">
            <div class="category">
                <h2 class="category-title">Calculators</h2>
                <ul class="calculator-list">
                    <li><a href="/${lang}/calc/percentagecalculator.html">Percentage Calculator</a></li>
                    <li><a href="/${lang}/calc/scientificcalculator.html">Scientific Calculator</a></li>
                    <li><a href="/${lang}/calc/bmicalculator.html">BMI Calculator</a></li>
                    <li><a href="/${lang}/calc/mortgagecalculator.html">Mortgage Calculator</a></li>
                    <li><a href="/${lang}/calc/compoundinterestcalculator.html">Compound Interest Calculator</a></li>
                    <li><a href="/${lang}/calc/gradecalculator.html">Grade Calculator</a></li>
                    <li><a href="/${lang}/calc/averagecalculator.html">Average Calculator</a></li>
                    <li><a href="/${lang}/calc/fractioncalculator.html">Fraction Calculator</a></li>
                    <li><a href="/${lang}/calc/finalgradecalculator.html">Final Grade Calculator</a></li>
                    <li><a href="/${lang}/calc/percentagechangecalculator.html">Percentage Change Calculator</a></li>
                    <li><a href="/${lang}/calc/percentageincreasecalculator.html">Percentage Increase Calculator</a></li>
                    <li><a href="/${lang}/calc/wiregaugecalculator.html">Wire Gauge Calculator</a></li>
                </ul>
            </div>
            
            <div class="category">
                <h2 class="category-title">Converters</h2>
                <ul class="calculator-list">
                    <li><a href="/${lang}/convert/temperature-converter.html">Temperature Converter</a></li>
                    <li><a href="/${lang}/convert/length-converter.html">Length Converter</a></li>
                </ul>
            </div>
        </div>
    </main>

    <footer class="footer">
        <p>© 2024 IntlCalc. All rights reserved.</p>
    </footer>

    <script>
    function changeLanguage(lang) {
        const currentPath = window.location.pathname;
        const newPath = currentPath.replace(/^\/([a-z]{2})\//, '/' + lang + '/');
        if (newPath !== currentPath) {
            window.location.href = newPath;
        }
    }
    </script>
</body>
</html>`;

    fs.writeFileSync(path.join(langDir, 'index.html'), langIndexContent);
});

console.log('✅ 完整数据部署完成！');
console.log(`📁 已创建 ${languages.length} 个语言版本`);
console.log(`📄 已处理 ${htmlFiles.length} 个计算器文件`);
console.log('🚀 现在可以部署到Cloudflare Pages了'); 