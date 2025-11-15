// src/components/layout/Footer.jsx

import React from 'react';
import { Zap } from 'lucide-react';

export const Footer = () => ( // export const
    <footer className="bg-gray-800 text-white mt-10 p-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <div className="mb-4 md:mb-0 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-indigo-400" />
                <p className="text-sm">AD Comandos - Orçamentos Elétricos Inteligentes. &copy; {new Date().getFullYear()}</p>
            </div>
            <nav className="space-x-4 text-sm">
                <a href="#termos" className="hover:text-indigo-400 transition">Termos de Serviço</a>
                <a href="#privacidade" className="hover:text-indigo-400 transition">Política de Privacidade</a>
                <a href="mailto:contato@adcomandos.com" className="hover:text-indigo-400 transition">Contato</a>
            </nav>
        </div>
    </footer>
);
export default Footer;