const fs = require('fs');
const path = require('path');

// 统一所有HTML文件中的登录按钮和注册按钮样式
function unifyAuthButtonsStyle() {
    const frontendDir = '.';
    let totalFiles = 0;
    let processedFiles = 0;
    let fixedLoginButtons = 0;
    let fixedRegisterButtons = 0;
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
            let hasLoginChanges = false;
            let hasRegisterChanges = false;

            // 1. 修复桌面端登录按钮样式
            const desktopLoginButtonRegex = /<button[^>]*?onclick="window\.location\.href='login\.html'"[^>]*?>[\s\S]*?<\/button>/;
            
            if (desktopLoginButtonRegex.test(content)) {
                content = content.replace(desktopLoginButtonRegex, match => {
                    // 提取按钮内的图标和文本
                    const iconMatch = match.match(/<i\s+class="([^"]+)"[^>]*>\s*<\/i>/);
                    const iconClass = iconMatch ? iconMatch[1] : 'fa fa-sign-in';
                    
                    // 创建一个全新的、正确的登录按钮
                    const newLoginButton = `<button class="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary/5 hover:text-primary transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/30 font-medium shadow-sm hover:shadow transform hover:-translate-y-0.5 active:translate-y-0" onclick="window.location.href='login.html'">
                <i class="${iconClass} mr-1"></i>登录
            </button>`;
                    
                    hasLoginChanges = true;
                    return newLoginButton;
                });
            }

            // 2. 修复桌面端注册按钮样式
            const desktopRegisterButtonRegex = /<button[^>]*?onclick="window\.location\.href='register\.html'"[^>]*?>[\s\S]*?<\/button>/;
            
            if (desktopRegisterButtonRegex.test(content)) {
                content = content.replace(desktopRegisterButtonRegex, match => {
                    // 提取按钮内的图标和文本
                    const iconMatch = match.match(/<i\s+class="([^"]+)"[^>]*>\s*<\/i>/);
                    const iconClass = iconMatch ? iconMatch[1] : 'fa fa-user-plus';
                    
                    // 创建一个全新的、正确的注册按钮
                    const newRegisterButton = `<button class="px-4 py-2 bg-gradient-to-r from-primary to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/30 font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0" onclick="window.location.href='register.html'">
                <i class="${iconClass} mr-2"></i>注册
            </button>`;
                    
                    hasRegisterChanges = true;
                    return newRegisterButton;
                });
            }

            // 3. 修复组件中使用class的登录按钮
            const componentLoginButtonRegex = /<button\s+class="[^>]*?login-button[^>]*?>[\s\S]*?<\/button>/;
            
            if (componentLoginButtonRegex.test(content)) {
                content = content.replace(componentLoginButtonRegex, match => {
                    // 提取按钮内的图标和文本
                    const iconMatch = match.match(/<i\s+class="([^"]+)"[^>]*>\s*<\/i>/);
                    const iconClass = iconMatch ? iconMatch[1] : 'fa fa-sign-in';
                    
                    // 确保使用完整的样式
                    const newLoginButton = `<button class="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary/5 hover:text-primary transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/30 font-medium shadow-sm hover:shadow transform hover:-translate-y-0.5 active:translate-y-0" onclick="window.location.href='login.html'">
                <i class="${iconClass} mr-1"></i>登录
            </button>`;
                    
                    hasLoginChanges = true;
                    return newLoginButton;
                });
            }

            // 4. 修复组件中使用class的注册按钮
            const componentRegisterButtonRegex = /<button\s+class="[^>]*?register-button[^>]*?>[\s\S]*?<\/button>/;
            
            if (componentRegisterButtonRegex.test(content)) {
                content = content.replace(componentRegisterButtonRegex, match => {
                    // 提取按钮内的图标和文本
                    const iconMatch = match.match(/<i\s+class="([^"]+)"[^>]*>\s*<\/i>/);
                    const iconClass = iconMatch ? iconMatch[1] : 'fa fa-user-plus';
                    
                    // 确保使用完整的样式
                    const newRegisterButton = `<button class="px-4 py-2 bg-gradient-to-r from-primary to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/30 font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0" onclick="window.location.href='register.html'">
                <i class="${iconClass} mr-2"></i>注册
            </button>`;
                    
                    hasRegisterChanges = true;
                    return newRegisterButton;
                });
            }

            // 5. 修复移动端导航菜单中的登录按钮 (button 类型)
            const mobileButtonLoginRegex = /<button[^>]*?onclick="window\.location\.href='login\.html'"[^>]*?>[\s\S]*?登录<\/button>/;
            
            if (mobileButtonLoginRegex.test(content)) {
                content = content.replace(mobileButtonLoginRegex, match => {
                    // 提取图标类
                    const iconMatch = match.match(/<i\s+class="([^"]+)"[^>]*>\s*<\/i>/);
                    const iconClass = iconMatch ? iconMatch[1] : 'fa fa-sign-in';
                    
                    // 为移动端按钮设置正确的样式
                    const newMobileLoginButton = `<button class="px-3 py-2 text-primary border border-primary rounded-lg hover:bg-primary/5 hover:text-primary transition-all duration-300 text-sm w-full" onclick="window.location.href='login.html'">
                        <i class="${iconClass} mr-1"></i>登录
                    </button>`;
                    
                    hasLoginChanges = true;
                    return newMobileLoginButton;
                });
            }

            // 6. 修复移动端导航菜单中的注册按钮 (button 类型)
            const mobileButtonRegisterRegex = /<button[^>]*?onclick="window\.location\.href='register\.html'"[^>]*?>[\s\S]*?注册<\/button>/;
            
            if (mobileButtonRegisterRegex.test(content)) {
                content = content.replace(mobileButtonRegisterRegex, match => {
                    // 提取图标类
                    const iconMatch = match.match(/<i\s+class="([^"]+)"[^>]*>\s*<\/i>/);
                    const iconClass = iconMatch ? iconMatch[1] : 'fa fa-user-plus';
                    
                    // 为移动端按钮设置正确的样式
                    const newMobileRegisterButton = `<button class="px-3 py-2 bg-gradient-to-r from-primary to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 text-sm w-full shadow-md hover:shadow-lg" onclick="window.location.href='register.html'">
                        <i class="${iconClass} mr-1"></i>注册
                    </button>`;
                    
                    hasRegisterChanges = true;
                    return newMobileRegisterButton;
                });
            }

            // 7. 修复移动端导航菜单中的登录按钮 (a 标签类型)
            const mobileLinkLoginRegex = /<a[^>]*?href="login\.html"[^>]*?>[\s\S]*?登录<\/a>/;
            
            if (mobileLinkLoginRegex.test(content)) {
                content = content.replace(mobileLinkLoginRegex, match => {
                    // 提取图标类
                    const iconMatch = match.match(/<i\s+class="([^"]+)"[^>]*>\s*<\/i>/);
                    const iconClass = iconMatch ? iconMatch[1] : 'fa fa-sign-in';
                    
                    // 为移动端链接按钮设置正确的样式
                    const newMobileLoginLink = `<a href="login.html" class="block px-4 py-3 text-primary border border-primary rounded-lg hover:bg-primary/5 hover:text-primary transition-all duration-300 text-sm w-full">
                        <i class="${iconClass} mr-2 w-5 text-center"></i>
                        登录
                    </a>`;
                    
                    hasLoginChanges = true;
                    return newMobileLoginLink;
                });
            }

            // 8. 修复移动端导航菜单中的注册按钮 (a 标签类型)
            const mobileLinkRegisterRegex = /<a[^>]*?href="register\.html"[^>]*?>[\s\S]*?注册<\/a>/;
            
            if (mobileLinkRegisterRegex.test(content)) {
                content = content.replace(mobileLinkRegisterRegex, match => {
                    // 提取图标类
                    const iconMatch = match.match(/<i\s+class="([^"]+)"[^>]*>\s*<\/i>/);
                    const iconClass = iconMatch ? iconMatch[1] : 'fa fa-user-plus';
                    
                    // 为移动端链接按钮设置正确的样式
                    const newMobileRegisterLink = `<a href="register.html" class="block px-4 py-3 bg-gradient-to-r from-primary to-indigo-600 text-white rounded-lg font-bold flex items-center transition-all duration-300 text-sm w-full shadow-md hover:shadow-lg">
                        <i class="${iconClass} mr-2 w-5 text-center"></i>
                        注册
                    </a>`;
                    
                    hasRegisterChanges = true;
                    return newMobileRegisterLink;
                });
            }

            if (hasLoginChanges || hasRegisterChanges) {
                fs.writeFileSync(filePath, content, 'utf8');
                if (hasLoginChanges) fixedLoginButtons++;
                if (hasRegisterChanges) fixedRegisterButtons++;
                console.log(`已修复: ${filePath} ${hasLoginChanges ? '(登录按钮)' : ''} ${hasRegisterChanges ? '(注册按钮)' : ''}`);
            }
            
            processedFiles++;
        } catch (error) {
            console.error(`处理文件出错 ${filePath}:`, error.message);
            errorFiles.push({ path: filePath, error: error.message });
        }
    }

    // 开始处理
    console.log('开始统一登录按钮和注册按钮样式...');
    processDirectory(frontendDir);
    
    // 输出统计信息
    console.log('\n统一完成！');
    console.log(`总计文件: ${totalFiles}`);
    console.log(`处理文件: ${processedFiles}`);
    console.log(`修复登录按钮: ${fixedLoginButtons}`);
    console.log(`修复注册按钮: ${fixedRegisterButtons}`);
    console.log(`错误文件: ${errorFiles.length}`);
    
    if (errorFiles.length > 0) {
        console.log('\n错误详情:');
        errorFiles.forEach(file => {
            console.log(`- ${file.path}: ${file.error}`);
        });
    }
}

// 执行统一
unifyAuthButtonsStyle();