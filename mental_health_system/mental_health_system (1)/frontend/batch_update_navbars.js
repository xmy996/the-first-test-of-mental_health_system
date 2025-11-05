// 批量更新导航栏脚本
// 功能：在所有HTML页面的更多服务下拉菜单中添加心理实验链接
// 使用方法：node batch_update_navbars.js

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
    // 心理实验链接HTML - 适配实际页面样式
    experimentLinkHtml: '                    <a href="psychology_experiments.html" class="block px-4 py-3 text-gray-700 hover:bg-white/50 transition-all-300">\n                        <i class="fa fa-flask mr-2"></i>心理实验\n                    </a>',
    // 心理实验移动端链接HTML
    mobileExperimentLinkHtml: '            <a href="psychology_experiments.html" class="mobile-nav-link nav-link-hover flex items-center" aria-label="心理实验"><i class="fa fa-flask mr-2"></i>心理实验</a>',
    // 搜索模式
    searchPatterns: {
        // 桌面端更多服务菜单 - 主要模式（适配index.html中的实际结构）
        desktopMoreMenuMain: /<div id="desktop-more-dropdown" class="hidden absolute top-full left-0 mt-2 w-56 glass-effect rounded-lg shadow-xl z-50 py-2 animate-fade-in transform origin-top-right">[\s\S]*?<\/div>/,
        // 桌面端更多服务菜单 - 备用模式1
        desktopMoreMenu1: /<div id="desktop-more-dropdown" class="hidden absolute right-0 mt-2 w-56 glass-effect rounded-lg shadow-xl z-50 py-2 dropdown-appear">[\s\S]*?<\/div>/,
        // 桌面端更多服务菜单 - 备用模式2
        desktopMoreMenu2: /<div id="desktop-more-dropdown" class="hidden absolute right-0 mt-2 w-56 glass-effect rounded-lg shadow-xl z-50 py-2 dropdown-appear">[\s\S]*?<\/div>/,
        // 移动端导航菜单
        mobileMenu: /<div id="mobile-menu" class="md:hidden hidden glass-effect animate-fade-in absolute w-full mt-1 rounded-b-xl">[\s\S]*?<div id="mobile-auth-buttons"/,
        // 检查是否已包含心理实验链接
        hasExperimentLink: /href="psychology_experiments\.html"/,
        // 心理游戏链接（用于插入位置）
        mentalGamesLink: /<a href="mental_games\.html"[^>]*>.*?<\/a>/
    }
};

// 计数器
let stats = {
    totalFiles: 0,
    updatedFiles: 0,
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
 * 更新HTML文件中的导航栏
 */
function updateNavbar(filePath) {
    try {
        // 读取文件内容
        let content = fs.readFileSync(filePath, 'utf8');
        
        // 检查是否已包含心理实验链接
        if (config.searchPatterns.hasExperimentLink.test(content)) {
            console.log(`[跳过] ${filePath} - 已包含心理实验链接`);
            stats.skippedFiles++;
            return false;
        }
        
        let isUpdated = false;
        
        // 更新桌面端更多服务菜单 - 主要模式（适配index.html中的实际结构）
        if (config.searchPatterns.desktopMoreMenuMain.test(content)) {
            content = content.replace(config.searchPatterns.desktopMoreMenuMain, (match) => {
                // 在菜单末尾添加心理实验链接（在</div>之前）
                return match.replace('</div>', `${config.experimentLinkHtml}\n                    </div>`);
            });
            isUpdated = true;
            console.log(`[更新] ${filePath} - 桌面端更多服务菜单（主要模式）已更新`);
        }
        
        // 尝试备用模式1
        if (!isUpdated && config.searchPatterns.desktopMoreMenu1.test(content)) {
            content = content.replace(config.searchPatterns.desktopMoreMenu1, (match) => {
                return match.replace('</div>', `${config.experimentLinkHtml}\n                    </div>`);
            });
            isUpdated = true;
            console.log(`[更新] ${filePath} - 桌面端更多服务菜单（备用模式1）已更新`);
        }
        
        // 尝试备用模式2
        if (!isUpdated && config.searchPatterns.desktopMoreMenu2.test(content)) {
            content = content.replace(config.searchPatterns.desktopMoreMenu2, (match) => {
                return match.replace('</div>', `${config.experimentLinkHtml}\n                    </div>`);
            });
            isUpdated = true;
            console.log(`[更新] ${filePath} - 桌面端更多服务菜单（备用模式2）已更新`);
        }
        
        // 更新移动端导航菜单
        if (config.searchPatterns.mobileMenu.test(content)) {
            // 尝试找到心理游戏链接，在其后插入
            if (config.searchPatterns.mentalGamesLink.test(content)) {
                content = content.replace(config.searchPatterns.mentalGamesLink, (match) => {
                    return `${match}\n            ${config.mobileExperimentLinkHtml}`;
                });
                isUpdated = true;
                console.log(`[更新] ${filePath} - 移动端导航菜单已更新（插入心理游戏后）`);
            } else {
                // 如果找不到心理游戏链接，就在移动菜单的适当位置插入
                content = content.replace(config.searchPatterns.mobileMenu, (match) => {
                    // 在认证按钮之前插入
                    return match.replace('<div id="mobile-auth-buttons"', `${config.mobileExperimentLinkHtml}\n            <div id="mobile-auth-buttons"`);
                });
                isUpdated = true;
                console.log(`[更新] ${filePath} - 移动端导航菜单已更新（插入认证按钮前）`);
            }
        }
        
        // 特殊处理：为所有实验页面添加导航栏脚本引用
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
        
        const fileName = path.basename(filePath);
        if (experimentPages.includes(fileName) && !content.includes('update_experiment_navigation.js')) {
            // 在body标签结束前添加脚本引用
            const scriptTag = '<script src="update_experiment_navigation.js"></script>\n    </body>';
            content = content.replace('</body>', scriptTag);
            
            // 添加响应式样式引用
            if (!content.includes('experiments-responsive.css')) {
                const cssTag = '<link rel="stylesheet" href="experiments-responsive.css">';
                content = content.replace('</head>', `${cssTag}\n</head>`);
            }
            
            isUpdated = true;
            console.log(`[更新] ${filePath} - 添加了导航栏同步脚本和响应式样式`);
        }
        
        // 保存更新后的内容
        if (isUpdated) {
            fs.writeFileSync(filePath, content, 'utf8');
            stats.updatedFiles++;
            console.log(`[保存] ${filePath} - 更新完成`);
            return true;
        } else {
            console.log(`[跳过] ${filePath} - 未找到需要更新的导航菜单`);
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
    console.log('开始批量更新导航栏...');
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
            updateNavbar(filePath);
        });
        
        // 显示统计信息
        console.log('=' * 60);
        console.log('更新完成！');
        console.log(`总文件数: ${stats.totalFiles}`);
        console.log(`成功更新: ${stats.updatedFiles}`);
        console.log(`跳过文件: ${stats.skippedFiles}`);
        console.log(`错误文件: ${stats.errorFiles}`);
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
    updateNavbar,
    readHtmlFiles,
    main
};