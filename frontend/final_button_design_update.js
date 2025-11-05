// 最终按钮设计更新 - 精确匹配图片样式
console.log('应用最终按钮设计更新...');

document.addEventListener('DOMContentLoaded', function() {
    // 定义新的按钮样式
    const loginButtonStyle = {
        base: 'text-primary border-2 border-primary rounded-lg px-5 py-2 font-medium flex items-center',
        hover: 'hover:bg-primary/5 hover:shadow-sm',
        icon: 'fa fa-arrow-right mr-2'
    };
    
    const registerButtonStyle = {
        base: 'bg-secondary text-white rounded-lg px-5 py-2 font-medium flex items-center',
        hover: 'hover:bg-purple-700 hover:shadow-md',
        icon: 'fa fa-user-plus mr-2'
    };
    
    // 1. 更新桌面端导航栏按钮
    updateNavButtons('.nav-links');
    
    // 2. 更新移动端菜单按钮
    updateNavButtons('#mobile-menu');
    
    // 3. 更新表单提交按钮
    updateFormSubmitButton();
    
    // 4. 更新表单底部登录链接
    updateFormLoginLink();
    
    // 辅助函数：更新导航区域的按钮
    function updateNavButtons(containerSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) return;
        
        const buttons = container.querySelectorAll('a');
        buttons.forEach(button => {
            // 重置按钮样式
            button.className = '';
            
            if (button.textContent.includes('登录')) {
                // 登录按钮
                button.className = `${loginButtonStyle.base} ${loginButtonStyle.hover}`;
                updateButtonIcon(button, loginButtonStyle.icon);
            } else if (button.textContent.includes('注册')) {
                // 注册按钮
                button.className = `${registerButtonStyle.base} ${registerButtonStyle.hover}`;
                updateButtonIcon(button, registerButtonStyle.icon);
            }
        });
    }
    
    // 辅助函数：更新按钮图标
    function updateButtonIcon(button, iconClass) {
        // 移除所有现有图标
        const existingIcons = button.querySelectorAll('i');
        existingIcons.forEach(icon => icon.remove());
        
        // 添加新图标
        const icon = document.createElement('i');
        icon.className = iconClass;
        button.prepend(icon);
        
        // 确保文本在图标后面
        const textNode = Array.from(button.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
        if (textNode) {
            textNode.textContent = textNode.textContent.trim();
        }
    }
    
    // 辅助函数：更新表单提交按钮
    function updateFormSubmitButton() {
        const submitButton = document.querySelector('button[type="submit"]');
        if (!submitButton) return;
        
        // 重置并应用注册按钮样式
        submitButton.className = 'w-full py-3 bg-secondary text-white rounded-lg font-medium flex items-center justify-center hover:bg-purple-700 hover:shadow-md transition-all duration-300';
        
        // 添加正确的图标
        updateButtonIcon(submitButton, 'fa fa-user-plus mr-2');
    }
    
    // 辅助函数：更新表单底部登录链接
    function updateFormLoginLink() {
        const loginLink = document.querySelector('a[href="login.html"]');
        if (!loginLink) return;
        
        // 重置并应用登录按钮样式
        loginLink.className = 'text-primary border-2 border-primary rounded-lg px-4 py-1 font-medium flex items-center hover:bg-primary/5';
        
        // 添加正确的图标
        updateButtonIcon(loginLink, 'fa fa-arrow-right mr-2');
    }
    
    console.log('最终按钮设计更新完成！');
});