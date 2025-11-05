// 统一所有页面样式与图1一致
const fs = require('fs');
const path = require('path');

// 获取frontend目录下所有HTML文件
function getHtmlFiles(dir, files = []) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stats = fs.statSync(fullPath);
        
        if (stats.isDirectory() && !item.startsWith('.') && item !== 'node_modules' && item !== 'components') {
            getHtmlFiles(fullPath, files);
        } else if (stats.isFile() && path.extname(item) === '.html' && !fullPath.includes('components/')) {
            files.push(fullPath);
        }
    }
    
    return files;
}

const htmlFiles = getHtmlFiles(__dirname);
console.log(`找到 ${htmlFiles.length} 个HTML文件需要统一样式`);

// 统一的CSS样式
const unifiedStyles = `
    /* 全局样式重置 */
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    
    /* 全局颜色变量 */
    :root {
        --primary-color: #6366f1;
        --secondary-color: #8b5cf6;
        --text-primary: #1e293b;
        --text-secondary: #475569;
        --bg-primary: #ffffff;
        --bg-secondary: #f8fafc;
        --border-color: #e2e8f0;
    }
    
    body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
        color: var(--text-primary);
        background-color: var(--bg-primary);
    }
    
    /* 统一按钮样式 */
    button {
        font-family: inherit;
        cursor: pointer;
        transition: all 0.3s ease;
        border: none;
        outline: none;
    }
    
    /* 主按钮样式 - 注册按钮 */
    .btn-primary {
        background-color: var(--secondary-color);
        color: white;
        border-radius: 8px;
        padding: 8px 16px;
        font-weight: 500;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
    }
    
    .btn-primary:hover {
        background-color: #7c3aed;
        transform: translateY(-1px);
        box-shadow: 0 4px 6px -1px rgba(139, 92, 246, 0.2);
    }
    
    /* 次要按钮样式 - 登录按钮 */
    .btn-secondary {
        background-color: transparent;
        color: var(--primary-color);
        border: 1px solid var(--primary-color);
        border-radius: 8px;
        padding: 8px 16px;
        font-weight: 500;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
    }
    
    .btn-secondary:hover {
        background-color: rgba(99, 102, 241, 0.05);
        transform: translateY(-1px);
    }
    
    /* 导航栏样式 */
    nav {
        background-color: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(10px);
        border-bottom: 1px solid var(--border-color);
    }
    
    /* 响应式设计 */
    @media (max-width: 768px) {
        .btn-primary,
        .btn-secondary {
            padding: 6px 12px;
            font-size: 0.875rem;
        }
    }
    
    /* 卡片样式 */
    .card {
        background-color: white;
        border-radius: 12px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        padding: 1.5rem;
    }
    
    /* 输入框样式 */
    input,
    textarea,
    select {
        font-family: inherit;
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 8px 12px;
        transition: border-color 0.3s ease;
    }
    
    input:focus,
    textarea:focus,
    select:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }
`;

// 确保所有页面都有统一的字体图标引用
const fontAwesomeLink = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">';

let updatedCount = 0;

// 更新每个HTML文件
htmlFiles.forEach(filePath => {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let updatedContent = content;
        let isUpdated = false;
        
        // 添加Font Awesome引用（如果不存在）
        if (!content.includes('font-awesome.min.css')) {
            if (content.includes('</head>')) {
                updatedContent = content.replace('</head>', `${fontAwesomeLink}\n</head>`);
                isUpdated = true;
            }
        }
        
        // 添加统一样式（如果不存在）
        if (!content.includes('/* 全局颜色变量 */')) {
            if (content.includes('</head>')) {
                updatedContent = updatedContent.replace('</head>', `<style>\n${unifiedStyles}\n</style>\n</head>`);
                isUpdated = true;
            }
        }
        
        // 更新页面标题为"心社区 - 心理健康支持平台"
        if (content.includes('<title>')) {
            const titleRegex = /<title>.*?<\/title>/;
            updatedContent = updatedContent.replace(titleRegex, '<title>心社区 - 心理健康支持平台</title>');
            isUpdated = true;
        }
        
        // 标准化按钮类名
        if (content.includes('class="btn ')) {
            updatedContent = updatedContent
                .replace(/class="btn btn-primary"/g, 'class="btn-primary"')
                .replace(/class="btn btn-secondary"/g, 'class="btn-secondary"');
            isUpdated = true;
        }
        
        // 更新带有"登录"文字的按钮
        const loginBtnRegex = /<button[^>]*>.*?登录.*?<\/button>/g;
        if (loginBtnRegex.test(content)) {
            updatedContent = updatedContent.replace(loginBtnRegex, match => {
                if (!match.includes('btn-secondary')) {
                    return match.replace('<button', '<button class="btn-secondary"');
                }
                return match;
            });
            isUpdated = true;
        }
        
        // 更新带有"注册"文字的按钮
        const registerBtnRegex = /<button[^>]*>.*?注册.*?<\/button>/g;
        if (registerBtnRegex.test(content)) {
            updatedContent = updatedContent.replace(registerBtnRegex, match => {
                if (!match.includes('btn-primary')) {
                    return match.replace('<button', '<button class="btn-primary"');
                }
                return match;
            });
            isUpdated = true;
        }
        
        if (isUpdated && updatedContent !== content) {
            fs.writeFileSync(filePath, updatedContent, 'utf8');
            updatedCount++;
            console.log(`已更新样式: ${path.basename(filePath)}`);
        }
    } catch (err) {
        console.error(`处理文件 ${path.basename(filePath)} 失败:`, err);
    }
});

console.log(`\n样式统一完成！共更新 ${updatedCount} 个文件。`);
console.log('所有页面已统一为图1的样式，包含：');
console.log('- 统一的颜色方案');
console.log('- 标准的按钮样式（登录按钮：蓝色边框，注册按钮：紫色背景）');
console.log('- 响应式设计');
console.log('- 统一的字体和输入框样式');