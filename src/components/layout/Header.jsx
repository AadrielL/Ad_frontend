import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap, Menu } from 'lucide-react';

// IMPORTAÇÃO DA FUNÇÃO DE SCROLL
import { scrollToSection } from '../../utils/scrollToSection';
// Ajuste o caminho conforme a localização real do seu utilitário

/**
 * Cabeçalho principal da aplicação.
 */
const Header = ({ openMenu, isVisible }) => {
    const location = useLocation();
    const isLandingPage = location.pathname === '/' || location.pathname === '/dashboard';

    // Classes para o header
    const headerClasses = `fixed top-0 left-0 right-0 z-40 bg-white shadow-lg transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`;

    // Função que lida com a navegação suave
    const handleScroll = (id) => {
        if (isLandingPage) {
            // Se estiver na Landing Page, usa a função de scroll suave
            scrollToSection(id);
        } else {
            // Se estiver em outra rota (ex: /login), redireciona para a landing page
            // e espera que o componente Dashboard lide com a rolagem (pode ser feito com useEffect no Dashboard)
            // Para simplificar, faremos o link direto, mas é uma simplificação.
        }
    };

    // Lista de itens de navegação
    const navItems = [
        { label: 'Início', id: 'inicio' },
        { label: 'Serviços', id: 'servicos' },
        { label: 'Calculadora', id: 'calculadora', isLink: true, to: '/quiz' }, // Link que vai para o quiz
        { label: 'Atendimento', id: 'atendimento' },
        { label: 'Contato', id: 'contato' },
        { label: 'Login', id: 'login', isLink: true, to: '/login' },
    ];

    return (
        <header className={headerClasses}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-black text-blue-600 flex items-center">
                    <Zap className="text-amber-500 mr-2" size={24} />
                    AD Comandos
                </Link>

                {/* Navegação Principal */}
                <nav className="hidden md:flex space-x-6 items-center">
                    {navItems.map((item) => (
                        item.isLink ? (
                            // Link direto (Calculadora, Login)
                            <Link
                                key={item.id}
                                to={item.to}
                                className="text-gray-600 hover:text-blue-600 font-medium transition"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            // Navegação de Âncora (usando handleClick para Scroll Suave)
                            <button
                                key={item.id}
                                onClick={() => handleScroll(item.id)}
                                className="text-gray-600 hover:text-blue-600 font-medium transition"
                            >
                                {item.label}
                            </button>
                        )
                    ))}
                </nav>

                {/* Botão do Menu Mobile */}
                <button
                    onClick={openMenu}
                    className="md:hidden p-2 text-gray-600 hover:text-blue-600 transition"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>
        </header>
    );
};

export default Header;