const fs = require('fs');
const path = require('path');

// 语言配置
const languages = {
    en: { name: 'English', flag: '🇺🇸', dir: 'ltr' },
    zh: { name: '中文', flag: '🇨🇳', dir: 'ltr' },
    es: { name: 'Español', flag: '🇪🇸', dir: 'ltr' },
    fr: { name: 'Français', flag: '🇫🇷', dir: 'ltr' },
    de: { name: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
    ja: { name: '日本語', flag: '🇯🇵', dir: 'ltr' },
    ko: { name: '한국어', flag: '🇰🇷', dir: 'ltr' },
    pt: { name: 'Português', flag: '🇵🇹', dir: 'ltr' },
    ru: { name: 'Русский', flag: '🇷🇺', dir: 'ltr' },
    ar: { name: 'العربية', flag: '🇸🇦', dir: 'rtl' }
};

// 翻译数据
const translations = {
    calculators: {
        en: 'Calculators',
        zh: '计算器',
        es: 'Calculadoras',
        fr: 'Calculatrices',
        de: 'Rechner',
        ja: '計算機',
        ko: '계산기',
        pt: 'Calculadoras',
        ru: 'Калькуляторы',
        ar: 'آلات حاسبة'
    },
    converters: {
        en: 'Converters',
        zh: '转换器',
        es: 'Convertidores',
        fr: 'Convertisseurs',
        de: 'Konverter',
        ja: 'コンバーター',
        ko: '변환기',
        pt: 'Conversores',
        ru: 'Конвертеры',
        ar: 'محولات'
    },
    home: {
        en: 'Home',
        zh: '首页',
        es: 'Inicio',
        fr: 'Accueil',
        de: 'Startseite',
        ja: 'ホーム',
        ko: '홈',
        pt: 'Início',
        ru: 'Главная',
        ar: 'الرئيسية'
    },
    'related-tools': {
        en: 'Related Tools',
        zh: '相关工具',
        es: 'Herramientas Relacionadas',
        fr: 'Outils Connexes',
        de: 'Verwandte Tools',
        ja: '関連ツール',
        ko: '관련 도구',
        pt: 'Ferramentas Relacionadas',
        ru: 'Связанные Инструменты',
        ar: 'أدوات ذات صلة'
    },
    'other-languages': {
        en: 'Other Languages',
        zh: '其他语言',
        es: 'Otros Idiomas',
        fr: 'Autres Langues',
        de: 'Andere Sprachen',
        ja: '他の言語',
        ko: '다른 언어',
        pt: 'Outros Idiomas',
        ru: 'Другие Языки',
        ar: 'لغات أخرى'
    }
};

// 计算器翻译
const calculatorTranslations = {
    'age-calculator': {
        en: { title: 'Age Calculator', desc: 'Calculate your exact age' },
        zh: { title: '年龄计算器', desc: '精确计算您的年龄' },
        es: { title: 'Calculadora de Edad', desc: 'Calcula tu edad exacta' },
        fr: { title: 'Calculateur d\'Âge', desc: 'Calculez votre âge exact' },
        de: { title: 'Altersrechner', desc: 'Berechnen Sie Ihr genaues Alter' },
        ja: { title: '年齢計算機', desc: '正確な年齢を計算' },
        ko: { title: '나이 계산기', desc: '정확한 나이를 계산' },
        pt: { title: 'Calculadora de Idade', desc: 'Calcule sua idade exata' },
        ru: { title: 'Калькулятор Возраста', desc: 'Рассчитайте ваш точный возраст' },
        ar: { title: 'حاسبة العمر', desc: 'احسب عمرك بدقة' }
    },
    'basic-calculator': {
        en: { title: 'Basic Calculator', desc: 'Simple arithmetic calculator' },
        zh: { title: '基础计算器', desc: '简单的算术计算器' },
        es: { title: 'Calculadora Básica', desc: 'Calculadora aritmética simple' },
        fr: { title: 'Calculateur de Base', desc: 'Calculatrice arithmétique simple' },
        de: { title: 'Grundrechner', desc: 'Einfacher Arithmetikrechner' },
        ja: { title: '基本計算機', desc: 'シンプルな算術計算機' },
        ko: { title: '기본 계산기', desc: '간단한 산술 계산기' },
        pt: { title: 'Calculadora Básica', desc: 'Calculadora aritmética simples' },
        ru: { title: 'Базовый Калькулятор', desc: 'Простой арифметический калькулятор' },
        ar: { title: 'الآلة الحاسبة الأساسية', desc: 'آلة حاسبة حسابية بسيطة' }
    },
    'basic-math-calculator': {
        en: { title: 'Basic Math Calculator', desc: 'Mathematical operations calculator' },
        zh: { title: '基础数学计算器', desc: '数学运算计算器' },
        es: { title: 'Calculadora de Matemáticas Básicas', desc: 'Calculadora de operaciones matemáticas' },
        fr: { title: 'Calculateur de Mathématiques de Base', desc: 'Calculatrice d\'opérations mathématiques' },
        de: { title: 'Grundmathematik-Rechner', desc: 'Rechner für mathematische Operationen' },
        ja: { title: '基本数学計算機', desc: '数学演算計算機' },
        ko: { title: '기본 수학 계산기', desc: '수학 연산 계산기' },
        pt: { title: 'Calculadora de Matemática Básica', desc: 'Calculadora de operações matemáticas' },
        ru: { title: 'Калькулятор Базовой Математики', desc: 'Калькулятор математических операций' },
        ar: { title: 'حاسبة الرياضيات الأساسية', desc: 'آلة حاسبة للعمليات الرياضية' }
    },
    'bmi-calculator': {
        en: { title: 'BMI Calculator', desc: 'Body Mass Index calculator' },
        zh: { title: 'BMI计算器', desc: '体重指数计算器' },
        es: { title: 'Calculadora de IMC', desc: 'Calculadora del Índice de Masa Corporal' },
        fr: { title: 'Calculateur d\'IMC', desc: 'Calculatrice de l\'Indice de Masse Corporelle' },
        de: { title: 'BMI-Rechner', desc: 'Body-Mass-Index-Rechner' },
        ja: { title: 'BMI計算機', desc: '体格指数計算機' },
        ko: { title: 'BMI 계산기', desc: '체질량지수 계산기' },
        pt: { title: 'Calculadora de IMC', desc: 'Calculadora do Índice de Massa Corporal' },
        ru: { title: 'Калькулятор ИМТ', desc: 'Калькулятор индекса массы тела' },
        ar: { title: 'حاسبة مؤشر كتلة الجسم', desc: 'آلة حاسبة لمؤشر كتلة الجسم' }
    },
    'interest-calculator': {
        en: { title: 'Interest Calculator', desc: 'Calculate compound and simple interest' },
        zh: { title: '利息计算器', desc: '计算复利和单利' },
        es: { title: 'Calculadora de Interés', desc: 'Calcula interés compuesto y simple' },
        fr: { title: 'Calculateur d\'Intérêt', desc: 'Calculez les intérêts composés et simples' },
        de: { title: 'Zinsrechner', desc: 'Berechnen Sie Zinseszins und einfache Zinsen' },
        ja: { title: '金利計算機', desc: '複利と単利を計算' },
        ko: { title: '이자 계산기', desc: '복리와 단리를 계산' },
        pt: { title: 'Calculadora de Juros', desc: 'Calcule juros compostos e simples' },
        ru: { title: 'Калькулятор Процентов', desc: 'Рассчитайте сложные и простые проценты' },
        ar: { title: 'حاسبة الفوائد', desc: 'احسب الفوائد المركبة والبسيطة' }
    },
    'loan-calculator': {
        en: { title: 'Loan Calculator', desc: 'Calculate loan payments and terms' },
        zh: { title: '贷款计算器', desc: '计算贷款还款和条款' },
        es: { title: 'Calculadora de Préstamos', desc: 'Calcula pagos y términos de préstamos' },
        fr: { title: 'Calculateur de Prêt', desc: 'Calculez les paiements et conditions de prêt' },
        de: { title: 'Darlehensrechner', desc: 'Berechnen Sie Darlehenszahlungen und -bedingungen' },
        ja: { title: 'ローン計算機', desc: 'ローンの支払いと条件を計算' },
        ko: { title: '대출 계산기', desc: '대출 상환금과 조건을 계산' },
        pt: { title: 'Calculadora de Empréstimo', desc: 'Calcule pagamentos e termos de empréstimo' },
        ru: { title: 'Калькулятор Кредита', desc: 'Рассчитайте платежи и условия кредита' },
        ar: { title: 'حاسبة القرض', desc: 'احسب مدفوعات وشروط القرض' }
    },
    'percentage-calculator': {
        en: { title: 'Percentage Calculator', desc: 'Calculate percentages and ratios' },
        zh: { title: '百分比计算器', desc: '计算百分比和比例' },
        es: { title: 'Calculadora de Porcentajes', desc: 'Calcula porcentajes y proporciones' },
        fr: { title: 'Calculateur de Pourcentage', desc: 'Calculez les pourcentages et ratios' },
        de: { title: 'Prozentrechner', desc: 'Berechnen Sie Prozentsätze und Verhältnisse' },
        ja: { title: 'パーセント計算機', desc: 'パーセンテージと比率を計算' },
        ko: { title: '백분율 계산기', desc: '백분율과 비율을 계산' },
        pt: { title: 'Calculadora de Porcentagem', desc: 'Calcule porcentagens e proporções' },
        ru: { title: 'Калькулятор Процентов', desc: 'Рассчитайте проценты и соотношения' },
        ar: { title: 'حاسبة النسبة المئوية', desc: 'احسب النسب المئوية والنسب' }
    },
    'scientific-calculator': {
        en: { title: 'Scientific Calculator', desc: 'Advanced mathematical calculator' },
        zh: { title: '科学计算器', desc: '高级数学计算器' },
        es: { title: 'Calculadora Científica', desc: 'Calculadora matemática avanzada' },
        fr: { title: 'Calculatrice Scientifique', desc: 'Calculatrice mathématique avancée' },
        de: { title: 'Wissenschaftlicher Rechner', desc: 'Erweiteter mathematischer Rechner' },
        ja: { title: '科学計算機', desc: '高度な数学計算機' },
        ko: { title: '과학 계산기', desc: '고급 수학 계산기' },
        pt: { title: 'Calculadora Científica', desc: 'Calculadora matemática avançada' },
        ru: { title: 'Научный Калькулятор', desc: 'Продвинутый математический калькулятор' },
        ar: { title: 'الآلة الحاسبة العلمية', desc: 'آلة حاسبة رياضية متقدمة' }
    },
    'length-converter': {
        en: { title: 'Length Converter', desc: 'Convert between length units' },
        zh: { title: '长度转换器', desc: '长度单位转换' },
        es: { title: 'Convertidor de Longitud', desc: 'Convierte entre unidades de longitud' },
        fr: { title: 'Convertisseur de Longueur', desc: 'Convertir entre les unités de longueur' },
        de: { title: 'Längenkonverter', desc: 'Konvertieren zwischen Längeneinheiten' },
        ja: { title: '長さコンバーター', desc: '長さの単位を変換' },
        ko: { title: '길이 변환기', desc: '길이 단위 간 변환' },
        pt: { title: 'Conversor de Comprimento', desc: 'Converta entre unidades de comprimento' },
        ru: { title: 'Конвертер Длины', desc: 'Конвертируйте между единицами длины' },
        ar: { title: 'محول الطول', desc: 'التحويل بين وحدات الطول' }
    },
    'temperature-converter': {
        en: { title: 'Temperature Converter', desc: 'Convert between temperature scales' },
        zh: { title: '温度转换器', desc: '温度刻度转换' },
        es: { title: 'Convertidor de Temperatura', desc: 'Convierte entre escalas de temperatura' },
        fr: { title: 'Convertisseur de Température', desc: 'Convertir entre les échelles de température' },
        de: { title: 'Temperaturkonverter', desc: 'Konvertieren zwischen Temperaturskalen' },
        ja: { title: '温度コンバーター', desc: '温度スケールを変換' },
        ko: { title: '온도 변환기', desc: '온도 척도 간 변환' },
        pt: { title: 'Conversor de Temperatura', desc: 'Converta entre escalas de temperatura' },
        ru: { title: 'Конвертер Температуры', desc: 'Конвертируйте между температурными шкалами' },
        ar: { title: 'محول درجة الحرارة', desc: 'التحويل بين مقاييس درجة الحرارة' }
    }
};

// 计算器分类
const calculatorCategories = {
    calculators: [
        'age-calculator', 'basic-calculator', 'basic-math-calculator', 
        'bmi-calculator', 'interest-calculator', 'loan-calculator', 
        'percentage-calculator', 'scientific-calculator'
    ],
    converters: [
        'length-converter', 'temperature-converter'
    ]
};

// 相关计算器推荐
const relatedCalculators = {
    'age-calculator': ['basic-calculator', 'bmi-calculator'],
    'basic-calculator': ['basic-math-calculator', 'scientific-calculator'],
    'basic-math-calculator': ['basic-calculator', 'scientific-calculator', 'percentage-calculator'],
    'bmi-calculator': ['age-calculator', 'basic-calculator'],
    'interest-calculator': ['loan-calculator', 'percentage-calculator'],
    'loan-calculator': ['interest-calculator', 'percentage-calculator'],
    'percentage-calculator': ['basic-math-calculator', 'interest-calculator', 'loan-calculator'],
    'scientific-calculator': ['basic-calculator', 'basic-math-calculator'],
    'length-converter': ['temperature-converter'],
    'temperature-converter': ['length-converter']
};

// CSS样式
const enhancedStyles = `
/* 语言切换器样式 */
.language-switcher {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background: #f8f9fa;
    border-bottom: 1px solid #dee2e6;
}

.current-lang {
    font-weight: bold;
    font-size: 1.1rem;
    color: #2196F3;
}

.lang-dropdown {
    position: relative;
}

.lang-toggle {
    cursor: pointer;
    padding: 8px 15px;
    background: #2196F3;
    color: white;
    border-radius: 4px;
    font-size: 0.9rem;
}

.lang-toggle:hover {
    background: #1976D2;
}

.lang-menu {
    display: none;
    position: absolute;
    top: 100%;
    right: 0;
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    min-width: 200px;
    z-index: 1000;
}

.lang-dropdown:hover .lang-menu {
    display: block;
}

.lang-link {
    display: block;
    padding: 10px 15px;
    color: #333;
    text-decoration: none;
    border-bottom: 1px solid #eee;
}

.lang-link:hover {
    background: #f5f5f5;
    color: #2196F3;
}

.lang-link:last-child {
    border-bottom: none;
}

/* 面包屑导航样式 */
.breadcrumb {
    padding: 15px 20px;
    background: #fff;
    border-bottom: 1px solid #eee;
    font-size: 0.9rem;
}

.breadcrumb a {
    color: #2196F3;
    text-decoration: none;
}

.breadcrumb a:hover {
    text-decoration: underline;
}

.breadcrumb .separator {
    margin: 0 8px;
    color: #666;
}

.breadcrumb .current {
    color: #333;
    font-weight: 500;
}

.breadcrumb .category {
    color: #666;
}

/* 相关计算器样式 */
.related-calculators {
    margin-top: 30px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;
}

.related-calculators h3 {
    color: #2196F3;
    margin-bottom: 15px;
    font-size: 1.2rem;
}

.related-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 15px;
}

.related-item {
    background: white;
    padding: 15px;
    border-radius: 6px;
    border-left: 3px solid #2196F3;
}

.related-item a {
    color: #2196F3;
    text-decoration: none;
    font-weight: 500;
    font-size: 1rem;
}

.related-item a:hover {
    text-decoration: underline;
}

.related-item p {
    margin: 5px 0 0 0;
    color: #666;
    font-size: 0.9rem;
}

/* 其他语言版本样式 */
.other-language-versions {
    margin-top: 30px;
    padding: 20px;
    background: #fff;
    border: 1px solid #eee;
    border-radius: 8px;
}

.other-language-versions h3 {
    color: #2196F3;
    margin-bottom: 15px;
    font-size: 1.2rem;
}

.lang-versions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 10px;
}

.lang-version {
    padding: 10px;
    background: #f8f9fa;
    border-radius: 4px;
    text-align: center;
}

.lang-version a {
    color: #2196F3;
    text-decoration: none;
    font-size: 0.9rem;
}

.lang-version a:hover {
    text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .language-switcher {
        flex-direction: column;
        gap: 10px;
    }
    
    .related-grid {
        grid-template-columns: 1fr;
    }
    
    .lang-versions-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}
`;

// 处理首页索引文件
function enhanceIndexPage(langDir, lang) {
    const indexPath = path.join('generated_pages', langDir, 'index.html');
    if (!fs.existsSync(indexPath)) return;
    
    let content = fs.readFileSync(indexPath, 'utf8');
    
    // 更新页面标题和描述的翻译
    content = content.replace(/(<h1>)[^<]+(</h1>)/, function(match, p1, p2) {
        return p1 + 'International ' + translations.calculators[lang] + p2;
    });
    
    content = content.replace(/(<h2>📊\s)[^<]+(</h2>)/, function(match, p1, p2) {
        return p1 + translations.calculators[lang] + p2;
    });
    
    content = content.replace(/(<h2>🔄\s)[^<]+(</h2>)/, function(match, p1, p2) {
        return p1 + translations.converters[lang] + p2;
    });
    
    // 更新计算器卡片的标题和描述
    Object.entries(calculatorTranslations).forEach(([id, calcTranslations]) => {
        if (calcTranslations[lang]) {
            const regex = new RegExp('(<a href="[^"]*' + id + '\\.html">)[^<]+(</a>)', 'g');
            content = content.replace(regex, function(match, p1, p2) {
                return p1 + calcTranslations[lang].title + p2;
            });
            
            const descRegex = new RegExp('(<a href="[^"]*' + id + '\\.html">[^<]+</a></h3>\\s*<p>)[^<]+(</p>)', 'g');
            content = content.replace(descRegex, function(match, p1, p2) {
                return p1 + calcTranslations[lang].desc + p2;
            });
        }
    });
    
    // 生成语言切换器
    const langLinks = Object.entries(languages)
        .filter(([code]) => code !== lang)
        .map(([code, info]) => 
            '<a href="https://' + code + '.intlcalc.com" class="lang-link">' + info.flag + ' ' + info.name + '</a>'
        ).join('');
    
    const langSwitcher = '\n    <div class="language-switcher">\n        <div class="current-lang">' + 
           languages[lang].flag + ' ' + languages[lang].name + 
           '</div>\n        <div class="other-languages">\n            <div class="lang-dropdown">\n                <span class="lang-toggle">🌐 ' + 
           translations['other-languages'][lang] + 
           '</span>\n                <div class="lang-menu">\n                    ' + 
           langLinks + 
           '\n                </div>\n            </div>\n        </div>\n    </div>';
    
    // 添加语言切换器
    content = content.replace(/(<body>)/, function(match, p1) {
        return p1 + langSwitcher;
    });
    
    // 添加样式
    content = content.replace(/(</style>)/, enhancedStyles + '$1');
    
    fs.writeFileSync(indexPath, content, 'utf8');
    console.log('✅ 增强首页: ' + indexPath);
}

// 处理计算器页面
function enhanceCalculatorPage(langDir, lang, calculatorId, category) {
    const calculatorPath = path.join('generated_pages', langDir, category, calculatorId + '.html');
    if (!fs.existsSync(calculatorPath)) return;
    
    let content = fs.readFileSync(calculatorPath, 'utf8');
    
    // 获取计算器翻译
    const calcTrans = calculatorTranslations[calculatorId][lang];
    if (!calcTrans) return;
    
    // 更新页面标题
    content = content.replace(/(<title>)[^<]+(</title>)/, function(match, p1, p2) {
        return p1 + calcTrans.title + p2;
    });
    
    content = content.replace(/(<h1[^>]*>)[^<]+(</h1>)/, function(match, p1, p2) {
        return p1 + calcTrans.title + p2;
    });
    
    // 更新meta描述
    content = content.replace(/(<meta name="description" content=")[^"]+(")/, function(match, p1, p2) {
        return p1 + calcTrans.desc + p2;
    });
    
    // 生成语言切换器
    const langLinks = Object.entries(languages)
        .filter(([code]) => code !== lang)
        .map(([code, info]) => 
            '<a href="https://' + code + '.intlcalc.com" class="lang-link">' + info.flag + ' ' + info.name + '</a>'
        ).join('');
    
    const langSwitcher = '\n    <div class="language-switcher">\n        <div class="current-lang">' + 
           languages[lang].flag + ' ' + languages[lang].name + 
           '</div>\n        <div class="other-languages">\n            <div class="lang-dropdown">\n                <span class="lang-toggle">🌐 ' + 
           translations['other-languages'][lang] + 
           '</span>\n                <div class="lang-menu">\n                    ' + 
           langLinks + 
           '\n                </div>\n            </div>\n        </div>\n    </div>';
    
    // 添加语言切换器
    content = content.replace(/(<body[^>]*>)/, function(match, p1) {
        return p1 + langSwitcher;
    });
    
    // 生成面包屑导航
    const homeText = translations.home[lang];
    const category_type = calculatorCategories.calculators.includes(calculatorId) ? 'calculators' : 'converters';
    const categoryText = translations[category_type][lang];
    const calculatorText = calculatorTranslations[calculatorId][lang].title;
    
    const breadcrumb = '<nav class="breadcrumb">\n        <a href="/">' + homeText + '</a>' +
                      ' <span class="separator">></span> <span class="category">' + categoryText + '</span>' +
                      ' <span class="separator">></span> <span class="current">' + calculatorText + '</span>' +
                      '</nav>';
    
    // 添加面包屑导航
    content = content.replace(/(<div class="[^"]*container[^"]*">)/, function(match, p1) {
        return p1 + breadcrumb;
    });
    
    // 生成相关计算器
    const related = relatedCalculators[calculatorId] || [];
    let relatedCalcs = '';
    if (related.length > 0) {
        const relatedHtml = related.map(id => {
            const calc = calculatorTranslations[id][lang];
            const cat = calculatorCategories.calculators.includes(id) ? 'calc' : 'convert';
            return '\n            <div class="related-item">\n                <a href="/' + 
                   cat + '/' + id + '.html">' + calc.title + 
                   '</a>\n                <p>' + calc.desc + '</p>\n            </div>';
        }).join('');
        
        relatedCalcs = '\n    <div class="related-calculators">\n        <h3>' + 
               translations['related-tools'][lang] + 
               '</h3>\n        <div class="related-grid">' + 
               relatedHtml + 
               '\n        </div>\n    </div>';
    }
    
    // 生成其他语言版本
    const langVersionLinks = Object.entries(languages)
        .filter(([code]) => code !== lang)
        .map(([code, info]) => {
            const calc = calculatorTranslations[calculatorId][code];
            return '\n                <div class="lang-version">\n                    <a href="https://' + 
                   code + '.intlcalc.com/' + category + '/' + calculatorId + '.html">\n                        ' + 
                   info.flag + ' ' + calc.title + 
                   '\n                    </a>\n                </div>';
        }).join('');
    
    const otherLangVersions = '\n    <div class="other-language-versions">\n        <h3>' + 
           translations['other-languages'][lang] + 
           '</h3>\n        <div class="lang-versions-grid">' + 
           langVersionLinks + 
           '\n        </div>\n    </div>';
    
    // 在内容末尾添加相关工具和其他语言版本
    content = content.replace(/(<\/body>)/, relatedCalcs + otherLangVersions + '$1');
    
    // 添加样式
    content = content.replace(/(</style>)/, enhancedStyles + '$1');
    
    fs.writeFileSync(calculatorPath, content, 'utf8');
    console.log('✅ 增强计算器页面: ' + calculatorPath);
}

// 主函数
async function main() {
    console.log('🚀 开始多语言网站增强...\n');
    
    let totalProcessed = 0;
    
    for (const [langCode, langInfo] of Object.entries(languages)) {
        console.log('📝 处理语言: ' + langInfo.flag + ' ' + langInfo.name);
        
        // 处理首页
        enhanceIndexPage(langCode, langCode);
        totalProcessed++;
        
        // 处理计算器页面
        for (const calculatorId of calculatorCategories.calculators) {
            enhanceCalculatorPage(langCode, langCode, calculatorId, 'calc');
            totalProcessed++;
        }
        
        // 处理转换器页面
        for (const converterId of calculatorCategories.converters) {
            enhanceCalculatorPage(langCode, langCode, converterId, 'convert');
            totalProcessed++;
        }
        
        console.log('✅ ' + langInfo.name + ' 完成\n');
    }
    
    console.log('🎉 多语言增强完成！');
    console.log('📊 统计信息:');
    console.log('   - 处理语言数量: ' + Object.keys(languages).length);
    console.log('   - 处理页面总数: ' + totalProcessed);
    console.log('   - 计算器类型: ' + calculatorCategories.calculators.length + ' 个');
    console.log('   - 转换器类型: ' + calculatorCategories.converters.length + ' 个');
    console.log('\n✨ 新增功能:');
    console.log('   ✅ 多语言页面标题和描述翻译');
    console.log('   ✅ 页面顶部语言切换器');
    console.log('   ✅ 面包屑导航');
    console.log('   ✅ 相关计算器推荐');
    console.log('   ✅ 其他语言版本链接');
    console.log('   ✅ 响应式设计支持');
}

main().catch(console.error); 