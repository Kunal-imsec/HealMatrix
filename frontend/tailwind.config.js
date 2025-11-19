/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        /* ===========================
           Material Design 3 System Colors
        =========================== */

        // Primary
        primary: 'rgb(var(--md-sys-color-primary) / <alpha-value>)',
        'on-primary': 'rgb(var(--md-sys-color-on-primary) / <alpha-value>)',
        'primary-container': 'rgb(var(--md-sys-color-primary-container) / <alpha-value>)',
        'on-primary-container': 'rgb(var(--md-sys-color-on-primary-container) / <alpha-value>)',

        // Secondary
        secondary: 'rgb(var(--md-sys-color-secondary) / <alpha-value>)',
        'on-secondary': 'rgb(var(--md-sys-color-on-secondary) / <alpha-value>)',
        'secondary-container': 'rgb(var(--md-sys-color-secondary-container) / <alpha-value>)',
        'on-secondary-container': 'rgb(var(--md-sys-color-on-secondary-container) / <alpha-value>)',

        // Surface & Background
        surface: 'rgb(var(--md-sys-color-surface) / <alpha-value>)',
        'on-surface': 'rgb(var(--md-sys-color-on-surface) / <alpha-value>)',
        'surface-variant': 'rgb(var(--md-sys-color-surface-variant) / <alpha-value>)',
        'on-surface-variant': 'rgb(var(--md-sys-color-on-surface-variant) / <alpha-value>)',
        background: 'rgb(var(--md-sys-color-background) / <alpha-value>)',
        'on-background': 'rgb(var(--md-sys-color-on-background) / <alpha-value>)',

        // Outline & Border
        outline: 'rgb(var(--md-sys-color-outline) / <alpha-value>)',
        'outline-variant': 'rgb(var(--md-sys-color-outline-variant) / <alpha-value>)',
        border: 'rgb(var(--md-sys-color-outline-variant) / <alpha-value>)',

        // Error
        error: 'rgb(var(--md-sys-color-error) / <alpha-value>)',
        'on-error': 'rgb(var(--md-sys-color-on-error) / <alpha-value>)',
        'error-container': 'rgb(var(--md-sys-color-error-container) / <alpha-value>)',

        // Success
        success: 'rgb(var(--md-sys-color-success) / <alpha-value>)',
        'on-success': 'rgb(var(--md-sys-color-on-success) / <alpha-value>)',
        'success-container': 'rgb(var(--md-sys-color-success-container) / <alpha-value>)',

        // Warning
        warning: 'rgb(var(--md-sys-color-warning) / <alpha-value>)',
        'on-warning': 'rgb(var(--md-sys-color-on-warning) / <alpha-value>)',
        'warning-container': 'rgb(var(--md-sys-color-warning-container) / <alpha-value>)',

        /* ===========================
           Custom Hospital Palette
        =========================== */
        hospital: {
          primary: '#0066CC',
          secondary: '#00A86B',
          accent: '#FF6B6B',
          dark: '#1A202C',
          light: '#F7FAFC',
        },
      },

      /* ===========================
         Shape & Typography
      =========================== */
      borderRadius: {
        'xs': 'var(--md-sys-shape-corner-extra-small)',
        'sm': 'var(--md-sys-shape-corner-small)',
        'md': 'var(--md-sys-shape-corner-medium)',
        'lg': 'var(--md-sys-shape-corner-large)',
        'xl': 'var(--md-sys-shape-corner-extra-large)',
      },
      fontFamily: {
        sans: ['Roboto', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
