const fs = require('fs');
const path = require('path');

console.log('🚀 开始多语言网站增强...\n');

// 语言配置
const languages = {
    en: { name: 'English', flag: '🇺🇸' },
    zh: { name: '中文', flag: '🇨🇳' },
    es: { name: 'Español', flag: '🇪🇸' },
    fr: { name: 'Français', flag: '🇫🇷' },
    de: { name: 'Deutsch', flag: '🇩🇪' },
    ja: { name: '日本語', flag: '🇯🇵' },
    ko: { name: '한국어', flag: '🇰🇷' },
    pt: { name: 'Português', flag: '🇵🇹' },
    ru: { name: 'Русский', flag: '🇷🇺' },
    ar: { name: 'العربية', flag: '🇸🇦' }
};

// 基本翻译
const titles = {
    en: { calculators: 'Calculators', converters: 'Converters', home: 'Home', otherLang: 'Other Languages', related: 'Related Tools' },
    zh: { calculators: '计算器', converters: '转换器', home: '首页', otherLang: '其他语言', related: '相关工具' },
    es: { calculators: 'Calculadoras', converters: 'Convertidores', home: 'Inicio', otherLang: 'Otros Idiomas', related: 'Herramientas Relacionadas' },
    fr: { calculators: 'Calculatrices', converters: 'Convertisseurs', home: 'Accueil', otherLang: 'Autres Langues', related: 'Outils Connexes' },
    de: { calculators: 'Rechner', converters: 'Konverter', home: 'Startseite', otherLang: 'Andere Sprachen', related: 'Verwandte Tools' },
    ja: { calculators: '計算機', converters: 'コンバーター', home: 'ホーム', otherLang: '他の言語', related: '関連ツール' },
    ko: { calculators: '계산기', converters: '변환기', home: '홈', otherLang: '다른 언어', related: '관련 도구' },
    pt: { calculators: 'Calculadoras', converters: 'Conversores', home: 'Início', otherLang: 'Outros Idiomas', related: 'Ferramentas Relacionadas' },
    ru: { calculators: 'Калькуляторы', converters: 'Конвертеры', home: 'Главная', otherLang: 'Другие Языки', related: 'Связанные Инструменты' },
    ar: { calculators: 'آلات حاسبة', converters: 'محولات', home: 'الرئيسية', otherLang: 'لغات أخرى', related: 'أدوات ذات صلة' }
};

// 计算器翻译
const calcs = {
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
        ko: { title: '대출 계算기', desc: '대출 상환금과 조건을 계산' },
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

// 增强样式
const styles = `
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
.related-calculators {
    margin-top: 30px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;
}
.related-calculators h3 {
    color: #2196F3;
    margin-bottom: 15px;
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
}
.related-item a:hover {
    text-decoration: underline;
}
.related-item p {
    margin: 5px 0 0 0;
    color: #666;
    font-size: 0.9rem;
}
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

let totalProcessed = 0;

// 处理每种语言
for (const [langCode, langInfo] of Object.entries(languages)) {
    console.log('📝 处理语言: ' + langInfo.flag + ' ' + langInfo.name);
    
    // 处理首页
    const indexPath = path.join('generated_pages', langCode, 'index.html');
    if (fs.existsSync(indexPath)) {
        let content = fs.readFileSync(indexPath, 'utf8');
        
        // 替换页面标题
        content = content.replace('International Calculator', 'International ' + titles[langCode].calculators);
        content = content.replace('📊 Calculators', '📊 ' + titles[langCode].calculators);
        content = content.replace('🔄 Converters', '🔄 ' + titles[langCode].converters);
        
        // 更新计算器标题
        Object.keys(calcs).forEach(calcId => {
            if (calcs[calcId][langCode]) {
                content = content.replace(new RegExp('>' + calcs[calcId].en.title + '<', 'g'), '>' + calcs[calcId][langCode].title + '<');
                content = content.replace(new RegExp(calcs[calcId].en.desc, 'g'), calcs[calcId][langCode].desc);
            }
        });
        
        // 添加语言切换器
        let langLinks = '';
        Object.entries(languages).forEach(([code, info]) => {
            if (code !== langCode) {
                langLinks += '<a href="https://' + code + '.intlcalc.com" class="lang-link">' + info.flag + ' ' + info.name + '</a>';
            }
        });
        
        const langSwitcher = `
    <div class="language-switcher">
        <div class="current-lang">${langInfo.flag} ${langInfo.name}</div>
        <div class="other-languages">
            <div class="lang-dropdown">
                <span class="lang-toggle">🌐 ${titles[langCode].otherLang}</span>
                <div class="lang-menu">
                    ${langLinks}
                </div>
            </div>
        </div>
    </div>`;
        
        content = content.replace('<body>', '<body>' + langSwitcher);
        
        // 添加样式
        content = content.replace('</style>', styles + '</style>');
        
        fs.writeFileSync(indexPath, content, 'utf8');
        totalProcessed++;
    }
    
    // 处理计算器页面
    const calcTypes = [
        { folder: 'calc', items: ['age-calculator', 'basic-calculator', 'basic-math-calculator', 'bmi-calculator', 'interest-calculator', 'loan-calculator', 'percentage-calculator', 'scientific-calculator'] },
        { folder: 'convert', items: ['length-converter', 'temperature-converter'] }
    ];
    
    calcTypes.forEach(type => {
        type.items.forEach(calcId => {
            const calcPath = path.join('generated_pages', langCode, type.folder, calcId + '.html');
            if (fs.existsSync(calcPath)) {
                let content = fs.readFileSync(calcPath, 'utf8');
                
                const calcTrans = calcs[calcId][langCode];
                if (calcTrans) {
                    // 更新标题
                    content = content.replace(new RegExp('<title>[^<]+</title>'), '<title>' + calcTrans.title + '</title>');
                    content = content.replace(new RegExp('<h1[^>]*>[^<]+</h1>'), '<h1>' + calcTrans.title + '</h1>');
                    
                    // 更新描述
                    const descMatch = content.match(/content="[^"]+"/);
                    if (descMatch) {
                        content = content.replace(descMatch[0], 'content="' + calcTrans.desc + '"');
                    }
                    
                    // 添加语言切换器
                    let langLinks = '';
                    Object.entries(languages).forEach(([code, info]) => {
                        if (code !== langCode) {
                            langLinks += '<a href="https://' + code + '.intlcalc.com" class="lang-link">' + info.flag + ' ' + info.name + '</a>';
                        }
                    });
                    
                    const langSwitcher = `
    <div class="language-switcher">
        <div class="current-lang">${langInfo.flag} ${langInfo.name}</div>
        <div class="other-languages">
            <div class="lang-dropdown">
                <span class="lang-toggle">🌐 ${titles[langCode].otherLang}</span>
                <div class="lang-menu">
                    ${langLinks}
                </div>
            </div>
        </div>
    </div>`;
                    
                    content = content.replace(/<body[^>]*>/, '<body>' + langSwitcher);
                    
                    // 添加面包屑
                    const categoryText = type.folder === 'calc' ? titles[langCode].calculators : titles[langCode].converters;
                    const breadcrumb = `<nav class="breadcrumb">
        <a href="/">${titles[langCode].home}</a>
        <span class="separator">></span>
        <span class="category">${categoryText}</span>
        <span class="separator">></span>
        <span class="current">${calcTrans.title}</span>
    </nav>`;
                    
                    content = content.replace(/(<div class="[^"]*container[^"]*">)/, '$1' + breadcrumb);
                    
                    // 添加其他语言版本
                    let otherLangVersions = `
    <div class="other-language-versions">
        <h3>${titles[langCode].otherLang}</h3>
        <div class="lang-versions-grid">`;
                    
                    Object.entries(languages).forEach(([code, info]) => {
                        if (code !== langCode && calcs[calcId][code]) {
                            otherLangVersions += `
            <div class="lang-version">
                <a href="https://${code}.intlcalc.com/${type.folder}/${calcId}.html">
                    ${info.flag} ${calcs[calcId][code].title}
                </a>
            </div>`;
                        }
                    });
                    
                    otherLangVersions += `
        </div>
    </div>`;
                    
                    content = content.replace('</body>', otherLangVersions + '</body>');
                    
                    // 添加样式
                    content = content.replace('</style>', styles + '</style>');
                    
                    fs.writeFileSync(calcPath, content, 'utf8');
                }
                totalProcessed++;
            }
        });
    });
    
    console.log('✅ ' + langInfo.name + ' 完成');
}

console.log('\n🎉 多语言增强完成！');
console.log('📊 统计信息:');
console.log('   - 处理语言数量: ' + Object.keys(languages).length);
console.log('   - 处理页面总数: ' + totalProcessed);
console.log('\n✨ 新增功能:');
console.log('   ✅ 多语言页面标题和描述翻译');
console.log('   ✅ 页面顶部语言切换器');
console.log('   ✅ 面包屑导航');
console.log('   ✅ 其他语言版本链接');
console.log('   ✅ 响应式设计支持'); 