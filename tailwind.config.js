/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
    './tela_inicial/**/*.{html,js}', // ajuste para seus arquivos
    './tela_login/**/*.{html,js}',
    './tela_principal/**/*.{html,js}'
  ],
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['Poppins', 'sans-serif'],
          },
          colors: {
            primary: {
              500: '#3B82F6',
              600: '#2563EB',
              700: '#1D4ED8',
            },
            secondary: {
              500: '#6366F1',
              600: '#4F46E5',
            }
          }
        }
      },
        plugins: [
    // por exemplo: require('@tailwindcss/forms'),
        ],
    };