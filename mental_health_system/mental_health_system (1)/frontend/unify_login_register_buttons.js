const fs = require('fs');
const path = require('path');

// 要处理的文件列表
const filesToProcess = [
    'f:\\Desktop\\community_mental_health_center\\mental_health_system\\mental_health_system (1)\\frontend\\index.html',
    'f:\\Desktop\\community_mental_health_center\\mental_health_system\\mental_health_system (1)\\frontend\\register.html'
];

// 定义标准的登录按钮样式
const standardLoginButtonClass = 'px-4 py-2 text-primary border-2 border-primary rounded-lg hover:bg-primary/5 hover:text-primary transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/30 font-medium shadow-sm hover:shadow transform hover:-translate-y-0.5 active:translate-y-0';
const standardLoginButtonClassMobile = 'px-4 py-2.5 text-primary border-2 border-primary rounded-lg hover:bg-primary/5 hover:text-primary transition-all duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-primary/30';
const standardLoginButtonFormClass = 'block px-4 py-3 text-primary border-2 border-primary rounded-lg hover:bg-primary/5 hover:text-primary transition-all duration-300 text-sm w-full';

// 定义标准的注册按钮样式
const standardRegisterButtonClass = 'px-4 py-2 bg-gradient-to-r from-primary to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/30 font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0';
const standardRegisterButtonClassMobile = 'px-4 py-2.5 bg-gradient-to-r from-primary to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-primary/30';
const standardRegisterButtonFormClass = 'w-full py-3 bg-gradient-to-r from-primary to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0';

// 处理文件
filesToProcess.forEach(filePath => {
    try {
        console.log(`正在处理文件: ${filePath}`);
        let content = fs.readFileSync(filePath, 'utf8');
        let loginButtonsFixed = 0;
        let registerButtonsFixed = 0;
        
        // 1. 修复桌面端导航栏中的登录按钮
        const desktopLoginButtonRegex = /<button[^>]*class="([^"]*)"[^>]*onclick="window\.location\.href='login\.html'"[^>]*>/g;
        content = content.replace(desktopLoginButtonRegex, (match, classStr) => {
            if (classStr.includes('text-primary') && classStr.includes('border')) {
                loginButtonsFixed++;
                return match.replace(classStr, standardLoginButtonClass);
            }
            return match;
        });
        
        // 2. 修复桌面端导航栏中的注册按钮
        const desktopRegisterButtonRegex = /<button[^>]*class="([^"]*)"[^>]*onclick="window\.location\.href='register\.html'"[^>]*>/g;
        content = content.replace(desktopRegisterButtonRegex, (match, classStr) => {
            if (classStr.includes('bg-gradient-to-r') && classStr.includes('from-primary')) {
                registerButtonsFixed++;
                return match.replace(classStr, standardRegisterButtonClass);
            }
            return match;
        });
        
        // 3. 修复移动端菜单中的登录按钮
        const mobileLoginButtonRegex = /<button[^>]*class="([^"]*)"[^>]*onclick="window\.location\.href='login\.html'"[^>]*>\s*<i[^>]*fa-sign-in[^>]*><\/i>\s*登录\s*<\/button>/g;
        content = content.replace(mobileLoginButtonRegex, (match, classStr) => {
            if (classStr.includes('text-primary') && classStr.includes('border')) {
                loginButtonsFixed++;
                return `<button class="${standardLoginButtonClassMobile}" onclick="window.location.href='login.html'">
                    <i class="fa fa-sign-in mr-2"></i>登录
                </button>`;
            }
            return match;
        });
        
        // 4. 修复移动端菜单中的注册按钮
        const mobileRegisterButtonRegex = /<button[^>]*class="([^"]*)"[^>]*onclick="window\.location\.href='register\.html'"[^>]*>\s*<i[^>]*fa-user-plus[^>]*><\/i>\s*注册\s*<\/button>/g;
        content = content.replace(mobileRegisterButtonRegex, (match, classStr) => {
            if (classStr.includes('bg-gradient-to-r') && classStr.includes('from-primary')) {
                registerButtonsFixed++;
                return `<button class="${standardRegisterButtonClassMobile}" onclick="window.location.href='register.html'">
                    <i class="fa fa-user-plus mr-2"></i>注册
                </button>`;
            }
            return match;
        });
        
        // 5. 修复注册页面表单中的注册按钮
        const formRegisterButtonRegex = /<button[^>]*type="submit"[^>]*class="([^"]*)"[^>]*>\s*注册\s*<\/button>/g;
        content = content.replace(formRegisterButtonRegex, (match, classStr) => {
            if (classStr.includes('bg-gradient-to-r') && classStr.includes('from-primary')) {
                registerButtonsFixed++;
                return `<button type="submit" class="${standardRegisterButtonFormClass} animate-slide-up delay-600">注册</button>`;
            }
            return match;
        });
        
        // 6. 修复注册页面表单下方的登录按钮
        const formLoginLinkRegex = /<a[^>]*href="login\.html"[^>]*class="([^"]*)"[^>]*>/g;
        content = content.replace(formLoginLinkRegex, (match, classStr) => {
            if (classStr.includes('text-primary') && classStr.includes('border')) {
                loginButtonsFixed++;
                return match.replace(classStr, standardLoginButtonFormClass);
            }
            return match;
        });
        
        // 保存修改后的文件
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`文件 ${path.basename(filePath)} 已更新，修复了 ${loginButtonsFixed} 个登录按钮和 ${registerButtonsFixed} 个注册按钮`);
    } catch (error) {
        console.error(`处理文件 ${filePath} 时出错:`, error);
    }
});

console.log('所有文件处理完成');