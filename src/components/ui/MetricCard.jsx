// src/components/ui/FeatureCard.jsx

import React from 'react';
import { Zap } from 'lucide-react';

export const FeatureCard = ({ icon: Icon = Zap, title, description }) => ( // export const
    <div className="p-6 bg-white rounded-xl shadow-xl border-t-4 border-indigo-500 hover:shadow-2xl transition duration-300 transform hover:translate-y-[-5px]">
        <div className="text-center mb-4">
            <Icon className="text-4xl inline-block text-indigo-600" size={40} />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">{title}</h3>
        <p className="text-gray-600 text-center">{description}</p>
    </div>
);