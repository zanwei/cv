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

    const enableAvatarProtection = () => {
        const container = document.querySelector('.avatar-container');
        if (!container) return;
        const block = (e: Event) => e.preventDefault();
        container.addEventListener('contextmenu', block);
        container.addEventListener('dragstart', block);
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

    const enableScrollRevealAnimations = () => {
        const gsap = (window as unknown as { gsap?: GsapGlobal }).gsap;
        const ScrollTrigger = (window as unknown as { ScrollTrigger?: ScrollTriggerGlobal }).ScrollTrigger;
        if (!gsap || !ScrollTrigger) return;
        gsap.registerPlugin(ScrollTrigger);

        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduced) {
            gsap.set('.scroll-reveal', { clearProps: 'all' });
            return;
        }

        const setWillChange = (el: HTMLElement, on: boolean) => {
            el.style.willChange = on ? 'transform, opacity, filter' : 'auto';
        };

        document.querySelectorAll<HTMLElement>('.scroll-reveal').forEach(el => {
            const rect = el.getBoundingClientRect();
            const vh = window.innerHeight;
            const inInitialViewport = rect.top < vh && rect.bottom > 0;

            if (inInitialViewport) {
                gsap.set(el, { autoAlpha: 1, y: 0, filter: 'none' });
                gsap.set(el, { clearProps: 'filter' });
                return;
            }

            gsap.set(el, { autoAlpha: 0, y: -20, filter: 'blur(8px)' });
            gsap.to(el, {
                autoAlpha: 1,
                filter: 'blur(0px)',
                y: 0,
                duration: 0.5,
                ease: 'power2.out',
                force3D: true,
                scrollTrigger: {
                    trigger: el,
                    start: 'top 88%',
                    once: true,
                },
                onStart: () => setWillChange(el, true),
                onComplete: () => {
                    setWillChange(el, false);
                    gsap.set(el, { clearProps: 'filter' });
                },
            });
        });

        const refresh = () => ScrollTrigger.refresh();
        window.addEventListener('load', refresh, { passive: true });
        requestAnimationFrame(refresh);
        window.addEventListener(
            'resize',
            debounce(() => ScrollTrigger.refresh(), 200),
            { passive: true }
        );
    };

    type GsapGlobal = {
        registerPlugin: (p: unknown) => void;
        set: (t: string | Element | Element[], v: Record<string, unknown>) => void;
        to: (t: string | Element, v: Record<string, unknown>) => gsapTween;
    };

    type gsapTween = { scrollTrigger?: unknown };

    type ScrollTriggerGlobal = {
        refresh: () => void;
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
            'design-dna': 'images/design-dna.webp',
            'skiller': 'webM/skiller.webm',
            'fontdetector': 'webM/fontDetector.webm',
        };

        const largeImagePreviewTypes = new Set(['design-dna']);
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
                        if (src.endsWith('.webp')) {
                            hoverImg.addEventListener(
                                'error',
                                function tryPngFallback() {
                                    hoverImg.src = src.replace(/\.webp$/, '.png');
                                },
                                { once: true }
                            );
                        }
                        hoverImg.src = src;
                        hoverImg.alt =
                            type && largeImagePreviewTypes.has(type)
                                ? 'Design-DNA Skill page preview'
                                : `${type} logo`;
                        if (type && largeImagePreviewTypes.has(type)) {
                            hoverContainer.classList.add('video-mode');
                        } else {
                            hoverContainer.classList.remove('video-mode');
                        }
                        hoverContainer.classList.add('show');
                    }
                }
            });
            trigger.addEventListener('mousemove', (e: Event) => {
                const mouseEvent = e as MouseEvent;
                const pad = 8;
                const w = hoverContainer.offsetWidth || 64;
                const h = hoverContainer.offsetHeight || 64;
                const x = Math.min(mouseEvent.clientX + 4, window.innerWidth - w - pad);
                const y = Math.min(mouseEvent.clientY + 4, window.innerHeight - h - pad);
                hoverContainer.style.left = `${Math.max(pad, x)}px`;
                hoverContainer.style.top = `${Math.max(pad, y)}px`;
            });
            const hide = () => {
                hoverContainer.classList.remove('show');
                hoverVideo.pause();
                // Delay removing video-mode to prevent size jump during fade out
                setTimeout(() => {
                    if (!hoverContainer.classList.contains('show')) {
                        hoverContainer.classList.remove('video-mode');
                    }
                }, 150);
            };
            trigger.addEventListener('mouseleave', hide, { passive: true } as AddEventListenerOptions);
            trigger.addEventListener('mouseout', (e: Event) => {
                const mouseEvent = e as MouseEvent;
                if (!trigger.contains(mouseEvent.relatedTarget as Node)) hide();
            });
        });
        const hideGlobal = () => {
            hoverContainer.classList.remove('show');
            hoverVideo.pause();
            setTimeout(() => {
                if (!hoverContainer.classList.contains('show')) {
                    hoverContainer.classList.remove('video-mode');
                }
            }, 150);
        };
        window.addEventListener('scroll', hideGlobal, { passive: true });
        document.addEventListener('click', hideGlobal);
    };

    const preloadImages = (srcArr: string[]) => {
        srcArr.forEach(src => {
            const img = new window.Image();
            (img as any).decoding = 'async';
            (img as any).loading = 'eager';
            img.src = src;
        });
    };

    const preloadVideos = (srcArr: string[]) => {
        srcArr.forEach(src => {
            const video = document.createElement('video');
            video.preload = 'auto';
            video.muted = true;
            video.src = src;
            video.load();
        });
    };

    const warmHoverAssets = () => {
        preloadImages([
            'images/affine.png',
            'images/kwai.png',
            'images/ming.png',
            'images/design-dna.webp'
        ]);
        preloadVideos([
            'webM/skiller.webm',
            'webM/fontDetector.webm'
        ]);
    };

    const init = () => {
        if ('requestIdleCallback' in window) {
            (window as any).requestIdleCallback(warmHoverAssets, { timeout: 4000 });
        } else {
            setTimeout(warmHoverAssets, 1200);
        }
        enableSmoothScroll();
        enableExternalLinkTracking();
        enableResponsiveClasses();
        enableAvatarProtection();
        enableScrollRevealAnimations();
        enableHoverImageEffect();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})(); 