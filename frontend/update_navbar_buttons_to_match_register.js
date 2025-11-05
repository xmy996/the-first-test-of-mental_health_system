// 更新导航栏按钮样式以匹配注册页面脚本
// 功能：更新所有HTML页面中的导航栏登录和注册按钮样式，使其与register.html表单按钮样式保持一致
// 使用方法：node update_navbar_buttons_to_match_register.js

const fs = require('fs');
const path = require('path');

// 配置项
const config = {
    // 需要搜索的HTML文件目录
    targetDir: '.',
    // 需要忽略的目录
    ignoreDirs: ['node_modules', 'components', 'css', 'js'],
    // 需要更新的文件类型
    fileExt: '.html',
    // 登录按钮的新HTML（基于register.html样式调整）
    loginButtonHtml: '<button class="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary/5 hover:text-primary transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/30 font-medium shadow-sm hover:shadow transform hover:-translate-y-0.5 active:translate-y-0" onclick="window.location.href=\'login.html\'">\n                <i class="fa fa-sign-in mr-1"></i>登录\n            </button>',
    // 注册按钮的新HTML（基于register.html样式调整）
    registerButtonHtml: '<button class="px-4 py-2 bg-gradient-to-r from-primary to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/30 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0" onclick="window.location.href=\'register.html\'">\n                <i class="fa fa-user-plus mr-1"></i>注册\n            </button>',
    // 搜索模式
    searchPatterns: {
        // 登录按钮模式 - 匹配包含登录文本的按钮
        loginButton: /<button[^>]*>\s*<i[^>]*><\/i>\s*登录\s*<\/button>/,
        // 注册按钮模式 - 匹配包含注册文本的按钮
        registerButton: /<button[^>]*>\s*<i[^>]*><\/i>\s*注册\s*<\/button>/
    }
};

// 计数器
let stats = {
    totalFiles: 0,
    updatedFiles: 0,
    updatedLoginButtons: 0,
    updatedRegisterButtons: 0,
    skippedFiles: 0,
    errorFiles: 0
};

/**
 * 读取目录中的所有HTML文件
 */
function readHtmlFiles(dir, callback) {
    const files = [];
    
    function readDir(currentDir) {
        const entries = fs.readdirSync(currentDir);
        
        entries.forEach(entry => {
            const fullPath = path.join(currentDir, entry);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                // 忽略指定目录
                if (!config.ignoreDirs.includes(path.basename(fullPath))) {
                    readDir(fullPath);
                }
            } else if (stat.isFile() && path.extname(fullPath) === config.fileExt) {
                files.push(fullPath);
            }
        });
    }
    
    try {
        readDir(dir);
        callback(null, files);
    } catch (err) {
        callback(err, null);
    }
}

/**
 * 更新HTML文件中的导航栏按钮
 */
function updateNavbarButtons(filePath) {
    try {
        // 读取文件内容
        let content = fs.readFileSync(filePath, 'utf8');
        let isUpdated = false;
        
        // 更新登录按钮
        if (config.searchPatterns.loginButton.test(content)) {
            content = content.replace(config.searchPatterns.loginButton, config.loginButtonHtml);
            isUpdated = true;
            stats.updatedLoginButtons++;
            console.log(`[更新] ${filePath} - 登录按钮样式已更新`);
        }
        
        // 更新注册按钮
        if (config.searchPatterns.registerButton.test(content)) {
            content = content.replace(config.searchPatterns.registerButton, config.registerButtonHtml);
            isUpdated = true;
            stats.updatedRegisterButtons++;
            console.log(`[更新] ${filePath} - 注册按钮样式已更新`);
        }
        
        // 保存更新后的内容
        if (isUpdated) {
            fs.writeFileSync(filePath, content, 'utf8');
            stats.updatedFiles++;
            console.log(`[保存] ${filePath} - 更新完成`);
            return true;
        } else {
            console.log(`[跳过] ${filePath} - 未找到需要更新的导航栏按钮`);
            stats.skippedFiles++;
            return false;
        }
    } catch (err) {
        console.error(`[错误] ${filePath} - ${err.message}`);
        stats.errorFiles++;
        return false;
    }
}

/**
 * 主函数
 */
function main() {
    console.log('开始更新导航栏按钮样式以匹配注册页面...');
    console.log('=' * 60);
    
    readHtmlFiles(config.targetDir, (err, files) => {
        if (err) {
            console.error('读取文件失败:', err.message);
            return;
        }
        
        stats.totalFiles = files.length;
        console.log(`找到 ${files.length} 个HTML文件需要处理`);
        console.log('=' * 60);
        
        // 处理每个文件
        files.forEach(filePath => {
            updateNavbarButtons(filePath);
        });
        
        // 显示统计信息
        console.log('=' * 60);
        console.log('更新完成！');
        console.log(`总文件数: ${stats.totalFiles}`);
        console.log(`成功更新文件数: ${stats.updatedFiles}`);
        console.log(`更新的登录按钮数: ${stats.updatedLoginButtons}`);
        console.log(`更新的注册按钮数: ${stats.updatedRegisterButtons}`);
        console.log(`跳过文件数: ${stats.skippedFiles}`);
        console.log(`错误文件数: ${stats.errorFiles}`);
        console.log('=' * 60);
        console.log('请刷新浏览器查看更新效果。');
    });
}

// 运行主函数
if (require.main === module) {
    main();
}

// 导出函数，使其可以在其他地方使用
module.exports = {
    updateNavbarButtons,
    readHtmlFiles,
    main
};