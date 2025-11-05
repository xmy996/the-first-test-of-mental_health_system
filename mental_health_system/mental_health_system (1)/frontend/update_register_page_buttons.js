const fs = require('fs');
const path = require('path');

// 读取register.html文件
const filePath = path.join(__dirname, 'register.html');
let htmlContent = fs.readFileSync(filePath, 'utf8');

// 记录修复的按钮数量
let loginButtonsFixed = 0;
let registerButtonsFixed = 0;

// 1. 更新导航栏中的登录按钮（桌面端）
const desktopLoginButtonPattern = /<button class="px-4 py-2 text-primary border-2 border-primary rounded-lg hover:bg-primary\/5 hover:text-primary transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary\/30 font-medium shadow-sm hover:shadow transform hover:-translate-y-0.5 active:translate-y-0" onclick="window\.location\.href='login\.html'">\s*<i class="fa fa-sign-in mr-1(\s*mr-1)?"><\/i>登录\s*<\/button>/g;

htmlContent = htmlContent.replace(desktopLoginButtonPattern, (match) => {
    loginButtonsFixed++;
    return '<button class="px-4 py-2 text-primary border-2 border-primary rounded-lg hover:bg-primary/5 hover:text-primary transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/30 font-medium shadow-sm hover:shadow transform hover:-translate-y-0.5 active:translate-y-0" onclick="window.location.href=\'login.html\'"><i class="fa fa-sign-in mr-1"></i>登录</button>';
});

// 2. 更新导航栏中的注册按钮（桌面端）
const desktopRegisterButtonPattern = /<button class="px-4 py-2 bg-gradient-to-r from-primary to-indigo-600 text-indigo-900 rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary\/30 font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0" onclick="window\.location\.href='register\.html'">\s*<i class="fa fa-user-plus mr-2(\s*mr-2)?"><\/i>注册\s*<\/button>/g;

htmlContent = htmlContent.replace(desktopRegisterButtonPattern, (match) => {
    registerButtonsFixed++;
    return '<button class="px-4 py-2 bg-gradient-to-r from-primary to-indigo-600 text-indigo-900 rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/30 font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0" onclick="window.location.href=\'register.html\'"><i class="fa fa-user-plus mr-2"></i>注册</button>';
});

// 3. 更新移动端菜单中的登录按钮
const mobileLoginButtonPattern = /<button class="px-3 py-2 text-primary border border-primary rounded-lg hover:bg-primary\/5 hover:text-primary transition-all duration-300 text-sm w-full" onclick="window\.location\.href='login\.html'">\s*<i class="fa fa-sign-in mr-1(\s*mr-1)?"><\/i>登录\s*<\/button>/g;

htmlContent = htmlContent.replace(mobileLoginButtonPattern, (match) => {
    loginButtonsFixed++;
    return '<button class="px-3 py-2 text-primary border-2 border-primary rounded-lg hover:bg-primary/5 hover:text-primary transition-all duration-300 text-sm w-full" onclick="window.location.href=\'login.html\'"><i class="fa fa-sign-in mr-1"></i>登录</button>';
});

// 4. 更新移动端菜单中的注册按钮
const mobileRegisterButtonPattern = /<button class="px-3 py-2 bg-gradient-to-r from-primary to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 text-sm w-full shadow-md hover:shadow-lg" onclick="window\.location\.href='register\.html'">\s*<i class="fa fa-user-plus mr-1(\s*mr-1)?"><\/i>注册\s*<\/button>/g;

htmlContent = htmlContent.replace(mobileRegisterButtonPattern, (match) => {
    registerButtonsFixed++;
    return '<button class="px-3 py-2 bg-gradient-to-r from-primary to-indigo-600 text-indigo-900 rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 text-sm w-full shadow-md hover:shadow-lg" onclick="window.location.href=\'register.html\'"><i class="fa fa-user-plus mr-1"></i>注册</button>';
});

// 5. 更新表单中的注册提交按钮
const formRegisterButtonPattern = /<button type="submit" class="w-full py-3 bg-gradient-to-r from-primary to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 animate-slide-up delay-600">\s*注册\s*<\/button>/g;

htmlContent = htmlContent.replace(formRegisterButtonPattern, (match) => {
    registerButtonsFixed++;
    return '<button type="submit" class="w-full py-3 bg-gradient-to-r from-primary to-indigo-600 text-indigo-900 rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 animate-slide-up delay-600">注册</button>';
});

// 6. 更新表单下方的登录按钮
const formLoginButtonPattern = /<a href="login\.html" class="block px-4 py-3 text-primary border border-primary rounded-lg hover:bg-primary\/5 hover:text-primary transition-all duration-300 text-sm w-full">\s*<i class="fa fa-sign-in mr-2(\s*mr-2)? w-5 text-center"><\/i>\s*登录\s*<\/a>/g;

htmlContent = htmlContent.replace(formLoginButtonPattern, (match) => {
    loginButtonsFixed++;
    return '<a href="login.html" class="block px-4 py-3 text-primary border-2 border-primary rounded-lg hover:bg-primary/5 hover:text-primary transition-all duration-300 text-sm w-full"><i class="fa fa-sign-in mr-2 w-5 text-center"></i>登录</a>';
});

// 保存更新后的文件
fs.writeFileSync(filePath, htmlContent, 'utf8');

console.log(`✅ register.html 文件更新完成！`);
console.log(`- 修复了 ${loginButtonsFixed} 个登录按钮（设置为蓝色外框）`);
console.log(`- 修复了 ${registerButtonsFixed} 个注册按钮（设置为深蓝色文字）`);
console.log(`\n文件已保存到: ${filePath}`);