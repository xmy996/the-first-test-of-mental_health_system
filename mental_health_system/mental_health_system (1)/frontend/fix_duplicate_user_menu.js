/**
 * 修复重复用户菜单和导航栏元素问题的脚本
 * 防止导航栏替换后出现多个用户菜单、登录按钮或导航栏本身
 */

function fixDuplicateNavbarElements() {
    // 检查导航栏容器
    const mainNavs = document.querySelectorAll('#main-nav');
    if (mainNavs.length > 1) {
        // 移除除了第一个之外的所有导航栏
        for (let i = 1; i < mainNavs.length; i++) {
            mainNavs[i].remove();
        }
        console.log(`✅ 已修复重复的主导航栏，保留1个，移除${mainNavs.length - 1}个`);
    }
    
    // 检查桌面端用户菜单
    const userMenuElements = document.querySelectorAll('#user-menu');
    if (userMenuElements.length > 1) {
        // 移除除了第一个之外的所有用户菜单
        for (let i = 1; i < userMenuElements.length; i++) {
            userMenuElements[i].remove();
        }
        console.log(`✅ 已修复重复的桌面端用户菜单，保留1个，移除${userMenuElements.length - 1}个`);
    }
    
    // 检查移动端用户菜单
    const mobileUserMenuElements = document.querySelectorAll('#mobile-user-menu');
    if (mobileUserMenuElements.length > 1) {
        // 移除除了第一个之外的所有移动端用户菜单
        for (let i = 1; i < mobileUserMenuElements.length; i++) {
            mobileUserMenuElements[i].remove();
        }
        console.log(`✅ 已修复重复的移动端用户菜单，保留1个，移除${mobileUserMenuElements.length - 1}个`);
    }
    
    // 检查登录按钮区域
    const authButtons = document.querySelectorAll('#auth-buttons');
    if (authButtons.length > 1) {
        // 移除除了第一个之外的所有登录按钮区域
        for (let i = 1; i < authButtons.length; i++) {
            authButtons[i].remove();
        }
        console.log(`✅ 已修复重复的登录按钮区域，保留1个，移除${authButtons.length - 1}个`);
    }
    
    // 检查移动端菜单
    const mobileMenus = document.querySelectorAll('#mobile-menu');
    if (mobileMenus.length > 1) {
        // 移除除了第一个之外的所有移动端菜单
        for (let i = 1; i < mobileMenus.length; i++) {
            mobileMenus[i].remove();
        }
        console.log(`✅ 已修复重复的移动端菜单，保留1个，移除${mobileMenus.length - 1}个`);
    }
    
    // 确保脚本只加载一次（延迟执行，确保所有脚本都已加载）
    setTimeout(() => {
        const navbarScripts = document.querySelectorAll('script[src="navbar.js"]');
        if (navbarScripts.length > 1) {
            // 移除重复的脚本引用
            for (let i = 1; i < navbarScripts.length; i++) {
                navbarScripts[i].remove();
            }
            console.log(`✅ 已修复重复的导航栏脚本，保留1个，移除${navbarScripts.length - 1}个`);
        }
    }, 500);
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', fixDuplicateNavbarElements);

// 窗口大小变化时再次检查
window.addEventListener('resize', fixDuplicateNavbarElements);

// 延迟执行一次，确保所有动态内容都已加载
setTimeout(fixDuplicateNavbarElements, 1000);