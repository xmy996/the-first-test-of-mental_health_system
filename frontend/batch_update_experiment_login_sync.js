// 批量更新实验页面的登录状态同步功能
// 此脚本用于为所有实验页面添加必要的登录状态同步代码

const fs = require('fs');
const path = require('path');

// 需要更新的实验页面列表（排除已经修复的页面）
const experimentPages = [
    'memory-span_experiment.html',
    'visual-search_experiment.html',
    'emotion-recognition_experiment.html',
    'affective-priming_experiment.html',
    'asch-conformity_experiment.html',
    'prisoners-dilemma_experiment.html',
    'iat_experiment.html'
];

// 结果统计
const stats = {
    total: experimentPages.length,
    updated: 0,
    failed: 0,
    details: []
};

// 登录同步代码模板
const loginSyncCode = `    <!-- 首先加载common.js以确保AuthManager可用 -->
    <script src="common.js"></script>
    <!-- 然后加载实验导航更新脚本 -->
    <script src="update_experiment_navigation.js"></script>
    
    <!-- 确保页面加载完成后更新登录状态 -->
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            // 立即强制同步登录状态
            if (window.forceExperimentLoginSync) {
                window.forceExperimentLoginSync();
            }
        });
        
        // 增强的登录检查函数
        function enhancedCheckLogin() {
            // 优先使用AuthManager
            if (window.AuthManager) {
                return window.AuthManager.isLoggedIn();
            } else {
                // 兼容旧的token检查和新的AuthManager格式
                const authToken = localStorage.getItem('auth_token');
                const oldToken = localStorage.getItem('token');
                const isLogin = localStorage.getItem('isLogin') === 'true';
                return authToken || oldToken || isLogin;
            }
        }
        
        // 监听全局登录事件，确保实验页面及时响应
        window.addEventListener('userLoggedIn', () => {
            console.log('实验页面检测到用户登录');
            // 可以在这里更新UI，比如启用保存按钮
            const saveButton = document.querySelector('#save-result');
            if (saveButton) {
                saveButton.disabled = false;
                saveButton.classList.remove('opacity-50');
            }
        });
    </script>
    </body>`;

// 更新单个页面
function updatePage(pagePath) {
    try {
        let content = fs.readFileSync(pagePath, 'utf8');
        const originalContent = content;
        
        // 检查是否已经有update_experiment_navigation.js引用
        const hasUpdateNavScript = content.includes('<script src="update_experiment_navigation.js"></script>');
        
        // 检查是否已经有common.js引用
        const hasCommonJsScript = content.includes('<script src="common.js"></script>');
        
        // 替换脚本部分
        if (hasUpdateNavScript) {
            // 如果只有update_experiment_navigation.js，替换整个脚本区域
            if (!hasCommonJsScript) {
                content = content.replace(
                    /<script src="update_experiment_navigation.js"><\/script>\s*<\/body>/,
                    loginSyncCode
                );
            } else {
                // 如果两者都有，但缺少其他部分，添加事件监听
                if (!content.includes('window.forceExperimentLoginSync')) {
                    content = content.replace(
                        /<\/body>/,
                        `    <script>
        document.addEventListener('DOMContentLoaded', () => {
            // 立即强制同步登录状态
            if (window.forceExperimentLoginSync) {
                window.forceExperimentLoginSync();
            }
        });
        
        // 增强的登录检查函数
        function enhancedCheckLogin() {
            // 优先使用AuthManager
            if (window.AuthManager) {
                return window.AuthManager.isLoggedIn();
            } else {
                // 兼容旧的token检查和新的AuthManager格式
                const authToken = localStorage.getItem('auth_token');
                const oldToken = localStorage.getItem('token');
                const isLogin = localStorage.getItem('isLogin') === 'true';
                return authToken || oldToken || isLogin;
            }
        }
        
        // 监听全局登录事件，确保实验页面及时响应
        window.addEventListener('userLoggedIn', () => {
            console.log('实验页面检测到用户登录');
            // 可以在这里更新UI，比如启用保存按钮
            const saveButton = document.querySelector('#save-result');
            if (saveButton) {
                saveButton.disabled = false;
                saveButton.classList.remove('opacity-50');
            }
        });
    </script>
    </body>`
                    );
                }
            }
        } else {
            // 如果都没有，直接添加完整代码
            content = content.replace(/<\/body>/, loginSyncCode);
        }
        
        // 如果内容有变化，保存文件
        if (content !== originalContent) {
            // 创建备份
            const backupPath = pagePath + '.login_sync_backup';
            if (!fs.existsSync(backupPath)) {
                fs.writeFileSync(backupPath, originalContent, 'utf8');
                console.log(`已创建备份: ${backupPath}`);
            }
            
            // 保存更新后的内容
            fs.writeFileSync(pagePath, content, 'utf8');
            console.log(`已更新: ${pagePath}`);
            
            return true;
        } else {
            console.log(`无需更新: ${pagePath} (内容未变化)`);
            return false;
        }
    } catch (error) {
        console.error(`更新失败: ${pagePath}`, error);
        return false;
    }
}

// 更新所有页面
function updateAllPages() {
    console.log(`开始更新 ${experimentPages.length} 个实验页面的登录状态同步功能...`);
    
    experimentPages.forEach(page => {
        const pagePath = path.join(__dirname, page);
        console.log(`\n处理页面: ${page}`);
        
        if (fs.existsSync(pagePath)) {
            try {
                const success = updatePage(pagePath);
                
                stats.details.push({
                    page,
                    success,
                    message: success ? '更新成功' : '更新失败'
                });
                
                if (success) {
                    stats.updated++;
                } else {
                    stats.failed++;
                }
            } catch (error) {
                console.error(`处理页面时出错: ${page}`, error);
                stats.details.push({
                    page,
                    success: false,
                    message: `错误: ${error.message}`
                });
                stats.failed++;
            }
        } else {
            console.log(`文件不存在: ${page}`);
            stats.details.push({
                page,
                success: false,
                message: '文件不存在'
            });
            stats.failed++;
        }
    });
    
    // 输出汇总报告
    console.log('\n=== 更新汇总报告 ===');
    console.log(`总页面数: ${stats.total}`);
    console.log(`成功更新: ${stats.updated}`);
    console.log(`更新失败: ${stats.failed}`);
    
    // 输出详细信息
    console.log('\n=== 更新详情 ===');
    stats.details.forEach(detail => {
        console.log(`${detail.page}: ${detail.message}`);
    });
    
    return stats.failed === 0;
}

// 运行更新
const success = updateAllPages();
console.log(`\n更新完成，${success ? '全部成功' : '部分失败'}`);
process.exit(success ? 0 : 1);