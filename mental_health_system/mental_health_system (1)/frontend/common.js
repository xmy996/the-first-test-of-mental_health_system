// 全局功能库
// 引入增强UI模块
// <script src="enhanced_ui.js"></script> 将在HTML中动态引入
// 全局登录状态管理模块
const AuthManager = {
    // 检查是否已登录
    isLoggedIn: function() {
        const token = localStorage.getItem('auth_token');
        return !!token;
    },
    
    // 获取用户信息
    getUserInfo: function() {
        try {
            const userData = JSON.parse(localStorage.getItem('user_data'));
            return userData || null;
        } catch (e) {
            console.error('解析用户数据失败:', e);
            return null;
        }
    },
    
    // 设置登录状态
    setLoginStatus: function(userData, token) {
        // 存储统一的登录状态标识
        localStorage.setItem('isLogin', 'true');
        // 存储用户信息
        localStorage.setItem('user_data', JSON.stringify(userData));
        // 存储认证令牌
        localStorage.setItem('auth_token', token);
        
        // 清除可能存在的旧token
        localStorage.removeItem('token');
        
        console.log('登录状态已设置:', { userId: userData.userId, email: userData.email });
    },
    
    // 清除登录状态
    clearLoginStatus: function() {
        // 清除所有相关存储项
        localStorage.removeItem('isLogin');
        localStorage.removeItem('user_data');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('token');
        
        console.log('登录状态已清除');
    },
    
    // 获取用户名（支持多种字段名）
    getUserName: function() {
        const userData = this.getUserInfo();
        if (!userData) return '';
        
        return userData.name || userData.username || userData.email.split('@')[0] || '用户';
    }
};

class MentalHealthSystem {
    constructor() {
        this.init();
    }

    // 初始化所有功能
    init() {
        this.setupNavbarScrollEffect();
        this.setupMobileMenuToggle();
        this.setupDropdownMenus();
        this.setupFormAnimations();
        this.setupButtonAnimations();
        this.setupBackgroundAnimations();
        this.setupSmoothScroll();
        
        // 动态引入增强UI模块
        this.loadEnhancedUI();
    }
    
    // 动态加载增强UI功能
    loadEnhancedUI() {
        // 检查是否已加载
        if (document.querySelector('script[src="enhanced_ui.js"]')) {
            console.log('增强UI模块已加载');
            return;
        }
        
        // 先加载CSS
        this.loadEnhancedUICSS();
        
        // 创建并添加script标签
        const script = document.createElement('script');
        script.src = 'enhanced_ui.js';
        script.async = true;
        script.onload = () => {
            console.log('增强UI模块加载成功');
        };
        script.onerror = () => {
            console.error('增强UI模块加载失败');
        };
        
        document.head.appendChild(script);
    }
    
    // 动态加载增强UI样式
    loadEnhancedUICSS() {
        // 检查是否已加载
        if (document.querySelector('link[href="enhanced_ui.css"]')) {
            console.log('增强UI样式已加载');
            return;
        }
        
        // 创建并添加link标签
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'enhanced_ui.css';
        link.onload = () => {
            console.log('增强UI样式加载成功');
        };
        link.onerror = () => {
            console.error('增强UI样式加载失败');
        };
        
        document.head.appendChild(link);
    }

    // 导航栏滚动效果
    setupNavbarScrollEffect() {
        const navbar = document.getElementById('navbar') || document.getElementById('main-nav');
        if (navbar) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 10) {
                    navbar.classList.add('nav-scrolled', 'shadow-lg');
                    navbar.classList.remove('py-3');
                    navbar.classList.add('py-2');
                } else {
                    navbar.classList.remove('nav-scrolled', 'shadow-lg');
                    navbar.classList.remove('py-2');
                    navbar.classList.add('py-3');
                }
                
                // 统一导航项高亮处理
                updateActiveNavItem();
            });
        }
    }

    // 移动端菜单切换
    setupMobileMenuToggle() {
        const menuToggle = document.getElementById('menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (menuToggle && mobileMenu) {
            menuToggle.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
                if (!mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('animate-fade-in');
                }
            });

            // 点击外部关闭菜单
            document.addEventListener('click', (event) => {
                if (!menuToggle.contains(event.target) && !mobileMenu.contains(event.target) && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            });
        }
    }

    // 下拉菜单功能
    setupDropdownMenus() {
        const dropdownToggles = document.querySelectorAll('[data-dropdown-toggle]');
        
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const dropdownId = toggle.getAttribute('data-dropdown-toggle');
                const dropdown = document.getElementById(dropdownId);
                
                if (dropdown) {
                    dropdown.classList.toggle('hidden');
                    if (!dropdown.classList.contains('hidden')) {
                        dropdown.classList.add('animate-fade-in');
                    }
                }
            });
        });

        // 点击外部关闭所有下拉菜单
        document.addEventListener('click', () => {
            document.querySelectorAll('[data-dropdown]').forEach(dropdown => {
                dropdown.classList.add('hidden');
            });
        });
    }

    // 表单动画效果
    setupFormAnimations() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, select, textarea');
            
            inputs.forEach(input => {
                // 聚焦动画
                input.addEventListener('focus', () => {
                    const parent = input.closest('.form-input-focus') || input.parentElement;
                    parent.classList.add('scale-[1.02]');
                    parent.style.transition = 'transform 0.3s ease';
                });
                
                // 失焦动画
                input.addEventListener('blur', () => {
                    const parent = input.closest('.form-input-focus') || input.parentElement;
                    parent.classList.remove('scale-[1.02]');
                });
            });

            // 提交按钮动画
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) {
                form.addEventListener('submit', (e) => {
                    submitButton.classList.add('scale-95');
                    setTimeout(() => {
                        submitButton.classList.remove('scale-95');
                    }, 300);
                });
            }
        });
    }

    // 按钮动画效果
    setupButtonAnimations() {
        const buttons = document.querySelectorAll('.btn-primary, .btn-outline');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'scale(1.03)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'scale(1)';
            });
            
            button.addEventListener('mousedown', () => {
                button.style.transform = 'scale(0.97)';
            });
            
            button.addEventListener('mouseup', () => {
                button.style.transform = 'scale(1.03)';
            });
        });
    }

    // 背景动画效果
    setupBackgroundAnimations() {
        const shapes = document.querySelectorAll('.shape');
        
        shapes.forEach(shape => {
            // 随机移动效果
            setInterval(() => {
                const randomX = Math.random() * 20 - 10;
                const randomY = Math.random() * 20 - 10;
                shape.style.transform = `translate(${randomX}px, ${randomY}px)`;
            }, 5000 + Math.random() * 5000);

            // 初始随机位置
            const initialX = Math.random() * 10 - 5;
            const initialY = Math.random() * 10 - 5;
            shape.style.transform = `translate(${initialX}px, ${initialY}px)`;
        });
    }

    // 平滑滚动功能
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // 显示通知
    showNotification(message, type = 'info') {
        // 移除之前的通知
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // 创建新通知
        const notification = document.createElement('div');
        notification.className = `notification ${type} animate-fade-in`;
        
        let iconClass = 'fa-info-circle';
        if (type === 'success') iconClass = 'fa-check-circle';
        if (type === 'error') iconClass = 'fa-exclamation-circle';
        
        notification.innerHTML = `
            <i class="fa ${iconClass} mr-2"></i>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        // 显示通知
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // 自动关闭
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
        
        // 点击关闭
        notification.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
    }

    // 表单验证助手
    validateField(field) {
        const value = field.value.trim();
        const errorElement = field.nextElementSibling && field.nextElementSibling.classList.contains('error-message') 
            ? field.nextElementSibling 
            : null;
        
        if (!value) {
            if (errorElement) {
                errorElement.textContent = '此字段不能为空';
                errorElement.classList.remove('hidden');
            }
            field.classList.add('border-red-500');
            return false;
        }
        
        // 邮箱验证
        if (field.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                if (errorElement) {
                    errorElement.textContent = '请输入有效的邮箱地址';
                    errorElement.classList.remove('hidden');
                }
                field.classList.add('border-red-500');
                return false;
            }
        }
        
        // 密码验证
        if (field.type === 'password') {
            if (value.length < 6) {
                if (errorElement) {
                    errorElement.textContent = '密码至少需要6个字符';
                    errorElement.classList.remove('hidden');
                }
                field.classList.add('border-red-500');
                return false;
            }
        }
        
        // 清除错误状态
        if (errorElement) {
            errorElement.classList.add('hidden');
        }
        field.classList.remove('border-red-500');
        field.classList.add('border-green-500');
        return true;
    }

    // 密码一致性验证
    validatePasswords(passwordField, confirmPasswordField) {
        const password = passwordField.value;
        const confirmPassword = confirmPasswordField.value;
        const errorElement = confirmPasswordField.nextElementSibling && 
            confirmPasswordField.nextElementSibling.classList.contains('error-message') 
            ? confirmPasswordField.nextElementSibling 
            : null;
        
        if (password !== confirmPassword) {
            if (errorElement) {
                errorElement.textContent = '两次输入的密码不一致';
                errorElement.classList.remove('hidden');
            }
            confirmPasswordField.classList.add('border-red-500');
            return false;
        }
        
        if (errorElement) {
            errorElement.classList.add('hidden');
        }
        confirmPasswordField.classList.remove('border-red-500');
        confirmPasswordField.classList.add('border-green-500');
        return true;
    }

    // 条款同意验证
    validateTerms(termsCheckbox) {
        const errorElement = termsCheckbox.parentElement.querySelector('.error-message');
        
        if (!termsCheckbox.checked) {
            if (errorElement) {
                errorElement.textContent = '请同意服务条款';
                errorElement.classList.remove('hidden');
            }
            return false;
        }
        
        if (errorElement) {
            errorElement.classList.add('hidden');
        }
        return true;
    }

    // 密码显示/隐藏切换
    setupPasswordToggle(toggleId, passwordId) {
        const toggle = document.getElementById(toggleId);
        const passwordInput = document.getElementById(passwordId);
        
        if (toggle && passwordInput) {
            toggle.addEventListener('click', () => {
                const icon = toggle.querySelector('i');
                
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                } else {
                    passwordInput.type = 'password';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                }
                
                // 添加按钮动画
                toggle.classList.add('scale-110');
                setTimeout(() => toggle.classList.remove('scale-110'), 300);
            });
        }
    }

    // 加载状态管理
    setLoadingState(button, isLoading = true) {
        if (!button) return;
        
        const originalText = button.getAttribute('data-original-text') || button.innerHTML;
        
        if (!button.getAttribute('data-original-text')) {
            button.setAttribute('data-original-text', originalText);
        }
        
        if (isLoading) {
            button.innerHTML = '<i class="fa fa-spinner fa-spin mr-2"></i> 处理中...';
            button.disabled = true;
            button.classList.add('scale-95');
        } else {
            button.innerHTML = originalText;
            button.disabled = false;
            button.classList.remove('scale-95');
        }
    }

    // 检查用户登录状态 - 现在使用AuthManager和全局更新函数
    checkAuthStatus() {
        console.log('调用checkAuthStatus方法');
        
        // 检查是否存在isLogin标识，如果不存在则创建（兼容旧数据）
        const isLogin = localStorage.getItem('isLogin');
        const hasToken = AuthManager.isLoggedIn();
        
        if (hasToken && !isLogin) {
            // 兼容处理：如果有token但没有isLogin标识，创建标识
            localStorage.setItem('isLogin', 'true');
            console.log('已更新登录状态标识');
        } else if (!hasToken && isLogin) {
            // 清理不一致的状态
            localStorage.removeItem('isLogin');
            console.log('已清理不一致的登录状态');
        }
        
        // 优先调用全局登录状态更新函数
        updateGlobalLoginStatus();
        
        return AuthManager.isLoggedIn();
    }

    // 用户登出 - 使用AuthManager统一管理
    logout() {
        console.log('执行登出操作');
        
        // 使用AuthManager统一清除登录状态
        AuthManager.clearLoginStatus();
        
        // 优先调用全局登录状态更新函数
        updateGlobalLoginStatus();
        
        // 显示登出成功通知
        this.showNotification('您已成功登出', 'success');
        
        // 导航逻辑优化
        const currentPath = window.location.pathname;
        
        // 如果在首页，刷新以确保导航栏完全更新
        if (currentPath.includes('index.html')) {
            console.log('刷新首页以更新导航栏');
            window.location.reload();
        } 
        // 如果在需要登录的页面（非登录/注册页），重定向到首页
        else if (!currentPath.includes('login.html') && 
                 !currentPath.includes('register.html')) {
            // 添加短暂延迟，确保通知显示
            setTimeout(() => {
                console.log('重定向到首页');
                window.location.href = 'index.html';
            }, 1000);
        }
    }
    
    // 检查是否已登录 - 提供公共方法
    isLoggedIn() {
        return AuthManager.isLoggedIn();
    }
    
    // 获取用户信息 - 提供公共方法
    getUserInfo() {
        return AuthManager.getUserInfo();
    }
    
    // 获取用户名 - 提供公共方法
    getUserName() {
        return AuthManager.getUserName();
    }
}

// 更新当前活动导航项 - 确保所有页面的导航高亮一致
function updateActiveNavItem() {
    const currentPath = window.location.pathname;
    const navItems = document.querySelectorAll('#main-nav .nav-links a, #mobile-menu a');
    
    navItems.forEach(item => {
        const itemPath = item.getAttribute('href');
        
        // 移除所有活动状态
        item.classList.remove('text-primary', 'bg-primary/10', 'border-primary', 'font-bold');
        
        // 根据当前路径设置活动状态
        if (currentPath.includes(itemPath) || 
            (currentPath === '/' && itemPath === 'index.html') ||
            (currentPath.endsWith('/') && itemPath === 'index.html')) {
            item.classList.add('text-primary', 'bg-primary/10', 'border-primary', 'font-bold');
            
            // 为桌面端和移动端设置不同的样式，但保持视觉一致性
            if (window.innerWidth >= 768) {
                item.classList.add('transform', 'scale-105');
            } else {
                item.classList.add('pl-4');
            }
        }
    });
}

// 导航栏初始化函数 - 确保页面加载时正确设置导航栏状态
function initNavigation() {
    console.log('初始化导航栏');
    
    // 保存登录相关按钮的原始显示样式
    const saveOriginalDisplayStyles = () => {
        const buttonsToSave = [
            { id: 'login-button', element: document.getElementById('login-button') },
            { id: 'register-button', element: document.getElementById('register-button') },
            { id: 'admin-login', element: document.getElementById('admin-login') }
        ];
        
        buttonsToSave.forEach(({ id, element }) => {
            if (element && !element.getAttribute('data-original-display')) {
                const computedStyle = window.getComputedStyle(element);
                const displayStyle = computedStyle.display;
                element.setAttribute('data-original-display', displayStyle);
                console.log(`已保存${id}的原始显示样式: ${displayStyle}`);
            }
        });
    };
    
    // 执行样式保存
    saveOriginalDisplayStyles();
    
    // 首先检查并确保登录状态一致性
    ensureAuthConsistency();
    
    // 更新全局登录状态
    updateGlobalLoginStatus();
    
    // 设置导航栏交互事件
    setupNavigationEvents();
    
    // 更新活动导航项
    updateActiveNavItem();
    
    // 监听窗口大小变化，更新活动导航项
    window.addEventListener('resize', updateActiveNavItem);
    
    console.log('导航栏初始化完成');
}

// 确保认证状态一致性的辅助函数
function ensureAuthConsistency() {
    const token = localStorage.getItem('auth_token');
    const isLogin = localStorage.getItem('isLogin');
    
    // 一致性检查和修复
    if (token && isLogin !== 'true') {
        localStorage.setItem('isLogin', 'true');
        console.log('已修复登录状态不一致：添加isLogin标记');
    } else if (!token && isLogin === 'true') {
        localStorage.removeItem('isLogin');
        console.log('已修复登录状态不一致：移除无效的isLogin标记');
    }
}

// 设置导航栏交互事件
function setupNavigationEvents() {
    // 设置退出登录按钮
    const logoutButtons = document.querySelectorAll('#logout-button, #mobile-logout-button, .logout-btn');
    logoutButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            if (window.MHS && typeof window.MHS.logout === 'function') {
                window.MHS.logout();
            } else {
                // 降级处理：直接调用登出逻辑
                console.log('降级执行登出操作');
                AuthManager.clearLoginStatus();
                updateGlobalLoginStatus();
                window.location.href = 'index.html';
            }
        });
    });
    
    // 增强版用户菜单修复和初始化
    fixAndInitializeUserMenus();
}

// 修复并初始化所有用户菜单 - 确保统一功能
function fixAndInitializeUserMenus() {
    console.log('开始修复和初始化用户菜单...');
    
    // 1. 修复用户菜单结构 - 确保包含个人中心链接
    fixUserMenuStructure();
    
    // 2. 清除可能存在的内联事件监听器（通过克隆元素）
    const userMenuButton = document.getElementById('user-menu-button');
    const mobileUserMenuButton = document.getElementById('mobile-user-menu-button');
    
    // 处理桌面端菜单按钮
    if (userMenuButton) {
        const newDesktopButton = userMenuButton.cloneNode(true);
        userMenuButton.parentNode.replaceChild(newDesktopButton, userMenuButton);
        
        // 添加统一的点击事件
        newDesktopButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const userDropdown = document.getElementById('user-dropdown');
            if (userDropdown) {
                userDropdown.classList.toggle('hidden');
            }
        });
    }
    
    // 处理移动端菜单按钮
    if (mobileUserMenuButton) {
        const newMobileButton = mobileUserMenuButton.cloneNode(true);
        mobileUserMenuButton.parentNode.replaceChild(newMobileButton, mobileUserMenuButton);
        
        // 添加统一的点击事件
        newMobileButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const mobileUserDropdown = document.getElementById('mobile-user-dropdown');
            if (mobileUserDropdown) {
                mobileUserDropdown.classList.toggle('hidden');
            }
        });
    }
    
    // 3. 添加统一的点击外部关闭菜单功能
    document.addEventListener('click', (e) => {
        // 关闭桌面端用户菜单
        const desktopMenu = document.getElementById('user-dropdown');
        const desktopButton = document.getElementById('user-menu-button');
        if (desktopMenu && !desktopMenu.classList.contains('hidden') && 
            desktopButton && !desktopMenu.contains(e.target) && !desktopButton.contains(e.target)) {
            desktopMenu.classList.add('hidden');
        }
        
        // 关闭移动端用户菜单
        const mobileMenu = document.getElementById('mobile-user-dropdown');
        const mobileButton = document.getElementById('mobile-user-menu-button');
        if (mobileMenu && !mobileMenu.classList.contains('hidden') && 
            mobileButton && !mobileMenu.contains(e.target) && !mobileButton.contains(e.target)) {
            mobileMenu.classList.add('hidden');
        }
    });
    
    console.log('用户菜单修复和初始化完成');
}

// 修复用户菜单结构 - 确保包含个人中心链接
function fixUserMenuStructure() {
    const isLoggedIn = localStorage.getItem('isLogin') === 'true';
    
    // 修复桌面端用户菜单
    const userDropdown = document.getElementById('user-dropdown');
    if (userDropdown && isLoggedIn) {
        // 检查是否已包含个人中心链接
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
        if (!hasProfileLink) {
            console.log('添加缺失的个人中心链接到桌面端菜单');
            const profileLink = document.createElement('a');
            profileLink.setAttribute('href', 'user_profile.html');
            profileLink.className = 'block px-4 py-3 text-gray-700 hover:bg-white/50 transition-all-300';
            profileLink.innerHTML = '<i class="fa fa-user-circle mr-2"></i>个人中心';
            
            // 插入到最前面
            if (userDropdown.firstChild) {
                userDropdown.insertBefore(profileLink, userDropdown.firstChild);
            } else {
                userDropdown.appendChild(profileLink);
            }
        }
    }
    
    // 修复移动端用户菜单
    const mobileUserDropdown = document.getElementById('mobile-user-dropdown');
    if (mobileUserDropdown && isLoggedIn) {
        // 检查是否已包含个人中心链接
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
        if (!hasMobileProfileLink) {
            console.log('添加缺失的个人中心链接到移动端菜单');
            const profileLink = document.createElement('a');
            profileLink.setAttribute('href', 'user_profile.html');
            profileLink.className = 'block px-4 py-3 text-gray-700 hover:bg-white/50 transition-all-300';
            profileLink.innerHTML = '<i class="fa fa-user-circle mr-2"></i>个人中心';
            
            // 插入到最前面
            if (mobileUserDropdown.firstChild) {
                mobileUserDropdown.insertBefore(profileLink, mobileUserDropdown.firstChild);
            } else {
                mobileUserDropdown.appendChild(profileLink);
            }
        }
    }
}

// 更新用户信息显示函数 - 专门处理页面中所有用户信息展示区域
function updateUserInfo() {
    const userInfo = AuthManager.getUserInfo();
    const userName = AuthManager.getUserName();
    
    if (!userInfo || !userName) {
        console.log('无用户信息可更新');
        return;
    }
    
    console.log('更新用户信息显示', { userId: userInfo.userId, username: userName });
    
    // 更新所有可能的用户名显示元素
    const usernameSelectors = [
        '#user-name', '#mobile-user-name', '#profile-user-name',
        '#nav-username', '#header-username', '#page-username',
        '#dashboard-username', '#welcome-username',
        '.user-name', '.username-display', '[data-username]'
    ];
    
    usernameSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            // 根据元素类型设置内容
            if (element.hasAttribute('data-username')) {
                element.setAttribute('data-username', userName);
            }
            element.textContent = userName;
            element.classList.add('user-logged-in');
            element.classList.remove('user-not-logged-in');
        });
    });
    
    // 更新用户ID显示（如果需要）
    const userIdElements = document.querySelectorAll('#user-id, .user-id, [data-user-id]');
    userIdElements.forEach(element => {
        if (userInfo.userId) {
            if (element.hasAttribute('data-user-id')) {
                element.setAttribute('data-user-id', userInfo.userId);
            }
            if (element.id === 'user-id' || element.classList.contains('user-id')) {
                element.textContent = userInfo.userId;
            }
        }
    });
}

// 全局登录状态管理函数 - 增强版，确保所有页面都能正确显示登录状态
function updateGlobalLoginStatus() {
    // 使用统一的AuthManager获取登录状态和用户信息
    const isLoggedIn = AuthManager.isLoggedIn();
    const userInfo = AuthManager.getUserInfo();
    const userName = AuthManager.getUserName();
    
    console.log(`全局登录状态更新: ${isLoggedIn ? '已登录' : '未登录'}`, 
                isLoggedIn ? { userId: userInfo?.userId, username: userName } : {});
    
    // 获取所有可能的导航元素
    const navElements = {
        userMenu: document.getElementById('user-menu'),
        mobileUserMenu: document.getElementById('mobile-user-menu'),
        authButtons: document.getElementById('auth-buttons'),
        mobileAuthButtons: document.getElementById('mobile-auth-buttons'),
        loginButton: document.getElementById('login-button'),
        registerButton: document.getElementById('register-button'),
        adminLogin: document.getElementById('admin-login') // 添加管理员入口元素
    };
    
    if (isLoggedIn && userInfo) {
        // 用户已登录
        // 更新用户信息显示
        updateUserInfo();
        
        // 显示用户菜单
        if (navElements.userMenu) {
            navElements.userMenu.classList.remove('hidden');
            navElements.userMenu.classList.add('user-logged-in');
        }
        if (navElements.mobileUserMenu) {
            navElements.mobileUserMenu.classList.remove('hidden');
            navElements.mobileUserMenu.classList.add('user-logged-in');
        }
        
        // 隐藏所有认证相关按钮和容器 - 直接隐藏而非移除hidden类
        // 1. 隐藏认证按钮容器
        if (navElements.authButtons) {
            navElements.authButtons.classList.add('hidden');
            navElements.authButtons.style.display = 'none'; // 双重保险
        }
        if (navElements.mobileAuthButtons) {
            navElements.mobileAuthButtons.classList.add('hidden');
            navElements.mobileAuthButtons.style.display = 'none'; // 双重保险
        }
        
        // 2. 直接隐藏各个按钮
        if (navElements.loginButton) {
            navElements.loginButton.style.display = 'none';
        }
        if (navElements.registerButton) {
            navElements.registerButton.style.display = 'none';
        }
        if (navElements.adminLogin) {
            navElements.adminLogin.style.display = 'none';
        }
        
        // 为需要登录的功能启用相关元素
        document.querySelectorAll('.requires-login').forEach(el => {
            el.classList.remove('hidden');
            el.classList.add('login-required-shown');
        });
        
        // 触发全局登录事件，供其他模块监听
        window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: userInfo }));
    } else {
        // 用户未登录
        // 重置用户相关显示
        document.querySelectorAll('.user-logged-in').forEach(el => {
            if (el.hasAttribute('data-placeholder')) {
                el.textContent = el.getAttribute('data-placeholder');
            } else {
                el.textContent = '';
            }
            el.classList.remove('user-logged-in');
            el.classList.add('user-not-logged-in');
        });
        
        // 隐藏用户菜单
        if (navElements.userMenu) {
            navElements.userMenu.classList.add('hidden');
            navElements.userMenu.classList.remove('user-logged-in');
        }
        if (navElements.mobileUserMenu) {
            navElements.mobileUserMenu.classList.add('hidden');
            navElements.mobileUserMenu.classList.remove('user-logged-in');
        }
        
        // 强制显示认证按钮容器 - 移除所有隐藏样式
        if (navElements.authButtons) {
            navElements.authButtons.classList.remove('hidden');
            navElements.authButtons.style.display = ''; // 重置为默认
            navElements.authButtons.style.visibility = 'visible'; // 确保可见
        }
        if (navElements.mobileAuthButtons) {
            navElements.mobileAuthButtons.classList.remove('hidden');
            navElements.mobileAuthButtons.style.display = ''; // 重置为默认
            navElements.mobileAuthButtons.style.visibility = 'visible'; // 确保可见
        }
        
        // 强制显示各个认证按钮 - 移除所有隐藏样式
        if (navElements.loginButton) {
            // 重置所有可能的隐藏样式
            navElements.loginButton.classList.remove('hidden');
            navElements.loginButton.style.display = ''; // 移除内联display样式
            navElements.loginButton.style.visibility = 'visible'; // 确保可见
        }
        
        if (navElements.registerButton) {
            navElements.registerButton.classList.remove('hidden');
            navElements.registerButton.style.display = ''; // 移除内联display样式
            navElements.registerButton.style.visibility = 'visible'; // 确保可见
        }
        
        if (navElements.adminLogin) {
            navElements.adminLogin.classList.remove('hidden');
            navElements.adminLogin.style.display = ''; // 移除内联display样式
            navElements.adminLogin.style.visibility = 'visible'; // 确保可见
        }
        
        // 为需要登录的功能禁用相关元素
        document.querySelectorAll('.requires-login').forEach(el => {
            el.classList.add('hidden');
            el.classList.remove('login-required-shown');
        });
        
        // 触发全局登出事件，供其他模块监听
        window.dispatchEvent(new CustomEvent('userLoggedOut'));
    }
}

// 页面加载完成后初始化
if (typeof document !== 'undefined') {
    // 将AuthManager暴露给全局
    window.AuthManager = AuthManager;
    
    // 将全局登录状态更新函数暴露给window对象
    window.updateGlobalLoginStatus = updateGlobalLoginStatus;
    
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM加载完成，开始初始化系统');
        
        // 初始化全局系统
        window.MHS = new MentalHealthSystem();
        
        // 暴露关键函数到全局，便于在其他地方调用
        window.initNavigation = initNavigation;
        window.updateGlobalLoginStatus = updateGlobalLoginStatus;
        window.updateUserInfo = updateUserInfo;
        window.fixAndInitializeUserMenus = fixAndInitializeUserMenus;
        window.fixUserMenuStructure = fixUserMenuStructure;
        
        // 为MHS对象添加必要的方法引用
        window.MHS.updateGlobalLoginStatus = updateGlobalLoginStatus;
        window.MHS.updateUserInfo = updateUserInfo;
        window.MHS.initNavigation = initNavigation;
        window.MHS.fixAndInitializeUserMenus = fixAndInitializeUserMenus;
        window.MHS.fixUserMenuStructure = fixUserMenuStructure;
        
        // 初始化导航栏（这会处理登录状态一致性检查和更新）
        initNavigation();
        
        // 初始化密码切换
        if (document.getElementById('toggle-password')) {
            window.MHS.setupPasswordToggle('toggle-password', 'password');
        }
        if (document.getElementById('toggle-confirm-password')) {
            window.MHS.setupPasswordToggle('toggle-confirm-password', 'confirm-password');
        }
        
        // 自动刷新功能 - 定期检查登录状态变化（增强版）
        let lastToken = localStorage.getItem('auth_token');
        let lastUserInfo = localStorage.getItem('user_data');
        setInterval(() => {
            const currentToken = localStorage.getItem('auth_token');
            const currentUserInfo = localStorage.getItem('user_data');
            
            // 检测token或用户信息的变化
            if (currentToken !== lastToken || currentUserInfo !== lastUserInfo) {
                console.log('检测到登录状态变化，自动更新');
                lastToken = currentToken;
                lastUserInfo = currentUserInfo;
                updateGlobalLoginStatus();
            }
        }, 3000); // 更频繁地检查，提高响应速度
    });
    
    // 添加多种事件监听以确保登录状态同步 - 增强版
    
    // 页面可见性变化事件 - 当页面从后台切回时更新登录状态
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            console.log('页面重新可见，更新登录状态');
            updateGlobalLoginStatus();
        }
    });
    
    // 窗口焦点事件 - 当窗口获得焦点时更新登录状态
    window.addEventListener('focus', () => {
        console.log('窗口获得焦点，更新登录状态');
        updateGlobalLoginStatus();
    });
    
    // 页面显示事件 - 处理从其他标签页或应用切换回来的情况
    window.addEventListener('pageshow', () => {
        console.log('页面显示，更新登录状态');
        updateGlobalLoginStatus();
    });
    
    // 存储事件 - 增强版，监听localStorage变化（适用于多标签页场景）
    window.addEventListener('storage', (e) => {
        // 扩展监控的关键字段，确保捕获所有可能的认证相关变化
        const authRelatedKeys = [
            'auth_token', 'user_data', 'isLogin', 'token',
            'userInfo', 'userId', 'username', 'session'
        ];
        
        // 检查是否是认证相关的存储变化
        if (authRelatedKeys.includes(e.key) || e.key === null) {
            console.log('检测到存储变化:', e.key || '全部清除');
            
            // 使用setTimeout确保浏览器有足够时间处理存储变化
            setTimeout(() => {
                updateGlobalLoginStatus();
            }, 100);
        }
    });
    
    // 自定义事件监听 - 允许应用内部组件触发登录状态更新
    window.addEventListener('forceAuthUpdate', () => {
        console.log('接收到强制认证更新事件');
        updateGlobalLoginStatus();
    });
    
    // 网络状态变化事件 - 网络恢复时检查登录状态（以防会话过期）
    window.addEventListener('online', () => {
        console.log('网络连接恢复，检查登录状态');
        updateGlobalLoginStatus();
    });
}
