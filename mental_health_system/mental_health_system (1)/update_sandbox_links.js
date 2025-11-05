const fs = require('fs');
const path = require('path');

// 定义要搜索和替换的内容
const oldLink = 'sandbox_simulation.html';
const newLink = 'sandbox_simulation_immersive.html';

// 定义前端目录路径
const frontendDir = path.join(__dirname, 'frontend');

// 记录已更新的文件
const updatedFiles = [];

// 递归遍历目录函数
function traverseDirectory(directory) {
  // 读取目录内容
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const fullPath = path.join(directory, file);
    const stats = fs.statSync(fullPath);
    
    // 如果是目录，递归处理
    if (stats.isDirectory()) {
      // 跳过node_modules等不需要搜索的目录
      if (file !== 'node_modules' && file !== '.git') {
        traverseDirectory(fullPath);
      }
    } 
    // 如果是HTML文件，进行替换操作
    else if (path.extname(file) === '.html') {
      try {
        // 读取文件内容
        let content = fs.readFileSync(fullPath, 'utf8');
        
        // 检查文件是否包含旧链接
        if (content.includes(oldLink)) {
          // 替换所有旧链接为新链接
          const updatedContent = content.replace(new RegExp(oldLink, 'g'), newLink);
          
          // 写入更新后的内容
          fs.writeFileSync(fullPath, updatedContent, 'utf8');
          
          // 记录已更新的文件
          updatedFiles.push(fullPath);
          console.log(`已更新: ${fullPath}`);
        }
      } catch (error) {
        console.error(`处理文件时出错 ${fullPath}:`, error.message);
      }
    }
  });
}

// 开始遍历前端目录
console.log(`开始更新所有HTML文件中的沙盘模拟链接...`);
traverseDirectory(frontendDir);

// 输出更新结果
console.log('\n更新完成!');
console.log(`总共更新了 ${updatedFiles.length} 个文件。`);
if (updatedFiles.length > 0) {
  console.log('\n已更新的文件列表:');
  updatedFiles.forEach(file => {
    console.log(`- ${file}`);
  });
} else {
  console.log('没有找到需要更新的文件。');
}