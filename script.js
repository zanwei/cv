// 简历页面交互脚本
class Resume {
    constructor() {
        this.init();
    }

    init() {
        // 等待 DOM 加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupEventListeners();
            });
        } else {
            this.setupEventListeners();
        }
    }

    setupEventListeners() {
        this.addSmoothScrolling();
        this.addLinkTracking();
        this.addResponsiveEnhancements();
        this.addAnimations();
        this.addHoverImageEffect();
    }

    addSmoothScrolling() {
        // 为所有锚点链接添加平滑滚动
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href') || '');
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    addLinkTracking() {
        // 为外部链接添加点击追踪
        const externalLinks = document.querySelectorAll('a[target="_blank"]');
        externalLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.href;
                console.log(`外部链接点击: ${href}`);
                
                // 可以在这里添加分析代码
                // 例如: gtag('event', 'click', { event_category: 'external_link', event_label: href });
            });
        });
    }

    addResponsiveEnhancements() {
        // 响应式增强功能
        const handleResize = () => {
            const width = window.innerWidth;
            const body = document.body;
            
            // 根据屏幕宽度添加不同的类
            if (width < 640) {
                body.classList.add('mobile');
                body.classList.remove('tablet', 'desktop');
            } else if (width < 1024) {
                body.classList.add('tablet');
                body.classList.remove('mobile', 'desktop');
            } else {
                body.classList.add('desktop');
                body.classList.remove('mobile', 'tablet');
            }
        };

        // 初始化和监听窗口大小变化
        handleResize();
        window.addEventListener('resize', debounce(handleResize, 250));
    }

    addAnimations() {
        // 为页面加载时添加动画
        this.addInitialAnimations();
        
        // 添加滚动进入动画
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // 观察所有主要部分
        const sections = document.querySelectorAll('[class*="section-"]');
        sections.forEach(section => {
            observer.observe(section);
        });
    }

    addInitialAnimations() {
        // 为页面刷新后的初始动画，所有元素同时进行
        const animatedElements = [
            // 头部区域
            document.querySelector('.avatar-container'),
            document.querySelector('.bio-text'),
            // 各个section
            ...Array.from(document.querySelectorAll('.section-work, .section-education, .section-project, .section-contact'))
        ].filter(Boolean);

        animatedElements.forEach((element) => {
            if (element) {
                // 初始隐藏
                element.style.opacity = '0';
                element.style.transform = 'translateY(-3px)';
                
                // 所有元素同时开始动画，无延迟
                setTimeout(() => {
                    element.classList.add('animate-fade-in');
                }, 0); // 无延迟，同时进行
            }
        });
    }

    addHoverImageEffect() {
        // 获取悬浮图片容器和图片元素
        const hoverContainer = document.getElementById('hover-image');
        const hoverImg = document.getElementById('hover-img');
        
        if (!hoverContainer || !hoverImg) return;

        // 图片映射
        const imageMap = {
            'affine': 'images/affine.png',
            'ming': 'images/ming.png',
            'kwai': 'images/kwai.png'
        };

        // 获取所有触发器元素
        const triggers = document.querySelectorAll('.hover-trigger');
        
        triggers.forEach(trigger => {
            // 鼠标进入事件
            trigger.addEventListener('mouseenter', (e) => {
                const imageType = trigger.getAttribute('data-image');
                const imageSrc = imageMap[imageType];
                
                if (imageSrc) {
                    hoverImg.src = imageSrc;
                    hoverImg.alt = `${imageType} logo`;
                    hoverContainer.classList.add('show');
                }
            });

            // 鼠标移动事件
            trigger.addEventListener('mousemove', (e) => {
                // 获取鼠标位置，添加4px偏移
                const x = e.clientX + 4;
                const y = e.clientY + 4;
                
                // 确保图片不会超出视窗边界 (30px光球尺寸)
                const maxX = window.innerWidth - 30 - 4;
                const maxY = window.innerHeight - 30 - 4;
                
                const finalX = Math.min(x, maxX);
                const finalY = Math.min(y, maxY);
                
                hoverContainer.style.left = `${finalX}px`;
                hoverContainer.style.top = `${finalY}px`;
            });

            // 鼠标离开事件
            trigger.addEventListener('mouseleave', () => {
                hoverContainer.classList.remove('show');
            });

            // 添加额外的鼠标离开检测，确保图片能及时消失
            trigger.addEventListener('mouseout', (e) => {
                // 检查鼠标是否真的离开了元素
                if (!trigger.contains(e.relatedTarget)) {
                    hoverContainer.classList.remove('show');
                }
            });
        });

        // 页面滚动时隐藏悬浮图片
        window.addEventListener('scroll', () => {
            hoverContainer.classList.remove('show');
        });

        // 点击页面其他地方时隐藏图片
        document.addEventListener('click', () => {
            hoverContainer.classList.remove('show');
        });
    }
}

// 工具函数：防抖
function debounce(func, wait) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(null, args), wait);
    };
}

// 初始化应用
const resume = new Resume(); 