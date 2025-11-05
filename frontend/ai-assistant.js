// AI智能小助手组件 - 增强版
class AIAssistant {
    constructor() {
        this.container = null;
        this.chatWindow = null;
        this.chatMessages = null;
        this.messageInput = null;
        this.sendButton = null;
        this.toggleButton = null;
        this.isOpen = false;
        this.isTyping = false;
        this.isProcessing = false;
        this.responseReceived = false;
        this.responseTimeout = 10000; // 10秒响应超时
        // 管理器引用
        this.manager = null;
        
        // 添加对话历史记录，用于多轮对话
        this.conversationHistory = [];
        
        // 同义词词典，用于增强意图识别
        this.synonyms = {
            "心理健康": ["心理状态", "心理健康状况", "心理卫生"],
            "焦虑症": ["焦虑", "焦虑障碍", "过度担忧"],
            "抑郁症": ["抑郁", "忧郁", "情绪低落"],
            "预约": ["预定", "挂号", "安排"],
            "咨询": ["问诊", "询问", "了解"],
            "服务": ["项目", "内容", "业务"],
            "费用": ["价格", "收费", "多少钱"],
            "时间": ["时长", "多久", "何时"],
            "取消": ["退订", "撤销", "取消预约"],
            "帮助": ["协助", "援助", "支持"],
            "紧急": ["危机", "紧急情况", "急需"],
            "自杀": ["轻生", "不想活", "结束生命"],
            "抑郁": ["难过", "不开心", "伤心"],
            "放松": ["减压", "舒缓", "释放压力"],
            "冥想": ["正念", "打坐", "静修"]
        };
        
        // 常见停用词，用于文本预处理
        this.stopWords = ["的", "了", "和", "是", "在", "我", "有", "你", "他", "她", "它", "这", "那", "我们", "你们", "他们", "她们", "它们", "一个", "这个", "那个", "一些", "什么", "怎么", "为什么", "吗", "呢", "啊", "呀", "吧", "哦", "嗯", "哼", "哈", "嗨", "嘿", "喂"];
        
        // 预设问答库
        this.knowledgeBase = {
            // 心理健康知识
            "什么是心理健康": "心理健康是指一个人的心理状态良好，能够适应生活中的各种压力和挑战，保持积极的情绪和良好的人际关系。心理健康它包括情绪健康、认知健康、社交健康等多个方面。",
            
            "心理健康的重要性": "心理健康对个人的整体健康至关重要。良好的心理健康可以帮助我们更好地应对压力，提高工作和学习效率，建立和维护良好的人际关系，以及享受生活的乐趣。",
            
            "如何保持心理健康": "保持心理健康的方法包括：\n1. 保持积极的生活态度\n2. 建立良好的人际关系\n3. 保持均衡的饮食和充足的睡眠\n4. 定期适当的体育锻炼\n5. 学习有效的压力管理技巧\n6. 寻求专业帮助（如有需要）",
            
            "什么是焦虑症": "焦虑症是一种常见的心理健康问题，表现为过度的担忧、恐惧或不安。症状可能包括心悸、呼吸急促、出汗、肌肉紧张、注意力不集中等。焦虑症可以通过心理治疗、药物治疗或两者结合来治疗。",
            
            "什么是抑郁症": "抑郁症是一种常见的心理健康问题，表现为持续的悲伤、失去兴趣或愉悦感、精力下降、睡眠或食欲改变、自我价值感降低等。抑郁症可以通过心理治疗、药物治疗或两者结合来治疗。",
            
            "什么是正念冥想": "正念冥想是一种通过专注于当下的体验，培养觉察力和接纳态度的练习。它可以帮助减轻压力、改善注意力、增强情绪调节能力。",
            
            // 新增：情绪管理
            "如何管理负面情绪": "管理负面情绪的有效方法包括：\n\n1. 情绪觉察：识别并命名自己的情绪\n2. 深呼吸技巧：4-7-8呼吸法有助于快速冷静\n3. 认知重构：挑战负面思维模式\n4. 表达情绪：通过写日记、绘画或与他人分享\n5. 身体活动：运动能释放内啡肽，改善情绪\n6. 寻求社会支持：与亲友交流或专业帮助\n\n记住，所有情绪都是正常的，关键是如何健康地表达和调节它们。",
            
            "什么是情绪调节": "情绪调节是指我们如何影响自己感受何种情绪、何时感受这些情绪，以及如何体验和表达这些情绪的过程。良好的情绪调节能力有助于我们更好地应对生活中的挑战，维护心理健康。",
            
            // 新增：自我成长与个人发展
            "如何提高自信心": "提高自信心的方法：\n\n1. 设定并实现小目标，积累成功经验\n2. 关注自己的优点和成就\n3. 挑战自我否定的想法\n4. 学习新技能，拓展舒适区\n5. 照顾自己的身体，保持健康生活方式\n6. 与支持和鼓励你的人交往\n7. 接受失败是学习的机会\n\n自信是可以通过练习和努力逐渐建立的。",
            
            "如何培养积极心态": "培养积极心态的策略：\n\n1. 感恩练习：每天记录3-5件值得感恩的事\n2. 积极肯定：用积极的自我对话替代消极想法\n3. 关注解决方案而非问题\n4. 培养兴趣爱好，寻找生活乐趣\n5. 设定有意义的目标\n6. 与积极向上的人交往\n7. 练习正念，专注当下\n\n积极心态不是否定困难，而是在面对困难时仍能保持希望和韧性。",
            
            "什么是自我接纳": "自我接纳是指无条件地接受自己的全部，包括优点和不足，成就和失败，而不因此批判或贬低自己。自我接纳是心理健康的重要组成部分，也是个人成长的基础。\n\n自我接纳不是自满，而是认识到自己的价值，同时保持成长和改善的意愿。",
            
            // 新增：工作与生活平衡
            "如何平衡工作与生活": "平衡工作与生活的建议：\n\n1. 设定明确的边界：工作时间与个人时间明确分开\n2. 时间管理：优先级排序，学会说\"不\"\n3. 定期休息：工作间隙短暂休息，避免 burnout\n4. 培养兴趣爱好：发展工作之外的生活内容\n5. 关注健康：定期运动，充足睡眠，均衡饮食\n6. 重视人际关系：保持与家人和朋友的联系\n7. 学会放松：掌握放松技巧，如冥想、深呼吸\n\n平衡是动态的过程，需要根据不同阶段进行调整。",
            
            "什么是工作倦怠": "工作倦怠是一种由长期工作压力导致的身心疲惫状态，主要表现为：\n\n1. 情感耗竭：感到情绪疲惫，无法应对工作要求\n2. 去个性化：对工作和服务对象产生疏离感\n3. 个人成就感降低：对自己的工作表现和价值产生怀疑\n\n预防工作倦怠需要合理安排工作负荷，寻求社会支持，培养健康的应对策略，以及保持工作与生活的平衡。",
            
            // 新增：人际关系与沟通
            "什么是有效沟通": "有效沟通是指信息能够准确、清晰地传递和理解的过程。有效沟通的关键要素包括：\n\n1. 清晰表达：使用简洁明了的语言\n2. 积极倾听：全神贯注，不打断对方\n3. 非语言沟通：注意肢体语言、面部表情和语调\n4. 同理心：理解对方的观点和感受\n5. 反馈：给予和接受建设性的反馈\n\n良好的沟通能力是建立健康人际关系的基础。",
            
            "如何处理人际关系冲突": "处理人际关系冲突的健康方式：\n\n1. 保持冷静：避免在情绪激动时做出反应\n2. 聚焦问题：针对具体行为而非人格攻击\n3. 使用\"我\"语言表达感受，如\"我感到...\"\n4. 倾听对方：尝试理解对方的观点\n5. 寻求共同点：寻找双方都能接受的解决方案\n6. 必要时寻求第三方调解\n\n健康的冲突解决有助于加深关系理解和建立信任。",
            
            // 新增：青少年心理健康
            "青少年心理健康的重要性": "青少年时期是身心发展的关键阶段，心理健康对青少年的成长至关重要。良好的心理健康有助于：\n\n1. 建立健康的自我认同\n2. 发展良好的人际关系\n3. 提高学习和适应能力\n4. 培养应对压力和挑战的能力\n5. 预防成年后的心理健康问题\n\n家庭、学校和社会的支持对青少年心理健康发展有着重要影响。",
            
            "如何帮助青少年应对压力": "帮助青少年应对压力的方法：\n\n1. 建立信任关系，创造开放交流的环境\n2. 教会情绪识别和表达\n3. 教授实用的压力管理技巧，如深呼吸、冥想\n4. 鼓励健康的生活方式：充足睡眠、均衡饮食、适量运动\n5. 帮助设定合理目标，避免过度压力\n6. 培养兴趣爱好，提供情感释放渠道\n7. 必要时寻求专业心理咨询帮助\n\n支持和理解是帮助青少年应对压力的重要基础。",
            
            // 新增：认知行为疗法基础
            "什么是认知行为疗法": "认知行为疗法(CBT)是一种循证的心理治疗方法，主要关注思维模式、情绪和行为之间的联系。CBT的核心原则是：我们的情绪和行为不仅受到事件本身的影响，更受到我们对事件的认知和解读的影响。\n\nCBT帮助人们识别和挑战消极或扭曲的思维模式，学习更健康的应对策略，从而改善情绪和行为。",
            
            "常见的认知扭曲有哪些": "常见的认知扭曲包括：\n\n1. 全或无思维：以极端方式看待事物（完美或失败）\n2. 过度概括：基于单一事件得出广泛结论\n3. 灾难化思维：夸大事件的负面后果\n4. 个人化：将无关事件归因于自己\n5. 选择性关注：只注意负面细节而忽略积极方面\n6. 情绪化推理：将感受当作事实\n7. 应该陈述：对自己或他人有不切实际的期望\n\n识别这些认知扭曲是改变负面思维模式的第一步。",
            
            // 新增：积极心理学
            "什么是积极心理学": "积极心理学是心理学的一个分支，关注人类的积极特质、幸福感和最优功能。与传统心理学关注问题和病理不同，积极心理学研究：\n\n1. 幸福和主观幸福感\n2. 性格优势和美德\n3. 积极情绪（如感激、快乐、满足）\n4. 意义和目标\n5. 积极的人际关系\n\n积极心理学旨在帮助人们不仅消除心理问题，还要实现个人成长和生活的充实感。",
            
            "如何增加幸福感": "增加幸福感的实用方法：\n\n1. 培养感恩：定期记录和表达感谢\n2. 实践善良：帮助他人，参与公益活动\n3. 发展技能：学习新事物，掌握新能力\n4. 建立联系：投资于亲密关系\n5. 设定目标：追求有意义的目标\n6. 关注当下：练习正念和享受当下\n7. 培养乐观：发展积极的思维方式\n\n幸福感是可以通过有意识的实践和培养来提升的。",
            
            // 关于我们的服务
            "你们提供哪些服务": "我们提供多种心理健康服务，包括：\n1. 心理测评：提供专业的心理健康评估\n2. 咨询服务：一对一心理咨询\n3. 团体活动：心理成长小组、工作坊等\n4. 放松体验：音乐治疗、冥想指导导、生物反馈训练",
            
            "如何预约咨询": "您可以通过以下步骤预约咨询：\n1. 在我们的网站上选择咨询师并预约\n2. 拨打我们的客服电话联系客服\n3. 直接到我们的社区中心预约",
            
            "咨询费用是多少": "我们的咨询费用根据咨询师的资历和经验有所不同，一般在200-500元/次（50分钟）。团体活动和放松体验的费用也有所不同，详情请查看我们的活动页面。",
            
            "你们的咨询师资质如何": "我们的咨询师都具有专业的心理学背景和丰富的临床经验，持有相关的专业资格证书。您可以在咨询师列表页面查看每位咨询师的详细介绍。",
            
            "如何参加团体活动": "您可以在我们的网站上查看即将举行的团体活动，并直接在线报名。报名成功后，我们会通过短信或邮件确认您的报名信息。",
            
            // 常见问题
            "如何注册账号": "您可以点击网站右上角的'注册'按钮，填写相关信息完成注册。注册成功后，您可以使用账号登录，预约咨询、参加活动等。",
            
            "如何找回密码": "如果您忘记了密码，可以可以点击登录页面的'忘记密码'链接，按照提示操作重置密码。您也可以联系我们的客服寻求帮助。",
            
            "如何取消预约": "您可以登录账号后，在'我的预约'页面取消已预约的咨询或活动。请注意，为了合理安排资源，建议提前24小时取消预约。",
            
            "你们的开放时间": "我们的社区中心开放时间为周一至周五 9:00-18:00，周六 9:00-16:00，周日休息。心理咨询和团体活动的具体时间可能有所不同，请查看具体的活动信息。",
            
            "如何联系你们": "您可以通过以下方式联系我们：\n1. 电话：400-123-4567\n2. 邮箱：contact@xinshequ.com\n3. 地址：北京市京市海淀区中关村大街1号\n4. 微信公众号：心社区心理健康支持中心",
            
            // 心理测评相关
            "心理测评有哪些类型": "我们提供多种类型的心理测评，包括：\n1. 心理健康状态评估\n2. 性格特质测评\n3. 情绪状态测评\n4. 压力水平测评\n5. 人际关系测评\n6. 职业兴趣测评",
            
            "测评结果如何解读": "测评完成后，系统会自动生成详细的测评报告，包括您的得分分解读、特点分析和建议。您也可以预约专业咨询师，获得一对一的测评结果解读服务。",
            
            "测评需要科学时间限制": "不同的测评有不同的时间限制，一般在10-30分钟之间。您可以根据自己的情况安排测评时间，建议在安静的环境中完成测评。",
            
            // 放松体验相关
            "什么是音乐治疗": "音乐治疗是一种利用音乐来促进身心健康的治疗方法。它通过音乐的节奏、旋律和和声等元素，影响人的情绪、认知和生理状态，从而达到放松、减压、改善睡眠、提升情绪等效果。",
            
            "什么是生物反馈": "生物反馈是一种通过监测和反馈生理信号，帮助人们了解和控制自己生理功能的技术。它可以帮助您意识到到自己的生理反应模式，并学习如何调节这些反应，从而达到改善心理健康和身体健康的目的。",
            
            // 紧急情况
            "我感到非常沮丧，该怎么办": "我很抱歉听到您感到沮丧。如果您正在法到情绪低落或有其他心理困扰，建议您：\n1. 立即联系我们的客服，预约紧急咨询\n2. 拨打心理危机热线：400-161-9995\n3. 如果您有自伤或伤人的想法，请请请立即寻求联系紧急救援服务：120或110",
            
            "我想自杀，该怎么办": "请您一定要不要伤害自己。生命是宝贵的，您值得被帮助和关爱。请立即联系：\n1. 心理危机热线：400-161-9995\n2. 紧急救援服务：120或110\n3. 或者前往最近的医院急诊科寻求帮助",
            
            "如何帮助有自杀倾向的朋友": "如果您的朋友有自杀倾向，请：\n1. 认真认真认真对待待他们的感受，不要评判或轻视\n2. 鼓励他们知道您关心他们，愿意倾听\n3. 鼓励他们寻求专业帮助，如心理热线或医院\n4. 如果情况紧急，请，请不要他们陪同前往医院急诊或联系紧急救援服务",
            
            // 其他问题
            "你是谁": "我是心社区的AI智能助手，旨在为您提供提供心理健康相关的信息和支持。我可以回答您关于心理健康、我们的服务、预约流程等问题。如果您有紧急感困扰，也可以通过我预约预约专业的心理咨询。",
            
            "你能做什么": "我可以为您提供以下帮助：\n1. 解答心理健康知识和常见问题\n2. 介绍我们的服务和活动\n3. 指导预约咨询和参加活动\n4. 提供简单的情绪支持和放松技巧\n5. 在紧急要时，为您提供紧急求助资源",
            
            "谢谢你": "不客气！如果您能为您提供帮助是我的荣幸。如果您还有其他问题或需要支持持，请随时告诉我。记住，关注自己的心理健康是非常重要的，您值得被关心和照顾。"
        };
        
        // 预设问候语
        this.greetings = [
            "您好！我是心社区的AI智能助手，很高兴为您服务。请问有什么可以帮助您的吗？",
            "嗨！我是心社区的AI助手，随时为您解答关于心理健康的问题。有什么我可以帮到您的吗？",
            "您好！我是心社区的AI智能助手。如果您有任何关于心理健康或我们服务的问题，都可以向我咨询。"
        ];
        
        // 预设无法回答的回复
        this.defaultResponses = [
            "抱歉，我目前无法回答这个问题。您可以尝试换一种方式提问，或者联系我们的客服获取更多帮助。",
            "很抱歉，我暂时理解您的问题。您可以尝试询问关于心理健康、我们的服务或预约流程等方面的问题。",
            "对不起，我暂时无法回答回答这个问题。如果您有紧急的心理健康需求，建议您直接联系我们的客服或预约咨询。"
        ];
        
        // 预设正在输入的提示
        this.typingMessages = [
            "正在思考...",
            "正在查找相关信息...",
            "请稍等...",
            "正在组织语言..."
        ];
    }
    
    // 初始化AI助手
    init() {
        // 创建AI助手容器
        this.createContainer();
        
        // 创建聊天窗口
        this.createChatWindow();
        
        // 创建切换按钮
        this.createToggleButton();
        
        // 初始化完成后添加事件监听器
        this.addEventListeners();
        
        // 显示欢迎消息
        this.showWelcomeMessage();
        
        // 保存实例到全局，方便页面可见性变化时控制
        window._mentalHealthAIAssistant = this;
        
        // 初始化处理状态
        this.isProcessingPaused = false;
        this.processingQueue = [];
        
        // 尝试连接到AI助手管理器
        this.connectToManager();
    }
    
    // 连接到AI助手管理器
    connectToManager() {
        // 检查管理器是否已存在
        if (window.aiAssistantManager) {
            this.manager = window.aiAssistantManager;
            console.log('AI助手已成功连接到管理器');
            
            // 注册事件监听器
            this.manager.on('started', () => {
                console.log('AI助手服务已启动');
            });
            
            this.manager.on('stopped', () => {
                console.log('AI助手服务已停止');
                // 可以在这里添加停止服务后的处理逻辑
            });
            
            this.manager.on('configUpdated', (newConfig) => {
                console.log('配置已更新:', newConfig);
                // 更新本地配置
                if (newConfig.responseTimeout) {
                    this.responseTimeout = newConfig.responseTimeout;
                }
            });
        } else {
            console.log('未找到AI助手管理器，将在独立模式下运行');
            // 监听管理器加载事件
            window.addEventListener('aiAssistantManagerLoaded', () => {
                if (window.aiAssistantManager) {
                    this.manager = window.aiAssistantManager;
                    console.log('AI助手已成功连接到管理器');
                }
            });
        }
    }
    
    // 暂停AI处理，优化不可见时的性能
    pauseProcessing() {
        this.isProcessingPaused = true;
        // 清除可能的定时器
        if (this.processingTimer) {
            clearTimeout(this.processingTimer);
            this.processingTimer = null;
        }
    }
    
    // 恢复AI处理
    resumeProcessing() {
        this.isProcessingPaused = false;
        // 处理队列中等待的任务
        if (this.processingQueue.length > 0) {
            const nextTask = this.processingQueue.shift();
            if (typeof nextTask === 'function') {
                nextTask();
            }
        }
    
    // 创建AI助手容器
    createContainer() {
        this.container = document.createElement('div');
        this.container.id = 'ai-assistant-container';
        this.container.className = 'fixed bottom-6 right-6 z-50';
        document.body.appendChild(this.container);
    }
    
    // 创建聊天窗口
    createChatWindow() {
        this.chatWindow = document.createElement('div');
        this.chatWindow.id = 'ai-assistant-chat';
        this.chatWindow.className = 'hidden w-80 md:w-96 bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 transform translate-y-4 opacity-0';
        
        // 聊天窗口头部
        const chatHeader = document.createElement('div');
        chatHeader.className = 'bg-primary text-white p-4 flex justify-between items-center relative overflow-hidden';
        
        // 添加头部背景效果
        const headerBg = document.createElement('div');
        headerBg.className = 'absolute inset-0 bg-gradient-to-r from-primary to-blue-600 opacity-90';
        chatHeader.appendChild(headerBg);
        
        // 添加装饰元素
        const decorCircle1 = document.createElement('div');
        decorCircle1.className = 'absolute -right-10 -top-10 w-24 h-24 rounded-full bg-white opacity-10';
        chatHeader.appendChild(decorCircle1);
        
        const decorCircle2 = document.createElement('div');
        decorCircle2.className = 'absolute -right-5 -bottom-5 w-16 h-16 rounded-full bg-white opacity-10';
        chatHeader.appendChild(decorCircle2);
        
        // 头部内容
        const headerContent = document.createElement('div');
        headerContent.className = 'flex items-center relative z-10';
        
        const icon = document.createElement('div');
        icon.className = 'w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3';
        icon.innerHTML = '<i class="fa fa-comments-o text-primary text-xl"></i>';
        
        const title = document.createElement('h3');
        title.className = 'font-bold text-lg';
        title.textContent = 'AI智能助手';
        
        headerContent.appendChild(icon);
        headerContent.appendChild(title);
        
        const closeButton = document.createElement('button');
        closeButton.className = 'text-white hover:text-gray-200 focus:outline-none p-2 rounded-full transition-all duration-200 hover:bg-white hover:bg-opacity-20 relative z-10';
        closeButton.innerHTML = '<i class="fa fa-times"></i>';
        closeButton.addEventListener('click', () => this.toggleChatWindow());
        
        chatHeader.appendChild(headerContent);
        chatHeader.appendChild(closeButton);
        
        // 聊天消息区域
        this.chatMessages = document.createElement('div');
        this.chatMessages.id = 'ai-assistant-messages';
        this.chatMessages.className = 'p-4 h-80 overflow-y-auto bg-gradient-to-b from-gray-50 to-white relative';
        
        // 添加背景装饰
        const bgPattern = document.createElement('div');
        bgPattern.className = 'absolute inset-0 opacity-5 pointer-events-none';
        bgPattern.style.backgroundImage = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;
        this.chatMessages.appendChild(bgPattern);
        
        // 输入区域
        const inputArea = document.createElement('div');
        inputArea.className = 'p-4 border-t border-gray-200 bg-white';
        
        const inputContainer = document.createElement('div');
        inputContainer.className = 'flex rounded-lg overflow-hidden shadow-sm border border-gray-300 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all duration-200';
        
        this.messageInput = document.createElement('input');
        this.messageInput.type = 'text';
        this.messageInput.className = 'flex-grow px-4 py-3 border-none focus:outline-none bg-transparent';
        this.messageInput.placeholder = '请输入您的问题...';
        this.messageInput.addEventListener('input', () => this.updateSendButtonState());
        
        this.sendButton = document.createElement('button');
        this.sendButton.className = 'px-4 py-3 bg-primary text-white hover:bg-blue-600 transition-all duration-200 flex items-center justify-center';
        this.sendButton.innerHTML = '<i class="fa fa-paper-plane"></i>';
        this.sendButton.disabled = true;
        this.sendButton.style.opacity = '0.6';
        this.sendButton.style.cursor = 'not-allowed';
        
        inputContainer.appendChild(this.messageInput);
        inputContainer.appendChild(this.sendButton);
        
        // 快速问题区域
        const quickQuestions = document.createElement('div');
        quickQuestions.className = 'mt-3 flex flex-wrap gap-2';
        
        const quickQuestionsList = [
            "如何保持心理健康？",
            "什么是焦虑症？",
            "如何预约咨询？",
            "你们提供哪些服务？",
            "冥想有什么好处？",
            "如何应对压力？"
        ];
        
        quickQuestionsList.forEach(question => {
            const button = document.createElement('button');
            button.className = 'px-3 py-2 bg-blue-50 text-primary text-sm rounded-full hover:bg-blue-100 transition-all duration-200 transform hover:scale-105';
            button.textContent = question;
            button.addEventListener('click', () => {
                this.messageInput.value = question;
                this.updateSendButtonState();
                this.sendMessage();
            });
            quickQuestions.appendChild(button);
        });
        
        inputArea.appendChild(inputContainer);
        inputArea.appendChild(quickQuestions);
        
        // 组装聊天窗口
        this.chatWindow.appendChild(chatHeader);
        this.chatWindow.appendChild(this.chatMessages);
        this.chatWindow.appendChild(inputArea);
        
        this.container.appendChild(this.chatWindow);
    }
    
    // 创建切换按钮
    createToggleButton() {
        this.toggleButton = document.createElement('button');
        this.toggleButton.id = 'ai-assistant-toggle';
        this.toggleButton.className = 'w-16 h-16 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 transition-all-300 transform hover:scale-105';
        this.toggleButton.innerHTML = '<i class="fa fa-comments-o text-2xl"></i>';
        this.toggleButton.addEventListener('click', () => this.toggleChatWindow());
        
        this.container.appendChild(this.toggleButton);
    }
    
    // 添加事件监听器
    addEventListeners() {
        // 发送按钮点击事件
        this.sendButton.addEventListener('click', () => this.sendMessage());
        
        // 输入框回车事件 - 直接将事件对象传递给sendMessage方法
        this.messageInput.addEventListener('keypress', (e) => this.sendMessage(e));
    }
    
    // 切换聊天窗口显示/隐藏
    toggleChatWindow() {
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            this.chatWindow.classList.remove('hidden', 'translate-y-4', 'opacity-0');
            this.toggleButton.innerHTML = '<i class="fa fa-times text-2xl"></i>';
            this.messageInput.focus();
        } else {
            this.chatWindow.classList.add('translate-y-4', 'opacity-0');
            setTimeout(() => {
                this.chatWindow.classList.add('hidden');
            }, 300);
            this.toggleButton.innerHTML = '<i class="fa fa-comments-o text-2xl"></i>';
        }
    }
    
    // 显示欢迎消息
    showWelcomeMessage() {
        const randomGreeting = this.greetings[Math.floor(Math.random() * this.greetings.length)];
        this.addMessage('assistant', randomGreeting);
    }
    
    // 添加消息到聊天窗口
    addMessage(sender, text) {
        // 创建消息容器
        const messageDiv = document.createElement('div');
        messageDiv.className = sender === 'user' ? 'flex justify-end mb-4' : 'flex mb-4';
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(10px)';
        messageDiv.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        // 创建消息内容
        const messageContent = document.createElement('div');
        messageContent.className = sender === 'user' 
            ? 'bg-primary text-white rounded-lg rounded-br-none px-4 py-3 max-w-[80%] shadow-md transition-all duration-200 hover:shadow-lg' 
            : 'bg-gray-200 text-gray-800 rounded-lg rounded-bl-none px-4 py-3 max-w-[80%] shadow-md transition-all duration-200 hover:shadow-lg';
        
        // 为AI回复添加图标
        if (sender === 'assistant') {
            const iconSpan = document.createElement('span');
            iconSpan.className = 'inline-block mr-2';
            iconSpan.innerHTML = '<i class="fa fa-robot text-blue-500"></i>';
            messageContent.prepend(iconSpan);
        }
        
        // 处理富文本格式
        this.renderFormattedMessage(text, messageContent);
        
        messageDiv.appendChild(messageContent);
        this.chatMessages.appendChild(messageDiv);
        
        // 触发重绘后添加动画
        setTimeout(() => {
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        }, 10);
        
        // 滚动到底部
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
    
    // 渲染格式化消息（支持列表、粗体等基本富文本）
    renderFormattedMessage(text, container) {
        // 分割段落
        const paragraphs = text.split('\n');
        
        paragraphs.forEach((paragraph, index) => {
            // 跳过空行
            if (!paragraph.trim()) return;
            
            // 检查是否是列表项
            if (paragraph.match(/^\d+\.\s/)) {
                const listItem = document.createElement('div');
                listItem.className = 'ml-2 mb-2';
                
                // 提取序号和内容
                const [, number, content] = paragraph.match(/^(\d+)\.\s(.*)$/);
                
                listItem.innerHTML = `<span class="font-bold mr-1">${number}.</span>${content}`;
                container.appendChild(listItem);
            } else {
                const p = document.createElement('p');
                p.textContent = paragraph;
                if (index > 0) {
                    p.className = 'mt-2';
                }
                container.appendChild(p);
            }
        });
    }
    
    // 添加正在输入提示
    addTypingIndicator() {
        this.isTyping = true;
        const typingDiv = document.createElement('div');
        typingDiv.id = 'ai-assistant-typing';
        typingDiv.className = 'flex mb-4';
        typingDiv.style.opacity = '0';
        typingDiv.style.transition = 'opacity 0.3s ease';
        
        const typingContent = document.createElement('div');
        typingContent.className = 'bg-gray-200 text-gray-800 rounded-lg rounded-bl-none px-4 py-3 flex items-center';
        
        // 添加机器人图标
        const iconSpan = document.createElement('span');
        iconSpan.className = 'inline-block mr-2';
        iconSpan.innerHTML = '<i class="fa fa-robot text-blue-500"></i>';
        typingContent.appendChild(iconSpan);
        
        // 添加动画点
        const dotsContainer = document.createElement('span');
        dotsContainer.className = 'flex space-x-1';
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('span');
            dot.className = 'h-2 w-2 bg-gray-500 rounded-full';
            dot.style.animation = `typingPulse 1.4s infinite ease-in-out both`;
            dot.style.animationDelay = `${i * 0.2}s`;
            dotsContainer.appendChild(dot);
        }
        
        // 添加CSS动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes typingPulse {
                0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
                40% { transform: scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        typingContent.appendChild(dotsContainer);
        typingDiv.appendChild(typingContent);
        this.chatMessages.appendChild(typingDiv);
        
        // 触发动画
        setTimeout(() => {
            typingDiv.style.opacity = '1';
        }, 10);
        
        // 滚动到底部
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
    
    // 移除正在输入提示
    removeTypingIndicator() {
        this.isTyping = false;
        const typingDiv = document.getElementById('ai-assistant-typing');
        if (typingDiv) {
            typingDiv.remove();
        }
    }
    
    // 更新发送按钮状态
    updateSendButtonState() {
        const message = this.messageInput.value.trim();
        if (message && !this.isProcessing) {
            this.sendButton.disabled = false;
            this.sendButton.style.opacity = '1';
            this.sendButton.style.cursor = 'pointer';
        } else {
            this.sendButton.disabled = true;
            this.sendButton.style.opacity = '0.6';
            this.sendButton.style.cursor = 'not-allowed';
        }
    }
    
    // 发送消息
    sendMessage(e = null) {
        // 检查是否是按键事件，如果是，判断是否为Enter或Ctrl+Enter
        if (e && e.type === 'keypress') {
            // 普通Enter键发送消息
            const isEnter = e.key === 'Enter' && !e.ctrlKey;
            // Ctrl+Enter键在输入框中插入换行符
            const isCtrlEnter = e.key === 'Enter' && e.ctrlKey;
            
            if (isCtrlEnter) {
                // 对于Ctrl+Enter，让浏览器默认处理（插入换行符）
                return;
            }
            
            if (!isEnter) {
                // 不是Enter键，不处理
                return;
            }
            
            // 是Enter键，阻止默认行为以防止表单提交等
            e.preventDefault();
        }
        
        const message = this.messageInput.value.trim();
        
        if (!message || this.isProcessing) return;
        
        // 设置处理状态，防止重复发送
        this.isProcessing = true;
        this.sendButton.disabled = true;
        this.sendButton.style.opacity = '0.6';
        this.sendButton.style.cursor = 'not-allowed';
        
        // 清空输入框
        this.messageInput.value = '';
        
        // 添加用户消息
        this.addMessage('user', message);
        
        // 检查是否暂停处理，如果是则将任务加入队列
        if (this.isProcessingPaused) {
            this.processingQueue.push(() => {
                this.processMessage(message);
            });
            return;
        }
        
        // 正常处理消息
        this.processMessage(message);
    }
    
    // 处理消息的核心逻辑，分离出来便于队列处理
    processMessage(message) {
        // 添加正在输入提示
        this.addTypingIndicator();
        
        // 添加发送按钮动画
        const originalButtonClass = this.sendButton.className;
        this.sendButton.className = originalButtonClass + ' animate-spin';
        
        // 设置响应超时
        const timeoutId = setTimeout(() => {
            if (!this.responseReceived) {
                this.removeTypingIndicator();
                this.addMessage('assistant', '抱歉，系统响应超时，请稍后再试。');
                this.resetSendButtonState(originalButtonClass);
                this.responseReceived = false;
            }
        }, this.responseTimeout);
        
        this.responseReceived = false;
        
        // 模拟AI思考时间 - 优化响应速度
        this.processingTimer = setTimeout(() => {
            // 清除超时
            clearTimeout(timeoutId);
            
            // 移除正在输入提示
            this.removeTypingIndicator();
            
            // 生成回复
            const response = this.generateResponse(message);
            
            // 添加AI回复
            this.addMessage('assistant', response);
            
            // 恢复发送按钮状态
            this.resetSendButtonState(originalButtonClass);
            
            // 清除处理定时器引用
            this.processingTimer = null;
        }, 800 + Math.random() * 800); // 减少延迟，提升响应速度
    },
    
    // 重置发送按钮状态
    resetSendButtonState(originalClass) {
        this.sendButton.className = originalClass;
        this.sendButton.disabled = true;
        this.sendButton.style.opacity = '0.6';
        this.sendButton.style.cursor = 'not-allowed';
        this.isProcessing = false;
        this.responseReceived = true;
    
    // 文本预处理：移除停用词，标准化文本
    preprocessText(text) {
        let processed = text.toLowerCase();
        
        // 移除标点符号
        processed = processed.replace(/[.,!?;:"'、，。！？；："'（）()【】\[\]]/g, ' ');
        
        // 移除停用词
        const words = processed.split(/\s+/);
        const filteredWords = words.filter(word => !this.stopWords.includes(word));
        
        return filteredWords.join(' ');
    }
    
    // 同义词扩展：将文本中的关键词替换为标准形式
    expandSynonyms(text) {
        let expanded = text;
        
        // 按照词长度降序排列，优先替换长词
        const sortedSynonyms = Object.entries(this.synonyms).sort(([,a], [,b]) => {
            return Math.max(...b.map(w => w.length)) - Math.max(...a.map(w => w.length));
        });
        
        // 替换同义词
        for (const [standard, variants] of sortedSynonyms) {
            const regexPattern = variants.map(v => `(${v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`).join('|');
            const regex = new RegExp(regexPattern, 'gi');
            expanded = expanded.replace(regex, standard);
        }
        
        return expanded;
    }
    
    // 关键词提取
    extractKeywords(text) {
        const processed = this.preprocessText(text);
        const expanded = this.expandSynonyms(processed);
        
        // 提取关键词（包含知识库里的问题和同义词词典中的标准词）
        const keywords = new Set();
        
        // 添加知识库里的问题作为关键词
        Object.keys(this.knowledgeBase).forEach(question => {
            const processedQuestion = this.preprocessText(question);
            if (expanded.includes(processedQuestion) || processed.includes(processedQuestion)) {
                keywords.add(processedQuestion);
            }
        });
        
        // 添加同义词词典中的标准词
        Object.keys(this.synonyms).forEach(standard => {
            if (expanded.includes(standard) || processed.includes(standard)) {
                keywords.add(standard);
            }
        });
        
        return Array.from(keywords);
    }
    
    // 意图识别 - 增强版，考虑上下文
    recognizeIntent(text) {
        const processed = this.preprocessText(text);
        const expanded = this.expandSynonyms(processed);
        
        // 定义意图模式
        const intentPatterns = {
            'greeting': ['你好', '您好', '嗨', 'hello', 'hi', '早上好', '晚上好', '中午好'],
            'farewell': ['再见', '拜拜', 'bye', '下次见', '回见', '晚安'],
            'thanks': ['谢谢', '感谢', '谢了', '非常感谢', '十分感谢', '感激'],
            'mental_health_info': ['心理健康', '心理状态', '心理卫生', '心理保健'],
            'anxiety': ['焦虑', '焦虑症', '焦虑障碍', '过度担忧', '紧张不安'],
            'depression': ['抑郁', '抑郁症', '忧郁', '情绪低落', '不开心', '难过'],
            'booking': ['预约', '预定', '挂号', '安排', '约见'],
            'service_info': ['服务', '项目', '内容', '业务', '提供'],
            'cost_info': ['费用', '价格', '收费', '多少钱', '贵吗'],
            'emergency': ['紧急', '危机', '自杀', '轻生', '不想活', '活不下去', '结束生命'],
            'relaxation': ['放松', '减压', '冥想', '正念', '禅修', '舒缓', '释放压力'],
            'help': ['帮助', '怎么', '如何', '怎样', '请教', '指导'],
            'stress': ['压力', '应对压力', '压力大', '压力管理'],
            'sleep': ['失眠', '睡眠', '睡不着', '睡眠质量'],
            'relationship': ['人际关系', '沟通', '社交', '朋友'],
            'self_esteem': ['自信', '自尊心', '自我价值', '自卑'],
            'self_growth': ['自我成长', '个人成长', '自我提升', '成长', '进步', '发展', '学习'],
            'emotion_management': ['情绪管理', '情绪调节', '控制情绪', '管理情绪', '情绪控制', '情绪', '情感'],
            'focus': ['专注力', '集中注意力', '注意力', '专注', '分心', '集中', '专注度'],
            'positive_thinking': ['积极思考', '乐观', '正能量', '积极', '心态', '思维方式', '正向思考']
        };
        
        // 检查对话上下文，提高多轮对话连贯性
        let contextBoostedPatterns = null;
        if (this.conversationHistory.length > 2) {
            const lastIntent = this.recognizeIntentFromHistory();
            if (lastIntent) {
                // 基于上一轮对话的意图，优先匹配相关模式
                contextBoostedPatterns = lastIntent;
            }
        }
        
        // 如果有上下文增强的模式，优先检查
        if (contextBoostedPatterns && intentPatterns[contextBoostedPatterns]) {
            for (const pattern of intentPatterns[contextBoostedPatterns]) {
                if (expanded.includes(pattern) || processed.includes(pattern)) {
                    return contextBoostedPatterns;
                }
            }
        }
        
        // 识别意图
        for (const [intent, patterns] of Object.entries(intentPatterns)) {
            for (const pattern of patterns) {
                if (expanded.includes(pattern) || processed.includes(pattern)) {
                    return intent;
                }
            }
        }
        
        return 'general_inquiry';
    },
    
    // 从历史对话中识别最近的意图
    recognizeIntentFromHistory() {
        // 查找最近的非问候、非感谢、非告别的意图
        const validIntents = ['mental_health_info', 'anxiety', 'depression', 'booking', 
                            'service_info', 'cost_info', 'relaxation', 'stress', 
                            'sleep', 'relationship', 'self_esteem', 'self_growth',
                            'emotion_management', 'focus', 'positive_thinking'];
        
        for (let i = this.conversationHistory.length - 1; i >= 0; i--) {
            if (this.conversationHistory[i].role === 'user') {
                const intent = this.recognizeIntent(this.conversationHistory[i].content);
                if (validIntents.includes(intent)) {
                    return intent;
                }
            }
        }
        
        return null;
    }
    
    // 语义相似度计算（增强版）
    calculateSimilarity(text1, text2) {
        const words1 = this.preprocessText(text1).split(' ');
        const words2 = this.preprocessText(text2).split(' ');
        
        // 计算共同词的数量，并考虑词频和重要性
        let commonWords = 0;
        let wordImportance = {};
        
        // 为关键词设置更高的权重
        const importantWords = ['心理健康', '焦虑', '抑郁', '预约', '咨询', '服务', '费用', 
                              '冥想', '放松', '压力', '失眠', '人际关系', '自信', '危机',
                              '自我成长', '个人成长', '情绪管理', '专注力', '注意力', '积极思考', '乐观'];
        
        // 初始化词重要性映射
        importantWords.forEach(word => {
            wordImportance[this.preprocessText(word)] = 2; // 重要词权重为2
        });
        
        // 计算共同词加权分数
        for (const word1 of words1) {
            if (word2.includes(word1)) {
                // 为重要词增加权重
                const weight = wordImportance[word1] || 1;
                commonWords += weight;
            }
        }
        
        // 计算加权Jaccard相似度
        let weightedUnion = 0;
        const unionSet = new Set([...words1, ...words2]);
        
        unionSet.forEach(word => {
            weightedUnion += wordImportance[word] || 1;
        });
        
        // 计算余弦相似度作为补充
        const cosineSimilarity = this.calculateCosineSimilarity(words1, words2);
        
        // 结合Jaccard和余弦相似度，提高匹配准确性
        const jaccardSimilarity = weightedUnion > 0 ? commonWords / weightedUnion : 0;
        const combinedSimilarity = (jaccardSimilarity * 0.7) + (cosineSimilarity * 0.3);
        
        return combinedSimilarity;
    },
    
    // 计算余弦相似度
    calculateCosineSimilarity(words1, words2) {
        const wordFreq1 = {};
        const wordFreq2 = {};
        const allWords = new Set([...words1, ...words2]);
        
        // 计算词频
        words1.forEach(word => {
            wordFreq1[word] = (wordFreq1[word] || 0) + 1;
        });
        
        words2.forEach(word => {
            wordFreq2[word] = (wordFreq2[word] || 0) + 1;
        });
        
        // 计算点积
        let dotProduct = 0;
        let magnitude1 = 0;
        let magnitude2 = 0;
        
        allWords.forEach(word => {
            const freq1 = wordFreq1[word] || 0;
            const freq2 = wordFreq2[word] || 0;
            
            dotProduct += freq1 * freq2;
            magnitude1 += freq1 * freq1;
            magnitude2 += freq2 * freq2;
        });
        
        // 计算向量模长
        magnitude1 = Math.sqrt(magnitude1);
        magnitude2 = Math.sqrt(magnitude2);
        
        // 计算余弦相似度
        if (magnitude1 === 0 || magnitude2 === 0) return 0;
        return dotProduct / (magnitude1 * magnitude2);
    }
    
    // 生成回复 - 增强版，支持上下文理解和多轮对话
    generateResponse(message) {
        // 保存到对话历史
        this.conversationHistory.push({role: 'user', content: message});
        
        // 限制历史记录长度，避免内存占用过大
        if (this.conversationHistory.length > 50) {
            this.conversationHistory = this.conversationHistory.slice(-50);
        }
        
        // 文本预处理和意图识别
        const intent = this.recognizeIntent(message);
        const keywords = this.extractKeywords(message);
        const lowerMessage = message.toLowerCase();
        
        // 首先检查紧急情况（优先级最高）
        if (intent === 'emergency') {
            const emergencyResponse = "请您不要伤害自己。生命是宝贵的，您值得被帮助和关爱。请立即联系：\n1. 心理危机热线：400-161-9995\n2. 紧急救援服务：120或110\n3. 或者前往最近的医院急诊科寻求帮助";
            this.conversationHistory.push({role: 'assistant', content: emergencyResponse});
            return emergencyResponse;
        }
        
        // 检查是否是对前面问题的追问或请求更多信息
        const followUpResponse = this.handleFollowUpQuestion(message, intent);
        if (followUpResponse) {
            this.conversationHistory.push({role: 'assistant', content: followUpResponse});
            return followUpResponse;
        }
        
        // 根据意图生成特定回复
        switch (intent) {
            case 'greeting':
                const greetingResponse = this.greetings[Math.floor(Math.random() * this.greetings.length)];
                this.conversationHistory.push({role: 'assistant', content: greetingResponse});
                return greetingResponse;
                
            case 'farewell':
                const farewellResponse = "再见！祝您有美好的一天。如果您需要任何帮助，请随时回来找我。";
                this.conversationHistory.push({role: 'assistant', content: farewellResponse});
                return farewellResponse;
                
            case 'thanks':
                const thanksResponse = "不客气！很高兴能帮到您。如果您还有其他问题，随时可以咨询我。";
                this.conversationHistory.push({role: 'assistant', content: thanksResponse});
                return thanksResponse;
                
            case 'stress':
                // 压力管理相关回复 - 扩展知识库
                const stressResponse = "有效应对压力的方法包括：\n\n- 时间管理：制定优先级，避免过度承诺\n- 身体活动：运动释放内啡肽，改善情绪\n- 呼吸练习：4-7-8呼吸法(吸气4秒，屏息7秒，呼气8秒)\n- 健康饮食：均衡营养，避免过度依赖咖啡因和糖分\n- 充足睡眠：建立规律的睡眠习惯\n- 社交支持：与亲友分享感受，寻求帮助\n- 娱乐活动：培养兴趣爱好，短暂逃离工作\n- 认知重构：挑战消极思维，寻找积极角度\n\n当压力持续影响生活时，专业心理咨询可以提供更有针对性的帮助。";
                this.conversationHistory.push({role: 'assistant', content: stressResponse});
                return stressResponse;
                
            case 'sleep':
                // 睡眠相关回复 - 新增知识领域
                const sleepResponse = "改善睡眠质量的建议：\n\n- 建立规律的睡眠时间：每天相同时间上床和起床\n- 创建良好的睡眠环境：安静、黑暗、凉爽的卧室\n- 睡前放松：避免使用电子设备，可尝试阅读或听轻柔音乐\n- 限制咖啡因和酒精：特别是下午和晚上\n- 规律运动：但避免睡前3小时内进行剧烈运动\n- 避免午睡过长：如需午睡，控制在20-30分钟内\n- 睡前放松技巧：深呼吸、冥想或渐进式肌肉放松\n\n如果长期失眠严重影响生活，建议咨询医生或心理专家。";
                this.conversationHistory.push({role: 'assistant', content: sleepResponse});
                return sleepResponse;
                
            case 'relationship':
                // 人际关系相关回复 - 新增知识领域
                const relationshipResponse = "建立健康人际关系的建议：\n\n- 有效沟通：清晰表达想法和感受，积极倾听对方\n- 尊重与理解：接纳他人差异，换位思考\n- 诚实与信任：建立在真诚基础上的关系更持久\n- 设定边界：明确自己的需求和底线\n- 给予与索取平衡：关系需要双方共同维护\n- 解决冲突的技巧：避免指责，聚焦问题本身\n- 培养同理心：理解他人的情绪和观点\n\n如果人际关系问题持续困扰您，心理咨询可以提供专业指导。";
                this.conversationHistory.push({role: 'assistant', content: relationshipResponse});
                return relationshipResponse;
                
            case 'self_growth':
                // 自我成长相关回复
                const selfGrowthResponse = "促进自我成长的有效方法：\n\n- 设定明确目标：制定SMART目标（具体、可衡量、可实现、相关性、时限性）\n- 持续学习：培养阅读习惯，参加课程，学习新技能\n- 自我反思：定期回顾自己的行为和决策，识别改进空间\n- 接受挑战：走出舒适区，尝试新事物以促进成长\n- 寻求反馈：主动向他人请教，接受建设性批评\n- 时间管理：高效利用时间，平衡工作、学习和休息\n- 建立成长型思维：相信能力可以通过努力发展\n- 培养健康习惯：身体和心理健康是自我成长的基础\n\n自我成长是一个终身过程，关键在于保持好奇心和持续进步的动力。";
                this.conversationHistory.push({role: 'assistant', content: selfGrowthResponse});
                return selfGrowthResponse;
                
            case 'emotion_management':
                // 情绪管理相关回复
                const emotionManagementResponse = "有效管理情绪的策略：\n\n- 情绪觉察：识别和命名自己的情绪，了解情绪触发因素\n- 深呼吸练习：当情绪激动时，尝试4-7-8呼吸法（吸气4秒，屏息7秒，呼气8秒）\n- 情绪记录：写情绪日记，记录情绪变化和触发事件\n- 认知重构：识别消极思维模式，用更平衡的视角看待问题\n- 表达情绪：通过健康的方式表达情绪，如写作、绘画或与信任的人交谈\n- 转移注意力：从事愉快的活动，暂时缓解强烈情绪\n- 寻求支持：与朋友、家人或专业人士分享感受\n- 自我关怀：确保充足睡眠、健康饮食和适量运动\n\n记住，所有情绪都是正常的，重要的是我们如何响应和管理它们。";
                this.conversationHistory.push({role: 'assistant', content: emotionManagementResponse});
                return emotionManagementResponse;
                
            case 'focus':
                // 专注力提升相关回复
                const focusResponse = "提高专注力和注意力的方法：\n\n- 番茄工作法：25分钟专注工作，5分钟短暂休息\n- 减少干扰：关闭手机通知，创造安静的工作环境\n- 设定明确意图：开始任务前，清楚定义目标和期望\n- 单一任务：一次只专注于一件事情，避免多任务处理\n- 充足睡眠：睡眠不足会严重影响注意力和认知功能\n- 饮食调节：避免高糖食物，适量摄入蛋白质和健康脂肪\n- 定时休息：每工作1-2小时，起身活动5-10分钟\n- 正念练习：日常冥想可以提高注意力持续时间和质量\n- 设定时间限制：给任务设定截止时间，增加紧迫感\n\n通过持续练习，您可以逐步提高专注力水平。";
                this.conversationHistory.push({role: 'assistant', content: focusResponse});
                return focusResponse;
                
            case 'positive_thinking':
                // 积极思考相关回复
                const positiveThinkingResponse = "培养积极思考习惯的方法：\n\n- 感恩练习：每天记录3-5件值得感恩的事情\n- 积极自我对话：用积极的语言替代消极的自我评判\n- 寻找机会：在困难情境中寻找学习和成长的机会\n- 关注解决方案：聚焦于问题的解决方法，而非问题本身\n- 与积极的人交往：周围人的思维方式会影响我们\n- 享受当下：练习正念，关注当前的积极体验\n- 设定积极意图：每天早晨设定积极的一天的意图\n- 庆祝小成就：认可和庆祝自己的每一个进步\n- 身体活动：运动可以促进内啡肽分泌，改善情绪\n\n积极思考不是忽视现实，而是培养更平衡、更具建设性的视角。";
                this.conversationHistory.push({role: 'assistant', content: positiveThinkingResponse});
                return positiveThinkingResponse;
        }
        
        // 使用相似度匹配找到最合适的回答
        let bestMatch = null;
        let highestSimilarity = 0;
        let bestQuestion = null;
        
        // 标准化用户消息
        const normalizedMessage = this.expandSynonyms(this.preprocessText(message));
        
        // 遍历知识库寻找最佳匹配
        for (const [question, answer] of Object.entries(this.knowledgeBase)) {
            // 计算相似度
            const similarity = this.calculateSimilarity(normalizedMessage, question);
            
            // 如果相似度更高，更新最佳匹配
            if (similarity > highestSimilarity) {
                highestSimilarity = similarity;
                bestMatch = answer;
                bestQuestion = question;
            }
            
            // 如果完全匹配，直接返回
            if (normalizedMessage.includes(this.preprocessText(question)) || 
                lowerMessage.includes(question.toLowerCase())) {
                this.conversationHistory.push({role: 'assistant', content: answer});
                return answer;
            }
        }
        
        // 如果找到相似度较高的匹配（>0.3），返回该匹配
        if (highestSimilarity > 0.3) {
            // 根据上下文可能调整回答
            const contextAdjustedAnswer = this.adjustAnswerWithContext(bestMatch, intent, bestQuestion);
            this.conversationHistory.push({role: 'assistant', content: contextAdjustedAnswer});
            return contextAdjustedAnswer;
        }
        
        // 如果有关键词，尝试基于关键词生成回复
        if (keywords.length > 0) {
            let keywordResponse = "我理解您的问题与" + keywords.join("、") + "有关。";
            
            // 根据关键词提供更具体的信息
            if (keywords.some(k => k.includes("心理"))) {
                keywordResponse += "\n\n心理健康是整体健康的重要组成部分。我们的系统提供专业的心理健康服务，包括心理咨询、心理测评和心理健康教育等。";
            }
            
            if (keywords.some(k => k.includes("压力"))) {
                keywordResponse += "\n\n关于压力管理，我们提供多种方法和资源，帮助您有效应对生活中的各种压力源。";
            }
            
            // 查找相似问题推荐
            const similarQuestions = this.findSimilarQuestions(message);
            if (similarQuestions.length > 0) {
                keywordResponse += "\n\n您可能对以下问题也感兴趣：\n" + similarQuestions.join('\n');
            }
            
            keywordResponse += "\n\n您可以尝试更具体地描述您的问题，或者浏览我们的网站获取更多信息。";
            
            this.conversationHistory.push({role: 'assistant', content: keywordResponse});
            return keywordResponse;
        }
        
        // 如果没有找到合适的回答，返回增强版默认回复
        const defaultResponse = this.generateEnhancedDefaultResponse();
        this.conversationHistory.push({role: 'assistant', content: defaultResponse});
        return defaultResponse;
    },
    
    // 处理追问和后续问题
    handleFollowUpQuestion(message, intent) {
        const lowerMessage = message.toLowerCase();
        
        // 检查是否是追问模式
        const isFollowUp = lowerMessage.includes("更多") || lowerMessage.includes("详细") || 
                          lowerMessage.includes("具体") || lowerMessage.includes("然后呢") ||
                          lowerMessage.includes("接下来") || lowerMessage.includes("还有");
        
        if (isFollowUp && this.conversationHistory.length > 2) {
            // 获取上一轮AI回复
            for (let i = this.conversationHistory.length - 1; i >= 0; i--) {
                if (this.conversationHistory[i].role === 'assistant') {
                    const lastResponse = this.conversationHistory[i].content;
                    
                    // 根据上一轮回复的内容提供更多信息
                    if (lastResponse.includes("心理健康")) {
                        return "关于心理健康的更多信息：\n\n心理健康评估可以帮助您了解自己的心理状态，识别潜在的心理健康问题。我们提供专业的心理健康测评服务，可以全面评估您的情绪、压力水平、人际关系等多个方面。\n\n此外，保持心理健康还需要持续的自我关怀和成长，定期反思自己的情绪状态，培养积极的生活态度，建立支持系统等都是非常重要的。";
                    }
                    
                    if (lastResponse.includes("焦虑")) {
                        return "关于焦虑的更多深入信息：\n\n焦虑是一种自然的情绪反应，但当它变得过度或持续时，可能需要专业帮助。认知行为疗法(CBT)是治疗焦虑症最有效的心理治疗方法之一，它可以帮助您识别和改变导致焦虑的思维模式。\n\n另外，生活方式的调整也很重要，如规律运动、健康饮食、充足睡眠等都有助于减轻焦虑症状。对于严重的焦虑症，医生可能会建议药物治疗作为综合治疗计划的一部分。";
                    }
                    
                    if (lastResponse.includes("预约")) {
                        return "预约流程的更多细节：\n\n1. 您可以在我们的网站上浏览所有可用的咨询师，查看他们的专业背景、专长领域和用户评价\n2. 选择合适的咨询师后，可以查看他们的可用时间段\n3. 填写简单的预约表单，包括您的基本信息和咨询需求\n4. 提交预约后，您将收到确认邮件和短信\n5. 咨询前一天，我们会发送提醒信息\n\n如需修改或取消预约，请提前24小时联系我们。";
                    }
                    
                    if (lastResponse.includes("自我成长")) {
                        return "关于自我成长的进阶建议：\n\n建立个人成长计划可以帮助您系统化地实现目标：\n1. 进行自我评估，明确自己的优势和发展领域\n2. 制定阶段性目标，将大目标分解为小步骤\n3. 建立学习习惯，如每天阅读30分钟或每周学习一个新技能\n4. 寻找榜样或导师，从他们的经验中学习\n5. 加入学习社群，与志同道合的人互相支持\n6. 定期回顾和调整计划，保持灵活性\n\n记住，自我成长是一个循序渐进的过程，重要的是保持持续前进的动力。";
                    }
                    
                    if (lastResponse.includes("情绪管理")) {
                        return "情绪管理的高级技巧：\n\n针对不同情绪的特定应对策略：\n- 愤怒：尝试暂停法（在表达前深呼吸10秒）和I-statement（用'我感到...当...因为...'的方式表达）\n- 悲伤：允许自己感受悲伤，通过写日记、艺术创作等方式表达\n- 恐惧：区分真实威胁和想象威胁，逐步面对恐惧源\n- 嫉妒：关注自己的优势，培养感恩心态\n\n情绪智能(EQ)的培养包括四个方面：自我觉察、自我管理、社会觉察和关系管理。通过刻意练习，您可以逐步提高情绪智能水平。";
                    }
                    
                    if (lastResponse.includes("专注力")) {
                        return "提升专注力的深入技巧：\n\n脑科学视角下的专注力训练：\n- 认知训练：尝试拼图、解谜游戏等活动锻炼大脑\n- 环境优化：使用降噪耳机，调整光线，确保舒适温度\n- 注意力恢复：接触自然环境可以有效恢复注意力资源\n- 数字排毒：定期进行无电子设备时段（如睡前1小时）\n- 任务分类：根据精力和注意力水平安排任务顺序\n\n建立专注仪式感，如固定的开始和结束动作，可以帮助大脑进入和退出专注状态。长期练习冥想，尤其是正念冥想，可以显著提高大脑的注意力控制能力。";
                    }
                    
                    if (lastResponse.includes("积极思考")) {
                        return "积极思考的深度实践：\n\n研究表明，积极思维不仅改善情绪，还能增强免疫系统功能和提高生活满意度。以下是更深入的实践方法：\n\n- 认知行为疗法(CBT)技巧：识别并挑战消极自动思维\n- 寻找意义：在困难经历中寻找成长和学习的意义\n- 优势发现：使用VIA优势问卷识别自己的性格优势\n- 积极想象：每天花5分钟想象理想的未来场景\n- 随机善举：为他人做善事可以提升自己的积极情绪\n- 接纳负面情绪：积极思考不是压抑负面情绪，而是用平衡的视角看待它们\n\n通过持续练习，这些技巧可以帮助您培养更具韧性和适应性的思维方式。";
                    }
                    
                    break;
                }
            }
        }
        
        return null;
    },
    
    // 根据上下文调整回答
    adjustAnswerWithContext(answer, intent, question) {
        // 如果是多轮对话，可能需要调整回答以保持连贯性
        if (this.conversationHistory.length > 4) {
            // 检查是否有相关的历史对话
            const recentHistory = this.conversationHistory.slice(-4);
            let hasRelatedContext = false;
            
            recentHistory.forEach(msg => {
                if (msg.role === 'user' && 
                    (msg.content.includes(question) || 
                     this.calculateSimilarity(msg.content, question) > 0.5)) {
                    hasRelatedContext = true;
                }
            });
            
            if (hasRelatedContext) {
                // 如果已经讨论过类似问题，添加一些变化或额外信息
                if (intent === 'mental_health_info' || intent === 'anxiety' || intent === 'depression') {
                    return answer + "\n\n如果您觉得这些信息对您有帮助，并且想进一步了解如何应用这些建议到您的日常生活中，我们的专业咨询师可以为您提供个性化的指导和支持。";
                }
            }
        }
        
        return answer;
    },
    
    // 查找相似问题推荐
    findSimilarQuestions(message) {
        const commonQuestions = [
            "如何保持心理健康？",
            "什么是焦虑症？",
            "冥想有什么好处？",
            "如何有效应对压力？",
            "怎样预约心理咨询？",
            "抑郁症的症状有哪些？",
            "你们提供哪些服务？",
            "如何改善睡眠质量？",
            "如何建立良好的人际关系？",
            "如何提高自信心？",
            "如何促进自我成长？",
            "如何有效管理情绪？",
            "怎样提高专注力？",
            "如何培养积极思考的习惯？",
            "如何设定个人成长目标？"
        ];
        
        // 使用相似度计算找到最相似的问题
        const similarities = commonQuestions.map(q => ({
            question: q,
            similarity: this.calculateSimilarity(message, q)
        }));
        
        // 按相似度排序并返回前3个
        return similarities
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, 3)
            .map(item => `- ${item.question}`);
    },
    
    // 生成增强版默认回复
    generateEnhancedDefaultResponse() {
        // 基于对话历史和当前上下文生成更有针对性的默认回复
        const defaultResponses = [
            "感谢您的提问。虽然我无法完全理解您的问题，但我很乐意继续帮助您。您可以尝试用不同的方式表述，或者查看我们提供的服务内容。",
            "抱歉，我暂时无法回答这个问题。我们的心社区平台提供专业的心理健康服务，如果您有具体的心理健康需求，建议您预约我们的专业咨询师进行一对一交流。",
            "感谢您的咨询。为了更好地帮助您，您可以尝试提供更多细节或选择我们常见问题中的一个进行咨询。"
        ];
        
        // 根据对话历史选择更合适的默认回复
        let responseIndex = Math.floor(Math.random() * defaultResponses.length);
        
        // 如果对话历史较长，可能用户在尝试不同的问题，选择更有引导性的回复
        if (this.conversationHistory.length > 8) {
            responseIndex = 2; // 选择更有引导性的回复
        }
        
        // 查找热门问题推荐
        const popularQuestions = [
            "如何保持心理健康？",
            "怎样预约心理咨询？",
            "如何应对工作压力？"
        ];
        
        const randomPopular = popularQuestions[Math.floor(Math.random() * popularQuestions.length)];
        
        return defaultResponses[responseIndex] + 
               "\n\n您可能想了解：" + randomPopular + "\n\n如需进一步帮助，请拨打我们的客服热线：400-123-4567";
    }
}

// 预加载AI助手资源，提高初始化性能
function preloadAIAssistantResources() {
    // 预加载样式和必要资源
    if (typeof document !== 'undefined') {
        // 提前创建必要的DOM元素，但不显示
        const styleId = 'ai-assistant-preload-style';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                #ai-assistant-container {
                    display: none;
                }
                @keyframes typingPulse {
                    0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
                    40% { transform: scale(1); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
        
        // 预加载图标和背景图像
        if ('Image' in window) {
            const bgImage = new Image();
            bgImage.src = "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E";
        }
    }
}

// 延迟初始化AI助手，提高页面加载性能
function initAIAssistant() {
    // 使用延迟初始化，让页面先加载完毕
    setTimeout(() => {
        try {
            const aiAssistant = new AIAssistant();
            aiAssistant.init();
        } catch (error) {
            console.error('AI助手初始化失败:', error);
        }
    }, 1000); // 1秒后初始化，确保页面其他元素已加载
}

// 当页面加载完成时预加载资源并初始化AI助手
document.addEventListener('DOMContentLoaded', () => {
    // 立即预加载资源
    preloadAIAssistantResources();
    
    // 延迟初始化AI助手
    initAIAssistant();
});

// 在页面可见性变化时优化资源使用
document.addEventListener('visibilitychange', () => {
    const aiAssistant = window._mentalHealthAIAssistant;
    if (aiAssistant && typeof aiAssistant.pauseProcessing === 'function') {
        if (document.hidden) {
            aiAssistant.pauseProcessing();
        } else {
            aiAssistant.resumeProcessing();
        }
    }
});
