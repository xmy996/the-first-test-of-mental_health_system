const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
  // 导航栏模板文件路径
  navbarTemplatePath: path.join(__dirname, 'components', 'unified_navbar.html'),
  // 前端目录路径
  frontendDir: __dirname,
  // 忽略的文件列表
  ignoreFiles: ['unified_template.html', 'page_template.html', 'footer.html', 'navbar.html'],
  // 忽略的目录列表
  ignoreDirs: ['components', 'css', 'js', 'node_modules']
};

/**
 * 读取导航栏模板内容
 * @returns {string} 导航栏HTML内容
 */
function readNavbarTemplate() {
  try {
    const templateContent = fs.readFileSync(CONFIG.navbarTemplatePath, 'utf8');
    console.log('✅ 成功读取导航栏模板');
    return templateContent;
  } catch (error) {
    console.error('❌ 读取导航栏模板失败:', error.message);
    process.exit(1);
  }
}

/**
 * 判断是否需要忽略该文件或目录
 * @param {string} name 文件名或目录名
 * @param {string[]} ignoreList 忽略列表
 * @returns {boolean} 是否忽略
 */
function shouldIgnore(name, ignoreList) {
  return ignoreList.some(ignore => 
    name === ignore || name.startsWith(ignore + '.')
  );
}

/**
 * 递归获取所有HTML文件
 * @param {string} dir 目录路径
 * @param {string[]} fileList 文件列表
 * @returns {string[]} HTML文件路径列表
 */
function getAllHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    // 如果是目录，且不在忽略列表中，则递归遍历
    if (stat.isDirectory()) {
      if (!shouldIgnore(file, CONFIG.ignoreDirs)) {
        getAllHtmlFiles(filePath, fileList);
      }
    } 
    // 如果是HTML文件，且不在忽略列表中，则添加到列表
    else if (path.extname(file) === '.html' && !shouldIgnore(file, CONFIG.ignoreFiles)) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

/**
 * 更新单个HTML文件的导航栏
 * @param {string} filePath HTML文件路径
 * @param {string} navbarTemplate 导航栏模板内容
 * @returns {boolean} 是否成功更新
 */
function updateNavbarInFile(filePath, navbarTemplate) {
  try {
    let fileContent = fs.readFileSync(filePath, 'utf8');
    
    // 创建备份
    const backupPath = filePath + '.backup';
    fs.writeFileSync(backupPath, fileContent, 'utf8');
    
    // 查找并替换导航栏
    // 首先尝试查找现有的导航栏（从<nav id="main-nav">开始到</nav>结束）
    const navRegex = /<nav\s+id="main-nav"[\s\S]*?<\/nav>/i;
    let updated = false;
    
    if (navRegex.test(fileContent)) {
      fileContent = fileContent.replace(navRegex, navbarTemplate);
      updated = true;
    } else {
      // 如果没有找到导航栏，则尝试在<body>标签后插入
      const bodyRegex = /<body[^>]*>/i;
      if (bodyRegex.test(fileContent)) {
        fileContent = fileContent.replace(bodyRegex, `$&\n${navbarTemplate}`);
        updated = true;
      }
    }
    
    if (updated) {
      fs.writeFileSync(filePath, fileContent, 'utf8');
      console.log(`✅ 已更新: ${filePath}`);
      return true;
    } else {
      console.log(`⚠️  无法更新: ${filePath} - 未找到可替换的导航栏部分`);
      return false;
    }
  } catch (error) {
    console.error(`❌ 更新失败: ${filePath} - ${error.message}`);
    return false;
  }
}

/**
 * 执行更新操作
 */
function runUpdate() {
  console.log('开始更新所有HTML文件的导航栏...');
  console.log('======================================');
  
  // 读取导航栏模板
  const navbarTemplate = readNavbarTemplate();
  
  // 获取所有HTML文件
  console.log('\n🔍 扫描HTML文件...');
  const htmlFiles = getAllHtmlFiles(CONFIG.frontendDir);
  console.log(`✅ 找到 ${htmlFiles.length} 个HTML文件`);
  
  // 更新每个文件
  console.log('\n🔄 开始更新导航栏...');
  const results = {
    success: 0,
    failed: 0,
    skipped: 0
  };
  
  htmlFiles.forEach(filePath => {
    const success = updateNavbarInFile(filePath, navbarTemplate);
    if (success) {
      results.success++;
    } else {
      results.failed++;
    }
  });
  
  // 显示结果摘要
  console.log('\n======================================');
  console.log('✅ 更新完成!');
  console.log(`✅ 成功: ${results.success}`);
  console.log(`❌ 失败: ${results.failed}`);
  console.log(`💡 备份文件已创建 (.backup 后缀)`);
  console.log('======================================');
}

/**
 * 显示使用帮助
 */
function showHelp() {
  console.log('用法: node update_all_navbars.js [选项]');
  console.log('');
  console.log('选项:');
  console.log('  --help, -h    显示此帮助信息');
  console.log('  --dry-run, -d 执行预演模式，不实际修改文件');
  console.log('');
  console.log('此脚本将更新前端目录中所有HTML文件的导航栏为统一的标准模板。');
  console.log('更新前会自动创建备份文件（.backup 后缀）。');
}

// 主程序入口
function main() {
  // 检查命令行参数
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }
  
  runUpdate();
}

// 执行主程序
main();