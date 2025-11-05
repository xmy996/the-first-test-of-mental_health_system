const fs = require('fs');
const path = require('path');

// 管理系统页面列表
const adminPages = [
    'admin_dashboard.html',
    'user_management.html',
    'activity_management.html',
    'assessment_management.html',
    'consultant_management.html',
    'booking_management.html',
    'ai_assistant_management.html',
    'psychology_experiment_management.html',
    'sandbox_simulation_management.html',
    'system_settings.html'
];

// 清理备份文件和不需要的管理页面
function cleanupAdminFiles() {
    console.log('开始清理管理系统文件...');
    
    // 删除备份文件
    const files = fs.readdirSync('.');
    files.forEach(file => {
        if (file.endsWith('.html.backup')) {
            try {
                fs.unlinkSync(file);
                console.log(`删除备份文件: ${file}`);
            } catch (err) {
                console.error(`删除备份文件失败: ${file}`, err);
            }
        }
    });
    
    // 删除重复或不需要的管理页面
    const redundantPages = [
        'admin_login.html',
        'ai_assistant_manager.html',
        'test_admin_dashboard.html'
    ];
    
    redundantPages.forEach(page => {
        if (fs.existsSync(page)) {
            try {
                fs.unlinkSync(page);
                console.log(`删除冗余页面: ${page}`);
            } catch (err) {
                console.error(`删除冗余页面失败: ${page}`, err);
            }
        }
    });
    
    console.log('清理完成！');
}

// 从模板生成新的管理页面
function generateAdminPages() {
    console.log('开始重新生成管理系统页面...');
    
    // 读取模板文件
    let templateContent;
    try {
        templateContent = fs.readFileSync('unified_admin_template.html', 'utf8');
        console.log('读取模板文件成功');
    } catch (err) {
        console.error('读取模板文件失败:', err);
        return;
    }
    
    // 页面配置
    const pageConfigs = {
        'admin_dashboard.html': {
            title: '仪表盘概览 - 心社区管理系统',
            pageTitle: '仪表盘概览',
            activeNav: 'admin_dashboard.html',
            content: generateDashboardContent()
        },
        'user_management.html': {
            title: '用户管理 - 心社区管理系统',
            pageTitle: '用户管理',
            activeNav: 'user_management.html',
            content: generateUserManagementContent()
        },
        'activity_management.html': {
            title: '活动管理 - 心社区管理系统',
            pageTitle: '活动管理',
            activeNav: 'activity_management.html',
            content: generateActivityManagementContent()
        },
        'assessment_management.html': {
            title: '测评管理 - 心社区管理系统',
            pageTitle: '测评管理',
            activeNav: 'assessment_management.html',
            content: generateAssessmentManagementContent()
        },
        'consultant_management.html': {
            title: '咨询师管理 - 心社区管理系统',
            pageTitle: '咨询师管理',
            activeNav: 'consultant_management.html',
            content: generateConsultantManagementContent()
        },
        'booking_management.html': {
            title: '预约管理 - 心社区管理系统',
            pageTitle: '预约管理',
            activeNav: 'booking_management.html',
            content: generateBookingManagementContent()
        },
        'ai_assistant_management.html': {
            title: 'AI智能助手管理 - 心社区管理系统',
            pageTitle: 'AI智能助手管理',
            activeNav: 'ai_assistant_management.html',
            content: generateAIAssistantManagementContent()
        },
        'psychology_experiment_management.html': {
            title: '心理实验管理 - 心社区管理系统',
            pageTitle: '心理实验管理',
            activeNav: 'psychology_experiment_management.html',
            content: generateExperimentManagementContent()
        },
        'sandbox_simulation_management.html': {
            title: '沙盘模拟管理 - 心社区管理系统',
            pageTitle: '沙盘模拟管理',
            activeNav: 'sandbox_simulation_management.html',
            content: generateSandboxManagementContent()
        },
        'system_settings.html': {
            title: '系统设置 - 心社区管理系统',
            pageTitle: '系统设置',
            activeNav: 'system_settings.html',
            content: generateSystemSettingsContent()
        }
    };
    
    // 生成每个页面
    for (const page of adminPages) {
        if (!pageConfigs[page]) {
            console.warn(`跳过页面 ${page}：没有配置信息`);
            continue;
        }
        
        const config = pageConfigs[page];
        let pageContent = templateContent;
        
        // 替换标题
        pageContent = pageContent.replace('<title>管理系统 - 心社区</title>', `<title>${config.title}</title>`);
        
        // 替换页面标题
        pageContent = pageContent.replace('<h1 class="text-xl font-bold text-gray-800">管理系统</h1>', `<h1 class="text-xl font-bold text-gray-800">${config.pageTitle}</h1>`);
        
        // 设置激活的导航项
        pageContent = pageContent.replace(
            new RegExp(`href="${config.activeNav}".*?class="admin-sidebar-item"`, 'g'),
            `href="${config.activeNav}" class="admin-sidebar-item active"`
        );
        
        // 添加页面特定内容
        pageContent = pageContent.replace('<div id="page-content">\n                    <!-- 页面特定内容 -->\n                </div>', `<div id="page-content">
                    ${config.content}
                </div>`);
        
        // 写入文件
        try {
            fs.writeFileSync(page, pageContent, 'utf8');
            console.log(`生成页面成功: ${page}`);
        } catch (err) {
            console.error(`生成页面失败: ${page}`, err);
        }
    }
    
    console.log('管理系统页面生成完成！');
}

// 生成仪表盘内容
function generateDashboardContent() {
    return `<!-- 统计卡片 -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
    <div class="admin-card">
        <div class="flex justify-between items-start">
            <div>
                <p class="text-gray-500 text-sm">活跃用户</p>
                <h3 class="text-3xl font-bold mt-2 stat-card-number">1,234</h3>
                <p class="text-success text-sm flex items-center mt-2">
                    <i class="fa fa-arrow-up mr-1"></i> 12% 较上周
                </p>
            </div>
            <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <i class="fa fa-users text-xl"></i>
            </div>
        </div>
    </div>
    
    <div class="admin-card">
        <div class="flex justify-between items-start">
            <div>
                <p class="text-gray-500 text-sm">新增测评</p>
                <h3 class="text-3xl font-bold mt-2 stat-card-number">456</h3>
                <p class="text-success text-sm flex items-center mt-2">
                    <i class="fa fa-arrow-up mr-1"></i> 8% 较上周
                </p>
            </div>
            <div class="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                <i class="fa fa-file-text-o text-xl"></i>
            </div>
        </div>
    </div>
    
    <div class="admin-card">
        <div class="flex justify-between items-start">
            <div>
                <p class="text-gray-500 text-sm">咨询预约</p>
                <h3 class="text-3xl font-bold mt-2 stat-card-number">78</h3>
                <p class="text-danger text-sm flex items-center mt-2">
                    <i class="fa fa-arrow-down mr-1"></i> 3% 较上周
                </p>
            </div>
            <div class="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center text-warning">
                <i class="fa fa-calendar-check-o text-xl"></i>
            </div>
        </div>
    </div>
    
    <div class="admin-card">
        <div class="flex justify-between items-start">
            <div>
                <p class="text-gray-500 text-sm">团体活动</p>
                <h3 class="text-3xl font-bold mt-2 stat-card-number">24</h3>
                <p class="text-success text-sm flex items-center mt-2">
                    <i class="fa fa-arrow-up mr-1"></i> 5% 较上周
                </p>
            </div>
            <div class="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center text-success">
                <i class="fa fa-users text-xl"></i>
            </div>
        </div>
    </div>
</div>

<!-- 重要指标卡片 -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
    <div class="admin-card">
        <div class="flex justify-between items-center">
            <div>
                <p class="text-gray-500 text-sm">用户满意度</p>
                <h3 class="text-3xl font-bold mt-2 stat-card-number">96.8%</h3>
                <p class="text-gray-600 text-sm mt-2">4.8/5.0 平均分</p>
            </div>
            <div class="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center text-success">
                <i class="fa fa-star text-xl"></i>
            </div>
        </div>
    </div>
    
    <div class="admin-card">
        <div class="flex justify-between items-center">
            <div>
                <p class="text-gray-500 text-sm">待处理咨询</p>
                <h3 class="text-3xl font-bold mt-2 stat-card-number text-danger">12</h3>
                <p class="text-danger text-sm mt-2">需24小时内处理</p>
            </div>
            <div class="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center text-danger">
                <i class="fa fa-exclamation-circle text-xl"></i>
            </div>
        </div>
    </div>
    
    <div class="admin-card">
        <div class="flex justify-between items-center">
            <div>
                <p class="text-gray-500 text-sm">系统运行状态</p>
                <h3 class="text-3xl font-bold mt-2 stat-card-number text-success">正常</h3>
                <p class="text-gray-600 text-sm mt-2">服务响应率: 99.8%</p>
            </div>
            <div class="w-12 h-12 rounded-full bg-info/10 flex items-center justify-center text-info">
                <i class="fa fa-check-circle text-xl"></i>
            </div>
        </div>
    </div>
</div>

<!-- 图表区域 -->
<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
    <div class="admin-card">
        <div class="flex justify-between items-center mb-4">
            <h3 class="font-bold text-lg">用户活跃度趋势</h3>
            <div class="flex space-x-2">
                <button class="px-3 py-1 text-sm rounded-md bg-primary/10 text-primary">周</button>
                <button class="px-3 py-1 text-sm rounded-md bg-gray-100 text-gray-600">月</button>
                <button class="px-3 py-1 text-sm rounded-md bg-gray-100 text-gray-600">年</button>
            </div>
        </div>
        <div class="h-80">
            <canvas id="activityChart"></canvas>
        </div>
    </div>
    
    <div class="admin-card">
        <div class="flex justify-between items-center mb-4">
            <h3 class="font-bold text-lg">心理健康问题分布</h3>
            <div class="flex space-x-2">
                <button class="px-3 py-1 text-sm rounded-md bg-primary/10 text-primary">全部</button>
                <button class="px-3 py-1 text-sm rounded-md bg-gray-100 text-gray-600">青少年</button>
                <button class="px-3 py-1 text-sm rounded-md bg-gray-100 text-gray-600">成人</button>
            </div>
        </div>
        <div class="h-80 flex items-center justify-center">
            <canvas id="distributionChart"></canvas>
        </div>
    </div>
</div>

<!-- 最近活动 -->
<div class="admin-card">
    <div class="flex justify-between items-center mb-4">
        <h3 class="font-bold text-lg">最近活动</h3>
        <button class="text-primary text-sm">查看全部</button>
    </div>
    <div class="overflow-x-auto">
        <table class="data-table w-full">
            <thead>
                <tr>
                    <th class="admin-table-header">活动类型</th>
                    <th class="admin-table-header">用户</th>
                    <th class="admin-table-header">时间</th>
                    <th class="admin-table-header">状态</th>
                    <th class="admin-table-header">操作</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="admin-table-cell">
                        <div class="flex items-center">
                            <i class="fa fa-file-text-o text-secondary mr-2"></i>
                            心理健康测评
                        </div>
                    </td>
                    <td class="admin-table-cell">
                        <div class="flex items-center">
                            <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-2">
                                <i class="fa fa-user"></i>
                            </div>
                            张小明
                        </div>
                    </td>
                    <td class="admin-table-cell">2024-01-15 14:30</td>
                    <td class="admin-table-cell">
                        <span class="admin-badge admin-badge-success">已完成</span>
                    </td>
                    <td class="admin-table-cell">
                        <button class="text-primary mr-3">查看</button>
                        <button class="text-gray-500">处理</button>
                    </td>
                </tr>
                <tr>
                    <td class="admin-table-cell">
                        <div class="flex items-center">
                            <i class="fa fa-calendar-check-o text-warning mr-2"></i>
                            咨询预约
                        </div>
                    </td>
                    <td class="admin-table-cell">
                        <div class="flex items-center">
                            <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-2">
                                <i class="fa fa-user"></i>
                            </div>
                            李小红
                        </div>
                    </td>
                    <td class="admin-table-cell">2024-01-15 13:45</td>
                    <td class="admin-table-cell">
                        <span class="admin-badge admin-badge-warning">待确认</span>
                    </td>
                    <td class="admin-table-cell">
                        <button class="text-primary mr-3">查看</button>
                        <button class="text-gray-500">处理</button>
                    </td>
                </tr>
                <tr>
                    <td class="admin-table-cell">
                        <div class="flex items-center">
                            <i class="fa fa-users text-success mr-2"></i>
                            团体活动
                        </div>
                    </td>
                    <td class="admin-table-cell">
                        <div class="flex items-center">
                            <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-2">
                                <i class="fa fa-user"></i>
                            </div>
                            王大力
                        </div>
                    </td>
                    <td class="admin-table-cell">2024-01-15 12:20</td>
                    <td class="admin-table-cell">
                        <span class="admin-badge admin-badge-info">已报名</span>
                    </td>
                    <td class="admin-table-cell">
                        <button class="text-primary mr-3">查看</button>
                        <button class="text-gray-500">处理</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

<script>
    // 初始化图表
    document.addEventListener('DOMContentLoaded', function() {
        // 活跃度趋势图
        const activityCtx = document.getElementById('activityChart').getContext('2d');
        new Chart(activityCtx, {
            type: 'line',
            data: {
                labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                datasets: [{
                    label: '活跃用户',
                    data: [120, 190, 170, 210, 230, 280, 310],
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        
        // 分布饼图
        const distributionCtx = document.getElementById('distributionChart').getContext('2d');
        new Chart(distributionCtx, {
            type: 'doughnut',
            data: {
                labels: ['焦虑', '抑郁', '压力', '失眠', '其他'],
                datasets: [{
                    data: [35, 25, 20, 15, 5],
                    backgroundColor: [
                        '#6366f1',
                        '#8b5cf6',
                        '#ec4899',
                        '#10b981',
                        '#f59e0b'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    });
</script>`;
}

// 生成用户管理内容
function generateUserManagementContent() {
    return `<!-- 操作栏 -->
<div class="flex flex-wrap justify-between items-center mb-6">
    <div class="mb-4 md:mb-0">
        <h2 class="text-lg font-bold">用户列表</h2>
        <p class="text-gray-500 text-sm">管理所有注册用户</p>
    </div>
    <div class="flex space-x-4">
        <div class="relative">
            <input type="text" placeholder="搜索用户..." class="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary">
            <i class="fa fa-search absolute left-3 top-3 text-gray-400"></i>
        </div>
        <button class="admin-btn admin-btn-primary">
            <i class="fa fa-plus mr-2"></i>添加用户
        </button>
    </div>
</div>

<!-- 筛选和统计卡片 -->
<div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
    <div class="admin-card">
        <p class="text-gray-500 text-sm">总用户数</p>
        <h3 class="text-3xl font-bold mt-2 stat-card-number">5,678</h3>
        <p class="text-success text-sm flex items-center mt-2">
            <i class="fa fa-arrow-up mr-1"></i> 15% 较上月
        </p>
    </div>
    
    <div class="admin-card">
        <p class="text-gray-500 text-sm">活跃用户</p>
        <h3 class="text-3xl font-bold mt-2 stat-card-number">1,234</h3>
        <p class="text-success text-sm flex items-center mt-2">
            <i class="fa fa-arrow-up mr-1"></i> 12% 较上周
        </p>
    </div>
    
    <div class="admin-card">
        <p class="text-gray-500 text-sm">新增用户</p>
        <h3 class="text-3xl font-bold mt-2 stat-card-number">345</h3>
        <p class="text-success text-sm flex items-center mt-2">
            <i class="fa fa-arrow-up mr-1"></i> 8% 较上月
        </p>
    </div>
    
    <div class="admin-card">
        <p class="text-gray-500 text-sm">高风险用户</p>
        <h3 class="text-3xl font-bold mt-2 stat-card-number text-danger">45</h3>
        <p class="text-danger text-sm flex items-center mt-2">
            <i class="fa fa-arrow-down mr-1"></i> 3% 较上月
        </p>
    </div>
</div>

<!-- 图表区域 -->
<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
    <div class="admin-card">
        <div class="flex justify-between items-center mb-4">
            <h3 class="font-bold text-lg">用户增长趋势</h3>
            <div class="flex space-x-2">
                <button class="px-3 py-1 text-sm rounded-md bg-gray-100 text-gray-600">周</button>
                <button class="px-3 py-1 text-sm rounded-md bg-primary/10 text-primary">月</button>
                <button class="px-3 py-1 text-sm rounded-md bg-gray-100 text-gray-600">年</button>
            </div>
        </div>
        <div class="h-80">
            <canvas id="userGrowthChart"></canvas>
        </div>
    </div>
    
    <div class="admin-card">
        <div class="flex justify-between items-center mb-4">
            <h3 class="font-bold text-lg">用户年龄分布</h3>
            <button class="text-primary text-sm">导出数据</button>
        </div>
        <div class="h-80 flex items-center justify-center">
            <canvas id="ageDistributionChart"></canvas>
        </div>
    </div>
</div>

<!-- 用户表格 -->
<div class="admin-card">
    <div class="flex justify-between items-center mb-4">
        <div class="flex items-center space-x-4">
            <button class="text-gray-600 hover:text-primary">
                <i class="fa fa-filter mr-1"></i>筛选
            </button>
            <button class="text-gray-600 hover:text-primary">
                <i class="fa fa-sort mr-1"></i>排序
            </button>
            <span class="text-gray-500 text-sm">共5,678条记录</span>
        </div>
        <div class="flex space-x-2">
            <button class="text-gray-600 hover:text-primary px-3 py-1 text-sm rounded-md border border-gray-300">
                <i class="fa fa-download mr-1"></i>导出
            </button>
            <button class="text-gray-600 hover:text-primary px-3 py-1 text-sm rounded-md border border-gray-300">
                <i class="fa fa-refresh mr-1"></i>刷新
            </button>
        </div>
    </div>
    <div class="overflow-x-auto">
        <table class="data-table w-full">
            <thead>
                <tr>
                    <th class="admin-table-header"><input type="checkbox"></th>
                    <th class="admin-table-header">用户ID</th>
                    <th class="admin-table-header">用户名</th>
                    <th class="admin-table-header">邮箱</th>
                    <th class="admin-table-header">注册时间</th>
                    <th class="admin-table-header">最后登录</th>
                    <th class="admin-table-header">状态</th>
                    <th class="admin-table-header">操作</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="admin-table-cell"><input type="checkbox"></td>
                    <td class="admin-table-cell">U001</td>
                    <td class="admin-table-cell">
                        <div class="flex items-center">
                            <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-2">
                                <i class="fa fa-user"></i>
                            </div>
                            张小明
                        </div>
                    </td>
                    <td class="admin-table-cell">zhang@example.com</td>
                    <td class="admin-table-cell">2024-01-01</td>
                    <td class="admin-table-cell">2024-01-15 14:30</td>
                    <td class="admin-table-cell">
                        <span class="admin-badge admin-badge-success">活跃</span>
                    </td>
                    <td class="admin-table-cell">
                        <div class="flex space-x-2">
                            <button class="text-primary hover:text-primary-dark">
                                <i class="fa fa-eye"></i>
                            </button>
                            <button class="text-gray-500 hover:text-gray-700">
                                <i class="fa fa-edit"></i>
                            </button>
                            <button class="text-danger hover:text-red-700">
                                <i class="fa fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td class="admin-table-cell"><input type="checkbox"></td>
                    <td class="admin-table-cell">U002</td>
                    <td class="admin-table-cell">
                        <div class="flex items-center">
                            <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-2">
                                <i class="fa fa-user"></i>
                            </div>
                            李小红
                        </div>
                    </td>
                    <td class="admin-table-cell">li@example.com</td>
                    <td class="admin-table-cell">2024-01-02</td>
                    <td class="admin-table-cell">2024-01-14 10:15</td>
                    <td class="admin-table-cell">
                        <span class="admin-badge admin-badge-warning">待审核</span>
                    </td>
                    <td class="admin-table-cell">
                        <div class="flex space-x-2">
                            <button class="text-primary hover:text-primary-dark">
                                <i class="fa fa-eye"></i>
                            </button>
                            <button class="text-gray-500 hover:text-gray-700">
                                <i class="fa fa-edit"></i>
                            </button>
                            <button class="text-danger hover:text-red-700">
                                <i class="fa fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td class="admin-table-cell"><input type="checkbox"></td>
                    <td class="admin-table-cell">U003</td>
                    <td class="admin-table-cell">
                        <div class="flex items-center">
                            <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-2">
                                <i class="fa fa-user"></i>
                            </div>
                            王大力
                        </div>
                    </td>
                    <td class="admin-table-cell">wang@example.com</td>
                    <td class="admin-table-cell">2024-01-03</td>
                    <td class="admin-table-cell">2024-01-13 16:45</td>
                    <td class="admin-table-cell">
                        <span class="admin-badge admin-badge-error">高风险</span>
                    </td>
                    <td class="admin-table-cell">
                        <div class="flex space-x-2">
                            <button class="text-primary hover:text-primary-dark">
                                <i class="fa fa-eye"></i>
                            </button>
                            <button class="text-gray-500 hover:text-gray-700">
                                <i class="fa fa-edit"></i>
                            </button>
                            <button class="text-danger hover:text-red-700">
                                <i class="fa fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td class="admin-table-cell"><input type="checkbox"></td>
                    <td class="admin-table-cell">U004</td>
                    <td class="admin-table-cell">
                        <div class="flex items-center">
                            <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-2">
                                <i class="fa fa-user"></i>
                            </div>
                            陈思思
                        </div>
                    </td>
                    <td class="admin-table-cell">chen@example.com</td>
                    <td class="admin-table-cell">2024-01-04</td>
                    <td class="admin-table-cell">2024-01-12 09:20</td>
                    <td class="admin-table-cell">
                        <span class="admin-badge admin-badge-success">活跃</span>
                    </td>
                    <td class="admin-table-cell">
                        <div class="flex space-x-2">
                            <button class="text-primary hover:text-primary-dark">
                                <i class="fa fa-eye"></i>
                            </button>
                            <button class="text-gray-500 hover:text-gray-700">
                                <i class="fa fa-edit"></i>
                            </button>
                            <button class="text-danger hover:text-red-700">
                                <i class="fa fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td class="admin-table-cell"><input type="checkbox"></td>
                    <td class="admin-table-cell">U005</td>
                    <td class="admin-table-cell">
                        <div class="flex items-center">
                            <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-2">
                                <i class="fa fa-user"></i>
                            </div>
                            刘志强
                        </div>
                    </td>
                    <td class="admin-table-cell">liu@example.com</td>
                    <td class="admin-table-cell">2024-01-05</td>
                    <td class="admin-table-cell">2024-01-11 11:35</td>
                    <td class="admin-table-cell">
                        <span class="admin-badge admin-badge-gray">已禁用</span>
                    </td>
                    <td class="admin-table-cell">
                        <div class="flex space-x-2">
                            <button class="text-primary hover:text-primary-dark">
                                <i class="fa fa-eye"></i>
                            </button>
                            <button class="text-gray-500 hover:text-gray-700">
                                <i class="fa fa-edit"></i>
                            </button>
                            <button class="text-danger hover:text-red-700">
                                <i class="fa fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    
    <!-- 分页 -->
    <div id="pagination" class="mt-6"></div>
</div>

<script>
    // 初始化图表和分页
    document.addEventListener('DOMContentLoaded', function() {
        // 用户增长趋势图
        const growthCtx = document.getElementById('userGrowthChart').getContext('2d');
        new Chart(growthCtx, {
            type: 'line',
            data: {
                labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                datasets: [
                    {
                        label: '新增用户',
                        data: [200, 220, 240, 230, 250, 260, 280, 290, 310, 330, 340, 345],
                        borderColor: '#6366f1',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        tension: 0.3,
                        fill: true
                    },
                    {
                        label: '活跃用户',
                        data: [500, 580, 650, 720, 780, 850, 920, 980, 1050, 1120, 1180, 1234],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.3,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        
        // 年龄分布图
        const ageCtx = document.getElementById('ageDistributionChart').getContext('2d');
        new Chart(ageCtx, {
            type: 'pie',
            data: {
                labels: ['18岁以下', '19-25岁', '26-35岁', '36-50岁', '50岁以上'],
                datasets: [{
                    data: [10, 30, 35, 20, 5],
                    backgroundColor: [
                        '#6366f1',
                        '#8b5cf6',
                        '#ec4899',
                        '#10b981',
                        '#f59e0b'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
        
        // 初始化分页
        new TablePagination({
            container: document.getElementById('pagination'),
            totalItems: 5678,
            itemsPerPage: 10,
            currentPage: 1,
            onPageChange: function(page) {
                console.log('切换到页面:', page);
                // 这里应该有加载页面数据的逻辑
            }
        });
    });
</script>`;
}

// 为其他页面生成内容的函数（简化版）
function generateActivityManagementContent() {
    return `<div class="flex flex-wrap justify-between items-center mb-6">
    <div class="mb-4 md:mb-0">
        <h2 class="text-lg font-bold">活动管理</h2>
        <p class="text-gray-500 text-sm">管理所有心理健康团体活动</p>
    </div>
    <div class="flex space-x-4">
        <button class="admin-btn admin-btn-primary">
            <i class="fa fa-plus mr-2"></i>创建活动
        </button>
    </div>
</div>

<!-- 活动列表 -->
<div class="admin-card">
    <div class="overflow-x-auto">
        <table class="data-table w-full">
            <thead>
                <tr>
                    <th class="admin-table-header">活动ID</th>
                    <th class="admin-table-header">活动名称</th>
                    <th class="admin-table-header">类型</th>
                    <th class="admin-table-header">时间</th>
                    <th class="admin-table-header">地点</th>
                    <th class="admin-table-header">参与人数</th>
                    <th class="admin-table-header">状态</th>
                    <th class="admin-table-header">操作</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="admin-table-cell">A001</td>
                    <td class="admin-table-cell">冥想放松工作坊</td>
                    <td class="admin-table-cell">放松训练</td>
                    <td class="admin-table-cell">2024-01-20 19:00</td>
                    <td class="admin-table-cell">线上直播</td>
                    <td class="admin-table-cell">45/50</td>
                    <td class="admin-table-cell">
                        <span class="admin-badge admin-badge-info">招募中</span>
                    </td>
                    <td class="admin-table-cell">
                        <div class="flex space-x-2">
                            <button class="text-primary hover:text-primary-dark">查看</button>
                            <button class="text-gray-500 hover:text-gray-700">编辑</button>
                            <button class="text-danger hover:text-red-700">删除</button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>`;
}

function generateAssessmentManagementContent() {
    return `<div class="flex flex-wrap justify-between items-center mb-6">
    <div class="mb-4 md:mb-0">
        <h2 class="text-lg font-bold">测评管理</h2>
        <p class="text-gray-500 text-sm">管理心理健康测评问卷</p>
    </div>
    <div class="flex space-x-4">
        <button class="admin-btn admin-btn-primary">
            <i class="fa fa-plus mr-2"></i>创建测评
        </button>
    </div>
</div>

<!-- 测评列表 -->
<div class="admin-card">
    <div class="overflow-x-auto">
        <table class="data-table w-full">
            <thead>
                <tr>
                    <th class="admin-table-header">测评ID</th>
                    <th class="admin-table-header">测评名称</th>
                    <th class="admin-table-header">类型</th>
                    <th class="admin-table-header">题目数量</th>
                    <th class="admin-table-header">使用次数</th>
                    <th class="admin-table-header">状态</th>
                    <th class="admin-table-header">操作</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="admin-table-cell">T001</td>
                    <td class="admin-table-cell">焦虑自评量表（SAS）</td>
                    <td class="admin-table-cell">自评量表</td>
                    <td class="admin-table-cell">20</td>
                    <td class="admin-table-cell">1,234</td>
                    <td class="admin-table-cell">
                        <span class="admin-badge admin-badge-success">启用</span>
                    </td>
                    <td class="admin-table-cell">
                        <div class="flex space-x-2">
                            <button class="text-primary hover:text-primary-dark">查看</button>
                            <button class="text-gray-500 hover:text-gray-700">编辑</button>
                            <button class="text-danger hover:text-red-700">删除</button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>`;
}

function generateConsultantManagementContent() {
    return `<div class="flex flex-wrap justify-between items-center mb-6">
    <div class="mb-4 md:mb-0">
        <h2 class="text-lg font-bold">咨询师管理</h2>
        <p class="text-gray-500 text-sm">管理平台认证咨询师</p>
    </div>
    <div class="flex space-x-4">
        <button class="admin-btn admin-btn-primary">
            <i class="fa fa-plus mr-2"></i>添加咨询师
        </button>
    </div>
</div>

<!-- 咨询师列表 -->
<div class="admin-card">
    <div class="overflow-x-auto">
        <table class="data-table w-full">
            <thead>
                <tr>
                    <th class="admin-table-header">咨询师ID</th>
                    <th class="admin-table-header">姓名</th>
                    <th class="admin-table-header">专业领域</th>
                    <th class="admin-table-header">咨询次数</th>
                    <th class="admin-table-header">评分</th>
                    <th class="admin-table-header">状态</th>
                    <th class="admin-table-header">操作</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="admin-table-cell">C001</td>
                    <td class="admin-table-cell">
                        <div class="flex items-center">
                            <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-2">
                                <i class="fa fa-user-md"></i>
                            </div>
                            王医生
                        </div>
                    </td>
                    <td class="admin-table-cell">青少年心理</td>
                    <td class="admin-table-cell">328</td>
                    <td class="admin-table-cell">4.9</td>
                    <td class="admin-table-cell">
                        <span class="admin-badge admin-badge-success">在线</span>
                    </td>
                    <td class="admin-table-cell">
                        <div class="flex space-x-2">
                            <button class="text-primary hover:text-primary-dark">查看</button>
                            <button class="text-gray-500 hover:text-gray-700">编辑</button>
                            <button class="text-danger hover:text-red-700">删除</button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>`;
}

function generateBookingManagementContent() {
    return `<div class="flex flex-wrap justify-between items-center mb-6">
    <div class="mb-4 md:mb-0">
        <h2 class="text-lg font-bold">预约管理</h2>
        <p class="text-gray-500 text-sm">管理咨询预约记录</p>
    </div>
    <div class="flex space-x-4">
        <div class="relative">
            <input type="text" placeholder="搜索预约..." class="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary">
            <i class="fa fa-search absolute left-3 top-3 text-gray-400"></i>
        </div>
    </div>
</div>

<!-- 统计卡片 -->
<div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
    <div class="admin-card">
        <p class="text-gray-500 text-sm">总预约数</p>
        <h3 class="text-3xl font-bold mt-2 stat-card-number">532</h3>
        <p class="text-success text-sm flex items-center mt-2">
            <i class="fa fa-arrow-up mr-1"></i> 12% 较上月
        </p>
    </div>
    <div class="admin-card">
        <p class="text-gray-500 text-sm">本月预约</p>
        <h3 class="text-3xl font-bold mt-2 stat-card-number">168</h3>
        <p class="text-success text-sm flex items-center mt-2">
            <i class="fa fa-arrow-up mr-1"></i> 8% 较上月
        </p>
    </div>
    <div class="admin-card">
        <p class="text-gray-500 text-sm">待确认预约</p>
        <h3 class="text-3xl font-bold mt-2 stat-card-number">35</h3>
        <p class="text-warning text-sm flex items-center mt-2">
            <i class="fa fa-exclamation-circle mr-1"></i> 需处理
        </p>
    </div>
    <div class="admin-card">
        <p class="text-gray-500 text-sm">完成率</p>
        <h3 class="text-3xl font-bold mt-2 stat-card-number">92%</h3>
        <p class="text-success text-sm flex items-center mt-2">
            <i class="fa fa-arrow-up mr-1"></i> +3% 较上月
        </p>
    </div>
</div>

<!-- 预约列表 -->
<div class="admin-card">
    <div class="overflow-x-auto">
        <table class="data-table w-full">
            <thead>
                <tr>
                    <th class="admin-table-header">预约ID</th>
                    <th class="admin-table-header">用户</th>
                    <th class="admin-table-header">咨询师</th>
                    <th class="admin-table-header">预约时间</th>
                    <th class="admin-table-header">类型</th>
                    <th class="admin-table-header">状态</th>
                    <th class="admin-table-header">操作</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="admin-table-cell">B001</td>
                    <td class="admin-table-cell">张小明</td>
                    <td class="admin-table-cell">王医生</td>
                    <td class="admin-table-cell">2024-01-16 10:00</td>
                    <td class="admin-table-cell">线上咨询</td>
                    <td class="admin-table-cell">
                        <span class="admin-badge admin-badge-warning">待确认</span>
                    </td>
                    <td class="admin-table-cell">
                        <div class="flex space-x-2">
                            <button class="text-primary hover:text-primary-dark">查看</button>
                            <button class="text-success hover:text-green-700">确认</button>
                            <button class="text-danger hover:text-red-700">取消</button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>`;
}

function generateAIAssistantManagementContent() {
    return `<div class="flex flex-wrap justify-between items-center mb-6">
    <div class="mb-4 md:mb-0">
        <h2 class="text-lg font-bold">AI智能助手管理</h2>
        <p class="text-gray-500 text-sm">配置和监控AI心理健康助手</p>
    </div>
    <div class="flex space-x-4">
        <button class="admin-btn admin-btn-primary">
            <i class="fa fa-cog mr-2"></i>系统配置
        </button>
    </div>
</div>

<!-- 助手状态卡片 -->
<div class="admin-card mb-6">
    <div class="flex flex-wrap">
        <div class="w-full md:w-1/2 lg:w-1/4 p-4">
            <p class="text-gray-500 text-sm">今日对话次数</p>
            <h3 class="text-3xl font-bold mt-2 stat-card-number">1,234</h3>
        </div>
        <div class="w-full md:w-1/2 lg:w-1/4 p-4">
            <p class="text-gray-500 text-sm">用户满意度</p>
            <h3 class="text-3xl font-bold mt-2 stat-card-number">96.8%</h3>
        </div>
        <div class="w-full md:w-1/2 lg:w-1/4 p-4">
            <p class="text-gray-500 text-sm">平均响应时间</p>
            <h3 class="text-3xl font-bold mt-2 stat-card-number">0.8s</h3>
        </div>
        <div class="w-full md:w-1/2 lg:w-1/4 p-4">
            <p class="text-gray-500 text-sm">预警拦截次数</p>
            <h3 class="text-3xl font-bold mt-2 stat-card-number">15</h3>
        </div>
    </div>
</div>

<!-- 对话管理 -->
<div class="admin-card">
    <div class="flex justify-between items-center mb-4">
        <h3 class="font-bold text-lg">最近对话记录</h3>
        <button class="text-primary text-sm">查看全部</button>
    </div>
    <div class="overflow-x-auto">
        <table class="data-table w-full">
            <thead>
                <tr>
                    <th class="admin-table-header">会话ID</th>
                    <th class="admin-table-header">用户</th>
                    <th class="admin-table-header">开始时间</th>
                    <th class="admin-table-header">对话轮数</th>
                    <th class="admin-table-header">状态</th>
                    <th class="admin-table-header">操作</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="admin-table-cell">S001</td>
                    <td class="admin-table-cell">张小明</td>
                    <td class="admin-table-cell">2024-01-15 14:30</td>
                    <td class="admin-table-cell">15</td>
                    <td class="admin-table-cell">
                        <span class="admin-badge admin-badge-success">已结束</span>
                    </td>
                    <td class="admin-table-cell">
                        <div class="flex space-x-2">
                            <button class="text-primary hover:text-primary-dark">查看</button>
                            <button class="text-gray-500 hover:text-gray-700">分析</button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>`;
}

function generateExperimentManagementContent() {
    return `<div class="flex flex-wrap justify-between items-center mb-6">
    <div class="mb-4 md:mb-0">
        <h2 class="text-lg font-bold">心理实验管理</h2>
        <p class="text-gray-500 text-sm">管理心理健康实验项目</p>
    </div>
    <div class="flex space-x-4">
        <button class="admin-btn admin-btn-primary">
            <i class="fa fa-plus mr-2"></i>创建实验
        </button>
    </div>
</div>

<!-- 实验列表 -->
<div class="admin-card">
    <div class="overflow-x-auto">
        <table class="data-table w-full">
            <thead>
                <tr>
                    <th class="admin-table-header">实验ID</th>
                    <th class="admin-table-header">实验名称</th>
                    <th class="admin-table-header">类型</th>
                    <th class="admin-table-header">参与人数</th>
                    <th class="admin-table-header">状态</th>
                    <th class="admin-table-header">操作</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="admin-table-cell">E001</td>
                    <td class="admin-table-cell">情绪识别实验</td>
                    <td class="admin-table-cell">认知实验</td>
                    <td class="admin-table-cell">128</td>
                    <td class="admin-table-cell">
                        <span class="admin-badge admin-badge-success">进行中</span>
                    </td>
                    <td class="admin-table-cell">
                        <div class="flex space-x-2">
                            <button class="text-primary hover:text-primary-dark">查看</button>
                            <button class="text-gray-500 hover:text-gray-700">编辑</button>
                            <button class="text-danger hover:text-red-700">删除</button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>`;
}

function generateSandboxManagementContent() {
    return `<div class="flex flex-wrap justify-between items-center mb-6">
    <div class="mb-4 md:mb-0">
        <h2 class="text-lg font-bold">沙盘模拟管理</h2>
        <p class="text-gray-500 text-sm">管理沙盘模拟训练项目</p>
    </div>
    <div class="flex space-x-4">
        <button class="admin-btn admin-btn-primary">
            <i class="fa fa-plus mr-2"></i>创建场景
        </button>
    </div>
</div>

<!-- 场景列表 -->
<div class="admin-card">
    <div class="overflow-x-auto">
        <table class="data-table w-full">
            <thead>
                <tr>
                    <th class="admin-table-header">场景ID</th>
                    <th class="admin-table-header">场景名称</th>
                    <th class="admin-table-header">类型</th>
                    <th class="admin-table-header">使用次数</th>
                    <th class="admin-table-header">状态</th>
                    <th class="admin-table-header">操作</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="admin-table-cell">S001</td>
                    <td class="admin-table-cell">职场压力应对</td>
                    <td class="admin-table-cell">压力管理</td>
                    <td class="admin-table-cell">89</td>
                    <td class="admin-table-cell">
                        <span class="admin-badge admin-badge-success">启用</span>
                    </td>
                    <td class="admin-table-cell">
                        <div class="flex space-x-2">
                            <button class="text-primary hover:text-primary-dark">查看</button>
                            <button class="text-gray-500 hover:text-gray-700">编辑</button>
                            <button class="text-danger hover:text-red-700">删除</button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>`;
}

function generateSystemSettingsContent() {
    return `<div class="flex flex-wrap justify-between items-center mb-6">
    <div class="mb-4 md:mb-0">
        <h2 class="text-lg font-bold">系统设置</h2>
        <p class="text-gray-500 text-sm">配置系统参数和选项</p>
    </div>
</div>

<!-- 设置选项卡 -->
<div class="admin-card mb-6">
    <div class="border-b">
        <div class="flex space-x-4">
            <button class="px-4 py-3 font-medium text-primary border-b-2 border-primary">基本设置</button>
            <button class="px-4 py-3 font-medium text-gray-500 hover:text-primary">安全设置</button>
            <button class="px-4 py-3 font-medium text-gray-500 hover:text-primary">通知设置</button>
            <button class="px-4 py-3 font-medium text-gray-500 hover:text-primary">日志管理</button>
        </div>
    </div>
    <div class="p-6">
        <form id="system-settings-form">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label class="block text-gray-700 mb-2">系统名称</label>
                    <input type="text" value="心社区" class="w-full px-4 py-2 rounded-lg border border-gray-300">
                </div>
                <div>
                    <label class="block text-gray-700 mb-2">系统版本</label>
                    <input type="text" value="v2.1.0" disabled class="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50">
                </div>
                <div>
                    <label class="block text-gray-700 mb-2">最大上传文件大小（MB）</label>
                    <input type="number" value="20" class="w-full px-4 py-2 rounded-lg border border-gray-300">
                </div>
                <div>
                    <label class="block text-gray-700 mb-2">默认每页显示数量</label>
                    <select class="w-full px-4 py-2 rounded-lg border border-gray-300">
                        <option value="10">10条/页</option>
                        <option value="20" selected>20条/页</option>
                        <option value="50">50条/页</option>
                        <option value="100">100条/页</option>
                    </select>
                </div>
            </div>
            <div class="mt-8">
                <button type="submit" class="admin-btn admin-btn-primary">
                    <i class="fa fa-save mr-2"></i>保存设置
                </button>
                <button type="button" class="admin-btn admin-btn-outline ml-3">
                    <i class="fa fa-refresh mr-2"></i>重置
                </button>
            </div>
        </form>
    </div>
</div>

<!-- 系统信息 -->
<div class="admin-card">
    <h3 class="font-bold text-lg mb-4">系统信息</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-gray-500 text-sm">服务器时间</p>
            <p class="text-gray-800 mt-1" id="server-time">2024-01-15 15:30:45</p>
        </div>
        <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-gray-500 text-sm">运行时间</p>
            <p class="text-gray-800 mt-1">32天6小时</p>
        </div>
        <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-gray-500 text-sm">在线用户</p>
            <p class="text-gray-800 mt-1">28人</p>
        </div>
        <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-gray-500 text-sm">磁盘空间</p>
            <p class="text-gray-800 mt-1">85% 已使用</p>
        </div>
    </div>
</div>

<script>
    // 更新服务器时间
    function updateServerTime() {
        const now = new Date();
        document.getElementById('server-time').textContent = now.toLocaleString('zh-CN');
    }
    
    setInterval(updateServerTime, 1000);
    updateServerTime();
    
    // 表单提交
    document.getElementById('system-settings-form').addEventListener('submit', function(e) {
        e.preventDefault();
        notification.success('系统设置已保存');
    });
</script>`;
}

// 主函数
function rebuildAdminSystem() {
    console.log('开始重建管理系统...');
    
    // 确保模板文件存在
    if (!fs.existsSync('unified_admin_template.html')) {
        console.error('错误：统一模板文件 unified_admin_template.html 不存在');
        return;
    }
    
    // 清理旧文件
    cleanupAdminFiles();
    
    // 生成新文件
    generateAdminPages();
    
    console.log('管理系统重建完成！');
}

// 如果直接运行脚本
if (require.main === module) {
    rebuildAdminSystem();
}

// 导出函数供其他模块使用
module.exports = {
    rebuildAdminSystem,
    cleanupAdminFiles,
    generateAdminPages
};