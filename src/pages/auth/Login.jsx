import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Componente unificado para as telas de Login e Registro.
 */
const Login = () => {
    // Hooks de navegação e contexto
    const navigate = useNavigate();
    const { login, register, isAuthenticated, isLoading: authLoading } = useAuth();

    // ESTADOS
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [nome, setNome] = useState(''); // Estado do Nome para o Registro
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Função auxiliar para alternar entre Login e Registro, limpando os estados
    const toggleMode = () => {
        setIsLogin(prev => !prev);
        // Limpar estados ao trocar de modo
        setEmail('');
        setSenha('');
        setNome('');
        setError('');
    };

    // CALLBACK (Hook)
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            let success = false;

            if (isLogin) {
                // Login
                const credentials = { email, senha };
                success = await login(credentials);
            } else {
                // Registro: Inclui o campo 'nome'
                if (!nome || nome.trim() === "") {
                    setError("O nome é obrigatório para o cadastro.");
                    setIsLoading(false);
                    return;
                }
                const credentials = { nome, email, senha };
                success = await register(credentials);
            }

            if (success) {
                // ✅ CORREÇÃO APLICADA: Redireciona para a HOME (/)
                navigate('/', { replace: true });
            } else {
                setError('Falha na autenticação. Verifique suas credenciais.');
            }
        } catch (err) {
            console.error(err);
            // Captura a mensagem de erro detalhada do backend
            const backendError = err.response?.data?.message || JSON.stringify(err.response?.data) || 'Erro de conexão ou credenciais inválidas.';
            setError(backendError);
        } finally {
            setIsLoading(false);
        }
    }, [isLogin, email, senha, nome, login, register, navigate]);

    // CLÁUSULA DE GUARDA (Se já autenticado, vai para a Home)
    if (isAuthenticated && !authLoading) {
        // ✅ CORREÇÃO APLICADA: Redireciona para a HOME (/)
        navigate('/', { replace: true });
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full mx-auto p-8 bg-white shadow-2xl rounded-xl">
                <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
                    {isLogin ? 'Acessar sua Conta' : 'Criar Nova Conta'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* INPUT NOME (SÓ APARECE NO MODO REGISTRO) */}
                    {!isLogin && (
                        <input
                            type="text"
                            placeholder="Nome Completo"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                    )}

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />

                    {error && <p className="text-red-600 text-sm font-medium mt-2">{error}</p>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 px-4 rounded-lg text-white font-bold transition duration-200 ${
                            isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-xl'
                        }`}
                    >
                        {isLoading ? 'Aguarde...' : isLogin ? 'Entrar' : 'Registrar'}
                    </button>
                </form>

                <button
                    onClick={toggleMode}
                    className="w-full mt-6 text-sm text-blue-600 hover:text-blue-800 transition duration-200"
                >
                    {isLogin ? 'Não tem conta? Cadastre-se aqui' : 'Já tem conta? Voltar para o Login'}
                </button>
            </div>
        </div>
    );
};

export default Login;