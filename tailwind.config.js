/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html'],
  theme: {
    extend: {
      lineHeight: {
        /** text-xs (12px): ~25px line box — section labels, mono dates */
        'cv-xs': '2.0833333333',
        /** text-sm (14px): ~25px line box — titles, links, primary one-liners */
        'cv-sm': '1.7857142857',
        /** text-sm (14px): ~24px line box — bio, muted descriptions */
        'cv-muted': '1.7142857143',
      },
      maxWidth: {
        /** Main column (600px) */
        cv: '37.5rem',
      },
      minWidth: {
        /** Minimum readable width (375px) */
        cv: '23.4375rem',
      },
      spacing: {
        /** Page shell padding (p-4) */
        'cv-shell': '1rem',
        /** Horizontal padding mobile / desktop */
        'cv-px': '1.5rem',
        'cv-px-lg': '3rem',
        /** Vertical padding block */
        'cv-py': '2rem',
        /** Desktop vertical padding (59px — Figma) */
        'cv-py-lg': '3.6875rem',
        /** Section title ↔ rows */
        'cv-sm': '0.5rem',
        /** Between section label and entries */
        'cv-md': '0.75rem',
        /** Header stack */
        'cv-lg': '1rem',
        /** Main column gap */
        'cv-xl': '1.5rem',
        'cv-2xl': '2rem',
        /** Tight row gap (mobile) */
        'cv-tight': '0.25rem',
        /** Contact channel list — between rows */
        'cv-contact': '0.25rem',
        /** Left gutter width (w-20) */
        'cv-gutter': '5rem',
        /** Section row cap / line-height visual */
        'cv-row': '1.5625rem',
        /** Avatar box */
        'cv-avatar': '4.0625rem',
      },
      width: {
        'cv-gutter': '5rem',
        'cv-avatar': '4.0625rem',
      },
      height: {
        'cv-row': '1.5625rem',
        'cv-avatar': '4.0625rem',
      },
    },
  },
  plugins: [],
};
