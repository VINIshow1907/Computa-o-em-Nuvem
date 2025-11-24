import { useEffect, useState } from 'react';
import api from '../services/api';
import type { Client } from '../types';
import { useNavigate } from 'react-router-dom';

export default function Clients() {
    const [clients, setClients] = useState<Client[]>([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    
    // Controle de Edição
    const [editingId, setEditingId] = useState<number | null>(null);
    
    const navigate = useNavigate();

    // Buscar Clientes
    async function fetchClients() {
        try {
            const response = await api.get('/clients');
            // Ordenar por ID para não ficar bagunçado
            const sorted = response.data.sort((a: Client, b: Client) => a.id - b.id);
            setClients(sorted);
        } catch {
            console.error("Erro ao buscar clientes");
        }
    }

    useEffect(() => {
        fetchClients();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Salvar (Criar ou Editar)
    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        if (!name || !email || !cpf) return;

        try {
            if (editingId) {
                // PUT (Atualizar)
                await api.put(`/clients/${editingId}`, {
                    id: editingId,
                    name,
                    email,
                    cpf
                });
                alert("Cliente atualizado!");
                setEditingId(null);
            } else {
                // POST (Criar)
                await api.post('/clients', {
                    name,
                    email,
                    cpf
                });
            }

            // Limpar form
            setName('');
            setEmail('');
            setCpf('');
            fetchClients(); 
        } catch {
            alert("Erro ao salvar cliente");
        }
    }

    // Preencher formulário para editar
    function handleEdit(client: Client) {
        setName(client.name);
        setEmail(client.email);
        setCpf(client.cpf);
        setEditingId(client.id);
    }

    function handleCancelEdit() {
        setName('');
        setEmail('');
        setCpf('');
        setEditingId(null);
    }

    async function handleDelete(id: number) {
        if(!confirm("Excluir este cliente?")) return;
        try {
            await api.delete(`/clients/${id}`);
            fetchClients();
        } catch {
            alert("Erro ao deletar");
        }
    }

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial' }}>
            {/* Navegação Simples */}
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <button onClick={() => navigate('/dashboard')} style={{ padding: '8px', cursor: 'pointer' }}>📦 Ir para Produtos</button>
                <button disabled style={{ padding: '8px', cursor: 'default', fontWeight: 'bold', background: '#ddd' }}>👥 Clientes</button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Gerenciamento de Clientes 👥</h1>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSave} style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input 
                        type="text" 
                        placeholder="Nome Completo" 
                        value={name}
                        onChange={e => setName(e.target.value)}
                        style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <input 
                        type="text" 
                        placeholder="CPF (000.000.000-00)"
                        maxLength={11} 
                        value={cpf}
                        onChange={e => setCpf(e.target.value)}
                        style={{ width: '150px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input 
                        type="email" 
                        placeholder="E-mail" 
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    
                    {editingId ? (
                        <>
                            <button type="submit" style={{ background: '#007bff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>SALVAR</button>
                            <button type="button" onClick={handleCancelEdit} style={{ background: '#6c757d', color: 'white', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer' }}>CANCELAR</button>
                        </>
                    ) : (
                        <button type="submit" style={{ background: '#28a745', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>CADASTRAR</button>
                    )}
                </div>
            </form>

            {/* Tabela */}
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
                <thead>
                    <tr style={{ background: '#004085', color: 'white', textAlign: 'left' }}>
                        <th style={{ padding: '12px' }}>ID</th>
                        <th style={{ padding: '12px' }}>Nome</th>
                        <th style={{ padding: '12px' }}>CPF</th>
                        <th style={{ padding: '12px' }}>Email</th>
                        <th style={{ padding: '12px', textAlign: 'center' }}>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {clients.map(client => (
                        <tr key={client.id} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '10px' }}>{client.id}</td>
                            <td style={{ padding: '10px' }}>{client.name}</td>
                            <td style={{ padding: '10px' }}>{client.cpf}</td>
                            <td style={{ padding: '10px' }}>{client.email}</td>
                            <td style={{ padding: '10px', textAlign: 'center' }}>
                                <button onClick={() => handleEdit(client)} style={{ background: '#ffc107', border: 'none', cursor: 'pointer', borderRadius: '4px', padding: '5px 10px', marginRight: '5px' }}>Editar</button>
                                <button onClick={() => handleDelete(client.id)} style={{ background: '#dc3545', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '4px', padding: '5px 10px' }}>Excluir</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}