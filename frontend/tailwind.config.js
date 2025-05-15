/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          purple: "#CF86FF",
          blue: "#AED2FF",
          lightPurple: "#EDD3FF",
          mediumBlue: "#61A3F5",
          darkPurple: "#9400FF",
          lightBlue: "#89BCFF",
        },
        gradient: {
          start: "#CF86FF",
          end: "#61A3F5",
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'chat-gradient': 'linear-gradient(to right, #CF86FF, #61A3F5)',
        'gradient-soft': 'linear-gradient(135deg, #EDD3FF 0%, #AED2FF 50%, rgba(174, 210, 255, 0.2) 100%)',
        'gradient-bubble': 'linear-gradient(135deg, #CF86FF 0%, #61A3F5 100%)',
      },
      animation: {
        'pulse-soft': 'pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bubble': 'bubble 0.5s ease-out forwards',
      },
      keyframes: {
        'pulse-soft': {
          '0%, 100%': {
            opacity: '1',
            transform: 'scale(1)'
          },
          '50%': {
            opacity: '0.8',
            transform: 'scale(1.05)'
          },
        },
        'bubble': {
          '0%': {
            transform: 'scale(0.95)',
            opacity: '0.7'
          },
          '50%': {
            transform: 'scale(1.05)',
            opacity: '1'
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1'
          }
        }
      },
      boxShadow: {
        'button': '0 4px 14px 0 rgba(207, 134, 255, 0.25)',
      },
    },
  },
  plugins: [],
};
