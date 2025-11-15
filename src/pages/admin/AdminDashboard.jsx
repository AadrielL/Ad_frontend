import React, { useState, useEffect, useCallback } from 'react'; // Importar useCallback
import { collection, query, getDocs } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext'; // Mantido como o caminho padrão esperado
import { XCircle, Loader2 } from 'lucide-react';

const AdminDashboard = () => {
    // 1. Acessa as instâncias de Firebase e dados do usuário via useAuth()
    const { userId, db, appId, isLoading, isAuthenticated } = useAuth();
    const [data, setData] = useState(null);
    const [loadingData, setLoadingData] = useState(false);
    const [error, setError] = useState(null);

    // ✅ CORREÇÃO: Envolver fetchAdminStats em useCallback
    const fetchAdminStats = useCallback(async () => {
        // Verifica se o Firestore e o ID do usuário estão prontos
        if (!db || !userId) return;
        setLoadingData(true);
        setError(null);

        // Caminho da coleção pública: /artifacts/{appId}/public/data/admin_stats
        // Ajuste este caminho se seus dados de admin estiverem em outro local
        const collectionPath = `/artifacts/${appId}/public/data/admin_stats`;

        try {
            const q = query(collection(db, collectionPath));
            const querySnapshot = await getDocs(q);

            // Mapeia os documentos para o estado
            const stats = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setData(stats);

        } catch (e) {
            console.error("Erro ao buscar dados do Admin:", e);
            setError("Falha ao carregar dados administrativos. Verifique as permissões de acesso.");
        } finally {
            setLoadingData(false);
        }
    }, [db, userId, appId]); // Dependências internas da função

    // Efeito para buscar dados quando o DB estiver pronto
    useEffect(() => {
        if (db && userId) {
            // A função agora é estável por causa do useCallback
            fetchAdminStats();
        }
        // Inclui a função fetchAdminStats (para satisfazer o Hook) e as dependências de dados.
    }, [db, userId, fetchAdminStats]); // ✅ CORRIGIDO: fetchAdminStats incluída

    // Exibe tela de carregamento enquanto o Firebase está inicializando
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <Loader2 className="animate-spin text-indigo-600 h-8 w-8" />
                <p className="ml-3 text-lg text-gray-700">Conectando ao Painel...</p>
            </div>
        );
    }

    // Exibe mensagem se não estiver autenticado (Proteção de fallback)
    if (!isAuthenticated) {
        return (
            <div className="text-center p-10 bg-red-100 border-l-4 border-red-500 text-red-700">
                Acesso negado. Você precisa estar autenticado para ver este dashboard.
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 mt-10 bg-white shadow-xl rounded-xl">
            <h1 className="text-3xl font-bold text-indigo-700 mb-6 border-b pb-2">Painel de Administração</h1>
            <p className="text-gray-600 mb-4">
                Bem-vindo, Admin. Seu ID de Usuário:
                <span className="font-mono text-sm bg-gray-200 p-1 rounded ml-2">{userId}</span>
            </p>

            <button
                onClick={fetchAdminStats}
                disabled={loadingData}
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-200 disabled:opacity-50 flex items-center mb-6"
            >
                {loadingData ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : 'Atualizar Dados'}
            </button>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 flex items-center rounded-lg">
                    <XCircle className="h-5 w-5 mr-3" />
                    <p>{error}</p>
                </div>
            )}

            <div className="bg-indigo-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold text-indigo-800 mb-3">Estatísticas (Dados Públicos)</h2>
                {loadingData ? (
                    <p className="text-center text-indigo-600">Carregando estatísticas...</p>
                ) : data && data.length > 0 ? (
                    <ul className="space-y-2">
                        {data.map(item => (
                            <li key={item.id} className="bg-white p-3 rounded-md shadow-sm border border-indigo-200">
                                <strong className="text-gray-900 capitalize">{item.id}:</strong> {JSON.stringify(item.value || item)}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">Nenhum dado administrativo encontrado na coleção 'admin_stats'.</p>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;