const fs = require('fs');
const path = require('path');

// 修复图标类中重复的margin类问题
function fixIconMarginDuplicates() {
    const frontendDir = '.';
    let totalFiles = 0;
    let processedFiles = 0;
    let fixedFiles = 0;
    let errorFiles = [];

    // 遍历前端目录中的所有HTML文件
    function processDirectory(directory) {
        const files = fs.readdirSync(directory);
        
        files.forEach(file => {
            const filePath = path.join(directory, file);
            const stats = fs.statSync(filePath);
            
            if (stats.isDirectory() && !filePath.includes('node_modules') && !filePath.includes('.git')) {
                processDirectory(filePath); // 递归处理子目录
            } else if (file.endsWith('.html')) {
                totalFiles++;
                processHTMLFile(filePath);
            }
        });
    }

    // 处理单个HTML文件
    function processHTMLFile(filePath) {
        try {
            let content = fs.readFileSync(filePath, 'utf8');
            let hasChanges = false;

            // 修复重复的 mr-1 类
            const duplicateMr1Regex = /class="([^"]*?)mr-1\s+mr-1([^"]*?)"/g;
            if (duplicateMr1Regex.test(content)) {
                content = content.replace(duplicateMr1Regex, 'class="$1mr-1$2"');
                hasChanges = true;
            }

            // 修复重复的 mr-2 类
            const duplicateMr2Regex = /class="([^"]*?)mr-2\s+mr-2([^"]*?)"/g;
            if (duplicateMr2Regex.test(content)) {
                content = content.replace(duplicateMr2Regex, 'class="$1mr-2$2"');
                hasChanges = true;
            }

            if (hasChanges) {
                fs.writeFileSync(filePath, content, 'utf8');
                fixedFiles++;
                console.log(`已修复: ${filePath} (重复margin类)`);
            }
            
            processedFiles++;
        } catch (error) {
            console.error(`处理文件出错 ${filePath}:`, error.message);
            errorFiles.push({ path: filePath, error: error.message });
        }
    }

    // 开始处理
    console.log('开始修复图标类中重复的margin类问题...');
    processDirectory(frontendDir);
    
    // 输出统计信息
    console.log('\n修复完成！');
    console.log(`总计文件: ${totalFiles}`);
    console.log(`处理文件: ${processedFiles}`);
    console.log(`修复文件: ${fixedFiles}`);
    console.log(`错误文件: ${errorFiles.length}`);
    
    if (errorFiles.length > 0) {
        console.log('\n错误详情:');
        errorFiles.forEach(file => {
            console.log(`- ${file.path}: ${file.error}`);
        });
    }
}

// 执行修复
fixIconMarginDuplicates();