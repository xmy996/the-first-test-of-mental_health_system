// 为缺少页脚的文件添加标准页脚
const fs = require('fs');
const path = require('path');

// 读取标准页脚内容
const footerPath = path.join(__dirname, 'components', 'footer.html');
let footerContent;

try {
    footerContent = fs.readFileSync(footerPath, 'utf8');
    console.log('成功读取标准页脚组件');
} catch (err) {
    console.error('读取页脚组件失败:', err);
    process.exit(1);
}

// 需要添加页脚的文件列表
const filesToUpdate = ['activity_list_updated.html'];

let updatedCount = 0;

filesToUpdate.forEach(fileName => {
    const filePath = path.join(__dirname, fileName);
    
    try {
        if (fs.existsSync(filePath)) {
            let content = fs.readFileSync(filePath, 'utf8');
            
            // 检查是否已经有页脚
            if (!content.includes('<footer')) {
                // 在body结束前添加页脚
                if (content.includes('</body>')) {
                    const updatedContent = content.replace('</body>', `${footerContent}\n</body>`);
                    fs.writeFileSync(filePath, updatedContent, 'utf8');
                    updatedCount++;
                    console.log(`已为 ${fileName} 添加页脚`);
                } else {
                    console.log(`警告: ${fileName} 中未找到 </body> 标签`);
                }
            } else {
                console.log(`${fileName} 已经有页脚`);
            }
        } else {
            console.log(`警告: 文件 ${fileName} 不存在`);
        }
    } catch (err) {
        console.error(`处理文件 ${fileName} 失败:`, err);
    }
});

console.log(`\n处理完成！共为 ${updatedCount} 个文件添加了页脚。`);