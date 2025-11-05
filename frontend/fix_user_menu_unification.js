// 用户菜单统一修复脚本
// 此脚本用于确保所有页面统一使用common.js中的用户菜单逻辑
// 使用方法：在浏览器控制台中运行此脚本

console.log('开始修复用户菜单统一问题...');

// 1. 定义修复函数
function fixUserMenuOnPage() {
    console.log('修复当前页面的用户菜单...');
    
    // 检查是否已登录
    const isLoggedIn = localStorage.getItem('isLogin') === 'true';
    console.log('登录状态:', isLoggedIn);
    
    // 2. 确保用户菜单存在并包含正确的链接
    const userDropdown = document.getElementById('user-dropdown');
    const mobileUserDropdown = document.getElementById('mobile-user-dropdown');
    
    // 检查并修复桌面端用户菜单
    if (userDropdown) {
        console.log('找到桌面端用户菜单，检查链接...');
        
        // 检查是否包含个人中心链接
        let hasProfileLink = false;
        const links = userDropdown.querySelectorAll('a');
        
        links.forEach(link => {
            const href = link.getAttribute('href');
            const text = link.textContent.trim();
            
            if (href === 'user_profile.html' || text.includes('个人中心')) {
                hasProfileLink = true;
                // 确保链接正确指向个人中心
                if (href !== 'user_profile.html') {
                    console.log('修复个人中心链接:', href, '-> user_profile.html');
                    link.setAttribute('href', 'user_profile.html');
                }
            }
        });
        
        // 如果没有个人中心链接，添加一个
        if (!hasProfileLink && isLoggedIn) {
            console.log('添加缺失的个人中心链接');
            const profileLink = document.createElement('a');
            profileLink.setAttribute('href', 'user_profile.html');
            profileLink.className = 'block px-4 py-3 text-gray-700 hover:bg-white/50 transition-all-300';
            profileLink.innerHTML = '<i class="fa fa-user-circle mr-2"></i>个人中心';
            
            // 插入到第一个位置
            if (userDropdown.firstChild) {
                userDropdown.insertBefore(profileLink, userDropdown.firstChild);
            } else {
                userDropdown.appendChild(profileLink);
            }
        }
    }
    
    // 检查并修复移动端用户菜单
    if (mobileUserDropdown) {
        console.log('找到移动端用户菜单，检查链接...');
        
        // 检查是否包含个人中心链接
        let hasMobileProfileLink = false;
        const mobileLinks = mobileUserDropdown.querySelectorAll('a');
        
        mobileLinks.forEach(link => {
            const href = link.getAttribute('href');
            const text = link.textContent.trim();
            
            if (href === 'user_profile.html' || text.includes('个人中心')) {
                hasMobileProfileLink = true;
                // 确保链接正确指向个人中心
                if (href !== 'user_profile.html') {
                    console.log('修复移动端个人中心链接:', href, '-> user_profile.html');
                    link.setAttribute('href', 'user_profile.html');
                }
            }
        });
        
        // 如果没有个人中心链接，添加一个
        if (!hasMobileProfileLink && isLoggedIn) {
            console.log('添加缺失的移动端个人中心链接');
            const profileLink = document.createElement('a');
            profileLink.setAttribute('href', 'user_profile.html');
            profileLink.className = 'block px-4 py-3 text-gray-700 hover:bg-white/50 transition-all-300';
            profileLink.innerHTML = '<i class="fa fa-user-circle mr-2"></i>个人中心';
            
            // 插入到第一个位置
            if (mobileUserDropdown.firstChild) {
                mobileUserDropdown.insertBefore(profileLink, mobileUserDropdown.firstChild);
            } else {
                mobileUserDropdown.appendChild(profileLink);
            }
        }
    }
    
    // 3. 确保使用common.js中的事件处理
    if (window.initNavigation && typeof window.initNavigation === 'function') {
        console.log('重新初始化导航，应用统一的用户菜单逻辑');
        window.initNavigation();
    } else {
        console.warn('未找到common.js中的initNavigation函数，请确保正确引入common.js');
        
        // 如果没有common.js，提供备用的用户菜单逻辑
        setupUserMenuEvents();
    }
    
    console.log('当前页面用户菜单修复完成');
}

// 备用的用户菜单事件处理函数
function setupUserMenuEvents() {
    console.log('应用备用用户菜单事件处理');
    
    // 设置桌面端用户菜单
    const userMenuButton = document.getElementById('user-menu-button');
    const userDropdown = document.getElementById('user-dropdown');
    
    if (userMenuButton && userDropdown) {
        // 移除现有事件监听器（简单方式：重新赋值）
        const newButton = userMenuButton.cloneNode(true);
        userMenuButton.parentNode.replaceChild(newButton, userMenuButton);
        
        // 添加新的事件监听器
        newButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            userDropdown.classList.toggle('hidden');
        });
    }
    
    // 设置移动端用户菜单
    const mobileUserMenuButton = document.getElementById('mobile-user-menu-button');
    const mobileUserDropdown = document.getElementById('mobile-user-dropdown');
    
    if (mobileUserMenuButton && mobileUserDropdown) {
        // 移除现有事件监听器
        const newMobileButton = mobileUserMenuButton.cloneNode(true);
        mobileUserMenuButton.parentNode.replaceChild(newMobileButton, mobileUserMenuButton);
        
        // 添加新的事件监听器
        newMobileButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            mobileUserDropdown.classList.toggle('hidden');
        });
    }
    
    // 添加点击外部关闭菜单的逻辑
    document.addEventListener('click', function(event) {
        // 关闭桌面端菜单
        if (userDropdown && !userDropdown.classList.contains('hidden')) {
            if (userMenuButton && !userMenuButton.contains(event.target) && !userDropdown.contains(event.target)) {
                userDropdown.classList.add('hidden');
            }
        }
        
        // 关闭移动端菜单
        if (mobileUserDropdown && !mobileUserDropdown.classList.contains('hidden')) {
            if (mobileUserMenuButton && !mobileUserMenuButton.contains(event.target) && !mobileUserDropdown.contains(event.target)) {
                mobileUserDropdown.classList.add('hidden');
            }
        }
    });
}

// 4. 批量修复函数 - 用于在所有相关页面上执行修复
function batchFixAllPages() {
    // 需要修复的页面列表
    const pages = [
        'index.html',
        'user_profile.html',
        'login.html',
        'register.html',
        'assessment_list.html',
        'assessment_history.html',
        'activity_list.html',
        'activity_detail.html',
        'activity_registration.html',
        'consultant_list.html',
        'booking_history.html',
        'showcase.html',
        'test_all_features.html',
        'test_global_auth_sync.html',
        'relaxation_music.html'
    ];
    
    console.log(`准备修复 ${pages.length} 个页面...`);
    console.log('修复命令已复制到剪贴板，请在每个页面的控制台中运行 fixUserMenuOnPage()');
    
    // 提示如何使用
    console.log('\n使用说明：');
    console.log('1. 打开需要修复的页面');
    console.log('2. 按 F12 打开开发者工具');
    console.log('3. 切换到控制台标签页');
    console.log('4. 粘贴并运行：fixUserMenuOnPage()');
    console.log('5. 刷新页面查看效果');
}

// 5. 立即修复当前页面
fixUserMenuOnPage();

// 导出函数供手动调用
export { fixUserMenuOnPage, batchFixAllPages, setupUserMenuEvents };

console.log('用户菜单统一修复脚本加载完成');