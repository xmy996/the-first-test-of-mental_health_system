// 重新更新所有HTML文件中的页脚样式，统一采用图3的样式
const fs = require('fs');
const path = require('path');

// 读取更新后的页脚组件内容
const footerPath = path.join(__dirname, 'components', 'footer.html');
let newFooterContent;

try {
    newFooterContent = fs.readFileSync(footerPath, 'utf8');
    console.log('成功读取最新的页脚组件');
} catch (err) {
    console.error('读取页脚组件失败:', err);
    process.exit(1);
}

// 获取frontend目录下所有HTML文件
function getHtmlFiles(dir, files = []) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stats = fs.statSync(fullPath);
        
        if (stats.isDirectory() && !item.startsWith('.') && item !== 'node_modules' && item !== 'components') {
            getHtmlFiles(fullPath, files);
        } else if (stats.isFile() && path.extname(item) === '.html') {
            files.push(fullPath);
        }
    }
    
    return files;
}

const htmlFiles = getHtmlFiles(__dirname);
console.log(`找到 ${htmlFiles.length} 个HTML文件需要更新页脚`);

// 更新每个HTML文件
let updatedCount = 0;
let skippedCount = 0;

htmlFiles.forEach(filePath => {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // 检查文件是否包含页脚
        if (content.includes('<footer')) {
            // 使用更精确的正则表达式替换现有的页脚
            // 匹配从注释到</footer>结束的整个页脚部分
            const footerRegex = /<!--\s*统一页脚组件\s*-->\s*<footer[^>]*>.*?<\/footer>/gs;
            
            if (footerRegex.test(content)) {
                const updatedContent = content.replace(footerRegex, newFooterContent);
                
                if (updatedContent !== content) {
                    fs.writeFileSync(filePath, updatedContent, 'utf8');
                    updatedCount++;
                    console.log(`已更新: ${path.basename(filePath)}`);
                } else {
                    skippedCount++;
                }
            } else {
                // 处理没有标准注释的页脚
                const altFooterRegex = /<footer[^>]*>.*?<\/footer>/gs;
                if (altFooterRegex.test(content)) {
                    const updatedContent = content.replace(altFooterRegex, newFooterContent);
                    fs.writeFileSync(filePath, updatedContent, 'utf8');
                    updatedCount++;
                    console.log(`已更新非标准页脚: ${path.basename(filePath)}`);
                }
            }
        } else {
            // 如果文件没有页脚，在body结束前添加
            if (content.includes('</body>')) {
                const updatedContent = content.replace('</body>', `${newFooterContent}\n</body>`);
                fs.writeFileSync(filePath, updatedContent, 'utf8');
                updatedCount++;
                console.log(`已添加页脚: ${path.basename(filePath)}`);
            } else {
                skippedCount++;
            }
        }
    } catch (err) {
        console.error(`处理文件 ${path.basename(filePath)} 失败:`, err);
        skippedCount++;
    }
});

console.log(`\n页脚更新完成！`);
console.log(`- 成功更新: ${updatedCount} 个文件`);
console.log(`- 跳过: ${skippedCount} 个文件`);
console.log('\n所有页脚已统一为图3的样式，包含：');
console.log('- 深色背景 (#1e293b)');
console.log('- 左侧紫色圆形背景的心形图标和"心社区"文字');
console.log('- 中间白色文字的版权信息');
console.log('- 右侧微信、微博和通知图标');