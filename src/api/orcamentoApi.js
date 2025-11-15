import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

// 1. Cria a instância do Axios
const api = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. Interceptor de Request (Adiciona o Token)
api.interceptors.request.use(config => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// 3. Funções de Autenticação
const loginUser = async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
};

const registerUser = async (data) => {
    const response = await api.post('/api/auth/register', data);
    return response.data;
};

// 4. Função da Calculadora/Lógica
const calculateBudget = async (params) => {
    const response = await api.post('/api/orcamento/calculate', params);
    return response.data.result;
};

// ✅ EXPORTAÇÃO CORRIGIDA: Exporta a instância Axios e todas as funções em um objeto único.
const apiExports = {
    apiInstance: api,
    loginUser,
    registerUser,
    calculateBudget,
};

export default apiExports;