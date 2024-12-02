/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
	],
  theme: {
    extend: {
      keyframes: {
        rain: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: 0 },
          '50%': { transform: 'translateY(10px) scale(1)', opacity: 1 },
          '100%': { transform: 'translateY(20px) scale(0.5)', opacity: 0 }
        },
        snow: {
          '0%': { transform: 'translateY(0) translateX(0) rotate(0deg) scale(1)', opacity: 0 },
          '50%': { transform: 'translateY(10px) translateX(5px) rotate(180deg) scale(1)', opacity: 1 },
          '100%': { transform: 'translateY(20px) translateX(-5px) rotate(360deg) scale(0.5)', opacity: 0 }
        },
        lightning: {
          '0%, 100%': { opacity: 0 },
          '10%, 90%': { opacity: 0 },
          '50%': { opacity: 1 }
        }
      },
      animation: {
        'rain': 'rain 1.5s linear infinite',
        'snow': 'snow 3s linear infinite',
        'lightning': 'lightning 2s ease-in-out infinite'
      }
    },
  },
}