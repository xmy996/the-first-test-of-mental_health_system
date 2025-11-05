const fs = require('fs');

// 定义最终的完美按钮样式
const finalLoginButtonClass = 'px-4 py-2.5 text-primary border-4 border-primary rounded-full hover:bg-primary/5 hover:text-primary transition-all duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-primary/30';
const finalRegisterButtonClass = 'px-4 py-2.5 bg-gradient-to-r from-primary to-indigo-600 text-indigo-900 rounded-full hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-primary/30';
const finalFormRegisterButtonClass = 'w-full py-3 bg-gradient-to-r from-primary to-indigo-600 text-indigo-900 rounded-full hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0';
const finalFormLoginLinkClass = 'px-4 py-2.5 text-primary border-4 border-primary rounded-full hover:bg-primary/5 hover:text-primary transition-all duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-primary/30';

// 完全重写注册页面的所有按钮
function finalButtonStyleOverride() {
    const registerFilePath = 'f:\\Desktop\\community_mental_health_center\\mental_health_system\\mental_health_system (1)\\frontend\\register.html';
    
    try {
        console.log('执行最终按钮样式覆盖...');
        
        // 读取文件并完全重写按钮部分
        let content = fs.readFileSync(registerFilePath, 'utf8');
        let changesMade = 0;
        
        // 1. 桌面端导航栏登录按钮
        const desktopLoginButtonHTML = `                <button class="${finalLoginButtonClass}" onclick="window.location.href='login.html'">
                    <i class="fa fa-sign-in mr-2"></i>登录
                </button>`;
        
        // 2. 桌面端导航栏注册按钮
        const desktopRegisterButtonHTML = `                <button class="${finalRegisterButtonClass}" onclick="window.location.href='register.html'">
                    <i class="fa fa-user-plus mr-2"></i>注册
                </button>`;
        
        // 3. 移动端菜单登录按钮
        const mobileLoginButtonHTML = `                    <button class="${finalLoginButtonClass}" onclick="window.location.href='login.html'">
                    <i class="fa fa-sign-in mr-2"></i>登录
                </button>`;
        
        // 4. 移动端菜单注册按钮
        const mobileRegisterButtonHTML = `                    <button class="${finalRegisterButtonClass}" onclick="window.location.href='register.html'">
                    <i class="fa fa-user-plus mr-2"></i>注册
                </button>`;
        
        // 5. 表单提交按钮
        const formRegisterButtonHTML = `                            <button type="submit" class="${finalFormRegisterButtonClass} animate-slide-up delay-600">注册</button>`;
        
        // 6. 表单底部登录链接按钮
        const formLoginLinkHTML = `                                <a class="${finalFormLoginLinkClass}" href="login.html">
                    <i class="fa fa-sign-in mr-2"></i>登录
                </a>`;
        
        // 使用正则表达式替换所有按钮
        // 替换桌面端登录按钮
        content = content.replace(/<button[^>]*onclick="window\.location\.href='login\.html'"[^>]*>[\s\S]*?登录[\s\S]*?<\/button>/, desktopLoginButtonHTML);
        changesMade++;
        console.log('1. 已设置桌面端登录按钮为最终样式');
        
        // 替换桌面端注册按钮
        content = content.replace(/<button[^>]*onclick="window\.location\.href='register\.html'"[^>]*>[\s\S]*?注册[\s\S]*?<\/button>/, desktopRegisterButtonHTML);
        changesMade++;
        console.log('2. 已设置桌面端注册按钮为最终样式');
        
        // 处理移动端菜单中的按钮
        const mobileMenuRegex = /<div id="mobile-menu"[^>]*>[\s\S]*?<\/div>/;
        content = content.replace(mobileMenuRegex, (match) => {
            let newMatch = match;
            
            // 替换移动端登录按钮
            newMatch = newMatch.replace(/<button[^>]*onclick="window\.location\.href='login\.html'"[^>]*>[\s\S]*?登录[\s\S]*?<\/button>/, mobileLoginButtonHTML);
            changesMade++;
            console.log('3. 已设置移动端登录按钮为最终样式');
            
            // 替换移动端注册按钮
            newMatch = newMatch.replace(/<button[^>]*onclick="window\.location\.href='register\.html'"[^>]*>[\s\S]*?注册[\s\S]*?<\/button>/, mobileRegisterButtonHTML);
            changesMade++;
            console.log('4. 已设置移动端注册按钮为最终样式');
            
            return newMatch;
        });
        
        // 替换表单提交按钮
        content = content.replace(/<button[^>]*type="submit"[^>]*>[\s\S]*?注册[\s\S]*?<\/button>/, formRegisterButtonHTML);
        changesMade++;
        console.log('5. 已设置表单提交按钮为最终样式');
        
        // 替换表单底部登录链接按钮
        content = content.replace(/<a[^>]*href="login\.html"[^>]*>[\s\S]*?登录[\s\S]*?<\/a>/, formLoginLinkHTML);
        changesMade++;
        console.log('6. 已设置表单底部登录链接按钮为最终样式');
        
        // 保存最终文件
        fs.writeFileSync(registerFilePath, content, 'utf8');
        console.log(`\n✅ 最终按钮样式覆盖完成！所有 ${changesMade} 个按钮现在应该完全匹配您需要的样式。`);
        console.log('✅ 按钮已使用：');
        console.log('  - 完全圆形 (rounded-full)');
        console.log('  - 更厚的边框 (border-4)');
        console.log('  - 更强的阴影效果 (shadow-lg, hover:shadow-xl)');
        console.log('  - 标准的字体和颜色');
        
    } catch (error) {
        console.error('最终按钮样式覆盖时出错:', error);
    }
}

// 执行最终覆盖
finalButtonStyleOverride();