/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1A365D',
          light: '#2C5282',
          dark: '#0D1B2A',
        },
        secondary: {
          DEFAULT: '#718096',
          light: '#A0AEC0',
          dark: '#4A5568',
        },
        accent: {
          DEFAULT: '#48BB78',
          dark: '#38A169',
        },
        background: {
          DEFAULT: '#F7FAFC',
          dark: '#1A202C',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#2D3748',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
        '3xl': '64px',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      screens: {
        xs: '475px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
      maxWidth: {
        prose: '65ch',
      },
      transitionDuration: {
        200: '200ms',
        300: '300ms',
      },
      zIndex: {
        40: '40',
        50: '50',
        60: '60',
      },
    },
  },
  plugins: [
    function ({ addBase, addComponents, theme }) {
      addBase({
        html: {
          fontSize: '16px',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
        body: {
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
          backgroundColor: theme('colors.background.DEFAULT'),
          color: '#2D3748',
          lineHeight: '1.6',
        },
      });
      addComponents({
        '.container': {
          width: '100%',
          maxWidth: '1200px',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: theme('spacing.md'),
          paddingRight: theme('spacing.md'),
          '@screen md': {
            paddingLeft: theme('spacing.xl'),
            paddingRight: theme('spacing.xl'),
          },
        },
      });
    },
  ],
};
