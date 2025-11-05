// 登录状态同步验证脚本
// 此脚本用于测试心理实验页面的登录状态同步功能

const fs = require('fs');
const path = require('path');

// 实验页面列表
const experimentPages = [
    'psychology_experiments.html',
    'stroop_experiment.html',
    'memory-span_experiment.html',
    'visual-search_experiment.html',
    'emotion-recognition_experiment.html',
    'affective-priming_experiment.html',
    'asch-conformity_experiment.html',
    'prisoners-dilemma_experiment.html',
    'iat_experiment.html'
];

// 检查结果
const results = {
    total: experimentPages.length,
    passed: 0,
    failed: 0,
    details: []
};

// 检查函数
function checkPageIntegration(pagePath) {
    try {
        const content = fs.readFileSync(pagePath, 'utf8');
        // 检查是否有update_experiment_navigation.js引用（支持静态和动态加载）
        const hasUpdateExperimentNav = function(content) {
            // 检查静态引用
            const hasStatic = content.includes('<script src="update_experiment_navigation.js"></script>');
            // 检查动态加载
            const hasDynamic = content.includes('update_experiment_navigation.js');
            return hasStatic || hasDynamic;
        };
        
        const checks = {
            hasCommonJs: content.includes('<script src="common.js"></script>'),
            hasUpdateExperimentNav: hasUpdateExperimentNav(content),
            hasForceSync: content.includes('window.forceExperimentLoginSync'),
            hasAuthManagerRef: content.includes('window.AuthManager'),
            hasEventListeners: content.includes('userLoggedIn') || content.includes('storage') || content.includes('focus')
        };
        
        const allChecksPassed = Object.values(checks).every(Boolean);
        
        results.details.push({
            page: path.basename(pagePath),
            passed: allChecksPassed,
            checks
        });
        
        if (allChecksPassed) {
            results.passed++;
        } else {
            results.failed++;
        }
        
        return allChecksPassed;
    } catch (error) {
        console.error(`读取文件失败: ${pagePath}`, error);
        results.details.push({
            page: path.basename(pagePath),
            passed: false,
            error: error.message
        });
        results.failed++;
        return false;
    }
}

// 验证update_experiment_navigation.js的修改
function checkUpdateScript() {
    try {
        const scriptPath = path.join(__dirname, 'update_experiment_navigation.js');
        const content = fs.readFileSync(scriptPath, 'utf8');
        
        const checks = {
            hasForceUpdateMethod: content.includes('forceUpdateLoginStatus'),
            usesGlobalUpdate: content.includes('window.updateGlobalLoginStatus'),
            hasEventListeners: content.includes('userLoggedIn') && content.includes('userLoggedOut') && 
                               content.includes('forceAuthUpdate'),
            hasExperimentElementsUpdate: content.includes('updateExperimentPageElements'),
            hasEarlyInit: content.includes('earlyInit')
        };
        
        const allChecksPassed = Object.values(checks).every(Boolean);
        
        console.log('\n=== update_experiment_navigation.js 检查结果 ===');
        console.log('检查项:', checks);
        console.log('总体结果:', allChecksPassed ? '通过' : '失败');
        
        return allChecksPassed;
    } catch (error) {
        console.error('读取update_experiment_navigation.js失败', error);
        return false;
    }
}

// 运行验证
function runVerification() {
    console.log('开始验证心理实验页面的登录状态同步功能...');
    console.log(`总共需要检查 ${experimentPages.length} 个实验页面`);
    
    // 检查update_experiment_navigation.js
    const updateScriptPassed = checkUpdateScript();
    
    // 检查每个实验页面
    experimentPages.forEach(page => {
        const pagePath = path.join(__dirname, page);
        console.log(`\n检查页面: ${page}`);
        
        if (fs.existsSync(pagePath)) {
            const passed = checkPageIntegration(pagePath);
            console.log(`结果: ${passed ? '通过' : '失败'}`);
        } else {
            console.log(`结果: 失败 - 文件不存在`);
            results.details.push({
                page,
                passed: false,
                error: '文件不存在'
            });
            results.failed++;
        }
    });
    
    // 输出汇总报告
    console.log('\n=== 验证汇总报告 ===');
    console.log(`总页面数: ${results.total}`);
    console.log(`通过: ${results.passed}`);
    console.log(`失败: ${results.failed}`);
    
    // 输出详细信息
    console.log('\n=== 详细检查结果 ===');
    results.details.forEach(detail => {
        console.log(`\n页面: ${detail.page}`);
        console.log(`状态: ${detail.passed ? '通过' : '失败'}`);
        if (detail.checks) {
            console.log('检查项:');
            Object.entries(detail.checks).forEach(([key, value]) => {
                console.log(`  - ${key}: ${value ? '✓' : '✗'}`);
            });
        }
        if (detail.error) {
            console.log(`错误: ${detail.error}`);
        }
    });
    
    // 生成建议
    console.log('\n=== 改进建议 ===');
    if (results.failed === 0) {
        console.log('✅ 所有页面集成正确！');
    } else {
        console.log('❌ 需要修复以下问题:');
        results.details.forEach(detail => {
            if (!detail.passed && detail.checks) {
                console.log(`\n页面: ${detail.page}`);
                Object.entries(detail.checks).forEach(([key, value]) => {
                    if (!value) {
                        switch(key) {
                            case 'hasCommonJs':
                                console.log('- 缺少: <script src="common.js"></script>');
                                break;
                            case 'hasUpdateExperimentNav':
                                console.log('- 缺少: <script src="update_experiment_navigation.js"></script>');
                                break;
                            case 'hasForceSync':
                                console.log('- 缺少: 没有使用window.forceExperimentLoginSync');
                                break;
                            case 'hasAuthManagerRef':
                                console.log('- 缺少: 没有引用window.AuthManager');
                                break;
                            case 'hasEventListeners':
                                console.log('- 缺少: 没有监听登录相关事件');
                                break;
                        }
                    }
                });
            }
        });
    }
    
    return results.failed === 0;
}

// 运行验证并退出
const success = runVerification();
process.exit(success ? 0 : 1);