const fs = require('fs');
const path = require('path');

// 🎨 现代设计系统 2024
const modernDesignSystem = `
/* 🌟 2024现代设计系统 - IntlCalc */

/* 1. CSS变量 - 设计token */
:root {
  /* 🎨 主色调 */
  --primary-color: #007AFF;
  --primary-dark: #0051D5;
  --primary-light: #40A9FF;
  
  /* 🌙 背景色系 */
  --bg-primary: #000000;
  --bg-secondary: #1C1C1E;
  --bg-tertiary: #2C2C2E;
  --bg-glass: rgba(28, 28, 30, 0.7);
  
  /* 🔘 按钮色系 */
  --btn-number: #333333;
  --btn-number-hover: #404040;
  --btn-operator: #FF9F0A;
  --btn-operator-hover: #FFB340;
  --btn-function: #A5A5A5;
  --btn-function-hover: #B8B8B8;
  
  /* 📝 文字色系 */
  --text-primary: #FFFFFF;
  --text-secondary: #8E8E93;
  --text-accent: #FF9F0A;
  
  /* 🎯 阴影系统 */
  --shadow-soft: 0 8px 32px rgba(0, 0, 0, 0.3);
  --shadow-medium: 0 16px 64px rgba(0, 0, 0, 0.4);
  --shadow-hard: 0 24px 96px rgba(0, 0, 0, 0.5);
  
  /* 🌈 渐变系统 */
  --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --gradient-glass: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
  --gradient-neomorph: linear-gradient(145deg, #2a2a2a, #1e1e1e);
  
  /* 📏 尺寸系统 */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  
  /* 🔤 字体系统 */
  --font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', monospace;
  
  /* 🎭 动画系统 */
  --transition-fast: 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-normal: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  
  /* 📱 断点系统 */
  --mobile: 480px;
  --tablet: 768px;
  --desktop: 1024px;
}

/* 2. 基础重置和全局样式 */
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-family);
  background: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.6;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  
  /* 🌟 动态背景 */
  background: radial-gradient(circle at 20% 80%, #2a2a2e 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, #1a1a2e 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, #0f0f23 0%, transparent 50%),
              var(--bg-primary);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-md);
}

/* 3. 🏗️ 主容器 - Glassmorphism */
.calculator-container {
  position: relative;
  width: 100%;
  max-width: 400px;
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  border-radius: 32px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: var(--shadow-medium);
  overflow: hidden;
  transition: var(--transition-normal);
  
  /* 🌟 Neomorphism效果 */
  box-shadow: 
    var(--shadow-medium),
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    inset 0 -1px 0 rgba(0, 0, 0, 0.2);
}

.calculator-container:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hard);
}

/* 4. 🎯 语言切换器 - 现代化 */
.language-switcher {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-lg) var(--space-xl);
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.current-lang {
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.lang-dropdown {
  position: relative;
}

.dropdown-btn {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  color: var(--text-primary);
  border: none;
  padding: 12px 20px;
  border-radius: 50px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: var(--transition-normal);
  box-shadow: 0 4px 20px rgba(0, 122, 255, 0.3);
  backdrop-filter: blur(10px);
  
  /* 🎯 微交互 */
  transform: scale(1);
}

.dropdown-btn:hover {
  transform: scale(1.05) translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 122, 255, 0.4);
}

.dropdown-btn:active {
  transform: scale(0.98);
}

/* 5. 📱 头部区域 */
.calculator-header {
  padding: var(--space-2xl) var(--space-xl);
  text-align: center;
  background: var(--gradient-glass);
  position: relative;
  overflow: hidden;
}

.calculator-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="1" fill="white" opacity="0.1"/><circle cx="80" cy="40" r="1.5" fill="white" opacity="0.08"/><circle cx="40" cy="80" r="0.8" fill="white" opacity="0.12"/></svg>');
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.calculator-header h1 {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: var(--space-md);
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
}

/* 6. 🖥️ 显示屏 - Apple风格 */
.calculator-display {
  padding: var(--space-xl);
  background: var(--bg-secondary);
  border-radius: 24px;
  margin: var(--space-lg);
  position: relative;
  overflow: hidden;
}

.display-input {
  width: 100%;
  height: 80px;
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 3rem;
  font-weight: 300;
  text-align: right;
  padding: var(--space-md);
  outline: none;
  
  /* 🎯 Apple风格文字效果 */
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: -0.02em;
}

.display-input::placeholder {
  color: var(--text-secondary);
  opacity: 0.6;
}

/* 7. 🔘 按钮系统 - Neomorphism + Apple */
.calculator-buttons {
  padding: var(--space-xl);
  display: grid;
  gap: var(--space-md);
}

.button-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-md);
}

.btn {
  height: 72px;
  border: none;
  border-radius: 50%;
  font-family: var(--font-family);
  font-size: 1.8rem;
  font-weight: 400;
  cursor: pointer;
  transition: var(--transition-fast);
  position: relative;
  overflow: hidden;
  
  /* 🌟 基础交互效果 */
  transform: scale(1);
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

/* 🔢 数字按钮 */
.btn-number {
  background: var(--btn-number);
  color: var(--text-primary);
  box-shadow: 
    0 8px 20px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.btn-number:hover {
  background: var(--btn-number-hover);
  transform: scale(1.05);
  box-shadow: 
    0 12px 30px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

.btn-number:active {
  transform: scale(0.95);
}

/* ➕ 运算符按钮 */
.btn-operator {
  background: var(--btn-operator);
  color: var(--text-primary);
  box-shadow: 
    0 8px 20px rgba(255, 159, 10, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.btn-operator:hover {
  background: var(--btn-operator-hover);
  transform: scale(1.05);
  box-shadow: 
    0 12px 30px rgba(255, 159, 10, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
}

/* 🎛️ 功能按钮 */
.btn-function {
  background: var(--btn-function);
  color: var(--bg-primary);
  box-shadow: 
    0 8px 20px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.btn-function:hover {
  background: var(--btn-function-hover);
  transform: scale(1.05);
}

/* 🔄 零按钮 - 特殊样式 */
.btn-zero {
  grid-column: span 2;
  border-radius: 36px;
  text-align: left;
  padding-left: var(--space-xl);
}

/* 8. 🎭 动画和微交互 */
.btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: var(--transition-fast);
}

.btn:active::before {
  width: 100%;
  height: 100%;
}

/* 9. 📱 响应式设计 */
@media (max-width: 480px) {
  .calculator-container {
    border-radius: 24px;
    margin: var(--space-sm);
  }
  
  .calculator-header h1 {
    font-size: 1.8rem;
  }
  
  .display-input {
    font-size: 2.5rem;
    height: 60px;
  }
  
  .btn {
    height: 64px;
    font-size: 1.6rem;
  }
  
  .calculator-buttons {
    padding: var(--space-lg);
  }
  
  .button-row {
    gap: var(--space-sm);
  }
}

@media (max-width: 360px) {
  .btn {
    height: 56px;
    font-size: 1.4rem;
  }
  
  .display-input {
    font-size: 2rem;
    height: 50px;
  }
}

/* 10. 🌙 暗色主题优化 */
@media (prefers-color-scheme: dark) {
  .calculator-container {
    background: rgba(28, 28, 30, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.05);
  }
}

/* 11. 🎯 辅助功能 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* 12. 🎨 加载动画 */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.calculator-container {
  animation: slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 13. 💫 特殊效果 */
.calculator-container::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  animation: shimmer 3s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
}

/* 14. 🎪 面包屑导航优化 */
.breadcrumb {
  background: rgba(255, 255, 255, 0.03);
  padding: var(--space-md) var(--space-xl);
  font-size: 0.85rem;
  color: var(--text-secondary);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.breadcrumb a {
  color: var(--primary-color);
  text-decoration: none;
  transition: var(--transition-fast);
}

.breadcrumb a:hover {
  color: var(--primary-light);
}

/* 15. 🌈 其他语言版本 & 相关工具 */
.other-languages, .related-tools {
  background: rgba(255, 255, 255, 0.03);
  padding: var(--space-xl);
  margin: var(--space-lg) 0;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
}

.other-languages h3, .related-tools h3 {
  color: var(--text-primary);
  margin-bottom: var(--space-lg);
  font-size: 1.1rem;
  font-weight: 600;
}

.language-links, .tool-links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md);
}

.language-links a, .tool-links a {
  display: inline-flex;
  align-items: center;
  padding: var(--space-sm) var(--space-lg);
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-primary);
  text-decoration: none;
  border-radius: 50px;
  font-size: 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: var(--transition-normal);
  gap: var(--space-sm);
  backdrop-filter: blur(5px);
}

.language-links a:hover, .tool-links a:hover {
  background: var(--primary-color);
  color: var(--text-primary);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 122, 255, 0.3);
}
`;

// 处理单个HTML文件，应用现代设计系统
function applyModernDesign(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // 替换旧的样式系统
        content = content.replace(
            /<style[^>]*id="Calculator-styles"[^>]*>[\s\S]*?<\/style>/,
            `<style id="Calculator-styles">${modernDesignSystem}</style>`
        );
        
        // 如果没找到Calculator-styles，则在head中添加
        if (!content.includes('id="Calculator-styles"')) {
            content = content.replace(
                '</head>',
                `<style id="Calculator-styles">${modernDesignSystem}</style>\n</head>`
            );
        }
        
        // 修复容器类名
        content = content.replace(/class="Calculator-container"/g, 'class="calculator-container"');
        content = content.replace(/class="Calculator-header"/g, 'class="calculator-header"');
        content = content.replace(/class="Calculator-main"/g, 'class="calculator-main"');
        content = content.replace(/class="Calculator-display"/g, 'class="calculator-display"');
        content = content.replace(/class="Calculator-buttons"/g, 'class="calculator-buttons"');
        content = content.replace(/class="Calculator-footer"/g, 'class="calculator-footer"');
        
        // 优化按钮类名
        content = content.replace(/class="btn btn-number"/g, 'class="btn btn-number"');
        content = content.replace(/class="btn btn-operator"/g, 'class="btn btn-operator"');
        content = content.replace(/class="btn btn-equals"/g, 'class="btn btn-operator"');
        content = content.replace(/class="btn btn-Clear"/g, 'class="btn btn-function"');
        content = content.replace(/class="btn btn-clear"/g, 'class="btn btn-function"');
        
        // 为0按钮添加特殊类
        content = content.replace(
            /<button[^>]*class="btn btn-number"[^>]*>0<\/button>/,
            '<button class="btn btn-number btn-zero" onclick="appendNumber(\'0\')">0</button>'
        );
        
        // 添加现代化的meta标签
        if (!content.includes('theme-color')) {
            content = content.replace(
                '<meta name="viewport"',
                '<meta name="theme-color" content="#007AFF">\n    <meta name="apple-mobile-web-app-capable" content="yes">\n    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">\n    <meta name="viewport"'
            );
        }
        
        // 优化字体加载
        if (!content.includes('preconnect')) {
            content = content.replace(
                '<meta charset="UTF-8">',
                '<meta charset="UTF-8">\n    <link rel="preconnect" href="https://fonts.googleapis.com">\n    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
            );
        }
        
        fs.writeFileSync(filePath, content, 'utf8');
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
            } else if (path.extname(item) === '.html') {
                if (applyModernDesign(itemPath)) {
                    processedCount++;
                    console.log(`✨ 现代化完成: ${path.relative(dirPath, itemPath)}`);
                }
            }
        }
    }
    
    processDir(dirPath);
    return processedCount;
}

// 主程序
console.log('🚀 开始应用2024现代设计系统...\n');

let totalProcessed = 0;

// 处理所有语言目录
const languageDirs = ['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko', 'pt', 'ru', 'ar'];

for (const lang of languageDirs) {
    const langPath = path.join('generated_pages', lang);
    if (fs.existsSync(langPath)) {
        console.log(`🌍 现代化 ${lang} 语言页面...`);
        const count = processDirectory(langPath);
        totalProcessed += count;
        console.log(`📊 ${lang}: 现代化了 ${count} 个文件\n`);
    }
}

// 处理主站
const mainSitePath = 'main_site';
if (fs.existsSync(mainSitePath)) {
    console.log('🏠 现代化主站页面...');
    const count = processDirectory(mainSitePath);
    totalProcessed += count;
    console.log(`📊 主站: 现代化了 ${count} 个文件\n`);
}

console.log('🎉 现代设计系统应用完成！');
console.log(`📈 总共现代化了 ${totalProcessed} 个页面`);
console.log('\n✨ 新设计系统特性:');
console.log('   🌟 Neomorphism (新拟物化设计)');
console.log('   💎 Glassmorphism (毛玻璃效果)');
console.log('   🍎 Apple风格设计语言');
console.log('   🎭 高级微交互动画');
console.log('   📱 完美响应式设计');
console.log('   🌙 智能暗色主题');
console.log('   ⚡ 性能优化的CSS');
console.log('   🎯 无障碍功能支持');
console.log('\n🎨 视觉特性:');
console.log('   • SF Pro Display 字体系统');
console.log('   • 渐变背景动画');
console.log('   • 3D按钮效果');
console.log('   • 流畅过渡动画');
console.log('   • 现代配色方案');
console.log('   • 毛玻璃半透明效果'); 