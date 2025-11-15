// src/pages/Admin/BudgetList.jsx

import React from 'react';
import { useFirestore } from '../../hooks/useFirestore';
import { Trash2, Loader, AlertTriangle } from 'lucide-react';

const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);

export const BudgetList = () => { // export const
    const { data: budgets, isLoading, error, deleteDocument } = useFirestore('orcamentos');

    const handleDelete = async (id) => {
        if (window.confirm("Tem certeza que deseja deletar este orçamento? Esta ação é irreversível.")) {
            try {
                await deleteDocument(id);
                alert("Orçamento deletado com sucesso!");
            } catch (e) {
                alert("Falha ao deletar orçamento. Verifique o console.");
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-10">
                <Loader className="animate-spin h-8 w-8 text-indigo-600 mr-3" />
                <p className="text-gray-600">Carregando orçamentos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center bg-red-100 p-4 rounded-xl border border-red-300 text-red-700">
                <AlertTriangle className="h-6 w-6 mr-3" />
                {error}
            </div>
        );
    }

    if (budgets.length === 0) {
        return (
            <div className="text-center py-10 bg-gray-50 rounded-xl">
                <p className="text-lg text-gray-500">Nenhum orçamento encontrado nesta conta.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto border rounded-xl shadow-lg">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                <tr>
                    <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                    <th className="p-4 text-right text-xs font-medium text-gray-500 uppercase">Valor Total</th>
                    <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                    <th className="p-4 text-center text-xs font-medium text-gray-500 uppercase">Ações</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {budgets.map((budget) => (
                    <tr key={budget.id} className="hover:bg-gray-50 transition">
                        <td className="p-4 text-sm font-mono text-gray-500 truncate max-w-[100px]">{budget.id}</td>
                        <td className="p-4 text-sm font-medium text-gray-700">{budget.clienteNome || 'N/A'}</td>
                        <td className="p-4 text-sm font-extrabold text-indigo-600 text-right">{formatCurrency(budget.result?.totalOrcamentoFinal || 0)}</td>
                        <td className="p-4 text-sm text-gray-600">
                            {budget.createdAt ? new Date(budget.createdAt.toDate()).toLocaleDateString('pt-BR') : 'Sem data'}
                        </td>
                        <td className="p-4 text-center">
                            <button
                                onClick={() => handleDelete(budget.id)}
                                className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition"
                                aria-label={`Deletar orçamento ${budget.id}`}
                            >
                                <Trash2 className="h-5 w-5" />
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};