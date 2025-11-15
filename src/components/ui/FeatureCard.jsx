import React from 'react';

// Dados de exemplo para uso na Home.jsx
export const ExampleFeatures = [
    {
        icon: '⚡',
        title: 'Eficiência Energética',
        description: 'Projetamos soluções que minimizam o desperdício e reduzem seus custos operacionais.',
    },
    {
        icon: '🔒',
        title: 'Segurança Total',
        description: 'Instalações que seguem rigorosamente as normas NBR, garantindo a proteção do seu patrimônio.',
    },
    {
        icon: '🚀',
        title: 'Tecnologia Inovadora',
        description: 'Utilizamos as últimas tecnologias em automação e comandos elétricos para máxima performance.',
    },
];

/**
 * Componente que exibe um card de destaque para as funcionalidades.
 */
const FeatureCard = ({ icon, title, description }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 border-t-4 border-blue-500">
            <div className="text-4xl mb-4 p-2 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center shadow-inner">
                {icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    );
};

export default FeatureCard;