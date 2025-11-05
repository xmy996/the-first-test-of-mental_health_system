// 测试认证按钮可见性的脚本
// 用于验证登录/登出后按钮显示状态的正确性

console.log('===== 认证按钮可见性测试脚本 =====');

// 测试函数 - 检查当前页面上的认证按钮状态
function testAuthButtonsVisibility() {
    console.log('\n[测试] 当前页面认证按钮状态检查');
    
    const buttonsToCheck = [
        { id: 'login-button', name: '登录按钮' },
        { id: 'register-button', name: '注册按钮' },
        { id: 'admin-login', name: '管理员入口' },
        { id: 'user-menu', name: '用户菜单' },
        { id: 'auth-buttons', name: '认证按钮容器' }
    ];
    
    buttonsToCheck.forEach(({ id, name }) => {
        const element = document.getElementById(id);
        if (element) {
            const computedStyle = window.getComputedStyle(element);
            const display = computedStyle.display;
            const hidden = element.classList.contains('hidden');
            const originalDisplay = element.getAttribute('data-original-display');
            
            console.log(`${name} (${id}):`);
            console.log(`  - 显示样式: ${display}`);
            console.log(`  - 是否有hidden类: ${hidden}`);
            console.log(`  - 原始显示样式: ${originalDisplay || '未保存'}`);
        } else {
            console.log(`${name} (${id}): 元素不存在`);
        }
    });
    
    // 检查当前登录状态
    const isLoggedIn = AuthManager.isLoggedIn();
    console.log(`\n当前登录状态: ${isLoggedIn ? '已登录' : '未登录'}`);
    if (isLoggedIn) {
        const userInfo = AuthManager.getUserInfo();
        console.log(`用户信息: ${userInfo ? AuthManager.getUserName() : '无'}`);
    }
}

// 模拟登录函数
function simulateLogin() {
    console.log('\n[操作] 模拟用户登录...');
    
    // 创建模拟用户数据
    const mockUser = {
        userId: '2236074782',
        username: '2236074782',
        email: 'test@example.com',
        name: '测试用户'
    };
    
    // 设置登录状态
    AuthManager.setLoginStatus(mockUser, 'mock-token-123456');
    
    // 更新UI
    updateGlobalLoginStatus();
    
    console.log('已模拟登录，刷新页面查看效果');
    setTimeout(() => {
        console.log('\n[测试] 登录后的按钮状态');
        testAuthButtonsVisibility();
    }, 500);
}

// 模拟登出函数
function simulateLogout() {
    console.log('\n[操作] 模拟用户登出...');
    
    // 清除登录状态
    AuthManager.clearLoginStatus();
    
    // 更新UI
    updateGlobalLoginStatus();
    
    console.log('已模拟登出，刷新页面查看效果');
    setTimeout(() => {
        console.log('\n[测试] 登出后的按钮状态');
        testAuthButtonsVisibility();
    }, 500);
}

// 强制保存按钮原始样式
function forceSaveButtonStyles() {
    console.log('\n[操作] 强制保存按钮原始样式...');
    
    const buttonsToSave = [
        { id: 'login-button', element: document.getElementById('login-button') },
        { id: 'register-button', element: document.getElementById('register-button') },
        { id: 'admin-login', element: document.getElementById('admin-login') }
    ];
    
    buttonsToSave.forEach(({ id, element }) => {
        if (element) {
            const computedStyle = window.getComputedStyle(element);
            const displayStyle = computedStyle.display;
            element.setAttribute('data-original-display', displayStyle);
            console.log(`已重新保存${id}的原始显示样式: ${displayStyle}`);
        }
    });
    
    console.log('样式保存完成，请重新测试登出功能');
}

// 重置所有认证按钮样式
function resetButtonStyles() {
    console.log('\n[操作] 重置所有认证按钮样式...');
    
    const buttonsToReset = [
        { id: 'login-button', element: document.getElementById('login-button') },
        { id: 'register-button', element: document.getElementById('register-button') },
        { id: 'admin-login', element: document.getElementById('admin-login') },
        { id: 'user-menu', element: document.getElementById('user-menu') },
        { id: 'auth-buttons', element: document.getElementById('auth-buttons') }
    ];
    
    buttonsToReset.forEach(({ id, element }) => {
        if (element) {
            // 移除data-original-display属性
            element.removeAttribute('data-original-display');
            // 移除style属性
            element.style.display = '';
            // 移除hidden类
            element.classList.remove('hidden');
            console.log(`已重置${id}的样式`);
        }
    });
    
    console.log('样式重置完成，请刷新页面重新初始化');
}

// 暴露测试函数到全局
window.testAuthButtons = {
    testVisibility: testAuthButtonsVisibility,
    simulateLogin: simulateLogin,
    simulateLogout: simulateLogout,
    saveStyles: forceSaveButtonStyles,
    resetStyles: resetButtonStyles
};

// 初始化测试
console.log('\n使用以下命令测试认证按钮可见性:');
console.log('1. 检查当前状态: window.testAuthButtons.testVisibility()');
console.log('2. 模拟登录: window.testAuthButtons.simulateLogin()');
console.log('3. 模拟登出: window.testAuthButtons.simulateLogout()');
console.log('4. 强制保存样式: window.testAuthButtons.saveStyles()');
console.log('5. 重置样式: window.testAuthButtons.resetStyles()');

// 自动执行初始测试
setTimeout(testAuthButtonsVisibility, 1000);