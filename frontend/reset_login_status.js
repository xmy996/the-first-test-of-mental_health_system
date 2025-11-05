// 重置登录状态脚本
// 用于清除所有登录相关数据，确保测试环境干净

// 执行重置操作
function resetLoginStatus() {
    console.log('开始重置登录状态...');
    
    // 清除所有可能的认证数据
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('token');
    
    console.log('已清除所有登录相关数据');
    console.log('localStorage当前内容:', Object.keys(localStorage));
    
    // 显示重置成功消息
    alert('登录状态已重置！\n您现在处于未登录状态，可以开始测试登录流程。');
    
    // 刷新页面以应用更改
    window.location.reload();
}

// 如果直接在浏览器中打开这个文件，自动执行重置
if (window.location.pathname.includes('reset_login_status.js')) {
    resetLoginStatus();
} else {
    // 否则添加一个按钮到页面
    document.addEventListener('DOMContentLoaded', function() {
        const resetButton = document.createElement('button');
        resetButton.innerText = '重置登录状态';
        resetButton.style.position = 'fixed';
        resetButton.style.bottom = '4rem';
        resetButton.style.right = '4rem';
        resetButton.style.padding = '0.75rem 1.5rem';
        resetButton.style.backgroundColor = '#ef4444';
        resetButton.style.color = 'white';
        resetButton.style.border = 'none';
        resetButton.style.borderRadius = '0.5rem';
        resetButton.style.cursor = 'pointer';
        resetButton.style.zIndex = '9999';
        resetButton.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        
        resetButton.addEventListener('click', resetLoginStatus);
        document.body.appendChild(resetButton);
        
        console.log('重置登录状态按钮已添加到页面右下角');
    });
}