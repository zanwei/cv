// Resume page interaction script — motion/layout tokens (keep in sync with styles.css / tailwind.config.js)
const CV = {
    breakpoints: { sm: 640, lg: 1024 },
    debounceMs: { resize: 250, scrollTriggerRefresh: 200 },
    gsap: {
        scrollReveal: {
            desktop: {
                y: -20,
                blurIn: '8px',
                blurOut: '0px',
                duration: 0.5,
                ease: 'power2.out' as const,
                start: 'top 88%',
            },
        },
    },
    hoverPreview: {
        edgePad: 8,
        cursorOffset: 4,
        fallbackSize: 64,
        hideDelayMs: 150,
    },
    idle: { warmupTimeoutMs: 4000, warmFallbackMs: 1200 },
} as const;

type GsapGlobal = {
    registerPlugin: (p: unknown) => void;
    set: (t: string | Element | Element[], v: Record<string, unknown>) => void;
    to: (t: string | Element | Element[], v: Record<string, unknown>) => gsapTween;
};

type gsapTween = { scrollTrigger?: unknown };

type ScrollTriggerInstance = { kill: () => void };

type ScrollTriggerGlobal = {
    refresh: () => void;
    config: (vars: Record<string, unknown>) => void;
    getAll: () => ScrollTriggerInstance[];
    batch: (
        triggers: string | Element[],
        vars: {
            onEnter: (elements: Element[]) => void;
            start?: string;
            once?: boolean;
            interval?: number;
            batchMax?: number;
            /** GSAP: snap tweens to end on fast scroll (not in minimal typings) */
            fastScrollEnd?: boolean | number;
        }
    ) => unknown;
};

type GsapWithMatchMedia = GsapGlobal & {
    matchMedia: () => {
        add: (query: string, setup: () => void | (() => void)) => void;
    };
};

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
                    const smooth = window.innerWidth >= CV.breakpoints.sm;
                    target.scrollIntoView({
                        behavior: smooth ? 'smooth' : 'auto',
                        block: 'start',
                    });
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
            /** rAF batches layout read (innerWidth) after style flush — fewer forced reflows */
            requestAnimationFrame(() => {
                const w = window.innerWidth;
                const body = document.body;
                body.classList.toggle('mobile', w < CV.breakpoints.sm);
                body.classList.toggle(
                    'tablet',
                    w >= CV.breakpoints.sm && w < CV.breakpoints.lg
                );
                body.classList.toggle('desktop', w >= CV.breakpoints.lg);
            });
        };
        updateClass();
        window.addEventListener('resize', debounce(updateClass, CV.debounceMs.resize));
    };

    const enableScrollRevealAnimations = () => {
        const gsap = (window as unknown as { gsap?: GsapGlobal }).gsap;
        const ScrollTrigger = (window as unknown as { ScrollTrigger?: ScrollTriggerGlobal }).ScrollTrigger;
        if (!gsap || !ScrollTrigger) return;

        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduced) {
            gsap.set('.scroll-reveal', { clearProps: 'all' });
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        /** Fewer refreshes when mobile browser chrome shows/hides (address bar) */
        ScrollTrigger.config({ ignoreMobileResize: true });

        /** All geometry reads first, then gsap writes — avoids interleaved measure/layout thrash */
        const measureInitialVisibility = (elements: HTMLElement[]) => {
            const vh = window.innerHeight;
            return elements.map(el => {
                const rect = el.getBoundingClientRect();
                const inView = rect.top < vh && rect.bottom > 0;
                return { el, inView };
            });
        };

        const setWillChange = (el: HTMLElement, on: boolean) => {
            el.style.willChange = on ? 'transform, opacity, filter' : 'auto';
        };

        const setupDesktopReveal = () => {
            const d = CV.gsap.scrollReveal.desktop;
            const nodes = Array.from(
                document.querySelectorAll<HTMLElement>('.scroll-reveal')
            );
            const measured = measureInitialVisibility(nodes);
            measured.forEach(({ el, inView }) => {
                if (inView) {
                    gsap.set(el, { autoAlpha: 1, y: 0, filter: 'none' });
                    gsap.set(el, { clearProps: 'filter' });
                    return;
                }

                gsap.set(el, { autoAlpha: 0, y: d.y, filter: `blur(${d.blurIn})` });
                gsap.to(el, {
                    autoAlpha: 1,
                    filter: `blur(${d.blurOut})`,
                    y: 0,
                    duration: d.duration,
                    ease: d.ease,
                    force3D: true,
                    scrollTrigger: {
                        trigger: el,
                        start: d.start,
                        once: true,
                    },
                    onStart: () => setWillChange(el, true),
                    onComplete: () => {
                        setWillChange(el, false);
                        gsap.set(el, { clearProps: 'filter' });
                    },
                });
            });
        };

        const g = gsap as unknown as GsapWithMatchMedia;
        const mm = g.matchMedia();

        mm.add(`(min-width: ${CV.breakpoints.sm}px)`, () => {
            setupDesktopReveal();
            return () => {
                ScrollTrigger.getAll().forEach(st => st.kill());
                gsap.set('.scroll-reveal', { clearProps: 'all' });
            };
        });

        const isDesktopViewport = () =>
            window.matchMedia(`(min-width: ${CV.breakpoints.sm}px)`).matches;

        /** ScrollTrigger.refresh() is expensive; skip on narrow viewports to avoid forced reflow on mobile. */
        const refreshScrollTriggersIfDesktop = () => {
            if (isDesktopViewport()) ScrollTrigger.refresh();
        };

        refreshScrollTriggersIfDesktop();

        /** Late layout (fonts, images): one rAF refresh on desktop only */
        const scheduleRefresh = () => {
            requestAnimationFrame(() => {
                refreshScrollTriggersIfDesktop();
            });
        };
        let loadRefreshDone = false;
        window.addEventListener(
            'load',
            () => {
                if (loadRefreshDone) return;
                loadRefreshDone = true;
                scheduleRefresh();
            },
            { passive: true }
        );

        window.addEventListener(
            'resize',
            debounce(() => scheduleRefresh(), CV.debounceMs.scrollTriggerRefresh),
            { passive: true }
        );
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
                const { edgePad: pad, cursorOffset: off, fallbackSize } = CV.hoverPreview;
                const w = hoverContainer.offsetWidth || fallbackSize;
                const h = hoverContainer.offsetHeight || fallbackSize;
                const x = Math.min(mouseEvent.clientX + off, window.innerWidth - w - pad);
                const y = Math.min(mouseEvent.clientY + off, window.innerHeight - h - pad);
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
                }, CV.hoverPreview.hideDelayMs);
            };
            trigger.addEventListener('mouseleave', hide, { passive: true } as AddEventListenerOptions);
            trigger.addEventListener('mouseout', (e: Event) => {
                const mouseEvent = e as MouseEvent;
                if (!trigger.contains(mouseEvent.relatedTarget as Node)) hide();
            });
        });
        const hideGlobal = () => {
            if (!hoverContainer.classList.contains('show')) return;
            hoverContainer.classList.remove('show');
            hoverVideo.pause();
            setTimeout(() => {
                if (!hoverContainer.classList.contains('show')) {
                    hoverContainer.classList.remove('video-mode');
                }
            }, CV.hoverPreview.hideDelayMs);
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

    const shouldPreloadHoverVideos = () => {
        if (window.innerWidth < CV.breakpoints.sm) return false;
        const nav = navigator as Navigator & {
            connection?: { saveData?: boolean };
        };
        if (nav.connection?.saveData) return false;
        return true;
    };

    const warmHoverAssets = () => {
        preloadImages([
            'images/affine.png',
            'images/kwai.png',
            'images/ming.png',
            'images/design-dna.webp'
        ]);
        if (shouldPreloadHoverVideos()) {
            preloadVideos(['webM/skiller.webm', 'webM/fontDetector.webm']);
        }
    };

    const init = () => {
        if ('requestIdleCallback' in window) {
            (window as any).requestIdleCallback(warmHoverAssets, {
                timeout: CV.idle.warmupTimeoutMs,
            });
        } else {
            setTimeout(warmHoverAssets, CV.idle.warmFallbackMs);
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