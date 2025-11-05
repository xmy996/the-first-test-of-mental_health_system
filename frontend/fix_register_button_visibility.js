const fs = require('fs');
const path = require('path');

// 要处理的文件列表
const filesToProcess = [
    'f:\\Desktop\\community_mental_health_center\\mental_health_system\\mental_health_system (1)\\frontend\\index.html',
    'f:\\Desktop\\community_mental_health_center\\mental_health_system\\mental_health_system (1)\\frontend\\register.html'
];

// 定义新的注册按钮样式（使用深色文字和增强的视觉效果）
const newRegisterButtonClass = 'px-4 py-2.5 bg-gradient-to-r from-primary to-indigo-600 text-indigo-900 rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-primary/30';
const newRegisterButtonClassMobile = 'px-4 py-2.5 bg-gradient-to-r from-primary to-indigo-600 text-indigo-900 rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 font-bold shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/30';
const newRegisterButtonFormClass = 'w-full py-3 bg-gradient-to-r from-primary to-indigo-600 text-indigo-900 rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0';

// 处理文件
filesToProcess.forEach(filePath => {
    try {
        console.log(`正在处理文件: ${filePath}`);
        let content = fs.readFileSync(filePath, 'utf8');
        let registerButtonsFixed = 0;
        
        // 1. 修复桌面端导航栏中的注册按钮
        const desktopRegisterButtonRegex = /<button[^>]*class="([^"]*)"[^>]*onclick="window\.location\.href='register\.html'"[^>]*>/g;
        content = content.replace(desktopRegisterButtonRegex, (match, classStr) => {
            if (classStr.includes('bg-gradient-to-r') && classStr.includes('from-primary')) {
                registerButtonsFixed++;
                return match.replace(classStr, newRegisterButtonClass);
            }
            return match;
        });
        
        // 2. 修复移动端菜单中的注册按钮
        const mobileRegisterButtonRegex = /<button[^>]*class="([^"]*)"[^>]*onclick="window\.location\.href='register\.html'"[^>]*>\s*<i[^>]*fa-user-plus[^>]*><\/i>\s*注册\s*<\/button>/g;
        content = content.replace(mobileRegisterButtonRegex, (match, classStr) => {
            if (classStr.includes('bg-gradient-to-r') && classStr.includes('from-primary')) {
                registerButtonsFixed++;
                return `<button class="${newRegisterButtonClassMobile}" onclick="window.location.href='register.html'">
                    <i class="fa fa-user-plus mr-2"></i>注册
                </button>`;
            }
            return match;
        });
        
        // 3. 修复注册页面表单中的注册按钮
        const formRegisterButtonRegex = /<button[^>]*type="submit"[^>]*class="([^"]*)"[^>]*>\s*注册\s*<\/button>/g;
        content = content.replace(formRegisterButtonRegex, (match, classStr) => {
            if (classStr.includes('bg-gradient-to-r') && classStr.includes('from-primary')) {
                registerButtonsFixed++;
                return `<button type="submit" class="${newRegisterButtonFormClass} animate-slide-up delay-600">注册</button>`;
            }
            return match;
        });
        
        // 保存修改后的文件
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`文件 ${path.basename(filePath)} 已更新，修复了 ${registerButtonsFixed} 个注册按钮的可见性`);
    } catch (error) {
        console.error(`处理文件 ${filePath} 时出错:`, error);
    }
});

console.log('所有文件处理完成');