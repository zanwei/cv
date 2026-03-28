"use strict";
// Resume page interaction script — motion/layout tokens (keep in sync with styles.css / tailwind.config.js)
const CV = {
    breakpoints: { sm: 640, lg: 1024 },
    debounceMs: { resize: 250, scrollTriggerRefresh: 200 },
    gsap: {
        scrollReveal: {
            y: -20,
            blurIn: '8px',
            blurOut: '0px',
            duration: 0.5,
            ease: 'power2.out',
            start: 'top 88%',
        },
    },
    hoverPreview: {
        edgePad: 8,
        cursorOffset: 4,
        fallbackSize: 64,
        hideDelayMs: 150,
    },
    idle: { warmupTimeoutMs: 4000, warmFallbackMs: 1200 },
};
(() => {
    const debounce = (fn, wait) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(null, args), wait);
        };
    };
    const enableSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', e => {
                const href = link.getAttribute('href');
                if (!href || href === '#')
                    return;
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
                const href = link.href;
                console.log(`External link clicked: ${href}`);
            });
        });
    };
    const enableAvatarProtection = () => {
        const container = document.querySelector('.avatar-container');
        if (!container)
            return;
        const block = (e) => e.preventDefault();
        container.addEventListener('contextmenu', block);
        container.addEventListener('dragstart', block);
    };
    const enableResponsiveClasses = () => {
        const updateClass = () => {
            const w = window.innerWidth;
            const body = document.body;
            body.classList.toggle('mobile', w < CV.breakpoints.sm);
            body.classList.toggle('tablet', w >= CV.breakpoints.sm && w < CV.breakpoints.lg);
            body.classList.toggle('desktop', w >= CV.breakpoints.lg);
        };
        updateClass();
        window.addEventListener('resize', debounce(updateClass, CV.debounceMs.resize));
    };
    const enableScrollRevealAnimations = () => {
        const gsap = window.gsap;
        const ScrollTrigger = window.ScrollTrigger;
        if (!gsap || !ScrollTrigger)
            return;
        gsap.registerPlugin(ScrollTrigger);
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduced) {
            gsap.set('.scroll-reveal', { clearProps: 'all' });
            return;
        }
        const setWillChange = (el, on) => {
            el.style.willChange = on ? 'transform, opacity, filter' : 'auto';
        };
        document.querySelectorAll('.scroll-reveal').forEach(el => {
            const rect = el.getBoundingClientRect();
            const vh = window.innerHeight;
            const inInitialViewport = rect.top < vh && rect.bottom > 0;
            if (inInitialViewport) {
                gsap.set(el, { autoAlpha: 1, y: 0, filter: 'none' });
                gsap.set(el, { clearProps: 'filter' });
                return;
            }
            const sr = CV.gsap.scrollReveal;
            gsap.set(el, { autoAlpha: 0, y: sr.y, filter: `blur(${sr.blurIn})` });
            gsap.to(el, {
                autoAlpha: 1,
                filter: `blur(${sr.blurOut})`,
                y: 0,
                duration: sr.duration,
                ease: sr.ease,
                force3D: true,
                scrollTrigger: {
                    trigger: el,
                    start: sr.start,
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
        window.addEventListener('resize', debounce(() => ScrollTrigger.refresh(), CV.debounceMs.scrollTriggerRefresh), { passive: true });
    };
    const enableHoverImageEffect = () => {
        const hoverContainer = document.getElementById('hover-image');
        const hoverImg = document.getElementById('hover-img');
        const hoverVideo = document.getElementById('hover-video');
        if (!hoverContainer || !hoverImg || !hoverVideo)
            return;
        const imageMap = {
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
                    }
                    else {
                        hoverVideo.style.display = 'none';
                        hoverVideo.pause();
                        hoverImg.style.display = 'block';
                        if (src.endsWith('.webp')) {
                            hoverImg.addEventListener('error', function tryPngFallback() {
                                hoverImg.src = src.replace(/\.webp$/, '.png');
                            }, { once: true });
                        }
                        hoverImg.src = src;
                        hoverImg.alt =
                            type && largeImagePreviewTypes.has(type)
                                ? 'Design-DNA Skill page preview'
                                : `${type} logo`;
                        if (type && largeImagePreviewTypes.has(type)) {
                            hoverContainer.classList.add('video-mode');
                        }
                        else {
                            hoverContainer.classList.remove('video-mode');
                        }
                        hoverContainer.classList.add('show');
                    }
                }
            });
            trigger.addEventListener('mousemove', (e) => {
                const mouseEvent = e;
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
            trigger.addEventListener('mouseleave', hide, { passive: true });
            trigger.addEventListener('mouseout', (e) => {
                const mouseEvent = e;
                if (!trigger.contains(mouseEvent.relatedTarget))
                    hide();
            });
        });
        const hideGlobal = () => {
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
    const preloadImages = (srcArr) => {
        srcArr.forEach(src => {
            const img = new window.Image();
            img.decoding = 'async';
            img.loading = 'eager';
            img.src = src;
        });
    };
    const preloadVideos = (srcArr) => {
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
            window.requestIdleCallback(warmHoverAssets, {
                timeout: CV.idle.warmupTimeoutMs,
            });
        }
        else {
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
    }
    else {
        init();
    }
})();
//# sourceMappingURL=script.js.map