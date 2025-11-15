// src/pages/Calculadora/QuizScreen.jsx

import React, { useState, useCallback } from 'react';
import QuizModal from './QuizModal';
import { initialDataState } from './quizQuestions';
import { Loader, X, DollarSign, Handshake } from 'lucide-react';

// URL do seu Backend (Atualize esta URL!)
const BACKEND_URL = 'http://localhost:8080/api/orcamento';

// Funções utilitárias
const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);

/** Componente de Tela de Carregamento/Resultado */
const ResultDisplay = ({ data, isLoading, error, startNewQuiz }) => {

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
                <Loader className="animate-spin h-10 w-10 text-indigo-600 mb-4" />
                <h2 className="text-3xl font-bold text-gray-800">Gerando Orçamento...</h2>
                <p className="text-lg text-indigo-600 mt-2">Enviando dados para o backend em: {BACKEND_URL}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
                <div className="text-5xl mb-4 text-red-500"><X className="w-12 h-12" /></div>
                <h2 className="text-3xl font-bold text-red-800">Erro no Cálculo!</h2>
                <p className="text-lg text-red-600 mt-2">{error}</p>
                <button
                    onClick={startNewQuiz}
                    className="mt-6 bg-red-600 text-white font-bold py-2 px-6 rounded-xl hover:bg-red-700 transition"
                >
                    Tentar Novamente
                </button>
            </div>
        );
    }

    const result = data.result;
    if (!result) return null;

    const MetricCard = ({ icon: Icon, title, value, color }) => (
        <div className={`p-5 rounded-xl shadow-md ${color} flex items-center`}>
            <Icon className="w-8 h-8 mr-3 opacity-70" />
            <div>
                <p className="text-sm font-medium text-gray-600">{title}</p>
                <p className="text-2xl font-extrabold mt-1">{value}</p>
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-10 space-y-8 animate-fadeIn pt-8">
            <div className="p-6 bg-green-50 border-l-4 border-green-500 rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-green-700">✅ Orçamento Concluído!</h2>
                <p className="text-lg text-green-600 mt-1">Estimativa gerada com sucesso para **{data.clienteNome}**.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MetricCard
                    icon={DollarSign}
                    title="Custo Material Estimado"
                    value={formatCurrency(result.totalCustoMaterialEstimado || 0)}
                    color="bg-yellow-100 text-yellow-800"
                />
                <MetricCard
                    icon={Handshake}
                    title="Mão de Obra Estimada"
                    value={formatCurrency(result.totalMaoDeObraEstimada || 0)}
                    color="bg-orange-100 text-orange-800"
                />
            </div>

            <div className="p-8 bg-indigo-700 rounded-xl text-white text-center shadow-2xl">
                <p className="text-xl font-medium">TOTAL GERAL ESTIMADO</p>
                <p className="text-5xl font-extrabold mt-1">{formatCurrency(result.totalOrcamentoFinal || 0)}</p>
            </div>

            <div className="pt-4 text-center">
                <p className="text-md text-gray-600 mb-4">Em um app real, o relatório detalhado seria enviado para **{data.clienteEmail}**.</p>
                <button
                    onClick={startNewQuiz}
                    className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-indigo-700 transition duration-300"
                >
                    Fazer Novo Orçamento
                </button>
            </div>
        </div>
    );
};


const QuizScreen = () => {
    const [formData, setFormData] = useState(initialDataState);
    const [isCalculating, setIsCalculating] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [quizComplete, setQuizComplete] = useState(false);

    // Função para chamar o backend (simulação)
    const apiCall = useCallback(async (payload) => {
        try {
            const response = await fetch(BACKEND_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                // Supondo que o backend retorna os campos necessários
                const resultData = {
                    orcamentoId: data.id || 'MOCK-123',
                    totalCustoMaterialEstimado: data.custoTotalMaterial || 15000,
                    totalMaoDeObraEstimada: data.custoTotalMaoDeObra || 5000,
                    totalOrcamentoFinal: data.valorTotalServico || 20000,
                };
                return { success: true, data: resultData };
            } else {
                const errorMessage = data.message || `Erro do Servidor (${response.status}).`;
                return { success: false, error: errorMessage };
            }
        } catch (error) {
            console.error('Falha na conexão ou requisição:', error);
            return { success: false, error: '❌ Falha de Rede/CORS. Verifique se o backend está rodando.' };
        }
    }, []);

    // Lógica de finalização do quiz
    const handleFinalizeQuiz = async () => {
        setQuizComplete(true);
        setIsCalculating(true);
        setApiError(null);

        const payload = { ...formData }; // Envie todos os campos do quiz

        const result = await apiCall(payload);

        if (result.success) {
            setFormData(prev => ({ ...prev, result: result.data }));
        } else {
            setApiError(result.error);
        }

        setIsCalculating(false);
    };

    const startNewQuiz = () => {
        setFormData(initialDataState);
        setApiError(null);
        setQuizComplete(false);
    };

    // A tela de resultado/loading só é exibida se o quiz foi completado
    if (quizComplete || isCalculating || apiError) {
        return <ResultDisplay
            data={formData}
            isLoading={isCalculating}
            error={apiError}
            startNewQuiz={startNewQuiz}
        />;
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <QuizModal
                isOpen={true} // Sempre aberto quando na rota /calculadora
                closeQuiz={() => alert('Quiz Cancelado. Redirecionar para Home.')}
                formData={formData}
                setFormData={setFormData}
                onFinalize={handleFinalizeQuiz}
            />
        </div>
    );
};

export default QuizScreen;