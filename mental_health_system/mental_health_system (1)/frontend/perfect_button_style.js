// 完美按钮样式 - 精确匹配最终设计要求
console.log('应用完美按钮样式...');

document.addEventListener('DOMContentLoaded', function() {
    // 移除之前可能应用的样式脚本影响
    document.querySelectorAll('a, button').forEach(el => {
        if (el.textContent.includes('登录') || el.textContent.includes('注册')) {
            // 移除可能的transform和scale相关类
            el.classList.remove('transform', 'hover:scale-105', 'hover:scale-110');
        }
    });
    
    // 1. 更新桌面端导航栏按钮
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        const navButtons = Array.from(navLinks.querySelectorAll('a'))
            .filter(a => a.textContent.includes('登录') || a.textContent.includes('注册'));
        
        navButtons.forEach(button => {
            if (button.textContent.includes('登录')) {
                // 登录按钮：蓝色边框，蓝色文字，箭头图标
                button.className = 'text-primary border-2 border-primary rounded-lg px-5 py-2 font-medium flex items-center transition-colors hover:bg-primary/5';
                setButtonContent(button, '登录', 'fa-arrow-right');
            } else if (button.textContent.includes('注册')) {
                // 注册按钮：紫色背景，白色文字，用户加号图标
                button.className = 'bg-secondary text-white rounded-lg px-5 py-2 font-medium flex items-center transition-colors hover:bg-purple-700';
                setButtonContent(button, '注册', 'fa-user-plus');
            }
        });
    }
    
    // 2. 更新移动端菜单按钮
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        const mobileButtons = Array.from(mobileMenu.querySelectorAll('a'))
            .filter(a => a.textContent.includes('登录') || a.textContent.includes('注册'));
        
        mobileButtons.forEach(button => {
            if (button.textContent.includes('登录')) {
                button.className = 'text-primary border-2 border-primary rounded-lg px-5 py-2 font-medium flex items-center transition-colors hover:bg-primary/5';
                setButtonContent(button, '登录', 'fa-arrow-right');
            } else if (button.textContent.includes('注册')) {
                button.className = 'bg-secondary text-white rounded-lg px-5 py-2 font-medium flex items-center transition-colors hover:bg-purple-700';
                setButtonContent(button, '注册', 'fa-user-plus');
            }
        });
    }
    
    // 3. 更新表单提交按钮
    const submitButton = document.querySelector('button[type="submit"]');
    if (submitButton && submitButton.textContent.includes('注册')) {
        submitButton.className = 'w-full py-3 bg-secondary text-white rounded-lg font-medium flex items-center justify-center transition-colors hover:bg-purple-700';
        setButtonContent(submitButton, '注册', 'fa-user-plus');
    }
    
    // 4. 更新表单底部登录链接
    const formLoginLink = document.querySelector('a[href="login.html"]');
    if (formLoginLink) {
        // 查找包含登录链接的父容器，应用按钮样式
        const loginContainer = formLoginLink.closest('div');
        if (loginContainer) {
            // 移除现有的链接，创建新的按钮样式链接
            const newLoginButton = document.createElement('a');
            newLoginButton.href = 'login.html';
            newLoginButton.className = 'text-primary border-2 border-primary rounded-lg px-5 py-2 font-medium flex items-center justify-center transition-colors hover:bg-primary/5';
            setButtonContent(newLoginButton, '立即登录', 'fa-arrow-right');
            
            // 替换现有内容
            loginContainer.innerHTML = '';
            loginContainer.appendChild(newLoginButton);
        }
    }
    
    // 辅助函数：设置按钮内容和图标
    function setButtonContent(button, text, iconClass) {
        // 清空按钮
        button.innerHTML = '';
        
        // 添加图标
        const icon = document.createElement('i');
        icon.className = `fa ${iconClass} mr-2`;
        button.appendChild(icon);
        
        // 添加文本
        button.appendChild(document.createTextNode(text));
    }
    
    console.log('完美按钮样式应用完成！');
});