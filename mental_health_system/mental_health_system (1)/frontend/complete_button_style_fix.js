const fs = require('fs');

// 定义正确的按钮样式
const correctLoginButtonClass = 'px-4 py-2.5 text-primary border-2 border-primary rounded-lg hover:bg-primary/5 hover:text-primary transition-all duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-primary/30';
const correctRegisterButtonClass = 'px-4 py-2.5 bg-gradient-to-r from-primary to-indigo-600 text-indigo-900 rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-primary/30';
const correctFormRegisterButtonClass = 'w-full py-3 bg-gradient-to-r from-primary to-indigo-600 text-indigo-900 rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0';

// 重写注册页面的所有按钮
function rewriteRegisterPageButtons() {
    const registerFilePath = 'f:\\Desktop\\community_mental_health_center\\mental_health_system\\mental_health_system (1)\\frontend\\register.html';
    
    try {
        let content = fs.readFileSync(registerFilePath, 'utf8');
        let changesMade = 0;
        
        console.log('开始重写注册页面按钮样式...');
        
        // 1. 完全替换桌面端登录按钮
        const desktopLoginButtonHTML = `                <button class="${correctLoginButtonClass}" onclick="window.location.href='login.html'">
                    <i class="fa fa-sign-in mr-2"></i>登录
                </button>`;
        content = content.replace(/<button[^>]*onclick="window\.location\.href='login\.html'"[^>]*>\s*<i[^>]*fa-sign-in[^>]*><\/i>\s*登录\s*<\/button>/g, (match) => {
            // 只替换桌面端导航栏中的按钮
            if (content.indexOf(match) < content.indexOf('id="mobile-menu"')) {
                changesMade++;
                console.log('已替换桌面端登录按钮');
                return desktopLoginButtonHTML;
            }
            return match;
        });
        
        // 2. 完全替换桌面端注册按钮
        const desktopRegisterButtonHTML = `                <button class="${correctRegisterButtonClass}" onclick="window.location.href='register.html'">
                    <i class="fa fa-user-plus mr-2"></i>注册
                </button>`;
        content = content.replace(/<button[^>]*onclick="window\.location\.href='register\.html'"[^>]*>\s*<i[^>]*fa-user-plus[^>]*><\/i>\s*注册\s*<\/button>/g, (match) => {
            // 只替换桌面端导航栏中的按钮
            if (content.indexOf(match) < content.indexOf('id="mobile-menu"')) {
                changesMade++;
                console.log('已替换桌面端注册按钮');
                return desktopRegisterButtonHTML;
            }
            return match;
        });
        
        // 3. 完全替换移动端登录按钮
        const mobileLoginButtonHTML = `                <button class="${correctLoginButtonClass}" onclick="window.location.href='login.html'">
                    <i class="fa fa-sign-in mr-2"></i>登录
                </button>`;
        const mobileMenuRegex = /<div id="mobile-menu"[^>]*>[\s\S]*?<\/div>/;
        content = content.replace(mobileMenuRegex, (match) => {
            const newMatch = match.replace(/<button[^>]*onclick="window\.location\.href='login\.html'"[^>]*>\s*<i[^>]*fa-sign-in[^>]*><\/i>\s*登录\s*<\/button>/, mobileLoginButtonHTML);
            if (newMatch !== match) {
                changesMade++;
                console.log('已替换移动端登录按钮');
            }
            return newMatch;
        });
        
        // 4. 完全替换移动端注册按钮
        const mobileRegisterButtonHTML = `                <button class="${correctRegisterButtonClass}" onclick="window.location.href='register.html'">
                    <i class="fa fa-user-plus mr-2"></i>注册
                </button>`;
        content = content.replace(mobileMenuRegex, (match) => {
            const newMatch = match.replace(/<button[^>]*onclick="window\.location\.href='register\.html'"[^>]*>\s*<i[^>]*fa-user-plus[^>]*><\/i>\s*注册\s*<\/button>/, mobileRegisterButtonHTML);
            if (newMatch !== match) {
                changesMade++;
                console.log('已替换移动端注册按钮');
            }
            return newMatch;
        });
        
        // 5. 替换表单提交按钮
        const formRegisterButtonHTML = `                            <button type="submit" class="${correctFormRegisterButtonClass} animate-slide-up delay-600">注册</button>`;
        content = content.replace(/<button[^>]*type="submit"[^>]*>\s*注册\s*<\/button>/, formRegisterButtonHTML);
        changesMade++;
        console.log('已替换表单提交按钮');
        
        // 6. 替换表单底部登录链接按钮
        const formLoginLinkHTML = `                                <a class="${correctLoginButtonClass}" href="login.html">
                    <i class="fa fa-sign-in mr-2"></i>登录
                </a>`;
        content = content.replace(/<a[^>]*href="login\.html"[^>]*>\s*<i[^>]*fa-sign-in[^>]*><\/i>\s*登录\s*<\/a>/, formLoginLinkHTML);
        changesMade++;
        console.log('已替换表单底部登录链接按钮');
        
        // 强制使用标准的HTML结构和格式
        content = forceStandardButtonFormat(content);
        
        // 保存修改后的文件
        fs.writeFileSync(registerFilePath, content, 'utf8');
        console.log(`注册页面按钮样式重写完成，共修改了 ${changesMade} 处`);
        
    } catch (error) {
        console.error('重写按钮样式时出错:', error);
    }
}

// 强制使用标准的HTML结构和格式
function forceStandardButtonFormat(content) {
    // 确保按钮有正确的圆角、阴影和边框
    content = content.replace(/rounded-lg/g, 'rounded-full'); // 改为完全圆角
    
    // 增强边框效果
    content = content.replace(/border-2 border-primary/g, 'border-2 border-primary');
    
    // 增强阴影效果
    content = content.replace(/shadow-md/g, 'shadow-lg');
    content = content.replace(/hover:shadow-lg/g, 'hover:shadow-xl');
    
    return content;
}

// 执行修复
rewriteRegisterPageButtons();