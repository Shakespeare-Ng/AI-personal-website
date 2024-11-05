document.addEventListener('DOMContentLoaded', function() {
    // 标签页切换
    const tabs = document.querySelectorAll('.tab');
    const pages = document.querySelectorAll('.page');

    tabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            
            tabs.forEach(t => t.classList.remove('active'));
            pages.forEach(p => p.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // 首页轮播图片
    const carouselImages = [
        './Images/image (1).png',
        './Images/image (2).png',
        './Images/image (3).png',
        './Images/image (4).png'
    ];
    
    let currentImageIndex = 0;
    const carousel = document.querySelector('.carousel');
    const dots = document.querySelectorAll('.dot');

    // 创建轮播图片容器
    const carouselInner = document.createElement('div');
    carouselInner.className = 'carousel-inner';
    carousel.appendChild(carouselInner);

    // 初始化轮播图片
    carouselImages.forEach((image, index) => {
        const item = document.createElement('div');
        item.className = 'carousel-item';
        item.style.backgroundImage = `url("${image}")`;
        carouselInner.appendChild(item);
    });

    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentImageIndex);
        });
    }

    function changeCarouselImage(newIndex) {
        currentImageIndex = (newIndex + carouselImages.length) % carouselImages.length;
        carouselInner.style.transform = `translateX(-${currentImageIndex * 100}%)`;
        updateDots();
    }

    // 为每个小圆点添加点击事件
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            changeCarouselImage(index);
        });
    });

    // 自动轮播
    setInterval(() => {
        changeCarouselImage(currentImageIndex + 1);
    }, 2000);

    // 初始化第一张图片
    changeCarouselImage(0);

    // 画廊轮播图片
    const galleryImages = [
        './Images/gallery (1).png',
        './Images/gallery (2).png',
        './Images/gallery (3).png',
        './Images/gallery (4).png',
        './Images/gallery (5).png',
        './Images/gallery (6).png',
        './Images/gallery (7).png',
        './Images/gallery (8).png',
        './Images/gallery (9).png',
        './Images/gallery (10).png',
        './Images/gallery (11).png',
        './Images/gallery (12).png',
        './Images/gallery (13).png',
        './Images/gallery (14).png',
    ];

    const galleryScroll = document.querySelector('.gallery-scroll');
    const galleryPrevBtn = document.querySelector('.gallery-prev');
    const galleryNextBtn = document.querySelector('.gallery-next');
    let galleryStartIndex = 0;

    // 初始化画廊，显示所有图片
    function initGallery() {
        galleryScroll.innerHTML = '';
        galleryImages.forEach((image, index) => {
            const img = document.createElement('img');
            img.src = image;
            img.alt = `Gallery Image ${index + 1}`;
            img.className = 'gallery-image';
            galleryScroll.appendChild(img);
        });
    }

    function updateGallery(direction = 0) {
        // 计算新的起始索引
        galleryStartIndex = (galleryStartIndex + direction + galleryImages.length) % galleryImages.length;
        
        // 计算滚动距离（一张图片的宽度加上间距）
        const imageWidth = galleryScroll.querySelector('.gallery-image').offsetWidth;
        const gap = 20; // 图片之间的间距
        const scrollDistance = imageWidth + gap;
        
        // 检查是否到达末尾
        if (galleryStartIndex === galleryImages.length - 2) {
            // 如果到达倒数第二张，准备无缝切换
            setTimeout(() => {
                // 禁用过渡效果
                galleryScroll.style.transition = 'none';
                // 重置到开始位置
                galleryStartIndex = 0;
                galleryScroll.style.transform = `translateX(0)`;
                // 重新启用过渡效果
                setTimeout(() => {
                    galleryScroll.style.transition = 'transform 0.5s ease';
                }, 50);
            }, 500); // 等待当前过渡完成
        }
        
        // 应用变换
        galleryScroll.style.transform = `translateX(-${galleryStartIndex * scrollDistance}px)`;
    }

    // 添加按钮点击事件
    galleryPrevBtn.addEventListener('click', () => {
        updateGallery(-1);  // 向左移动一张
    });

    galleryNextBtn.addEventListener('click', () => {
        updateGallery(1);   // 向右移动一张
    });

    // 自动轮播
    let galleryAutoPlay = setInterval(() => updateGallery(1), 1700);

    // 当鼠标悬停在画廊上时暂停自动轮播
    galleryScroll.addEventListener('mouseenter', () => {
        clearInterval(galleryAutoPlay);
    });

    // 当鼠标离开画廊时恢复自动轮播
    galleryScroll.addEventListener('mouseleave', () => {
        galleryAutoPlay = setInterval(() => updateGallery(1), 1700);
    });

    // 初始化画廊时添加过渡效果
    galleryScroll.style.transition = 'transform 0.5s ease';

    // 初始化画廊
    initGallery();

    // AI聊天功能
    const chatMessages = document.querySelector('.chat-messages');
    const chatInput = document.querySelector('.chat-input input');
    const chatButton = document.querySelector('.chat-input button');

    // 生成JWT Token的函数
    async function generateToken(apiKey) {
        try {
            const [id, secret] = apiKey.split('.');
            const now = Math.floor(Date.now() / 1000);
            const exp = now + 3600; // Token有效期1小时

            const header = {
                alg: 'HS256',
                sign_type: 'SIGN'
            };

            const payload = {
                api_key: id,
                exp: exp,
                timestamp: now
            };

            // 使用 jsrsasign 库生成 token
            const sHeader = JSON.stringify(header);
            const sPayload = JSON.stringify(payload);
            const token = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, secret);
            
            console.log('Generated token:', token);
            return token;
        } catch (error) {
            console.error('Token generation error:', error);
            throw error;
        }
    }

    // 调用智谱AI接口
    async function callAI(message) {
        try {
            const API_KEY = 'e8236fe9a18877daed4bedddb84d8c92.o8oW14UPtwIUhs2i';
            const token = await generateToken(API_KEY);
            console.log('Generated token:', token);

            const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'glm-4',
                    messages: [
                        {
                            role: 'user',
                            content: message
                        }
                    ]
                })
            });

            console.log('Response status:', response.status);
            const responseData = await response.json();
            console.log('Response data:', responseData);

            if (!response.ok) {
                throw new Error(`AI响应错误: ${response.status} - ${JSON.stringify(responseData)}`);
            }

            return responseData.choices[0].message.content;
        } catch (error) {
            console.error('详细错误信息:', error);
            return '抱歉，我现在无法回答。错误信息：' + error.message;
        }
    }

    // 添加消息到聊天界面
    function addMessage(message, isUser = true) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', isUser ? 'user-message' : 'ai-message');
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // 处理用户输入
    async function handleUserInput() {
        const message = chatInput.value.trim();
        if (message) {
            // 显示用户消息
            addMessage(message, true);
            chatInput.value = '';

            // 显示"正在输入"提示
            const loadingMessage = document.createElement('div');
            loadingMessage.classList.add('message', 'ai-message', 'loading');
            loadingMessage.textContent = '正在思考...';
            chatMessages.appendChild(loadingMessage);

            try {
                // 调用AI获取回复
                const aiResponse = await callAI(message);
                // 移除加载提示
                chatMessages.removeChild(loadingMessage);
                // 显示AI回复
                addMessage(aiResponse, false);
            } catch (error) {
                // 移除加载提示
                chatMessages.removeChild(loadingMessage);
                // 显示错误消息
                addMessage('抱歉，发生了一些错误。请稍后再试。', false);
            }
        }
    }

    // 添加事件监听器
    chatButton.addEventListener('click', handleUserInput);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleUserInput();
        }
    });
});
