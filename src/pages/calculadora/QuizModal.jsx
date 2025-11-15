// src/pages/Calculadora/QuizModal.jsx

import React, { useState, useEffect, useRef } from 'react';
import { quizQuestions } from './quizQuestions';
import { X } from 'lucide-react';

const QuizModal = ({ isOpen, closeQuiz, formData, setFormData, onFinalize }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [message, setMessage] = useState(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setCurrentStep(0);
            setMessage(null);
        }
    }, [isOpen]);

    // Foca no input quando o passo muda
    useEffect(() => {
        if (isOpen && inputRef.current && !isTransitioning) {
            inputRef.current.focus();
        }
    }, [currentStep, isOpen, isTransitioning]);


    if (!isOpen) return null;

    const currentQuestion = quizQuestions[currentStep];
    const currentValue = formData[currentQuestion.id];

    const handleChange = (e) => {
        let value = e.target.value;
        if (currentQuestion.type === 'number') {
            value = parseFloat(value) || 0;
        }
        setFormData(prev => ({ ...prev, [currentQuestion.id]: value }));
    };

    const handleNext = async (e) => {
        e.preventDefault();

        const value = formData[currentQuestion.id];

        // 1. Validação
        if (value === undefined || value === null || value === '' || (currentQuestion.type === 'number' && parseFloat(value) < 0)) {
            setMessage({ type: 'error', content: 'Preencha o campo para prosseguir.' });
            inputRef.current?.focus();
            return;
        }
        if (currentQuestion.id === 'clienteEmail' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                setMessage({ type: 'error', content: '📧 Insira um E-mail válido.' });
                inputRef.current?.focus();
                return;
            }
        }

        // 2. Transição e Avanço
        setMessage(null);
        setIsTransitioning(true);

        setTimeout(() => {
            if (currentStep < quizQuestions.length - 1) {
                setCurrentStep(prev => prev + 1);
            } else {
                onFinalize(); // Finaliza e inicia o cálculo
            }
            setTimeout(() => setIsTransitioning(false), 50);
        }, 300); // Duração da animação de saída
    };

    // Renderiza o input correto
    const renderInput = () => {
        const inputClasses = "w-full p-3 border-2 border-indigo-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-lg font-medium";

        if (currentQuestion.type === 'select') {
            return (
                <select
                    ref={inputRef}
                    value={currentValue || ''}
                    onChange={handleChange}
                    className={inputClasses}
                    required
                >
                    <option value="" disabled>Selecione uma opção</option>
                    {currentQuestion.options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.text}</option>
                    ))}
                </select>
            );
        }

        return (
            <input
                ref={inputRef}
                type={currentQuestion.type}
                value={currentValue === 0 && currentQuestion.type === 'number' ? '' : currentValue || ''}
                placeholder={currentQuestion.placeholder}
                min={currentQuestion.type === 'number' ? 0 : undefined}
                onChange={handleChange}
                onKeyDown={(e) => { if (e.key === 'Enter') handleNext(e); }}
                className={inputClasses}
                required
            />
        );
    };


    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm transition-opacity duration-300"
            onClick={closeQuiz}
        >
            <div
                className={`bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full transition-all duration-300 ease-in-out ${
                    isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                }`}
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={closeQuiz}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                    aria-label="Fechar Quiz"
                >
                    <X className="h-6 w-6" />
                </button>

                <form onSubmit={handleNext} className="space-y-6">
                    <div className="text-center space-y-2">
                        <p className="text-sm font-semibold text-indigo-600">{currentQuestion.label}</p>
                        <h3 className="text-2xl font-bold text-gray-800">
                            {currentQuestion.help}
                        </h3>
                    </div>

                    {renderInput()}

                    {/* Área de Mensagem */}
                    {message && (
                        <div className={`p-3 rounded-xl text-sm font-medium ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {message.content}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition duration-200 shadow-md"
                    >
                        {currentStep < quizQuestions.length - 1 ? 'OK, Próximo Passo' : 'Finalizar e Calcular'}
                    </button>

                    <p className="text-center text-xs text-gray-500">
                        Passo {currentStep + 1} de {quizQuestions.length}
                    </p>
                </form>
            </div>
        </div>
    );
};

export default QuizModal;