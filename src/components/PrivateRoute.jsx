import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Ajuste o caminho conforme necessário

/**
 * Componente para proteger rotas com base na autenticação e no papel do usuário (Role-Based Access Control - RBAC).
 * * @param {Object} props - As propriedades do componente.
 * @param {string} props.requiredRole - O papel necessário para acessar (ex: "ADMIN").
 * @param {React.ReactNode} props.children - O componente a ser renderizado se a permissão for concedida.
 */
const PrivateRoute = ({ requiredRole, children }) => {
    const { isAuthenticated, userRole, isLoading } = useAuth();

    // 1. Mostrar tela de carregamento enquanto verifica o estado
    if (isLoading) {
        return <div className="flex justify-center items-center h-screen text-lg">Carregando autenticação...</div>;
    }

    // 2. Se não estiver autenticado, redireciona para a página de login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // 3. Se um papel específico for exigido, verifica se o usuário o possui
    if (requiredRole && userRole !== requiredRole) {
        // Redireciona para a home ou uma página de acesso negado
        return <Navigate to="/" replace />;
    }

    // 4. Se autenticado e autorizado, renderiza o componente filho
    return children;
};

export default PrivateRoute;