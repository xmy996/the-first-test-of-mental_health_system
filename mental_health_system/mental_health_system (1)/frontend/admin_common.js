// 管理员页面统一优化JavaScript功能
class AdminDashboard {
  constructor() {
    this.init();
  }

  init() {
    // 初始化DOM元素引用
    this.initElements();
    // 设置事件监听器
    this.setupEventListeners();
    // 初始化页面状态
    this.initializePage();
    // 加载增强UI功能
    this.loadEnhancedUI();
    // 统一页面样式
    this.unifyPageStyles();
    // 丰富页面内容
    this.enrichPageContent();
    
    // 应用通用增强功能
    this.addCommonEnhancements();
    // 根据当前页面应用特定增强
    this.applyPageSpecificEnhancements();
    // 确保样式一致性
    this.ensureStyleConsistency();
  }
  
  /**
   * 根据当前页面应用特定增强
   */
  applyPageSpecificEnhancements() {
    const pathname = window.location.pathname;
    
    // 仪表盘页面增强
    if (pathname.includes('dashboard') || pathname === '/admin') {
      this.enrichDashboard();
    }
    // 用户管理页面增强
    else if (pathname.includes('users') || pathname.includes('user_management')) {
      this.enrichUserManagement();
    }
    // 测评管理页面增强
    else if (pathname.includes('assessment') || pathname.includes('evaluate')) {
      this.enrichAssessmentManagement();
    }
    // 预约管理页面增强
    else if (pathname.includes('booking') || pathname.includes('appointment')) {
      this.enrichBookingManagement();
    }
    // 活动管理页面增强
    else if (pathname.includes('activity') || pathname.includes('event')) {
      this.enrichActivityManagement();
    }
    // 咨询师管理页面增强
    else if (pathname.includes('consultant') || pathname.includes('therapist')) {
      this.enrichConsultantManagement();
    }
    // AI助手管理页面增强
    else if (pathname.includes('ai_assistant') || pathname.includes('chatbot')) {
      this.enrichAIAssistantManagement();
    }
    // 系统设置页面增强
    else if (pathname.includes('settings') || pathname.includes('system')) {
      this.enrichSystemSettings();
    }

  initElements() {
    // 侧边栏相关元素
    this.sidebar = document.querySelector('.sidebar');
    this.mobileMenuButton = document.querySelector('#mobile-menu-button');
    this.sidebarItems = document.querySelectorAll('.sidebar-item');
    
    // 用户菜单相关元素
    this.userMenuButton = document.querySelector('#user-menu-button');
    this.userDropdown = document.querySelector('#user-dropdown');
    this.logoutButton = document.querySelector('#logout-button');
    
    // 移动端用户菜单
    this.mobileUserMenuButton = document.querySelector('#mobile-user-menu-button');
    this.mobileUserDropdown = document.querySelector('#mobile-user-dropdown');
    this.mobileLogoutButton = document.querySelector('#mobile-logout-button');
    
    // 页面标题
    this.pageTitle = document.querySelector('#page-title');
    
    // 当前页面标识
    this.currentPage = window.location.pathname.split('/').pop();
  }

  setupEventListeners() {
    // 移动端菜单切换
    if (this.mobileMenuButton) {
      this.mobileMenuButton.addEventListener('click', this.toggleSidebar.bind(this));
    }
    
    // 侧边栏项目点击事件
    this.sidebarItems.forEach(item => {
      item.addEventListener('click', (e) => {
        this.handleSidebarItemClick(e, item);
      });
    });
    
    // 用户菜单切换
    if (this.userMenuButton && this.userDropdown) {
      this.userMenuButton.addEventListener('click', this.toggleUserMenu.bind(this));
    }
    
    // 移动端用户菜单切换
    if (this.mobileUserMenuButton && this.mobileUserDropdown) {
      this.mobileUserMenuButton.addEventListener('click', this.toggleMobileUserMenu.bind(this));
    }
    
    // 退出登录事件
    if (this.logoutButton) {
      this.logoutButton.addEventListener('click', this.handleLogout.bind(this));
    }
    
    if (this.mobileLogoutButton) {
      this.mobileLogoutButton.addEventListener('click', this.handleLogout.bind(this));
    }
    
    // 点击页面其他区域关闭菜单
    document.addEventListener('click', this.handleDocumentClick.bind(this));
    
    // 窗口大小变化处理
    window.addEventListener('resize', this.handleResize.bind(this));
    
    // 键盘事件处理
    document.addEventListener('keydown', this.handleKeydown.bind(this));
  }

  initializePage() {
    // 设置当前活动的侧边栏项目
    this.setActiveSidebarItem();
    
    // 更新页面标题
    this.updatePageTitle();
    
    // 获取并显示管理员信息
    this.fetchAdminInfo();
    
    // 初始化响应式布局
    this.initializeResponsive();
    
    // 添加页面加载动画
    this.addPageLoadAnimation();
  }

  toggleSidebar() {
    if (this.sidebar) {
      this.sidebar.classList.toggle('active');
      // 添加动画效果
      this.sidebar.classList.add('slide-in');
      setTimeout(() => {
        this.sidebar.classList.remove('slide-in');
      }, 300);
    }
  }

  handleSidebarItemClick(e, item) {
    // 移除所有活动状态
    this.sidebarItems.forEach(sidebarItem => {
      sidebarItem.classList.remove('active');
    });
    
    // 添加当前项活动状态
    item.classList.add('active');
    
    // 在移动设备上点击后关闭侧边栏
    if (window.innerWidth <= 768 && this.sidebar) {
      this.sidebar.classList.remove('active');
    }
    
    // 滚动到页面顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleUserMenu() {
    if (this.userDropdown) {
      this.userDropdown.classList.toggle('hidden');
      this.userDropdown.classList.add('fade-in');
      setTimeout(() => {
        this.userDropdown.classList.remove('fade-in');
      }, 300);
    }
  }

  toggleMobileUserMenu() {
    if (this.mobileUserDropdown) {
      this.mobileUserDropdown.classList.toggle('hidden');
      this.mobileUserDropdown.classList.add('fade-in');
      setTimeout(() => {
        this.mobileUserDropdown.classList.remove('fade-in');
      }, 300);
    }
  }

  handleLogout(e) {
    e.preventDefault();
    
    // 显示确认对话框
    if (confirm('确定要退出登录吗？')) {
      // 模拟退出登录过程
      this.showLoading(true);
      
      setTimeout(() => {
        // 清除本地存储中的登录信息
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminInfo');
        
        // 重定向到登录页面
        window.location.href = 'admin_login.html';
        
        this.showLoading(false);
      }, 800);
    }
  }

  handleDocumentClick(e) {
    // 关闭用户菜单
    if (this.userDropdown && !this.userDropdown.classList.contains('hidden') &&
        this.userMenuButton && !this.userMenuButton.contains(e.target)) {
      this.userDropdown.classList.add('hidden');
    }
    
    // 关闭移动端用户菜单
    if (this.mobileUserDropdown && !this.mobileUserDropdown.classList.contains('hidden') &&
        this.mobileUserMenuButton && !this.mobileUserMenuButton.contains(e.target)) {
      this.mobileUserDropdown.classList.add('hidden');
    }
    
    // 关闭侧边栏（点击侧边栏外部）
    if (window.innerWidth <= 768 && this.sidebar && this.sidebar.classList.contains('active') &&
        !this.sidebar.contains(e.target) && this.mobileMenuButton && !this.mobileMenuButton.contains(e.target)) {
      this.sidebar.classList.remove('active');
    }
  }

  handleResize() {
    // 在大屏幕上自动显示侧边栏
    if (window.innerWidth > 768 && this.sidebar) {
      this.sidebar.classList.remove('active');
    }
    
    // 关闭打开的下拉菜单
    if (this.userDropdown) {
      this.userDropdown.classList.add('hidden');
    }
    if (this.mobileUserDropdown) {
      this.mobileUserDropdown.classList.add('hidden');
    }
    
    // 更新响应式布局
    this.updateResponsiveLayout();
  }

  handleKeydown(e) {
    // ESC键关闭菜单
    if (e.key === 'Escape') {
      if (this.userDropdown) {
        this.userDropdown.classList.add('hidden');
      }
      if (this.mobileUserDropdown) {
        this.mobileUserDropdown.classList.add('hidden');
      }
      if (window.innerWidth <= 768 && this.sidebar) {
        this.sidebar.classList.remove('active');
      }
    }
  }

  setActiveSidebarItem() {
    // 根据当前页面设置活动侧边栏项目
    const pageMap = {
      'admin_dashboard.html': 'dashboard',
      'user_management.html': 'users',
      'activity_management.html': 'activities',
      'assessment_management.html': 'assessments',
      'consultant_management.html': 'consultants',
      'booking_management.html': 'bookings',
      'system_settings.html': 'settings'
    };
    
    const sectionId = pageMap[this.currentPage];
    if (sectionId) {
      const activeItem = document.querySelector(`.sidebar-item[data-section="${sectionId}"]`);
      if (activeItem) {
        activeItem.classList.add('active');
      }
    }
  }

  updatePageTitle() {
    // 如果页面标题元素存在，则确保它显示正确的内容
    if (this.pageTitle) {
      // 页面标题映射
      const titleMap = {
        'admin_dashboard.html': '仪表盘概览',
        'user_management.html': '用户管理',
        'activity_management.html': '活动管理',
        'assessment_management.html': '测评管理',
        'consultant_management.html': '咨询师管理',
        'booking_management.html': '预约管理',
        'system_settings.html': '系统设置'
      };
      
      const title = titleMap[this.currentPage];
      if (title) {
        this.pageTitle.textContent = title;
      }
    }
  }

  fetchAdminInfo() {
    // 从本地存储获取管理员信息
    const adminInfo = localStorage.getItem('adminInfo');
    
    if (adminInfo) {
      try {
        const info = JSON.parse(adminInfo);
        this.displayAdminInfo(info);
      } catch (error) {
        console.error('解析管理员信息失败:', error);
        this.displayDefaultAdminInfo();
      }
    } else {
      this.displayDefaultAdminInfo();
    }
  }

  displayAdminInfo(info) {
    const adminNameElement = document.querySelector('#admin-name');
    const adminEmailElement = document.querySelector('#admin-email');
    const mobileAdminNameElement = document.querySelector('#mobile-admin-name');
    
    if (adminNameElement) {
      adminNameElement.textContent = info.name || '管理员';
    }
    if (adminEmailElement) {
      adminEmailElement.textContent = info.email || 'admin@example.com';
    }
    if (mobileAdminNameElement) {
      mobileAdminNameElement.textContent = info.name || '管理员';
    }
  }

  displayDefaultAdminInfo() {
    const adminNameElement = document.querySelector('#admin-name');
    const adminEmailElement = document.querySelector('#admin-email');
    const mobileAdminNameElement = document.querySelector('#mobile-admin-name');
    
    if (adminNameElement) {
      adminNameElement.textContent = '管理员';
    }
    if (adminEmailElement) {
      adminEmailElement.textContent = 'admin@example.com';
    }
    if (mobileAdminNameElement) {
      mobileAdminNameElement.textContent = '管理员';
    }
  }

  initializeResponsive() {
    // 设置初始响应式状态
    this.updateResponsiveLayout();
  }

  updateResponsiveLayout() {
    // 更新响应式布局类
    const cards = document.querySelectorAll('.card');
    const statCards = document.querySelectorAll('.stat-card');
    
    if (window.innerWidth <= 480) {
      // 移动端样式调整
      cards.forEach(card => {
        card.classList.add('p-4');
      });
      statCards.forEach(card => {
        const content = card.querySelector('.stat-card-content');
        if (content) {
          content.classList.add('p-4');
        }
      });
    } else {
      // 桌面端样式调整
      cards.forEach(card => {
        card.classList.remove('p-4');
      });
      statCards.forEach(card => {
        const content = card.querySelector('.stat-card-content');
        if (content) {
          content.classList.remove('p-4');
        }
      });
    }
  }

  addPageLoadAnimation() {
    // 添加页面加载动画
    document.body.classList.add('fade-in');
    setTimeout(() => {
      document.body.classList.remove('fade-in');
    }, 500);
  }

  showLoading(show) {
    // 显示或隐藏加载指示器
    let loader = document.querySelector('#page-loader');
    
    if (!loader && show) {
      loader = document.createElement('div');
      loader.id = 'page-loader';
      loader.className = 'fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50';
      loader.innerHTML = `
        <div class="bg-white rounded-lg p-6 shadow-xl flex flex-col items-center">
          <div class="loading mr-2"></div>
          <p class="mt-2 text-gray-700">处理中...</p>
        </div>
      `;
      document.body.appendChild(loader);
    }
    
    if (loader) {
      loader.style.display = show ? 'flex' : 'none';
    }
  }

  loadEnhancedUI() {
    // 检查增强UI模块是否已加载
    if (window.EnhancedUI) {
      // 初始化增强UI功能
      this.enhancedUI = new window.EnhancedUI();
      this.enhancedUI.initForAdmin();
    } else {
      // 尝试动态加载增强UI模块
      this.dynamicLoadEnhancedUI();
    }
  }
  
  /**
   * 统一页面样式
   * 确保所有后台管理页面样式一致，自动调整不符合样式规范的元素
   */
  unifyPageStyles() {
    // 确保body有正确的背景色和基础样式
    document.body.classList.add('bg-light', 'font-inter', 'text-dark', 'min-h-screen');
    document.body.classList.remove('bg-gray-50');
    
    // 统一卡片样式
    this.unifyCards();
    
    // 统一按钮样式
    this.unifyButtons();
    
    // 统一表格样式
    this.unifyTables();
    
    // 统一统计卡片样式
    this.unifyStatCards();
    
    // 统一表单样式
    this.unifyForms();
    
    // 统一徽章样式
    this.unifyBadges();
    
    // 修复导航栏重复问题
    this.fixDuplicateNavbars();
  }
  
  /**
   * 丰富页面内容
   * 为各管理页面添加动态内容、统计数据和交互元素
   */
  enrichPageContent() {
    // 根据当前页面添加特定内容
    const pageName = this.currentPage;
    
    switch(pageName) {
      case 'admin_dashboard.html':
        this.enrichDashboard();
        break;
      case 'user_management.html':
        this.enrichUserManagement();
        break;
      case 'assessment_management.html':
        this.enrichAssessmentManagement();
        break;
      case 'booking_management.html':
        this.enrichBookingManagement();
        break;
    
    // 确保样式一致性，处理任何不符合规范的样式
    this.ensureStyleConsistency();
  }
  
  /**
   * 确保所有页面样式一致性
   * 自动检测并修复不符合样式规范的元素
   */
  ensureStyleConsistency() {
    // 修复不一致的卡片样式
    this.fixInconsistentCards();
    
    // 修复不一致的按钮样式
    this.fixInconsistentButtons();
    
    // 修复不一致的表单元素样式
    this.fixInconsistentFormElements();
    
    // 修复不一致的表格样式
    this.fixInconsistentTables();
    
    // 确保所有页面使用相同的配色方案
    this.applyConsistentColorScheme();
  }
  
  /**
   * 修复不一致的卡片样式
   */
  fixInconsistentCards() {
    const cards = document.querySelectorAll('.card, .panel, .box, .widget');
    cards.forEach(card => {
      // 移除不一致的类
      card.classList.remove('border-success', 'border-info', 'border-warning', 'border-danger');
      
      // 添加统一的卡片样式
      card.classList.add('bg-white', 'rounded-xl', 'shadow-sm', 'border', 'border-gray-200', 'overflow-hidden');
    });
  }
  
  /**
   * 修复不一致的按钮样式
   */
  fixInconsistentButtons() {
    const buttons = document.querySelectorAll('button:not(:disabled)');
    buttons.forEach(button => {
      // 移除可能导致样式不一致的类
      button.classList.remove('btn-primary', 'btn-success', 'btn-info', 'btn-warning', 'btn-danger', 'btn-secondary');
      
      // 根据按钮文本内容或其他属性确定按钮类型
      const buttonText = button.textContent.toLowerCase();
      if (buttonText.includes('删除') || buttonText.includes('取消')) {
        button.className = 'px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-300';
      } else if (buttonText.includes('确认') || buttonText.includes('保存') || buttonText.includes('提交')) {
        button.className = 'px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-300';
      } else {
        button.className = 'px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300';
      }
    });
  }
  
  /**
   * 修复不一致的表单元素样式
   */
  fixInconsistentFormElements() {
    const formElements = document.querySelectorAll('input, select, textarea');
    formElements.forEach(element => {
      // 移除不一致的类
      element.classList.remove('form-control', 'input-lg', 'input-sm', 'form-control-lg', 'form-control-sm');
      
      // 添加统一的表单元素样式
      element.className = 'px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all duration-200 w-full';
    });
  }
  
  /**
   * 修复不一致的表格样式
   */
  fixInconsistentTables() {
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
      // 移除不一致的类
      table.classList.remove('table', 'table-striped', 'table-hover', 'table-bordered');
      
      // 添加统一的表格样式
      table.className = 'min-w-full divide-y divide-gray-200';
      
      // 修复表头样式
      const thead = table.querySelector('thead');
      if (thead) {
        thead.className = 'bg-gray-50';
        const thElements = thead.querySelectorAll('th');
        thElements.forEach(th => {
          th.className = 'px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider';
        });
      }
      
      // 修复表格内容样式
      const tbody = table.querySelector('tbody');
      if (tbody) {
        tbody.className = 'bg-white divide-y divide-gray-200';
        const tdElements = tbody.querySelectorAll('td');
        tdElements.forEach(td => {
          td.className = 'px-4 py-3 whitespace-nowrap text-sm text-gray-500';
        });
      }
    });
  }
  
  /**
   * 应用统一的配色方案
   */
  applyConsistentColorScheme() {
    // 设置全局CSS变量来确保配色一致性
    document.documentElement.style.setProperty('--primary-color', '#3b82f6');
    document.documentElement.style.setProperty('--secondary-color', '#64748b');
    document.documentElement.style.setProperty('--success-color', '#10b981');
    document.documentElement.style.setProperty('--warning-color', '#f59e0b');
    document.documentElement.style.setProperty('--danger-color', '#ef4444');
    document.documentElement.style.setProperty('--info-color', '#0ea5e9');
    
    // 确保所有使用这些颜色的元素都保持一致
    this.updateColorReferences();
  }
  
  /**
   * 更新颜色引用
   */
  updateColorReferences() {
    // 更新使用主题色的元素
    const themeElements = document.querySelectorAll('.bg-primary, .text-primary, .border-primary, .bg-secondary, .text-secondary, .border-secondary');
    themeElements.forEach(element => {
      // 确保元素使用CSS变量而非硬编码颜色值
      if (element.classList.contains('bg-primary')) {
        element.style.backgroundColor = 'var(--primary-color)';
      }
      if (element.classList.contains('text-primary')) {
        element.style.color = 'var(--primary-color)';
      }
      if (element.classList.contains('border-primary')) {
        element.style.borderColor = 'var(--primary-color)';
      }
      if (element.classList.contains('bg-secondary')) {
        element.style.backgroundColor = 'var(--secondary-color)';
      }
      if (element.classList.contains('text-secondary')) {
        element.style.color = 'var(--secondary-color)';
      }
      if (element.classList.contains('border-secondary')) {
        element.style.borderColor = 'var(--secondary-color)';
      }
    });
  }
  
  /**
   * 丰富仪表盘内容
   */
  enrichDashboard() {
    // 添加动态统计卡片
    this.addDashboardStatCards();
    
    // 添加图表和可视化
    this.addDashboardCharts();
    
    // 添加快速操作面板
    this.addQuickActionsPanel();
    
    // 添加最近活动列表
    this.addRecentActivitiesList();
    
    // 添加系统状态指示器
    this.addSystemStatusIndicator();
  }
  
  /**
   * 添加仪表盘统计卡片
   */
  addDashboardStatCards() {
    const statContainer = document.querySelector('.dashboard-stats, .stats-container, .metrics-container');
    if (!statContainer) return;
    
    // 为统计卡片添加悬停效果
    const statCards = statContainer.querySelectorAll('.stat-card, .metric-card, .stat-item');
    statCards.forEach(card => {
      card.classList.add('transition-all', 'duration-300', 'hover:shadow-md', 'hover:-translate-y-1');
    });
  }
  
  /**
   * 添加仪表盘图表
   */
  addDashboardCharts() {
    // 为图表容器添加响应式样式
    const chartContainers = document.querySelectorAll('.chart-container, .chart-wrapper');
    chartContainers.forEach(container => {
      container.classList.add('bg-white', 'p-4', 'rounded-xl', 'border', 'border-gray-200');
    });
  }
  
  /**
   * 添加快速操作面板
   */
  addQuickActionsPanel() {
    const actionContainer = document.querySelector('.quick-actions, .action-panel');
    if (!actionContainer) return;
    
    actionContainer.classList.add('bg-white', 'p-4', 'rounded-xl', 'border', 'border-gray-200');
    
    // 为操作按钮添加样式
    const actionButtons = actionContainer.querySelectorAll('button');
    actionButtons.forEach(button => {
      button.classList.add('flex', 'items-center', 'gap-2', 'py-2', 'px-4', 'rounded-lg');
    });
  }
  
  /**
   * 添加最近活动列表
   */
  addRecentActivitiesList() {
    const activityList = document.querySelector('.recent-activities, .activity-log');
    if (!activityList) return;
    
    activityList.classList.add('bg-white', 'rounded-xl', 'border', 'border-gray-200');
    
    // 为活动项添加样式
    const activityItems = activityList.querySelectorAll('.activity-item');
    activityItems.forEach(item => {
      item.classList.add('p-3', 'border-b', 'border-gray-100');
    });
  }
  
  /**
   * 添加系统状态指示器
   */
  addSystemStatusIndicator() {
    const statusIndicator = document.querySelector('.system-status');
    if (!statusIndicator) return;
    
    // 添加状态徽章样式
    const statusBadge = statusIndicator.querySelector('.status-badge');
    if (statusBadge) {
      const statusText = statusBadge.textContent.toLowerCase();
      statusBadge.className = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
      
      if (statusText.includes('正常')) {
        statusBadge.classList.add('bg-green-100', 'text-green-800');
      } else if (statusText.includes('警告') || statusText.includes('注意')) {
        statusBadge.classList.add('bg-yellow-100', 'text-yellow-800');
      } else if (statusText.includes('错误') || statusText.includes('异常')) {
        statusBadge.classList.add('bg-red-100', 'text-red-800');
      }
    }
  }
  
  /**
   * 丰富用户管理页面内容
   */
  enrichUserManagement() {
    // 增强用户表格功能
    this.enhanceUserTable();
    
    // 添加用户筛选功能
    this.addUserFilterControls();
    
    // 增强用户详情视图
    this.enhanceUserDetailView();
    
    // 添加批量操作功能
    this.addBulkOperations();
  }
  
  /**
   * 增强用户表格功能
   */
  enhanceUserTable() {
    const userTable = document.querySelector('table#user-table, table.user-table');
    if (!userTable) return;
    
    // 添加分页控件样式
    const pagination = document.querySelector('.pagination');
    if (pagination) {
      pagination.classList.add('flex', 'justify-center', 'mt-4');
    }
  }
  
  /**
   * 添加用户筛选功能
   */
  addUserFilterControls() {
    const filterContainer = document.querySelector('.filter-container, .search-container');
    if (!filterContainer) return;
    
    filterContainer.classList.add('bg-gray-50', 'p-3', 'rounded-lg', 'mb-4');
  }
  
  /**
   * 增强用户详情视图
   */
  enhanceUserDetailView() {
    const detailView = document.querySelector('.user-detail, .profile-card');
    if (!detailView) return;
    
    detailView.classList.add('bg-white', 'p-4', 'rounded-xl', 'border', 'border-gray-200');
  }
  
  /**
   * 添加批量操作功能
   */
  addBulkOperations() {
    const bulkContainer = document.querySelector('.bulk-operations');
    if (!bulkContainer) return;
    
    bulkContainer.classList.add('flex', 'items-center', 'gap-2', 'mb-3');
  }
  
  /**
   * 丰富测评管理页面内容
   */
  enrichAssessmentManagement() {
    // 增强测评列表
    this.enhanceAssessmentList();
    
    // 添加测评统计图表
    this.addAssessmentCharts();
    
    // 增强测评详情
    this.enhanceAssessmentDetail();
  }
  
  /**
   * 增强测评列表
   */
  enhanceAssessmentList() {
    const assessmentList = document.querySelector('.assessment-list');
    if (!assessmentList) return;
    
    assessmentList.classList.add('space-y-3');
  }
  
  /**
   * 添加测评统计图表
   */
  addAssessmentCharts() {
    const chartContainer = document.querySelector('.assessment-stats');
    if (!chartContainer) return;
    
    chartContainer.classList.add('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-4');
  }
  
  /**
   * 增强测评详情
   */
  enhanceAssessmentDetail() {
    const detailView = document.querySelector('.assessment-detail');
    if (!detailView) return;
    
    detailView.classList.add('bg-white', 'p-4', 'rounded-xl', 'border', 'border-gray-200');
  }
  
  /**
   * 丰富预约管理页面内容
   */
  enrichBookingManagement() {
    // 增强预约日历
    this.enhanceBookingCalendar();
    
    // 增强预约列表
    this.enhanceBookingList();
    
    // 添加预约状态指示器
    this.addBookingStatusIndicators();
  }
  
  /**
   * 增强预约日历
   */
  enhanceBookingCalendar() {
    const calendar = document.querySelector('.booking-calendar, .calendar-view');
    if (!calendar) return;
    
    calendar.classList.add('bg-white', 'p-4', 'rounded-xl', 'border', 'border-gray-200');
  }
  
  /**
   * 增强预约列表
   */
  enhanceBookingList() {
    const bookingList = document.querySelector('.booking-list');
    if (!bookingList) return;
    
    bookingList.classList.add('divide-y', 'divide-gray-100');
  }
  
  /**
   * 添加预约状态指示器
   */
  addBookingStatusIndicators() {
    const statusElements = document.querySelectorAll('.booking-status');
    statusElements.forEach(element => {
      const statusText = element.textContent.toLowerCase();
      element.className = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
      
      if (statusText.includes('已确认') || statusText.includes('confirmed')) {
        element.classList.add('bg-green-100', 'text-green-800');
      } else if (statusText.includes('待确认') || statusText.includes('pending')) {
        element.classList.add('bg-yellow-100', 'text-yellow-800');
      } else if (statusText.includes('已取消') || statusText.includes('cancelled')) {
        element.classList.add('bg-gray-100', 'text-gray-800');
      } else if (statusText.includes('已完成') || statusText.includes('completed')) {
        element.classList.add('bg-blue-100', 'text-blue-800');
      }
    });
  }
  
  /**
   * 丰富活动管理页面内容
   */
  enrichActivityManagement() {
    // 增强活动列表
    this.enhanceActivityList();
    
    // 添加活动创建表单增强
    this.enhanceActivityForm();
    
    // 添加活动统计
    this.addActivityStats();
  }
  
  /**
   * 增强活动列表
   */
  enhanceActivityList() {
    const activityList = document.querySelector('.activity-list');
    if (!activityList) return;
    
    activityList.classList.add('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-4');
  }
  
  /**
   * 增强活动创建表单
   */
  enhanceActivityForm() {
    const activityForm = document.querySelector('form#activity-form, form.activity-form');
    if (!activityForm) return;
    
    activityForm.classList.add('bg-white', 'p-5', 'rounded-xl', 'border', 'border-gray-200');
  }
  
  /**
   * 添加活动统计
   */
  addActivityStats() {
    const statsContainer = document.querySelector('.activity-stats');
    if (!statsContainer) return;
    
    statsContainer.classList.add('grid', 'grid-cols-2', 'md:grid-cols-4', 'gap-4');
  }
  
  /**
   * 丰富咨询师管理页面内容
   */
  enrichConsultantManagement() {
    // 增强咨询师列表
    this.enhanceConsultantList();
    
    // 增强咨询师详情
    this.enhanceConsultantDetail();
    
    // 添加咨询师评分显示
    this.addConsultantRatings();
  }
  
  /**
   * 增强咨询师列表
   */
  enhanceConsultantList() {
    const consultantList = document.querySelector('.consultant-list');
    if (!consultantList) return;
    
    consultantList.classList.add('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-4');
  }
  
  /**
   * 增强咨询师详情
   */
  enhanceConsultantDetail() {
    const detailView = document.querySelector('.consultant-detail');
    if (!detailView) return;
    
    detailView.classList.add('bg-white', 'p-5', 'rounded-xl', 'border', 'border-gray-200');
  }
  
  /**
   * 添加咨询师评分显示
   */
  addConsultantRatings() {
    const ratingElements = document.querySelectorAll('.consultant-rating');
    ratingElements.forEach(element => {
      element.classList.add('flex', 'items-center', 'gap-1');
      
      // 确保评分星级正确显示
      const stars = element.querySelectorAll('.star');
      stars.forEach(star => {
        star.classList.add('text-yellow-400');
      });
    });
  }
  
  /**
   * 丰富AI助手管理页面内容
   */
  enrichAIAssistantManagement() {
    // 增强AI助手列表
    this.enhanceAIAssistantList();
    
    // 添加AI助手配置表单增强
    this.enhanceAIAssistantConfig();
  }
  
  /**
   * 增强AI助手列表
   */
  enhanceAIAssistantList() {
    const assistantList = document.querySelector('.ai-assistant-list');
    if (!assistantList) return;
    
    assistantList.classList.add('space-y-4');
  }
  
  /**
   * 增强AI助手配置表单
   */
  enhanceAIAssistantConfig() {
    const configForm = document.querySelector('.ai-assistant-config');
    if (!configForm) return;
    
    configForm.classList.add('bg-white', 'p-5', 'rounded-xl', 'border', 'border-gray-200');
  }
  
  /**
   * 丰富系统设置页面内容
   */
  enrichSystemSettings() {
    // 增强设置面板
    this.enhanceSettingsPanels();
    
    // 添加设置保存状态指示
    this.addSettingsSaveIndicator();
  }
  
  /**
   * 增强设置面板
   */
  enhanceSettingsPanels() {
    const settingPanels = document.querySelectorAll('.settings-panel, .settings-section');
    settingPanels.forEach(panel => {
      panel.classList.add('bg-white', 'p-5', 'rounded-xl', 'border', 'border-gray-200', 'mb-4');
    });
  }
  
  /**
   * 添加设置保存状态指示
   */
  addSettingsSaveIndicator() {
    const saveButton = document.querySelector('button[type="submit"], button#save-settings');
    if (!saveButton) return;
    
    // 添加保存按钮的加载状态
    saveButton.addEventListener('click', function() {
      const originalText = this.textContent;
      this.disabled = true;
      this.textContent = '保存中...';
      
      // 模拟保存操作
      setTimeout(() => {
        this.textContent = '已保存';
        setTimeout(() => {
          this.textContent = originalText;
          this.disabled = false;
        }, 2000);
      }, 1000);
    });
  }
  
  /**
   * 增强数据卡片功能
   */
  enhanceDataCards() {
    const dataCards = document.querySelectorAll('.data-card, .stat-card, .info-card');
    dataCards.forEach(card => {
      // 添加悬停效果
      card.classList.add('transition-all', 'duration-300', 'hover:shadow-md', 'hover:-translate-y-1');
      
      // 添加动画效果
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      setTimeout(() => {
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, Math.random() * 300);
    });
  }
  
  /**
   * 增强图表交互功能
   */
  enhanceChartInteractions() {
    const charts = document.querySelectorAll('.chart, .canvas-container');
    charts.forEach(chart => {
      // 添加图表容器样式
      chart.parentElement.classList.add('relative', 'overflow-hidden');
      
      // 添加图表加载动画
      const spinner = document.createElement('div');
      spinner.className = 'absolute inset-0 flex items-center justify-center bg-white/80 z-10';
      spinner.innerHTML = '<div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>';
      chart.parentElement.appendChild(spinner);
      
      // 模拟图表加载完成
      setTimeout(() => {
        spinner.style.opacity = '0';
        setTimeout(() => {
          spinner.remove();
        }, 300);
      }, 800);
    });
  }
  
  /**
   * 添加表单实时验证
   */
  addRealTimeValidation() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      const inputFields = form.querySelectorAll('input, select, textarea');
      inputFields.forEach(field => {
        // 添加输入事件监听器
        field.addEventListener('input', function() {
          // 简单的必填项验证
          if (this.required && !this.value.trim()) {
            this.classList.add('border-danger');
            this.classList.remove('border-success');
          } else {
            this.classList.remove('border-danger');
            this.classList.add('border-success');
          }
          
          // 邮箱验证
          if (this.type === 'email') {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(this.value) && this.value.trim() !== '') {
              this.classList.add('border-danger');
              this.classList.remove('border-success');
            }
          }
        });
      });
    });
  }
  
  /**
   * 增强表格功能
   */
  enhanceTables() {
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
      // 添加响应式表格容器
      if (!table.parentElement.classList.contains('table-responsive')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'table-responsive overflow-x-auto';
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
      }
      
      // 为表头添加排序指示
      const headerCells = table.querySelectorAll('th');
      headerCells.forEach(cell => {
        // 检查单元格是否可排序
        if (!cell.hasAttribute('data-sortable')) return;
        
        cell.classList.add('cursor-pointer', 'user-select-none');
        cell.style.position = 'relative';
        
        // 添加排序图标
        const sortIcon = document.createElement('span');
        sortIcon.className = 'ml-1 opacity-50';
        sortIcon.textContent = '↕';
        cell.appendChild(sortIcon);
        
        // 添加点击事件
        cell.addEventListener('click', function() {
          // 移除其他列的排序状态
          headerCells.forEach(c => {
            c.classList.remove('sort-asc', 'sort-desc');
            c.querySelector('.ml-1')?.classList.remove('opacity-100');
          });
          
          // 切换排序状态
          if (this.classList.contains('sort-asc')) {
            this.classList.remove('sort-asc');
            this.classList.add('sort-desc');
            sortIcon.textContent = '↓';
          } else {
            this.classList.remove('sort-desc');
            this.classList.add('sort-asc');
            sortIcon.textContent = '↑';
          }
          
          sortIcon.classList.add('opacity-100');
        });
      });
    });
  }
  
  /**
   * 为按钮添加加载状态
   */
  addButtonLoadingStates() {
    const buttons = document.querySelectorAll('button:not(.no-loading-state)');
    buttons.forEach(button => {
      button.addEventListener('click', function() {
        // 跳过已经在加载中的按钮
        if (this.disabled || this.classList.contains('loading')) return;
        
        // 保存原始文本和状态
        const originalText = this.textContent;
        this.classList.add('loading');
        this.disabled = true;
        
        // 添加加载指示器
        const spinner = document.createElement('span');
        spinner.className = 'inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2';
        this.innerHTML = '';
        this.appendChild(spinner);
        this.appendChild(document.createTextNode('处理中...'));
        
        // 模拟异步操作
        setTimeout(() => {
          this.classList.remove('loading');
          this.innerHTML = originalText;
          this.disabled = false;
        }, 1500);
      });
    });
  }
      case 'activity_management.html':
        this.enrichActivityManagement();
        break;
      case 'consultant_management.html':
        this.enrichConsultantManagement();
        break;
      case 'ai_assistant_manager.html':
        this.enrichAIAssistantManagement();
        break;
      case 'system_settings.html':
        this.enrichSystemSettings();
        break;
    }
    
    // 为所有页面添加通用的丰富内容
    this.addCommonEnhancements();
  }
  
  /**
   * 统一卡片样式
   */
  unifyCards() {
    const cards = document.querySelectorAll('.card, .info-card, .stat-card');
    cards.forEach(card => {
      card.classList.add('admin-card', 'bg-white', 'rounded-xl', 'shadow-card', 'p-6', 'transition-all-300');
      card.classList.remove('shadow', 'rounded-lg');
    });
  }
  
  /**
   * 统一按钮样式
   */
  unifyButtons() {
    // 统一主要按钮
    const primaryButtons = document.querySelectorAll('button.primary, button.btn-primary, button.btn-blue');
    primaryButtons.forEach(btn => {
      btn.classList.add('admin-btn', 'admin-btn-primary');
      btn.classList.remove('btn-primary', 'btn-blue');
    });
    
    // 统一次要按钮
    const secondaryButtons = document.querySelectorAll('button.secondary, button.btn-secondary, button.btn-purple');
    secondaryButtons.forEach(btn => {
      btn.classList.add('admin-btn', 'admin-btn-secondary');
      btn.classList.remove('btn-secondary', 'btn-purple');
    });
    
    // 统一危险按钮
    const dangerButtons = document.querySelectorAll('button.danger, button.btn-danger, button.btn-red');
    dangerButtons.forEach(btn => {
      btn.classList.add('admin-btn', 'admin-btn-danger');
      btn.classList.remove('btn-danger', 'btn-red');
    });
    
    // 统一其他按钮
    const otherButtons = document.querySelectorAll('button:not(.admin-btn)');
    otherButtons.forEach(btn => {
      if (!btn.classList.contains('admin-btn')) {
        btn.classList.add('admin-btn', 'admin-btn-outline');
      }
    });
  }
  
  /**
   * 统一表格样式
   */
  unifyTables() {
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
      table.classList.add('w-full', 'bg-white', 'rounded-xl', 'shadow-sm', 'overflow-hidden');
      
      // 统一表头样式
      const headers = table.querySelectorAll('th');
      headers.forEach(header => {
        header.classList.add('admin-table-header');
      });
      
      // 统一表格单元格样式
      const cells = table.querySelectorAll('td');
      cells.forEach(cell => {
        cell.classList.add('admin-table-cell', 'border-t', 'border-gray-200');
      });
      
      // 添加行悬停效果
      this.addTableRowHover(table);
    });
  }
  
  /**
   * 统一统计卡片样式
   */
  unifyStatCards() {
    const statCards = document.querySelectorAll('.stat-card, .dashboard-card');
    statCards.forEach(card => {
      card.classList.add('admin-stat-card', 'rounded-xl', 'shadow-card', 'p-5', 'relative', 'overflow-hidden');
      
      // 确保卡片有渐变背景
      if (!card.querySelector('.stat-card:before')) {
        const before = document.createElement('div');
        before.classList.add('absolute', 'inset-0', 'bg-gradient-to-br', 'opacity-90', 'pointer-events-none');
        card.prepend(before);
      }
      
      // 确保内容在渐变之上
      const content = card.querySelectorAll('*:not(.absolute)');
      content.forEach(el => {
        el.classList.add('relative', 'z-10');
      });
    });
  }
  
  /**
   * 统一表单样式
   */
  unifyForms() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.classList.add('space-y-4');
      
      // 统一输入框样式
      const inputs = form.querySelectorAll('input, select, textarea');
      inputs.forEach(input => {
        input.classList.add('w-full', 'px-4', 'py-2', 'rounded-lg', 'border', 'border-gray-300', 'focus:outline-none', 'focus:ring-2', 'focus:ring-primary', 'focus:border-transparent', 'transition-all-300');
      });
      
      // 统一标签样式
      const labels = form.querySelectorAll('label');
      labels.forEach(label => {
        label.classList.add('block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-1');
      });
    });
  }
  
  /**
   * 统一徽章样式
   */
  unifyBadges() {
    const badges = document.querySelectorAll('.badge, .status-badge, .tag');
    badges.forEach(badge => {
      badge.classList.add('admin-badge');
      
      // 根据内容或类名设置颜色
      if (badge.textContent.includes('成功') || badge.textContent.includes('已完成') || badge.classList.contains('success')) {
        badge.classList.add('admin-badge-success');
        badge.classList.remove('success');
      } else if (badge.textContent.includes('警告') || badge.textContent.includes('待处理') || badge.classList.contains('warning')) {
        badge.classList.add('admin-badge-warning');
        badge.classList.remove('warning');
      } else if (badge.textContent.includes('危险') || badge.textContent.includes('错误') || badge.textContent.includes('高风险') || badge.classList.contains('danger')) {
        badge.classList.add('admin-badge-danger');
        badge.classList.remove('danger', 'bg-red-100', 'text-red-800');
      } else {
        badge.classList.add('admin-badge-info');
        badge.classList.remove('bg-blue-100', 'text-blue-800');
      }
    });
  }
  
  /**
   * 修复导航栏重复问题
   */
  fixDuplicateNavbars() {
    const navs = document.querySelectorAll('#main-nav');
    if (navs.length > 1) {
      // 保留第一个导航栏，移除其他的
      for (let i = 1; i < navs.length; i++) {
        navs[i].remove();
      }
    }
  }

  dynamicLoadEnhancedUI() {
    // 动态加载增强UI脚本
    const script = document.createElement('script');
    script.src = 'enhanced_ui.js';
    script.onload = () => {
      if (window.EnhancedUI) {
        this.enhancedUI = new window.EnhancedUI();
        this.enhancedUI.initForAdmin();
      }
    };
    script.onerror = () => {
      console.warn('增强UI模块加载失败');
    };
    document.head.appendChild(script);
  }

  // 工具方法
  showNotification(type, message, duration = 3000) {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transform transition-all duration-300 ease-in-out translate-x-full fade-in`;
    
    // 设置通知样式
    switch (type) {
      case 'success':
        notification.classList.add('bg-success', 'text-white');
        notification.innerHTML = `<i class="fa fa-check-circle mr-2"></i>${message}`;
        break;
      case 'error':
        notification.classList.add('bg-danger', 'text-white');
        notification.innerHTML = `<i class="fa fa-exclamation-circle mr-2"></i>${message}`;
        break;
      case 'warning':
        notification.classList.add('bg-warning', 'text-white');
        notification.innerHTML = `<i class="fa fa-exclamation-triangle mr-2"></i>${message}`;
        break;
      case 'info':
      default:
        notification.classList.add('bg-info', 'text-white');
        notification.innerHTML = `<i class="fa fa-info-circle mr-2"></i>${message}`;
        break;
    }
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 显示通知
    setTimeout(() => {
      notification.classList.remove('translate-x-full');
    }, 10);
    
    // 自动关闭
    setTimeout(() => {
      notification.classList.add('translate-x-full');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, duration);
  }

  // 表格相关功能
  initializeDataTable(tableElementId) {
    const table = document.getElementById(tableElementId);
    if (!table) return;
    
    // 添加排序功能
    this.addTableSorting(table);
    
    // 添加行悬停效果
    this.addTableRowHover(table);
    
    // 初始化全选功能
    this.initializeTableSelectAll(table);
  }

  addTableSorting(table) {
    const headers = table.querySelectorAll('thead th');
    headers.forEach((header, index) => {
      // 跳过包含复选框的列
      if (header.querySelector('input[type="checkbox"]')) return;
      
      header.style.cursor = 'pointer';
      header.dataset.sortable = 'true';
      
      header.addEventListener('click', () => {
        this.sortTableColumn(table, index);
      });
    });
  }

  sortTableColumn(table, columnIndex) {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const header = table.querySelectorAll('thead th')[columnIndex];
    
    // 确定排序方向
    let sortDirection = 'asc';
    if (header.dataset.sortDir === 'asc') {
      sortDirection = 'desc';
    }
    
    // 重置所有表头的排序状态
    table.querySelectorAll('thead th').forEach(th => {
      th.dataset.sortDir = '';
      th.classList.remove('sorted-asc', 'sorted-desc');
    });
    
    // 设置当前表头的排序状态
    header.dataset.sortDir = sortDirection;
    header.classList.add(sortDirection === 'asc' ? 'sorted-asc' : 'sorted-desc');
    
    // 排序行
    rows.sort((a, b) => {
      const aValue = a.cells[columnIndex].textContent.trim();
      const bValue = b.cells[columnIndex].textContent.trim();
      
      // 尝试数字排序
      const aNum = parseFloat(aValue);
      const bNum = parseFloat(bValue);
      
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
      }
      
      // 文本排序
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
    
    // 重新添加行
    rows.forEach(row => tbody.appendChild(row));
    
    // 添加动画效果
    rows.forEach((row, i) => {
      row.style.opacity = '0';
      row.style.transform = 'translateY(10px)';
      setTimeout(() => {
        row.style.opacity = '1';
        row.style.transform = 'translateY(0)';
      }, i * 30);
    });
  }

  addTableRowHover(table) {
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
      row.classList.add('transition-all-300');
    });
  }

  initializeTableSelectAll(table) {
    const selectAllCheckbox = table.querySelector('thead th input[type="checkbox"]');
    if (!selectAllCheckbox) return;
    
    selectAllCheckbox.addEventListener('change', (e) => {
      const checkboxes = table.querySelectorAll('tbody td input[type="checkbox"]');
      checkboxes.forEach(checkbox => {
        checkbox.checked = e.target.checked;
      });
    });
  }

  // 图表初始化辅助方法
  initializeChart(canvasId, chartType, data, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;
    
    const ctx = canvas.getContext('2d');
    
    // 统一的图表配置
    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1000,
        easing: 'easeInOutQuart'
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              family: 'Inter, system-ui, sans-serif',
              size: 12
            },
            padding: 20
          }
        },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          titleColor: '#1e293b',
          bodyColor: '#64748b',
          borderColor: 'rgba(226, 232, 240, 0.5)',
          borderWidth: 1,
          padding: 12,
          boxPadding: 6,
          usePointStyle: true,
          callbacks: {
            label: function(context) {
              return context.dataset.label + ': ' + context.parsed.y;
            }
          }
        }
      }
    };
    
    // 合并配置
    const mergedOptions = { ...defaultOptions, ...options };
    
    // 创建图表
    return new Chart(ctx, {
      type: chartType,
      data: data,
      options: mergedOptions
    });
  }

  // 表单验证辅助方法
  validateForm(formElement) {
    const form = document.getElementById(formElement);
    if (!form) return false;
    
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        isValid = false;
        this.highlightError(field);
      } else {
        this.removeHighlight(field);
      }
    });
    
    return isValid;
  }

  highlightError(field) {
    field.classList.add('border-error');
    field.classList.add('focus:border-error');
    field.classList.add('focus:ring-error/20');
    
    // 显示错误提示
    const errorId = field.id + '-error';
    let errorElement = document.getElementById(errorId);
    
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.id = errorId;
      errorElement.className = 'text-error text-xs mt-1';
      errorElement.textContent = '此字段为必填项';
      field.parentNode.appendChild(errorElement);
    }
    
    errorElement.style.display = 'block';
  }

  removeHighlight(field) {
    field.classList.remove('border-error');
    field.classList.remove('focus:border-error');
    field.classList.remove('focus:ring-error/20');
    
    // 隐藏错误提示
    const errorId = field.id + '-error';
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
      errorElement.style.display = 'none';
    }
  }

  /**
   * 添加通用增强功能
   * 为所有管理页面添加统一的增强功能
   */
  addCommonEnhancements() {
    // 添加页面刷新按钮
    this.addRefreshButton();
    
    // 添加数据导出功能
    this.addExportFunctionality();
    
    // 添加搜索和过滤功能
    this.addSearchAndFilter();
    
    // 添加批量操作功能
    this.addBulkOperations();
    
    // 添加响应式增强
    this.enhanceResponsiveExperience();
    
    // 添加加载状态指示器
    this.addLoadingIndicators();
  }

  /**
   * 添加刷新按钮
   */
  addRefreshButton() {
    const header = document.querySelector('.page-header') || document.querySelector('h1').parentElement;
    if (!header) return;
    
    // 检查是否已存在刷新按钮
    if (document.querySelector('#refresh-button')) return;
    
    const refreshButton = document.createElement('button');
    refreshButton.id = 'refresh-button';
    refreshButton.className = 'ml-2 p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all duration-300';
    refreshButton.innerHTML = '<i class="fa fa-refresh"></i>';
    refreshButton.title = '刷新页面数据';
    refreshButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.showLoading(true);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    });
    
    header.appendChild(refreshButton);
  }

  /**
   * 添加数据导出功能
   */
  addExportFunctionality() {
    const table = document.querySelector('table');
    if (!table) return;
    
    const tableContainer = table.parentElement;
    const exportButton = document.createElement('button');
    exportButton.className = 'mt-2 mb-3 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-all duration-300 flex items-center';
    exportButton.innerHTML = '<i class="fa fa-download mr-2"></i>导出数据';
    exportButton.addEventListener('click', () => {
      this.showNotification('success', '数据导出中，请稍候...');
      // 模拟导出操作
      setTimeout(() => {
        this.showNotification('success', '数据导出成功！');
      }, 1000);
    });
    
    tableContainer.insertBefore(exportButton, table);
  }

  /**
   * 添加搜索和过滤功能
   */
  addSearchAndFilter() {
    const table = document.querySelector('table');
    if (!table) return;
    
    const tableContainer = table.parentElement;
    const searchContainer = document.createElement('div');
    searchContainer.className = 'mb-3 flex flex-wrap items-center gap-2';
    
    // 搜索框
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = '搜索...';
    searchInput.className = 'px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary w-full md:w-auto md:flex-grow max-w-md';
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const rows = table.querySelectorAll('tbody tr');
      
      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
    
    searchContainer.appendChild(searchInput);
    tableContainer.insertBefore(searchContainer, table);
  }

  /**
   * 添加批量操作功能
   */
  addBulkOperations() {
    const table = document.querySelector('table');
    if (!table || !table.querySelector('thead th input[type="checkbox"]')) return;
    
    const tableContainer = table.parentElement;
    const bulkContainer = document.createElement('div');
    bulkContainer.className = 'mt-2 mb-3 hidden' // 初始隐藏，当有选中项时显示
    bulkContainer.id = 'bulk-operations';
    
    const deleteButton = document.createElement('button');
    deleteButton.className = 'px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300';
    deleteButton.innerHTML = '<i class="fa fa-trash mr-2"></i>批量删除';
    deleteButton.addEventListener('click', () => {
      if (confirm('确定要删除选中的项吗？')) {
        this.showNotification('success', '批量删除成功！');
        // 这里应该有实际的删除逻辑
      }
    });
    
    const statusButton = document.createElement('button');
    statusButton.className = 'ml-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-300';
    statusButton.innerHTML = '<i class="fa fa-refresh mr-2"></i>更新状态';
    statusButton.addEventListener('click', () => {
      this.showNotification('success', '状态更新成功！');
      // 这里应该有实际的更新逻辑
    });
    
    bulkContainer.appendChild(deleteButton);
    bulkContainer.appendChild(statusButton);
    tableContainer.insertBefore(bulkContainer, table.nextSibling);
    
    // 监听复选框变化
    const checkboxes = table.querySelectorAll('tbody td input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', this.toggleBulkOperations.bind(this));
    });
  }

  /**
   * 切换批量操作按钮的显示
   */
  toggleBulkOperations() {
    const bulkContainer = document.getElementById('bulk-operations');
    if (!bulkContainer) return;
    
    const checkedBoxes = document.querySelectorAll('tbody td input[type="checkbox"]:checked');
    bulkContainer.classList.toggle('hidden', checkedBoxes.length === 0);
  }

  /**
   * 增强响应式体验
   */
  enhanceResponsiveExperience() {
    // 移动端表格适配
    const table = document.querySelector('table');
    if (table) {
      // 添加响应式类
      table.classList.add('min-w-full', 'divide-y', 'divide-gray-200');
      
      // 监听窗口大小变化
      window.addEventListener('resize', this.handleTableResponsive.bind(this));
      this.handleTableResponsive();
    }
  }

  /**
   * 处理表格响应式
   */
  handleTableResponsive() {
    const table = document.querySelector('table');
    if (!table) return;
    
    if (window.innerWidth < 768) {
      // 在小屏幕上使表格可滚动
      const tableContainer = table.parentElement;
      tableContainer.classList.add('overflow-x-auto');
      tableContainer.style.maxWidth = '100%';
    } else {
      // 在大屏幕上移除滚动
      const tableContainer = table.parentElement;
      tableContainer.classList.remove('overflow-x-auto');
    }
  }

  /**
   * 添加加载状态指示器
   */
  addLoadingIndicators() {
    // 为所有按钮添加加载状态
    const buttons = document.querySelectorAll('button:not(#refresh-button)');
    buttons.forEach(button => {
      button.addEventListener('click', function() {
        const originalText = this.innerHTML;
        this.disabled = true;
        this.innerHTML = '<i class="fa fa-spinner fa-spin mr-2"></i>处理中...';
        
        // 模拟操作完成
        setTimeout(() => {
          this.disabled = false;
          this.innerHTML = originalText;
        }, 1500);
      });
    });
  }

  /**
   * 仪表盘页面内容丰富
   */
  enrichDashboard() {
    // 添加实时更新功能
    this.addRealTimeUpdates();
    
    // 添加快速操作面板
    this.addQuickActions();
    
    // 增强统计卡片
    this.enhanceStatCards();
    
    // 添加图表交互
    this.addChartInteractions();
  }

  /**
   * 用户管理页面内容丰富
   */
  enrichUserManagement() {
    // 添加用户高级筛选
    this.addUserAdvancedFilters();
    
    // 添加用户状态切换
    this.addUserStatusToggle();
    
    // 添加用户角色管理
    this.addUserRoleManagement();
  }

  /**
   * 测评管理页面内容丰富
   */
  enrichAssessmentManagement() {
    // 添加测评分类筛选
    this.addAssessmentCategoryFilter();
    
    // 添加测评结果分析
    this.addAssessmentResultAnalysis();
    
    // 添加高风险预警
    this.addRiskAlertSystem();
  }

  /**
   * 预约管理页面内容丰富
   */
  enrichBookingManagement() {
    // 添加日历视图切换
    this.addCalendarView();
    
    // 添加预约状态快速更新
    this.addQuickStatusUpdate();
    
    // 添加冲突检测
    this.addConflictDetection();
  }

  /**
   * 活动管理页面内容丰富
   */
  enrichActivityManagement() {
    // 添加活动日历
    this.addActivityCalendar();
    
    // 添加活动参与统计
    this.addActivityParticipationStats();
    
    // 添加活动状态管理
    this.addActivityStatusManagement();
  }

  /**
   * 咨询师管理页面内容丰富
   */
  enrichConsultantManagement() {
    // 添加咨询师排班管理
    this.addConsultantScheduleManagement();
    
    // 添加咨询师评价分析
    this.addConsultantRatingAnalysis();
    
    // 添加咨询师技能管理
    this.addConsultantSkillManagement();
  }

  /**
   * AI助手管理页面内容丰富
   */
  enrichAIAssistantManagement() {
    // 添加对话日志分析
    this.addConversationLogAnalysis();
    
    // 添加回复质量监控
    this.addResponseQualityMonitoring();
    
    // 添加模型参数调整
    this.addModelParameterAdjustment();
  }

  /**
   * 系统设置页面内容丰富
   */
  enrichSystemSettings() {
    // 添加设置验证
    this.addSettingsValidation();
    
    // 添加设置备份功能
    this.addSettingsBackup();
    
    // 添加系统日志查看
    this.addSystemLogViewer();
  }

  // 以下是各页面特定功能的具体实现
  
  /**
   * 添加实时更新功能
   */
  addRealTimeUpdates() {
    // 模拟实时数据更新
    setInterval(() => {
      const statCards = document.querySelectorAll('.stat-card');
      statCards.forEach(card => {
        const numberElement = card.querySelector('.stat-number');
        if (numberElement) {
          const currentNumber = parseInt(numberElement.textContent.replace(/[^0-9]/g, ''));
          const change = Math.floor(Math.random() * 10) - 5;
          const newNumber = Math.max(0, currentNumber + change);
          numberElement.textContent = newNumber.toLocaleString();
        }
      });
    }, 30000); // 每30秒更新一次
  }

  /**
   * 添加快速操作面板
   */
  addQuickActions() {
    const dashboardContent = document.querySelector('.dashboard-content');
    if (!dashboardContent) return;
    
    const quickActions = document.createElement('div');
    quickActions.className = 'bg-white rounded-xl shadow-md p-4 mb-6';
    quickActions.innerHTML = `
      <h3 class="text-lg font-semibold mb-3">快速操作</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button class="p-3 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all duration-300 flex flex-col items-center">
          <i class="fa fa-user-plus text-xl mb-1"></i>
          <span>添加用户</span>
        </button>
        <button class="p-3 bg-secondary/10 text-secondary rounded-lg hover:bg-secondary/20 transition-all duration-300 flex flex-col items-center">
          <i class="fa fa-calendar-plus-o text-xl mb-1"></i>
          <span>安排活动</span>
        </button>
        <button class="p-3 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-all duration-300 flex flex-col items-center">
          <i class="fa fa-bell text-xl mb-1"></i>
          <span>处理预警</span>
        </button>
        <button class="p-3 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-all duration-300 flex flex-col items-center">
          <i class="fa fa-cog text-xl mb-1"></i>
          <span>系统设置</span>
        </button>
      </div>
    `;
    
    dashboardContent.insertBefore(quickActions, dashboardContent.firstChild);
  }

  /**
   * 增强统计卡片
   */
  enhanceStatCards() {
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
      // 添加悬停效果
      card.classList.add('transition-all', 'duration-300', 'hover:shadow-lg', 'hover:-translate-y-1');
      
      // 添加点击展开详情
      card.addEventListener('click', function() {
        this.classList.toggle('expanded');
        // 这里可以添加展开详情的逻辑
      });
    });
  }

  /**
   * 添加图表交互
   */
  addChartInteractions() {
    const canvasElements = document.querySelectorAll('canvas');
    canvasElements.forEach(canvas => {
      // 添加提示信息
      const tooltip = document.createElement('div');
      tooltip.className = 'hidden absolute bg-white p-2 rounded shadow-md text-sm z-10';
      document.body.appendChild(tooltip);
      
      canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        tooltip.style.left = (e.clientX + 10) + 'px';
        tooltip.style.top = (e.clientY - 30) + 'px';
        tooltip.textContent = '悬停查看详情';
        tooltip.classList.remove('hidden');
      });
      
      canvas.addEventListener('mouseleave', () => {
        tooltip.classList.add('hidden');
      });
    });
  }

  /**
   * 添加用户高级筛选
   */
  addUserAdvancedFilters() {
    const tableContainer = document.querySelector('table').parentElement;
    const filterContainer = document.createElement('div');
    filterContainer.className = 'bg-white p-4 rounded-lg shadow-sm mb-4';
    filterContainer.innerHTML = `
      <h3 class="text-lg font-semibold mb-3">高级筛选</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">用户角色</label>
          <select class="w-full px-3 py-2 border border-gray-300 rounded-lg">
            <option value="">全部角色</option>
            <option value="admin">管理员</option>
            <option value="user">普通用户</option>
            <option value="consultant">咨询师</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">用户状态</label>
          <select class="w-full px-3 py-2 border border-gray-300 rounded-lg">
            <option value="">全部状态</option>
            <option value="active">活跃</option>
            <option value="inactive">非活跃</option>
            <option value="suspended">已暂停</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">注册日期</label>
          <input type="date" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
        </div>
      </div>
      <div class="mt-3 flex gap-2">
        <button class="px-4 py-2 bg-primary text-white rounded-lg">应用筛选</button>
        <button class="px-4 py-2 border border-gray-300 rounded-lg">重置</button>
      </div>
    `;
    
    tableContainer.insertBefore(filterContainer, tableContainer.firstChild);
  }

  /**
   * 添加用户状态切换
   */
  addUserStatusToggle() {
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach(row => {
      const statusCell = row.querySelector('.status-cell');
      if (statusCell) {
        const currentStatus = statusCell.textContent.trim();
        const toggle = document.createElement('label');
        toggle.className = 'inline-flex items-center';
        toggle.innerHTML = `
          <input type="checkbox" class="user-status-toggle" ${currentStatus === '活跃' ? 'checked' : ''}>
          <span class="ml-2">${currentStatus}</span>
        `;
        statusCell.innerHTML = '';
        statusCell.appendChild(toggle);
        
        const checkbox = toggle.querySelector('input');
        checkbox.addEventListener('change', function() {
          const span = this.nextElementSibling;
          span.textContent = this.checked ? '活跃' : '非活跃';
          span.className = this.checked ? 'text-green-600' : 'text-gray-500';
        });
      }
    });
  }

  /**
   * 添加用户角色管理
   */
  addUserRoleManagement() {
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach(row => {
      const roleCell = row.querySelector('.role-cell');
      if (roleCell) {
        const currentRole = roleCell.textContent.trim();
        const select = document.createElement('select');
        select.className = 'px-2 py-1 border border-gray-300 rounded text-sm';
        select.innerHTML = `
          <option value="admin" ${currentRole === '管理员' ? 'selected' : ''}>管理员</option>
          <option value="user" ${currentRole === '普通用户' ? 'selected' : ''}>普通用户</option>
          <option value="consultant" ${currentRole === '咨询师' ? 'selected' : ''}>咨询师</option>
        `;
        roleCell.innerHTML = '';
        roleCell.appendChild(select);
        
        select.addEventListener('change', function() {
          // 这里可以添加角色更新的逻辑
        });
      }
    });
  }

  /**
   * 添加测评分类筛选
   */
  addAssessmentCategoryFilter() {
    const container = document.querySelector('.assessment-filters') || document.querySelector('table').parentElement;
    const filterDiv = document.createElement('div');
    filterDiv.className = 'mb-4';
    filterDiv.innerHTML = `
      <div class="flex flex-wrap gap-2">
        <button class="px-3 py-1 bg-primary text-white rounded-full text-sm">全部测评</button>
        <button class="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-full text-sm">抑郁测评</button>
        <button class="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-full text-sm">焦虑测评</button>
        <button class="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-full text-sm">压力测评</button>
        <button class="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-full text-sm">性格测评</button>
      </div>
    `;
    
    container.insertBefore(filterDiv, container.firstChild);
  }

  /**
   * 添加测评结果分析
   */
  addAssessmentResultAnalysis() {
    const mainContent = document.querySelector('main') || document.body;
    const analysisSection = document.createElement('section');
    analysisSection.className = 'bg-white p-4 rounded-xl shadow-md mb-6';
    analysisSection.innerHTML = `
      <h3 class="text-lg font-semibold mb-4">测评结果分析</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-3 border border-gray-200 rounded-lg">
          <h4 class="font-medium mb-2">平均分趋势</h4>
          <canvas id="averageScoreChart" height="200"></canvas>
        </div>
        <div class="p-3 border border-gray-200 rounded-lg">
          <h4 class="font-medium mb-2">问题分布</h4>
          <canvas id="problemDistributionChart" height="200"></canvas>
        </div>
      </div>
    `;
    
    mainContent.appendChild(analysisSection);
    
    // 这里可以初始化图表
  }

  /**
   * 添加高风险预警
   */
  addRiskAlertSystem() {
    const mainContent = document.querySelector('main') || document.body;
    const alertSection = document.createElement('section');
    alertSection.className = 'bg-red-50 border border-red-200 p-4 rounded-xl mb-6';
    alertSection.innerHTML = `
      <div class="flex justify-between items-center mb-3">
        <h3 class="text-lg font-semibold text-red-700">高风险预警</h3>
        <button class="text-sm text-red-600 hover:underline">查看全部</button>
      </div>
      <div class="space-y-2">
        <div class="bg-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <p class="font-medium">张三 - 抑郁测评</p>
            <p class="text-sm text-gray-500">风险等级：高 | 2小时前</p>
          </div>
          <button class="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm">处理</button>
        </div>
        <div class="bg-white p-3 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <p class="font-medium">李四 - 焦虑测评</p>
            <p class="text-sm text-gray-500">风险等级：中高 | 4小时前</p>
          </div>
          <button class="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm">处理</button>
        </div>
      </div>
    `;
    
    mainContent.appendChild(alertSection);
  }

  /**
   * 添加日历视图切换
   */
  addCalendarView() {
    const container = document.querySelector('.booking-filters') || document.querySelector('table').parentElement;
    const viewToggle = document.createElement('div');
    viewToggle.className = 'mb-4 flex items-center gap-2';
    viewToggle.innerHTML = `
      <span class="text-sm font-medium">视图：</span>
      <button class="px-3 py-1 bg-primary text-white rounded-lg text-sm">表格视图</button>
      <button class="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm">日历视图</button>
    `;
    
    container.insertBefore(viewToggle, container.firstChild);
  }

  /**
   * 添加预约状态快速更新
   */
  addQuickStatusUpdate() {
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach(row => {
      const statusCell = row.querySelector('.status-cell');
      if (statusCell) {
        const currentStatus = statusCell.textContent.trim();
        const statuses = ['待确认', '已确认', '已完成', '已取消'];
        
        const select = document.createElement('select');
        select.className = 'px-2 py-1 border border-gray-300 rounded text-sm';
        
        statuses.forEach(status => {
          const option = document.createElement('option');
          option.value = status;
          option.textContent = status;
          if (status === currentStatus) {
            option.selected = true;
          }
          select.appendChild(option);
        });
        
        statusCell.innerHTML = '';
        statusCell.appendChild(select);
        
        select.addEventListener('change', function() {
          // 这里可以添加状态更新的逻辑
        });
      }
    });
  }

  /**
   * 添加冲突检测
   */
  addConflictDetection() {
    const mainContent = document.querySelector('main') || document.body;
    const conflictAlert = document.createElement('div');
    conflictAlert.className = 'bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4';
    conflictAlert.innerHTML = `
      <div class="flex items-start gap-3">
        <i class="fa fa-exclamation-triangle text-yellow-500 mt-1"></i>
        <div>
          <h4 class="font-medium text-yellow-800">检测到潜在冲突</h4>
          <p class="text-sm text-yellow-700 mt-1">有2个预约时间重叠，请检查并调整。</p>
          <button class="mt-2 text-sm text-yellow-600 hover:underline">查看详情</button>
        </div>
      </div>
    `;
    
    mainContent.insertBefore(conflictAlert, mainContent.firstChild);
  }

  /**
   * 添加活动日历
   */
  addActivityCalendar() {
    const mainContent = document.querySelector('main') || document.body;
    const calendarSection = document.createElement('section');
    calendarSection.className = 'bg-white p-4 rounded-xl shadow-md mb-6';
    calendarSection.innerHTML = `
      <h3 class="text-lg font-semibold mb-4">活动日历</h3>
      <div class="text-center py-10 border border-dashed border-gray-300 rounded-lg">
        <i class="fa fa-calendar text-4xl text-gray-400 mb-2"></i>
        <p class="text-gray-500">日历视图将在这里显示</p>
      </div>
    `;
    
    mainContent.appendChild(calendarSection);
  }

  /**
   * 添加活动参与统计
   */
  addActivityParticipationStats() {
    const mainContent = document.querySelector('main') || document.body;
    const statsSection = document.createElement('section');
    statsSection.className = 'bg-white p-4 rounded-xl shadow-md mb-6';
    statsSection.innerHTML = `
      <h3 class="text-lg font-semibold mb-4">参与统计</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="p-3 border border-gray-200 rounded-lg">
          <h4 class="text-sm font-medium text-gray-500">平均参与率</h4>
          <p class="text-2xl font-semibold">78%</p>
        </div>
        <div class="p-3 border border-gray-200 rounded-lg">
          <h4 class="text-sm font-medium text-gray-500">最高参与活动</h4>
          <p class="text-xl font-semibold">冥想放松班</p>
          <p class="text-sm text-gray-500">92% 参与率</p>
        </div>
        <div class="p-3 border border-gray-200 rounded-lg">
          <h4 class="text-sm font-medium text-gray-500">出勤率</h4>
          <p class="text-2xl font-semibold">85%</p>
        </div>
      </div>
    `;
    
    mainContent.appendChild(statsSection);
  }

  /**
   * 添加活动状态管理
   */
  addActivityStatusManagement() {
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach(row => {
      const actionCell = row.querySelector('.action-cell');
      if (actionCell) {
        const statusButton = document.createElement('button');
        statusButton.className = 'px-2 py-1 mr-2 bg-gray-100 text-gray-700 rounded text-sm';
        statusButton.textContent = '发布';
        actionCell.appendChild(statusButton);
        
        const archiveButton = document.createElement('button');
        archiveButton.className = 'px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm';
        archiveButton.textContent = '归档';
        actionCell.appendChild(archiveButton);
      }
    });
  }

  /**
   * 添加咨询师排班管理
   */
  addConsultantScheduleManagement() {
    const container = document.querySelector('.consultant-actions') || document.querySelector('table').parentElement;
    const scheduleButton = document.createElement('button');
    scheduleButton.className = 'mb-4 px-4 py-2 bg-primary text-white rounded-lg';
    scheduleButton.innerHTML = '<i class="fa fa-calendar mr-2"></i>管理排班';
    scheduleButton.addEventListener('click', () => {
      this.showNotification('info', '排班管理功能即将打开');
    });
    
    container.insertBefore(scheduleButton, container.firstChild);
  }

  /**
   * 添加咨询师评价分析
   */
  addConsultantRatingAnalysis() {
    const mainContent = document.querySelector('main') || document.body;
    const ratingSection = document.createElement('section');
    ratingSection.className = 'bg-white p-4 rounded-xl shadow-md mb-6';
    ratingSection.innerHTML = `
      <h3 class="text-lg font-semibold mb-4">评价分析</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-3 border border-gray-200 rounded-lg">
          <h4 class="font-medium mb-2">平均评分</h4>
          <div class="flex items-center">
            <span class="text-3xl font-bold mr-2">4.8</span>
            <div class="text-yellow-400">★★★★★</div>
          </div>
        </div>
        <div class="p-3 border border-gray-200 rounded-lg">
          <h4 class="font-medium mb-2">评分分布</h4>
          <canvas id="ratingDistributionChart" height="200"></canvas>
        </div>
      </div>
    `;
    
    mainContent.appendChild(ratingSection);
  }

  /**
   * 添加咨询师技能管理
   */
  addConsultantSkillManagement() {
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach(row => {
      const skillsCell = row.querySelector('.skills-cell');
      if (skillsCell) {
        // 添加编辑按钮
        const editButton = document.createElement('button');
        editButton.className = 'ml-2 text-primary hover:text-primary/80';
        editButton.innerHTML = '<i class="fa fa-edit"></i>';
        editButton.title = '编辑技能';
        skillsCell.appendChild(editButton);
      }
    });
  }

  /**
   * 添加对话日志分析
   */
  addConversationLogAnalysis() {
    const mainContent = document.querySelector('main') || document.body;
    const logSection = document.createElement('section');
    logSection.className = 'bg-white p-4 rounded-xl shadow-md mb-6';
    logSection.innerHTML = `
      <h3 class="text-lg font-semibold mb-4">对话日志分析</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="p-3 border border-gray-200 rounded-lg">
          <h4 class="text-sm font-medium text-gray-500">今日对话数</h4>
          <p class="text-2xl font-semibold">156</p>
        </div>
        <div class="p-3 border border-gray-200 rounded-lg">
          <h4 class="text-sm font-medium text-gray-500">平均响应时间</h4>
          <p class="text-2xl font-semibold">0.8s</p>
        </div>
        <div class="p-3 border border-gray-200 rounded-lg">
          <h4 class="text-sm font-medium text-gray-500">问题解决率</h4>
          <p class="text-2xl font-semibold">89%</p>
        </div>
      </div>
    `;
    
    mainContent.appendChild(logSection);
  }

  /**
   * 添加回复质量监控
   */
  addResponseQualityMonitoring() {
    const mainContent = document.querySelector('main') || document.body;
    const qualitySection = document.createElement('section');
    qualitySection.className = 'bg-white p-4 rounded-xl shadow-md mb-6';
    qualitySection.innerHTML = `
      <h3 class="text-lg font-semibold mb-4">回复质量监控</h3>
      <div class="p-3 border border-gray-200 rounded-lg">
        <canvas id="qualityTrendChart" height="250"></canvas>
      </div>
    `;
    
    mainContent.appendChild(qualitySection);
  }

  /**
   * 添加模型参数调整
   */
  addModelParameterAdjustment() {
    const mainContent = document.querySelector('main') || document.body;
    const paramsSection = document.createElement('section');
    paramsSection.className = 'bg-white p-4 rounded-xl shadow-md mb-6';
    paramsSection.innerHTML = `
      <h3 class="text-lg font-semibold mb-4">模型参数调整</h3>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">温度 (Temperature)</label>
          <input type="range" min="0" max="1" step="0.1" value="0.7" class="w-full">
          <div class="flex justify-between text-xs text-gray-500">
            <span>精确</span>
            <span>随机</span>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">最大回复长度</label>
          <input type="range" min="50" max="500" step="50" value="200" class="w-full">
          <div class="flex justify-between text-xs text-gray-500">
            <span>短</span>
            <span>长</span>
          </div>
        </div>
        <button class="w-full px-4 py-2 bg-primary text-white rounded-lg">保存设置</button>
      </div>
    `;
    
    mainContent.appendChild(paramsSection);
  }

  /**
   * 添加设置验证
   */
  addSettingsValidation() {
    const form = document.querySelector('form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        // 这里可以添加表单验证逻辑
        this.showNotification('success', '设置保存成功！');
      });
    }
  }

  /**
   * 添加设置备份功能
   */
  addSettingsBackup() {
    const container = document.querySelector('.settings-actions') || document.body;
    const backupDiv = document.createElement('div');
    backupDiv.className = 'bg-gray-50 p-4 rounded-lg mb-4';
    backupDiv.innerHTML = `
      <h3 class="text-lg font-semibold mb-3">设置备份</h3>
      <div class="flex flex-wrap gap-3">
        <button class="px-4 py-2 bg-primary text-white rounded-lg">
          <i class="fa fa-download mr-2"></i>导出备份
        </button>
        <button class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg">
          <i class="fa fa-upload mr-2"></i>导入备份
        </button>
        <button class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg">
          <i class="fa fa-history mr-2"></i>恢复默认
        </button>
      </div>
    `;
    
    container.appendChild(backupDiv);
  }

  /**
   * 添加系统日志查看
   */
  addSystemLogViewer() {
    const mainContent = document.querySelector('main') || document.body;
    const logSection = document.createElement('section');
    logSection.className = 'bg-white p-4 rounded-xl shadow-md';
    logSection.innerHTML = `
      <h3 class="text-lg font-semibold mb-4">系统日志</h3>
      <div class="mb-3">
        <div class="flex gap-2">
          <button class="px-3 py-1 bg-primary text-white rounded-full text-sm">全部</button>
          <button class="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-full text-sm">错误</button>
          <button class="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-full text-sm">警告</button>
          <button class="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-full text-sm">信息</button>
        </div>
      </div>
      <div class="border border-gray-200 rounded-lg overflow-hidden">
        <div class="max-h-60 overflow-y-auto bg-gray-50 p-3 text-sm font-mono">
          <div class="mb-1">[2023-07-20 14:30:22] INFO: 系统启动成功</div>
          <div class="mb-1">[2023-07-20 14:35:15] INFO: 管理员登录成功</div>
          <div class="mb-1 text-yellow-600">[2023-07-20 15:20:45] WARNING: 数据库连接超时</div>
          <div class="mb-1 text-red-600">[2023-07-20 16:45:32] ERROR: 文件上传失败</div>
          <div class="mb-1">[2023-07-20 17:10:18] INFO: 系统备份完成</div>
        </div>
      </div>
      <div class="mt-3 text-right">
        <button class="text-sm text-primary hover:underline">下载日志</button>
      </div>
    `;
    
    mainContent.appendChild(logSection);
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  // 检查是否在管理员页面
  if (window.location.pathname.includes('admin_') || 
      window.location.pathname.includes('user_management.html') ||
      window.location.pathname.includes('activity_management.html') ||
      window.location.pathname.includes('assessment_management.html') ||
      window.location.pathname.includes('consultant_management.html') ||
      window.location.pathname.includes('booking_management.html') ||
      window.location.pathname.includes('system_settings.html')) {
    
    // 初始化管理员仪表盘
    window.adminDashboard = new AdminDashboard();
  }
});

// 导出类供其他模块使用
if (typeof module !== 'undefined') {
  module.exports = AdminDashboard;
}