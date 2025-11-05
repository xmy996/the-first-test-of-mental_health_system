const fs = require('fs');
const path = require('path');

// 修复导航栏注册按钮文字不可见的问题
function fixRegisterButtonText() {
    const frontendDir = '.';
    let totalFiles = 0;
    let processedFiles = 0;
    let fixedFiles = 0;
    let errorFiles = [];

    // 遍历前端目录中的所有HTML文件
    function processDirectory(directory) {
        const files = fs.readdirSync(directory);
        
        files.forEach(file => {
            const filePath = path.join(directory, file);
            const stats = fs.statSync(filePath);
            
            if (stats.isDirectory() && !filePath.includes('node_modules') && !filePath.includes('.git')) {
                processDirectory(filePath); // 递归处理子目录
            } else if (file.endsWith('.html')) {
                totalFiles++;
                processHTMLFile(filePath);
            }
        });
    }

    // 处理单个HTML文件
    function processHTMLFile(filePath) {
        try {
            let content = fs.readFileSync(filePath, 'utf8');
            let hasChanges = false;

            // 修复导航栏注册按钮文字颜色问题 - 确保text-white类存在且生效
            const registerButtonRegex = /<button[^>]*?onclick="window\.location\.href='register\.html'"[^>]*?>([\s\S]*?)注册<\/button>/;
            
            if (registerButtonRegex.test(content)) {
                // 确保按钮有text-white类，且调整样式确保文字清晰可见
                content = content.replace(registerButtonRegex, (match, icon) => {
                    // 确保包含text-white类，并且可以稍微调整内边距和字体大小以增强可读性
                    let newButton = match;
                    if (!newButton.includes('text-white')) {
                        newButton = newButton.replace('rounded-lg', 'text-white rounded-lg');
                    }
                    // 增强文字显示效果
                    if (!newButton.includes('font-bold')) {
                        newButton = newButton.replace('font-medium', 'font-bold');
                    }
                    // 确保图标和文字之间有足够间距
                    if (icon && !icon.includes('mr-2')) {
                        newButton = newButton.replace('mr-1', 'mr-2');
                    }
                    hasChanges = true;
                    return newButton;
                });
            }

            // 修复移动端导航菜单中的注册按钮
            const mobileRegisterButtonRegex = /<a[^>]*?href="register\.html"[^>]*?>([\s\S]*?)注册<\/a>/;
            
            if (mobileRegisterButtonRegex.test(content)) {
                content = content.replace(mobileRegisterButtonRegex, (match, icon) => {
                    let newButton = match;
                    // 确保移动端按钮文字也清晰可见
                    if (!newButton.includes('font-medium')) {
                        newButton = newButton.replace('rounded-lg', 'font-bold rounded-lg');
                    }
                    hasChanges = true;
                    return newButton;
                });
            }

            if (hasChanges) {
                fs.writeFileSync(filePath, content, 'utf8');
                fixedFiles++;
                console.log(`已修复: ${filePath}`);
            }
            
            processedFiles++;
        } catch (error) {
            console.error(`处理文件出错 ${filePath}:`, error.message);
            errorFiles.push({ path: filePath, error: error.message });
        }
    }

    // 开始处理
    console.log('开始修复导航栏注册按钮文字不可见问题...');
    processDirectory(frontendDir);
    
    // 输出统计信息
    console.log('\n修复完成！');
    console.log(`总计文件: ${totalFiles}`);
    console.log(`处理文件: ${processedFiles}`);
    console.log(`修复文件: ${fixedFiles}`);
    console.log(`错误文件: ${errorFiles.length}`);
    
    if (errorFiles.length > 0) {
        console.log('\n错误详情:');
        errorFiles.forEach(file => {
            console.log(`- ${file.path}: ${file.error}`);
        });
    }
}

// 执行修复
fixRegisterButtonText();