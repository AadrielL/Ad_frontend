import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Importações Nomeadas (usando chaves) para os Context Providers
import { AuthProvider } from './context/AuthContext.jsx'

// Use createRoot diretamente
createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        {/* Envolve o App nos Providers */}
            <AuthProvider>
                <App />
            </AuthProvider>
    </React.StrictMode>,
)