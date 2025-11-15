// src/pages/NotFound.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Frown } from 'lucide-react';

const NotFound = () => (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-8 bg-white max-w-xl mx-auto rounded-xl shadow-2xl mt-10">
        <Frown className="w-20 h-20 text-indigo-500 mb-4" />
        <h1 className="text-6xl font-extrabold text-gray-900 mb-2">404</h1>
        <h2 className="text-3xl font-semibold text-gray-700 mb-4">Página Não Encontrada</h2>
        <p className="text-lg text-gray-500 mb-8">
            Parece que você se perdeu. A rota que você está tentando acessar não existe.
        </p>
        <Link
            to="/"
            className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-indigo-700 transition duration-300"
        >
            Voltar para a Home
        </Link>
    </div>
);

export default NotFound;