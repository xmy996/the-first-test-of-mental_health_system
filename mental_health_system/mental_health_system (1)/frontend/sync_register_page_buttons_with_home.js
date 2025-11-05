const fs = require('fs');

// 读取首页和注册页文件
const indexFilePath = 'f:\\Desktop\\community_mental_health_center\\mental_health_system\\mental_health_system (1)\\frontend\\index.html';
const registerFilePath = 'f:\\Desktop\\community_mental_health_center\\mental_health_system\\mental_health_system (1)\\frontend\\register.html';

try {
    // 读取首页内容，提取登录和注册按钮的HTML结构
    const indexContent = fs.readFileSync(indexFilePath, 'utf8');
    
    // 提取桌面端登录按钮
    const desktopLoginButtonRegex = /<button[^>]*class="([^"]*)"[^>]*onclick="window\.location\.href='login\.html'"[^>]*>\s*<i[^>]*fa-sign-in[^>]*><\/i>\s*登录\s*<\/button>/g;
    const desktopLoginButtonMatch = desktopLoginButtonRegex.exec(indexContent);
    let desktopLoginButtonHTML = '';
    if (desktopLoginButtonMatch) {
        desktopLoginButtonHTML = desktopLoginButtonMatch[0];
    }
    
    // 提取桌面端注册按钮
    const desktopRegisterButtonRegex = /<button[^>]*class="([^"]*)"[^>]*onclick="window\.location\.href='register\.html'"[^>]*>\s*<i[^>]*fa-user-plus[^>]*><\/i>\s*注册\s*<\/button>/g;
    const desktopRegisterButtonMatch = desktopRegisterButtonRegex.exec(indexContent);
    let desktopRegisterButtonHTML = '';
    if (desktopRegisterButtonMatch) {
        desktopRegisterButtonHTML = desktopRegisterButtonMatch[0];
    }
    
    // 提取移动端登录按钮
    const mobileMenuRegex = /<div id="mobile-menu"[^>]*>[\s\S]*?<\/div>/;
    const mobileMenuMatch = mobileMenuRegex.exec(indexContent);
    let mobileLoginButtonHTML = '';
    let mobileRegisterButtonHTML = '';
    
    if (mobileMenuMatch) {
        const mobileMenuContent = mobileMenuMatch[0];
        
        // 提取移动端登录按钮
        const mobileLoginRegex = /<button[^>]*class="([^"]*)"[^>]*onclick="window\.location\.href='login\.html'"[^>]*>\s*<i[^>]*fa-sign-in[^>]*><\/i>\s*登录\s*<\/button>/;
        const mobileLoginMatch = mobileLoginRegex.exec(mobileMenuContent);
        if (mobileLoginMatch) {
            mobileLoginButtonHTML = mobileLoginMatch[0];
        }
        
        // 提取移动端注册按钮
        const mobileRegisterRegex = /<button[^>]*class="([^"]*)"[^>]*onclick="window\.location\.href='register\.html'"[^>]*>\s*<i[^>]*fa-user-plus[^>]*><\/i>\s*注册\s*<\/button>/;
        const mobileRegisterMatch = mobileRegisterRegex.exec(mobileMenuContent);
        if (mobileRegisterMatch) {
            mobileRegisterButtonHTML = mobileRegisterMatch[0];
        }
    }
    
    // 读取注册页内容
    let registerContent = fs.readFileSync(registerFilePath, 'utf8');
    let changesMade = 0;
    
    // 替换注册页中的桌面端登录按钮
    const registerDesktopLoginButtonRegex = /<button[^>]*class="([^"]*)"[^>]*onclick="window\.location\.href='login\.html'"[^>]*>\s*<i[^>]*fa-sign-in[^>]*><\/i>\s*登录\s*<\/button>/;
    if (desktopLoginButtonHTML && registerDesktopLoginButtonRegex.test(registerContent)) {
        registerContent = registerContent.replace(registerDesktopLoginButtonRegex, desktopLoginButtonHTML);
        changesMade++;
        console.log('已更新桌面端登录按钮');
    }
    
    // 替换注册页中的桌面端注册按钮
    const registerDesktopRegisterButtonRegex = /<button[^>]*class="([^"]*)"[^>]*onclick="window\.location\.href='register\.html'"[^>]*>\s*<i[^>]*fa-user-plus[^>]*><\/i>\s*注册\s*<\/button>/;
    if (desktopRegisterButtonHTML && registerDesktopRegisterButtonRegex.test(registerContent)) {
        registerContent = registerContent.replace(registerDesktopRegisterButtonRegex, desktopRegisterButtonHTML);
        changesMade++;
        console.log('已更新桌面端注册按钮');
    }
    
    // 替换注册页中的移动端登录按钮
    const registerMobileLoginButtonRegex = /<button[^>]*class="([^"]*)"[^>]*onclick="window\.location\.href='login\.html'"[^>]*>\s*<i[^>]*fa-sign-in[^>]*><\/i>\s*登录\s*<\/button>/g;
    if (mobileLoginButtonHTML && registerMobileLoginButtonRegex.test(registerContent)) {
        // 确保只替换移动端菜单中的按钮
        const registerMobileMenuRegex = /<div id="mobile-menu"[^>]*>[\s\S]*?<\/div>/;
        registerContent = registerContent.replace(registerMobileMenuRegex, (match) => {
            return match.replace(registerMobileLoginButtonRegex, mobileLoginButtonHTML);
        });
        changesMade++;
        console.log('已更新移动端登录按钮');
    }
    
    // 替换注册页中的移动端注册按钮
    const registerMobileRegisterButtonRegex = /<button[^>]*class="([^"]*)"[^>]*onclick="window\.location\.href='register\.html'"[^>]*>\s*<i[^>]*fa-user-plus[^>]*><\/i>\s*注册\s*<\/button>/g;
    if (mobileRegisterButtonHTML && registerMobileRegisterButtonRegex.test(registerContent)) {
        // 确保只替换移动端菜单中的按钮
        const registerMobileMenuRegex = /<div id="mobile-menu"[^>]*>[\s\S]*?<\/div>/;
        registerContent = registerContent.replace(registerMobileMenuRegex, (match) => {
            return match.replace(registerMobileRegisterButtonRegex, mobileRegisterButtonHTML);
        });
        changesMade++;
        console.log('已更新移动端注册按钮');
    }
    
    // 替换表单中的登录按钮
    const formLoginButtonRegex = /<a[^>]*href="login\.html"[^>]*class="([^"]*)"[^>]*>\s*<i[^>]*fa-sign-in[^>]*><\/i>\s*登录\s*<\/a>/;
    if (desktopLoginButtonHTML) {
        // 创建一个表单登录按钮，基于桌面端登录按钮，但使用<a>标签
        const formLoginButtonHTML = desktopLoginButtonHTML
            .replace('button', 'a')
            .replace('onclick="window.location.href=\'login.html\'"', 'href="login.html"')
            .replace('</button>', '</a>');
            
        if (formLoginButtonRegex.test(registerContent)) {
            registerContent = registerContent.replace(formLoginButtonRegex, formLoginButtonHTML);
            changesMade++;
            console.log('已更新表单登录按钮');
        }
    }
    
    // 保存更新后的注册页
    fs.writeFileSync(registerFilePath, registerContent, 'utf8');
    console.log(`注册页面更新完成，共修改了 ${changesMade} 处按钮`);
    
} catch (error) {
    console.error('同步按钮样式时出错:', error);
}