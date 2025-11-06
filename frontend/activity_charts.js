// 活动记录页面图表实现

// 1. 防抖函数
function debounce(func, wait) {
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

// 2. 指数退避重试函数
async function retryWithBackoff(fn, maxRetries = 3) {
    let lastError;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
            console.warn(`尝试 ${attempt + 1} 失败，${delay}ms 后重试:`, error);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw lastError;
}

// 3. 活动类型分布图初始化函数
async function initActivityTypeChart() {
    // 检查是否已有图表容器，如果没有则创建
    let canvas = document.getElementById('activityTypeChart');
    let container;
    
    if (!canvas) {
        container = document.querySelector('.grid.grid-cols-1.md\:grid-cols-2.gap-8.mb-12');
        if (container) {
            const chartCard = document.createElement('div');
            chartCard.className = 'profile-card';
            chartCard.innerHTML = `
                <h2 class="text-xl font-bold text-dark mb-6">活动类型分布</h2>
                <div class="h-64">
                    <canvas id="activityTypeChart"></canvas>
                </div>
            `;
            container.appendChild(chartCard);
            canvas = document.getElementById('activityTypeChart');
        }
    }
    
    if (!canvas) return;
    
    try {
        // 模拟数据获取
        const data = await retryWithBackoff(() => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        labels: ['团体辅导', '冥想课程', '工作坊', '讲座'],
                        datasets: [{
                            data: [3, 2, 2, 1],
                            backgroundColor: [
                                '#6366f1', // primary
                                '#8b5cf6', // secondary
                                '#ec4899', // accent
                                '#10b981'  // success
                            ],
                            borderWidth: 2,
                            borderColor: '#fff'
                        }]
                    });
                }, 500);
            });
        });
        
        // 销毁可能存在的旧图表
        if (window.activityTypeChart) {
            window.activityTypeChart.destroy();
        }
        
        // 创建图表
        window.activityTypeChart = new Chart(canvas, {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    animateScale: true,
                    animateRotate: true,
                    duration: 1000,
                    easing: 'easeOutQuart'
                },
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            padding: 20,
                            font: {
                                size: 12
                            },
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        titleColor: '#1e293b',
                        bodyColor: '#475569',
                        borderColor: '#e2e8f0',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: true,
                        usePointStyle: true,
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                },
                cutout: '65%'
            }
        });
        
    } catch (error) {
        console.error('初始化活动类型分布图失败:', error);
    }
}

// 4. 活动参与趋势图初始化函数
async function initActivityTrendChart() {
    // 创建活动时间趋势图的容器
    const container = document.querySelector('.grid.grid-cols-1.md\:grid-cols-2.gap-8.mb-12');
    
    if (container) {
        const trendCard = document.createElement('div');
        trendCard.className = 'profile-card';
        trendCard.innerHTML = `
            <h2 class="text-xl font-bold text-dark mb-6">活动参与趋势</h2>
            <div class="h-64">
                <canvas id="activityTrendChart"></canvas>
            </div>
        `;
        container.appendChild(trendCard);
        
        const canvas = document.getElementById('activityTrendChart');
        
        try {
            // 模拟数据获取
            const data = await retryWithBackoff(() => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve({
                            labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
                            datasets: [
                                {
                                    label: '已参与活动',
                                    data: [1, 1, 0, 1, 1, 1],
                                    backgroundColor: 'rgba(16, 185, 129, 0.5)',
                                    borderColor: '#10b981',
                                    borderWidth: 2,
                                    tension: 0.2
                                },
                                {
                                    label: '已报名未参与',
                                    data: [0, 0, 1, 0, 0, 0],
                                    backgroundColor: 'rgba(245, 158, 11, 0.5)',
                                    borderColor: '#f59e0b',
                                    borderWidth: 2,
                                    tension: 0.2
                                }
                            ]
                        });
                    }, 700);
                });
            });
            
            // 创建图表
            window.activityTrendChart = new Chart(canvas, {
                type: 'bar',
                data: data,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: {
                        duration: 1000,
                        easing: 'easeOutQuart'
                    },
                    interaction: {
                        intersect: false,
                        mode: 'index'
                    },
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                padding: 20,
                                usePointStyle: true
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            titleColor: '#1e293b',
                            bodyColor: '#475569',
                            borderColor: '#e2e8f0',
                            borderWidth: 1,
                            padding: 12,
                            displayColors: true,
                            usePointStyle: true,
                            callbacks: {
                                label: function(context) {
                                    return context.dataset.label + ': ' + context.parsed.y + ' 个';
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1,
                                callback: function(value) {
                                    return value + ' 个';
                                }
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
            
        } catch (error) {
            console.error('初始化活动参与趋势图失败:', error);
        }
    }
}

// 5. 活动满意度评分图（新增图表）
async function initActivitySatisfactionChart() {
    // 创建满意度图表的容器
    const container = document.querySelector('.main > div.container');
    
    if (container) {
        const satisfactionSection = document.createElement('section');
        satisfactionSection.className = 'mb-12';
        satisfactionSection.innerHTML = `
            <h2 class="text-2xl font-bold text-gray-800 mb-6">活动满意度分析</h2>
            <div class="profile-card">
                <div class="h-80">
                    <canvas id="activitySatisfactionChart"></canvas>
                </div>
            </div>
        `;
        
        // 插入到活动统计卡片之后
        const statsSection = document.querySelector('.grid.grid-cols-1.md\:grid-cols-4.gap-6.mb-10');
        if (statsSection) {
            container.insertBefore(satisfactionSection, statsSection.nextSibling);
        } else {
            container.appendChild(satisfactionSection);
        }
        
        const canvas = document.getElementById('activitySatisfactionChart');
        
        try {
            // 模拟数据获取
            const data = await retryWithBackoff(() => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve({
                            labels: ['冥想放松', '情绪管理', '人际沟通', '压力应对', '自我认知'],
                            datasets: [{
                                label: '满意度评分',
                                data: [4.8, 4.5, 4.2, 4.6, 4.3],
                                backgroundColor: 'rgba(99, 102, 241, 0.6)',
                                borderColor: '#6366f1',
                                borderWidth: 2,
                                borderRadius: 8
                            }]
                        });
                    }, 600);
                });
            });
            
            // 创建图表
            window.activitySatisfactionChart = new Chart(canvas, {
                type: 'bar',
                data: data,
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: {
                        duration: 1000,
                        easing: 'easeOutQuart'
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            titleColor: '#1e293b',
                            bodyColor: '#475569',
                            borderColor: '#e2e8f0',
                            borderWidth: 1,
                            padding: 12,
                            callbacks: {
                                label: function(context) {
                                    return '满意度: ' + context.parsed.x + ' / 5.0';
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            beginAtZero: true,
                            max: 5,
                            ticks: {
                                stepSize: 1,
                                callback: function(value) {
                                    return value + '.0';
                                }
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)'
                            }
                        },
                        y: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
            
        } catch (error) {
            console.error('初始化活动满意度分析失败:', error);
        }
    }
}

// 6. 活动状态比例图（新增图表）
async function initActivityStatusChart() {
    // 创建活动状态分布图表的容器
    const container = document.querySelector('.main > div.container');
    
    if (container) {
        const statusSection = document.createElement('section');
        statusSection.className = 'mb-12';
        statusSection.innerHTML = `
            <h2 class="text-2xl font-bold text-gray-800 mb-6">活动状态分布</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="profile-card">
                    <div class="h-64">
                        <canvas id="activityStatusChart"></canvas>
                    </div>
                </div>
                <div class="profile-card">
                    <h3 class="text-lg font-semibold mb-4">参与建议</h3>
                    <ul class="space-y-4">
                        <li class="flex items-start">
                            <i class="fa fa-check-circle text-success mt-1 mr-2"></i>
                            <div>
                                <span class="font-medium">持续参与</span>
                                <p class="text-sm text-gray-600">您在冥想放松类活动中的参与度较高，继续保持良好习惯</p>
                            </div>
                        </li>
                        <li class="flex items-start">
                            <i class="fa fa-exclamation-circle text-warning mt-1 mr-2"></i>
                            <div>
                                <span class="font-medium">尝试新活动</span>
                                <p class="text-sm text-gray-600">建议尝试更多自我认知类活动，有助于全面提升心理健康水平</p>
                            </div>
                        </li>
                        <li class="flex items-start">
                            <i class="fa fa-info-circle text-info mt-1 mr-2"></i>
                            <div>
                                <span class="font-medium">定期回顾</span>
                                <p class="text-sm text-gray-600">活动参与后及时回顾总结，强化活动效果</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        `;
        
        // 插入到活动趋势图之后
        const trendSection = document.querySelector('.grid.grid-cols-1.md\:grid-cols-2.gap-8.mb-12');
        if (trendSection && trendSection.nextElementSibling) {
            container.insertBefore(statusSection, trendSection.nextElementSibling.nextSibling);
        } else {
            container.appendChild(statusSection);
        }
        
        const canvas = document.getElementById('activityStatusChart');
        
        try {
            // 模拟数据获取
            const data = await retryWithBackoff(() => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve({
                            labels: ['已参与', '即将开始', '已取消'],
                            datasets: [{
                                data: [5, 2, 1],
                                backgroundColor: [
                                    '#10b981', // success
                                    '#3b82f6', // info
                                    '#ef4444'  // error
                                ],
                                borderWidth: 2,
                                borderColor: '#fff'
                            }]
                        });
                    }, 500);
                });
            });
            
            // 创建图表
            window.activityStatusChart = new Chart(canvas, {
                type: 'pie',
                data: data,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: {
                        animateScale: true,
                        animateRotate: true,
                        duration: 1000,
                        easing: 'easeOutQuart'
                    },
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: {
                                padding: 20,
                                font: {
                                    size: 12
                                },
                                usePointStyle: true
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            titleColor: '#1e293b',
                            bodyColor: '#475569',
                            borderColor: '#e2e8f0',
                            borderWidth: 1,
                            padding: 12,
                            displayColors: true,
                            usePointStyle: true,
                            callbacks: {
                                label: function(context) {
                                    const label = context.label || '';
                                    const value = context.parsed || 0;
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = Math.round((value / total) * 100);
                                    return `${label}: ${value} (${percentage}%)`;
                                }
                            }
                        }
                    }
                }
            });
            
        } catch (error) {
            console.error('初始化活动状态分布失败:', error);
        }
    }
}

// 7. 响应式图表重绘
const resizeChart = debounce(() => {
    if (window.activityTypeChart) {
        window.activityTypeChart.resize();
    }
    if (window.activityTrendChart) {
        window.activityTrendChart.resize();
    }
    if (window.activitySatisfactionChart) {
        window.activitySatisfactionChart.resize();
    }
    if (window.activityStatusChart) {
        window.activityStatusChart.resize();
    }
}, 200);

// 8. 添加窗口大小变化事件监听
window.addEventListener('resize', resizeChart);

// 9. 页面加载完成后初始化图表
document.addEventListener('DOMContentLoaded', function() {
    // 确保引入Chart.js
    if (typeof Chart === 'undefined') {
        const chartScript = document.createElement('script');
        chartScript.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.8/dist/chart.umd.min.js';
        chartScript.onload = function() {
            // 初始化所有图表
            initActivityTypeChart();
            initActivityTrendChart();
            initActivitySatisfactionChart();
            initActivityStatusChart();
        };
        document.head.appendChild(chartScript);
    } else {
        // 初始化所有图表
        initActivityTypeChart();
        initActivityTrendChart();
        initActivitySatisfactionChart();
        initActivityStatusChart();
    }
});
