const fs = require('fs');
const path = require('path');

class CalculatorGenerator {
    constructor() {
        this.templates = {
            'basic-calculator': this.generateBasicCalculatorTemplate,
            'conversion-calculator': this.generateConversionCalculatorTemplate,
            'scientific-calculator': this.generateScientificCalculatorTemplate,
            'financial-calculator': this.generateFinancialCalculatorTemplate
        };
    }

    // 生成完整计算器
    async generateCalculator(spec) {
        console.log(`🔧 生成计算器: ${spec.title}`);
        
        const calculator = {
            html: this.generateHTML(spec),
            css: this.generateCSS(spec),
            js: this.generateJS(spec),
            metadata: this.generateMetadata(spec)
        };

        // 保存生成的计算器
        await this.saveCalculator(calculator, spec);
        
        console.log(`✅ 计算器生成完成: ${spec.title}`);
        return calculator;
    }

    // 生成HTML结构
    generateHTML(spec) {
        const templateFunction = this.templates[spec.uiTemplate] || this.templates['basic-calculator'];
        const bodyContent = templateFunction.call(this, spec);
        
        return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${spec.title}</title>
    <meta name="description" content="${spec.description}">
    <style id="calculator-styles">
        ${this.generateCSS(spec)}
    </style>
</head>
<body>
    <div class="calculator-container">
        <header class="calculator-header">
            <h1>${spec.title}</h1>
            <p class="description">${spec.description}</p>
        </header>
        
        <main class="calculator-main">
            ${bodyContent}
        </main>
        
        <footer class="calculator-footer">
            <p>由AI自动生成 • ${new Date().toLocaleDateString()}</p>
        </footer>
    </div>

    <script>
        ${this.generateJS(spec)}
    </script>
</body>
</html>`;
    }

    // 生成基础计算器模板
    generateBasicCalculatorTemplate(spec) {
        return `
        <div class="calculator-display">
            <input type="text" id="display" class="display-input" readonly>
            <div class="display-history" id="history"></div>
        </div>
        
        <div class="calculator-buttons">
            <div class="button-row">
                <button class="btn btn-clear" onclick="clearDisplay()">清除</button>
                <button class="btn btn-clear" onclick="clearEntry()">CE</button>
                <button class="btn btn-operator" onclick="deleteLast()">⌫</button>
                <button class="btn btn-operator" onclick="inputOperator('/')">/</button>
            </div>
            
            <div class="button-row">
                <button class="btn btn-number" onclick="inputNumber('7')">7</button>
                <button class="btn btn-number" onclick="inputNumber('8')">8</button>
                <button class="btn btn-number" onclick="inputNumber('9')">9</button>
                <button class="btn btn-operator" onclick="inputOperator('*')">×</button>
            </div>
            
            <div class="button-row">
                <button class="btn btn-number" onclick="inputNumber('4')">4</button>
                <button class="btn btn-number" onclick="inputNumber('5')">5</button>
                <button class="btn btn-number" onclick="inputNumber('6')">6</button>
                <button class="btn btn-operator" onclick="inputOperator('-')">-</button>
            </div>
            
            <div class="button-row">
                <button class="btn btn-number" onclick="inputNumber('1')">1</button>
                <button class="btn btn-number" onclick="inputNumber('2')">2</button>
                <button class="btn btn-number" onclick="inputNumber('3')">3</button>
                <button class="btn btn-operator" onclick="inputOperator('+')">+</button>
            </div>
            
            <div class="button-row">
                <button class="btn btn-number btn-wide" onclick="inputNumber('0')">0</button>
                <button class="btn btn-number" onclick="inputNumber('.')">.</button>
                <button class="btn btn-equals" onclick="calculate()">=</button>
            </div>
        </div>`;
    }

    // 生成转换计算器模板
    generateConversionCalculatorTemplate(spec) {
        return `
        <div class="conversion-container">
            <div class="conversion-section">
                <label for="input-value">输入值:</label>
                <input type="number" id="input-value" class="conversion-input" oninput="convert()" placeholder="请输入数值">
                <select id="input-unit" class="unit-select" onchange="convert()">
                    ${this.generateUnitOptions(spec)}
                </select>
            </div>
            
            <div class="conversion-arrow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 18l6-6-6-6"/>
                </svg>
            </div>
            
            <div class="conversion-section">
                <label for="output-value">转换结果:</label>
                <input type="text" id="output-value" class="conversion-output" readonly>
                <select id="output-unit" class="unit-select" onchange="convert()">
                    ${this.generateUnitOptions(spec)}
                </select>
            </div>
        </div>
        
        <div class="conversion-formula" id="formula-display">
            <h4>转换公式:</h4>
            <div id="formula-text"></div>
        </div>`;
    }

    // 生成科学计算器模板
    generateScientificCalculatorTemplate(spec) {
        return `
        <div class="calculator-display">
            <input type="text" id="display" class="display-input" readonly>
            <div class="display-mode">
                <span>DEG</span>
                <span id="memory-indicator" style="display:none">M</span>
            </div>
        </div>
        
        <div class="scientific-buttons">
            <!-- 第一行：内存和模式 -->
            <div class="button-row">
                <button class="btn btn-function" onclick="memoryClear()">MC</button>
                <button class="btn btn-function" onclick="memoryRecall()">MR</button>
                <button class="btn btn-function" onclick="memoryAdd()">M+</button>
                <button class="btn btn-function" onclick="memorySubtract()">M-</button>
                <button class="btn btn-clear" onclick="clearDisplay()">C</button>
            </div>
            
            <!-- 第二行：三角函数 -->
            <div class="button-row">
                <button class="btn btn-function" onclick="inputFunction('sin(')">sin</button>
                <button class="btn btn-function" onclick="inputFunction('cos(')">cos</button>
                <button class="btn btn-function" onclick="inputFunction('tan(')">tan</button>
                <button class="btn btn-function" onclick="inputFunction('log(')">log</button>
                <button class="btn btn-operator" onclick="deleteLast()">⌫</button>
            </div>
            
            <!-- 第三行：指数和根 -->
            <div class="button-row">
                <button class="btn btn-function" onclick="inputFunction('pow(')">x^y</button>
                <button class="btn btn-function" onclick="inputFunction('sqrt(')">√</button>
                <button class="btn btn-function" onclick="inputOperator('(')">(</button>
                <button class="btn btn-function" onclick="inputOperator(')')">)</button>
                <button class="btn btn-operator" onclick="inputOperator('/')">/</button>
            </div>
            
            <!-- 数字行 -->
            <div class="button-row">
                <button class="btn btn-number" onclick="inputNumber('7')">7</button>
                <button class="btn btn-number" onclick="inputNumber('8')">8</button>
                <button class="btn btn-number" onclick="inputNumber('9')">9</button>
                <button class="btn btn-operator" onclick="inputOperator('*')">×</button>
            </div>
            
            <div class="button-row">
                <button class="btn btn-number" onclick="inputNumber('4')">4</button>
                <button class="btn btn-number" onclick="inputNumber('5')">5</button>
                <button class="btn btn-number" onclick="inputNumber('6')">6</button>
                <button class="btn btn-operator" onclick="inputOperator('-')">-</button>
            </div>
            
            <div class="button-row">
                <button class="btn btn-number" onclick="inputNumber('1')">1</button>
                <button class="btn btn-number" onclick="inputNumber('2')">2</button>
                <button class="btn btn-number" onclick="inputNumber('3')">3</button>
                <button class="btn btn-operator" onclick="inputOperator('+')">+</button>
            </div>
            
            <div class="button-row">
                <button class="btn btn-number btn-wide" onclick="inputNumber('0')">0</button>
                <button class="btn btn-number" onclick="inputNumber('.')">.</button>
                <button class="btn btn-equals" onclick="calculate()">=</button>
            </div>
        </div>`;
    }

    // 生成金融计算器模板
    generateFinancialCalculatorTemplate(spec) {
        return `
        <div class="financial-calculator">
            <div class="input-section">
                <div class="input-group">
                    <label for="principal">本金 (P):</label>
                    <input type="number" id="principal" class="financial-input" placeholder="请输入本金金额">
                </div>
                
                <div class="input-group">
                    <label for="interest-rate">年利率 (%):</label>
                    <input type="number" id="interest-rate" class="financial-input" placeholder="请输入年利率" step="0.01">
                </div>
                
                <div class="input-group">
                    <label for="time-period">时间 (年):</label>
                    <input type="number" id="time-period" class="financial-input" placeholder="请输入时间长度">
                </div>
                
                <div class="input-group">
                    <label for="compound-frequency">复利频率:</label>
                    <select id="compound-frequency" class="financial-select">
                        <option value="1">年复利</option>
                        <option value="2">半年复利</option>
                        <option value="4">季度复利</option>
                        <option value="12">月复利</option>
                        <option value="365">日复利</option>
                    </select>
                </div>
                
                <button class="btn btn-calculate" onclick="calculateInterest()">计算</button>
            </div>
            
            <div class="result-section">
                <div class="result-item">
                    <label>单利:</label>
                    <span id="simple-interest">--</span>
                </div>
                <div class="result-item">
                    <label>复利:</label>
                    <span id="compound-interest">--</span>
                </div>
                <div class="result-item">
                    <label>总金额:</label>
                    <span id="total-amount">--</span>
                </div>
            </div>
        </div>`;
    }

    // 生成单位选项
    generateUnitOptions(spec) {
        const unitSets = {
            length: [
                { value: 'mm', label: '毫米 (mm)' },
                { value: 'cm', label: '厘米 (cm)' },
                { value: 'm', label: '米 (m)' },
                { value: 'km', label: '千米 (km)' },
                { value: 'inch', label: '英寸 (in)' },
                { value: 'feet', label: '英尺 (ft)' },
                { value: 'yard', label: '码 (yd)' },
                { value: 'mile', label: '英里 (mi)' }
            ],
            weight: [
                { value: 'g', label: '克 (g)' },
                { value: 'kg', label: '千克 (kg)' },
                { value: 'lb', label: '磅 (lb)' },
                { value: 'oz', label: '盎司 (oz)' }
            ],
            temperature: [
                { value: 'celsius', label: '摄氏度 (°C)' },
                { value: 'fahrenheit', label: '华氏度 (°F)' },
                { value: 'kelvin', label: '开尔文 (K)' }
            ]
        };

        // 根据规格确定单位类型
        let units = unitSets.length; // 默认长度单位
        
        if (spec.categories && spec.categories.length > 0) {
            const category = spec.categories[0];
            if (category.sub in unitSets) {
                units = unitSets[category.sub];
            }
        }

        return units.map(unit => 
            `<option value="${unit.value}">${unit.label}</option>`
        ).join('');
    }

    // 生成CSS样式
    generateCSS(spec) {
        const baseCSS = `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .calculator-container {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            max-width: 500px;
            width: 100%;
        }

        .calculator-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            text-align: center;
        }

        .calculator-header h1 {
            font-size: 1.8rem;
            margin-bottom: 8px;
        }

        .calculator-header .description {
            opacity: 0.9;
            font-size: 0.9rem;
        }

        .calculator-main {
            padding: 30px;
        }

        .calculator-footer {
            background: #f8f9fa;
            padding: 15px;
            text-align: center;
            font-size: 0.8rem;
            color: #666;
        }`;

        const templateCSS = this.getTemplateCSS(spec.uiTemplate);
        return baseCSS + templateCSS;
    }

    // 获取模板特定CSS
    getTemplateCSS(template) {
        const templates = {
            'basic-calculator': `
                .calculator-display {
                    margin-bottom: 20px;
                }

                .display-input {
                    width: 100%;
                    height: 80px;
                    font-size: 2rem;
                    text-align: right;
                    padding: 15px;
                    border: 2px solid #e9ecef;
                    border-radius: 10px;
                    background: #f8f9fa;
                }

                .display-history {
                    height: 30px;
                    font-size: 0.9rem;
                    color: #666;
                    text-align: right;
                    padding: 5px 15px;
                }

                .calculator-buttons {
                    display: grid;
                    gap: 10px;
                }

                .button-row {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 10px;
                }

                .btn {
                    height: 60px;
                    border: none;
                    border-radius: 10px;
                    font-size: 1.2rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                }

                .btn-number {
                    background: #ffffff;
                    color: #333;
                    border: 2px solid #e9ecef;
                }

                .btn-operator {
                    background: #667eea;
                    color: white;
                }

                .btn-equals {
                    background: #28a745;
                    color: white;
                }

                .btn-clear {
                    background: #dc3545;
                    color: white;
                }

                .btn-wide {
                    grid-column: span 2;
                }`,

            'conversion-calculator': `
                .conversion-container {
                    display: grid;
                    grid-template-columns: 1fr auto 1fr;
                    align-items: center;
                    gap: 20px;
                    margin-bottom: 30px;
                }

                .conversion-section {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .conversion-section label {
                    font-weight: 600;
                    color: #333;
                }

                .conversion-input, .conversion-output {
                    padding: 15px;
                    border: 2px solid #e9ecef;
                    border-radius: 8px;
                    font-size: 1.1rem;
                }

                .conversion-output {
                    background: #f8f9fa;
                    color: #495057;
                    font-weight: 600;
                }

                .unit-select {
                    padding: 10px;
                    border: 2px solid #e9ecef;
                    border-radius: 8px;
                    font-size: 0.9rem;
                }

                .conversion-arrow {
                    color: #667eea;
                    font-size: 1.5rem;
                }

                .conversion-formula {
                    background: #f8f9fa;
                    padding: 20px;
                    border-radius: 10px;
                    border-left: 4px solid #667eea;
                }

                .conversion-formula h4 {
                    color: #333;
                    margin-bottom: 10px;
                }`,

            'scientific-calculator': `
                .calculator-display {
                    margin-bottom: 20px;
                    position: relative;
                }

                .display-input {
                    width: 100%;
                    height: 80px;
                    font-size: 1.8rem;
                    text-align: right;
                    padding: 15px;
                    border: 2px solid #e9ecef;
                    border-radius: 10px;
                    background: #f8f9fa;
                }

                .display-mode {
                    position: absolute;
                    top: 10px;
                    left: 15px;
                    font-size: 0.8rem;
                    color: #666;
                }

                .scientific-buttons {
                    display: grid;
                    gap: 8px;
                }

                .button-row {
                    display: grid;
                    grid-template-columns: repeat(5, 1fr);
                    gap: 8px;
                }

                .btn {
                    height: 50px;
                    border: none;
                    border-radius: 8px;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .btn-function {
                    background: #6c757d;
                    color: white;
                    font-size: 0.9rem;
                }`,

            'financial-calculator': `
                .financial-calculator {
                    display: grid;
                    gap: 30px;
                }

                .input-section {
                    display: grid;
                    gap: 20px;
                }

                .input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .input-group label {
                    font-weight: 600;
                    color: #333;
                }

                .financial-input, .financial-select {
                    padding: 15px;
                    border: 2px solid #e9ecef;
                    border-radius: 8px;
                    font-size: 1rem;
                }

                .btn-calculate {
                    padding: 15px;
                    background: #28a745;
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-size: 1.1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .btn-calculate:hover {
                    background: #218838;
                    transform: translateY(-2px);
                }

                .result-section {
                    background: #f8f9fa;
                    padding: 20px;
                    border-radius: 10px;
                    border-left: 4px solid #28a745;
                }

                .result-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 0;
                    border-bottom: 1px solid #e9ecef;
                }

                .result-item:last-child {
                    border-bottom: none;
                    font-weight: 600;
                    font-size: 1.1rem;
                }

                .result-item span {
                    color: #28a745;
                    font-weight: 600;
                }`
        };

        return templates[template] || templates['basic-calculator'];
    }

    // 生成JavaScript代码
    generateJS(spec) {
        const baseJS = this.getBaseJS();
        const templateJS = this.getTemplateJS(spec.uiTemplate, spec);
        return baseJS + templateJS;
    }

    // 基础JavaScript函数
    getBaseJS() {
        return `
        // 基础功能函数
        function formatNumber(num) {
            if (typeof num !== 'number') return num;
            return num.toLocaleString('zh-CN', { maximumFractionDigits: 10 });
        }

        function showError(message) {
            console.error(message);
            if (document.getElementById('display')) {
                document.getElementById('display').value = '错误';
            }
        }

        function validateInput(input) {
            return !isNaN(input) && isFinite(input);
        }`;
    }

    // 获取模板特定JavaScript
    getTemplateJS(template, spec) {
        const templates = {
            'basic-calculator': `
                let currentInput = '';
                let operator = '';
                let previousInput = '';
                let shouldResetDisplay = false;

                function inputNumber(num) {
                    const display = document.getElementById('display');
                    if (shouldResetDisplay) {
                        display.value = '';
                        shouldResetDisplay = false;
                    }
                    display.value += num;
                    currentInput = display.value;
                }

                function inputOperator(op) {
                    const display = document.getElementById('display');
                    if (currentInput === '' && previousInput === '') return;
                    
                    if (previousInput !== '' && currentInput !== '' && operator !== '') {
                        calculate();
                    }
                    
                    previousInput = currentInput || previousInput;
                    operator = op;
                    currentInput = '';
                    shouldResetDisplay = true;
                    
                    updateHistory();
                }

                function calculate() {
                    const display = document.getElementById('display');
                    if (previousInput === '' || currentInput === '' || operator === '') return;
                    
                    const prev = parseFloat(previousInput);
                    const curr = parseFloat(currentInput);
                    let result;
                    
                    switch (operator) {
                        case '+': result = prev + curr; break;
                        case '-': result = prev - curr; break;
                        case '*': result = prev * curr; break;
                        case '/': 
                            if (curr === 0) {
                                showError('除数不能为零');
                                return;
                            }
                            result = prev / curr; 
                            break;
                        default: return;
                    }
                    
                    display.value = formatNumber(result);
                    updateHistory(true);
                    
                    previousInput = '';
                    currentInput = result.toString();
                    operator = '';
                    shouldResetDisplay = true;
                }

                function clearDisplay() {
                    document.getElementById('display').value = '';
                    document.getElementById('history').textContent = '';
                    currentInput = '';
                    operator = '';
                    previousInput = '';
                    shouldResetDisplay = false;
                }

                function clearEntry() {
                    document.getElementById('display').value = '';
                    currentInput = '';
                }

                function deleteLast() {
                    const display = document.getElementById('display');
                    display.value = display.value.slice(0, -1);
                    currentInput = display.value;
                }

                function updateHistory(showResult = false) {
                    const history = document.getElementById('history');
                    if (showResult) {
                        history.textContent = \`\${previousInput} \${operator} \${currentInput} =\`;
                    } else {
                        history.textContent = \`\${previousInput} \${operator}\`;
                    }
                }

                // 键盘支持
                document.addEventListener('keydown', function(event) {
                    const key = event.key;
                    if ('0123456789.'.includes(key)) {
                        inputNumber(key);
                    } else if ('+-*/'.includes(key)) {
                        inputOperator(key);
                    } else if (key === 'Enter' || key === '=') {
                        calculate();
                    } else if (key === 'Escape') {
                        clearDisplay();
                    } else if (key === 'Backspace') {
                        deleteLast();
                    }
                });`,

            'conversion-calculator': this.generateConversionJS(spec),
            'scientific-calculator': this.generateScientificJS(),
            'financial-calculator': this.generateFinancialJS()
        };

        return templates[template] || templates['basic-calculator'];
    }

    // 生成转换计算器JS
    generateConversionJS(spec) {
        return `
        const conversionRates = {
            length: {
                mm: { mm: 1, cm: 0.1, m: 0.001, km: 0.000001, inch: 0.0393701, feet: 0.00328084, yard: 0.00109361, mile: 6.2137e-7 },
                cm: { mm: 10, cm: 1, m: 0.01, km: 0.00001, inch: 0.393701, feet: 0.0328084, yard: 0.0109361, mile: 6.2137e-6 },
                m: { mm: 1000, cm: 100, m: 1, km: 0.001, inch: 39.3701, feet: 3.28084, yard: 1.09361, mile: 0.000621371 },
                km: { mm: 1000000, cm: 100000, m: 1000, km: 1, inch: 39370.1, feet: 3280.84, yard: 1093.61, mile: 0.621371 },
                inch: { mm: 25.4, cm: 2.54, m: 0.0254, km: 0.0000254, inch: 1, feet: 0.0833333, yard: 0.0277778, mile: 1.5783e-5 },
                feet: { mm: 304.8, cm: 30.48, m: 0.3048, km: 0.0003048, inch: 12, feet: 1, yard: 0.333333, mile: 0.000189394 },
                yard: { mm: 914.4, cm: 91.44, m: 0.9144, km: 0.0009144, inch: 36, feet: 3, yard: 1, mile: 0.000568182 },
                mile: { mm: 1609344, cm: 160934.4, m: 1609.344, km: 1.609344, inch: 63360, feet: 5280, yard: 1760, mile: 1 }
            },
            weight: {
                g: { g: 1, kg: 0.001, lb: 0.00220462, oz: 0.035274 },
                kg: { g: 1000, kg: 1, lb: 2.20462, oz: 35.274 },
                lb: { g: 453.592, kg: 0.453592, lb: 1, oz: 16 },
                oz: { g: 28.3495, kg: 0.0283495, lb: 0.0625, oz: 1 }
            },
            temperature: {} // 温度转换需要特殊处理
        };

        function convert() {
            const inputValue = parseFloat(document.getElementById('input-value').value);
            const inputUnit = document.getElementById('input-unit').value;
            const outputUnit = document.getElementById('output-unit').value;
            const outputField = document.getElementById('output-value');
            const formulaField = document.getElementById('formula-text');

            if (isNaN(inputValue)) {
                outputField.value = '';
                formulaField.textContent = '';
                return;
            }

            let result;
            let formula;

            // 温度转换特殊处理
            if (inputUnit.includes('celsius') || inputUnit.includes('fahrenheit') || inputUnit.includes('kelvin')) {
                const conversion = convertTemperature(inputValue, inputUnit, outputUnit);
                result = conversion.result;
                formula = conversion.formula;
            } else {
                // 其他单位转换
                const category = getConversionCategory(inputUnit);
                if (category && conversionRates[category][inputUnit] && conversionRates[category][inputUnit][outputUnit]) {
                    const rate = conversionRates[category][inputUnit][outputUnit];
                    result = inputValue * rate;
                    formula = \`\${inputValue} × \${rate} = \${result}\`;
                } else {
                    result = inputValue;
                    formula = '无法转换';
                }
            }

            outputField.value = formatNumber(result);
            formulaField.textContent = formula;
        }

        function convertTemperature(value, from, to) {
            let celsius;
            
            // 转换为摄氏度
            switch (from) {
                case 'celsius': celsius = value; break;
                case 'fahrenheit': celsius = (value - 32) * 5/9; break;
                case 'kelvin': celsius = value - 273.15; break;
            }
            
            // 从摄氏度转换到目标单位
            let result;
            let formula;
            
            switch (to) {
                case 'celsius': 
                    result = celsius;
                    formula = from === 'celsius' ? \`\${value}°C\` : \`转换为摄氏度: \${result.toFixed(2)}°C\`;
                    break;
                case 'fahrenheit': 
                    result = celsius * 9/5 + 32;
                    formula = \`(\${value} × 9/5) + 32 = \${result.toFixed(2)}°F\`;
                    break;
                case 'kelvin': 
                    result = celsius + 273.15;
                    formula = \`\${value} + 273.15 = \${result.toFixed(2)}K\`;
                    break;
            }
            
            return { result, formula };
        }

        function getConversionCategory(unit) {
            for (const [category, units] of Object.entries(conversionRates)) {
                if (units[unit]) return category;
            }
            return null;
        }`;
    }

    // 生成科学计算器JS
    generateScientificJS() {
        return `
        let memory = 0;
        let currentInput = '';
        let shouldResetDisplay = false;

        function inputFunction(func) {
            const display = document.getElementById('display');
            if (shouldResetDisplay) {
                display.value = '';
                shouldResetDisplay = false;
            }
            display.value += func;
        }

        function memoryClear() {
            memory = 0;
            updateMemoryIndicator();
        }

        function memoryRecall() {
            const display = document.getElementById('display');
            display.value = memory.toString();
            shouldResetDisplay = true;
        }

        function memoryAdd() {
            const display = document.getElementById('display');
            const value = parseFloat(display.value);
            if (!isNaN(value)) {
                memory += value;
                updateMemoryIndicator();
            }
        }

        function memorySubtract() {
            const display = document.getElementById('display');
            const value = parseFloat(display.value);
            if (!isNaN(value)) {
                memory -= value;
                updateMemoryIndicator();
            }
        }

        function updateMemoryIndicator() {
            const indicator = document.getElementById('memory-indicator');
            indicator.style.display = memory !== 0 ? 'inline' : 'none';
        }

        // 重写calculate函数以支持科学计算
        function calculate() {
            const display = document.getElementById('display');
            let expression = display.value;
            
            try {
                // 替换函数名
                expression = expression.replace(/sin\\(/g, 'Math.sin(');
                expression = expression.replace(/cos\\(/g, 'Math.cos(');
                expression = expression.replace(/tan\\(/g, 'Math.tan(');
                expression = expression.replace(/log\\(/g, 'Math.log10(');
                expression = expression.replace(/sqrt\\(/g, 'Math.sqrt(');
                expression = expression.replace(/pow\\(/g, 'Math.pow(');
                
                const result = eval(expression);
                display.value = formatNumber(result);
                shouldResetDisplay = true;
            } catch (error) {
                showError('计算错误');
            }
        }`;
    }

    // 生成金融计算器JS
    generateFinancialJS() {
        return `
        function calculateInterest() {
            const principal = parseFloat(document.getElementById('principal').value);
            const rate = parseFloat(document.getElementById('interest-rate').value) / 100;
            const time = parseFloat(document.getElementById('time-period').value);
            const frequency = parseInt(document.getElementById('compound-frequency').value);

            if (!validateInput(principal) || !validateInput(rate) || !validateInput(time)) {
                showError('请输入有效的数值');
                return;
            }

            // 单利计算: I = P * r * t
            const simpleInterest = principal * rate * time;

            // 复利计算: A = P(1 + r/n)^(nt)
            const compoundAmount = principal * Math.pow(1 + rate/frequency, frequency * time);
            const compoundInterest = compoundAmount - principal;

            // 显示结果
            document.getElementById('simple-interest').textContent = formatCurrency(simpleInterest);
            document.getElementById('compound-interest').textContent = formatCurrency(compoundInterest);
            document.getElementById('total-amount').textContent = formatCurrency(compoundAmount);
        }

        function formatCurrency(amount) {
            return '¥' + amount.toLocaleString('zh-CN', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
            });
        }

        // 自动计算
        document.addEventListener('DOMContentLoaded', function() {
            const inputs = ['principal', 'interest-rate', 'time-period', 'compound-frequency'];
            inputs.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.addEventListener('input', calculateInterest);
                    element.addEventListener('change', calculateInterest);
                }
            });
        });`;
    }

    // 生成元数据
    generateMetadata(spec) {
        return {
            title: spec.title,
            description: spec.description,
            type: spec.uiTemplate,
            complexity: spec.complexity,
            features: spec.features,
            generatedAt: new Date().toISOString(),
            version: '1.0.0'
        };
    }

    // 保存生成的计算器
    async saveCalculator(calculator, spec) {
        const outputDir = path.join(process.cwd(), 'generated_calculators');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // 生成英文文件名
        const englishFilename = this.generateEnglishFilename(spec);
        const htmlPath = path.join(outputDir, `${englishFilename}.html`);
        const metaPath = path.join(outputDir, `${englishFilename}_metadata.json`);

        fs.writeFileSync(htmlPath, calculator.html);
        fs.writeFileSync(metaPath, JSON.stringify(calculator.metadata, null, 2));

        console.log(`💾 计算器已保存: ${htmlPath}`);
    }

    // 生成英文文件名
    generateEnglishFilename(spec) {
        const filenameMap = {
            '基础数学计算器': 'basic-math-calculator',
            '百分比计算器': 'percentage-calculator',
            '科学计算器': 'scientific-calculator',
            '长度转换器': 'length-converter',
            '重量转换器': 'weight-converter',
            '温度转换器': 'temperature-converter',
            '电力计算器': 'electrical-calculator',
            '利息计算器': 'interest-calculator',
            'loan计算器': 'loan-calculator'
        };

        // 如果有预定义的映射，使用映射
        if (filenameMap[spec.title]) {
            return filenameMap[spec.title];
        }

        // 否则根据模板类型生成
        const typeMap = {
            'basic-calculator': 'basic-calculator',
            'scientific-calculator': 'scientific-calculator', 
            'conversion-calculator': 'unit-converter',
            'financial-calculator': 'financial-calculator'
        };

        const baseFilename = typeMap[spec.uiTemplate] || 'calculator';
        const timestamp = Date.now().toString().slice(-6); // 添加时间戳避免重复
        
        return `${baseFilename}-${timestamp}`;
    }
}

module.exports = CalculatorGenerator; 