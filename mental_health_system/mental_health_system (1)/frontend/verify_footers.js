// 验证所有页脚是否符合图3的样式要求
const fs = require('fs');
const path = require('path');

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
console.log(`找到 ${htmlFiles.length} 个HTML文件需要验证页脚`);

// 验证标准
const validationCriteria = [
    { pattern: 'bg-[#1e293b]', description: '深色背景' },
    { pattern: 'bg-purple-500', description: '紫色圆形背景' },
    { pattern: 'fa fa-heart', description: '心形图标' },
    { pattern: '© 2025 心社区心理健康支持中心. 保留所有权利.', description: '版权信息' },
    { pattern: 'fa fa-weixin', description: '微信图标' },
    { pattern: 'fa fa-weibo', description: '微博图标' },
    { pattern: 'fa fa-bell', description: '通知图标' },
    { pattern: 'text-white', description: '白色文字' }
];

// 统计信息
let totalFiles = htmlFiles.length;
let validFiles = 0;
let invalidFiles = 0;
let missingFooterFiles = [];
let invalidFooterFiles = [];

// 验证每个文件
htmlFiles.forEach(filePath => {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const fileName = path.basename(filePath);
        
        if (!content.includes('<footer')) {
            missingFooterFiles.push(fileName);
            invalidFiles++;
            return;
        }
        
        // 提取页脚内容
        const footerMatch = content.match(/<footer[^>]*>.*?<\/footer>/s);
        if (!footerMatch) {
            missingFooterFiles.push(fileName);
            invalidFiles++;
            return;
        }
        
        const footerContent = footerMatch[0];
        let isValid = true;
        let missingCriteria = [];
        
        // 验证所有标准
        validationCriteria.forEach(criteria => {
            if (!footerContent.includes(criteria.pattern)) {
                isValid = false;
                missingCriteria.push(criteria.description);
            }
        });
        
        if (isValid) {
            validFiles++;
        } else {
            invalidFooterFiles.push({
                file: fileName,
                missing: missingCriteria
            });
            invalidFiles++;
        }
    } catch (err) {
        console.error(`验证文件 ${path.basename(filePath)} 失败:`, err);
        invalidFiles++;
    }
});

// 输出验证结果
console.log('\n=== 页脚验证结果 ===');
console.log(`总文件数: ${totalFiles}`);
console.log(`有效页脚文件数: ${validFiles}`);
console.log(`无效页脚文件数: ${invalidFiles}`);

if (missingFooterFiles.length > 0) {
    console.log('\n缺少页脚的文件:');
    missingFooterFiles.forEach(file => console.log(`- ${file}`));
}

if (invalidFooterFiles.length > 0) {
    console.log('\n页脚不符合图3样式的文件:');
    invalidFooterFiles.forEach(item => {
        console.log(`- ${item.file}:`);
        item.missing.forEach(miss => console.log(`  缺少: ${miss}`));
    });
}

if (invalidFiles === 0) {
    console.log('\n✅ 恭喜！所有页脚都符合图3的样式要求！');
} else {
    console.log('\n❌ 存在不符合要求的页脚，需要修复！');
}