import React, { useState, useEffect } from 'react';

/**
 * Componente que aplica o efeito de digitação em um array de frases.
 * Digita as frases sequencialmente (75ms/caractere) e para na última, sem apagar.
 */
const TypingSlogan = ({ phrases, className, typingSpeed = 75, pauseTime = 1000 }) => {

    // Hooks chamados incondicionalmente
    const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [isFinished, setIsFinished] = useState(false); // Controla a parada final (para o cursor)

    useEffect(() => {
        // Para se não houver frases ou se a animação tiver terminado
        if (!phrases || phrases.length === 0 || isFinished) return;

        const fullPhrase = phrases[currentPhraseIndex];
        let timer;

        if (displayedText.length < fullPhrase.length) {
            // --- FASE DE DIGITAR (MAIS RÁPIDA) ---
            timer = setTimeout(() => {
                setDisplayedText(prev => prev + fullPhrase[displayedText.length]);
            }, typingSpeed);
        } else {
            // Terminou de digitar a frase atual

            const isLastPhrase = currentPhraseIndex === phrases.length - 1;

            if (isLastPhrase) {
                // Terminou a última frase, define como finalizado após a pausa
                timer = setTimeout(() => {
                    setIsFinished(true);
                }, pauseTime);
            } else {
                // Vai para a próxima frase
                timer = setTimeout(() => {
                    setCurrentPhraseIndex((prevIndex) => prevIndex + 1);
                    setDisplayedText(''); // Reseta o texto para começar a digitar a próxima frase
                }, pauseTime);
            }
        }

        return () => clearTimeout(timer);

    }, [displayedText, currentPhraseIndex, isFinished, phrases, typingSpeed, pauseTime]);

    // Retorna um span vazio se não houver frases para evitar erros de renderização
    if (!phrases || phrases.length === 0) {
        return <span className={className}></span>;
    }

    return (
        <span className={`${className} whitespace-pre`}>
            {displayedText}
            {/* O cursor só aparece enquanto a animação não estiver finalizada */}
            {!isFinished && (
                <span className={`inline-block w-1 h-8 md:h-12 bg-amber-400 align-middle ml-1 transition-opacity animate-pulse`}></span>
            )}
        </span>
    );
};

export default TypingSlogan;