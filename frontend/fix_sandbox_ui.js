// 修复沙盘模拟界面的脚本
// 移除登录/注册模块并优化全局工具栏

function fixSandboxUI() {
    console.log('开始修复沙盘模拟界面...');
    
    // 1. 移除桌面端登录注册模块
    const authButtons = document.getElementById('auth-buttons');
    if (authButtons) {
        // 保留管理员入口链接
        const adminLink = authButtons.querySelector('a[href="admin_login.html"]');
        if (adminLink) {
            // 创建一个新的容器来放置管理员入口
            const adminContainer = document.createElement('div');
            adminContainer.className = 'hidden md:flex items-center';
            adminContainer.appendChild(adminLink);
            authButtons.parentNode.insertBefore(adminContainer, authButtons);
        }
        // 移除整个登录注册模块
        authButtons.remove();
        console.log('已移除桌面端登录注册模块');
    }
    
    // 2. 移除移动端登录注册按钮
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        // 查找包含登录注册按钮的div
        const mobileAuthButtons = mobileMenu.querySelector('.flex.space-x-3.py-3.mt-2');
        if (mobileAuthButtons) {
            const hasLoginRegister = mobileAuthButtons.querySelector('button[onclick*="login.html"]') || 
                                    mobileAuthButtons.querySelector('button[onclick*="register.html"]');
            if (hasLoginRegister) {
                mobileAuthButtons.remove();
                console.log('已移除移动端登录注册按钮');
            }
        }
    }
    
    // 3. 优化全局工具栏按钮可点击性
    const globalTools = document.getElementById('global-tools');
    if (globalTools) {
        const toolButtons = globalTools.querySelectorAll('.tool-btn');
        toolButtons.forEach(button => {
            // 添加cursor-pointer确保可点击性
            if (!button.classList.contains('cursor-pointer')) {
                button.classList.add('cursor-pointer');
            }
            // 添加悬停效果
            button.style.transition = 'transform 0.2s ease';
            button.style.transformOrigin = 'center';
            
            // 添加点击和悬停效果
            button.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.1)';
            });
            button.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        });
        
        // 优化音量滑块
        const volumeSliders = globalTools.querySelectorAll('input[type="range"]');
        volumeSliders.forEach(slider => {
            if (!slider.classList.contains('cursor-pointer')) {
                slider.classList.add('cursor-pointer');
            }
        });
        
        console.log('已优化全局工具栏按钮可点击性');
    }
    
    console.log('沙盘模拟界面修复完成！');
}

// 在DOM加载完成后执行修复
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixSandboxUI);
} else {
    fixSandboxUI();
}