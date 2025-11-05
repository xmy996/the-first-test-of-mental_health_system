# 心社区心理健康支持系统

## 项目概述

心社区心理健康支持系统是一个专为社区居民提供心理健康服务的平台，包含心理测评、咨询服务、团体活动和放松体验等功能模块，旨在帮助用户关注和改善心理健康状况。系统支持普通用户访问和管理员管理，提供全方位的心理健康支持服务。

## 项目结构

```
mental_health_system/
├── frontend/           # 前端代码
│   ├── index.html              # 首页
│   ├── login.html              # 登录页
│   ├── register.html           # 注册页
│   ├── forgot_password.html    # 忘记密码页
│   ├── user_profile.html       # 个人中心
│   ├── assessment_list.html    # 测评列表
│   ├── assessment_detail.html  # 测评详情
│   ├── assessment_result.html  # 测评结果
│   ├── assessment_history.html # 测评记录
│   ├── consultant_list.html    # 咨询师列表
│   ├── booking.html            # 预约咨询
│   ├── booking_history.html    # 预约记录
│   ├── activity_list.html      # 活动列表
│   ├── activity_detail.html    # 活动详情
│   ├── activity_registration.html # 活动报名
│   ├── relaxation_music.html   # 放松音乐
│   ├── relaxation_meditation.html # 冥想指导
│   ├── relaxation_biofeedback.html # 生物反馈训练
│   ├── admin_login.html        # 管理员登录
│   ├── admin_dashboard.html    # 管理后台
│   ├── user_management.html    # 用户管理
│   ├── assessment_management.html # 测评管理
│   ├── consultant_management.html # 咨询师管理
│   ├── booking_management.html # 预约管理
│   ├── activity_management.html # 活动管理
│   ├── system_settings.html    # 系统设置
│   ├── common.js               # 通用功能模块
│   ├── common.css              # 通用样式
│   ├── api.js                  # API服务模块
│   ├── ai-assistant.js         # AI助手功能
│   └── README.md               # 前端说明文档
├── backend/            # 后端代码
│   ├── server.js       # 服务器入口
│   ├── .env            # 环境配置
│   ├── config/         # 配置文件
│   ├── models/         # 数据模型
│   ├── routes/         # API路由
│   └── package.json    # 依赖配置
└── README.md           # 项目说明文档
```

## 主要功能

### 1. 用户系统
- 用户注册与登录
- 个人资料管理
- 密码修改与找回
- 权限控制（普通用户/管理员）

### 2. 心理测评
- 情绪健康测评
- 心理健康测评
- 压力水平测评
- 测评结果分析与建议
- 测评历史记录查询与管理

### 3. 咨询服务
- 咨询师列表展示与筛选
- 咨询师详情查看
- 在线预约咨询
- 预约记录管理（查看、取消）

### 4. 团体活动
- 活动列表展示与搜索
- 活动详情查看
- 在线活动报名
- 报名记录管理

### 5. 放松体验
- 放松音乐播放
- 冥想指导练习
- 生物反馈训练

### 6. AI心理助手
- 24小时在线咨询
- 心理健康知识问答
- 情绪支持与建议

### 7. 管理后台
- 用户管理（查看、编辑、禁用）
- 活动管理（创建、编辑、发布、取消）
- 测评管理（创建、编辑、发布）
- 咨询师管理（添加、编辑、管理）
- 预约管理（查看、确认、取消）
- 数据统计与分析
- 系统设置

## 技术栈

### 前端
- HTML5 + CSS3 + JavaScript
- Tailwind CSS v3 (样式框架)
- Font Awesome (图标库)
- Chart.js (数据可视化)

### 后端
- Node.js (运行环境)
- Express (Web框架)
- MongoDB (数据库)

## 快速开始

### 前端运行
1. 进入frontend目录：`cd frontend`
2. 使用Python HTTP服务器启动：`python -m http.server 8080`
3. 浏览器访问：`http://localhost:8080/index.html`

### 后端运行
1. 进入backend目录：`cd backend`
2. 安装依赖：`npm install`
3. 配置环境变量：复制`.env.example`为`.env`并配置相关参数
4. 启动服务器：`npm start`
5. 后端服务默认运行在：`http://localhost:3000`

## 导航栏逻辑说明

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

## 注意事项

1. 项目依赖于Tailwind CSS，确保网络环境可访问CDN资源
2. 后端服务需要MongoDB数据库支持
3. 环境变量配置对系统正常运行至关重要
4. 所有页面的导航栏结构必须遵循规范，以确保统一的用户体验
5. 不要在非首页页面的导航栏中硬编码登录/注册/管理员入口

## 系统维护

1. 定期检查日志文件，监控系统运行状态
2. 及时备份数据库，防止数据丢失
3. 定期更新依赖包，修复安全漏洞
4. 关注用户反馈，持续优化系统功能和用户体验

## 联系我们

如有任何问题或建议，请联系项目维护团队。
