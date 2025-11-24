import { useEffect, useState } from 'react';
import api from '../services/api';
import type { Product, Client, CartItem } from '../types';
import { useNavigate } from 'react-router-dom';

export default function Sales() {
    // Listas para preencher os selects
    const [clients, setClients] = useState<Client[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    
    // Dados do formulário
    const [selectedClientId, setSelectedClientId] = useState('');
    const [selectedProductId, setSelectedProductId] = useState('');
    const [quantity, setQuantity] = useState(1);
    
    // Carrinho de Compras
    const [cart, setCart] = useState<CartItem[]>([]);
    
    const navigate = useNavigate();

    // 1. Carregar Clientes e Produtos ao abrir a tela
    useEffect(() => {
        api.get('/clients').then(res => setClients(res.data));
        api.get('/products').then(res => setProducts(res.data));
    }, []);

    // 2. Adicionar Produto ao Carrinho
    function handleAddToCart() {
        const product = products.find(p => p.id === Number(selectedProductId));
        if (!product || !selectedProductId) {
            alert("Selecione um produto!");
            return;
        }
        if (quantity <= 0) {
            alert("Quantidade inválida!");
            return;
        }

        const newItem: CartItem = {
            productId: product.id,
            productName: product.name,
            quantity: quantity,
            unitPrice: product.price
        };

        setCart([...cart, newItem]);
        
        // Limpa seleção de produto pra facilitar o próximo
        setSelectedProductId('');
        setQuantity(1);
    }

    // 3. Finalizar Venda (Enviar pro Backend)
    async function handleFinishSale() {
        if (!selectedClientId) {
            alert("Selecione um cliente!");
            return;
        }
        if (cart.length === 0) {
            alert("O carrinho está vazio!");
            return;
        }

        const total = cart.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);

        try {
            await api.post('/sales', {
                clientId: Number(selectedClientId),
                total: total,
                items: cart.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice
                }))
            });

            alert("Venda realizada com SUCESSO! 💰");
            setCart([]); // Limpa carrinho
            setSelectedClientId(''); // Limpa cliente
        } catch (error) {
            console.error(error);
            alert("Erro ao finalizar venda.");
        }
    }

    // Remover item do carrinho (opcional, mas útil)
    function handleRemoveItem(indexToRemove: number) {
        setCart(cart.filter((_, index) => index !== indexToRemove));
    }

    // Calcula total em tempo real
    const totalCart = cart.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial' }}>
            {/* Navegação */}
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <button onClick={() => navigate('/dashboard')} style={{ padding: '8px', cursor: 'pointer' }}>📦 Produtos</button>
                <button onClick={() => navigate('/clients')} style={{ padding: '8px', cursor: 'pointer' }}>👥 Clientes</button>
                <button disabled style={{ padding: '8px', cursor: 'default', fontWeight: 'bold', background: '#ddd' }}>💰 Vendas</button>
                <button onClick={() => navigate('/sales/history')} style={{ padding: '8px', cursor: 'pointer', background: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px' }}>
                    📜 Ver Histórico
                </button>
            </div>

            <h1>Nova Venda 🛒</h1>

            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                {/* Seleção de Cliente */}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Cliente:</label>
                    <select 
                        value={selectedClientId} 
                        onChange={e => setSelectedClientId(e.target.value)}
                        style={{ width: '100%', padding: '10px' }}
                    >
                        <option value="">Selecione um cliente...</option>
                        {clients.map(c => (
                            <option key={c.id} value={c.id}>{c.name} ({c.cpf})</option>
                        ))}
                    </select>
                </div>

                <hr style={{ margin: '20px 0', border: '0', borderTop: '1px solid #ddd' }} />

                {/* Adicionar Produto */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Produto:</label>
                        <select 
                            value={selectedProductId} 
                            onChange={e => setSelectedProductId(e.target.value)}
                            style={{ width: '100%', padding: '10px' }}
                        >
                            <option value="">Selecione um produto...</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id}>{p.name} - R$ {p.price.toFixed(2)}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ width: '100px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Qtd:</label>
                        <input 
                            type="number" 
                            min="1"
                            value={quantity}
                            onChange={e => setQuantity(Number(e.target.value))}
                            style={{ width: '100%', padding: '10px' }}
                        />
                    </div>
                    <button 
                        onClick={handleAddToCart}
                        style={{ background: '#007bff', color: 'white', border: 'none', padding: '10px 20px', height: '40px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        ADICIONAR
                    </button>
                </div>
            </div>

            {/* Carrinho */}
            <h3>Carrinho de Compras</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd', marginBottom: '20px' }}>
                <thead>
                    <tr style={{ background: '#343a40', color: 'white', textAlign: 'left' }}>
                        <th style={{ padding: '10px' }}>Produto</th>
                        <th style={{ padding: '10px' }}>Qtd</th>
                        <th style={{ padding: '10px' }}>Preço Un.</th>
                        <th style={{ padding: '10px' }}>Subtotal</th>
                        <th style={{ padding: '10px' }}>Ação</th>
                    </tr>
                </thead>
                <tbody>
                    {cart.map((item, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '10px' }}>{item.productName}</td>
                            <td style={{ padding: '10px' }}>{item.quantity}</td>
                            <td style={{ padding: '10px' }}>R$ {item.unitPrice.toFixed(2)}</td>
                            <td style={{ padding: '10px' }}>R$ {(item.quantity * item.unitPrice).toFixed(2)}</td>
                            <td style={{ padding: '10px' }}>
                                <button onClick={() => handleRemoveItem(index)} style={{ color: 'red', border: 'none', background: 'transparent', cursor: 'pointer' }}>X</button>
                            </td>
                        </tr>
                    ))}
                    {cart.length === 0 && <tr><td colSpan={5} style={{ padding: '20px', textAlign: 'center' }}>Carrinho vazio</td></tr>}
                </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '20px' }}>
                <h2>Total: R$ {totalCart.toFixed(2)}</h2>
                <button 
                    onClick={handleFinishSale}
                    style={{ background: '#28a745', color: 'white', border: 'none', padding: '15px 30px', fontSize: '18px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    FINALIZAR VENDA
                </button>
            </div>
        </div>
    );
}