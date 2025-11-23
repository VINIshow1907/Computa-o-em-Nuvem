import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api' // Endereço da sua API no Docker
});

// Interceptador: Adiciona o Token automaticamente em toda requisição se ele existir
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;