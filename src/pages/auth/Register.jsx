import React, { useState } from 'react'; // Importar useState
import { Link, useNavigate } from 'react-router-dom'; // Importar useNavigate
import orcamentoApi from '../../api/orcamentoApi';

// Desestrutura a função registerUser do objeto importado
const { registerUser } = orcamentoApi;

const Register = () => {
    // ✅ CORREÇÃO: DECLARAÇÃO DOS HOOKS E ESTADOS AUSENTES
    const navigate = useNavigate(); // <-- navigate definido

    // Estados do Formulário
    const [email, setEmail] = useState('');
    const [nome, setNome] = useState('');
    const [senha, setSenha] = useState('');

    // Estados para UI e Erros
    const [error, setError] = useState(null); // <-- error e setError definidos
    const [isLoading, setIsLoading] = useState(false); // <-- isLoading e setIsLoading definidos

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // <-- setError usado
        setIsLoading(true); // <-- setIsLoading usado

        try {
            await registerUser({ email, nome, senha });

            navigate('/login'); // <-- navigate usado
        } catch (err) {
            console.error('Erro de registro:', err);
            const errorMessage = err.response?.data?.message || 'Erro ao tentar registrar. Tente novamente.';
            setError(errorMessage); // <-- setError usado
        } finally {
            setIsLoading(false); // <-- setIsLoading usado
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl">
                <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-6">Criar Conta</h2>

                <form onSubmit={handleSubmit} className="space-y-6">

                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="nome">Nome</label>
                        <input
                            id="nome"
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="senha">Senha (Mín. 6 caracteres)</label>
                        <input
                            id="senha"
                            type="password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                            minLength={6}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    {error && ( // <-- error usado
                        <p className="text-sm text-red-600 p-3 bg-red-50 rounded-lg border border-red-200">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading} // <-- isLoading usado
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:opacity-50"
                    >
                        {isLoading ? 'Registrando...' : 'Cadastrar'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Já tem uma conta?{' '}
                        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Faça Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;