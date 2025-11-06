// 零拖拽全点选式沉浸式心理沙盘 - 核心交互脚本

// 确保DOM加载完成后执行
window.addEventListener('DOMContentLoaded', function() {
    console.log('初始化沉浸式沙盘交互系统...');
    
    // 获取核心DOM元素
    const sandbox = document.getElementById('sandbox-area');
    const sandboxItems = document.getElementById('sandbox-items');
    const radialMenu = document.getElementById('radial-menu');
    const variantSelector = document.getElementById('variant-selector');
    const itemControls = document.getElementById('item-controls');
    const globalTools = document.getElementById('global-tools');
    const aiInterpretation = document.getElementById('ai-interpretation');
    
    // 状态变量
    let currentItem = null; // 当前选中的沙具
    let menuTimeout = null; // 菜单自动隐藏的计时器
    let itemCount = 0; // 沙具计数器
    let guidingQuestionVisible = false; // 引导问题是否显示
    
    // 沙具数据 - 基于专业心理学分类
    const sandItemsData = {
        // 「自我」（人物/人形符号）
        self: {
            type: 'character',
            icon: 'fa-user',
            color: '#ff6b6b',
            variants: [
                { name: '成年男性', icon: 'fa-user' },
                { name: '成年女性', icon: 'fa-user-female' },
                { name: '儿童', icon: 'fa-child' },
                { name: '老人', icon: 'fa-user-graduate' },
                { name: '青少年', icon: 'fa-user-young' }
            ]
        },
        // 「关系」（连接性符号）
        relationship: {
            type: 'connection',
            icon: 'fa-link',
            color: '#4ecdc4',
            variants: [
                { name: '桥梁', icon: 'fa-bridge' },
                { name: '双手', icon: 'fa-hands' },
                { name: '对话气泡', icon: 'fa-comment' },
                { name: '心形', icon: 'fa-heart' },
                { name: '家庭', icon: 'fa-users' }
            ]
        },
        // 「环境」（空间符号）
        environment: {
            type: 'space',
            icon: 'fa-home',
            color: '#45b7d1',
            variants: [
                { name: '房屋', icon: 'fa-home' },
                { name: '树木', icon: 'fa-tree' },
                { name: '山脉', icon: 'fa-mountain' },
                { name: '湖泊', icon: 'fa-water' },
                { name: '道路', icon: 'fa-road' }
            ]
        },
        // 「情绪」（抽象符号）
        emotion: {
            type: 'abstract',
            icon: 'fa-cloud',
            color: '#96ceb4',
            variants: [
                { name: '乌云', icon: 'fa-cloud-rain' },
                { name: '火焰', icon: 'fa-fire' },
                { name: '彩虹', icon: 'fa-cloud-sun-rain' },
                { name: '星星', icon: 'fa-star' },
                { name: '月亮', icon: 'fa-moon' }
            ]
        },
        // 「防御」（边界符号）
        defense: {
            type: 'boundary',
            icon: 'fa-shield-alt',
            color: '#feca57',
            variants: [
                { name: '围墙', icon: 'fa-wall' },
                { name: '盾牌', icon: 'fa-shield-alt' },
                { name: '面具', icon: 'fa-mask' },
                { name: '门', icon: 'fa-door-open' },
                { name: '锁', icon: 'fa-lock' }
            ]
        },
        // 「成长」（变化符号）
        growth: {
            type: 'change',
            icon: 'fa-seedling',
            color: '#54a0ff',
            variants: [
                { name: '种子', icon: 'fa-seedling' },
                { name: '阶梯', icon: 'fa-ladder' },
                { name: '蝴蝶', icon: 'fa-butterfly' },
                { name: '花朵', icon: 'fa-flower' },
                { name: '书籍', icon: 'fa-book' }
            ]
        },
        // 「时间」（维度符号）
        time: {
            type: 'dimension',
            icon: 'fa-clock',
            color: '#5f27cd',
            variants: [
                { name: '时钟', icon: 'fa-clock' },
                { name: '沙漏', icon: 'fa-hourglass' },
                { name: '脚印', icon: 'fa-footprints' },
                { name: '日历', icon: 'fa-calendar' },
                { name: '指南针', icon: 'fa-compass' }
            ]
        },
        // 「交通工具」（移动符号）
        transportation: {
            type: 'movement',
            icon: 'fa-car',
            color: '#ff9ff3',
            variants: [
                { name: '汽车', icon: 'fa-car' },
                { name: '飞机', icon: 'fa-plane' },
                { name: '船', icon: 'fa-ship', type: 'floating' },
                { name: '火车', icon: 'fa-train' },
                { name: '自行车', icon: 'fa-bicycle' }
            ]
        },
        // 「职业」（角色符号）
        occupation: {
            type: 'role',
            icon: 'fa-briefcase',
            color: '#54a0ff',
            variants: [
                { name: '医生', icon: 'fa-user-md' },
                { name: '教师', icon: 'fa-chalkboard-teacher' },
                { name: '工程师', icon: 'fa-microchip' },
                { name: '艺术家', icon: 'fa-palette' },
                { name: '厨师', icon: 'fa-utensils' }
            ]
        }
    };
    
    // 初始化环形菜单
    initRadialMenu();
    
    // 初始化沙箱点击事件
    initSandboxClick();
    
    // 初始化全局工具
    initGlobalTools();
    
    // 初始化引导提示
    initGuidingTips();
    
    // 初始化符号动力学系统
    initSymbolDynamics();
    
    // 初始化环形菜单
    function initRadialMenu() {
        const menuContainer = document.createElement('div');
        menuContainer.id = 'radial-menu';
        menuContainer.className = 'radial-menu hidden absolute z-30';
        menuContainer.style.cssText = `
            width: 200px;
            height: 200px;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(10px);
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transform: scale(0.8);
            transition: opacity 0.3s ease, transform 0.3s ease;
        `;
        
        // 创建扇形分区
        const categories = Object.keys(sandItemsData);
        const categoryNames = {
            self: '自我',
            relationship: '关系',
            environment: '环境',
            emotion: '情绪',
            defense: '防御',
            growth: '成长',
            time: '时间',
            transportation: '交通工具',
            occupation: '职业'
        };
        
        categories.forEach((category, index) => {
            const sector = document.createElement('button');
            sector.className = 'radial-menu-sector';
            sector.dataset.category = category;
            
            // 计算扇形位置
            const angle = index * 45;
            const radians = angle * Math.PI / 180;
            const distance = 55; // 距离中心的距离
            const x = Math.cos(radians) * distance;
            const y = Math.sin(radians) * distance;
            
            sector.style.cssText = `
                position: absolute;
                width: 40px;
                height: 40px;
                background: ${sandItemsData[category].color};
                border: none;
                border-radius: 50%;
                left: calc(50% + ${x}px - 20px);
                top: calc(50% + ${y}px - 20px);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
                color: white;
                font-size: 18px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            `;
            
            sector.innerHTML = `<i class="fa ${sandItemsData[category].icon}"></i>`;
            
            // 添加提示文字
            const tooltip = document.createElement('div');
            tooltip.className = 'sector-tooltip';
            tooltip.textContent = categoryNames[category];
            tooltip.style.cssText = `
                position: absolute;
                bottom: -25px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 2px 8px;
                border-radius: 4px;
                font-size: 12px;
                white-space: nowrap;
                opacity: 0;
                transition: opacity 0.2s ease;
                pointer-events: none;
            `;
            sector.appendChild(tooltip);
            
            // 悬停效果
            sector.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.2)';
                this.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.3)';
                tooltip.style.opacity = '1';
                playSound('hover');
            });
            
            sector.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
                tooltip.style.opacity = '0';
            });
            
            // 点击事件 - 显示变体选择器
            sector.addEventListener('click', function(e) {
                e.stopPropagation();
                hideRadialMenu();
                
                const category = this.dataset.category;
                const rect = this.getBoundingClientRect();
                const sandboxRect = sandbox.getBoundingClientRect();
                
                showVariantSelector(category, rect.left - sandboxRect.left, rect.top - sandboxRect.top);
                playSound('click');
                triggerHapticFeedback();
            });
            
            menuContainer.appendChild(sector);
        });
        
        // 添加清除按钮
        const clearBtn = document.createElement('button');
        clearBtn.className = 'clear-sector-btn';
        clearBtn.innerHTML = '<i class="fa fa-trash"></i>';
        clearBtn.style.cssText = `
            position: absolute;
            width: 48px;
            height: 48px;
            background: #ff4757;
            border: none;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            color: white;
            font-size: 20px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        `;
        
        clearBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.4)';
        });
        
        clearBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';
        });
        
        clearBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            // 清除点击位置附近的沙具
            const rect = sandbox.getBoundingClientRect();
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const nearbyItems = getNearbyItems(centerX, centerY, 100);
            nearbyItems.forEach(item => {
                removeItemFromDOM(item);
            });
            
            hideRadialMenu();
            playSound('delete');
            triggerHapticFeedback();
        });
        
        menuContainer.appendChild(clearBtn);
        
        // 添加到沙箱
        sandbox.appendChild(menuContainer);
    }
    
    // 初始化沙箱点击事件
    function initSandboxClick() {
        sandbox.addEventListener('click', function(e) {
            // 如果点击的是空白区域
            if (e.target === sandbox || e.target === sandboxItems) {
                // 隐藏所有面板
                hideVariantSelector();
                hideItemControls();
                
                // 显示环形菜单
                const sandboxRect = sandbox.getBoundingClientRect();
                const x = e.clientX - sandboxRect.left;
                const y = e.clientY - sandboxRect.top;
                
                radialMenu.style.left = (x - 100) + 'px';
                radialMenu.style.top = (y - 100) + 'px';
                
                radialMenu.classList.remove('hidden');
                setTimeout(() => {
                    radialMenu.classList.add('visible');
                }, 10);
                
                // 3秒后自动隐藏
                clearTimeout(menuTimeout);
                menuTimeout = setTimeout(hideRadialMenu, 3000);
                
                // 播放点击音效
                playSound('click');
            }
        });
    }
    
    // 初始化全局工具
    function initGlobalTools() {
        // 确保全局工具栏存在
        if (!globalTools) {
            const toolsContainer = document.createElement('div');
            toolsContainer.id = 'global-tools';
            toolsContainer.className = 'global-tools';
            toolsContainer.style.cssText = `
                position: absolute;
                top: 20px;
                right: 20px;
                display: flex;
                gap: 12px;
                z-index: 40;
            `;
            
            // 添加重置按钮
            const resetBtn = document.createElement('button');
            resetBtn.className = 'global-tool-btn reset-btn cursor-pointer hover:scale-110';
            resetBtn.innerHTML = '<i class="fa fa-refresh"></i>';
            resetBtn.title = '重置沙盘';
            resetBtn.style.cssText = `
                width: 40px;
                height: 40px;
                background: rgba(255, 255, 255, 0.8);
                backdrop-filter: blur(10px);
                border: none;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #333;
                font-size: 18px;
                transition: all 0.3s ease;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            `;
            
            resetBtn.addEventListener('click', function() {
                resetSandbox();
                playSound('reset');
                triggerHapticFeedback();
            });
            
            // 添加保存按钮
            const saveBtn = document.createElement('button');
            saveBtn.className = 'global-tool-btn save-btn cursor-pointer hover:scale-110';
            saveBtn.innerHTML = '<i class="fa fa-save"></i>';
            saveBtn.title = '保存场景';
            saveBtn.style.cssText = `
                width: 40px;
                height: 40px;
                background: rgba(255, 255, 255, 0.8);
                backdrop-filter: blur(10px);
                border: none;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #333;
                font-size: 18px;
                transition: all 0.3s ease;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            `;
            
            saveBtn.addEventListener('click', function() {
                saveScene();
                playSound('save');
                triggerHapticFeedback();
            });
            
            // 添加解读按钮
            const interpretBtn = document.createElement('button');
            interpretBtn.className = 'global-tool-btn interpret-btn cursor-pointer hover:scale-110';
            interpretBtn.innerHTML = '<i class="fa fa-brain"></i>';
            interpretBtn.title = 'AI解读';
            interpretBtn.style.cssText = `
                width: 40px;
                height: 40px;
                background: rgba(255, 255, 255, 0.8);
                backdrop-filter: blur(10px);
                border: none;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #333;
                font-size: 18px;
                transition: all 0.3s ease;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            `;
            
            interpretBtn.addEventListener('click', function() {
                showAIInterpretation();
                playSound('interpret');
                triggerHapticFeedback();
            });
            
            // 添加到容器
            toolsContainer.appendChild(resetBtn);
            toolsContainer.appendChild(saveBtn);
            toolsContainer.appendChild(interpretBtn);
            
            // 添加到沙箱
            sandbox.appendChild(toolsContainer);
        }
    }
    
    // 初始化引导提示
    function initGuidingTips() {
        // 创建漂浮提示卡
        const tipCard = document.createElement('div');
        tipCard.id = 'guiding-tip';
        tipCard.className = 'guiding-tip animate-float';
        tipCard.innerHTML = `
            <div class="tip-content">
                <p>试着点击沙箱，从菜单中选择让你有感觉的符号，不用在意「对错」——你的摆放本身就是语言</p>
                <button id="close-tip" class="close-tip-btn">
                    <i class="fa fa-times"></i>
                </button>
            </div>
        `;
        tipCard.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            padding: 20px 24px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            z-index: 50;
            max-width: 300px;
            opacity: 0;
            animation: fadeIn 1s ease-out forwards, float 6s ease-in-out infinite;
            animation-delay: 1s;
        `;
        
        tipCard.querySelector('.tip-content').style.cssText = `
            position: relative;
            font-size: 14px;
            color: #333;
            line-height: 1.6;
        `;
        
        const closeBtn = tipCard.querySelector('.close-tip-btn');
        closeBtn.style.cssText = `
            position: absolute;
            top: -10px;
            right: -10px;
            width: 24px;
            height: 24px;
            background: #666;
            color: white;
            border: none;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s ease;
        `;
        
        closeBtn.addEventListener('mouseenter', function() {
            this.style.background = #ff4757;
            this.style.transform = 'scale(1.1)';
        });
        
        closeBtn.addEventListener('click', function() {
            tipCard.style.opacity = '0';
            tipCard.style.pointerEvents = 'none';
            setTimeout(() => {
                tipCard.remove();
            }, 300);
        });
        
        // 添加到沙箱
        sandbox.appendChild(tipCard);
    }
    
    // 初始化符号动力学系统
    function initSymbolDynamics() {
        // 这里将实现符号之间的互动逻辑
        // 将在沙具放置后调用checkSymbolDynamics函数
    }
    
    // 显示变体选择器
    function showVariantSelector(category, x, y) {
        // 创建变体选择器容器
        if (!variantSelector) {
            const selectorContainer = document.createElement('div');
            selectorContainer.id = 'variant-selector';
            selectorContainer.className = 'variant-selector hidden absolute z-30';
            selectorContainer.style.cssText = `
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                border-radius: 12px;
                padding: 16px;
                box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
                opacity: 0;
                transform: translateY(10px);
                transition: opacity 0.3s ease, transform 0.3s ease;
                min-width: 250px;
            `;
            
            // 添加标题
            const title = document.createElement('h4');
            title.className = 'variant-title';
            title.style.cssText = `
                margin: 0 0 12px 0;
                font-size: 16px;
                font-weight: 500;
                color: #333;
            `;
            selectorContainer.appendChild(title);
            
            // 添加变体网格
            const variantsGrid = document.createElement('div');
            variantsGrid.className = 'variants-grid';
            variantsGrid.style.cssText = `
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 12px;
            `;
            selectorContainer.appendChild(variantsGrid);
            
            // 添加到沙箱
            sandbox.appendChild(selectorContainer);
        }
        
        // 更新标题
        const categoryNames = {
            self: '自我符号',
            relationship: '关系符号',
            environment: '环境符号',
            emotion: '情绪符号',
            defense: '防御符号',
            growth: '成长符号',
            time: '时间符号',
            transportation: '交通工具符号',
            occupation: '职业符号'
        };
        
        variantSelector.querySelector('.variant-title').textContent = categoryNames[category];
        
        // 更新变体按钮
        const variantsGrid = variantSelector.querySelector('.variants-grid');
        variantsGrid.innerHTML = '';
        
        const variants = sandItemsData[category].variants;
        variants.forEach(variant => {
            const variantBtn = document.createElement('button');
            variantBtn.className = 'variant-btn cursor-pointer hover:scale-110';
            variantBtn.dataset.variant = variant.name;
            variantBtn.innerHTML = `
                <i class="fa ${variant.icon}" style="font-size: 24px; color: ${sandItemsData[category].color};"></i>
                <span>${variant.name}</span>
            `;
            variantBtn.style.cssText = `
                background: rgba(255, 255, 255, 0.8);
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                padding: 12px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
                font-size: 12px;
                color: #666;
            `;
            
            variantBtn.addEventListener('mouseenter', function() {
                this.style.background = 'rgba(255, 255, 255, 1)';
                this.style.borderColor = sandItemsData[category].color;
                this.style.boxShadow = `0 4px 12px rgba(${hexToRgb(sandItemsData[category].color)}, 0.2)`;
            });
            
            variantBtn.addEventListener('mouseleave', function() {
                this.style.background = 'rgba(255, 255, 255, 0.8)';
                this.style.borderColor = '#e0e0e0';
                this.style.boxShadow = 'none';
            });
            
            variantBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const selectedVariant = sandItemsData[category].variants.find(v => v.name === this.dataset.variant);
                placeSandItem(category, selectedVariant, x, y);
                hideVariantSelector();
            });
            
            variantsGrid.appendChild(variantBtn);
        });
        
        // 定位并显示选择器
        variantSelector.style.left = x + 'px';
        variantSelector.style.top = y + 'px';
        
        variantSelector.classList.remove('hidden');
        setTimeout(() => {
            variantSelector.classList.add('visible');
        }, 10);
    }
    
    // 放置沙具（零拖拽版本）
    function placeSandItem(category, variant, x, y) {
        const sandboxRect = sandbox.getBoundingClientRect();
        const itemData = sandItemsData[category];
        
        // 创建沙具元素
        const item = document.createElement('div');
        item.className = 'sandbox-item item-place-animation';
        item.dataset.category = category;
        item.dataset.type = itemData.type;
        item.dataset.name = variant.name;
        item.dataset.rotation = '0';
        item.dataset.scale = '1';
        item.dataset.placedAt = Date.now(); // 记录放置时间，用于动画效果
        
        item.innerHTML = `<i class="fa ${variant.icon}" style="font-size: 32px; color: ${itemData.color};"></i>`;
        
        // 智能定位
        const finalPosition = calculateSmartPosition(x, y, itemData.type);
        
        item.style.left = finalPosition.x + 'px';
        item.style.top = finalPosition.y + 'px';
        
        // 添加点击事件 - 显示功能盘
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            showItemControls(item, e.clientX, e.clientY);
            playSound('select');
            triggerHapticFeedback();
        });
        
        // 沙具动画样式
        item.style.cssText += `
            position: absolute;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            transform-origin: center;
            z-index: 20;
            filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1));
            animation: itemBounce 0.6s ease-out;
        `;
        
        // 添加到沙箱
        sandboxItems.appendChild(item);
        itemCount++;
        
        // 播放沙具放置音效
        playSound('place');
        
        // 触觉反馈
        triggerHapticFeedback();
        
        // 检查是否需要显示引导问题
        if (itemCount % 5 === 0 && !guidingQuestionVisible) {
            showGuidingQuestion();
        }
        
        // 检查符号动力学
        checkSymbolDynamics();
        
        // 根据类别添加特殊动画效果
        if (category === 'emotion' || category === 'growth') {
            setTimeout(() => {
                updateVisualEffects(item);
            }, 1000);
        }
        
        // 根据类别添加环境音效
        updateEnvironmentalSounds();
    }
    
    // 显示沙具功能盘
    function showItemControls(item, x, y) {
        // 保存当前选中的沙具
        currentItem = item;
        
        // 创建功能盘容器
        if (!itemControls) {
            const controlsContainer = document.createElement('div');
            controlsContainer.id = 'item-controls';
            controlsContainer.className = 'item-controls hidden absolute z-30';
            controlsContainer.style.cssText = `
                width: 120px;
                height: 120px;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(10px);
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                opacity: 0;
                transform: scale(0.8);
                transition: opacity 0.3s ease, transform 0.3s ease;
            `;
            
            // 功能按钮配置
            const actions = [
                { name: 'rotate', icon: 'fa-sync', color: '#4ecdc4' },
                { name: 'duplicate', icon: 'fa-copy', color: '#45b7d1' },
                { name: 'scale', icon: 'fa-expand-arrows-alt', color: '#feca57' },
                { name: 'remove', icon: 'fa-trash', color: '#ff6b6b' }
            ];
            
            actions.forEach((action, index) => {
                const button = document.createElement('button');
                button.className = 'control-btn';
                button.dataset.action = action.name;
                button.innerHTML = `<i class="fa ${action.icon}" style="color: white;"></i>`;
                
                // 计算按钮位置
                const angle = index * 90;
                const radians = angle * Math.PI / 180;
                const distance = 40;
                const x = Math.cos(radians) * distance;
                const y = Math.sin(radians) * distance;
                
                button.style.cssText = `
                    position: absolute;
                    width: 32px;
                    height: 32px;
                    background: ${action.color};
                    border: none;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-size: 14px;
                    left: calc(50% + ${x}px - 16px);
                    top: calc(50% + ${y}px - 16px);
                `;
                
                button.addEventListener('mouseenter', function() {
                    this.style.transform = 'scale(1.2)';
                    this.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';
                });
                
                button.addEventListener('mouseleave', function() {
                    this.style.transform = 'scale(1)';
                    this.style.boxShadow = 'none';
                });
                
                button.addEventListener('click', function(e) {
                    e.stopPropagation();
                    performItemAction(item, this.dataset.action);
                    hideItemControls();
                });
                
                controlsContainer.appendChild(button);
            });
            
            // 添加到沙箱
            sandbox.appendChild(controlsContainer);
        }
        
        // 定位并显示功能盘
        const sandboxRect = sandbox.getBoundingClientRect();
        itemControls.style.left = (x - sandboxRect.left - 60) + 'px';
        itemControls.style.top = (y - sandboxRect.top - 60) + 'px';
        
        itemControls.classList.remove('hidden');
        setTimeout(() => {
            itemControls.classList.add('visible');
        }, 10);
    }
    
    // 执行沙具操作
    function performItemAction(item, action) {
        const category = item.dataset.category;
        const variantName = item.dataset.name;
        const variant = sandItemsData[category].variants.find(v => v.name === variantName);
        
        switch(action) {
            case 'rotate':
                // 旋转沙具
                let rotation = parseInt(item.dataset.rotation) + 45;
                if (rotation >= 360) rotation = 0;
                item.dataset.rotation = rotation;
                item.style.transform = `rotate(${rotation}deg) scale(${item.dataset.scale})`;
                playSound('rotate');
                break;
                
            case 'duplicate':
                // 复制沙具
                const rect = item.getBoundingClientRect();
                const sandboxRect = sandbox.getBoundingClientRect();
                const newX = rect.left - sandboxRect.left + 50;
                const newY = rect.top - sandboxRect.top + 50;
                placeSandItem(category, variant, newX, newY);
                break;
                
            case 'scale':
                // 缩放沙具
                let scale = parseFloat(item.dataset.scale);
                scale = scale === 1 ? 1.2 : scale === 1.2 ? 0.8 : 1;
                item.dataset.scale = scale;
                item.style.transform = `rotate(${item.dataset.rotation}deg) scale(${scale})`;
                playSound('scale');
                break;
                
            case 'remove':
                // 移除沙具
                removeItemFromDOM(item);
                playSound('delete');
                break;
        }
        
        triggerHapticFeedback();
    }
    
    // 智能定位算法
    function calculateSmartPosition(x, y, itemType) {
        const sandboxRect = sandbox.getBoundingClientRect();
        const waterLayer = document.querySelector('.water-layer');
        const waterHeight = waterLayer ? waterLayer.offsetHeight : 0;
        const waterTop = waterLayer ? waterLayer.offsetTop : sandboxRect.height;
        
        let finalX = x;
        let finalY = y;
        
        // 1. 水域检测 - 船只等自动漂浮在水面
        if (['ship', 'boat', 'floating'].includes(itemType) && y > waterTop) {
            finalY = waterTop + 10; // 漂浮在水面上方一点
        }
        
        // 2. 密度检测 - 如果附近有太多沙具，调整位置
        const nearbyItems = getNearbyItems(x, y, 100);
        if (nearbyItems.length > 3) {
            // 寻找一个较空的区域
            let bestDistance = 0;
            let bestPosition = { x, y };
            
            // 尝试8个方向
            const directions = [
                { dx: 50, dy: 0 },
                { dx: -50, dy: 0 },
                { dx: 0, dy: 50 },
                { dx: 0, dy: -50 },
                { dx: 35, dy: 35 },
                { dx: -35, dy: 35 },
                { dx: 35, dy: -35 },
                { dx: -35, dy: -35 }
            ];
            
            directions.forEach(dir => {
                const newX = x + dir.dx;
                const newY = y + dir.dy;
                const newNearby = getNearbyItems(newX, newY, 80);
                
                if (newNearby.length === 0 && 
                    newX > 20 && newX < sandboxRect.width - 20 &&
                    newY > 20 && newY < sandboxRect.height - 20) {
                    bestPosition = { x: newX, y: newY };
                }
            });
            
            finalX = bestPosition.x;
            finalY = bestPosition.y;
        }
        
        // 3. 边界检查
        finalX = Math.max(20, Math.min(sandboxRect.width - 40, finalX));
        finalY = Math.max(20, Math.min(sandboxRect.height - 40, finalY));
        
        return { x: finalX, y: finalY };
    }
    
    // 获取附近的沙具
    function getNearbyItems(x, y, radius) {
        const items = document.querySelectorAll('.sandbox-item');
        const nearbyItems = [];
        
        items.forEach(item => {
            const itemRect = item.getBoundingClientRect();
            const sandboxRect = sandbox.getBoundingClientRect();
            const itemX = itemRect.left - sandboxRect.left + itemRect.width / 2;
            const itemY = itemRect.top - sandboxRect.top + itemRect.height / 2;
            
            const distance = Math.sqrt(Math.pow(itemX - x, 2) + Math.pow(itemY - y, 2));
            if (distance < radius) {
                nearbyItems.push(item);
            }
        });
        
        return nearbyItems;
    }
    
    // 移除沙具
    function removeItemFromDOM(item) {
        // 添加消散动画
        item.style.animation = 'itemDissolve 0.5s ease-out forwards';
        
        setTimeout(() => {
            if (sandboxItems.contains(item)) {
                sandboxItems.removeChild(item);
                itemCount--;
                
                // 检查符号动力学
                checkSymbolDynamics();
                
                // 更新环境音效
                updateEnvironmentalSounds();
            }
        }, 500);
    }
    
    // 重置沙箱
    function resetSandbox() {
        const items = document.querySelectorAll('.sandbox-item');
        
        // 添加沙具下沉动画
        items.forEach((item, index) => {
            item.style.animation = `itemSink ${0.3 + index * 0.05}s ease-out forwards`;
        });
        
        // 3秒后清除所有沙具
        setTimeout(() => {
            items.forEach(item => {
                if (sandboxItems.contains(item)) {
                    sandboxItems.removeChild(item);
                }
            });
            
            itemCount = 0;
            
            // 重置沙箱样式
            sandbox.classList.remove('growth-environment');
            
            // 清除环境音效
            clearEnvironmentalSounds();
        }, 3000);
        
        showNotification('沙盘已重置', 'success');
    }
    
    // 保存场景
    function saveScene() {
        // 收集沙具数据
        const sceneData = {
            timestamp: new Date().toISOString(),
            itemCount: itemCount,
            items: []
        };
        
        const items = document.querySelectorAll('.sandbox-item');
        items.forEach(item => {
            sceneData.items.push({
                category: item.dataset.category,
                name: item.dataset.name,
                x: parseInt(item.style.left),
                y: parseInt(item.style.top),
                rotation: parseInt(item.dataset.rotation),
                scale: parseFloat(item.dataset.scale)
            });
        });
        
        // 生成心理快照标签
        const tags = generatePsychologicalTags(sceneData);
        sceneData.tags = tags;
        
        // 保存到localStorage
        const scenes = JSON.parse(localStorage.getItem('sandboxScenes') || '[]');
        scenes.push(sceneData);
        localStorage.setItem('sandboxScenes', JSON.stringify(scenes));
        
        showNotification('场景已保存', 'success');
    }
    
    // 生成心理快照标签
    function generatePsychologicalTags(sceneData) {
        const tags = [];
        const categoryCounts = {};
        
        // 统计各类别数量
        sceneData.items.forEach(item => {
            if (!categoryCounts[item.category]) {
                categoryCounts[item.category] = 0;
            }
            categoryCounts[item.category]++;
        });
        
        // 找出最主要的类别
        let maxCount = 0;
        let mainCategory = null;
        
        Object.entries(categoryCounts).forEach(([category, count]) => {
            if (count > maxCount) {
                maxCount = count;
                mainCategory = category;
            }
        });
        
        if (mainCategory) {
            const categoryNames = {
                self: '自我',
                relationship: '关系',
                environment: '环境',
                emotion: '情绪',
                defense: '防御',
                growth: '成长',
                time: '时间'
            };
            tags.push(categoryNames[mainCategory]);
        }
        
        // 添加水域标签（如果有水域元素）
        const hasWaterElements = sceneData.items.some(item => 
            item.category === 'environment' && 
            ['河流', '湖泊'].includes(item.name)
        );
        if (hasWaterElements) {
            tags.push('水域');
        }
        
        // 添加密度标签
        if (sceneData.itemCount > 10) {
            tags.push('丰富');
        } else if (sceneData.itemCount < 3) {
            tags.push('简约');
        }
        
        return tags;
    }
    
    // 显示AI解读
    function showAIInterpretation() {
        // 创建AI解读面板
        if (!aiInterpretation) {
            const panel = document.createElement('div');
            panel.id = 'ai-interpretation';
            panel.className = 'ai-interpretation hidden';
            panel.style.cssText = `
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
                max-width: 600px;
                width: 90%;
                max-height: 300px;
                overflow-y: auto;
                z-index: 40;
                opacity: 0;
                transition: opacity 0.5s ease;
            `;
            
            // 添加标题和关闭按钮
            const header = document.createElement('div');
            header.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 16px;
                padding-bottom: 12px;
                border-bottom: 1px solid #eee;
            `;
            
            const title = document.createElement('h3');
            title.textContent = 'AI心理解读';
            title.style.cssText = `
                margin: 0;
                font-size: 18px;
                font-weight: 600;
                color: #333;
            `;
            
            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '<i class="fa fa-times"></i>';
            closeBtn.style.cssText = `
                background: none;
                border: none;
                color: #666;
                font-size: 18px;
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                transition: all 0.2s ease;
            `;
            
            closeBtn.addEventListener('click', function() {
                panel.classList.add('hidden');
                panel.style.opacity = '0';
            });
            
            header.appendChild(title);
            header.appendChild(closeBtn);
            
            // 添加解读内容
            const content = document.createElement('div');
            content.id = 'interpretation-content';
            content.style.cssText = `
                font-size: 14px;
                line-height: 1.6;
                color: #555;
            `;
            
            panel.appendChild(header);
            panel.appendChild(content);
            
            // 添加到沙箱
            sandbox.appendChild(panel);
        }
        
        // 生成解读内容
        const interpretation = generateInterpretation();
        document.getElementById('interpretation-content').textContent = interpretation;
        
        // 显示面板
        aiInterpretation.classList.remove('hidden');
        aiInterpretation.style.opacity = '1';
    }
    
    // 生成AI解读
    function generateInterpretation() {
        const items = document.querySelectorAll('.sandbox-item');
        
        if (items.length === 0) {
            return '你的沙盘是空的，试着添加一些符号来表达你的内心世界。每一个符号的选择和摆放位置都反映着你潜意识中的想法和感受。';
        }
        
        // 分析沙具位置关系
        const itemPositions = [];
        items.forEach(item => {
            const rect = item.getBoundingClientRect();
            const sandboxRect = sandbox.getBoundingClientRect();
            itemPositions.push({
                element: item,
                category: item.dataset.category,
                name: item.dataset.name,
                x: rect.left - sandboxRect.left + rect.width / 2,
                y: rect.top - sandboxRect.top + rect.height / 2
            });
        });
        
        // 生成解读
        const interpretations = [];
        
        // 1. 基于类别分析
        const categoryCounts = {};
        itemPositions.forEach(item => {
            if (!categoryCounts[item.category]) {
                categoryCounts[item.category] = 0;
            }
            categoryCounts[item.category]++;
        });
        
        // 2. 寻找关系模式
        const selfItems = itemPositions.filter(item => item.category === 'self');
        const relationshipItems = itemPositions.filter(item => item.category === 'relationship');
        const growthItems = itemPositions.filter(item => item.category === 'growth');
        
        // 自我与成长的关系
        if (selfItems.length > 0 && growthItems.length > 0) {
            const selfItem = selfItems[0];
            const growthItem = growthItems.sort((a, b) => {
                const distA = Math.sqrt(Math.pow(a.x - selfItem.x, 2) + Math.pow(a.y - selfItem.y, 2));
                const distB = Math.sqrt(Math.pow(b.x - selfItem.x, 2) + Math.pow(b.y - selfItem.y, 2));
                return distA - distB;
            })[0];
            
            const distance = Math.sqrt(Math.pow(growthItem.x - selfItem.x, 2) + Math.pow(growthItem.y - selfItem.y, 2));
            
            if (distance < 100) {
                interpretations.push(`你将${selfItem.name}与${growthItem.name}放在一起，似乎在期待个人成长和内心转变。`);
            }
        }
        
        // 3. 情绪表达
        const emotionItems = itemPositions.filter(item => item.category === 'emotion');
        if (emotionItems.length > 0) {
            interpretations.push(`你的沙盘包含了情绪符号，这表明你可能正在探索和表达内心的情感状态。`);
        }
        
        // 4. 防御机制
        const defenseItems = itemPositions.filter(item => item.category === 'defense');
        if (defenseItems.length > 0) {
            interpretations.push(`防御符号的存在可能反映了你在保护自己或建立心理边界的需求。`);
        }
        
        // 如果没有特定关系，生成通用解读
        if (interpretations.length === 0) {
            interpretations.push('你的沙盘展现了丰富的内心世界。每个符号都有其特殊含义，它们共同构成了一个独特的心理图景。');
        }
        
        interpretations.push('记住，这只是一种引导性的解读。最真实的理解来自于你自己对这些符号的感受和联想。');
        
        return interpretations.join(' ');
    }
    
    // 显示引导问题
    function showGuidingQuestion() {
        if (guidingQuestionVisible) return;
        
        guidingQuestionVisible = true;
        
        const questions = [
            '这些符号中，哪个让你感觉最亲近？',
            '你的沙盘故事正在讲述什么？',
            '有没有哪个符号代表着你最近的感受？',
            '这些符号之间有什么联系？'
        ];
        
        const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
        
        // 创建问题弹窗
        const questionCard = document.createElement('div');
        questionCard.className = 'guiding-question';
        questionCard.innerHTML = `
            <p class="question-text">${randomQuestion}</p>
            <div class="question-actions">
                <button class="skip-btn">跳过</button>
            </div>
        `;
        questionCard.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
            max-width: 400px;
            width: 90%;
            z-index: 1000;
            opacity: 0;
            animation: fadeIn 0.5s ease-out forwards;
        `;
        
        questionCard.querySelector('.question-text').style.cssText = `
            font-size: 16px;
            line-height: 1.6;
            color: #333;
            margin: 0 0 20px 0;
            font-style: italic;
        `;
        
        const skipBtn = questionCard.querySelector('.skip-btn');
        skipBtn.style.cssText = `
            background: #6366f1;
            color: white;
            border: none;
            padding: 8px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s ease;
        `;
        
        skipBtn.addEventListener('mouseenter', function() {
            this.style.background = #4f46e5;
        });
        
        skipBtn.addEventListener('click', function() {
            questionCard.style.opacity = '0';
            setTimeout(() => {
                questionCard.remove();
                guidingQuestionVisible = false;
            }, 300);
        });
        
        // 添加到页面
        document.body.appendChild(questionCard);
    }
    
    // 检查符号动力学
    function checkSymbolDynamics() {
        const items = document.querySelectorAll('.sandbox-item');
        
        // 1. 自我与关系符号的连接
        const selfItems = Array.from(items).filter(item => item.category === 'self');
        const relationshipItems = Array.from(items).filter(item => item.category === 'relationship');
        
        selfItems.forEach(selfItem => {
            relationshipItems.forEach(relItem => {
                const selfRect = selfItem.getBoundingClientRect();
                const relRect = relItem.getBoundingClientRect();
                const distance = Math.sqrt(
                    Math.pow(selfRect.left + selfRect.width/2 - (relRect.left + relRect.width/2), 2) +
                    Math.pow(selfRect.top + selfRect.height/2 - (relRect.top + relRect.height/2), 2)
                );
                
                // 如果距离小于150px，创建连接线
                if (distance < 150) {
                    createConnectionLine(selfItem, relItem, distance);
                }
            });
        });
        
        // 2. 防御符号包围情绪符号的效果
        const defenseItems = Array.from(items).filter(item => item.category === 'defense');
        const emotionItems = Array.from(items).filter(item => item.category === 'emotion');
        
        emotionItems.forEach(emotionItem => {
            // 检查是否被防御符号包围
            const isSurrounded = isItemSurrounded(emotionItem, defenseItems, 200);
            if (isSurrounded) {
                emotionItem.style.opacity = '0.6';
                emotionItem.style.filter = 'grayscale(50%)';
            } else {
                emotionItem.style.opacity = '1';
                emotionItem.style.filter = '';
            }
        });
        
        // 3. 成长符号超过3个，整体沙面泛起微光
        const growthItems = Array.from(items).filter(item => item.category === 'growth');
        if (growthItems.length >= 3) {
            sandbox.classList.add('growth-environment');
        } else {
            sandbox.classList.remove('growth-environment');
        }
    }
    
    // 创建连接线
    function createConnectionLine(item1, item2, distance) {
        // 清除已存在的连接线
        const existingLines = document.querySelectorAll('.connection-line');
        existingLines.forEach(line => {
            if ((line.dataset.from === item1.dataset.name && line.dataset.to === item2.dataset.name) ||
                (line.dataset.from === item2.dataset.name && line.dataset.to === item1.dataset.name)) {
                line.remove();
            }
        });
        
        // 创建新连接线
        const line = document.createElement('div');
        line.className = 'connection-line';
        line.dataset.from = item1.dataset.name;
        line.dataset.to = item2.dataset.name;
        
        // 计算位置和角度
        const rect1 = item1.getBoundingClientRect();
        const rect2 = item2.getBoundingClientRect();
        const sandboxRect = sandbox.getBoundingClientRect();
        
        const x1 = rect1.left + rect1.width/2 - sandboxRect.left;
        const y1 = rect1.top + rect1.height/2 - sandboxRect.top;
        const x2 = rect2.left + rect2.width/2 - sandboxRect.left;
        const y2 = rect2.top + rect2.height/2 - sandboxRect.top;
        
        const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
        
        // 设置样式 - 根据距离调整颜色
        const opacity = 1 - (distance / 150);
        const hue = 270 - Math.floor(distance / 150 * 100); // 从深紫到浅灰
        
        line.style.cssText = `
            position: absolute;
            left: ${x1}px;
            top: ${y1}px;
            width: ${distance}px;
            height: 2px;
            background: linear-gradient(90deg, hsl(${hue}, 70%, 60%), transparent);
            transform-origin: 0 0;
            transform: rotate(${angle}deg);
            z-index: 5;
            opacity: ${opacity};
            pointer-events: none;
        `;
        
        // 添加到沙具容器
        sandboxItems.appendChild(line);
    }
    
    // 检查物品是否被包围
    function isItemSurrounded(target, surroundItems, radius) {
        let surroundCount = 0;
        const sandboxRect = sandbox.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const targetX = targetRect.left + targetRect.width/2 - sandboxRect.left;
        const targetY = targetRect.top + targetRect.height/2 - sandboxRect.top;
        
        surroundItems.forEach(item => {
            const itemRect = item.getBoundingClientRect();
            const itemX = itemRect.left + itemRect.width/2 - sandboxRect.left;
            const itemY = itemRect.top + itemRect.height/2 - sandboxRect.top;
            
            const distance = Math.sqrt(Math.pow(itemX - targetX, 2) + Math.pow(itemY - targetY, 2));
            if (distance < radius) {
                surroundCount++;
            }
        });
        
        return surroundCount >= 2; // 被至少2个防御符号包围
    }
    
    // 更新视觉效果
    function updateVisualEffects(item) {
        // 根据类别添加特殊效果
        if (item.dataset.category === 'growth') {
            // 成长符号的生长动画
            item.style.animation = 'growthAnimation 2s ease-in-out infinite';
        } else if (item.dataset.category === 'emotion') {
            // 情绪符号的呼吸动画
            item.style.animation = 'breathAnimation 3s ease-in-out infinite';
        }
    }
    
    // 更新环境音效
    function updateEnvironmentalSounds() {
        // 这里将实现根据沙具添加环境音效的逻辑
        // 暂时简单实现
    }
    
    // 清除环境音效
    function clearEnvironmentalSounds() {
        // 清除所有环境音效
    }
    
    // 重置沙盘
    function resetSandbox() {
        // 显示确认对话框
        if (confirm('确定要重置沙盘吗？这将清除所有已放置的沙具。')) {
            // 获取所有沙具
            const items = document.querySelectorAll('.sandbox-item');
            
            // 为所有沙具添加消散动画
            items.forEach(item => {
                item.style.animation = 'itemDissolve 0.5s ease-out forwards';
            });
            
            // 动画完成后移除所有沙具
            setTimeout(() => {
                // 移除所有沙具
                const sandboxItems = document.getElementById('sandbox-items');
                if (sandboxItems) {
                    sandboxItems.innerHTML = '';
                }
                
                // 重置状态变量
                itemCount = 0;
                guidingQuestionVisible = false;
                currentItem = null;
                
                // 清除环境音效
                clearEnvironmentalSounds();
                
                // 隐藏所有面板
                hideRadialMenu();
                hideVariantSelector();
                hideItemControls();
                
                // 如果AI解读面板存在，也隐藏它
                if (aiInterpretation) {
                    aiInterpretation.classList.add('hidden');
                    aiInterpretation.style.opacity = '0';
                }
                
                // 显示重置成功通知
                showNotification('沙盘已重置', 'success');
            }, 500);
        }
    }
    
    // 播放音效
    function playSound(type) {
        // 简化版音效播放，实际项目中可以使用更复杂的音频系统
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // 根据音效类型设置参数
            switch(type) {
                case 'click':
                    oscillator.frequency.value = 600;
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                    oscillator.start();
                    oscillator.stop(audioContext.currentTime + 0.1);
                    break;
                case 'place':
                    oscillator.frequency.value = 400;
                    oscillator.type = 'sine';
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                    oscillator.start();
                    oscillator.stop(audioContext.currentTime + 0.2);
                    break;
                case 'delete':
                    oscillator.frequency.value = 200;
                    oscillator.type = 'sawtooth';
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
                    oscillator.start();
                    oscillator.stop(audioContext.currentTime + 0.15);
                    break;
                case 'rotate':
                    oscillator.frequency.value = 300;
                    oscillator.frequency.exponentialRampToValueAtTime(350, audioContext.currentTime + 0.1);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                    oscillator.start();
                    oscillator.stop(audioContext.currentTime + 0.1);
                    break;
            }
        } catch (e) {
            console.warn('无法播放音效:', e);
        }
    }
    
    // 触发触觉反馈
    function triggerHapticFeedback() {
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    }
    
    // 显示通知
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background-color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            font-size: 14px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // 显示通知
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // 自动关闭
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // 辅助函数：十六进制颜色转RGB
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 0, 0';
    }
    
    // 隐藏环形菜单
    function hideRadialMenu() {
        if (radialMenu) {
            radialMenu.classList.remove('visible');
            setTimeout(() => {
                radialMenu.classList.add('hidden');
            }, 300);
        }
    }
    
    // 隐藏变体选择器
    function hideVariantSelector() {
        if (variantSelector) {
            variantSelector.classList.remove('visible');
            setTimeout(() => {
                variantSelector.classList.add('hidden');
            }, 300);
        }
    }
    
    // 隐藏沙具功能盘
    function hideItemControls() {
        if (itemControls) {
            itemControls.classList.remove('visible');
            setTimeout(() => {
                itemControls.classList.add('hidden');
                currentItem = null;
            }, 300);
        }
    }
    
    // 添加全局点击事件，点击空白处隐藏所有面板
    document.addEventListener('click', function(e) {
        if (!radialMenu.contains(e.target) && 
            !variantSelector?.contains(e.target) && 
            !itemControls?.contains(e.target) &&
            e.target !== sandbox &&
            e.target !== sandboxItems) {
            
            hideRadialMenu();
            hideVariantSelector();
            hideItemControls();
        }
    });
    
    // 添加CSS动画
    const style = document.createElement('style');
    style.textContent = `
        /* 沙具放置弹跳动画 */
        @keyframes itemBounce {
            0% { transform: scale(0.8) translateY(-20px); opacity: 0; }
            60% { transform: scale(1.1) translateY(5px); opacity: 1; }
            100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        
        /* 沙具消散动画 */
        @keyframes itemDissolve {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.5; }
            100% { transform: scale(0); opacity: 0; }
        }
        
        /* 沙具下沉动画 */
        @keyframes itemSink {
            0% { transform: translateY(0) scale(1); opacity: 1; }
            100% { transform: translateY(50px) scale(0.5); opacity: 0; }
        }
        
        /* 生长动画 */
        @keyframes growthAnimation {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        
        /* 呼吸动画 */
        @keyframes breathAnimation {
            0%, 100% { opacity: 0.8; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.1); }
        }
        
        /* 成长环境效果 */
        .sandbox-area.growth-environment {
            box-shadow: 0 0 40px rgba(84, 160, 255, 0.3);
        }
        
        /* 环形菜单显示效果 */
        .radial-menu.visible {
            opacity: 1;
            transform: scale(1);
        }
        
        /* 变体选择器显示效果 */
        .variant-selector.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* 功能盘显示效果 */
        .item-controls.visible {
            opacity: 1;
            transform: scale(1);
        }
    `;
    document.head.appendChild(style);
    
    console.log('沉浸式沙盘交互系统初始化完成！');
});
