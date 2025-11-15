import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// CONTEXTO DE AUTENTICAÇÃO
import { AuthProvider } from './context/AuthContext';

// HOOKS
import { useSmartHeader } from './hooks/useSmartHeader';

// COMPONENTES DE LAYOUT
import Header from './components/layout/Header';
import SideMenu from './components/layout/SideMenu';
import Footer from './components/layout/Footer';

// PÁGINAS GERAIS
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard'; // ✅ Dashboard importado de src/pages/Dashboard

// PÁGINAS DE AUTENTICAÇÃO
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// PÁGINAS DE FUNCIONALIDADE
import Calculator from './pages/calculadora/QuizScreen';
import Quiz from './pages/calculadora/QuizScreen';


// --- Componente de Roteamento Principal ---
const App = () => {
    const isHeaderVisible = useSmartHeader();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const openMenu = () => setIsMenuOpen(true);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <Router>
            <AuthProvider>
                {/* Header e SideMenu */}
                <Header openMenu={openMenu} isVisible={isHeaderVisible} />
                <SideMenu isOpen={isMenuOpen} onClose={closeMenu} />

                {/* Conteúdo Principal (Adicionado padding para compensar o header fixo) */}
                <main className="flex-grow pt-[70px]">
                    <Routes>
                        {/* Rotas PÚBLICAS */}
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Rotas de Funcionalidade */}
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/calculadora" element={<Calculator />} />
                        <Route path="/quiz" element={<Quiz />} />

                        {/* Rotas Futuras/Em Construção */}
                        <Route path="/perfil" element={<NotFound title="Gerenciar Perfil" message="Esta página está em construção." />} />
                        <Route path="/admin" element={<NotFound title="Painel Admin" message="Esta página está em construção." />} />

                        {/* Rota 404 (Wildcard) */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>

                <Footer />
            </AuthProvider>
        </Router>
    );
};

export default App;