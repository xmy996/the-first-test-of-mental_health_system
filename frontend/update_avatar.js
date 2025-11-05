// 更新所有文件中"心社区"旁边的头像为紫色圆形背景的心形图标
const fs = require('fs');
const path = require('path');

// 获取frontend目录下所有HTML文件
function getHtmlFiles(dir, files = []) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stats = fs.statSync(fullPath);
        
        if (stats.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
            getHtmlFiles(fullPath, files);
        } else if (stats.isFile() && path.extname(item) === '.html') {
            files.push(fullPath);
        }
    }
    
    return files;
}

const htmlFiles = getHtmlFiles(__dirname);
console.log(`找到 ${htmlFiles.length} 个HTML文件需要检查更新头像`);

// 新的头像HTML
const newAvatarHtml = `<span class="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500 text-white mr-2">
    <i class="fa fa-heart"></i>
</span>`;

let updatedCount = 0;

// 更新每个HTML文件中的头像
htmlFiles.forEach(filePath => {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // 查找包含"心社区"的头像相关元素并替换
        // 匹配常见的头像模式
        const avatarRegex1 = /<span[^>]*>(?:<i\s+class="fa[^>]*"><\/i>|<img[^>]*>)<\/span>\s*<span[^>]*>心社区<\/span>/g;
        const avatarRegex2 = /<i\s+class="fa[^>]*"><\/i>\s*<span[^>]*>心社区<\/span>/g;
        
        let updatedContent = content;
        let isUpdated = false;
        
        // 替换第一种模式
        if (avatarRegex1.test(content)) {
            updatedContent = content.replace(avatarRegex1, `${newAvatarHtml}<span class="text-lg font-medium">心社区</span>`);
            isUpdated = true;
        }
        // 替换第二种模式
        else if (avatarRegex2.test(content)) {
            updatedContent = content.replace(avatarRegex2, `${newAvatarHtml}<span class="text-lg font-medium">心社区</span>`);
            isUpdated = true;
        }
        
        // 更新页脚组件中的机构信息部分
        if (content.includes('<footer')) {
            const orgInfoRegex = /<div[^>]*class="[^>]*organization-info[^>]*">[^<]*<span[^>]*>(?:<i[^>]*><\/i>|<img[^>]*>)[^<]*<\/span>[^<]*<span[^>]*>心社区<\/span>/gs;
            if (orgInfoRegex.test(content)) {
                updatedContent = content.replace(orgInfoRegex, `<div class="organization-info flex items-center">
            ${newAvatarHtml}
            <span class="text-lg font-medium text-white">心社区</span>
        </div>`);
                isUpdated = true;
            }
        }
        
        if (isUpdated && updatedContent !== content) {
            fs.writeFileSync(filePath, updatedContent, 'utf8');
            updatedCount++;
            console.log(`已更新头像: ${path.basename(filePath)}`);
        }
    } catch (err) {
        console.error(`处理文件 ${path.basename(filePath)} 失败:`, err);
    }
});

console.log(`\n头像更新完成！共更新 ${updatedCount} 个文件。`);
console.log('所有"心社区"旁边的头像已更换为紫色圆形背景的心形图标。');