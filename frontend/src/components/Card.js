import React from 'react';

/**
 * Componente de Card Reutilizável para a aplicação Superland.
 *
 * Este componente serve como um contêiner estilizado para conteúdo,
 * aplicando o design consistente de cards (fundo escuro, bordas arredondadas, sombra),
 * utilizando as cores definidas no tailwind.config.js.
 *
 * @param {object} props - As propriedades do componente.
 * @param {React.ReactNode} props.children - O conteúdo a ser exibido dentro do card.
 * @param {string} [props.className=''] - Classes CSS adicionais para personalizar o estilo do card.
 */
const Card = ({ children, className = '' }) => (
  // Usando as classes de cor do Tailwind definidas em tailwind.config.js
  <div className={`bg-cardBackground rounded-xl shadow-lg p-6 ${className}`}>
    {children}
  </div>
);

export default Card;
