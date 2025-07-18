const fs = require('fs');
const path = require('path');

// 现代化的CSS样式
const modernCSS = `
/* 现代化基础样式 */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    color: #333;
    line-height: 1.6;
}

/* 语言切换器样式 */
.language-switcher {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    padding: 15px 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.current-lang {
    font-weight: 600;
    font-size: 1.1rem;
    color: #2196F3;
    display: flex;
    align-items: center;
    gap: 8px;
}

.lang-dropdown {
    position: relative;
}

.dropdown-btn {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 25px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.dropdown-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    background: white;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    min-width: 200px;
    z-index: 1000;
    padding: 10px 0;
    margin-top: 5px;
}

.dropdown-menu a {
    display: flex;
    align-items: center;
    padding: 12px 20px;
    text-decoration: none;
    color: #333;
    font-size: 0.95rem;
    transition: background 0.2s ease;
    gap: 10px;
}

.dropdown-menu a:hover {
    background: #f8f9fa;
}

/* 主容器样式 */
.Calculator-container {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 24px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    max-width: 500px;
    width: 100%;
    margin: 20px;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

/* 页面头部样式 */
.Calculator-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 30px 25px;
    text-align: center;
    position: relative;
}

.Calculator-header::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="white" opacity="0.1"/><circle cx="80" cy="40" r="1" fill="white" opacity="0.1"/><circle cx="40" cy="80" r="1.5" fill="white" opacity="0.1"/></svg>');
    pointer-events: none;
}

.Calculator-header h1 {
    font-size: 2rem;
    margin-bottom: 10px;
    font-weight: 700;
    position: relative;
}

.Calculator-header .description {
    opacity: 0.9;
    font-size: 1rem;
    font-weight: 400;
    position: relative;
}

/* 面包屑导航 */
.breadcrumb {
    background: rgba(248, 249, 250, 0.8);
    padding: 15px 25px;
    font-size: 0.9rem;
    color: #666;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.breadcrumb a {
    color: #2196F3;
    text-decoration: none;
    transition: color 0.2s ease;
}

.breadcrumb a:hover {
    color: #1976D2;
}

/* 主内容区域 */
.Calculator-main {
    padding: 35px 30px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 249, 250, 0.8) 100%);
}

/* 计算器显示屏 */
.Calculator-display {
    margin-bottom: 25px;
}

.display-input {
    width: 100%;
    height: 80px;
    font-size: 2.2rem;
    text-align: right;
    padding: 20px;
    border: 2px solid rgba(102, 126, 234, 0.1);
    border-radius: 15px;
    background: white;
    box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.05);
    font-weight: 500;
    color: #333;
    transition: border-color 0.3s ease;
}

.display-input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.05), 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* 按钮样式 */
.Calculator-buttons {
    display: grid;
    gap: 12px;
}

.button-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
}

.btn {
    height: 65px;
    border: none;
    border-radius: 15px;
    font-size: 1.3rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.btn:active {
    transform: translateY(-1px);
}

.btn-number {
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    color: #333;
    border: 2px solid rgba(102, 126, 234, 0.1);
}

.btn-number:hover {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-color: rgba(102, 126, 234, 0.2);
}

.btn-operator {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.btn-operator:hover {
    background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
}

.btn-equals {
    background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
    color: white;
}

.btn-equals:hover {
    background: linear-gradient(135deg, #228b3e 0%, #1ba085 100%);
}

.btn-clear {
    background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%);
    color: white;
}

.btn-clear:hover {
    background: linear-gradient(135deg, #c82333 0%, #e8610e 100%);
}

/* 输入区域样式 */
.input-group {
    margin-bottom: 20px;
}

.input-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #333;
    font-size: 0.95rem;
}

.input-group input,
.input-group select {
    width: 100%;
    padding: 15px;
    border: 2px solid rgba(102, 126, 234, 0.1);
    border-radius: 12px;
    background: white;
    font-size: 1rem;
    color: #333;
    transition: all 0.3s ease;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.input-group input:focus,
.input-group select:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05), 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* 结果显示 */
.result-display {
    background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
    padding: 25px;
    border-radius: 15px;
    margin: 20px 0;
    border: 1px solid rgba(102, 126, 234, 0.1);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.result-display h3 {
    color: #2196F3;
    margin-bottom: 10px;
    font-size: 1.2rem;
}

.result-value {
    font-size: 1.8rem;
    font-weight: 700;
    color: #333;
}

/* 页脚样式 */
.Calculator-footer {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    padding: 20px;
    text-align: center;
    font-size: 0.85rem;
    color: #666;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
}

/* 其他语言版本链接 */
.other-languages, .related-tools {
    background: rgba(248, 249, 250, 0.8);
    padding: 25px;
    margin: 20px 0;
    border-radius: 15px;
    border: 1px solid rgba(0, 0, 0, 0.05);
}

.other-languages h3, .related-tools h3 {
    color: #333;
    margin-bottom: 15px;
    font-size: 1.1rem;
    font-weight: 600;
}

.language-links, .tool-links {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.language-links a, .tool-links a {
    display: inline-flex;
    align-items: center;
    padding: 8px 15px;
    background: white;
    color: #2196F3;
    text-decoration: none;
    border-radius: 20px;
    font-size: 0.9rem;
    border: 1px solid rgba(33, 150, 243, 0.2);
    transition: all 0.3s ease;
    gap: 5px;
}

.language-links a:hover, .tool-links a:hover {
    background: #2196F3;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(33, 150, 243, 0.3);
}

/* 响应式设计 */
@media (max-width: 768px) {
    .Calculator-container {
        margin: 10px;
        border-radius: 20px;
    }
    
    .Calculator-main {
        padding: 25px 20px;
    }
    
    .Calculator-header {
        padding: 25px 20px;
    }
    
    .Calculator-header h1 {
        font-size: 1.6rem;
    }
    
    .btn {
        height: 55px;
        font-size: 1.1rem;
    }
    
    .display-input {
        font-size: 1.8rem;
        height: 70px;
        padding: 15px;
    }
    
    .language-switcher {
        flex-direction: column;
        gap: 10px;
        text-align: center;
    }
}

@media (max-width: 480px) {
    .Calculator-header h1 {
        font-size: 1.4rem;
    }
    
    .btn {
        height: 50px;
        font-size: 1rem;
    }
    
    .display-input {
        font-size: 1.5rem;
        height: 60px;
    }
    
    .button-row {
        gap: 8px;
    }
    
    .Calculator-buttons {
        gap: 8px;
    }
}

/* 动画效果 */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.Calculator-container {
    animation: fadeIn 0.6s ease-out;
}

/* 暗色主题支持 */
@media (prefers-color-scheme: dark) {
    body {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    }
    
    .Calculator-container {
        background: rgba(30, 30, 30, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .Calculator-main {
        background: linear-gradient(135deg, rgba(30, 30, 30, 0.9) 0%, rgba(40, 40, 40, 0.8) 100%);
        color: #fff;
    }
    
    .display-input {
        background: rgba(40, 40, 40, 0.8);
        color: #fff;
        border-color: rgba(255, 255, 255, 0.1);
    }
    
    .btn-number {
        background: linear-gradient(135deg, rgba(60, 60, 60, 0.9) 0%, rgba(50, 50, 50, 0.9) 100%);
        color: #fff;
        border-color: rgba(255, 255, 255, 0.1);
    }
}
`;

// 处理单个HTML文件
function beautifyHtmlFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // 替换旧的样式标签内容
        content = content.replace(
            /<style[^>]*id="Calculator-styles"[^>]*>[\s\S]*?<\/style>/,
            `<style id="Calculator-styles">${modernCSS}</style>`
        );
        
        // 如果没找到Calculator-styles，则在head中添加
        if (!content.includes('id="Calculator-styles"')) {
            content = content.replace(
                '</head>',
                `<style id="Calculator-styles">${modernCSS}</style>\n</head>`
            );
        }
        
        // 修复lang属性
        content = content.replace(/lang="zh-CN"/, 'lang="en"');
        
        // 添加一些现代化的meta标签
        if (!content.includes('theme-color')) {
            content = content.replace(
                '<meta name="viewport"',
                '<meta name="theme-color" content="#667eea">\n    <meta name="viewport"'
            );
        }
        
        fs.writeFileSync(filePath, content, 'utf8');
        return true;
    } catch (error) {
        console.error(`处理文件 ${filePath} 时出错:`, error.message);
        return false;
    }
}

// 递归处理目录中的所有HTML文件
function processDirectory(dirPath) {
    let processedCount = 0;
    
    function processDir(currentPath) {
        const items = fs.readdirSync(currentPath);
        
        for (const item of items) {
            const itemPath = path.join(currentPath, item);
            const stat = fs.statSync(itemPath);
            
            if (stat.isDirectory()) {
                processDir(itemPath);
            } else if (path.extname(item) === '.html') {
                if (beautifyHtmlFile(itemPath)) {
                    processedCount++;
                    console.log(`✅ 美化完成: ${path.relative(dirPath, itemPath)}`);
                }
            }
        }
    }
    
    processDir(dirPath);
    return processedCount;
}

// 主程序
console.log('🎨 开始美化界面...\n');

let totalProcessed = 0;

// 处理所有语言目录
const languageDirs = ['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko', 'pt', 'ru', 'ar'];

for (const lang of languageDirs) {
    const langPath = path.join('generated_pages', lang);
    if (fs.existsSync(langPath)) {
        console.log(`🌍 处理 ${lang} 语言页面...`);
        const count = processDirectory(langPath);
        totalProcessed += count;
        console.log(`📊 ${lang}: 处理了 ${count} 个文件\n`);
    }
}

// 处理主站
const mainSitePath = 'main_site';
if (fs.existsSync(mainSitePath)) {
    console.log('🏠 处理主站页面...');
    const count = processDirectory(mainSitePath);
    totalProcessed += count;
    console.log(`📊 主站: 处理了 ${count} 个文件\n`);
}

console.log('🎉 界面美化完成！');
console.log(`📈 总共美化了 ${totalProcessed} 个页面`);
console.log('\n✨ 新的界面特性:');
console.log('   🎨 现代化的渐变设计');
console.log('   📱 完全响应式布局');
console.log('   🌙 暗色主题支持');
console.log('   ✨ 流畅的动画效果');
console.log('   🎯 改进的用户体验');
console.log('   🔧 优化的按钮和输入框'); 