const fs = require('fs');
const path = require('path');

// 要更新的文件路径列表
const filesToUpdate = [
    'psychology_experiment_management.html',
    'system_settings.html',
    'consultant_management.html',
    'psychology_experiments.html',
    'sandbox_simulation_management.html',
    'booking_management.html',
    'assessment_management.html',
    'user_management.html',
    'unified_admin_template.html'
];

// 需要更新的管理页面文件
const adminPages = [
    'admin_dashboard.html',
    'user_management.html',
    'assessment_management.html',
    'booking_management.html',
    'activity_management.html',
    'consultant_management.html',
    'psychology_experiment_management.html',
    'data_analysis.html',
    'system_settings.html',
    'sandbox_simulation_management.html'
];

// 获取前端目录路径
const frontendDir = path.dirname(__filename);

// 统计信息
let totalFiles = 0;
let updatedFiles = 0;
let backupFiles = 0;

// 函数：备份文件
function backupFile(filePath) {
    try {
        const backupPath = filePath + '.backup';
        if (!fs.existsSync(backupPath)) {
            fs.copyFileSync(filePath, backupPath);
            backupFiles++;
            console.log(`已备份文件: ${path.basename(filePath)}`);
        }
        return true;
    } catch (error) {
        console.error(`备份文件失败 ${path.basename(filePath)}:`, error.message);
        return false;
    }
}

// 函数：更新单个文件中的退出登录链接
function updateLogoutLinks(filePath) {
    try {
        // 读取文件内容
        let content = fs.readFileSync(filePath, 'utf8');
        
        // 检查是否包含需要替换的内容
        const originalContent = content;
        
        // 替换所有退出登录相关的链接
        // 1. JS中的退出登录跳转
        content = content.replace(/window\.location\.href\s*=\s*['"]login\.html['"]/g, 
                                 'window.location.href = \'admin_login.html\'');
        
        // 2. HTML按钮中的退出登录跳转
        content = content.replace(/onclick="window\.location\.href='login\.html'/g, 
                                 'onclick="window.location.href=\'admin_login.html\'');
        
        // 检查是否有变化
        if (content !== originalContent) {
            // 先备份文件
            if (backupFile(filePath)) {
                // 写入更新后的内容
                fs.writeFileSync(filePath, content, 'utf8');
                updatedFiles++;
                console.log(`已更新文件: ${path.basename(filePath)}`);
                return true;
            }
        } else {
            console.log(`文件无需更新: ${path.basename(filePath)}`);
        }
        return false;
    } catch (error) {
        console.error(`更新文件失败 ${path.basename(filePath)}:`, error.message);
        return false;
    }
}

// 函数：更新统一模板文件
function updateTemplateFile() {
    const templatePath = path.join(frontendDir, 'unified_admin_template.html');
    if (fs.existsSync(templatePath)) {
        console.log('\n开始更新统一模板文件...');
        return updateLogoutLinks(templatePath);
    }
    return false;
}

// 函数：更新所有管理页面
function updateAllAdminPages() {
    console.log('\n开始更新所有管理页面...');
    
    adminPages.forEach(page => {
        const pagePath = path.join(frontendDir, page);
        if (fs.existsSync(pagePath)) {
            totalFiles++;
            updateLogoutLinks(pagePath);
        } else {
            console.log(`文件不存在: ${page}`);
        }
    });
}

// 主函数
function main() {
    console.log('开始更新管理系统的退出登录链接...');
    console.log('将 login.html 替换为 admin_login.html');
    console.log('=======================================');
    
    // 首先更新统一模板
    updateTemplateFile();
    
    // 然后更新所有管理页面
    updateAllAdminPages();
    
    // 输出统计信息
    console.log('\n=======================================');
    console.log('更新完成！');
    console.log(`总计检查文件: ${totalFiles}`);
    console.log(`成功更新文件: ${updatedFiles}`);
    console.log(`创建备份文件: ${backupFiles}`);
    console.log('=======================================');
}

// 执行主函数
main();