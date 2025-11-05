// 更新按钮样式以匹配新设计
console.log('开始更新按钮样式...');

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 查找所有需要更新的按钮
    const buttonsToUpdate = [];
    
    // 1. 桌面端导航栏的登录和注册按钮
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        const navButtons = navLinks.querySelectorAll('a');
        navButtons.forEach(button => {
            if (button.textContent.includes('登录') || button.textContent.includes('注册')) {
                buttonsToUpdate.push(button);
            }
        });
    }
    
    // 2. 移动端菜单的登录和注册按钮
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        const mobileButtons = mobileMenu.querySelectorAll('a');
        mobileButtons.forEach(button => {
            if (button.textContent.includes('登录') || button.textContent.includes('注册')) {
                buttonsToUpdate.push(button);
            }
        });
    }
    
    // 3. 表单提交按钮
    const formSubmitButton = document.querySelector('button[type="submit"]');
    if (formSubmitButton) {
        buttonsToUpdate.push(formSubmitButton);
    }
    
    // 4. 表单底部的登录链接按钮
    const formLoginLink = document.querySelector('a[href="login.html"]');
    if (formLoginLink) {
        buttonsToUpdate.push(formLoginLink);
    }
    
    console.log(`找到需要更新的按钮数量: ${buttonsToUpdate.length}`);
    
    // 更新每个按钮的样式
    buttonsToUpdate.forEach(button => {
        // 清除所有现有样式类
        const originalClasses = button.className;
        button.className = '';
        
        // 保留一些必要的类
        const keepClasses = ['transition-all', 'duration-300', 'relative', 'group'];
        keepClasses.forEach(cls => {
            if (originalClasses.includes(cls)) {
                button.classList.add(cls);
            }
        });
        
        // 检查按钮类型并应用相应的样式
        if (button.textContent.includes('登录')) {
            // 登录按钮样式：圆角矩形，蓝色边框，蓝色文字，有箭头图标
            button.className = 'text-primary border-2 border-primary rounded-lg px-5 py-2 font-medium flex items-center justify-center hover:bg-primary/5';
            
            // 确保有箭头图标
            if (!button.querySelector('.fa-arrow-right')) {
                // 移除现有图标
                const existingIcons = button.querySelectorAll('i');
                existingIcons.forEach(icon => icon.remove());
                
                // 添加箭头图标
                const icon = document.createElement('i');
                icon.className = 'fa fa-arrow-right mr-2';
                button.prepend(icon);
            }
        } else if (button.textContent.includes('注册')) {
            // 注册按钮样式：圆角矩形，紫色背景，白色文字，有人物加号图标
            if (button.tagName === 'BUTTON') {
                // 表单提交按钮
                button.className = 'w-full py-3 bg-gradient-to-r from-secondary to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 text-lg font-medium transform hover:scale-105';
            } else {
                // 导航链接按钮
                button.className = 'bg-gradient-to-r from-secondary to-purple-600 text-white rounded-lg px-5 py-2 font-medium flex items-center justify-center hover:shadow-lg';
            }
            
            // 确保有人物加号图标
            if (!button.querySelector('.fa-user-plus')) {
                // 移除现有图标
                const existingIcons = button.querySelectorAll('i');
                existingIcons.forEach(icon => icon.remove());
                
                // 添加人物加号图标
                const icon = document.createElement('i');
                icon.className = 'fa fa-user-plus mr-2';
                button.prepend(icon);
            }
        }
        
        console.log(`更新按钮: ${button.textContent.trim()}`);
    });
    
    console.log('按钮样式更新完成！');
});