declare const CV: {
    readonly breakpoints: {
        readonly sm: 640;
        readonly lg: 1024;
    };
    readonly debounceMs: {
        readonly resize: 250;
        readonly scrollTriggerRefresh: 200;
    };
    readonly gsap: {
        readonly scrollReveal: {
            readonly desktop: {
                readonly y: -20;
                readonly blurIn: "8px";
                readonly blurOut: "0px";
                readonly duration: 0.5;
                readonly ease: "power2.out";
                readonly start: "top 88%";
            };
            /** Narrow viewports: no blur (GPU), batch stagger, earlier trigger */
            readonly mobile: {
                readonly y: -10;
                readonly duration: 0.35;
                readonly stagger: 0.04;
                readonly ease: "power2.out";
                readonly start: "top 92%";
            };
        };
    };
    readonly hoverPreview: {
        readonly edgePad: 8;
        readonly cursorOffset: 4;
        readonly fallbackSize: 64;
        readonly hideDelayMs: 150;
    };
    readonly idle: {
        readonly warmupTimeoutMs: 4000;
        readonly warmFallbackMs: 1200;
    };
};
type GsapGlobal = {
    registerPlugin: (p: unknown) => void;
    set: (t: string | Element | Element[], v: Record<string, unknown>) => void;
    to: (t: string | Element | Element[], v: Record<string, unknown>) => gsapTween;
};
type gsapTween = {
    scrollTrigger?: unknown;
};
type ScrollTriggerInstance = {
    kill: () => void;
};
type ScrollTriggerGlobal = {
    refresh: () => void;
    config: (vars: Record<string, unknown>) => void;
    getAll: () => ScrollTriggerInstance[];
    batch: (triggers: string | Element[], vars: {
        onEnter: (elements: Element[]) => void;
        start?: string;
        once?: boolean;
        interval?: number;
        batchMax?: number;
    }) => unknown;
};
type GsapWithMatchMedia = GsapGlobal & {
    matchMedia: () => {
        add: (query: string, setup: () => void | (() => void)) => void;
    };
};
//# sourceMappingURL=script.d.ts.map