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
        // 为页面刷新后的初始动画添加延迟
        const animatedElements = [
            // 头部区域
            document.querySelector('.avatar-container'),
            document.querySelector('.bio-text'),
            // 各个section
            ...Array.from(document.querySelectorAll('.section-work, .section-education, .section-project, .section-contact'))
        ].filter(Boolean);

        animatedElements.forEach((element, index) => {
            if (element) {
                // 初始隐藏
                element.style.opacity = '0';
                element.style.transform = 'translateY(-3px)';
                
                // 添加延迟动画
                setTimeout(() => {
                    element.classList.add('animate-fade-in');
                }, 300); // 统一300ms延迟
            }
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
new Resume(); 