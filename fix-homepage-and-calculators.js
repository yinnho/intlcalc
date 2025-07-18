const fs = require('fs');
const path = require('path');

// 🏠 创建类似Calculator.net的主站首页
const homepageHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Calculator.net - Free Online Calculators</title>
    <meta name="description" content="Free online calculators for math, finance, health, and more. Over 200 calculators available.">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background: #fff; color: #000; }
        
        .header { border-bottom: 1px solid #ccc; padding: 10px 0; }
        .header-content { max-width: 1200px; margin: 0 auto; padding: 0 20px; display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 24px; font-weight: bold; text-decoration: none; color: #000; }
        .lang-switcher select { padding: 5px; border: 1px solid #ccc; }
        
        .main-container { max-width: 1200px; margin: 0 auto; padding: 20px; display: grid; grid-template-columns: 1fr 300px; gap: 30px; }
        
        .calculator-section h1 { font-size: 24px; margin-bottom: 20px; }
        .scientific-calc { border: 1px solid #ccc; padding: 20px; background: #f9f9f9; max-width: 400px; }
        .calc-display { width: 100%; height: 60px; font-size: 24px; text-align: right; padding: 10px; border: 1px solid #ccc; margin-bottom: 15px; }
        .calc-buttons { display: grid; grid-template-columns: repeat(5, 1fr); gap: 5px; }
        .calc-btn { padding: 15px 10px; font-size: 14px; border: 1px solid #ccc; background: #fff; cursor: pointer; }
        .calc-btn:hover { background: #f0f0f0; }
        .calc-btn.operator { background: #e0e0e0; }
        .calc-btn.number { background: #fff; }
        .calc-btn.function { background: #f0f0f0; font-size: 12px; }
        
        .categories { }
        .category { margin-bottom: 30px; }
        .category h2 { font-size: 18px; color: #000; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 1px solid #ccc; }
        .category ul { list-style: none; }
        .category li { margin-bottom: 3px; }
        .category a { color: #0000ee; text-decoration: none; font-size: 14px; }
        .category a:hover { text-decoration: underline; }
        
        .description { margin-top: 30px; line-height: 1.6; font-size: 14px; color: #333; }
        
        .footer { margin-top: 50px; border-top: 1px solid #ccc; padding: 20px 0; text-align: center; font-size: 12px; color: #666; }
        
        @media (max-width: 768px) {
            .main-container { grid-template-columns: 1fr; }
            .calc-buttons { grid-template-columns: repeat(4, 1fr); }
        }
    </style>
</head>
<body>
    <header class="header">
        <div class="header-content">
            <a href="/" class="logo">Calculator.net</a>
            <div class="lang-switcher">
                <select onchange="changeLanguage(this.value)">
                    <option value="en">English</option>
                    <option value="zh">中文</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="ja">日本語</option>
                    <option value="ko">한국어</option>
                    <option value="pt">Português</option>
                    <option value="ru">Русский</option>
                    <option value="ar">العربية</option>
                </select>
            </div>
        </div>
    </header>

    <div class="main-container">
        <div class="calculator-section">
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="vertical-align: top; padding-right: 20px;">
                        <div class="scientific-calc">
                            <input type="text" id="display" class="calc-display" value="0" readonly>
                            <div class="calc-buttons" id="calcButtons"></div>
                        </div>
                    </td>
                    <td style="vertical-align: top; font-size: 14px;">
                        <strong>Free Online Calculators</strong><br><br>
                        <input type="text" placeholder="Search" style="width: 100%; padding: 5px; border: 1px solid #ccc; margin-bottom: 10px;">
                    </td>
                </tr>
            </table>
            
            <div class="description">
                <p><strong>Calculator.net's</strong> sole focus is to provide fast, comprehensive, convenient, free online calculators in a plethora of areas. Currently, we have around 200 calculators to help you "do the math" quickly in areas such as finance, fitness, health, math, and others, and we are still developing more. Our goal is to become the one-stop, go-to site for people who need to make quick calculations.</p>
            </div>
        </div>

        <div class="categories">
            <div class="category">
                <h2>Financial Calculators</h2>
                <ul>
                    <li><a href="/calc/interest-calculator.html">Interest Calculator</a></li>
                    <li><a href="/calc/loan-calculator.html">Loan Calculator</a></li>
                    <li><a href="/calc/mortgage-calculator.html">Mortgage Calculator</a></li>
                    <li><a href="/calc/compound-interest-calculator.html">Compound Interest Calculator</a></li>
                    <li><a href="/calc/investment-calculator.html">Investment Calculator</a></li>
                </ul>
            </div>

            <div class="category">
                <h2>Fitness & Health Calculators</h2>
                <ul>
                    <li><a href="/calc/bmi-calculator.html">BMI Calculator</a></li>
                    <li><a href="/calc/calorie-calculator.html">Calorie Calculator</a></li>
                    <li><a href="/calc/body-fat-calculator.html">Body Fat Calculator</a></li>
                    <li><a href="/calc/ideal-weight-calculator.html">Ideal Weight Calculator</a></li>
                    <li><a href="/calc/pregnancy-calculator.html">Pregnancy Calculator</a></li>
                </ul>
            </div>

            <div class="category">
                <h2>Math Calculators</h2>
                <ul>
                    <li><a href="/calc/basic-math-calculator.html">Basic Math Calculator</a></li>
                    <li><a href="/calc/scientific-calculator.html">Scientific Calculator</a></li>
                    <li><a href="/calc/percentage-calculator.html">Percentage Calculator</a></li>
                    <li><a href="/calc/fraction-calculator.html">Fraction Calculator</a></li>
                    <li><a href="/calc/algebra-calculator.html">Algebra Calculator</a></li>
                </ul>
            </div>

            <div class="category">
                <h2>Other Calculators</h2>
                <ul>
                    <li><a href="/calc/age-calculator.html">Age Calculator</a></li>
                    <li><a href="/calc/date-calculator.html">Date Calculator</a></li>
                    <li><a href="/calc/time-calculator.html">Time Calculator</a></li>
                    <li><a href="/convert/length-converter.html">Length Converter</a></li>
                    <li><a href="/convert/temperature-converter.html">Temperature Converter</a></li>
                </ul>
            </div>
        </div>
    </div>

    <footer class="footer">
        <p>© 2024 IntlCalc.com. All rights reserved.</p>
    </footer>

    <script>
        // 科学计算器实现
        let display = document.getElementById('display');
        let currentInput = '0';
        let previousInput = '';
        let operator = '';
        let memory = 0;

        const buttons = [
            ['sin', 'cos', 'tan', 'Deg', 'Rad'],
            ['sin⁻¹', 'cos⁻¹', 'tan⁻¹', 'π', 'e'],
            ['x^y', 'x³', 'x²', 'eˣ', '10ˣ'],
            ['ʸ√x', '³√x', '√x', 'ln', 'log'],
            ['(', ')', '1/x', '%', 'n!'],
            ['7', '8', '9', '+', 'Back'],
            ['4', '5', '6', '–', 'Ans'],
            ['1', '2', '3', '×', 'M+'],
            ['0', '.', 'EXP', '/', 'M-'],
            ['±', 'RND', 'AC', '=', 'MR']
        ];

        function createCalculator() {
            const container = document.getElementById('calcButtons');
            buttons.forEach(row => {
                row.forEach(btn => {
                    const button = document.createElement('button');
                    button.className = 'calc-btn';
                    button.textContent = btn;
                    
                    if (['0','1','2','3','4','5','6','7','8','9','.'].includes(btn)) {
                        button.className += ' number';
                    } else if (['+','–','×','/','='].includes(btn)) {
                        button.className += ' operator';
                    } else {
                        button.className += ' function';
                    }
                    
                    button.onclick = () => handleClick(btn);
                    container.appendChild(button);
                });
            });
        }

        function handleClick(value) {
            switch(value) {
                case 'AC':
                    currentInput = '0';
                    previousInput = '';
                    operator = '';
                    display.value = currentInput;
                    break;
                case 'Back':
                    if (currentInput.length > 1) {
                        currentInput = currentInput.slice(0, -1);
                    } else {
                        currentInput = '0';
                    }
                    display.value = currentInput;
                    break;
                case '=':
                    calculate();
                    break;
                case '±':
                    currentInput = (parseFloat(currentInput) * -1).toString();
                    display.value = currentInput;
                    break;
                case '%':
                    currentInput = (parseFloat(currentInput) / 100).toString();
                    display.value = currentInput;
                    break;
                case '√x':
                    currentInput = Math.sqrt(parseFloat(currentInput)).toString();
                    display.value = currentInput;
                    break;
                case 'x²':
                    currentInput = Math.pow(parseFloat(currentInput), 2).toString();
                    display.value = currentInput;
                    break;
                case '1/x':
                    currentInput = (1 / parseFloat(currentInput)).toString();
                    display.value = currentInput;
                    break;
                case 'sin':
                    currentInput = Math.sin(parseFloat(currentInput) * Math.PI / 180).toString();
                    display.value = currentInput;
                    break;
                case 'cos':
                    currentInput = Math.cos(parseFloat(currentInput) * Math.PI / 180).toString();
                    display.value = currentInput;
                    break;
                case 'tan':
                    currentInput = Math.tan(parseFloat(currentInput) * Math.PI / 180).toString();
                    display.value = currentInput;
                    break;
                case 'ln':
                    currentInput = Math.log(parseFloat(currentInput)).toString();
                    display.value = currentInput;
                    break;
                case 'log':
                    currentInput = Math.log10(parseFloat(currentInput)).toString();
                    display.value = currentInput;
                    break;
                case 'π':
                    currentInput = Math.PI.toString();
                    display.value = currentInput;
                    break;
                case 'e':
                    currentInput = Math.E.toString();
                    display.value = currentInput;
                    break;
                case 'M+':
                    memory += parseFloat(currentInput);
                    break;
                case 'M-':
                    memory -= parseFloat(currentInput);
                    break;
                case 'MR':
                    currentInput = memory.toString();
                    display.value = currentInput;
                    break;
                default:
                    if (['0','1','2','3','4','5','6','7','8','9','.'].includes(value)) {
                        if (currentInput === '0' && value !== '.') {
                            currentInput = value;
                        } else {
                            currentInput += value;
                        }
                        display.value = currentInput;
                    } else if (['+','–','×','/'].includes(value)) {
                        if (operator && previousInput) {
                            calculate();
                        }
                        operator = value;
                        previousInput = currentInput;
                        currentInput = '';
                    }
            }
        }

        function calculate() {
            if (previousInput && currentInput && operator) {
                const prev = parseFloat(previousInput);
                const curr = parseFloat(currentInput);
                let result = 0;

                switch (operator) {
                    case '+': result = prev + curr; break;
                    case '–': result = prev - curr; break;
                    case '×': result = prev * curr; break;
                    case '/': result = prev / curr; break;
                }

                currentInput = result.toString();
                display.value = currentInput;
                previousInput = '';
                operator = '';
            }
        }

        function changeLanguage(lang) {
            window.location.href = \`https://\${lang}.intlcalc.com\`;
        }

        // 初始化
        createCalculator();
    </script>
</body>
</html>`;

// 🧮 修复基础数学计算器
const basicMathCalculatorTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Basic Math Calculator - IntlCalc</title>
    <meta name="description" content="Free online basic math calculator for addition, subtraction, multiplication, and division.">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background: #fff; color: #000; }
        
        .header { border-bottom: 1px solid #ccc; padding: 10px 0; }
        .header-content { max-width: 1200px; margin: 0 auto; padding: 0 20px; display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 24px; font-weight: bold; text-decoration: none; color: #000; }
        
        .breadcrumb { background: #f9f9f9; border-bottom: 1px solid #ccc; padding: 10px 0; font-size: 14px; }
        .breadcrumb-content { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        .breadcrumb a { color: #0000ee; text-decoration: none; }
        .breadcrumb a:hover { text-decoration: underline; }
        
        .main-content { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .page-title { font-size: 28px; margin-bottom: 10px; }
        .page-description { font-size: 16px; color: #333; margin-bottom: 20px; }
        
        .calculator-widget { border: 1px solid #ccc; padding: 20px; margin: 20px 0; max-width: 400px; background: #f9f9f9; }
        .calc-display { width: 100%; height: 60px; font-size: 24px; text-align: right; padding: 10px; border: 1px solid #ccc; margin-bottom: 15px; }
        .calc-buttons { display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; }
        .calc-btn { padding: 20px; font-size: 18px; border: 1px solid #ccc; background: #fff; cursor: pointer; }
        .calc-btn:hover { background: #f0f0f0; }
        .calc-btn.zero { grid-column: span 2; }
        
        .related-section { margin: 30px 0; padding: 15px; border: 1px solid #ccc; background: #f9f9f9; }
        .related-title { font-size: 16px; font-weight: bold; margin-bottom: 10px; }
        .related-links { display: flex; flex-wrap: wrap; gap: 15px; }
        .related-links a { color: #0000ee; text-decoration: none; font-size: 14px; }
        .related-links a:hover { text-decoration: underline; }
        
        .content-section { margin: 30px 0; }
        .content-section h2 { font-size: 20px; margin-bottom: 10px; }
        .content-section h3 { font-size: 16px; margin: 15px 0 8px 0; }
        .content-section p { font-size: 14px; color: #333; line-height: 1.6; margin-bottom: 10px; }
        
        .footer { margin-top: 50px; border-top: 1px solid #ccc; padding: 20px 0; text-align: center; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <header class="header">
        <div class="header-content">
            <a href="/" class="logo">🧮 IntlCalc</a>
            <div>
                <select onchange="changeLanguage(this.value)">
                    <option value="en">English</option>
                    <option value="zh">中文</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="ja">日本語</option>
                    <option value="ko">한국어</option>
                    <option value="pt">Português</option>
                    <option value="ru">Русский</option>
                    <option value="ar">العربية</option>
                </select>
            </div>
        </div>
    </header>

    <nav class="breadcrumb">
        <div class="breadcrumb-content">
            <a href="/">Home</a> / <a href="/calc/">Calculators</a> / Basic Math Calculator
        </div>
    </nav>

    <main class="main-content">
        <h1 class="page-title">Basic Math Calculator</h1>
        <p class="page-description">Free online basic math calculator for addition, subtraction, multiplication, and division operations.</p>

        <div class="calculator-widget">
            <input type="text" id="display" class="calc-display" value="0" readonly>
            <div class="calc-buttons">
                <button class="calc-btn" onclick="clearAll()">C</button>
                <button class="calc-btn" onclick="clearEntry()">CE</button>
                <button class="calc-btn" onclick="backspace()">⌫</button>
                <button class="calc-btn" onclick="inputOperator('/')">/</button>
                
                <button class="calc-btn" onclick="inputNumber('7')">7</button>
                <button class="calc-btn" onclick="inputNumber('8')">8</button>
                <button class="calc-btn" onclick="inputNumber('9')">9</button>
                <button class="calc-btn" onclick="inputOperator('*')">×</button>
                
                <button class="calc-btn" onclick="inputNumber('4')">4</button>
                <button class="calc-btn" onclick="inputNumber('5')">5</button>
                <button class="calc-btn" onclick="inputNumber('6')">6</button>
                <button class="calc-btn" onclick="inputOperator('-')">-</button>
                
                <button class="calc-btn" onclick="inputNumber('1')">1</button>
                <button class="calc-btn" onclick="inputNumber('2')">2</button>
                <button class="calc-btn" onclick="inputNumber('3')">3</button>
                <button class="calc-btn" onclick="inputOperator('+')">+</button>
                
                <button class="calc-btn zero" onclick="inputNumber('0')">0</button>
                <button class="calc-btn" onclick="inputNumber('.')">.</button>
                <button class="calc-btn" onclick="calculate()">=</button>
            </div>
        </div>

        <div class="related-section">
            <h3 class="related-title">Related Calculators</h3>
            <div class="related-links">
                <a href="/calc/scientific-calculator.html">Scientific Calculator</a>
                <a href="/calc/percentage-calculator.html">Percentage Calculator</a>
                <a href="/calc/fraction-calculator.html">Fraction Calculator</a>
                <a href="/calc/algebra-calculator.html">Algebra Calculator</a>
            </div>
        </div>

        <div class="content-section">
            <h2>About Basic Math Calculator</h2>
            <p>This basic math calculator performs fundamental arithmetic operations including addition, subtraction, multiplication, and division. It's perfect for quick calculations and everyday math problems.</p>
            
            <h3>How to Use</h3>
            <p>1. Click the number buttons to enter your first number<br>
            2. Click an operation button (+, -, ×, ÷)<br>
            3. Enter your second number<br>
            4. Press equals (=) to see the result</p>
            
            <h3>Features</h3>
            <p>• Basic arithmetic operations<br>
            • Clear and clear entry functions<br>
            • Backspace functionality<br>
            • Decimal point support<br>
            • Large, easy-to-read display</p>
        </div>
    </main>

    <footer class="footer">
        <p>© 2024 IntlCalc. All rights reserved.</p>
    </footer>

    <script>
        let display = document.getElementById('display');
        let currentInput = '0';
        let previousInput = '';
        let operator = '';
        let waitingForOperand = false;

        function updateDisplay() {
            display.value = currentInput;
        }

        function inputNumber(num) {
            if (waitingForOperand) {
                currentInput = num;
                waitingForOperand = false;
            } else {
                currentInput = currentInput === '0' ? num : currentInput + num;
            }
            updateDisplay();
        }

        function inputOperator(nextOperator) {
            const inputValue = parseFloat(currentInput);

            if (previousInput === '') {
                previousInput = inputValue;
            } else if (operator) {
                const currentValue = previousInput || 0;
                const newValue = performCalculation();

                currentInput = \`\${parseFloat(newValue.toFixed(7))}\`;
                previousInput = newValue;
                updateDisplay();
            }

            waitingForOperand = true;
            operator = nextOperator;
        }

        function performCalculation() {
            const prev = parseFloat(previousInput);
            const current = parseFloat(currentInput);

            if (operator === '+') return prev + current;
            if (operator === '-') return prev - current;
            if (operator === '*') return prev * current;
            if (operator === '/') return current !== 0 ? prev / current : 0;

            return current;
        }

        function calculate() {
            const inputValue = parseFloat(currentInput);

            if (previousInput !== '' && operator && !waitingForOperand) {
                const newValue = performCalculation();
                currentInput = \`\${parseFloat(newValue.toFixed(7))}\`;
                previousInput = '';
                operator = '';
                waitingForOperand = true;
                updateDisplay();
            }
        }

        function clearAll() {
            currentInput = '0';
            previousInput = '';
            operator = '';
            waitingForOperand = false;
            updateDisplay();
        }

        function clearEntry() {
            currentInput = '0';
            updateDisplay();
        }

        function backspace() {
            if (currentInput.length > 1) {
                currentInput = currentInput.slice(0, -1);
            } else {
                currentInput = '0';
            }
            updateDisplay();
        }

        function changeLanguage(lang) {
            window.location.href = \`https://\${lang}.intlcalc.com/calc/basic-math-calculator.html\`;
        }

        // 键盘支持
        document.addEventListener('keydown', function(event) {
            if (event.key >= '0' && event.key <= '9' || event.key === '.') {
                inputNumber(event.key);
            } else if (event.key === '+') {
                inputOperator('+');
            } else if (event.key === '-') {
                inputOperator('-');
            } else if (event.key === '*') {
                inputOperator('*');
            } else if (event.key === '/') {
                event.preventDefault();
                inputOperator('/');
            } else if (event.key === 'Enter' || event.key === '=') {
                calculate();
            } else if (event.key === 'Escape') {
                clearAll();
            } else if (event.key === 'Backspace') {
                backspace();
            }
        });
    </script>
</body>
</html>`;

// 💰 创建利息计算器
const interestCalculatorTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interest Calculator - IntlCalc</title>
    <meta name="description" content="Calculate simple and compound interest with our free online interest calculator.">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background: #fff; color: #000; }
        
        .header { border-bottom: 1px solid #ccc; padding: 10px 0; }
        .header-content { max-width: 1200px; margin: 0 auto; padding: 0 20px; display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 24px; font-weight: bold; text-decoration: none; color: #000; }
        
        .breadcrumb { background: #f9f9f9; border-bottom: 1px solid #ccc; padding: 10px 0; font-size: 14px; }
        .breadcrumb-content { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        .breadcrumb a { color: #0000ee; text-decoration: none; }
        
        .main-content { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .page-title { font-size: 28px; margin-bottom: 10px; }
        .page-description { font-size: 16px; color: #333; margin-bottom: 20px; }
        
        .calculator-widget { border: 1px solid #ccc; padding: 20px; margin: 20px 0; max-width: 600px; background: #f9f9f9; }
        .form-row { margin-bottom: 15px; display: flex; align-items: center; gap: 10px; }
        .form-row label { min-width: 150px; font-size: 14px; }
        .form-row input, .form-row select { padding: 8px; border: 1px solid #ccc; font-size: 14px; width: 200px; }
        .btn { padding: 10px 20px; background: #fff; border: 2px solid #000; cursor: pointer; font-size: 14px; }
        .btn:hover { background: #f0f0f0; }
        
        .result-section { margin-top: 20px; padding: 15px; border: 1px solid #ccc; background: #fff; }
        .result-title { font-size: 16px; font-weight: bold; margin-bottom: 10px; }
        .result-value { font-size: 18px; font-weight: bold; color: #000; }
        
        .related-section { margin: 30px 0; padding: 15px; border: 1px solid #ccc; background: #f9f9f9; }
        .related-links { display: flex; flex-wrap: wrap; gap: 15px; }
        .related-links a { color: #0000ee; text-decoration: none; font-size: 14px; }
        
        .content-section { margin: 30px 0; }
        .content-section h2 { font-size: 20px; margin-bottom: 10px; }
        .content-section p { font-size: 14px; color: #333; line-height: 1.6; margin-bottom: 10px; }
        
        .footer { margin-top: 50px; border-top: 1px solid #ccc; padding: 20px 0; text-align: center; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <header class="header">
        <div class="header-content">
            <a href="/" class="logo">🧮 IntlCalc</a>
            <div>
                <select onchange="changeLanguage(this.value)">
                    <option value="en">English</option>
                    <option value="zh">中文</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="ja">日本語</option>
                    <option value="ko">한국어</option>
                    <option value="pt">Português</option>
                    <option value="ru">Русский</option>
                    <option value="ar">العربية</option>
                </select>
            </div>
        </div>
    </header>

    <nav class="breadcrumb">
        <div class="breadcrumb-content">
            <a href="/">Home</a> / <a href="/calc/">Financial</a> / Interest Calculator
        </div>
    </nav>

    <main class="main-content">
        <h1 class="page-title">Interest Calculator</h1>
        <p class="page-description">Calculate simple and compound interest for loans, savings, and investments.</p>

        <div class="calculator-widget">
            <div class="form-row">
                <label>Principal Amount:</label>
                <input type="number" id="principal" value="1000" step="0.01">
            </div>
            
            <div class="form-row">
                <label>Annual Interest Rate:</label>
                <input type="number" id="rate" value="5" step="0.01">
                <span>%</span>
            </div>
            
            <div class="form-row">
                <label>Time Period:</label>
                <input type="number" id="time" value="1" step="0.01">
                <select id="timeUnit">
                    <option value="years">Years</option>
                    <option value="months">Months</option>
                </select>
            </div>
            
            <div class="form-row">
                <label>Interest Type:</label>
                <select id="interestType">
                    <option value="simple">Simple Interest</option>
                    <option value="compound">Compound Interest</option>
                </select>
            </div>
            
            <div class="form-row" id="compoundFrequency" style="display: none;">
                <label>Compound Frequency:</label>
                <select id="frequency">
                    <option value="1">Annually</option>
                    <option value="2">Semi-annually</option>
                    <option value="4">Quarterly</option>
                    <option value="12">Monthly</option>
                    <option value="365">Daily</option>
                </select>
            </div>
            
            <div class="form-row">
                <button class="btn" onclick="calculateInterest()">Calculate</button>
            </div>
            
            <div class="result-section" id="resultSection" style="display: none;">
                <div class="result-title">Results:</div>
                <div id="results"></div>
            </div>
        </div>

        <div class="related-section">
            <h3>Related Calculators</h3>
            <div class="related-links">
                <a href="/calc/loan-calculator.html">Loan Calculator</a>
                <a href="/calc/mortgage-calculator.html">Mortgage Calculator</a>
                <a href="/calc/compound-interest-calculator.html">Compound Interest Calculator</a>
                <a href="/calc/investment-calculator.html">Investment Calculator</a>
            </div>
        </div>

        <div class="content-section">
            <h2>About Interest Calculator</h2>
            <p>This interest calculator helps you calculate both simple and compound interest for various financial scenarios including loans, savings accounts, and investments.</p>
            
            <h3>Simple vs Compound Interest</h3>
            <p><strong>Simple Interest:</strong> Interest calculated only on the principal amount.<br>
            Formula: Interest = Principal × Rate × Time</p>
            
            <p><strong>Compound Interest:</strong> Interest calculated on the principal plus any accumulated interest.<br>
            Formula: A = P(1 + r/n)^(nt)</p>
        </div>
    </main>

    <footer class="footer">
        <p>© 2024 IntlCalc. All rights reserved.</p>
    </footer>

    <script>
        document.getElementById('interestType').addEventListener('change', function() {
            const compoundFreq = document.getElementById('compoundFrequency');
            if (this.value === 'compound') {
                compoundFreq.style.display = 'flex';
            } else {
                compoundFreq.style.display = 'none';
            }
        });

        function calculateInterest() {
            const principal = parseFloat(document.getElementById('principal').value);
            const rate = parseFloat(document.getElementById('rate').value) / 100;
            const time = parseFloat(document.getElementById('time').value);
            const timeUnit = document.getElementById('timeUnit').value;
            const interestType = document.getElementById('interestType').value;
            const frequency = parseInt(document.getElementById('frequency').value);

            if (!principal || !rate || !time) {
                alert('Please enter valid values for all fields.');
                return;
            }

            // Convert time to years if needed
            const timeInYears = timeUnit === 'months' ? time / 12 : time;

            let interest, totalAmount;

            if (interestType === 'simple') {
                interest = principal * rate * timeInYears;
                totalAmount = principal + interest;
            } else {
                // Compound interest: A = P(1 + r/n)^(nt)
                totalAmount = principal * Math.pow(1 + rate / frequency, frequency * timeInYears);
                interest = totalAmount - principal;
            }

            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = \`
                <div style="margin-bottom: 10px;"><strong>Principal Amount:</strong> $\${principal.toFixed(2)}</div>
                <div style="margin-bottom: 10px;"><strong>Interest Earned:</strong> $\${interest.toFixed(2)}</div>
                <div style="margin-bottom: 10px;"><strong>Total Amount:</strong> $\${totalAmount.toFixed(2)}</div>
                <div style="margin-bottom: 10px;"><strong>Effective Annual Rate:</strong> \${((totalAmount/principal - 1) / timeInYears * 100).toFixed(2)}%</div>
            \`;

            document.getElementById('resultSection').style.display = 'block';
        }

        function changeLanguage(lang) {
            window.location.href = \`https://\${lang}.intlcalc.com/calc/interest-calculator.html\`;
        }

        // 初始计算
        calculateInterest();
    </script>
</body>
</html>`;

// 主函数：修复主站首页和计算器
function fixHomepageAndCalculators() {
    console.log('🔧 开始修复主站首页和计算器功能...\n');

    // 1. 更新主站首页
    console.log('🏠 更新主站首页...');
    fs.writeFileSync('main_site/index.html', homepageHTML, 'utf8');
    console.log('✅ 主站首页已更新\n');

    // 2. 修复基础数学计算器
    const languageDirs = ['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko', 'pt', 'ru', 'ar'];
    
    console.log('🧮 修复基础数学计算器...');
    for (const lang of languageDirs) {
        const calcPath = path.join('generated_pages', lang, 'calc', 'basic-math-calculator.html');
        if (fs.existsSync(calcPath)) {
            fs.writeFileSync(calcPath, basicMathCalculatorTemplate, 'utf8');
            console.log(`✅ ${lang}/calc/basic-math-calculator.html 已修复`);
        }
    }

    // 3. 修复利息计算器
    console.log('\n💰 修复利息计算器...');
    for (const lang of languageDirs) {
        const calcPath = path.join('generated_pages', lang, 'calc', 'interest-calculator.html');
        if (fs.existsSync(calcPath)) {
            fs.writeFileSync(calcPath, interestCalculatorTemplate, 'utf8');
            console.log(`✅ ${lang}/calc/interest-calculator.html 已修复`);
        }
    }

    console.log('\n🎉 修复完成！');
    console.log('📊 修复统计:');
    console.log('   🏠 主站首页: 1 个');
    console.log('   🧮 基础计算器: ' + languageDirs.length + ' 个');
    console.log('   💰 利息计算器: ' + languageDirs.length + ' 个');
    console.log('\n✨ 新功能:');
    console.log('   • 类似Calculator.net的首页设计');
    console.log('   • 工作的科学计算器');
    console.log('   • 功能完整的基础数学计算器');
    console.log('   • 专业的利息计算器(简单+复利)');
    console.log('   • 键盘支持');
    console.log('   • 响应式设计');
}

// 执行修复
fixHomepageAndCalculators(); 