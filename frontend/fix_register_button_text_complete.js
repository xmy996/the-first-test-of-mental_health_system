const fs = require('fs');
const path = require('path');

// 完全修复导航栏注册按钮文字不可见的问题
function fixRegisterButtonTextComplete() {
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

            // 方案1: 直接替换注册按钮的整个样式字符串，确保使用正确的类和属性
            const registerButtonComprehensiveRegex = /<button[^>]*?onclick="window\.location\.href='register\.html'"[^>]*?>[\s\S]*?<\/button>/;
            
            if (registerButtonComprehensiveRegex.test(content)) {
                content = content.replace(registerButtonComprehensiveRegex, match => {
                    // 提取按钮内的图标和文本
                    const iconMatch = match.match(/<i\s+class="([^"]+)"[^>]*>\s*<\/i>/);
                    const iconClass = iconMatch ? iconMatch[1] : 'fa fa-user-plus';
                    
                    // 创建一个全新的、正确的注册按钮
                    const newRegisterButton = `<button class="px-4 py-2 bg-gradient-to-r from-primary to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/30 font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0" onclick="window.location.href='register.html'">
                <i class="${iconClass} mr-2"></i>注册
            </button>`;
                    
                    hasChanges = true;
                    return newRegisterButton;
                });
            }

            // 方案2: 修复组件中使用class="auth-button register-button"的注册按钮
            const componentRegisterButtonRegex = /<button\s+class="auth-button register-button"[^>]*?>[\s\S]*?<\/button>/;
            
            if (componentRegisterButtonRegex.test(content)) {
                content = content.replace(componentRegisterButtonRegex, match => {
                    // 提取按钮内的图标和文本
                    const iconMatch = match.match(/<i\s+class="([^"]+)"[^>]*>\s*<\/i>/);
                    const iconClass = iconMatch ? iconMatch[1] : 'fa fa-user-plus';
                    
                    // 确保使用完整的样式，而不仅仅是class引用
                    const newRegisterButton = `<button class="px-4 py-2 bg-gradient-to-r from-primary to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/30 font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0" onclick="window.location.href='register.html'">
                <i class="${iconClass} mr-2"></i>注册
            </button>`;
                    
                    hasChanges = true;
                    return newRegisterButton;
                });
            }

            // 方案3: 修复移动端导航菜单中的注册按钮
            const mobileRegisterButtonRegex = /<a[^>]*?href="register\.html"[^>]*?>[\s\S]*?注册<\/a>/;
            
            if (mobileRegisterButtonRegex.test(content)) {
                content = content.replace(mobileRegisterButtonRegex, match => {
                    // 提取图标类
                    const iconMatch = match.match(/<i\s+class="([^"]+)"[^>]*>\s*<\/i>/);
                    const iconClass = iconMatch ? iconMatch[1] : 'fa fa-user-plus';
                    
                    // 为移动端按钮设置正确的样式
                    const newMobileRegisterButton = `<a href="register.html" class="block px-4 py-3 bg-gradient-to-r from-primary to-indigo-600 text-white rounded-lg font-bold flex items-center transition-all duration-300">
                <i class="${iconClass} mr-2 w-5 text-center"></i>
                注册
            </a>`;
                    
                    hasChanges = true;
                    return newMobileRegisterButton;
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
    console.log('开始完全修复导航栏注册按钮文字不可见问题...');
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
fixRegisterButtonTextComplete();