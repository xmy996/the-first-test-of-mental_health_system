// 直接修改HTML文件，永久修复按钮样式
const fs = require('fs');
const path = require('path');

const registerHtmlPath = path.join(__dirname, 'register.html');

console.log('开始永久修复按钮样式...');

fs.readFile(registerHtmlPath, 'utf8', (err, data) => {
    if (err) {
        console.error('读取文件失败:', err);
        return;
    }
    
    let updatedHtml = data;
    
    // 1. 更新桌面端导航栏按钮
    // 登录按钮：<a href="login.html" class="text-primary border-2 border-primary rounded-lg px-5 py-2 font-medium flex items-center transition-colors hover:bg-primary/5"><i class="fa fa-arrow-right mr-2"></i>登录</a>
    // 注册按钮：<a href="register.html" class="bg-secondary text-white rounded-lg px-5 py-2 font-medium flex items-center transition-colors hover:bg-purple-700"><i class="fa fa-user-plus mr-2"></i>注册</a>
    updatedHtml = updatedHtml.replace(/<a href="login.html"[^>]*>.*?登录.*?<\/a>/gs, 
        '<a href="login.html" class="text-primary border-2 border-primary rounded-lg px-5 py-2 font-medium flex items-center transition-colors hover:bg-primary/5"><i class="fa fa-arrow-right mr-2"></i>登录</a>');
    
    updatedHtml = updatedHtml.replace(/<a href="register.html"[^>]*>.*?注册.*?<\/a>/gs, 
        '<a href="register.html" class="bg-secondary text-white rounded-lg px-5 py-2 font-medium flex items-center transition-colors hover:bg-purple-700"><i class="fa fa-user-plus mr-2"></i>注册</a>');
    
    // 2. 更新移动端菜单按钮
    updatedHtml = updatedHtml.replace(/<a href="login.html"[^>]*class="[^>]*mobile-menu-link[^>]*>.*?登录.*?<\/a>/gs, 
        '<a href="login.html" class="mobile-menu-link text-primary border-2 border-primary rounded-lg px-5 py-2 font-medium flex items-center transition-colors hover:bg-primary/5"><i class="fa fa-arrow-right mr-2"></i>登录</a>');
    
    updatedHtml = updatedHtml.replace(/<a href="register.html"[^>]*class="[^>]*mobile-menu-link[^>]*>.*?注册.*?<\/a>/gs, 
        '<a href="register.html" class="mobile-menu-link bg-secondary text-white rounded-lg px-5 py-2 font-medium flex items-center transition-colors hover:bg-purple-700"><i class="fa fa-user-plus mr-2"></i>注册</a>');
    
    // 3. 更新表单提交按钮
    updatedHtml = updatedHtml.replace(/<button type="submit"[^>]*>.*?注册.*?<\/button>/gs, 
        '<button type="submit" class="w-full py-3 bg-secondary text-white rounded-lg font-medium flex items-center justify-center transition-colors hover:bg-purple-700"><i class="fa fa-user-plus mr-2"></i>注册</button>');
    
    // 4. 更新表单底部登录链接容器
    updatedHtml = updatedHtml.replace(/<div class="text-center mt-6 animate-slide-up"[^>]*>.*?<a href="login.html"[^>]*>.*?<\/a>.*?<\/div>/gs, 
        '<div class="text-center mt-6 animate-slide-up" style="animation-delay: 0.9s;">\n                            <a href="login.html" class="text-primary border-2 border-primary rounded-lg px-5 py-2 font-medium flex items-center justify-center transition-colors hover:bg-primary/5">\n                                <i class="fa fa-arrow-right mr-2"></i>立即登录\n                            </a>\n                        </div>');
    
    // 5. 移除所有之前添加的按钮样式脚本引用
    updatedHtml = updatedHtml.replace(/<script src="(update_buttons_to_match_new_design|final_button_design_update|perfect_button_style)\.js"><\/script>\n/g, '');
    
    // 6. 直接在HTML中添加内联样式以确保一致性
    const inlineStyles = `    <style>        
        /* 按钮样式 - 精确匹配设计要求 */
        .login-button {
            @apply text-primary border-2 border-primary rounded-lg px-5 py-2 font-medium flex items-center transition-colors hover:bg-primary/5;
        }
        .register-button {
            @apply bg-secondary text-white rounded-lg px-5 py-2 font-medium flex items-center transition-colors hover:bg-purple-700;
        }
        .form-register-button {
            @apply w-full py-3 bg-secondary text-white rounded-lg font-medium flex items-center justify-center transition-colors hover:bg-purple-700;
        }
    </style>`;
    
    // 添加到head部分
    updatedHtml = updatedHtml.replace('</head>', `${inlineStyles}\n</head>`);
    
    // 写回文件
    fs.writeFile(registerHtmlPath, updatedHtml, 'utf8', (err) => {
        if (err) {
            console.error('写入文件失败:', err);
            return;
        }
        
        console.log('按钮样式永久修复完成！');
        console.log('所有按钮现在应该完全匹配设计要求：');
        console.log('- 登录按钮：蓝色边框，蓝色文字，箭头图标');
        console.log('- 注册按钮：紫色背景，白色文字，用户加号图标');
    });
});