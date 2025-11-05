// 认证控件显示测试工具
// 使用方法：在浏览器控制台运行 window.testAuthDisplay.testToggleLogin()

window.testAuthDisplay = {
    // 测试登录/登出切换效果
    testToggleLogin: function() {
        console.log('开始测试认证控件显示效果...');
        
        // 先保存当前登录状态
        const wasLoggedIn = AuthManager.isLoggedIn();
        console.log(`当前登录状态: ${wasLoggedIn ? '已登录' : '未登录'}`);
        
        // 切换到相反的状态
        const newStatus = !wasLoggedIn;
        console.log(`测试将切换到: ${newStatus ? '已登录' : '未登录'} 状态`);
        
        // 模拟登录/登出
        if (newStatus) {
            this.simulateLogin();
        } else {
            this.simulateLogout();
        }
        
        // 显示当前控件状态
        this.reportCurrentState();
        
        // 提供恢复原始状态的选项
        console.log('\n测试完成！如需恢复原始状态，请运行: window.testAuthDisplay.resetToOriginalState()');
    },
    
    // 模拟登录
    simulateLogin: function() {
        console.log('模拟登录...');
        // 设置模拟登录状态
        AuthManager.setLoginStatus(true, {
            userId: 'test-user-123',
            username: '测试用户',
            phone: '13800138000'
        });
        // 触发状态更新
        updateGlobalLoginStatus();
    },
    
    // 模拟登出
    simulateLogout: function() {
        console.log('模拟登出...');
        // 清除登录状态
        AuthManager.setLoginStatus(false, null);
        // 触发状态更新
        updateGlobalLoginStatus();
    },
    
    // 报告当前控件显示状态
    reportCurrentState: function() {
        console.log('\n--- 当前控件显示状态 ---');
        
        // 检查各个关键元素
        const elements = [
            { id: 'user-menu', name: '用户菜单' },
            { id: 'auth-buttons', name: '认证按钮容器' },
            { id: 'login-button', name: '登录按钮' },
            { id: 'register-button', name: '注册按钮' },
            { id: 'admin-login', name: '管理员入口' }
        ];
        
        elements.forEach(el => {
            const element = document.getElementById(el.id);
            if (element) {
                const isHidden = element.classList.contains('hidden') || 
                               element.style.display === 'none' || 
                               element.style.visibility === 'hidden';
                console.log(`${el.name} (${el.id}): ${isHidden ? '隐藏' : '可见'}`);
            } else {
                console.log(`${el.name} (${el.id}): 未找到`);
            }
        });
    },
    
    // 重置到原始状态（可以扩展实现）
    resetToOriginalState: function() {
        console.log('重置到初始状态...');
        // 刷新页面来完全重置
        location.reload();
        console.log('页面已刷新，状态已重置');
    },
    
    // 强制修复所有认证控件显示
    forceRepairAuthButtons: function() {
        console.log('强制修复认证控件显示...');
        
        // 重置所有可能的隐藏样式
        const elementsToFix = [
            'auth-buttons', 
            'mobile-auth-buttons', 
            'login-button', 
            'register-button', 
            'admin-login'
        ];
        
        elementsToFix.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                // 移除所有隐藏样式
                element.classList.remove('hidden');
                element.style.display = '';
                element.style.visibility = 'visible';
                console.log(`已修复: ${id}`);
            }
        });
        
        // 重新应用登录状态
        updateGlobalLoginStatus();
        console.log('修复完成，已重新应用当前登录状态');
    }
};

console.log('认证控件显示测试工具已加载！');
console.log('可用命令:');
console.log('  window.testAuthDisplay.testToggleLogin()  - 测试登录/登出切换效果');
console.log('  window.testAuthDisplay.forceRepairAuthButtons()  - 强制修复认证控件显示');
console.log('  window.testAuthDisplay.reportCurrentState()  - 显示当前控件状态');
console.log('  window.testAuthDisplay.resetToOriginalState()  - 重置到初始状态');