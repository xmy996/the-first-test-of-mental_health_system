// 心理实验导航更新脚本
// 功能：1. 在所有页面的更多服务下拉菜单中添加心理实验链接
//       2. 确保心理实验页面同步登录状态
//       3. 更新所有心理实验页面的导航栏

class ExperimentNavigationUpdater {
    constructor() {
        this.init();
    }

    // 初始化更新
    init() {
        if (typeof document !== 'undefined' && document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.updateNavigation());
        } else if (typeof document !== 'undefined') {
            this.updateNavigation();
        }
    }

    // 更新所有导航元素
    updateNavigation() {
        console.log('开始更新心理实验导航...');
        
        // 1. 更新桌面端更多服务下拉菜单
        this.updateDesktopMoreMenu();
        
        // 2. 更新移动端导航菜单
        this.updateMobileMenu();
        
        // 3. 确保心理实验页面的登录状态同步
        this.ensureLoginSync();
        
        // 4. 为心理实验页面添加导航栏引用（如果需要）
        this.addNavbarToExperimentPages();
        
        console.log('心理实验导航更新完成');
    }

    // 更新桌面端更多服务下拉菜单
    updateDesktopMoreMenu() {
        const dropdownMenus = document.querySelectorAll('#desktop-more-dropdown');
        
        dropdownMenus.forEach(menu => {
            // 检查是否已经有心理实验链接
            if (!menu.querySelector('a[href="psychology_experiments.html"]')) {
                // 创建心理实验链接
                const experimentLink = document.createElement('a');
                experimentLink.href = 'psychology_experiments.html';
                experimentLink.className = 'block px-4 py-3 text-gray-700 hover:bg-white/50 transition-all duration-300';
                experimentLink.innerHTML = '<i class="fa fa-flask mr-2"></i>心理实验';
                experimentLink.setAttribute('aria-label', '心理实验');
                
                // 添加到菜单末尾
                menu.appendChild(experimentLink);
                console.log('已在桌面端更多服务菜单添加心理实验链接');
            }
        });
        
        // 处理可能存在的其他更多服务菜单
        const moreServiceMenus = document.querySelectorAll('[class*="dropdown"][id*="more"]');
        moreServiceMenus.forEach(menu => {
            if (!menu.querySelector('a[href="psychology_experiments.html"]') && 
                menu.classList.contains('dropdown')) {
                const experimentLink = document.createElement('a');
                experimentLink.href = 'psychology_experiments.html';
                experimentLink.className = 'block px-4 py-3 text-gray-700 hover:bg-white/50 transition-all duration-300';
                experimentLink.innerHTML = '<i class="fa fa-flask mr-2"></i>心理实验';
                experimentLink.setAttribute('aria-label', '心理实验');
                
                menu.appendChild(experimentLink);
            }
        });
    }

    // 更新移动端导航菜单
    updateMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenu && !mobileMenu.querySelector('a[href="psychology_experiments.html"]')) {
            // 找到合适的位置插入（在心理游戏后面）
            const mentalGamesLink = mobileMenu.querySelector('a[href="mental_games.html"]');
            
            const experimentLink = document.createElement('a');
            experimentLink.href = 'psychology_experiments.html';
            experimentLink.className = 'mobile-nav-link nav-link-hover flex items-center';
            experimentLink.innerHTML = '<i class="fa fa-flask mr-2"></i>心理实验';
            experimentLink.setAttribute('aria-label', '心理实验');
            
            if (mentalGamesLink) {
                mentalGamesLink.after(experimentLink);
            } else {
                // 如果心理游戏链接不存在，就添加到末尾
                const authSection = mobileMenu.querySelector('#mobile-auth-buttons');
                if (authSection) {
                    authSection.before(experimentLink);
                } else {
                    mobileMenu.appendChild(experimentLink);
                }
            }
            
            console.log('已在移动端导航菜单添加心理实验链接');
        }
    }

    // 确保登录状态同步
    ensureLoginSync() {
        // 立即尝试更新登录状态
        this.forceUpdateLoginStatus();
        
        // 检查是否已加载AuthManager
        if (window.AuthManager) {
            // 减少事件监听器数量，避免过度触发
            window.addEventListener('storage', (e) => {
                if (e.key === 'isLogin' || e.key === 'user_data' || e.key === 'auth_token') {
                    // 添加防抖处理
                    if (this._storageTimeout) {
                        clearTimeout(this._storageTimeout);
                    }
                    this._storageTimeout = setTimeout(() => {
                        this.forceUpdateLoginStatus();
                    }, 200);
                }
            });
            
            // 保留关键事件，但减少触发频率
            const debouncedUpdate = this.debounce(() => this.forceUpdateLoginStatus(), 300);
            
            window.addEventListener('focus', debouncedUpdate);
            window.addEventListener('pageshow', debouncedUpdate);
            
            // 只监听用户登录和登出事件，不再监听其他全局更新事件
            window.addEventListener('userLoggedIn', () => {
                console.log('检测到用户登录事件');
                this.forceUpdateLoginStatus();
            });
            
            window.addEventListener('userLoggedOut', () => {
                console.log('检测到用户登出事件');
                this.forceUpdateLoginStatus();
            });
        }
    },
    
    // 防抖函数，避免频繁触发
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // 强制更新登录状态，避免循环引用
    forceUpdateLoginStatus() {
        console.log('强制更新心理实验页面登录状态');
        
        // 添加防重入标记，防止无限递归
        if (window._experimentLoginUpdateInProgress) {
            console.log('登录状态更新已经在进行中，避免重复触发');
            return;
        }
        
        window._experimentLoginUpdateInProgress = true;
        
        try {
            // 直接使用AuthManager进行状态检查，不再调用全局函数避免循环
            if (window.AuthManager) {
                this.updateLoginDisplay();
                console.log('使用AuthManager更新登录状态');
            } else {
                console.warn('无法找到AuthManager');
            }
            
            // 为实验页面特定元素添加登录状态类
            this.updateExperimentPageElements();
        } catch (error) {
            console.error('更新登录状态时出错:', error);
        } finally {
            // 清除防重入标记
            setTimeout(() => {
                window._experimentLoginUpdateInProgress = false;
            }, 100); // 延迟清除，确保不会在短时间内重复触发
        }
    }

    // 更新登录显示
    updateLoginDisplay() {
        const authButtons = document.getElementById('auth-buttons');
        const userMenu = document.getElementById('user-menu');
        const mobileAuthButtons = document.getElementById('mobile-auth-buttons');
        const mobileUserMenu = document.getElementById('mobile-user-menu');
        const userName = document.getElementById('user-name');
        const mobileUserName = document.getElementById('mobile-user-name');
        
        let isLoggedIn = false;
        let userInfo = null;
        
        // 检查登录状态
        if (window.AuthManager) {
            isLoggedIn = window.AuthManager.isLoggedIn();
            userInfo = window.AuthManager.getUserInfo();
        } else if (typeof localStorage !== 'undefined') {
            isLoggedIn = localStorage.getItem('isLogin') === 'true';
            try {
                userInfo = JSON.parse(localStorage.getItem('user_data'));
            } catch (e) {
                console.error('解析用户数据失败');
            }
        }
        
        // 更新桌面端显示
        if (authButtons && userMenu) {
            authButtons.classList.toggle('hidden', isLoggedIn);
            userMenu.classList.toggle('hidden', !isLoggedIn);
        }
        
        // 更新移动端显示
        if (mobileAuthButtons && mobileUserMenu) {
            mobileAuthButtons.classList.toggle('hidden', isLoggedIn);
            mobileUserMenu.classList.toggle('hidden', !isLoggedIn);
        }
        
        // 更新用户名
        if (isLoggedIn && userInfo) {
            const displayName = userInfo.name || userInfo.username || userInfo.email?.split('@')[0] || '用户';
            if (userName) userName.textContent = displayName;
            if (mobileUserName) mobileUserName.textContent = displayName;
        }
    }

    // 为心理实验页面添加导航栏引用
    addNavbarToExperimentPages() {
        // 检查当前页面是否是心理实验页面
        const experimentPages = [
            'psychology_experiments.html',
            'stroop_experiment.html',
            'memory-span_experiment.html',
            'visual-search_experiment.html',
            'emotion-recognition_experiment.html',
            'affective-priming_experiment.html',
            'asch-conformity_experiment.html',
            'prisoners-dilemma_experiment.html',
            'iat_experiment.html'
        ];
        
        const currentPage = window.location.pathname.split('/').pop();
        if (experimentPages.includes(currentPage) && !document.querySelector('#main-nav')) {
            // 尝试通过iframe加载导航栏
            const navbarContainer = document.createElement('div');
            navbarContainer.id = 'navbar-container';
            navbarContainer.style.position = 'fixed';
            navbarContainer.style.top = '0';
            navbarContainer.style.left = '0';
            navbarContainer.style.right = '0';
            navbarContainer.style.zIndex = '50';
            
            const iframe = document.createElement('iframe');
            iframe.src = 'components/navbar.html';
            iframe.style.width = '100%';
            iframe.style.height = '60px';
            iframe.style.border = 'none';
            iframe.style.display = 'block';
            
            navbarContainer.appendChild(iframe);
            document.body.prepend(navbarContainer);
            
            // 调整页面内容的上边距
            document.body.style.paddingTop = '60px';
            
            console.log('已为心理实验页面添加导航栏');
        }
    }

    // 为所有实验页面添加登录同步
    ensureExperimentPageSync() {
        // 为所有实验页面添加统一的登录状态检查
        const experimentUrls = [
            'psychology_experiments.html',
            'stroop_experiment.html',
            'memory-span_experiment.html',
            'visual-search_experiment.html',
            'emotion-recognition_experiment.html',
            'affective-priming_experiment.html',
            'asch-conformity_experiment.html',
            'prisoners-dilemma_experiment.html',
            'iat_experiment.html'
        ];
        
        const currentUrl = window.location.pathname.split('/').pop();
        
        if (experimentUrls.includes(currentUrl)) {
            console.log(`检测到实验页面: ${currentUrl}，启用登录状态同步`);
            
            // 页面加载时立即执行一次
            this.forceUpdateLoginStatus();
            
            // 添加定时检查以确保状态同步 - 频率提高到2秒
            setInterval(() => {
                this.forceUpdateLoginStatus();
            }, 2000); // 每2秒检查一次
            
            // 当用户操作时也检查
            document.addEventListener('click', () => {
                this.forceUpdateLoginStatus();
            }, { passive: true });
            
            // 监听键盘事件
            document.addEventListener('keydown', () => {
                this.forceUpdateLoginStatus();
            }, { passive: true });
            
            // 监听滚动事件
            window.addEventListener('scroll', () => {
                this.forceUpdateLoginStatus();
            }, { passive: true });
        }
    }
    
    // 更新实验页面特定元素的登录状态
    updateExperimentPageElements() {
        const isLoggedIn = window.AuthManager ? window.AuthManager.isLoggedIn() : localStorage.getItem('isLogin') === 'true';
        
        // 添加全局登录状态类到body
        if (isLoggedIn) {
            document.body.classList.add('user-is-logged-in');
            document.body.classList.remove('user-is-not-logged-in');
        } else {
            document.body.classList.add('user-is-not-logged-in');
            document.body.classList.remove('user-is-logged-in');
        }
        
        // 处理实验页面中需要登录的按钮和元素
        document.querySelectorAll('.experiment-button, .start-experiment-btn').forEach(button => {
            if (isLoggedIn) {
                button.classList.remove('requires-login');
                button.removeAttribute('disabled');
            } else {
                button.classList.add('requires-login');
                // 不禁用按钮，但可以添加提示
            }
        });
        
        // 显示或隐藏登录提示区域
        const loginPrompts = document.querySelectorAll('.login-prompt');
        loginPrompts.forEach(prompt => {
            prompt.classList.toggle('hidden', isLoggedIn);
        });
    }

    // 修复可能的导航栏样式问题
    fixNavbarStyles() {
        const nav = document.getElementById('main-nav');
        if (nav) {
            // 确保导航栏样式正确
            nav.classList.add('fixed', 'top-0', 'left-0', 'right-0', 'z-50');
            
            // 设置背景效果
            if (!nav.classList.contains('glass-effect')) {
                nav.classList.add('glass-effect');
            }
        }
    }

    // 确保导航栏的下拉菜单功能正常
    ensureDropdownFunctionality() {
        // 桌面端更多服务菜单
        const moreButton = document.getElementById('desktop-more-menu-button');
        const moreDropdown = document.getElementById('desktop-more-dropdown');
        
        if (moreButton && moreDropdown) {
            moreButton.addEventListener('click', (e) => {
                e.stopPropagation();
                moreDropdown.classList.toggle('hidden');
            });
        }
        
        // 用户菜单
        const userButton = document.getElementById('user-menu-button');
        const userDropdown = document.getElementById('user-dropdown');
        
        if (userButton && userDropdown) {
            userButton.addEventListener('click', (e) => {
                e.stopPropagation();
                userDropdown.classList.toggle('hidden');
            });
        }
        
        // 移动端菜单
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileToggle && mobileMenu) {
            mobileToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                mobileMenu.classList.toggle('hidden');
            });
        }
        
        // 点击其他区域关闭下拉菜单
        document.addEventListener('click', () => {
            const dropdowns = document.querySelectorAll('.dropdown-appear:not(.hidden), #user-dropdown:not(.hidden)');
            dropdowns.forEach(dropdown => {
                dropdown.classList.add('hidden');
            });
        });
    }

    // 为所有实验页面添加响应式样式
    addResponsiveStyles() {
        // 检查是否已加载响应式样式
        if (!document.querySelector('link[href="experiments-responsive.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'experiments-responsive.css';
            document.head.appendChild(link);
            console.log('已添加实验响应式样式');
        }
    }
}

// 导出类，使其可以在其他地方使用
if (typeof module !== 'undefined') {
    module.exports = ExperimentNavigationUpdater;
}

// 自动初始化
if (typeof document !== 'undefined') {
    // 立即执行一次，不等待DOMContentLoaded
    const earlyInit = () => {
        if (window.AuthManager || window.updateGlobalLoginStatus) {
            // 强制更新登录状态
            if (typeof window.updateGlobalLoginStatus === 'function') {
                window.updateGlobalLoginStatus();
            }
        }
    };
    
    // 尝试早期初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            earlyInit();
            const updater = new ExperimentNavigationUpdater();
            updater.fixNavbarStyles();
            updater.ensureDropdownFunctionality();
            updater.addResponsiveStyles();
            updater.ensureExperimentPageSync();
        });
    } else {
        // 页面已经加载，立即执行
        earlyInit();
        const updater = new ExperimentNavigationUpdater();
        updater.fixNavbarStyles();
        updater.ensureDropdownFunctionality();
        updater.addResponsiveStyles();
        updater.ensureExperimentPageSync();
    }
    
    // 暴露给全局，方便手动调用
    window.ExperimentNavigationUpdater = ExperimentNavigationUpdater;
    
    // 暴露强制更新方法
    window.forceExperimentLoginSync = () => {
        console.log('调用全局forceExperimentLoginSync');
        // 避免每次都创建新实例，使用单例模式
        if (!window._experimentNavUpdater) {
            window._experimentNavUpdater = new ExperimentNavigationUpdater();
        }
        window._experimentNavUpdater.forceUpdateLoginStatus();
    };
}