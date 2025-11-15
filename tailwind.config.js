/** @type {import('tailwindcss').Config} */
module.exports = {
    // O 'content' diz ao Tailwind onde procurar as classes que você usa
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            // Configurações personalizadas (cores, fontes, etc.)
            fontFamily: {
                // Use 'inter' como padrão
                sans: ['Inter', 'sans-serif'],
            },
            // Adicionando uma animação simples para os resultados
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            },
            animation: {
                fadeIn: 'fadeIn 0.5s ease-out forwards',
            }
        },
    },
    plugins: [],
}