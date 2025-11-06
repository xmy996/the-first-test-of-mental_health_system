// 预约记录页面图表实现

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

// 3. 预约类型分布图初始化函数
async function initBookingTypeChart() {
    const canvas = document.getElementById('bookingTypeChart');
    
    try {
        // 模拟数据获取
        const data = await retryWithBackoff(() => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        labels: ['个人心理咨询', '团体心理咨询', '线上咨询', '线下咨询'],
                        datasets: [{
                            data: [3, 1, 3, 2],
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
        if (window.bookingTypeChart) {
            window.bookingTypeChart.destroy();
        }
        
        // 创建图表
        window.bookingTypeChart = new Chart(canvas, {
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
        console.error('初始化预约类型分布图失败:', error);
        // 显示错误信息
        const card = canvas.closest('.profile-card');
        if (card) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'absolute inset-0 flex items-center justify-center bg-white/80 z-10';
            errorDiv.innerHTML = `
                <div class="text-center p-4">
                    <i class="fa fa-exclamation-triangle text-4xl text-warning mb-3"></i>
                    <p class="text-gray-600 mb-2">数据加载失败</p>
                    <button class="primary-btn py-1 px-4 text-sm" onclick="initBookingTypeChart()">重试</button>
                </div>
            `;
            card.style.position = 'relative';
            card.appendChild(errorDiv);
        }
    }
}

// 4. 预约时间趋势图初始化函数
async function initBookingTrendChart() {
    const canvas = document.getElementById('bookingTrendChart');
    
    try {
        // 模拟数据获取
        const data = await retryWithBackoff(() => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
                        datasets: [
                            {
                                label: '已完成预约',
                                data: [0, 1, 0, 1, 1, 0],
                                backgroundColor: 'rgba(16, 185, 129, 0.5)',
                                borderColor: '#10b981',
                                borderWidth: 2,
                                tension: 0.2
                            },
                            {
                                label: '待确认/待参加',
                                data: [0, 0, 1, 0, 0, 2],
                                backgroundColor: 'rgba(99, 102, 241, 0.5)',
                                borderColor: '#6366f1',
                                borderWidth: 2,
                                tension: 0.2
                            }
                        ]
                    });
                }, 700);
            });
        });
        
        // 销毁可能存在的旧图表
        if (window.bookingTrendChart) {
            window.bookingTrendChart.destroy();
        }
        
        // 创建图表
        window.bookingTrendChart = new Chart(canvas, {
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
                                return context.dataset.label + ': ' + context.parsed.y + ' 次';
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
                                return value + ' 次';
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
        console.error('初始化预约时间趋势图失败:', error);
        // 显示错误信息
        const card = canvas.closest('.profile-card');
        if (card) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'absolute inset-0 flex items-center justify-center bg-white/80 z-10';
            errorDiv.innerHTML = `
                <div class="text-center p-4">
                    <i class="fa fa-exclamation-triangle text-4xl text-warning mb-3"></i>
                    <p class="text-gray-600 mb-2">数据加载失败</p>
                    <button class="primary-btn py-1 px-4 text-sm" onclick="initBookingTrendChart()">重试</button>
                </div>
            `;
            card.style.position = 'relative';
            card.appendChild(errorDiv);
        }
    }
}

// 5. 预约状态比例图（新增图表）
async function initBookingStatusChart() {
    const container = document.querySelector('.profile-card:has(#bookingTypeChart)');
    
    if (container) {
        // 创建新的卡片用于显示预约状态比例图
        const statusCard = document.createElement('div');
        statusCard.className = 'profile-card mt-8';
        statusCard.innerHTML = `
            <h2 class="text-2xl font-bold text-gray-800 mb-6">预约状态分布</h2>
            <div class="h-64">
                <canvas id="bookingStatusChart"></canvas>
            </div>
        `;
        container.parentNode.appendChild(statusCard);
        
        const canvas = document.getElementById('bookingStatusChart');
        
        try {
            // 模拟数据获取
            const data = await retryWithBackoff(() => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve({
                            labels: ['已完成', '待确认', '待参加', '已取消'],
                            datasets: [{
                                data: [3, 1, 1, 0],
                                backgroundColor: [
                                    '#10b981', // success
                                    '#f59e0b', // warning
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
            window.bookingStatusChart = new Chart(canvas, {
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
            console.error('初始化预约状态分布失败:', error);
        }
    }
}

// 6. 响应式图表重绘
const resizeChart = debounce(() => {
    if (window.bookingTypeChart) {
        window.bookingTypeChart.resize();
    }
    if (window.bookingTrendChart) {
        window.bookingTrendChart.resize();
    }
    if (window.bookingStatusChart) {
        window.bookingStatusChart.resize();
    }
}, 200);

// 7. 添加窗口大小变化事件监听
window.addEventListener('resize', resizeChart);

// 8. 页面加载完成后初始化图表
document.addEventListener('DOMContentLoaded', function() {
    // 初始化预约类型分布图
    initBookingTypeChart();
    // 初始化预约时间趋势图
    initBookingTrendChart();
    // 添加预约状态比例图
    initBookingStatusChart();
});
