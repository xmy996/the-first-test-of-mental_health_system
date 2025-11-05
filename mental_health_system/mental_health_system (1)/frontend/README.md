# 心社区心理健康支持系统 - 前端说明文档

## 前端项目概述

本目录包含心社区心理健康支持系统的前端代码，负责用户界面展示和交互逻辑。前端采用现代Web技术栈构建，确保良好的用户体验和响应式设计。

## 前端文件结构

```
frontend/
├── index.html              # 首页
├── login.html              # 登录页
├── register.html           # 注册页
├── forgot_password.html    # 忘记密码页
├── user_profile.html       # 个人中心
├── assessment_list.html    # 测评列表
├── assessment_detail.html  # 测评详情
├── assessment_result.html  # 测评结果
├── assessment_history.html # 测评记录
├── consultant_list.html    # 咨询师列表
├── booking.html            # 预约咨询
├── booking_history.html    # 预约记录
├── activity_list.html      # 活动列表
├── activity_detail.html    # 活动详情
├── activity_registration.html # 活动报名
├── relaxation_music.html   # 放松音乐
├── relaxation_meditation.html # 冥想指导
├── relaxation_biofeedback.html # 生物反馈训练
├── admin_login.html        # 管理员登录
├── admin_dashboard.html    # 管理后台
├── user_management.html    # 用户管理
├── assessment_management.html # 测评管理
├── consultant_management.html # 咨询师管理
├── booking_management.html # 预约管理
├── activity_management.html # 活动管理
├── system_settings.html    # 系统设置
├── common.js               # 通用功能模块
├── common.css              # 通用样式
├── api.js                  # API服务模块
├── ai-assistant.js         # AI助手功能
├── test_navigation.html    # 导航测试页面
├── test_all_features.html  # 功能测试页面
└── README.md               # 前端说明文档
```

## 导航栏逻辑规范

### 导航栏行为规则
- 登录/注册按钮和管理员入口**仅在首页(index.html)显示**
- 其他页面自动隐藏登录/注册相关按钮
- 用户登录后显示用户菜单，未登录时根据页面显示相应导航元素

### 页面结构要求
为确保导航栏逻辑正常工作，所有页面必须满足以下结构要求：

1. **桌面端登录/注册按钮容器**必须有 `id="auth-buttons"`
2. **移动端登录/注册按钮容器**必须有 `id="mobile-auth-buttons"`
3. 管理员入口链接应包含在 `auth-buttons` 容器中，以便统一控制显示/隐藏
4. 所有页面都必须引入 `common.js` 文件以确保导航栏逻辑正常工作

### 验证方法
1. 访问测试页面：`test_navigation.html`
2. 点击不同页面链接，验证导航栏显示效果
3. 使用"模拟登录"和"模拟退出"按钮测试用户登录状态下的导航栏行为

## 前端技术栈

- **HTML5**：页面结构和语义
- **CSS3**：样式和动画效果
- **JavaScript**：交互逻辑和动态内容
- **Tailwind CSS v3**：实用优先的CSS框架，提供响应式设计支持
- **Font Awesome**：图标库，丰富界面元素
- **Chart.js**：数据可视化库，用于展示测评结果和统计数据

## 前端启动与运行

1. 进入frontend目录：`cd frontend`
2. 使用Python HTTP服务器启动：`python -m http.server 8080`
3. 浏览器访问：`http://localhost:8080/index.html`

## 核心功能模块

### 1. 导航系统 (common.js)
- 页面导航与路由
- 登录状态管理
- 响应式菜单切换
- 导航栏元素显示控制

### 2. API服务 (api.js)
- 与后端服务通信
- 数据请求和响应处理
- 错误处理和状态反馈

### 3. UI组件
- 响应式导航栏
- 表单验证
- 模态对话框
- 数据列表和分页
- 图表和数据可视化

### 4. 用户交互
- 登录/注册流程
- 表单提交与验证
- 模态框交互
- 异步数据加载

## 开发注意事项

1. **导航栏结构一致性**：所有页面必须使用统一的导航栏结构，遵循ID命名规范
2. **响应式设计**：确保页面在不同设备上都能正常显示和使用
3. **错误处理**：添加适当的错误提示和边界情况处理
4. **性能优化**：
   - 减少不必要的DOM操作
   - 优化图片和资源加载
   - 使用异步加载提升性能
5. **代码规范**：
   - 使用语义化的HTML标签
   - 遵循一致的命名规范
   - 添加必要的注释

## 测试和调试

### 导航功能测试
使用`test_navigation.html`页面测试导航栏在不同页面和登录状态下的显示行为。

### 全功能测试
使用`test_all_features.html`页面测试系统的各项功能是否正常工作。

### 常见问题排查
1. 导航栏显示异常：检查页面是否引入`common.js`，登录/注册按钮容器ID是否正确
2. API调用失败：检查后端服务是否运行，网络连接是否正常
3. 样式显示问题：确保Tailwind CSS正确加载，类名使用是否规范

## 前端维护

1. 定期检查并更新依赖库
2. 优化用户界面和交互体验
3. 修复已知bug和兼容性问题
4. 根据用户反馈持续改进功能和界面
