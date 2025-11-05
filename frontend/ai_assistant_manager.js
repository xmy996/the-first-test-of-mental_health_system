/**
 * AI助手管理模块
 * 负责AI助手的启动、停止、配置和监控
 */

class AIAssistantManager {
    constructor() {
        this.state = {
            isRunning: false,
            isInitialized: false,
            config: {
                enableLogging: true,
                enableCache: false,
                enableAnalytics: true,
                responseTimeout: 30000,
                maxRetries: 3
            },
            stats: {
                totalSessions: 0,
                activeSessions: 0,
                completedSessions: 0,
                avgResponseTime: 0,
                totalResponseTime: 0,
                totalRequests: 0,
                successfulRequests: 0,
                failedRequests: 0,
                memoryUsage: 0,
                cpuUsage: 0
            },
            cache: new Map(),
            sessionMap: new Map(),
            eventListeners: new Map(),
            performanceMonitor: null,
            healthCheckInterval: null
        };
        
        // 绑定方法到实例
        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.restart = this.restart.bind(this);
        this.updateConfig = this.updateConfig.bind(this);
        this.getStats = this.getStats.bind(this);
        this.clearCache = this.clearCache.bind(this);
        this.generateResponse = this.generateResponse.bind(this);
        this.addSession = this.addSession.bind(this);
        this.endSession = this.endSession.bind(this);
        this.on = this.on.bind(this);
        this.off = this.off.bind(this);
        this.emit = this.emit.bind(this);
        this.simulatePerformanceData = this.simulatePerformanceData.bind(this);
        this.performHealthCheck = this.performHealthCheck.bind(this);
        this.log = this.log.bind(this);
    }
    
    /**
     * 初始化AI助手管理器
     */
    async initialize() {
        try {
            this.log('info', '正在初始化AI助手管理器...');
            
            // 尝试加载AI助手实例
            if (window._mentalHealthAIAssistant) {
                this.aiAssistantInstance = window._mentalHealthAIAssistant;
                this.log('success', '已成功连接到现有的AI助手实例');
            } else {
                this.log('warning', '未找到现有AI助手实例，将在启动时创建');
            }
            
            // 加载配置
            this.loadConfig();
            
            // 初始化性能监控
            this.setupPerformanceMonitor();
            
            this.state.isInitialized = true;
            this.log('success', 'AI助手管理器初始化完成');
            this.emit('initialized');
            
            return true;
        } catch (error) {
            this.log('error', `初始化失败: ${error.message}`);
            this.emit('error', error);
            return false;
        }
    }
    
    /**
     * 启动AI助手服务
     */
    async start() {
        try {
            if (!this.state.isInitialized) {
                await this.initialize();
            }
            
            if (this.state.isRunning) {
                this.log('warning', 'AI助手已经在运行中');
                return;
            }
            
            this.log('info', '正在启动AI助手服务...');
            
            // 如果没有AI助手实例，创建一个
            if (!this.aiAssistantInstance) {
                this.aiAssistantInstance = this.createAIAssistantInstance();
            }
            
            // 启动健康检查
            this.startHealthCheck();
            
            // 更新状态
            this.state.isRunning = true;
            this.state.stats.activeSessions = 1;
            this.state.stats.totalSessions = Math.max(1, this.state.stats.totalSessions);
            
            this.log('success', 'AI助手服务启动成功');
            this.emit('started');
            
            return true;
        } catch (error) {
            this.log('error', `启动失败: ${error.message}`);
            this.emit('error', error);
            return false;
        }
    }
    
    /**
     * 停止AI助手服务
     */
    async stop() {
        try {
            if (!this.state.isRunning) {
                this.log('warning', 'AI助手已经停止');
                return;
            }
            
            this.log('info', '正在停止AI助手服务...');
            
            // 停止健康检查
            this.stopHealthCheck();
            
            // 结束所有活跃会话
            this.sessionMap.forEach(session => {
                this.endSession(session.id);
            });
            
            // 如果有暂停方法，调用它
            if (this.aiAssistantInstance && typeof this.aiAssistantInstance.pauseProcessing === 'function') {
                this.aiAssistantInstance.pauseProcessing();
            }
            
            // 更新状态
            this.state.isRunning = false;
            this.state.stats.activeSessions = 0;
            
            this.log('success', 'AI助手服务已停止');
            this.emit('stopped');
            
            return true;
        } catch (error) {
            this.log('error', `停止失败: ${error.message}`);
            this.emit('error', error);
            return false;
        }
    }
    
    /**
     * 重启AI助手服务
     */
    async restart() {
        try {
            this.log('info', '正在重启AI助手服务...');
            await this.stop();
            
            // 延迟启动以确保完全停止
            setTimeout(async () => {
                await this.start();
                this.log('success', 'AI助手服务重启完成');
            }, 1000);
            
            return true;
        } catch (error) {
            this.log('error', `重启失败: ${error.message}`);
            this.emit('error', error);
            return false;
        }
    }
    
    /**
     * 更新配置
     * @param {Object} newConfig - 新的配置对象
     */
    updateConfig(newConfig) {
        try {
            this.state.config = { ...this.state.config, ...newConfig };
            this.saveConfig();
            this.log('info', `配置已更新: ${JSON.stringify(newConfig)}`);
            this.emit('configUpdated', this.state.config);
            return true;
        } catch (error) {
            this.log('error', `更新配置失败: ${error.message}`);
            return false;
        }
    }
    
    /**
     * 获取统计信息
     */
    getStats() {
        const stats = { ...this.state.stats };
        
        // 计算错误率
        if (stats.totalRequests > 0) {
            stats.errorRate = Math.round((stats.failedRequests / stats.totalRequests) * 100);
        } else {
            stats.errorRate = 0;
        }
        
        // 计算平均响应时间
        if (stats.successfulRequests > 0) {
            stats.avgResponseTime = Math.round(stats.totalResponseTime / stats.successfulRequests);
        } else {
            stats.avgResponseTime = 0;
        }
        
        return stats;
    }
    
    /**
     * 清除缓存
     */
    clearCache() {
        this.state.cache.clear();
        this.log('info', '缓存已清除');
        this.emit('cacheCleared');
    }
    
    /**
     * 生成响应
     * @param {string} question - 用户问题
     */
    async generateResponse(question) {
        if (!this.state.isRunning) {
            throw new Error('AI助手未运行');
        }
        
        const startTime = performance.now();
        this.state.stats.totalRequests++;
        
        try {
            // 检查缓存
            if (this.state.config.enableCache && this.state.cache.has(question)) {
                const cachedResponse = this.state.cache.get(question);
                this.log('info', `命中缓存响应: ${question}`);
                
                const responseTime = performance.now() - startTime;
                this.updateResponseStats(responseTime, true);
                
                return cachedResponse;
            }
            
            let response;
            
            // 尝试使用AI助手实例生成响应
            if (this.aiAssistantInstance && typeof this.aiAssistantInstance.generateResponse === 'function') {
                response = await this.aiAssistantInstance.generateResponse(question);
            } else {
                // 备用响应生成逻辑
                response = this.generateFallbackResponse(question);
            }
            
            // 缓存响应
            if (this.state.config.enableCache) {
                this.state.cache.set(question, response);
                // 限制缓存大小
                if (this.state.cache.size > 100) {
                    const firstKey = this.state.cache.keys().next().value;
                    this.state.cache.delete(firstKey);
                }
            }
            
            const responseTime = performance.now() - startTime;
            this.updateResponseStats(responseTime, true);
            
            this.log('info', `成功生成响应，耗时: ${responseTime.toFixed(2)}ms`);
            return response;
        } catch (error) {
            const responseTime = performance.now() - startTime;
            this.updateResponseStats(responseTime, false);
            
            this.log('error', `生成响应失败: ${error.message}`);
            throw error;
        }
    }
    
    /**
     * 添加会话
     */
    addSession() {
        const sessionId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        const session = {
            id: sessionId,
            startTime: new Date(),
            requestCount: 0,
            lastActivity: new Date()
        };
        
        this.sessionMap.set(sessionId, session);
        this.state.stats.activeSessions++;
        this.state.stats.totalSessions++;
        
        this.log('info', `新建会话: ${sessionId}`);
        this.emit('sessionAdded', session);
        
        return sessionId;
    }
    
    /**
     * 结束会话
     * @param {string} sessionId - 会话ID
     */
    endSession(sessionId) {
        if (this.sessionMap.has(sessionId)) {
            const session = this.sessionMap.get(sessionId);
            this.sessionMap.delete(sessionId);
            
            if (this.state.stats.activeSessions > 0) {
                this.state.stats.activeSessions--;
            }
            this.state.stats.completedSessions++;
            
            this.log('info', `结束会话: ${sessionId}`);
            this.emit('sessionEnded', session);
            
            return true;
        }
        return false;
    }
    
    /**
     * 事件监听
     */
    on(event, listener) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(listener);
    }
    
    /**
     * 移除事件监听
     */
    off(event, listener) {
        if (this.eventListeners.has(event)) {
            const listeners = this.eventListeners.get(event);
            const index = listeners.indexOf(listener);
            if (index !== -1) {
                listeners.splice(index, 1);
            }
        }
    }
    
    /**
     * 触发事件
     */
    emit(event, ...args) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(listener => {
                try {
                    listener(...args);
                } catch (error) {
                    console.error(`事件处理错误 [${event}]:`, error);
                }
            });
        }
    }
    
    // 私有辅助方法
    
    /**
     * 创建AI助手实例
     */
    createAIAssistantInstance() {
        this.log('info', '创建新的AI助手实例');
        
        // 检查是否已加载ai-assistant.js
        if (window.initAIAssistant) {
            // 调用ai-assistant.js中的初始化函数
            window.initAIAssistant();
            return window._mentalHealthAIAssistant;
        } else {
            // 创建简化版的备用实例
            return this.createFallbackInstance();
        }
    }
    
    /**
     * 创建备用AI助手实例
     */
    createFallbackInstance() {
        return {
            generateResponse: (question) => {
                return this.generateFallbackResponse(question);
            },
            pauseProcessing: () => {
                this.log('info', '备用实例处理已暂停');
            }
        };
    }
    
    /**
     * 生成备用响应
     */
    generateFallbackResponse(question) {
        const lowerQuestion = question.toLowerCase();
        
        // 心理健康相关回答
        if (lowerQuestion.includes('心理健康')) {
            return '心理健康是指一个人在情感、心理和社交方面的良好状态。它影响我们的思考方式、感受和行为，以及我们如何应对压力、与他人互动和做出决策。保持心理健康对于全面的幸福感至关重要。';
        }
        
        if (lowerQuestion.includes('压力')) {
            return '应对压力的有效方法包括：深呼吸练习、定期运动、充足的睡眠、健康的饮食、培养爱好、与亲友交流、设定合理的目标、学习时间管理技巧，以及必要时寻求专业帮助。记住，每个人应对压力的方式不同，找到适合自己的方法最重要。';
        }
        
        if (lowerQuestion.includes('焦虑')) {
            return '焦虑症是一种常见的心理健康障碍，表现为过度的担忧和恐惧。主要症状包括紧张不安、心跳加速、呼吸急促、出汗、睡眠问题等。治疗方法包括心理治疗（如认知行为疗法）、药物治疗和生活方式改变。如果您感到持续的焦虑影响了日常生活，建议寻求专业心理健康服务。';
        }
        
        if (lowerQuestion.includes('预约') || lowerQuestion.includes('咨询')) {
            return '您可以通过我们的官方网站、手机应用或直接致电我们的客服中心进行咨询预约。在预约时，我们会为您匹配最适合您需求的专业咨询师。预约流程简单便捷，您也可以根据自己的时间安排选择合适的咨询时段。';
        }
        
        if (lowerQuestion.includes('服务') || lowerQuestion.includes('提供')) {
            return '我们提供全面的心理健康服务，包括个人心理咨询、团体心理辅导、心理健康评估、危机干预、心理教育课程、冥想和放松训练、以及在线心理健康支持。我们的专业团队致力于为您提供个性化的心理健康解决方案。';
        }
        
        if (lowerQuestion.includes('冥想')) {
            return '冥想的好处包括：减轻压力和焦虑、改善睡眠质量、增强注意力和专注力、提升情绪稳定性、降低血压、增强免疫系统功能、促进自我意识和接纳。即使每天只进行10-15分钟的冥想练习，也能感受到明显的益处。';
        }
        
        // 默认回答
        return '感谢您的提问。作为AI心理健康助手，我致力于为您提供关于心理健康的支持和指导。如果您有任何关于心理健康、心理咨询或我们服务的问题，请随时告诉我，我会尽力为您提供帮助。';
    }
    
    /**
     * 设置性能监控
     */
    setupPerformanceMonitor() {
        // 模拟性能监控
        this.performanceMonitor = setInterval(() => {
            this.simulatePerformanceData();
        }, 5000);
    }
    
    /**
     * 模拟性能数据
     */
    simulatePerformanceData() {
        if (this.state.isRunning) {
            // 模拟随机的性能数据变化
            this.state.stats.memoryUsage = Math.floor(Math.random() * 50) + 10;
            this.state.stats.cpuUsage = Math.floor(Math.random() * 20) + 1;
            
            // 触发性能数据更新事件
            this.emit('performanceUpdated', {
                memoryUsage: this.state.stats.memoryUsage,
                cpuUsage: this.state.stats.cpuUsage
            });
        }
    }
    
    /**
     * 启动健康检查
     */
    startHealthCheck() {
        this.healthCheckInterval = setInterval(() => {
            this.performHealthCheck();
        }, 30000); // 每30秒检查一次
    }
    
    /**
     * 停止健康检查
     */
    stopHealthCheck() {
        if (this.healthCheckInterval) {
            clearInterval(this.healthCheckInterval);
            this.healthCheckInterval = null;
        }
    }
    
    /**
     * 执行健康检查
     */
    performHealthCheck() {
        if (this.state.isRunning) {
            this.log('info', '执行健康检查...');
            
            // 检查AI助手实例是否正常
            const isHealthy = true; // 在实际实现中，这里应该有真实的健康检查逻辑
            
            if (isHealthy) {
                this.log('success', '健康检查通过');
                this.emit('healthCheckPassed');
            } else {
                this.log('error', '健康检查失败');
                this.emit('healthCheckFailed');
                
                // 尝试自动恢复
                if (this.state.config.autoRecover) {
                    this.restart();
                }
            }
        }
    }
    
    /**
     * 更新响应统计
     */
    updateResponseStats(responseTime, isSuccessful) {
        this.state.stats.totalResponseTime += responseTime;
        
        if (isSuccessful) {
            this.state.stats.successfulRequests++;
        } else {
            this.state.stats.failedRequests++;
        }
        
        // 更新平均响应时间
        if (this.state.stats.successfulRequests > 0) {
            this.state.stats.avgResponseTime = 
                Math.round(this.state.stats.totalResponseTime / this.state.stats.successfulRequests);
        }
    }
    
    /**
     * 加载配置
     */
    loadConfig() {
        try {
            const savedConfig = localStorage.getItem('aiAssistantConfig');
            if (savedConfig) {
                this.state.config = { ...this.state.config, ...JSON.parse(savedConfig) };
                this.log('info', '已加载保存的配置');
            }
        } catch (error) {
            this.log('error', `加载配置失败: ${error.message}`);
        }
    }
    
    /**
     * 保存配置
     */
    saveConfig() {
        try {
            localStorage.setItem('aiAssistantConfig', JSON.stringify(this.state.config));
            this.log('info', '配置已保存');
        } catch (error) {
            this.log('error', `保存配置失败: ${error.message}`);
        }
    }
    
    /**
     * 日志记录
     */
    log(level, message) {
        if (this.state.config.enableLogging) {
            const timestamp = new Date().toISOString();
            const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
            
            console.log(logMessage);
            
            // 触发日志事件
            this.emit('log', { level, message, timestamp });
        }
    }
}

// 创建单例实例
const aiAssistantManager = new AIAssistantManager();

// 初始化管理器
aiAssistantManager.initialize().then(() => {
    // 如果配置为自动启动，则启动AI助手
    if (aiAssistantManager.state.config.autoStart) {
        aiAssistantManager.start();
    }
});

// 暴露到全局对象
window.aiAssistantManager = aiAssistantManager;

// 导出
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = aiAssistantManager;
}