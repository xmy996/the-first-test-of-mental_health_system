// 心理健康趋势分析增强版
// 提供全面的心理健康数据分析、可视化和评估功能

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

// 3. 数据处理与分析工具函数
class MentalHealthDataAnalyzer {
    // 生成连续的时间序列数据
    static generateContinuousTimeSeries(baseData, startDate, endDate, frequency = 'monthly') {
        const result = [];
        const current = new Date(startDate);
        const end = new Date(endDate);
        
        // 将基础数据转换为日期映射
        const dataMap = new Map();
        baseData.forEach(item => {
            dataMap.set(item.date, item.value);
        });
        
        while (current <= end) {
            const dateKey = current.toISOString().slice(0, 7); // YYYY-MM 格式
            let value;
            
            if (dataMap.has(dateKey)) {
                value = dataMap.get(dateKey);
            } else {
                // 如果没有数据，进行插值
                value = this.interpolateValue(result, dateKey);
            }
            
            result.push({
                date: dateKey,
                value: value,
                original: dataMap.has(dateKey)
            });
            
            // 增加时间
            if (frequency === 'monthly') {
                current.setMonth(current.getMonth() + 1);
            } else if (frequency === 'weekly') {
                current.setDate(current.getDate() + 7);
            }
        }
        
        return result;
    }
    
    // 线性插值
    static interpolateValue(existingData, targetDate) {
        if (existingData.length === 0) return 75; // 默认值
        
        // 查找目标日期前后最近的数据点
        let before = null;
        let after = null;
        
        for (let i = 0; i < existingData.length; i++) {
            if (existingData[i].date < targetDate) {
                before = existingData[i];
            } else if (existingData[i].date > targetDate) {
                after = existingData[i];
                break;
            }
        }
        
        // 如果只有前面的数据，使用最后一个值
        if (before && !after) {
            return before.value;
        }
        
        // 如果只有后面的数据，使用第一个值
        if (!before && after) {
            return after.value;
        }
        
        // 如果都没有，使用默认值
        if (!before && !after) {
            return 75;
        }
        
        // 线性插值
        const beforeDate = new Date(before.date + '-01');
        const afterDate = new Date(after.date + '-01');
        const targetDateObj = new Date(targetDate + '-01');
        
        const totalDays = (afterDate - beforeDate) / (1000 * 60 * 60 * 24);
        const daysFromBefore = (targetDateObj - beforeDate) / (1000 * 60 * 60 * 24);
        
        return Math.round(before.value + (after.value - before.value) * (daysFromBefore / totalDays));
    }
    
    // 计算维度间的相关性
    static calculateCorrelation(data1, data2) {
        if (data1.length !== data2.length) {
            throw new Error('数据集长度不匹配');
        }
        
        const n = data1.length;
        let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;
        
        for (let i = 0; i < n; i++) {
            sumX += data1[i];
            sumY += data2[i];
            sumXY += data1[i] * data2[i];
            sumX2 += data1[i] * data1[i];
            sumY2 += data2[i] * data2[i];
        }
        
        const numerator = n * sumXY - sumX * sumY;
        const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
        
        if (denominator === 0) return 0;
        
        return numerator / denominator;
    }
    
    // 计算变化趋势
    static calculateTrend(data) {
        if (data.length < 2) return 0;
        
        const n = data.length;
        const last = data[n - 1].value;
        const first = data[0].value;
        const totalChange = last - first;
        
        return totalChange / n; // 平均每月变化
    }
    
    // 计算波动性
    static calculateVolatility(data) {
        if (data.length < 2) return 0;
        
        const values = data.map(d => d.value);
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
        
        return Math.sqrt(variance);
    }
    
    // 生成综合评估结论
    static generateAssessmentConclusion(overallData, dimensionData) {
        const conclusion = {
            overallStatus: '',
            trendDescription: '',
            strengths: [],
            weaknesses: [],
            keyFindings: [],
            recommendations: []
        };
        
        // 计算整体状态
        const latestOverall = overallData[overallData.length - 1]?.value || 0;
        if (latestOverall >= 85) {
            conclusion.overallStatus = '优秀';
        } else if (latestOverall >= 70) {
            conclusion.overallStatus = '良好';
        } else if (latestOverall >= 55) {
            conclusion.overallStatus = '一般';
        } else {
            conclusion.overallStatus = '需要关注';
        }
        
        // 计算整体趋势
        const overallTrend = this.calculateTrend(overallData);
        if (overallTrend > 2) {
            conclusion.trendDescription = '显著上升';
        } else if (overallTrend > 0) {
            conclusion.trendDescription = '稳步上升';
        } else if (overallTrend > -2) {
            conclusion.trendDescription = '相对稳定';
        } else {
            conclusion.trendDescription = '有所下降';
        }
        
        // 识别优势和劣势维度
        dimensionData.forEach(dim => {
            if (dim.value >= 85) {
                conclusion.strengths.push(dim.name);
            } else if (dim.value < 60) {
                conclusion.weaknesses.push(dim.name);
            }
        });
        
        // 分析维度关联性
        if (dimensionData.length >= 4) {
            const emotionalIndex = dimensionData.findIndex(d => d.name.includes('情绪'));
            const pressureIndex = dimensionData.findIndex(d => d.name.includes('压力'));
            const sleepIndex = dimensionData.findIndex(d => d.name.includes('睡眠'));
            const socialIndex = dimensionData.findIndex(d => d.name.includes('社交'));
            
            if (emotionalIndex >= 0 && pressureIndex >= 0) {
                // 这里应该使用实际的时序数据计算相关性
                // 为简化，使用当前值的差异作为示例
                const emotionalValue = dimensionData[emotionalIndex].value;
                const pressureValue = dimensionData[pressureIndex].value;
                
                if (Math.abs(emotionalValue - pressureValue) > 25) {
                    conclusion.keyFindings.push('情绪健康与压力管理水平差异较大，建议关注两者的平衡');
                }
            }
            
            if (sleepIndex >= 0 && emotionalIndex >= 0) {
                const sleepValue = dimensionData[sleepIndex].value;
                const emotionalValue = dimensionData[emotionalIndex].value;
                
                if (sleepValue < 65 && emotionalValue < 75) {
                    conclusion.keyFindings.push('睡眠质量可能是影响情绪健康的重要因素');
                }
            }
        }
        
        // 生成建议
        if (conclusion.weaknesses.length > 0) {
            conclusion.recommendations.push(`重点关注以下维度的改善: ${conclusion.weaknesses.join('、')}`);
        }
        
        if (overallTrend < 0) {
            conclusion.recommendations.push('建议增加测评频率，密切关注心理健康状况变化');
        }
        
        if (conclusion.strengths.length > 0) {
            conclusion.recommendations.push(`继续保持在 ${conclusion.strengths.join('、')} 方面的良好状态`);
        }
        
        conclusion.recommendations.push('建议结合专业心理咨询，制定个性化的心理健康提升计划');
        
        return conclusion;
    }
}

// 4. 增强版心理健康趋势图
async function initEnhancedMentalHealthTrendChart() {
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
        
        // 获取完整的历史数据
        const rawData = await retryWithBackoff(() => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    // 模拟更完整的历史数据，包含更多维度和更长时间跨度
                    const startDate = '2025-06';
                    const endDate = '2025-11';
                    
                    // 基础数据点
                    const emotionalBaseData = [
                        { date: '2025-06', value: 70 },
                        { date: '2025-08', value: 75 },
                        { date: '2025-09', value: 80 },
                        { date: '2025-11', value: 90 }
                    ];
                    
                    const pressureBaseData = [
                        { date: '2025-06', value: 68 },
                        { date: '2025-08', value: 65 },
                        { date: '2025-09', value: 68 },
                        { date: '2025-11', value: 75 }
                    ];
                    
                    const sleepBaseData = [
                        { date: '2025-06', value: 72 },
                        { date: '2025-08', value: 76 },
                        { date: '2025-10', value: 82 },
                        { date: '2025-11', value: 85 }
                    ];
                    
                    const socialBaseData = [
                        { date: '2025-06', value: 78 },
                        { date: '2025-07', value: 80 },
                        { date: '2025-09', value: 82 },
                        { date: '2025-11', value: 85 }
                    ];
                    
                    // 生成连续的数据
                    const continuousEmotionalData = MentalHealthDataAnalyzer.generateContinuousTimeSeries(
                        emotionalBaseData, startDate, endDate
                    );
                    
                    const continuousPressureData = MentalHealthDataAnalyzer.generateContinuousTimeSeries(
                        pressureBaseData, startDate, endDate
                    );
                    
                    const continuousSleepData = MentalHealthDataAnalyzer.generateContinuousTimeSeries(
                        sleepBaseData, startDate, endDate
                    );
                    
                    const continuousSocialData = MentalHealthDataAnalyzer.generateContinuousTimeSeries(
                        socialBaseData, startDate, endDate
                    );
                    
                    // 计算总体健康指数（简化为各维度平均值）
                    const overallData = [];
                    for (let i = 0; i < continuousEmotionalData.length; i++) {
                        const overall = (
                            continuousEmotionalData[i].value + 
                            continuousPressureData[i].value + 
                            continuousSleepData[i].value + 
                            continuousSocialData[i].value
                        ) / 4;
                        
                        overallData.push({
                            date: continuousEmotionalData[i].date,
                            value: Math.round(overall),
                            original: continuousEmotionalData[i].original && 
                                     continuousPressureData[i].original && 
                                     continuousSleepData[i].original && 
                                     continuousSocialData[i].original
                        });
                    }
                    
                    resolve({
                        labels: continuousEmotionalData.map(d => d.date),
                        datasets: [
                            {
                                label: '总体健康指数',
                                data: overallData.map(d => d.value),
                                borderColor: '#4f46e5',
                                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                                tension: 0.4,
                                fill: true,
                                pointBackgroundColor: '#4f46e5',
                                pointBorderColor: '#fff',
                                pointBorderWidth: 2,
                                pointRadius: 6,
                                pointHoverRadius: 8,
                                priority: 1 // 最高优先级
                            },
                            {
                                label: '情绪健康指数',
                                data: continuousEmotionalData.map(d => d.value),
                                borderColor: '#6366f1',
                                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                tension: 0.4,
                                fill: true,
                                pointBackgroundColor: '#6366f1',
                                pointBorderColor: '#fff',
                                pointBorderWidth: 2,
                                pointRadius: 5,
                                pointHoverRadius: 7
                            },
                            {
                                label: '压力管理指数',
                                data: continuousPressureData.map(d => d.value),
                                borderColor: '#ec4899',
                                backgroundColor: 'rgba(236, 72, 153, 0.1)',
                                tension: 0.4,
                                fill: true,
                                pointBackgroundColor: '#ec4899',
                                pointBorderColor: '#fff',
                                pointBorderWidth: 2,
                                pointRadius: 5,
                                pointHoverRadius: 7
                            },
                            {
                                label: '睡眠质量指数',
                                data: continuousSleepData.map(d => d.value),
                                borderColor: '#10b981',
                                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                tension: 0.4,
                                fill: true,
                                pointBackgroundColor: '#10b981',
                                pointBorderColor: '#fff',
                                pointBorderWidth: 2,
                                pointRadius: 5,
                                pointHoverRadius: 7
                            },
                            {
                                label: '社交功能指数',
                                data: continuousSocialData.map(d => d.value),
                                borderColor: '#f59e0b',
                                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                                tension: 0.4,
                                fill: true,
                                pointBackgroundColor: '#f59e0b',
                                pointBorderColor: '#fff',
                                pointBorderWidth: 2,
                                pointRadius: 5,
                                pointHoverRadius: 7
                            }
                        ]
                    });
                }, 600);
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
            data: rawData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 1800,
                    easing: 'easeOutQuart',
                    tension: { 
                        value: 0.4, 
                        duration: 1500, 
                        easing: 'easeOutQuad', 
                        from: 0, 
                        to: 0.4, 
                        loop: false 
                    }
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
                            color: '#475569'
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
                                
                                // 添加评级
                                let rating = '';
                                if (value >= 85) {
                                    rating = ' <span style="color: #10b981; font-weight: bold;">(优秀)</span>';
                                } else if (value >= 70) {
                                    rating = ' <span style="color: #f59e0b; font-weight: bold;">(良好)</span>';
                                } else if (value >= 55) {
                                    rating = ' <span style="color: #f97316; font-weight: bold;">(一般)</span>';
                                } else {
                                    rating = ' <span style="color: #ef4444; font-weight: bold;">(需关注)</span>';
                                }
                                
                                return context.dataset.label + ': <strong>' + value + '</strong> 分' + trend + rating;
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
                    },
                    // 添加趋势分析插件
                    annotation: {
                        annotations: {
                            trendLine: {
                                type: 'line',
                                yMin: 70,
                                yMax: 70,
                                borderColor: 'rgba(236, 72, 153, 0.5)',
                                borderWidth: 2,
                                borderDash: [5, 5],
                                label: {
                                    content: '良好基准线',
                                    enabled: true,
                                    position: 'end'
                                }
                            }
                        }
                    }
                },
                scales: {
                    y: {
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
        console.error('初始化增强版心理健康趋势图失败:', error);
        loadingContainer.classList.add('hidden');
        errorContainer.classList.remove('hidden');
        errorContainer.querySelector('p.text-gray-600').textContent = `数据加载失败: ${error.message}`;
    }
}

// 5. 增强版测评维度分析图
async function initEnhancedAssessmentDimensionsChart() {
    const loadingContainer = document.getElementById('dimensionsChartLoader');
    const errorContainer = document.getElementById('dimensionsChartError');
    const canvas = document.getElementById('assessmentDimensionsChart');
    
    try {
        // 显示加载状态
        loadingContainer.classList.remove('hidden');
        canvas.classList.add('hidden');
        errorContainer.classList.add('hidden');
        
        // 获取详细的维度数据
        const data = await retryWithBackoff(() => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        labels: ['情绪健康', '压力管理', '睡眠质量', '社交功能', '心理韧性'],
                        datasets: [
                            {
                                label: '当前水平',
                                data: [90, 75, 85, 85, 88],
                                backgroundColor: 'rgba(99, 102, 241, 0.7)',
                                borderColor: '#6366f1',
                                borderWidth: 2,
                                borderRadius: 6,
                                borderSkipped: false
                            },
                            {
                                label: '上月水平',
                                data: [82, 70, 76, 83, 82],
                                backgroundColor: 'rgba(139, 92, 246, 0.5)',
                                borderColor: '#8b5cf6',
                                borderWidth: 2,
                                borderRadius: 6,
                                borderSkipped: false
                            },
                            {
                                label: '平均水平',
                                data: [75, 65, 72, 72, 70],
                                backgroundColor: 'rgba(209, 213, 219, 0.5)',
                                borderColor: '#d1d5db',
                                borderWidth: 1,
                                borderRadius: 4,
                                borderSkipped: false
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
                                const label = context.dataset.label;
                                
                                if (label === '当前水平') {
                                    // 与上月比较
                                    const lastMonth = context.chart.data.datasets[1].data[context.dataIndex];
                                    const avgLevel = context.chart.data.datasets[2].data[context.dataIndex];
                                    
                                    let monthChange = '';
                                    let avgComparison = '';
                                    
                                    if (value > lastMonth) {
                                        monthChange = ` (较上月 ↑+${value - lastMonth})`;
                                    } else if (value < lastMonth) {
                                        monthChange = ` (较上月 ↓${value - lastMonth})`;
                                    }
                                    
                                    if (value > avgLevel) {
                                        avgComparison = ` (高于平均 ${value - avgLevel} 分)`;
                                    } else if (value < avgLevel) {
                                        avgComparison = ` (低于平均 ${Math.abs(value - avgLevel)} 分)`;
                                    }
                                    
                                    return `${label}: ${value} 分${monthChange}${avgComparison}`;
                                }
                                
                                return `${label}: ${value} 分`;
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
        
        // 生成维度分析结论
        generateDimensionAnalysisInsights(data);
        
    } catch (error) {
        console.error('初始化增强版测评维度分析图表失败:', error);
        loadingContainer.classList.add('hidden');
        errorContainer.classList.remove('hidden');
        errorContainer.querySelector('p.text-gray-600').textContent = `数据加载失败: ${error.message}`;
    }
}

// 6. 维度分析洞察生成
function generateDimensionAnalysisInsights(data) {
    // 查找或创建洞察区域
    let insightsContainer = document.querySelector('.profile-card .space-y-4');
    if (!insightsContainer) {
        // 如果不存在，创建一个新的区域
        const dimensionsSection = document.querySelector('.grid.grid-cols-1.lg\:grid-cols-2.gap-6');
        if (dimensionsSection) {
            const insightsCard = document.createElement('div');
            insightsCard.className = 'profile-card transform hover:shadow-lg transition-all duration-300';
            insightsCard.innerHTML = `
                <h3 class="font-semibold mb-4">维度深度分析</h3>
                <div class="space-y-4" id="dimension-insights">
                    <!-- 这里将动态生成分析洞察 -->
                </div>
            `;
            dimensionsSection.appendChild(insightsCard);
            insightsContainer = document.getElementById('dimension-insights');
        }
    }
    
    if (!insightsContainer) return;
    
    // 清空现有内容
    insightsContainer.innerHTML = '';
    
    // 获取数据
    const labels = data.labels;
    const currentData = data.datasets[0].data;
    const lastMonthData = data.datasets[1].data;
    const avgData = data.datasets[2].data;
    
    // 生成每个维度的洞察
    labels.forEach((label, index) => {
        const current = currentData[index];
        const lastMonth = lastMonthData[index];
        const avg = avgData[index];
        
        let iconClass = 'fa-check-circle text-success';
        let titleClass = 'font-medium';
        let insightText = '';
        
        // 判断状态和生成洞察
        if (current >= 85) {
            iconClass = 'fa-trophy text-primary';
            insightText = `您在${label}方面表现优秀，显著高于平均水平。`;
        } else if (current >= 70) {
            iconClass = 'fa-check-circle text-success';
            insightText = `您在${label}方面表现良好，处于健康水平。`;
        } else if (current >= 60) {
            iconClass = 'fa-exclamation-circle text-warning';
            titleClass += ' text-warning';
            insightText = `您在${label}方面表现一般，有提升空间。`;
        } else {
            iconClass = 'fa-exclamation-triangle text-danger';
            titleClass += ' text-danger';
            insightText = `您在${label}方面需要特别关注和改善。`;
        }
        
        // 添加变化趋势
        if (current > lastMonth + 5) {
            insightText += ` 最近一个月有显著提升，继续保持！`;
        } else if (current < lastMonth - 5) {
            insightText += ` 最近一个月有所下降，建议关注相关影响因素。`;
        }
        
        // 创建洞察项
        const insightItem = document.createElement('div');
        insightItem.className = 'flex items-start';
        insightItem.innerHTML = `
            <i class="fa ${iconClass} mt-1 mr-2"></i>
            <div>
                <span class="${titleClass}">${label}</span>
                <p class="text-sm text-gray-600">${insightText}</p>
            </div>
        `;
        
        insightsContainer.appendChild(insightItem);
    });
}

// 7. 新增维度关联性分析图表
async function initDimensionsCorrelationChart() {
    // 检查是否已有图表容器，如果没有则创建
    let chartContainer = document.getElementById('dimensionsCorrelationChartContainer');
    let canvas;
    let loadingContainer;
    let errorContainer;
    
    if (!chartContainer) {
        // 找到合适的位置创建图表容器（在测评维度分析之后）
        const dimensionsChartSection = document.querySelector('#assessmentDimensionsChart')?.closest('section');
        if (dimensionsChartSection) {
            // 创建新的图表区域
            const newSection = document.createElement('section');
            newSection.className = 'mb-8';
            newSection.innerHTML = `
                <h2 class="text-xl font-bold text-gray-800 mb-4">维度关联性分析</h2>
                <div class="profile-card transform hover:shadow-lg transition-all duration-300">
                    <div id="dimensionsCorrelationChartContainer" class="relative">
                        <div id="dimensionsCorrelationChartLoader" class="absolute inset-0 flex items-center justify-center bg-white/80 z-10 hidden">
                            <div class="flex flex-col items-center">
                                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-3"></div>
                                <p class="text-gray-600">加载中...</p>
                            </div>
                        </div>
                        <div id="dimensionsCorrelationChartError" class="absolute inset-0 flex items-center justify-center bg-white/80 z-10 hidden">
                            <div class="text-center p-4">
                                <i class="fa fa-exclamation-triangle text-4xl text-warning mb-3"></i>
                                <p class="text-gray-600 mb-2">数据加载失败</p>
                                <button id="retryDimensionsCorrelationChart" class="primary-btn py-1 px-4 text-sm">重试</button>
                            </div>
                        </div>
                        <div class="h-80">
                            <canvas id="dimensionsCorrelationChart"></canvas>
                        </div>
                    </div>
                    <div class="p-4 bg-blue-50 border-l-4 border-primary mt-4 rounded">
                        <h3 class="font-medium text-primary mb-2">关联性分析说明</h3>
                        <p class="text-sm text-gray-700">
                            关联性分析展示了不同心理健康维度之间的相互影响关系。数值越接近1，表示两个维度正相关程度越高；
                            数值越接近-1，表示负相关程度越高；接近0表示相关性较弱。
                        </p>
                    </div>
                </div>
            `;
            
            // 插入到现有图表区域之后
            dimensionsChartSection.parentNode.insertBefore(newSection, dimensionsChartSection.nextSibling);
            
            chartContainer = document.getElementById('dimensionsCorrelationChartContainer');
            canvas = document.getElementById('dimensionsCorrelationChart');
            loadingContainer = document.getElementById('dimensionsCorrelationChartLoader');
            errorContainer = document.getElementById('dimensionsCorrelationChartError');
            
            // 添加重试按钮事件监听
            document.getElementById('retryDimensionsCorrelationChart')?.addEventListener('click', initDimensionsCorrelationChart);
        }
    }
    
    if (!canvas) return;
    
    try {
        // 显示加载状态
        loadingContainer.classList.remove('hidden');
        canvas.classList.add('hidden');
        errorContainer.classList.add('hidden');
        
        // 模拟相关性数据
        const data = await retryWithBackoff(() => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    // 模拟不同维度间的相关性数据
                    const dimensions = ['情绪健康', '压力管理', '睡眠质量', '社交功能', '心理韧性'];
                    const correlationData = [
                        // 情绪健康与其他维度的相关性
                        { x: 0, y: 1, r: -0.75 }, // 情绪健康 vs 压力管理
                        { x: 0, y: 2, r: 0.68 },  // 情绪健康 vs 睡眠质量
                        { x: 0, y: 3, r: 0.62 },  // 情绪健康 vs 社交功能
                        { x: 0, y: 4, r: 0.78 },  // 情绪健康 vs 心理韧性
                        
                        // 压力管理与其他维度的相关性
                        { x: 1, y: 2, r: -0.65 }, // 压力管理 vs 睡眠质量
                        { x: 1, y: 3, r: -0.52 }, // 压力管理 vs 社交功能
                        { x: 1, y: 4, r: -0.72 }, // 压力管理 vs 心理韧性
                        
                        // 睡眠质量与其他维度的相关性
                        { x: 2, y: 3, r: 0.55 },  // 睡眠质量 vs 社交功能
                        { x: 2, y: 4, r: 0.60 },  // 睡眠质量 vs 心理韧性
                        
                        // 社交功能与其他维度的相关性
                        { x: 3, y: 4, r: 0.58 }   // 社交功能 vs 心理韧性
                    ];
                    
                    resolve({
                        dimensions,
                        correlationData
                    });
                }, 500);
            });
        });
        
        // 隐藏加载状态，显示图表
        loadingContainer.classList.add('hidden');
        canvas.classList.remove('hidden');
        
        // 准备热力图数据
        const dimensionsCount = data.dimensions.length;
        const heatmapData = [];
        
        // 初始化相关性矩阵
        const correlationMatrix = Array(dimensionsCount).fill().map(() => Array(dimensionsCount).fill(0));
        
        // 设置对角线为1（与自身的相关性）
        for (let i = 0; i < dimensionsCount; i++) {
            correlationMatrix[i][i] = 1;
        }
        
        // 填充相关性数据
        data.correlationData.forEach(item => {
            correlationMatrix[item.x][item.y] = item.r;
            correlationMatrix[item.y][item.x] = item.r; // 对称性
        });
        
        // 转换为Chart.js可用的格式
        for (let i = 0; i < dimensionsCount; i++) {
            for (let j = 0; j < dimensionsCount; j++) {
                heatmapData.push({
                    x: j,
                    y: i,
                    v: correlationMatrix[i][j]
                });
            }
        }
        
        // 创建图表
        const ctx = canvas.getContext('2d');
        
        // 销毁可能存在的旧图表
        if (window.dimensionsCorrelationChart) {
            window.dimensionsCorrelationChart.destroy();
        }
        
        // 简单的热力图实现
        window.dimensionsCorrelationChart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: '维度相关性',
                    data: heatmapData,
                    backgroundColor: function(context) {
                        const value = context.raw.v;
                        // 根据相关性值返回不同的颜色
                        if (value > 0.7) return 'rgba(16, 185, 129, 0.9)'; // 强正相关 - 绿色
                        if (value > 0.3) return 'rgba(16, 185, 129, 0.6)'; // 中等正相关
                        if (value > -0.3) return 'rgba(251, 191, 36, 0.6)'; // 弱相关 - 黄色
                        if (value > -0.7) return 'rgba(239, 68, 68, 0.6)'; // 中等负相关
                        return 'rgba(239, 68, 68, 0.9)'; // 强负相关 - 红色
                    },
                    pointRadius: 25,
                    pointHoverRadius: 30
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 1500,
                    easing: 'easeOutQuart'
                },
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        min: -0.5,
                        max: dimensionsCount - 0.5,
                        ticks: {
                            stepSize: 1,
                            callback: function(value) {
                                return data.dimensions[value] || '';
                            },
                            font: {
                                size: 11
                            }
                        },
                        grid: {
                            display: true,
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    y: {
                        min: -0.5,
                        max: dimensionsCount - 0.5,
                        ticks: {
                            stepSize: 1,
                            callback: function(value) {
                                return data.dimensions[value] || '';
                            },
                            font: {
                                size: 11
                            }
                        },
                        grid: {
                            display: true,
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            title: function() {
                                return '';
                            },
                            label: function(context) {
                                const x = context.raw.x;
                                const y = context.raw.y;
                                const value = context.raw.v.toFixed(2);
                                
                                let correlationText = '';
                                if (Math.abs(value) > 0.7) {
                                    correlationText = value > 0 ? '强正相关' : '强负相关';
                                } else if (Math.abs(value) > 0.3) {
                                    correlationText = value > 0 ? '中等正相关' : '中等负相关';
                                } else {
                                    correlationText = '弱相关';
                                }
                                
                                return `${data.dimensions[y]} vs ${data.dimensions[x]}<br/>` +
                                       `相关系数: ${value}<br/>` +
                                       `关系强度: ${correlationText}`;
                            }
                        },
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#1e293b',
                        bodyColor: '#475569',
                        borderColor: '#e2e8f0',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: false
                    }
                }
            }
        });
        
    } catch (error) {
        console.error('初始化维度关联性分析图表失败:', error);
        loadingContainer.classList.add('hidden');
        errorContainer.classList.remove('hidden');
        errorContainer.querySelector('p.text-gray-600').textContent = `数据加载失败: ${error.message}`;
    }
}

// 8. 新增心理健康综合评估模块
async function createComprehensiveAssessment() {
    // 找到合适的位置创建评估模块
    const dimensionsSection = document.querySelector('#dimensionsCorrelationChartContainer')?.closest('section');
    
    if (dimensionsSection) {
        // 检查是否已存在评估模块
        if (document.getElementById('comprehensiveAssessmentContainer')) return;
        
        // 创建评估模块
        const assessmentSection = document.createElement('section');
        assessmentSection.className = 'mb-8';
        assessmentSection.innerHTML = `
            <h2 class="text-xl font-bold text-gray-800 mb-4">心理健康综合评估</h2>
            <div class="profile-card transform hover:shadow-lg transition-all duration-300" id="comprehensiveAssessmentContainer">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <!-- 总体状态卡片 -->
                    <div class="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-lg border border-indigo-200">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="font-semibold text-indigo-800">整体健康状态</h3>
                            <div class="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center">
                                <i class="fas fa-heartbeat text-white text-xl"></i>
                            </div>
                        </div>
                        <div class="text-center mb-4">
                            <div class="text-4xl font-bold text-indigo-700" id="overallHealthScore">85</div>
                            <div class="text-lg font-medium text-indigo-600" id="overallHealthStatus">良好</div>
                        </div>
                        <div class="text-sm text-gray-600 text-center" id="overallHealthTrend">
                            趋势：稳步上升
                        </div>
                    </div>
                    
                    <!-- 优势维度卡片 -->
                    <div class="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                        <h3 class="font-semibold text-green-800 mb-4">优势维度</h3>
                        <ul class="space-y-2" id="strengthDimensions">
                            <li class="flex items-center">
                                <i class="fas fa-check-circle text-green-600 mr-2"></i>
                                <span class="text-gray-700">情绪健康</span>
                            </li>
                            <li class="flex items-center">
                                <i class="fas fa-check-circle text-green-600 mr-2"></i>
                                <span class="text-gray-700">心理韧性</span>
                            </li>
                        </ul>
                    </div>
                    
                    <!-- 待改进维度卡片 -->
                    <div class="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-lg border border-amber-200">
                        <h3 class="font-semibold text-amber-800 mb-4">待改进维度</h3>
                        <ul class="space-y-2" id="improvementDimensions">
                            <li class="flex items-center">
                                <i class="fas fa-exclamation-circle text-amber-600 mr-2"></i>
                                <span class="text-gray-700">压力管理</span>
                            </li>
                        </ul>
                    </div>
                </div>
                
                <!-- 关键发现 -->
                <div class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 class="font-semibold text-blue-800 mb-3">关键发现</h3>
                    <ul class="space-y-2" id="keyFindings">
                        <li class="flex items-start">
                            <i class="fas fa-lightbulb text-yellow-500 mt-1 mr-2"></i>
                            <span class="text-gray-700">情绪健康与心理韧性呈现强正相关，良好的情绪管理有助于提升心理韧性。</span>
                        </li>
                        <li class="flex items-start">
                            <i class="fas fa-lightbulb text-yellow-500 mt-1 mr-2"></i>
                            <span class="text-gray-700">压力管理是当前需要关注的重点，建议采取有效的压力缓解策略。</span>
                        </li>
                    </ul>
                </div>
                
                <!-- 综合建议 -->
                <div class="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h3 class="font-semibold text-purple-800 mb-3">综合建议</h3>
                    <ul class="space-y-2" id="comprehensiveRecommendations">
                        <li class="flex items-start">
                            <i class="fas fa-arrow-right text-purple-600 mt-1 mr-2"></i>
                            <span class="text-gray-700">继续保持良好的情绪管理习惯，这对整体心理健康至关重要。</span>
                        </li>
                        <li class="flex items-start">
                            <i class="fas fa-arrow-right text-purple-600 mt-1 mr-2"></i>
                            <span class="text-gray-700">制定个性化的压力管理计划，包括冥想、运动和时间管理技巧。</span>
                        </li>
                        <li class="flex items-start">
                            <i class="fas fa-arrow-right text-purple-600 mt-1 mr-2"></i>
                            <span class="text-gray-700">保持良好的社交互动和睡眠习惯，这对情绪健康有积极影响。</span>
                        </li>
                        <li class="flex items-start">
                            <i class="fas fa-arrow-right text-purple-600 mt-1 mr-2"></i>
                            <span class="text-gray-700">建议每月进行一次全面测评，持续跟踪心理健康状况变化。</span>
                        </li>
                    </ul>
                </div>
            </div>
        `;
        
        // 插入到关联性分析区域之后
        dimensionsSection.parentNode.insertBefore(assessmentSection, dimensionsSection.nextSibling);
        
        // 生成评估内容
        await generateAssessmentContent();
    }
}

// 9. 生成评估内容
async function generateAssessmentContent() {
    try {
        // 模拟数据获取
        const data = await retryWithBackoff(() => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    // 模拟完整的测评历史数据
                    const overallData = [
                        { date: '2025-06', value: 75 },
                        { date: '2025-07', value: 78 },
                        { date: '2025-08', value: 80 },
                        { date: '2025-09', value: 82 },
                        { date: '2025-10', value: 83 },
                        { date: '2025-11', value: 85 }
                    ];
                    
                    const dimensionData = [
                        { name: '情绪健康', value: 90 },
                        { name: '压力管理', value: 75 },
                        { name: '睡眠质量', value: 85 },
                        { name: '社交功能', value: 85 },
                        { name: '心理韧性', value: 88 }
                    ];
                    
                    resolve({ overallData, dimensionData });
                }, 400);
            });
        });
        
        // 生成评估结论
        const conclusion = MentalHealthDataAnalyzer.generateAssessmentConclusion(data.overallData, data.dimensionData);
        
        // 更新DOM
        document.getElementById('overallHealthScore').textContent = data.overallData[data.overallData.length - 1].value;
        document.getElementById('overallHealthStatus').textContent = conclusion.overallStatus;
        document.getElementById('overallHealthTrend').textContent = `趋势：${conclusion.trendDescription}`;
        
        // 更新优势维度
        const strengthsContainer = document.getElementById('strengthDimensions');
        strengthsContainer.innerHTML = '';
        if (conclusion.strengths.length === 0) {
            strengthsContainer.innerHTML = '<li class="text-gray-500 text-center italic">暂无突出优势维度</li>';
        } else {
            conclusion.strengths.forEach(strength => {
                const li = document.createElement('li');
                li.className = 'flex items-center';
                li.innerHTML = `
                    <i class="fas fa-check-circle text-green-600 mr-2"></i>
                    <span class="text-gray-700">${strength}</span>
                `;
                strengthsContainer.appendChild(li);
            });
        }
        
        // 更新待改进维度
        const improvementsContainer = document.getElementById('improvementDimensions');
        improvementsContainer.innerHTML = '';
        if (conclusion.weaknesses.length === 0) {
            improvementsContainer.innerHTML = '<li class="text-gray-500 text-center italic">所有维度表现良好</li>';
        } else {
            conclusion.weaknesses.forEach(weakness => {
                const li = document.createElement('li');
                li.className = 'flex items-center';
                li.innerHTML = `
                    <i class="fas fa-exclamation-circle text-amber-600 mr-2"></i>
                    <span class="text-gray-700">${weakness}</span>
                `;
                improvementsContainer.appendChild(li);
            });
        }
        
        // 更新关键发现
        const findingsContainer = document.getElementById('keyFindings');
        findingsContainer.innerHTML = '';
        if (conclusion.keyFindings.length === 0) {
            findingsContainer.innerHTML = '<li class="text-gray-500 text-center italic">暂无特殊发现</li>';
        } else {
            conclusion.keyFindings.forEach(finding => {
                const li = document.createElement('li');
                li.className = 'flex items-start';
                li.innerHTML = `
                    <i class="fas fa-lightbulb text-yellow-500 mt-1 mr-2"></i>
                    <span class="text-gray-700">${finding}</span>
                `;
                findingsContainer.appendChild(li);
            });
        }
        
        // 更新综合建议
        const recommendationsContainer = document.getElementById('comprehensiveRecommendations');
        recommendationsContainer.innerHTML = '';
        conclusion.recommendations.forEach(recommendation => {
            const li = document.createElement('li');
            li.className = 'flex items-start';
            li.innerHTML = `
                <i class="fas fa-arrow-right text-purple-600 mt-1 mr-2"></i>
                <span class="text-gray-700">${recommendation}</span>
            `;
            recommendationsContainer.appendChild(li);
        });
        
    } catch (error) {
        console.error('生成评估内容失败:', error);
    }
}

// 10. 更新图表初始化和事件监听
function initializeMentalHealthAnalysis() {
    // 初始化所有增强版图表
    initEnhancedMentalHealthTrendChart();
    initEnhancedAssessmentDimensionsChart();
    initDimensionsCorrelationChart();
    createComprehensiveAssessment();
    
    // 添加重试按钮事件监听
    document.getElementById('retryMentalHealthChart')?.addEventListener('click', initEnhancedMentalHealthTrendChart);
    document.getElementById('retryDimensionsChart')?.addEventListener('click', initEnhancedAssessmentDimensionsChart);
    
    // 响应式图表重绘
    const resizeChart = debounce(() => {
        if (window.mentalHealthChart) {
            window.mentalHealthChart.resize();
        }
        if (window.assessmentDimensionsChart) {
            window.assessmentDimensionsChart.resize();
        }
        if (window.dimensionsCorrelationChart) {
            window.dimensionsCorrelationChart.resize();
        }
    }, 200);
    
    window.addEventListener('resize', resizeChart);
}

// 导出初始化函数，供页面加载时调用
window.initializeMentalHealthAnalysis = initializeMentalHealthAnalysis;

// 当DOM加载完成后自动初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMentalHealthAnalysis);
} else {
    // 已经加载完成，直接初始化
    initializeMentalHealthAnalysis();
}