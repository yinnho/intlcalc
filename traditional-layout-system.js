const fs = require('fs');
const path = require('path');

// 🎨 传统简洁网页布局系统
const traditionalLayoutCSS = `
/* 传统简洁网页布局 - IntlCalc */

/* 1. 基础重置 */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html {
    font-size: 16px;
}

body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #000000;
    background-color: #FFFFFF;
    margin: 0;
    padding: 0;
}

/* 2. 页面整体布局 */
.page-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

/* 3. 网站头部 */
.site-header {
    background-color: #FFFFFF;
    border-bottom: 1px solid #CCCCCC;
    padding: 10px 0;
}

.header-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.site-logo {
    font-size: 24px;
    font-weight: bold;
    color: #000000;
    text-decoration: none;
}

.site-logo:hover {
    color: #000000;
}

/* 4. 语言切换 */
.language-switcher {
    font-size: 14px;
}

.lang-dropdown {
    position: relative;
    display: inline-block;
}

.dropdown-btn {
    background-color: #FFFFFF;
    color: #000000;
    border: 1px solid #CCCCCC;
    padding: 5px 10px;
    cursor: pointer;
    font-size: 14px;
}

.dropdown-btn:hover {
    background-color: #F5F5F5;
}

.dropdown-menu {
    display: none;
    position: absolute;
    right: 0;
    background-color: #FFFFFF;
    border: 1px solid #CCCCCC;
    min-width: 150px;
    z-index: 1000;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.dropdown-menu.show {
    display: block;
}

.dropdown-menu a {
    display: block;
    padding: 8px 12px;
    text-decoration: none;
    color: #000000;
    font-size: 14px;
}

.dropdown-menu a:hover {
    background-color: #F5F5F5;
}

/* 5. 面包屑导航 */
.breadcrumb {
    background-color: #F9F9F9;
    border-bottom: 1px solid #CCCCCC;
    padding: 10px 0;
    font-size: 14px;
}

.breadcrumb-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.breadcrumb a {
    color: #0000EE;
    text-decoration: none;
}

.breadcrumb a:hover {
    text-decoration: underline;
}

.breadcrumb-separator {
    margin: 0 5px;
    color: #666666;
}

/* 6. 主要内容区域 */
.main-content {
    flex: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

/* 7. 页面标题 */
.page-title {
    font-size: 28px;
    font-weight: bold;
    color: #000000;
    margin-bottom: 10px;
}

.page-description {
    font-size: 16px;
    color: #333333;
    margin-bottom: 20px;
    line-height: 1.5;
}

/* 8. 计算器容器 */
.calculator-widget {
    background-color: #FFFFFF;
    border: 1px solid #CCCCCC;
    padding: 20px;
    margin: 20px 0;
    max-width: 600px;
}

.calculator-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 15px;
    color: #000000;
}

/* 9. 表单元素 */
.form-section {
    margin-bottom: 20px;
}

.section-title {
    font-size: 16px;
    font-weight: bold;
    color: #000000;
    margin-bottom: 10px;
    padding: 5px 0;
    border-bottom: 1px solid #CCCCCC;
}

.form-row {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.form-row label {
    min-width: 120px;
    font-size: 14px;
    color: #000000;
}

.form-row input,
.form-row select {
    padding: 5px 8px;
    border: 1px solid #CCCCCC;
    font-size: 14px;
    background-color: #FFFFFF;
    color: #000000;
}

.form-row input:focus,
.form-row select:focus {
    outline: 1px solid #0000EE;
    border-color: #0000EE;
}

/* 10. 按钮样式 */
.btn {
    background-color: #FFFFFF;
    color: #000000;
    border: 1px solid #CCCCCC;
    padding: 8px 16px;
    cursor: pointer;
    font-size: 14px;
    margin: 5px;
}

.btn:hover {
    background-color: #F5F5F5;
}

.btn-primary {
    background-color: #FFFFFF;
    border: 2px solid #000000;
    font-weight: bold;
}

.btn-primary:hover {
    background-color: #F0F0F0;
}

/* 11. 计算器按钮网格 */
.calculator-buttons {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 5px;
    margin-top: 15px;
}

.calc-btn {
    background-color: #FFFFFF;
    border: 1px solid #CCCCCC;
    padding: 15px;
    font-size: 16px;
    cursor: pointer;
    color: #000000;
}

.calc-btn:hover {
    background-color: #F5F5F5;
}

.calc-btn:active {
    background-color: #EEEEEE;
}

/* 12. 显示屏 */
.calculator-display {
    margin-bottom: 15px;
}

.display-input {
    width: 100%;
    padding: 10px;
    font-size: 18px;
    text-align: right;
    border: 1px solid #CCCCCC;
    background-color: #FFFFFF;
    color: #000000;
}

.display-input:focus {
    outline: 1px solid #0000EE;
}

/* 13. 结果显示 */
.result-section {
    margin-top: 20px;
    padding: 15px;
    border: 1px solid #CCCCCC;
    background-color: #F9F9F9;
}

.result-title {
    font-size: 16px;
    font-weight: bold;
    color: #000000;
    margin-bottom: 10px;
}

.result-value {
    font-size: 18px;
    color: #000000;
    font-weight: bold;
}

/* 14. 相关链接 */
.related-section {
    margin: 30px 0;
    padding: 15px;
    border: 1px solid #CCCCCC;
    background-color: #F9F9F9;
}

.related-title {
    font-size: 16px;
    font-weight: bold;
    color: #000000;
    margin-bottom: 10px;
}

.related-links {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
}

.related-links a {
    color: #0000EE;
    text-decoration: none;
    font-size: 14px;
}

.related-links a:hover {
    text-decoration: underline;
}

/* 15. 内容说明区域 */
.content-section {
    margin: 30px 0;
}

.content-section h2 {
    font-size: 20px;
    font-weight: bold;
    color: #000000;
    margin-bottom: 10px;
}

.content-section h3 {
    font-size: 16px;
    font-weight: bold;
    color: #000000;
    margin: 15px 0 8px 0;
}

.content-section p {
    font-size: 14px;
    color: #333333;
    line-height: 1.6;
    margin-bottom: 10px;
}

.content-section ul {
    margin-left: 20px;
    margin-bottom: 10px;
}

.content-section li {
    font-size: 14px;
    color: #333333;
    line-height: 1.6;
    margin-bottom: 5px;
}

/* 16. 页脚 */
.site-footer {
    background-color: #F9F9F9;
    border-top: 1px solid #CCCCCC;
    padding: 20px 0;
    margin-top: auto;
}

.footer-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    text-align: center;
    font-size: 12px;
    color: #666666;
}

.footer-links {
    margin-bottom: 10px;
}

.footer-links a {
    color: #0000EE;
    text-decoration: none;
    margin: 0 10px;
    font-size: 12px;
}

.footer-links a:hover {
    text-decoration: underline;
}

/* 17. 响应式设计 */
@media (max-width: 768px) {
    .header-content {
        flex-direction: column;
        gap: 10px;
    }
    
    .main-content {
        padding: 15px;
    }
    
    .calculator-widget {
        padding: 15px;
    }
    
    .form-row {
        flex-direction: column;
        align-items: flex-start;
    }
    
    .form-row label {
        min-width: auto;
        margin-bottom: 5px;
    }
    
    .calculator-buttons {
        grid-template-columns: repeat(3, 1fr);
    }
    
    .related-links {
        flex-direction: column;
    }
}

@media (max-width: 480px) {
    .page-title {
        font-size: 24px;
    }
    
    .calculator-buttons {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .calc-btn {
        padding: 12px;
        font-size: 14px;
    }
}

/* 18. 表格样式 */
.calculator-table {
    width: 100%;
    border-collapse: collapse;
    margin: 15px 0;
}

.calculator-table th,
.calculator-table td {
    border: 1px solid #CCCCCC;
    padding: 8px 12px;
    text-align: left;
}

.calculator-table th {
    background-color: #F5F5F5;
    font-weight: bold;
    color: #000000;
}

.calculator-table td {
    color: #333333;
}

/* 19. 输入组样式 */
.input-group {
    display: flex;
    align-items: center;
    gap: 5px;
}

.input-group input {
    flex: 1;
}

.input-group .unit {
    font-size: 14px;
    color: #666666;
    min-width: 40px;
}

/* 20. 提示和帮助 */
.help-text {
    font-size: 12px;
    color: #666666;
    font-style: italic;
    margin-top: 5px;
}

.tooltip {
    position: relative;
    display: inline-block;
    cursor: help;
    color: #0000EE;
}

.tooltip:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background-color: #000000;
    color: #FFFFFF;
    padding: 5px 8px;
    font-size: 12px;
    white-space: nowrap;
    z-index: 1000;
}
`;

// 生成传统布局的HTML模板
function generateTraditionalHTML(calculatorData) {
    const { title, description, calculatorType } = calculatorData;
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - IntlCalc</title>
    <meta name="description" content="${description}">
    <link rel="canonical" href="https://intlcalc.com/">
    <style>${traditionalLayoutCSS}</style>
    
    <!-- Favicon -->
    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    <link rel="manifest" href="/manifest.json">
    <meta name="theme-color" content="#FFFFFF">
</head>
<body>
    <div class="page-container">
        <!-- 网站头部 -->
        <header class="site-header">
            <div class="header-content">
                <a href="/" class="site-logo">🧮 IntlCalc</a>
                <div class="language-switcher">
                    <div class="lang-dropdown">
                        <button class="dropdown-btn" onclick="toggleLanguageDropdown()">
                            🌐 English ▼
                        </button>
                        <div class="dropdown-menu" id="languageDropdown">
                            <a href="https://en.intlcalc.com">🇺🇸 English</a>
                            <a href="https://zh.intlcalc.com">🇨🇳 中文</a>
                            <a href="https://es.intlcalc.com">🇪🇸 Español</a>
                            <a href="https://fr.intlcalc.com">🇫🇷 Français</a>
                            <a href="https://de.intlcalc.com">🇩🇪 Deutsch</a>
                            <a href="https://ja.intlcalc.com">🇯🇵 日本語</a>
                            <a href="https://ko.intlcalc.com">🇰🇷 한국어</a>
                            <a href="https://pt.intlcalc.com">🇵🇹 Português</a>
                            <a href="https://ru.intlcalc.com">🇷🇺 Русский</a>
                            <a href="https://ar.intlcalc.com">🇸🇦 العربية</a>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <!-- 面包屑导航 -->
        <nav class="breadcrumb">
            <div class="breadcrumb-content">
                <a href="/">Home</a>
                <span class="breadcrumb-separator">/</span>
                <a href="/calc/">Calculators</a>
                <span class="breadcrumb-separator">/</span>
                <span>${title}</span>
            </div>
        </nav>

        <!-- 主要内容 -->
        <main class="main-content">
            <h1 class="page-title">${title}</h1>
            <p class="page-description">${description}</p>

            <!-- 计算器小部件 -->
            <div class="calculator-widget">
                <h2 class="calculator-title">Calculator</h2>
                <div class="calculator-display">
                    <input type="text" class="display-input" id="display" value="0" readonly>
                </div>
                <div class="calculator-buttons" id="calculatorButtons">
                    <!-- 按钮将由JavaScript生成 -->
                </div>
                <div class="result-section" id="resultSection" style="display: none;">
                    <div class="result-title">Result:</div>
                    <div class="result-value" id="resultValue">0</div>
                </div>
            </div>

            <!-- 相关计算器 -->
            <div class="related-section">
                <h3 class="related-title">Related Calculators</h3>
                <div class="related-links">
                    <a href="/calc/basic-math-calculator.html">Basic Math Calculator</a>
                    <a href="/calc/scientific-calculator.html">Scientific Calculator</a>
                    <a href="/calc/percentage-calculator.html">Percentage Calculator</a>
                    <a href="/calc/interest-calculator.html">Interest Calculator</a>
                    <a href="/convert/length-converter.html">Length Converter</a>
                    <a href="/convert/temperature-converter.html">Temperature Converter</a>
                </div>
            </div>

            <!-- 其他语言版本 -->
            <div class="related-section">
                <h3 class="related-title">Other Languages</h3>
                <div class="related-links">
                    <a href="https://zh.intlcalc.com/calc/${calculatorType}.html">🇨🇳 中文版</a>
                    <a href="https://es.intlcalc.com/calc/${calculatorType}.html">🇪🇸 Español</a>
                    <a href="https://fr.intlcalc.com/calc/${calculatorType}.html">🇫🇷 Français</a>
                    <a href="https://de.intlcalc.com/calc/${calculatorType}.html">🇩🇪 Deutsch</a>
                    <a href="https://ja.intlcalc.com/calc/${calculatorType}.html">🇯🇵 日本語</a>
                </div>
            </div>

            <!-- 内容说明 -->
            <div class="content-section">
                <h2>About ${title}</h2>
                <p>This ${title.toLowerCase()} is designed to help you perform accurate calculations quickly and easily. Simply enter your values and get instant results.</p>
                
                <h3>How to Use</h3>
                <ul>
                    <li>Enter numbers using the number buttons or your keyboard</li>
                    <li>Use the operation buttons (+, -, ×, ÷) for calculations</li>
                    <li>Press the equals button (=) to get your result</li>
                    <li>Use the Clear button to reset the calculator</li>
                </ul>

                <h3>Features</h3>
                <ul>
                    <li>Simple and intuitive interface</li>
                    <li>Keyboard support for faster input</li>
                    <li>Accurate mathematical calculations</li>
                    <li>Mobile-friendly responsive design</li>
                </ul>
            </div>
        </main>

        <!-- 页脚 -->
        <footer class="site-footer">
            <div class="footer-content">
                <div class="footer-links">
                    <a href="/about/">About</a>
                    <a href="/privacy/">Privacy</a>
                    <a href="/terms/">Terms</a>
                    <a href="/contact/">Contact</a>
                </div>
                <div>© 2024 IntlCalc. All rights reserved.</div>
            </div>
        </footer>
    </div>

    <script>
        // 计算器功能
        let display = document.getElementById('display');
        let currentInput = '0';
        let previousInput = '';
        let operator = '';

        function generateCalculatorButtons() {
            const buttonsContainer = document.getElementById('calculatorButtons');
            const buttons = [
                ['C', '±', '%', '÷'],
                ['7', '8', '9', '×'],
                ['4', '5', '6', '-'],
                ['1', '2', '3', '+'],
                ['0', '.', '=']
            ];

            buttons.forEach(row => {
                row.forEach(btn => {
                    const button = document.createElement('button');
                    button.className = 'calc-btn';
                    button.textContent = btn;
                    button.onclick = () => handleButtonClick(btn);
                    if (btn === '0') {
                        button.style.gridColumn = 'span 2';
                    }
                    buttonsContainer.appendChild(button);
                });
            });
        }

        function handleButtonClick(value) {
            if (value >= '0' && value <= '9' || value === '.') {
                if (currentInput === '0' && value !== '.') {
                    currentInput = value;
                } else {
                    currentInput += value;
                }
                display.value = currentInput;
            } else if (['+', '-', '×', '÷'].includes(value)) {
                if (operator && previousInput) {
                    calculate();
                }
                operator = value;
                previousInput = currentInput;
                currentInput = '';
            } else if (value === '=') {
                calculate();
            } else if (value === 'C') {
                clear();
            }
        }

        function calculate() {
            if (previousInput && currentInput && operator) {
                const prev = parseFloat(previousInput);
                const curr = parseFloat(currentInput);
                let result = 0;

                switch (operator) {
                    case '+': result = prev + curr; break;
                    case '-': result = prev - curr; break;
                    case '×': result = prev * curr; break;
                    case '÷': result = prev / curr; break;
                }

                currentInput = result.toString();
                display.value = currentInput;
                previousInput = '';
                operator = '';
                
                document.getElementById('resultSection').style.display = 'block';
                document.getElementById('resultValue').textContent = result;
            }
        }

        function clear() {
            currentInput = '0';
            previousInput = '';
            operator = '';
            display.value = currentInput;
            document.getElementById('resultSection').style.display = 'none';
        }

        function toggleLanguageDropdown() {
            const dropdown = document.getElementById('languageDropdown');
            dropdown.classList.toggle('show');
        }

        // 点击外部关闭下拉菜单
        window.onclick = function(event) {
            if (!event.target.matches('.dropdown-btn')) {
                const dropdowns = document.getElementsByClassName('dropdown-menu');
                for (let i = 0; i < dropdowns.length; i++) {
                    dropdowns[i].classList.remove('show');
                }
            }
        }

        // 键盘支持
        document.addEventListener('keydown', function(event) {
            const key = event.key;
            if ((key >= '0' && key <= '9') || key === '.') {
                handleButtonClick(key);
            } else if (['+', '-', '*', '/'].includes(key)) {
                const op = key === '*' ? '×' : key === '/' ? '÷' : key;
                handleButtonClick(op);
            } else if (key === 'Enter' || key === '=') {
                handleButtonClick('=');
            } else if (key === 'Escape' || key === 'c' || key === 'C') {
                handleButtonClick('C');
            }
        });

        // 初始化
        generateCalculatorButtons();
    </script>

    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-4V83VD69EH"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-4V83VD69EH');
    </script>
</body>
</html>`;
}

// 处理单个HTML文件，应用传统布局
function applyTraditionalLayout(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // 提取原有标题和描述
        const titleMatch = content.match(/<title>(.*?)<\/title>/);
        const descMatch = content.match(/<meta name="description" content="(.*?)"/);
        
        let title = titleMatch ? titleMatch[1].replace(' - IntlCalc', '') : 'Calculator';
        let description = descMatch ? descMatch[1] : 'Free online calculator tool';
        let calculatorType = path.basename(filePath, '.html');
        
        // 生成新的传统布局HTML
        const newContent = generateTraditionalHTML({
            title: title,
            description: description,
            calculatorType: calculatorType
        });
        
        fs.writeFileSync(filePath, newContent, 'utf8');
        return true;
    } catch (error) {
        console.error(`处理文件 ${filePath} 时出错:`, error.message);
        return false;
    }
}

// 递归处理目录
function processDirectory(dirPath) {
    let processedCount = 0;
    
    function processDir(currentPath) {
        const items = fs.readdirSync(currentPath);
        
        for (const item of items) {
            const itemPath = path.join(currentPath, item);
            const stat = fs.statSync(itemPath);
            
            if (stat.isDirectory()) {
                processDir(itemPath);
            } else if (path.extname(item) === '.html' && item !== 'index.html') {
                if (applyTraditionalLayout(itemPath)) {
                    processedCount++;
                    console.log(`📄 传统化完成: ${path.relative(dirPath, itemPath)}`);
                }
            }
        }
    }
    
    processDir(dirPath);
    return processedCount;
}

// 主程序
console.log('📄 开始应用传统网页布局...\n');

let totalProcessed = 0;

// 处理所有语言目录
const languageDirs = ['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko', 'pt', 'ru', 'ar'];

for (const lang of languageDirs) {
    const langPath = path.join('generated_pages', lang);
    if (fs.existsSync(langPath)) {
        console.log(`🌍 传统化 ${lang} 语言页面...`);
        const count = processDirectory(langPath);
        totalProcessed += count;
        console.log(`📊 ${lang}: 传统化了 ${count} 个文件\n`);
    }
}

console.log('🎉 传统网页布局应用完成！');
console.log(`📈 总共传统化了 ${totalProcessed} 个页面`);
console.log('\n✨ 新布局特性:');
console.log('   📄 传统网页结构 (头部、导航、内容、页脚)');
console.log('   🎨 简洁无色彩设计');
console.log('   🧮 计算器作为页面组件');
console.log('   🔗 相关链接和内容说明');
console.log('   📱 响应式布局');
console.log('   ⌨️ 键盘支持');
console.log('   🌐 语言切换功能');
console.log('   📋 面包屑导航'); 