import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Garanta que este caminho (../context/AuthContext) esteja correto
import { Code, Zap } from 'lucide-react';

/**
 * Componente Home (Página Inicial Pública).
 * Rota: /
 */
const Home = () => {
    // Note: useAuth está sendo usado, mesmo que a página seja pública.
    // Isso é para personalizar a experiência de quem já está logado.
    const { isAuthenticated } = useAuth();

    return (
        <div className="min-h-[80vh] bg-white text-gray-900 flex flex-col items-center justify-center p-4">
            <div className="max-w-3xl text-center">
                <div className="inline-flex items-center space-x-2 p-2 px-4 mb-4 bg-blue-100 text-blue-800 rounded-full font-semibold">
                    <Code size={18} />
                    <span>Orçamento Elétrico de Precisão</span>
                </div>

                <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6">
                    Seu Projeto Elétrico, Sem Erros.
                </h1>

                <p className="text-xl sm:text-2xl text-gray-600 mb-10">
                    Otimize o tempo e o custo dos seus projetos de comandos e instalações elétricas com nossa calculadora digital inteligente.
                </p>

                {isAuthenticated ? (
                    // Se estiver autenticado, leva direto para a Calculadora ou Dashboard
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white text-xl font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
                    >
                        <Zap size={24} className="mr-2"/>
                        Ir para o Dashboard
                    </Link>
                ) : (
                    // Se não estiver autenticado, oferece Login ou a Página de Marketing
                    <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <Link
                            to="/login"
                            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white text-xl font-semibold rounded-full shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105"
                        >
                            Fazer Login
                        </Link>
                        <Link
                            to="/sobre"
                            className="inline-flex items-center px-8 py-4 bg-gray-200 text-gray-800 text-xl font-semibold rounded-full shadow-md hover:bg-gray-300 transition duration-300 transform hover:scale-105"
                        >
                            Conheça Mais
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;