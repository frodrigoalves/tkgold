// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Estes caminhos garantem que o Tailwind escaneie todos os seus arquivos React
    // em busca de classes que ele precisa incluir no CSS final.
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html', // Inclua se você usa classes Tailwind diretamente no HTML público
  ],
  theme: {
    extend: {
      fontFamily: {
        // Exemplo de como definir uma fonte personalizada
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        // Paleta de cores Gold DAO centralizada
        darkBackground: '#0D0D0D', // Preto profundo
        cardBackground: '#1A1A1A', // Preto ligeiramente mais claro para cards
        goldPrimary: '#FFD700',    // Dourado vibrante
        blueAccent: '#000080',     // Azul escuro
        whiteText: '#FFFFFF',      // Branco puro
        lightGrey: '#B0B0B0',      // Cinza claro para texto secundário
        greenSuccess: '#28A745',   // Verde para sucesso/ativo
        redError: '#DC3545',       // Vermelho para erro/inativo
      },
    },
  },
  plugins: [],
}
