/**
 * 导航栏交互脚本
 * 提供导航栏的滚动效果、菜单切换、登录状态管理等功能
 */

class NavbarManager {
    constructor() {
        // 初始化导航栏元素
        this.nav = document.getElementById('main-nav');
        this.mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        this.mobileMenu = document.getElementById('mobile-menu');
        this.userMenuButton = document.getElementById('user-menu-button');
        this.userDropdown = document.getElementById('user-dropdown');
        this.moreMenuButton = document.getElementById('desktop-more-menu-button');
        this.moreDropdown = document.getElementById('desktop-more-dropdown');
        
        // 初始化
        this.init();
    }
    
    // 初始化函数
    init() {
        // 初始化滚动效果
        this.initScrollEffects();
        
        // 初始化移动端菜单
        this.initMobileMenu();
        
        // 初始化用户菜单
        this.initUserMenu();
        
        // 初始化更多菜单
        this.initMoreMenu();
        
        // 初始化登录状态
        this.checkAuthStatus();
        
        // 初始化当前页面高亮
        this.setCurrentPageHighlight();
        
        // 添加外部点击关闭下拉菜单功能
        this.initCloseOnClickOutside();
    }
    
    // 初始化滚动效果
    initScrollEffects() {
        if (!this.nav) return;
        
        const handleScroll = () => {
            if (window.scrollY > 10) {
                this.nav.classList.add('nav-scrolled', 'nav-shadow-scrolled');
                this.nav.classList.remove('py-4');
                this.nav.classList.add('py-3');
            } else {
                this.nav.classList.remove('nav-scrolled', 'nav-shadow-scrolled');
                this.nav.classList.remove('py-3');
                this.nav.classList.add('py-4');
            }
        };
        
        // 初始加载时执行一次
        handleScroll();
        
        // 添加滚动事件监听
        window.addEventListener('scroll', handleScroll);
    }
    
    // 初始化移动端菜单
    initMobileMenu() {
        if (!this.mobileMenuToggle || !this.mobileMenu) return;
        
        const mobileMenuIcon = this.mobileMenuToggle.querySelector('i');
        
        this.mobileMenuToggle.addEventListener('click', () => {
            this.mobileMenu.classList.toggle('hidden');
            
            if (!this.mobileMenu.classList.contains('hidden')) {
                this.mobileMenuToggle.setAttribute('aria-expanded', 'true');
                if (mobileMenuIcon.classList.contains('fa-bars')) {
                    mobileMenuIcon.classList.remove('fa-bars');
                    mobileMenuIcon.classList.add('fa-times');
                    mobileMenuIcon.classList.add('menu-icon-rotate');
                }
            } else {
                this.mobileMenuToggle.setAttribute('aria-expanded', 'false');
                if (mobileMenuIcon.classList.contains('fa-times')) {
                    mobileMenuIcon.classList.remove('fa-times');
                    mobileMenuIcon.classList.add('fa-bars');
                    mobileMenuIcon.classList.remove('menu-icon-rotate');
                    mobileMenuIcon.classList.add('menu-icon-unrotate');
                }
            }
        });
    }
    
    // 初始化用户菜单
    initUserMenu() {
        if (!this.userMenuButton || !this.userDropdown) return;
        
        this.userMenuButton.addEventListener('click', () => {
            this.userDropdown.classList.toggle('hidden');
            this.userMenuButton.setAttribute('aria-expanded', !this.userDropdown.classList.contains('hidden'));
        });
        
        // 退出登录功能
        const logoutButton = document.getElementById('logout-button');
        const mobileLogoutButton = document.getElementById('mobile-logout-button');
        
        if (logoutButton) {
            logoutButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
        
        if (mobileLogoutButton) {
            mobileLogoutButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
    }
    
    // 初始化更多菜单
    initMoreMenu() {
        if (!this.moreMenuButton || !this.moreDropdown) return;
        
        this.moreMenuButton.addEventListener('click', () => {
            this.moreDropdown.classList.toggle('hidden');
            this.moreMenuButton.setAttribute('aria-expanded', !this.moreDropdown.classList.contains('hidden'));
        });
    }
    
    // 检查登录状态
    checkAuthStatus() {
        // 尝试从localStorage获取用户信息
        const userInfo = localStorage.getItem('userInfo');
        
        if (userInfo) {
            try {
                const user = JSON.parse(userInfo);
                this.updateAuthUI(true, user.username || '用户');
            } catch (e) {
                console.error('解析用户信息失败:', e);
                this.updateAuthUI(false);
            }
        } else {
            this.updateAuthUI(false);
        }
    }
    
    // 更新认证UI
    updateAuthUI(isLoggedIn = false, username = '') {
        const authButtons = document.getElementById('auth-buttons');
        const userMenu = document.getElementById('user-menu');
        const mobileAuthButtons = document.getElementById('mobile-auth-buttons');
        const mobileUserMenu = document.getElementById('mobile-user-menu');
        
        if (isLoggedIn) {
            // 显示用户菜单，隐藏登录/注册按钮
            if (authButtons) authButtons.classList.add('hidden');
            if (userMenu) userMenu.classList.remove('hidden');
            if (mobileAuthButtons) mobileAuthButtons.parentElement.style.display = 'none';
            if (mobileUserMenu) mobileUserMenu.classList.remove('hidden');
            
            // 设置用户名
            if (document.getElementById('user-name')) {
                document.getElementById('user-name').textContent = username;
            }
            if (document.getElementById('mobile-user-name')) {
                document.getElementById('mobile-user-name').textContent = username;
            }
        } else {
            // 显示登录/注册按钮，隐藏用户菜单
            if (authButtons) authButtons.classList.remove('hidden');
            if (userMenu) userMenu.classList.add('hidden');
            if (mobileAuthButtons) mobileAuthButtons.parentElement.style.display = 'block';
            if (mobileUserMenu) mobileUserMenu.classList.add('hidden');
        }
    }
    
    // 退出登录
    logout() {
        // 清除localStorage中的用户信息
        localStorage.removeItem('userInfo');
        
        // 显示登录/注册按钮
        this.updateAuthUI(false);
        
        // 可以选择跳转到登录页或首页
        // window.location.href = 'login.html';
    }
    
    // 设置当前页面高亮
    setCurrentPageHighlight() {
        // 获取当前页面文件名
        const currentPath = window.location.pathname;
        const currentFile = currentPath.split('/').pop() || 'index.html';
        const currentPageName = currentFile.replace('.html', '');
        
        // 移除所有导航链接的活动状态
        document.querySelectorAll('.nav-link-active').forEach(link => {
            link.classList.remove('nav-link-active');
            link.classList.add('nav-link-hover');
        });
        
        // 为当前页面链接添加活动状态
        const activeLink = document.querySelector(`[href="${currentFile}"]`);
        if (activeLink) {
            activeLink.classList.remove('nav-link-hover');
            activeLink.classList.add('nav-link-active');
        } else {
            // 处理子页面，将相应的父导航项设置为活动状态
            // 咨询服务相关页面
            const consultingPages = ['booking', 'booking_history'];
            if (consultingPages.includes(currentPageName)) {
                const parentLink = document.querySelector('[href="consultant_list.html"]');
                if (parentLink) {
                    parentLink.classList.remove('nav-link-hover');
                    parentLink.classList.add('nav-link-active');
                }
            }
            
            // 团体活动相关页面
            const activityPages = ['activity_detail', 'activity_registration', 'activity_list_updated'];
            if (activityPages.includes(currentPageName)) {
                const parentLink = document.querySelector('[href="activity_list.html"]');
                if (parentLink) {
                    parentLink.classList.remove('nav-link-hover');
                    parentLink.classList.add('nav-link-active');
                }
            }
            
            // 放松体验相关页面
            const relaxationPages = ['relaxation_meditation', 'relaxation_biofeedback'];
            if (relaxationPages.includes(currentPageName)) {
                const parentLink = document.querySelector('[href="relaxation_music.html"]');
                if (parentLink) {
                    parentLink.classList.remove('nav-link-hover');
                    parentLink.classList.add('nav-link-active');
                }
            }
            
            // 登录相关页面
            const authPages = ['login', 'register', 'forgot_password', 'admin_login'];
            if (authPages.includes(currentPageName)) {
                // 登录相关页面保持首页样式，将首页导航项设置为高亮
                const homeLink = document.querySelector('[href="index.html"]');
                if (homeLink) {
                    homeLink.classList.remove('nav-link-hover');
                    homeLink.classList.add('nav-link-active');
                }
            }
        }
    }
    
    // 初始化点击外部关闭下拉菜单
    initCloseOnClickOutside() {
        document.addEventListener('click', (e) => {
            // 关闭用户下拉菜单
            if (this.userMenuButton && this.userDropdown && 
                !this.userMenuButton.contains(e.target) && 
                !this.userDropdown.contains(e.target)) {
                this.userDropdown.classList.add('hidden');
                this.userMenuButton.setAttribute('aria-expanded', 'false');
            }
            
            // 关闭更多下拉菜单
            if (this.moreMenuButton && this.moreDropdown && 
                !this.moreMenuButton.contains(e.target) && 
                !this.moreDropdown.contains(e.target)) {
                this.moreDropdown.classList.add('hidden');
                this.moreMenuButton.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

// 页面加载完成后初始化导航栏
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new NavbarManager());
} else {
    new NavbarManager();
}