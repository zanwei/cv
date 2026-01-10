// Resume page interaction script
(() => {
    const debounce = (fn: Function, wait: number) => {
        let timer: NodeJS.Timeout;
        return (...args: any[]) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(null, args), wait);
        };
    };

    const enableSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', e => {
                const href = link.getAttribute('href');
                if (!href || href === '#') return;
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    };

    const enableExternalLinkTracking = () => {
        document.querySelectorAll('a[target="_blank"]').forEach(link => {
            link.addEventListener('click', () => {
                const href = (link as HTMLAnchorElement).href;
                console.log(`External link clicked: ${href}`);
            });
        });
    };

    const enableResponsiveClasses = () => {
        const updateClass = () => {
            const w = window.innerWidth;
            const body = document.body;
            body.classList.toggle('mobile', w < 640);
            body.classList.toggle('tablet', w >= 640 && w < 1024);
            body.classList.toggle('desktop', w >= 1024);
        };
        updateClass();
        window.addEventListener('resize', debounce(updateClass, 250));
    };

    const playInitialAnimations = () => {
        const elements = [
            document.querySelector('.avatar-container'),
            document.querySelector('.bio-text'),
            ...document.querySelectorAll('.section-work, .section-education, .section-project, .section-contact')
        ].filter(Boolean);
        elements.forEach(el => {
            if (el) {
                (el as HTMLElement).style.opacity = '0';
                (el as HTMLElement).style.transform = 'translateY(-3px)';
                requestAnimationFrame(() => {
                    el.classList.add('animate-fade-in');
                });
            }
        });
    };

    const enableScrollAnimations = () => {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        document.querySelectorAll('[class*="section-"]').forEach(section => {
            observer.observe(section);
        });
    };

    const enableHoverImageEffect = () => {
        const hoverContainer = document.getElementById('hover-image');
        const hoverImg = document.getElementById('hover-img') as HTMLImageElement;
        const hoverVideo = document.getElementById('hover-video') as HTMLVideoElement;
        if (!hoverContainer || !hoverImg || !hoverVideo) return;
        const imageMap: Record<string, string> = {
            'affine': 'images/affine.png',
            'ming': 'images/ming.png',
            'kwai': 'images/kwai.png',
            'skiller': 'webM/skiller.webm',
            'fontdetector': 'webM/fontDetector.webm',
        };
        document.querySelectorAll('.hover-trigger').forEach(trigger => {
            trigger.addEventListener('mouseenter', () => {
                const type = trigger.getAttribute('data-image');
                const src = imageMap[type || ''];
                if (src) {
                    const isVideo = src.endsWith('.webm') || src.endsWith('.mp4');
                    if (isVideo) {
                        hoverImg.style.display = 'none';
                        hoverVideo.style.display = 'block';
                        hoverVideo.src = src;
                        hoverVideo.play();
                        hoverContainer.classList.add('show', 'video-mode');
                    } else {
                        hoverVideo.style.display = 'none';
                        hoverVideo.pause();
                        hoverImg.style.display = 'block';
                        hoverImg.src = src;
                        hoverImg.alt = `${type} logo`;
                        hoverContainer.classList.remove('video-mode');
                        hoverContainer.classList.add('show');
                    }
                }
            });
            trigger.addEventListener('mousemove', (e: Event) => {
                const mouseEvent = e as MouseEvent;
                const x = Math.min(mouseEvent.clientX + 4, window.innerWidth - 34);
                const y = Math.max(mouseEvent.clientY - 24, 0);
                hoverContainer.style.left = `${x}px`;
                hoverContainer.style.top = `${y}px`;
            });
            const hide = () => {
                hoverContainer.classList.remove('show', 'video-mode');
                hoverVideo.pause();
            };
            trigger.addEventListener('mouseleave', hide, { passive: true } as AddEventListenerOptions);
            trigger.addEventListener('mouseout', (e: Event) => {
                const mouseEvent = e as MouseEvent;
                if (!trigger.contains(mouseEvent.relatedTarget as Node)) hide();
            });
        });
        window.addEventListener('scroll', () => {
            hoverContainer.classList.remove('show', 'video-mode');
            hoverVideo.pause();
        }, { passive: true });
        document.addEventListener('click', () => {
            hoverContainer.classList.remove('show', 'video-mode');
            hoverVideo.pause();
        });
    };

    const preloadImages = (srcArr: string[]) => {
        srcArr.forEach(src => {
            const img = new window.Image();
            (img as any).decoding = 'async';
            (img as any).loading = 'eager';
            img.src = src;
        });
    };

    const init = () => {
        preloadImages([
            'images/affine.png',
            'images/kwai.png',
            'images/ming.png'
        ]);
        enableSmoothScroll();
        enableExternalLinkTracking();
        enableResponsiveClasses();
        playInitialAnimations();
        enableScrollAnimations();
        enableHoverImageEffect();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})(); 