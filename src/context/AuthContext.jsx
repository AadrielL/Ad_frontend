import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// ✅ IMPORTAÇÃO CORRIGIDA: Importa o objeto padrão
import orcamentoApi from '../api/orcamentoApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Desestrutura as funções para uso interno
    const { loginUser, registerUser } = orcamentoApi;

    const [token, setToken] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);

    // Carrega o token do localStorage ao iniciar
    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
            setToken(storedToken);
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    // Função de Login
    const login = useCallback(async (credentials) => {
        try {
            const responseData = await loginUser(credentials);

            // Pega o token na chave correta (ajuste conforme seu backend)
            const newToken = responseData.token || responseData.jwt || responseData.accessToken;

            if (newToken) {
                localStorage.setItem('authToken', newToken);
                setToken(newToken);
                setIsAuthenticated(true);
                return true;
            } else {
                throw new Error("Token não recebido. Verifique o payload do backend.");
            }
        } catch (error) {
            console.error('Erro no login do contexto:', error);
            throw error;
        }
    }, [loginUser]); // Dependência adicionada

    // Função de Registro
    const register = useCallback(async (data) => {
        try {
            await registerUser(data);
            return true;
        } catch (error) {
            console.error('Erro no registro do contexto:', error);
            throw error;
        }
    }, [registerUser]); // Dependência adicionada

    const logout = useCallback(() => {
        localStorage.removeItem('authToken');
        setToken(null);
        setIsAuthenticated(false);
        setUser(null);
    }, []);

    const contextValue = {
        token,
        isAuthenticated,
        user,
        isLoading,
        login,
        register,
        logout,
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <p className="text-xl text-indigo-600">Carregando sessão...</p>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);