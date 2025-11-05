const fs = require('fs');
const path = require('path');

// 修复注册按钮图标中重复的margin类
function fixIconMarginIssue() {
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

            // 修复注册按钮中图标类的重复margin问题
            const duplicateMarginRegex = /<i\s+class="([^"]*?)mr-1\s+mr-2([^"]*?)"/g;
            
            if (duplicateMarginRegex.test(content)) {
                content = content.replace(duplicateMarginRegex, '<i class="$1mr-2$2"');
                hasChanges = true;
            }

            if (hasChanges) {
                fs.writeFileSync(filePath, content, 'utf8');
                fixedFiles++;
                console.log(`已修复图标margin问题: ${filePath}`);
            }
            
            processedFiles++;
        } catch (error) {
            console.error(`处理文件出错 ${filePath}:`, error.message);
            errorFiles.push({ path: filePath, error: error.message });
        }
    }

    // 开始处理
    console.log('开始修复注册按钮图标中重复的margin类问题...');
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
fixIconMarginIssue();