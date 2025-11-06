// 创建新的改进版图表组件代码
// 1. 添加防抖函数
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
            // 指数退避，最小1秒，最大10秒
            const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
            console.warn(`尝试 ${attempt + 1} 失败，${delay}ms 后重试:`, error);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw lastError;
}

// 3. 改进的心理健康趋势图初始化函数
async function initMentalHealthChart() {
    const loadingContainer = document.getElementById('mentalHealthChartLoader');
    const errorContainer = document.getElementById('mentalHealthChartError');
    const canvas = document.getElementById('mentalHealthChart');
    
    try {
        // 确保容器有正确的相对定位
        const chartContainer = canvas.parentElement;
        chartContainer.style.position = 'relative';
        
        // 显示加载状态
        loadingContainer.classList.remove('hidden');
        canvas.classList.add('hidden');
        errorContainer.classList.add('hidden');
        
        // 模拟数据获取（实际应用中这里应该是API调用）
        const data = await retryWithBackoff(() => {
            // 模拟网络延迟
            return new Promise((resolve) => {
                // 直接返回成功数据，避免随机失败
                setTimeout(() => {
                    resolve({
                        labels: ['2025-08', '2025-09', '2025-10', '2025-11'],
                        datasets: [
                            {
                                label: '情绪健康指数',
                                data: [75, 80, 82, 90],
                                borderColor: '#6366f1',
                                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                tension: 0.4,
                                fill: true,
                                pointBackgroundColor: '#6366f1',
                                pointBorderColor: '#fff',
                                pointBorderWidth: 2,
                                pointRadius: 6,
                                pointHoverRadius: 8,
                                pointHoverBackgroundColor: '#fff',
                                pointHoverBorderWidth: 3
                            },
                            {
                                label: '压力管理指数',
                                data: [65, 68, 70, 75],
                                borderColor: '#ec4899',
                                backgroundColor: 'rgba(236, 72, 153, 0.1)',
                                tension: 0.4,
                                fill: true,
                                pointBackgroundColor: '#ec4899',
                                pointBorderColor: '#fff',
                                pointBorderWidth: 2,
                                pointRadius: 6,
                                pointHoverRadius: 8,
                                pointHoverBackgroundColor: '#fff',
                                pointHoverBorderWidth: 3
                            },
                            {
                                label: '人际关系指数',
                                data: [80, 82, 83, 85],
                                borderColor: '#10b981',
                                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                tension: 0.4,
                                fill: true,
                                pointBackgroundColor: '#10b981',
                                pointBorderColor: '#fff',
                                pointBorderWidth: 2,
                                pointRadius: 6,
                                pointHoverRadius: 8,
                                pointHoverBackgroundColor: '#fff',
                                pointHoverBorderWidth: 3
                            }
                        ]
                    });
                }, 500);
            });
        });
        
        // 隐藏加载状态，显示图表
        loadingContainer.classList.add('hidden');
        canvas.classList.remove('hidden');
        
        // 创建图表
        const ctx = canvas.getContext('2d');
        
        // 销毁可能存在的旧图表
        if (window.mentalHealthChart) {
            window.mentalHealthChart.destroy();
        }
        
        window.mentalHealthChart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 1800,
                    easing: 'easeOutQuart',
                    tension: { value: 0.4, duration: 1500, easing: 'easeOutQuad', from: 0, to: 0.4, loop: false }
                },
                interaction: {
                    intersect: false,
                    mode: 'index',
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                size: 13,
                                weight: '500'
                            },
                            color: '#475569',
                            generateLabels: function(chart) {
                                const data = chart.data;
                                if (data.labels.length && data.datasets.length) {
                                    return data.datasets.map((dataset, i) => {
                                        const meta = chart.getDatasetMeta(i);
                                        return {
                                            text: dataset.label,
                                            fillStyle: dataset.pointBackgroundColor,
                                            strokeStyle: dataset.pointBackgroundColor,
                                            lineWidth: 2,
                                            pointStyle: 'circle',
                                            hidden: !meta.data.length || meta.hidden,
                                            index: i
                                        };
                                    });
                                }
                                return [];
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#1e293b',
                        bodyColor: '#475569',
                        borderColor: '#e2e8f0',
                        borderWidth: 1,
                        padding: 15,
                        displayColors: true,
                        usePointStyle: true,
                        callbacks: {
                            label: function(context) {
                                const value = context.parsed.y;
                                let trend = '';
                                if (context.dataIndex > 0) {
                                    const prevValue = context.dataset.data[context.dataIndex - 1];
                                    const change = value - prevValue;
                                    if (change > 0) {
                                        trend = ' <span style="color: #10b981;">↑+' + change + '</span>';
                                    } else if (change < 0) {
                                        trend = ' <span style="color: #ef4444;">↓'+ change + '</span>';
                                    }
                                }
                                return context.dataset.label + ': <strong>' + value + '</strong> 分' + trend;
                            }
                        },
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 13
                        },
                        boxPadding: 5
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 50,
                        max: 100,
                        ticks: {
                            stepSize: 10,
                            callback: function(value) {
                                return value + ' 分';
                            },
                            font: {
                                size: 11,
                                weight: '400'
                            },
                            color: '#64748b'
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)',
                            drawBorder: false,
                            drawTicks: false
                        },
                        border: {
                            display: false
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        border: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 11,
                                weight: '400'
                            },
                            color: '#64748b'
                        }
                    }
                },
                elements: {
                    line: {
                        tension: 0.4,
                        borderWidth: 3,
                        borderCapStyle: 'round',
                        borderJoinStyle: 'round'
                    },
                    point: {
                        hoverBackgroundColor: '#fff',
                        hoverBorderWidth: 3,
                        hoverBorderColor: function(context) {
                            return context.dataset.borderColor;
                        },
                        hitRadius: 10,
                        hoverRadius: 8
                    }
                },
                hover: {
                    animationDuration: 300
                }
            }
        });
        
    } catch (error) {
        console.error('初始化心理健康趋势图失败:', error);
        loadingContainer.classList.add('hidden');
        errorContainer.classList.remove('hidden');
        errorContainer.querySelector('p.text-gray-600').textContent = `数据加载失败: ${error.message}`;
    }
}

// 4. 改进的测评维度分析图表初始化函数
async function initAssessmentDimensionsChart() {
    const loadingContainer = document.getElementById('dimensionsChartLoader');
    const errorContainer = document.getElementById('dimensionsChartError');
    const canvas = document.getElementById('assessmentDimensionsChart');
    
    try {
        // 显示加载状态
        loadingContainer.classList.remove('hidden');
        canvas.classList.add('hidden');
        errorContainer.classList.add('hidden');
        
        // 模拟数据获取（实际应用中这里应该是API调用）
        const data = await retryWithBackoff(() => {
            // 模拟网络延迟
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    // 90%概率成功，10%概率失败，用于测试重试机制
                    if (Math.random() > 0.1) {
                        resolve({
                            labels: ['情绪健康', '压力管理', '人际关系', '性格特质', '心理健康总分'],
                            datasets: [
                                {
                                    label: '当前水平',
                                    data: [90, 75, 85, 78, 82],
                                    backgroundColor: 'rgba(99, 102, 241, 0.6)',
                                    borderColor: '#6366f1',
                                    borderWidth: 2,
                                    borderRadius: 6,
                                    borderSkipped: false
                                },
                                {
                                    label: '平均水平',
                                    data: [75, 65, 72, 70, 71],
                                    backgroundColor: 'rgba(139, 92, 246, 0.3)',
                                    borderColor: '#8b5cf6',
                                    borderWidth: 1,
                                    borderRadius: 4,
                                    borderSkipped: false
                                }
                            ]
                        });
                    } else {
                        reject(new Error('网络请求失败'));
                    }
                }, 600);
            });
        });
        
        // 隐藏加载状态，显示图表
        loadingContainer.classList.add('hidden');
        canvas.classList.remove('hidden');
        
        // 创建图表
        const ctx = canvas.getContext('2d');
        
        // 销毁可能存在的旧图表
        if (window.assessmentDimensionsChart) {
            window.assessmentDimensionsChart.destroy();
        }
        
        window.assessmentDimensionsChart = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 1500,
                    easing: 'easeOutQuart'
                },
                barPercentage: 0.6,
                categoryPercentage: 0.7,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                size: 12,
                                weight: '500'
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#1e293b',
                        bodyColor: '#475569',
                        borderColor: '#e2e8f0',
                        borderWidth: 1,
                        padding: 15,
                        displayColors: true,
                        usePointStyle: true,
                        callbacks: {
                            label: function(context) {
                                const value = context.parsed.y;
                                const isCurrent = context.datasetIndex === 0;
                                if (isCurrent) {
                                    const average = context.chart.data.datasets[1].data[context.dataIndex];
                                    const difference = value - average;
                                    let comparison = '';
                                    if (difference > 0) {
                                        comparison = ' (高于平均 ' + difference + ' 分)';
                                    } else if (difference < 0) {
                                        comparison = ' (低于平均 ' + Math.abs(difference) + ' 分)';
                                    }
                                    return context.dataset.label + ': ' + value + ' 分' + comparison;
                                }
                                return context.dataset.label + ': ' + value + ' 分';
                            }
                        },
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 13
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + ' 分';
                            },
                            font: {
                                size: 11
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        border: {
                            display: false
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        border: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 11
                            }
                        }
                    }
                }
            }
        });
        
    } catch (error) {
        console.error('初始化测评维度分析图表失败:', error);
        loadingContainer.classList.add('hidden');
        errorContainer.classList.remove('hidden');
        errorContainer.querySelector('p.text-gray-600').textContent = `数据加载失败: ${error.message}`;
    }
}

// 5. 新增测评类型分布饼图
async function initAssessmentTypeChart() {
    // 检查是否已有图表容器，如果没有则创建
    let chartContainer = document.getElementById('assessmentTypeChartContainer');
    let canvas;
    let loadingContainer;
    let errorContainer;
    
    if (!chartContainer) {
        // 找到合适的位置创建图表容器（在现有图表之后）
        const existingChartSection = document.querySelector('.grid.grid-cols-1.md\:grid-cols-2.gap-8');
        if (existingChartSection) {
            // 创建新的图表区域
            const newSection = document.createElement('div');
            newSection.className = 'mb-12';
            newSection.innerHTML = `
                <h2 class="text-2xl font-bold text-gray-800 mb-6">测评类型分布</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div class="profile-card">
                        <div id="assessmentTypeChartContainer" class="relative">
                            <div id="assessmentTypeChartLoader" class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
                                <div class="text-center">
                                    <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-primary mb-2"></div>
                                    <p class="text-gray-600">加载数据中...</p>
                                </div>
                            </div>
                            <div id="assessmentTypeChartError" class="hidden absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
                                <div class="text-center p-6">
                                    <i class="fa fa-exclamation-circle text-red-500 text-3xl mb-2"></i>
                                    <p class="text-gray-600 mb-4">数据加载失败</p>
                                    <button id="retryAssessmentTypeChart" class="primary-btn py-2 px-4">重试</button>
                                </div>
                            </div>
                            <div class="h-64">
                                <canvas id="assessmentTypeChart"></canvas>
                            </div>
                        </div>
                    </div>
                    <div class="profile-card">
                        <h3 class="text-lg font-semibold mb-4">测评分析</h3>
                        <div class="space-y-4">
                            <div class="p-4 bg-indigo-50 rounded-lg">
                                <div class="flex justify-between items-center mb-1">
                                    <span class="font-medium text-indigo-800">情绪健康类</span>
                                    <span class="text-indigo-800">40%</span>
                                </div>
                                <div class="w-full bg-indigo-200 rounded-full h-2">
                                    <div class="bg-indigo-600 h-2 rounded-full" style="width: 40%"></div>
                                </div>
                                <p class="text-xs text-indigo-700 mt-1">您最关注的测评类型</p>
                            </div>
                            <div class="p-4 bg-purple-50 rounded-lg">
                                <div class="flex justify-between items-center mb-1">
                                    <span class="font-medium text-purple-800">压力管理类</span>
                                    <span class="text-purple-800">25%</span>
                                </div>
                                <div class="w-full bg-purple-200 rounded-full h-2">
                                    <div class="bg-purple-600 h-2 rounded-full" style="width: 25%"></div>
                                </div>
                            </div>
                            <div class="p-4 bg-pink-50 rounded-lg">
                                <div class="flex justify-between items-center mb-1">
                                    <span class="font-medium text-pink-800">性格特质类</span>
                                    <span class="text-pink-800">20%</span>
                                </div>
                                <div class="w-full bg-pink-200 rounded-full h-2">
                                    <div class="bg-pink-600 h-2 rounded-full" style="width: 20%"></div>
                                </div>
                            </div>
                            <div class="p-4 bg-green-50 rounded-lg">
                                <div class="flex justify-between items-center mb-1">
                                    <span class="font-medium text-green-800">人际关系类</span>
                                    <span class="text-green-800">15%</span>
                                </div>
                                <div class="w-full bg-green-200 rounded-full h-2">
                                    <div class="bg-green-600 h-2 rounded-full" style="width: 15%"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            // 插入到现有图表区域之后
            existingChartSection.parentNode.insertBefore(newSection, existingChartSection.nextSibling);
            
            chartContainer = document.getElementById('assessmentTypeChartContainer');
            canvas = document.getElementById('assessmentTypeChart');
            loadingContainer = document.getElementById('assessmentTypeChartLoader');
            errorContainer = document.getElementById('assessmentTypeChartError');
            
            // 添加重试按钮事件监听
            document.getElementById('retryAssessmentTypeChart').addEventListener('click', initAssessmentTypeChart);
        }
    }
    
    if (!canvas) return;
    
    try {
        // 显示加载状态
        loadingContainer.classList.remove('hidden');
        canvas.classList.add('hidden');
        errorContainer.classList.add('hidden');
        
        // 模拟数据获取
        const data = await retryWithBackoff(() => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (Math.random() > 0.1) {
                        resolve({
                            labels: ['情绪健康类', '压力管理类', '性格特质类', '人际关系类'],
                            datasets: [{
                                data: [4, 2.5, 2, 1.5],
                                backgroundColor: [
                                    '#6366f1', // indigo
                                    '#8b5cf6', // purple
                                    '#ec4899', // pink
                                    '#10b981'  // green
                                ],
                                borderWidth: 3,
                                borderColor: '#ffffff'
                            }]
                        });
                    } else {
                        reject(new Error('网络请求失败'));
                    }
                }, 500);
            });
        });
        
        // 隐藏加载状态，显示图表
        loadingContainer.classList.add('hidden');
        canvas.classList.remove('hidden');
        
        // 销毁可能存在的旧图表
        if (window.assessmentTypeChart) {
            window.assessmentTypeChart.destroy();
        }
        
        // 创建图表
        window.assessmentTypeChart = new Chart(canvas, {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    animateRotate: true,
                    animateScale: true,
                    duration: 1500,
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
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#1e293b',
                        bodyColor: '#475569',
                        borderColor: '#e2e8f0',
                        borderWidth: 1,
                        padding: 15,
                        displayColors: true,
                        usePointStyle: true,
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${value} 次 (${percentage}%)`;
                            }
                        },
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 13
                        }
                    }
                },
                cutout: '65%',
                elements: {
                    arc: {
                        borderWidth: 3
                    }
                }
            }
        });
        
    } catch (error) {
        console.error('初始化测评类型分布图失败:', error);
        loadingContainer.classList.add('hidden');
        errorContainer.classList.remove('hidden');
        errorContainer.querySelector('p.text-gray-600').textContent = `数据加载失败: ${error.message}`;
    }
}

// 6. 新增测评分数散点图
async function initAssessmentScoreScatterChart() {
    // 检查是否已有图表容器，如果没有则创建
    let chartContainer = document.getElementById('assessmentScoreScatterChartContainer');
    let canvas;
    let loadingContainer;
    let errorContainer;
    
    if (!chartContainer) {
        // 找到合适的位置创建图表容器（在测评类型分布之后）
        const typeChartSection = document.querySelector('#assessmentTypeChartContainer')?.closest('div.mb-12');
        if (typeChartSection) {
            // 创建新的图表区域
            const newSection = document.createElement('div');
            newSection.className = 'mb-12';
            newSection.innerHTML = `
                <h2 class="text-2xl font-bold text-gray-800 mb-6">测评分数趋势分析</h2>
                <div class="profile-card">
                    <div id="assessmentScoreScatterChartContainer" class="relative">
                        <div id="assessmentScoreScatterChartLoader" class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
                            <div class="text-center">
                                <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-primary mb-2"></div>
                                <p class="text-gray-600">加载数据中...</p>
                            </div>
                        </div>
                        <div id="assessmentScoreScatterChartError" class="hidden absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
                            <div class="text-center p-6">
                                <i class="fa fa-exclamation-circle text-red-500 text-3xl mb-2"></i>
                                <p class="text-gray-600 mb-4">数据加载失败</p>
                                <button id="retryAssessmentScoreScatterChart" class="primary-btn py-2 px-4">重试</button>
                            </div>
                        </div>
                        <div class="h-80">
                            <canvas id="assessmentScoreScatterChart"></canvas>
                        </div>
                    </div>
                </div>
            `;
            // 插入到测评类型分布区域之后
            typeChartSection.parentNode.insertBefore(newSection, typeChartSection.nextSibling);
            
            chartContainer = document.getElementById('assessmentScoreScatterChartContainer');
            canvas = document.getElementById('assessmentScoreScatterChart');
            loadingContainer = document.getElementById('assessmentScoreScatterChartLoader');
            errorContainer = document.getElementById('assessmentScoreScatterChartError');
            
            // 添加重试按钮事件监听
            document.getElementById('retryAssessmentScoreScatterChart').addEventListener('click', initAssessmentScoreScatterChart);
        }
    }
    
    if (!canvas) return;
    
    try {
        // 显示加载状态
        loadingContainer.classList.remove('hidden');
        canvas.classList.add('hidden');
        errorContainer.classList.add('hidden');
        
        // 模拟数据获取
        const data = await retryWithBackoff(() => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (Math.random() > 0.1) {
                        resolve({
                            datasets: [
                                {
                                    label: '情绪健康类',
                                    data: [
                                        { x: '2025-08', y: 75 },
                                        { x: '2025-09', y: 80 },
                                        { x: '2025-10', y: 82 },
                                        { x: '2025-11', y: 90 }
                                    ],
                                    backgroundColor: 'rgba(99, 102, 241, 0.8)',
                                    borderColor: '#6366f1',
                                    borderWidth: 2,
                                    pointRadius: 8,
                                    pointHoverRadius: 10
                                },
                                {
                                    label: '压力管理类',
                                    data: [
                                        { x: '2025-08', y: 65 },
                                        { x: '2025-09', y: 68 },
                                        { x: '2025-10', y: 70 },
                                        { x: '2025-11', y: 75 }
                                    ],
                                    backgroundColor: 'rgba(139, 92, 246, 0.8)',
                                    borderColor: '#8b5cf6',
                                    borderWidth: 2,
                                    pointRadius: 8,
                                    pointHoverRadius: 10
                                },
                                {
                                    label: '人际关系类',
                                    data: [
                                        { x: '2025-08', y: 80 },
                                        { x: '2025-09', y: 82 },
                                        { x: '2025-10', y: 83 },
                                        { x: '2025-11', y: 85 }
                                    ],
                                    backgroundColor: 'rgba(16, 185, 129, 0.8)',
                                    borderColor: '#10b981',
                                    borderWidth: 2,
                                    pointRadius: 8,
                                    pointHoverRadius: 10
                                }
                            ]
                        });
                    } else {
                        reject(new Error('网络请求失败'));
                    }
                }, 700);
            });
        });
        
        // 隐藏加载状态，显示图表
        loadingContainer.classList.add('hidden');
        canvas.classList.remove('hidden');
        
        // 销毁可能存在的旧图表
        if (window.assessmentScoreScatterChart) {
            window.assessmentScoreScatterChart.destroy();
        }
        
        // 创建图表
        window.assessmentScoreScatterChart = new Chart(canvas, {
            type: 'scatter',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 1500,
                    easing: 'easeOutQuart'
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                size: 12,
                                weight: '500'
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#1e293b',
                        bodyColor: '#475569',
                        borderColor: '#e2e8f0',
                        borderWidth: 1,
                        padding: 15,
                        displayColors: true,
                        usePointStyle: true,
                        callbacks: {
                            title: function(tooltipItems) {
                                return tooltipItems[0].parsed.x;
                            },
                            label: function(context) {
                                return context.dataset.label + ': ' + context.parsed.y + ' 分';
                            }
                        },
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 13
                        }
                    }
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        beginAtZero: false,
                        min: 50,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + ' 分';
                            },
                            font: {
                                size: 11
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        border: {
                            display: false
                        }
                    },
                    x: {
                        type: 'category',
                        display: true,
                        grid: {
                            display: false
                        },
                        border: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 11
                            }
                        }
                    }
                },
                elements: {
                    point: {
                        hoverBackgroundColor: '#fff',
                        hoverBorderWidth: 3,
                        hitRadius: 15
                    }
                }
            }
        });
        
    } catch (error) {
        console.error('初始化测评分数散点图失败:', error);
        loadingContainer.classList.add('hidden');
        errorContainer.classList.remove('hidden');
        errorContainer.querySelector('p.text-gray-600').textContent = `数据加载失败: ${error.message}`;
    }
}

// 7. 新增详细测评建议区域
function createDetailedAssessmentRecommendations() {
    // 找到合适的位置创建建议区域
    const scatterChartSection = document.querySelector('#assessmentScoreScatterChartContainer')?.closest('div.mb-12');
    
    if (scatterChartSection) {
        // 创建建议区域
        const recommendationsSection = document.createElement('div');
        recommendationsSection.className = 'mb-12';
        recommendationsSection.innerHTML = `
            <h2 class="text-2xl font-bold text-gray-800 mb-6">个性化测评建议</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- 情绪健康建议 -->
                <div class="profile-card bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200">
                    <div class="flex items-start">
                        <div class="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white mr-4 flex-shrink-0">
                            <i class="fas fa-heart"></i>
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold text-indigo-800 mb-2">情绪健康提升</h3>
                            <ul class="space-y-2 text-gray-700">
                                <li class="flex items-start">
                                    <i class="fas fa-check-circle text-indigo-600 mt-1 mr-2 text-sm"></i>
                                    <span>继续保持当前的积极心态和情绪管理策略</span>
                                </li>
                                <li class="flex items-start">
                                    <i class="fas fa-check-circle text-indigo-600 mt-1 mr-2 text-sm"></i>
                                    <span>每周进行3-5次的情绪日记记录</span>
                                </li>
                                <li class="flex items-start">
                                    <i class="fas fa-check-circle text-indigo-600 mt-1 mr-2 text-sm"></i>
                                    <span>建议尝试更多冥想放松类活动</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <!-- 压力管理建议 -->
                <div class="profile-card bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
                    <div class="flex items-start">
                        <div class="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white mr-4 flex-shrink-0">
                            <i class="fas fa-tachometer-alt"></i>
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold text-purple-800 mb-2">压力管理优化</h3>
                            <ul class="space-y-2 text-gray-700">
                                <li class="flex items-start">
                                    <i class="fas fa-exclamation-triangle text-amber-500 mt-1 mr-2 text-sm"></i>
                                    <span>建议增加压力管理类测评频率</span>
                                </li>
                                <li class="flex items-start">
                                    <i class="fas fa-check-circle text-purple-600 mt-1 mr-2 text-sm"></i>
                                    <span>学习深呼吸和渐进式肌肉放松技巧</span>
                                </li>
                                <li class="flex items-start">
                                    <i class="fas fa-check-circle text-purple-600 mt-1 mr-2 text-sm"></i>
                                    <span>建立健康的作息时间表，保证充足睡眠</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <!-- 人际关系建议 -->
                <div class="profile-card bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
                    <div class="flex items-start">
                        <div class="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white mr-4 flex-shrink-0">
                            <i class="fas fa-users"></i>
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold text-green-800 mb-2">人际关系增强</h3>
                            <ul class="space-y-2 text-gray-700">
                                <li class="flex items-start">
                                    <i class="fas fa-check-circle text-green-600 mt-1 mr-2 text-sm"></i>
                                    <span>保持良好的沟通习惯和社交互动</span>
                                </li>
                                <li class="flex items-start">
                                    <i class="fas fa-check-circle text-green-600 mt-1 mr-2 text-sm"></i>
                                    <span>尝试参加更多团体心理辅导活动</span>
                                </li>
                                <li class="flex items-start">
                                    <i class="fas fa-check-circle text-green-600 mt-1 mr-2 text-sm"></i>
                                    <span>定期与亲友进行深度交流</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // 插入到散点图区域之后
        scatterChartSection.parentNode.insertBefore(recommendationsSection, scatterChartSection.nextSibling);
    }
}

// 8. 响应式图表重绘
const resizeChart = debounce(() => {
    if (window.mentalHealthChart) {
        window.mentalHealthChart.resize();
    }
    if (window.assessmentDimensionsChart) {
        window.assessmentDimensionsChart.resize();
    }
    if (window.assessmentTypeChart) {
        window.assessmentTypeChart.resize();
    }
    if (window.assessmentScoreScatterChart) {
        window.assessmentScoreScatterChart.resize();
    }
}, 200);

// 9. 添加窗口大小变化事件监听
window.addEventListener('resize', resizeChart);

// 10. 更新DOMContentLoaded中图表初始化逻辑
document.addEventListener('DOMContentLoaded', function() {
    // 保护页面，需要登录才能访问
    protectPage();
    
    // 初始化所有图表
    initMentalHealthChart();
    initAssessmentDimensionsChart();
    // 添加新图表初始化
    initAssessmentTypeChart();
    initAssessmentScoreScatterChart();
    // 创建详细测评建议
    createDetailedAssessmentRecommendations();
    
    // 添加重试按钮事件监听器
    document.getElementById('retryMentalHealthChart')?.addEventListener('click', initMentalHealthChart);
    document.getElementById('retryDimensionsChart')?.addEventListener('click', initAssessmentDimensionsChart);
    
    // 筛选按钮点击事件（保留原有功能）
    const filterButtons = document.querySelectorAll('.flex-wrap button');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有按钮的活跃状态
            filterButtons.forEach(btn => {
                btn.classList.remove('bg-primary', 'text-white');
                btn.classList.add('bg-gray-100', 'text-dark');
            });
            
            // 添加当前按钮的活跃状态
            this.classList.remove('bg-gray-100', 'text-dark');
            this.classList.add('bg-primary', 'text-white');
            
            // 这里可以添加实际的筛选逻辑
            const filter = this.textContent.trim();
            console.log('筛选:', filter);
            
            // 模拟筛选效果
            const assessmentRows = document.querySelectorAll('tbody tr');
            assessmentRows.forEach(row => {
                if (filter === '全部') {
                    row.style.display = 'table-row';
                } else if (filter.includes('情绪')) {
                    // 显示情绪健康类测评
                    const title = row.querySelector('.text-sm.font-medium.text-gray-900').textContent;
                    if (title.includes('情绪')) {
                        row.style.display = 'table-row';
                    } else {
                        row.style.display = 'none';
                    }
                } else if (filter.includes('压力')) {
                    // 显示压力水平类测评
                    const title = row.querySelector('.text-sm.font-medium.text-gray-900').textContent;
                    if (title.includes('压力')) {
                        row.style.display = 'table-row';
                    } else {
                        row.style.display = 'none';
                    }
                } else if (filter.includes('性格')) {
                    // 显示性格特质类测评
                    const title = row.querySelector('.text-sm.font-medium.text-gray-900').textContent;
                    if (title.includes('性格')) {
                        row.style.display = 'table-row';
                    } else {
                        row.style.display = 'none';
                    }
                }
            });
        });
    });
    
    // 分页按钮点击事件（保留原有功能）
    const pageButtons = document.querySelectorAll('.flex.space-x-2 button:not(:disabled)');
    pageButtons.forEach(button => {
        if (!button.disabled) {
            button.addEventListener('click', function() {
                // 添加点击动画效果
                this.classList.add('scale-95');
                setTimeout(() => {
                    this.classList.remove('scale-95');
                }, 150);
            });
        }
    });
});