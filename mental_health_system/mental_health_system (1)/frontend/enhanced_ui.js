/**
 * 增强UI交互效果模块
 * 提供丰富的动态交互元素，提升用户体验
 */

class EnhancedUI {
    constructor() {
        // 确保在DOM加载完成后初始化
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    // 初始化所有增强UI功能
    init() {
        console.log('初始化增强UI功能');
        this.setupEnhancedBackground();
        this.setupAdvancedHoverEffects();
        this.setupSmoothTransitions();
        this.setupResponsiveEnhancements();
        this.setupMicroInteractions();
        this.setupImmersiveContentDisplay();
        this.setupScrollAnimations();
        this.setupInteractiveElements();
        this.setupVisualFeedback();
    }

    // 设置增强的动态背景效果
    setupEnhancedBackground() {
        // 如果已经有动态背景容器，增强它
        let dynamicBg = document.querySelector('.dynamic-bg');
        
        if (!dynamicBg) {
            // 创建动态背景容器
            dynamicBg = document.createElement('div');
            dynamicBg.className = 'dynamic-bg';
            document.body.insertBefore(dynamicBg, document.body.firstChild);
        }

        // 添加多个形状元素
        const colors = ['rgba(74, 144, 226, 0.3)', 'rgba(80, 200, 120, 0.3)', 'rgba(255, 182, 193, 0.3)', 'rgba(245, 245, 220, 0.3)'];
        const sizes = [200, 300, 400, 250, 350];
        
        // 清除现有的形状（避免重复添加）
        dynamicBg.innerHTML = '';
        
        // 添加8个形状元素
        for (let i = 0; i < 8; i++) {
            const shape = document.createElement('div');
            shape.className = 'shape';
            
            // 随机设置样式
            const size = sizes[Math.floor(Math.random() * sizes.length)];
            shape.style.width = `${size}px`;
            shape.style.height = `${size}px`;
            shape.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            shape.style.left = `${Math.random() * 100}%`;
            shape.style.top = `${Math.random() * 100}%`;
            shape.style.animationDelay = `${Math.random() * 5}s`;
            
            dynamicBg.appendChild(shape);
        }

        // 添加视差效果
        window.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            const shapes = dynamicBg.querySelectorAll('.shape');
            shapes.forEach((shape, index) => {
                const speed = (index + 1) * 0.5;
                const moveX = (mouseX - 0.5) * speed * 20;
                const moveY = (mouseY - 0.5) * speed * 20;
                shape.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
        });
    }

    // 设置高级悬停效果
    setupAdvancedHoverEffects() {
        // 为所有卡片添加3D悬停效果
        const cards = document.querySelectorAll('.card, .hover-scale');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 15;
                const rotateY = (centerX - x) / 15;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
                card.style.transition = 'transform 0.1s ease';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
                card.style.transition = 'transform 0.3s ease';
            });
        });

        // 为导航链接添加下划线动画
        const navLinks = document.querySelectorAll('.nav-links a, .nav-link');
        navLinks.forEach(link => {
            // 添加伪元素容器
            link.style.position = 'relative';
            
            // 创建下划线元素
            const underline = document.createElement('span');
            underline.style.position = 'absolute';
            underline.style.bottom = '0';
            underline.style.left = '0';
            underline.style.width = '0';
            underline.style.height = '2px';
            underline.style.backgroundColor = 'var(--primary-color)';
            underline.style.transition = 'width 0.3s ease';
            underline.style.zIndex = '-1';
            
            link.appendChild(underline);
            
            // 添加悬停效果
            link.addEventListener('mouseenter', () => {
                underline.style.width = '100%';
                link.style.color = 'var(--primary-color)';
            });
            
            link.addEventListener('mouseleave', () => {
                underline.style.width = '0';
                link.style.color = ''; // 恢复默认颜色
            });
        });

        // 为按钮添加波纹效果
        const buttons = document.querySelectorAll('button, .btn-primary, .btn-outline');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                // 创建波纹元素
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = `${size}px`;
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                ripple.style.position = 'absolute';
                ripple.style.borderRadius = '50%';
                ripple.style.background = 'rgba(255, 255, 255, 0.5)';
                ripple.style.transform = 'scale(0)';
                ripple.style.animation = 'ripple 0.6s ease-out';
                ripple.style.pointerEvents = 'none';
                
                button.style.position = 'relative';
                button.style.overflow = 'hidden';
                
                button.appendChild(ripple);
                
                // 动画结束后移除波纹
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });

        // 添加波纹动画样式
        if (!document.querySelector('#ripple-animation-style')) {
            const style = document.createElement('style');
            style.id = 'ripple-animation-style';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // 设置平滑过渡动画
    setupSmoothTransitions() {
        // 为页面元素添加入场动画
        const sections = document.querySelectorAll('section, main > div');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transition = 'opacity 0.8s ease';
            observer.observe(section);
        });

        // 增强模态框动画
        const modals = document.querySelectorAll('.modal, #assessment-modal');
        modals.forEach(modal => {
            // 添加模态框背景
            if (!modal.querySelector('.modal-backdrop')) {
                const backdrop = document.createElement('div');
                backdrop.className = 'modal-backdrop';
                backdrop.style.position = 'fixed';
                backdrop.style.top = '0';
                backdrop.style.left = '0';
                backdrop.style.width = '100%';
                backdrop.style.height = '100%';
                backdrop.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                backdrop.style.opacity = '0';
                backdrop.style.transition = 'opacity 0.3s ease';
                backdrop.style.zIndex = '999';
                
                // 点击背景关闭模态框
                backdrop.addEventListener('click', (e) => {
                    if (e.target === backdrop) {
                        modal.classList.add('hidden');
                        backdrop.style.opacity = '0';
                    }
                });
                
                // 保存原始关闭按钮逻辑
                const originalClose = modal.querySelector('[id^="close-"]');
                if (originalClose) {
                    const oldClick = originalClose.onclick;
                    originalClose.onclick = function() {
                        backdrop.style.opacity = '0';
                        setTimeout(() => {
                            if (typeof oldClick === 'function') {
                                oldClick();
                            } else {
                                modal.classList.add('hidden');
                            }
                        }, 300);
                    };
                }
                
                modal.style.position = 'relative';
                modal.style.zIndex = '1000';
                modal.parentNode.insertBefore(backdrop, modal);
                
                // 覆盖显示方法
                const originalShow = modal.show;
                modal.show = function() {
                    modal.classList.remove('hidden');
                    setTimeout(() => {
                        backdrop.style.opacity = '1';
                    }, 10);
                };
            }
        });
    }

    // 设置响应式增强功能
    setupResponsiveEnhancements() {
        // 增强移动端菜单体验
        const mobileMenu = document.getElementById('mobile-menu');
        const menuToggle = document.getElementById('menu-toggle');
        
        if (mobileMenu && menuToggle) {
            // 添加滑动动画
            mobileMenu.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
            mobileMenu.style.transform = 'translateX(100%)';
            
            // 覆盖原有逻辑
            const originalClick = menuToggle.onclick;
            menuToggle.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                if (mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.remove('hidden');
                    setTimeout(() => {
                        mobileMenu.style.transform = 'translateX(0)';
                    }, 10);
                } else {
                    mobileMenu.style.transform = 'translateX(100%)';
                    setTimeout(() => {
                        mobileMenu.classList.add('hidden');
                    }, 300);
                }
                
                if (typeof originalClick === 'function') {
                    originalClick.call(this, e);
                }
            };
        }

        // 根据屏幕宽度优化布局
        const optimizeLayout = () => {
            const windowWidth = window.innerWidth;
            
            // 优化卡片网格布局
            const gridContainers = document.querySelectorAll('.grid, .card-container');
            gridContainers.forEach(container => {
                if (windowWidth < 640) {
                    container.style.gridTemplateColumns = '1fr';
                } else if (windowWidth < 768) {
                    container.style.gridTemplateColumns = 'repeat(auto-fit, minmax(280px, 1fr))';
                } else if (windowWidth < 1024) {
                    container.style.gridTemplateColumns = 'repeat(auto-fit, minmax(320px, 1fr))';
                } else {
                    container.style.gridTemplateColumns = 'repeat(auto-fit, minmax(360px, 1fr))';
                }
            });
        };
        
        // 初始优化和监听窗口大小变化
        optimizeLayout();
        window.addEventListener('resize', optimizeLayout);

        // 触摸设备优化
        if ('ontouchstart' in window) {
            // 为触摸元素添加触摸反馈
            const touchElements = document.querySelectorAll('button, a, .card');
            touchElements.forEach(element => {
                element.addEventListener('touchstart', () => {
                    element.style.transform = 'scale(0.98)';
                });
                
                element.addEventListener('touchend', () => {
                    setTimeout(() => {
                        element.style.transform = 'scale(1)';
                    }, 150);
                });
            });
        }
    }

    // 设置微交互效果
    setupMicroInteractions() {
        // 表单输入微交互
        const formInputs = document.querySelectorAll('input, textarea, select');
        formInputs.forEach(input => {
            // 添加标签动画
            const label = input.previousElementSibling;
            if (label && label.tagName === 'LABEL') {
                label.style.transition = 'all 0.3s ease';
                label.style.pointerEvents = 'none';
                
                // 检查初始值
                if (input.value) {
                    label.style.transform = 'translateY(-20px) scale(0.85)';
                    label.style.color = 'var(--primary-color)';
                }
                
                input.addEventListener('focus', () => {
                    label.style.transform = 'translateY(-20px) scale(0.85)';
                    label.style.color = 'var(--primary-color)';
                });
                
                input.addEventListener('blur', () => {
                    if (!input.value) {
                        label.style.transform = 'translateY(0) scale(1)';
                        label.style.color = '';
                    }
                });
            }

            // 添加输入完成反馈
            input.addEventListener('input', () => {
                if (input.checkValidity() && input.value) {
                    input.classList.add('input-valid');
                } else {
                    input.classList.remove('input-valid');
                }
            });
        });

        // 添加输入有效样式
        if (!document.querySelector('#input-valid-style')) {
            const style = document.createElement('style');
            style.id = 'input-valid-style';
            style.textContent = `
                .input-valid {
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%2310B981' viewBox='0 0 16 16'%3E%3Cpath d='M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z'/%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: right 0.5rem center;
                    background-size: 1rem;
                }
            `;
            document.head.appendChild(style);
        }

        // 滚动进度指示器
        this.setupScrollProgressIndicator();
    }

    // 设置滚动进度指示器
    setupScrollProgressIndicator() {
        // 创建进度条元素
        const progressBar = document.createElement('div');
        progressBar.id = 'scroll-progress';
        progressBar.style.position = 'fixed';
        progressBar.style.top = '0';
        progressBar.style.left = '0';
        progressBar.style.height = '4px';
        progressBar.style.backgroundColor = 'var(--primary-color)';
        progressBar.style.width = '0%';
        progressBar.style.zIndex = '9999';
        progressBar.style.transition = 'width 0.1s ease';
        
        document.body.appendChild(progressBar);
        
        // 更新进度
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }

    // 设置沉浸式内容展示
    setupImmersiveContentDisplay() {
        // 为图片添加查看器功能
        const images = document.querySelectorAll('img[alt]');
        images.forEach(img => {
            // 只为非图标和小图片添加效果
            if (!img.closest('i') && img.width > 50) {
                img.style.cursor = 'pointer';
                img.style.transition = 'transform 0.3s ease';
                
                img.addEventListener('mouseenter', () => {
                    img.style.transform = 'scale(1.02)';
                    img.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
                });
                
                img.addEventListener('mouseleave', () => {
                    img.style.transform = 'scale(1)';
                    img.style.boxShadow = 'none';
                });
                
                // 点击放大查看
                img.addEventListener('click', () => {
                    this.openImageViewer(img.src, img.alt);
                });
            }
        });

        // 为卡片添加展开/收起功能
        const expandableCards = document.querySelectorAll('.card, .hover-scale');
        expandableCards.forEach(card => {
            // 检查卡片是否内容较长
            if (card.scrollHeight > card.clientHeight + 20) {
                const expandBtn = document.createElement('button');
                expandBtn.className = 'expand-btn';
                expandBtn.style.display = 'block';
                expandBtn.style.margin = '10px auto 0';
                expandBtn.style.padding = '5px 15px';
                expandBtn.style.background = 'transparent';
                expandBtn.style.border = '1px solid var(--primary-color)';
                expandBtn.style.color = 'var(--primary-color)';
                expandBtn.style.borderRadius = '20px';
                expandBtn.style.fontSize = '14px';
                expandBtn.style.cursor = 'pointer';
                expandBtn.style.transition = 'all 0.3s ease';
                expandBtn.textContent = '查看更多';
                
                card.style.maxHeight = '300px';
                card.style.overflow = 'hidden';
                card.style.position = 'relative';
                
                // 添加渐变遮罩
                const gradient = document.createElement('div');
                gradient.style.position = 'absolute';
                gradient.style.bottom = '0';
                gradient.style.left = '0';
                gradient.style.width = '100%';
                gradient.style.height = '60px';
                gradient.style.background = 'linear-gradient(to top, white, transparent)';
                
                card.appendChild(gradient);
                card.appendChild(expandBtn);
                
                let expanded = false;
                
                expandBtn.addEventListener('click', () => {
                    if (expanded) {
                        card.style.maxHeight = '300px';
                        expandBtn.textContent = '查看更多';
                        gradient.style.display = 'block';
                    } else {
                        card.style.maxHeight = '2000px';
                        expandBtn.textContent = '收起';
                        // 等待展开动画完成后隐藏渐变
                        setTimeout(() => {
                            gradient.style.display = 'none';
                        }, 300);
                    }
                    expanded = !expanded;
                });
            }
        });
    }

    // 打开图片查看器
    openImageViewer(src, alt) {
        // 检查是否已有查看器
        let viewer = document.getElementById('image-viewer');
        
        if (!viewer) {
            // 创建查看器容器
            viewer = document.createElement('div');
            viewer.id = 'image-viewer';
            viewer.style.position = 'fixed';
            viewer.style.top = '0';
            viewer.style.left = '0';
            viewer.style.width = '100%';
            viewer.style.height = '100%';
            viewer.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
            viewer.style.display = 'flex';
            viewer.style.alignItems = 'center';
            viewer.style.justifyContent = 'center';
            viewer.style.zIndex = '9999';
            viewer.style.opacity = '0';
            viewer.style.transition = 'opacity 0.3s ease';
            
            // 创建关闭按钮
            const closeBtn = document.createElement('button');
            closeBtn.className = 'image-viewer-close';
            closeBtn.style.position = 'absolute';
            closeBtn.style.top = '20px';
            closeBtn.style.right = '30px';
            closeBtn.style.width = '40px';
            closeBtn.style.height = '40px';
            closeBtn.style.borderRadius = '50%';
            closeBtn.style.background = 'rgba(255, 255, 255, 0.2)';
            closeBtn.style.border = 'none';
            closeBtn.style.color = 'white';
            closeBtn.style.fontSize = '24px';
            closeBtn.style.cursor = 'pointer';
            closeBtn.style.transition = 'all 0.3s ease';
            closeBtn.innerHTML = '<i class="fa fa-times"></i>';
            
            closeBtn.addEventListener('mouseenter', () => {
                closeBtn.style.background = 'rgba(255, 255, 255, 0.3)';
                closeBtn.style.transform = 'scale(1.1)';
            });
            
            closeBtn.addEventListener('mouseleave', () => {
                closeBtn.style.background = 'rgba(255, 255, 255, 0.2)';
                closeBtn.style.transform = 'scale(1)';
            });
            
            closeBtn.addEventListener('click', () => {
                viewer.style.opacity = '0';
                setTimeout(() => {
                    viewer.remove();
                }, 300);
            });
            
            // 创建图片容器
            const imgContainer = document.createElement('div');
            imgContainer.className = 'image-viewer-content';
            imgContainer.style.maxWidth = '90%';
            imgContainer.style.maxHeight = '80%';
            imgContainer.style.transition = 'transform 0.3s ease';
            
            viewer.appendChild(closeBtn);
            viewer.appendChild(imgContainer);
            
            // 点击背景关闭
            viewer.addEventListener('click', (e) => {
                if (e.target === viewer) {
                    closeBtn.click();
                }
            });
            
            //  ESC键关闭
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && viewer) {
                    closeBtn.click();
                }
            });
        }
        
        // 更新图片内容
        const imgContainer = viewer.querySelector('.image-viewer-content');
        imgContainer.innerHTML = `
            <img src="${src}" alt="${alt}" style="max-width: 100%; max-height: 100%; object-contain;">
            <div style="color: white; text-align: center; margin-top: 15px; font-size: 16px;">${alt}</div>
        `;
        
        document.body.appendChild(viewer);
        
        // 显示查看器
        setTimeout(() => {
            viewer.style.opacity = '1';
        }, 10);
    }

    // 设置滚动动画
    setupScrollAnimations() {
        // 为元素添加滚动显示动画
        const animatedElements = document.querySelectorAll('h2, h3, .card, .feature-item, .service-item');
        
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    scrollObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            scrollObserver.observe(element);
        });

        // 添加滚动到顶部按钮
        this.setupScrollToTopButton();
    }

    // 设置滚动到顶部按钮
    setupScrollToTopButton() {
        // 检查是否已有按钮
        let scrollTopBtn = document.getElementById('scroll-top-btn');
        
        if (!scrollTopBtn) {
            scrollTopBtn = document.createElement('button');
            scrollTopBtn.id = 'scroll-top-btn';
            scrollTopBtn.style.position = 'fixed';
            scrollTopBtn.style.bottom = '30px';
            scrollTopBtn.style.right = '30px';
            scrollTopBtn.style.width = '50px';
            scrollTopBtn.style.height = '50px';
            scrollTopBtn.style.borderRadius = '50%';
            scrollTopBtn.style.background = 'var(--primary-color)';
            scrollTopBtn.style.color = 'white';
            scrollTopBtn.style.border = 'none';
            scrollTopBtn.style.fontSize = '20px';
            scrollTopBtn.style.cursor = 'pointer';
            scrollTopBtn.style.boxShadow = '0 4px 15px rgba(74, 144, 226, 0.4)';
            scrollTopBtn.style.opacity = '0';
            scrollTopBtn.style.transform = 'translateY(20px)';
            scrollTopBtn.style.transition = 'opacity 0.3s ease, transform 0.3s ease, background 0.3s ease';
            scrollTopBtn.innerHTML = '<i class="fa fa-arrow-up"></i>';
            scrollTopBtn.setAttribute('aria-label', '滚动到顶部');
            
            document.body.appendChild(scrollTopBtn);
            
            // 添加点击事件
            scrollTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
            
            // 添加悬停效果
            scrollTopBtn.addEventListener('mouseenter', () => {
                scrollTopBtn.style.background = '#3A7BC8';
                scrollTopBtn.style.transform = 'translateY(-5px) scale(1.1)';
            });
            
            scrollTopBtn.addEventListener('mouseleave', () => {
                scrollTopBtn.style.background = 'var(--primary-color)';
                scrollTopBtn.style.transform = 'translateY(0) scale(1)';
            });
        }
        
        // 监听滚动显示/隐藏按钮
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.style.opacity = '1';
                scrollTopBtn.style.transform = 'translateY(0)';
            } else {
                scrollTopBtn.style.opacity = '0';
                scrollTopBtn.style.transform = 'translateY(20px)';
            }
        });
    }

    // 设置交互式元素
    setupInteractiveElements() {
        // 为按钮组添加选中效果
        const buttonGroups = document.querySelectorAll('.button-group, .btn-group');
        buttonGroups.forEach(group => {
            const buttons = group.querySelectorAll('button');
            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    // 移除其他按钮的选中状态
                    buttons.forEach(btn => {
                        btn.classList.remove('active');
                        btn.style.backgroundColor = '';
                        btn.style.color = '';
                    });
                    
                    // 添加当前按钮的选中状态
                    button.classList.add('active');
                    button.style.backgroundColor = 'var(--primary-color)';
                    button.style.color = 'white';
                });
            });
        });

        // 为标签添加交互效果
        const tags = document.querySelectorAll('.tag, .badge');
        tags.forEach(tag => {
            tag.style.cursor = 'pointer';
            tag.style.transition = 'all 0.3s ease';
            
            tag.addEventListener('mouseenter', () => {
                tag.style.transform = 'scale(1.05)';
                tag.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.1)';
            });
            
            tag.addEventListener('mouseleave', () => {
                tag.style.transform = 'scale(1)';
                tag.style.boxShadow = 'none';
            });
            
            tag.addEventListener('click', () => {
                tag.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    tag.style.transform = 'scale(1)';
                }, 150);
            });
        });
    }

    // 设置视觉反馈机制
    setupVisualFeedback() {
        // 增强通知系统
        if (window.MHS && typeof window.MHS.showNotification === 'function') {
            const originalShowNotification = window.MHS.showNotification;
            
            window.MHS.showNotification = function(message, type = 'info') {
                // 调用原始方法
                originalShowNotification.call(this, message, type);
                
                // 获取通知元素并增强效果
                const notification = document.querySelector('.notification:last-child');
                if (notification) {
                    // 添加滑动和缩放动画
                    notification.style.transform = 'translateX(150%) scale(0.8)';
                    setTimeout(() => {
                        notification.style.transform = 'translateX(0) scale(1)';
                    }, 10);
                    
                    // 添加震动效果（错误通知）
                    if (type === 'error') {
                        notification.classList.add('notification-error-shake');
                    }
                }
            };
        }
        
        // 添加错误通知震动样式
        if (!document.querySelector('#notification-error-shake-style')) {
            const style = document.createElement('style');
            style.id = 'notification-error-shake-style';
            style.textContent = `
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
                
                .notification-error-shake {
                    animation: shake 0.5s ease-in-out;
                }
            `;
            document.head.appendChild(style);
        }

        // 为重要操作添加确认动画
        const importantButtons = document.querySelectorAll('.btn-primary, [data-confirm]');
        importantButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                if (button.hasAttribute('data-confirm')) {
                    const confirmText = button.getAttribute('data-confirm');
                    if (!confirm(confirmText)) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        // 添加取消反馈动画
                        button.style.transform = 'translateX(5px)';
                        setTimeout(() => {
                            button.style.transform = 'translateX(-5px)';
                            setTimeout(() => {
                                button.style.transform = 'translateX(0)';
                            }, 50);
                        }, 50);
                    }
                }
            });
        });
    }
}

// 全局初始化
if (typeof document !== 'undefined') {
    // 等待DOM加载完成
    document.addEventListener('DOMContentLoaded', () => {
        // 延迟初始化，确保其他脚本已加载
        setTimeout(() => {
            window.EnhancedUI = new EnhancedUI();
            console.log('增强UI功能已初始化');
        }, 100);
    });
}