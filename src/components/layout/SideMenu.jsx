import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn, UserCog, Calculator } from 'lucide-react';
// ✅ IMPORTAR useAuth
import { useAuth } from '../../context/AuthContext';
/**
 * Menu lateral para dispositivos móveis, suportando navegação por âncora.
 */
const SideMenu = ({ isOpen, onClose }) => {
    // ✅ USAR useAuth()
    const { isAuthenticated } = useAuth();

    const menuClasses = `fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
    }`;
    const overlayClasses = `fixed inset-0 z-40 bg-black opacity-50 transition-opacity duration-300 ${
        isOpen ? 'block' : 'hidden'
    }`;

    // Função que fecha o menu e executa a navegação por âncora
    const handleLinkClick = (e) => {
        onClose();
        setTimeout(() => {
            const id = e.currentTarget.getAttribute('href').substring(1);
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }, 300);
    };

    return (
        <>
            <div className={overlayClasses} onClick={onClose}></div>
            <div className={menuClasses}>
                <div className="p-4 flex justify-end">
                    <button onClick={onClose} className="text-gray-600 hover:text-red-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <nav className="flex flex-col p-4 space-y-4">

                    {/* Links Públicos */}
                    <Link to="/" className="text-gray-800 hover:bg-gray-100 p-2 rounded font-medium" onClick={onClose}>Home</Link>
                    <a href="#servicos" className="text-gray-800 hover:bg-gray-100 p-2 rounded font-medium" onClick={handleLinkClick}>Serviços</a>
                    <Link to="/calculadora" className="text-gray-800 hover:bg-gray-100 p-2 rounded font-medium flex items-center" onClick={onClose}>
                        <Calculator size={20} className="mr-2"/> Calculadora
                    </Link>
                    <a href="#contato" className="text-gray-800 hover:bg-gray-100 p-2 rounded font-medium" onClick={handleLinkClick}>Contato</a>

                    {/* Linha Divisória */}
                    <hr className="my-2 border-gray-200" />

                    {/* LINKS CONDICIONAIS */}

                    {isAuthenticated ? (
                        // ✅ VISÍVEL SE AUTENTICADO: Link para a área de controle
                        <Link
                            to="/admin"
                            className="flex items-center text-indigo-600 font-bold hover:bg-indigo-50 p-2 rounded"
                            onClick={onClose}
                        >
                            <UserCog size={20} className="mr-2" />
                            Área de Controle / Admin
                        </Link>
                    ) : (
                        // ✅ VISÍVEL SE NÃO AUTENTICADO: Link para Login/Cadastro
                        <Link
                            to="/login"
                            className="flex items-center text-blue-600 hover:bg-blue-50 p-2 rounded font-medium"
                            onClick={onClose}
                        >
                            <LogIn size={20} className="mr-2" />
                            Login / Cadastro
                        </Link>
                    )}
                </nav>
            </div>
        </>
    );
};

export default SideMenu;