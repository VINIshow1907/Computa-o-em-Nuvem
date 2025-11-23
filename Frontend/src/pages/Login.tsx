import { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setError('');

        try {
            const response = await api.post('/auth/login', {
                username,
                password,
                role: "string" // O back espera esse campo, mesmo que não use na validação
            });

            // Se der certo:
            const { token, user } = response.data;
            
            // 1. Salva no navegador
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            // 2. Avisa e redireciona (Vamos criar a rota /dashboard depois)
            alert('Login realizado com sucesso!');
            navigate('/dashboard'); 

        } catch (err) {
            console.error(err);
            setError('Usuário ou senha incorretos.');
        }
    }

    // Estilo simples inline para não perdermos tempo com CSS agora
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
            <form onSubmit={handleLogin} style={{ padding: '30px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '15px', width: '300px' }}>
                <h2 style={{ textAlign: 'center', color: '#333' }}>Login do Sistema</h2>
                
                <input 
                    type="text" 
                    placeholder="Usuário (admin)" 
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                
                <input 
                    type="password" 
                    placeholder="Senha (123)" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />

                <button type="submit" style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    ENTRAR
                </button>

                {error && <p style={{ color: 'red', fontSize: '14px', textAlign: 'center' }}>{error}</p>}
            </form>
        </div>
    );
}