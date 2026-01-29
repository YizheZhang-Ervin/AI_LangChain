window.onload = () => {
    let { canvas, videoEl } = initRobot()
    initChatRoom(canvas, videoEl)
};

// 机器人状态切换
let switchRobotStatus = (videoEl, status) => {
    let duration = 2000
    if (status == "hello") {
        videoEl.src = "video/hello.mp4";
        videoEl.play();
    } else if (status == "talk") {
        videoEl.src = "video/talk.mp4";
        videoEl.play();
        duration = 5000
    }
    // 回原来状态
    setTimeout(() => {
        videoEl.src = "video/walk.mp4";
        videoEl.play();
    }, duration);
}

// 机器人画布初始化
let initRobot = () => {
    // 创建canvas
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    if (window.innerHeight > 720) {
        canvas.height = 720
    } else {
        canvas.height = window.innerHeight
        canvas.width = window.innerHeight
    }
    // 窗口大小改变时也更新canvas大小
    window.onresize = function () {
        if (window.innerHeight > 720) {
            canvas.height = 720
        } else {
            canvas.height = window.innerHeight
            canvas.width = window.innerHeight
        }
    };

    // 创建一个虚拟video元素
    const videoEl = document.createElement("video");
    videoEl.src = "video/hello1.mp4";

    // 重要：由于浏览器限制自动播放问题，则需要使用无声播放即可实现自动播放
    videoEl.muted = "muted";
    videoEl.autoplay = "autoplay";
    videoEl.loop = "loop";
    videoEl.play();

    const cvsWidth = canvas.width;
    const cvsHeight = canvas.height;
    // 使用requestAnimationFrame定时器实现canvas绘制video每一帧
    const videoRender = () => {
        window.requestAnimationFrame(videoRender);
        ctx.clearRect(0, 0, cvsWidth, cvsHeight);
        ctx.drawImage(videoEl, 0, 0, cvsWidth, cvsHeight);
    };
    videoRender();
    // 打完招呼，切换走路状态
    switchRobotStatus(videoEl, "walk")

    return { canvas, videoEl }
}

// 聊天室初始化
let initChatRoom = (canvas, videoEl) => {
    // 右侧聊天框宽度设置
    let rightPart = document.getElementById("right")
    rightPart.style.maxWidth = (window.innerWidth - canvas.width) + "px"

    // 获取DOM元素
    const chatMessages = document.getElementById('chatMessages');
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');

    // 模拟机器人回复（赛博朋克风格）
    const botReplies = [
        "数据链路已接通 📶",
        "警告：系统检测到异常数据流 ⚠️",
        "霓虹代码正在解析... 🔍",
        "赛博空间的法则由代码定义 💻",
        "连接至神经接口成功 ✅",
        "故障协议已启动，正在修复... 🛠️",
        "你的消息已被加密传输 🤐",
        "夜之城的霓虹永不熄灭 🌃"
    ];

    // 发送消息函数
    function sendMessage() {
        // 获取输入内容并去除首尾空格
        const messageText = messageInput.value.trim();

        // 空消息不发送
        if (!messageText) return;

        // 创建用户消息元素
        const userMessage = document.createElement('div');
        userMessage.className = 'message user';
        userMessage.innerHTML = `<p class="sentence-box">${messageText}</p>`;
        chatMessages.appendChild(userMessage);

        // 清空输入框
        messageInput.value = "";

        // 自动滚动到底部
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // 模拟机器人延迟回复

        const randomReply = botReplies[Math.floor(Math.random() * botReplies.length)];
        textToSpeech(randomReply)
        const botMessage = document.createElement('div');
        botMessage.className = 'message bot';
        botMessage.innerHTML = `<p>${randomReply}</p>`;
        chatMessages.appendChild(botMessage);

        // 再次滚动到底部
        chatMessages.scrollTop = chatMessages.scrollHeight;
        // 说话时播放说话动画
        switchRobotStatus(videoEl, "talk")
    }

    // 按钮点击发送
    sendBtn.addEventListener('click', sendMessage);

    // 回车发送消息
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// 文字转语音核心函数
let textToSpeech = (text, options = {}) => {
    // 检查浏览器是否支持
    if (!('speechSynthesis' in window)) {
        alert('你的浏览器不支持文字转语音功能，请更换现代浏览器！');
        return;
    }

    // 停止正在播放的语音（避免叠加）
    window.speechSynthesis.cancel();

    // 创建语音实例
    const utterance = new SpeechSynthesisUtterance(text);

    // 设置可选参数（默认值可根据需求调整）
    utterance.lang = options.lang || 'zh-CN'; // 语言：zh-CN（中文）、en-US（英文）等
    utterance.volume = options.volume || 1; // 音量 0-1
    utterance.rate = options.rate || 1; // 语速 0.1-10
    utterance.pitch = options.pitch || 1; // 音调 0-2

    // 播放完成回调
    utterance.onend = () => {
        console.log('语音播放完成');
    };

    // 播放语音
    window.speechSynthesis.speak(utterance);

    // 返回实例，方便后续控制（暂停、停止等）
    return utterance;
}

// 基础中文朗读
// textToSpeech('你好，这是原生Web Speech API的文字转语音测试');
// utterance.pause(); // 暂停
// utterance.resume(); // 恢复
// window.speechSynthesis.cancel(); // 停止所有播放