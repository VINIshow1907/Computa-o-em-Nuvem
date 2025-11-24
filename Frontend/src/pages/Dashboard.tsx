import { useEffect, useState } from 'react';
import api from '../services/api';
import type { Product } from '../types';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const [products, setProducts] = useState<Product[]>([]);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    
    // NOVO: Estado para controlar qual ID estamos editando (null = criando novo)
    const [editingId, setEditingId] = useState<number | null>(null);
    
    const navigate = useNavigate();

    async function fetchProducts() {
        try {
            const response = await api.get('/products');
            
            const sortedProducts = response.data.sort((a: Product, b: Product) => a.id - b.id);
            
            setProducts(sortedProducts);
        } catch {
            console.error("Erro ao buscar produtos");
        }
    }

    useEffect(() => {
        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 2. Função Inteligente: Cadastrar OU Atualizar
    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        if (!name || !price) return;

        try {
            if (editingId) {
                // --- MODO EDIÇÃO (PUT) ---
                await api.put(`/products/${editingId}`, {
                    id: editingId, // O Backend pede o ID no corpo também
                    name,
                    price: parseFloat(price)
                });
                alert("Produto atualizado com sucesso!");
                setEditingId(null); // Sai do modo edição
            } else {
                // --- MODO CRIAÇÃO (POST) ---
                await api.post('/products', {
                    name,
                    price: parseFloat(price)
                });
            }

            // Limpa o form e recarrega
            setName('');
            setPrice('');
            fetchProducts(); 
        } catch {
            alert("Erro ao salvar produto");
        }
    }

    // 3. Função para carregar os dados no formulário
    function handleEdit(product: Product) {
        setName(product.name);
        setPrice(product.price.toString());
        setEditingId(product.id); // Entra no modo edição
    }

    // Função para cancelar a edição
    function handleCancelEdit() {
        setName('');
        setPrice('');
        setEditingId(null);
    }

    async function handleDelete(id: number) {
        if(!confirm("Tem certeza que deseja excluir?")) return;
        try {
            await api.delete(`/products/${id}`);
            fetchProducts();
        } catch {
            alert("Erro ao deletar");
        }
    }

    function handleLogout() {
        localStorage.clear();
        navigate('/');
    }

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                {/* --- NOVO: Botões de Navegação --- */}

            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <button disabled style={{ padding: '8px', cursor: 'default', fontWeight: 'bold', background: '#ddd' }}>📦 Produtos</button>
                <button onClick={() => navigate('/clients')} style={{ padding: '8px', cursor: 'pointer' }}>👥 Ir para Clientes</button>
                <button onClick={() => navigate('/sales')} style={{ padding: '8px', cursor: 'pointer' }}>💰 Ir para Vendas</button>
                </div>
                
                <h1>Gerenciamento de Produtos 📦</h1>
                <button onClick={handleLogout} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>
                    Sair
                </button>
            </div>

            {/* O Formulário agora chama handleSave */}
            <form onSubmit={handleSave} style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>Nome:</label>
                    <input 
                        type="text" 
                        value={name}
                        onChange={e => setName(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>Preço:</label>
                    <input 
                        type="number" 
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        style={{ width: '120px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                    />
                </div>

                {/* Botões do Formulário */}
                {editingId ? (
                    <>
                        <button type="submit" style={{ background: '#007bff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', height: '40px' }}>
                            SALVAR
                        </button>
                        <button type="button" onClick={handleCancelEdit} style={{ background: '#6c757d', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', height: '40px', marginLeft: '5px' }}>
                            CANCELAR
                        </button>
                    </>
                ) : (
                    <button type="submit" style={{ background: '#28a745', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', height: '40px' }}>
                        ADICIONAR
                    </button>
                )}
            </form>

            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
                <thead>
                    <tr style={{ background: '#343a40', color: 'white', textAlign: 'left' }}>
                        <th style={{ padding: '12px' }}>ID</th>
                        <th style={{ padding: '12px' }}>Nome</th>
                        <th style={{ padding: '12px' }}>Preço</th>
                        <th style={{ padding: '12px', textAlign: 'center' }}>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '10px' }}>{product.id}</td>
                            <td style={{ padding: '10px' }}>{product.name}</td>
                            <td style={{ padding: '10px', color: 'green', fontWeight: 'bold' }}>
                                R$ {product.price.toFixed(2)}
                            </td>
                            <td style={{ padding: '10px', textAlign: 'center' }}>
                                {/* Botão EDITAR (Amarelo) */}
                                <button 
                                    onClick={() => handleEdit(product)}
                                    style={{ background: '#ffc107', border: 'none', color: '#000', cursor: 'pointer', borderRadius: '4px', padding: '6px 12px', marginRight: '5px', fontWeight: 'bold' }}
                                >
                                    Editar
                                </button>
                                {/* Botão EXCLUIR (Vermelho) */}
                                <button 
                                    onClick={() => handleDelete(product.id)}
                                    style={{ background: '#dc3545', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '4px', padding: '6px 12px', fontWeight: 'bold' }}
                                >
                                    Excluir
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {products.length === 0 && <p style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>Nenhum produto cadastrado ainda.</p>}
        </div>
    );
}