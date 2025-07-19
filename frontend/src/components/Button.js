import React from 'react';
import { Loader } from 'lucide-react'; // Importar Loader para o estado de carregamento

/**
 * Componente de Botão Reutilizável para a aplicação Superland.
 *
 * Este componente garante consistência no design (cores, bordas arredondadas, efeitos de hover)
 * e na interação em toda a aplicação, utilizando as cores definidas no tailwind.config.js.
 *
 * @param {object} props - As propriedades do componente.
 * @param {React.ReactNode} props.children - O conteúdo do botão (texto, outros elementos).
 * @param {React.ComponentType<any>} [props.icon] - Um componente de ícone (ex: de 'lucide-react') para exibir à esquerda do texto.
 * @param {function} props.onClick - A função a ser executada quando o botão é clicado.
 * @param {string} [props.className] - Classes CSS adicionais para personalizar o estilo do botão.
 * @param {string} [props.type='button'] - O tipo do botão (ex: 'submit', 'button').
 * @param {boolean} [props.disabled=false] - Se o botão deve estar desabilitado.
 * @param {boolean} [props.loading=false] - Se o botão deve exibir um estado de carregamento.
 */
const Button = ({ children, icon: Icon, onClick, className = '', type = 'button', disabled = false, loading = false }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled || loading} // Desabilita se estiver desabilitado ou a carregar
    // Usando as classes de cor do Tailwind definidas em tailwind.config.js
    className={`flex items-center justify-center px-6 py-3 rounded-full font-semibold text-lg transition-all duration-300 ease-in-out
                bg-gradient-to-r from-goldPrimary to-yellow-600 text-black
                hover:from-yellow-600 hover:to-goldPrimary hover:shadow-xl
                focus:outline-none focus:ring-4 focus:ring-yellow-500 focus:ring-opacity-50 w-full mb-2
                ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
                ${className}`}
  >
    {loading ? ( // Exibe o spinner de carregamento se loading for true
      <Loader size={20} className="animate-spin mr-2" />
    ) : (
      Icon && <Icon size={20} className="mr-2" />
    )}
    {children}
  </button>
);

export default Button;
