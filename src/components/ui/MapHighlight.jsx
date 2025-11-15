import React from 'react';

/**
 * Componente que exibe um mapa estilizado (SVG) do Brasil
 * destacando o Tocantins em laranja/vermelho.
 * Baseado na imagem de referência fornecida pelo usuário.
 */
const MapHighlight = () => {
    // SVG ALTAMENTE SIMPLIFICADO E ABSTRATO para representar o mapa do Brasil e TO
    // A geometria é intencionalmente simplificada para focar na visualização de destaque.
    const BrazilSVG = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 500 600"
            className="w-full max-w-md h-auto mx-auto"
        >
            {/* Base do Brasil (Amarelo Ouro - Cor de fundo do mapa na referência) */}
            <path
                fill="#facc15" // Yellow-500/Ouro
                stroke="#d97706" // Border Laranja Escuro
                strokeWidth="2"
                d="M50,100 C50,20 150,0 250,50 L400,100 C450,200 400,500 250,550 C100,500 0,300 50,100 Z"
            />

            {/* Destaque do Tocantins (Área central, cor Marrom/Laranja Escuro) */}
            <path
                fill="#ea580c" // Orange-600/Marrom Escuro
                stroke="#7c2d12" // Border Marrom
                strokeWidth="3"
                d="M200,200 L300,200 L300,350 L200,350 Z" // Simples retângulo central para representar TO
                className="hover:scale-[1.05] transition-transform duration-300 shadow-xl"
            />

            {/* Destaque de Palmas/Araguaína (Círculos de Localização) */}
            {/* Palmas */}
            <circle cx="250" cy="300" r="10" fill="#3b82f6" className="animate-pulse" />
            <text x="250" y="330" fontSize="16" fill="#1f2937" fontWeight="bold" textAnchor="middle">Palmas</text>

            {/* Araguaína */}
            <circle cx="250" cy="230" r="10" fill="#3b82f6" className="animate-pulse" />
            <text x="250" y="260" fontSize="16" fill="#1f2937" fontWeight="bold" textAnchor="middle">Araguaína</text>


            {/* Estilo para animação */}
            <style>{`
                .animate-pulse {
                    animation: pulse 2s infinite;
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.7; transform: scale(1.2); }
                }
            `}</style>
        </svg>
    );

    return (
        <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-100 shadow-2xl">
            {BrazilSVG}
            <p className="mt-6 text-center text-gray-700 font-medium">
                Sua solução elétrica com foco e presença no **Tocantins**.
            </p>
        </div>
    );
};

export default MapHighlight;