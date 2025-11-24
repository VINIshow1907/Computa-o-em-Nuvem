import { useEffect, useState } from 'react';
import api from '../services/api';
import type { Sale } from '../types';
import { useNavigate } from 'react-router-dom';

export default function SalesHistory() {
    const [sales, setSales] = useState<Sale[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Busca as vendas do Backend
        api.get('/sales').then(response => {
            setSales(response.data);
        }).catch(err => {
            console.error("Erro ao buscar vendas", err);
        });
    }, []);

    // Função para formatar data (ex: 24/11/2025 14:30)
    function formatDate(dateString: string) {
        return new Date(dateString).toLocaleString('pt-BR');
    }

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Histórico de Vendas 📜</h1>
                <button onClick={() => navigate('/sales')} style={{ padding: '8px 16px', cursor: 'pointer' }}>
                    ⬅ Voltar para Vendas
                </button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
                <thead>
                    <tr style={{ background: '#343a40', color: 'white', textAlign: 'left' }}>
                        <th style={{ padding: '12px' }}>ID Venda</th>
                        <th style={{ padding: '12px' }}>Data</th>
                        <th style={{ padding: '12px' }}>Qtd Itens</th>
                        <th style={{ padding: '12px' }}>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {sales.map(sale => (
                        <tr key={sale.id} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '10px' }}>#{sale.id}</td>
                            <td style={{ padding: '10px' }}>{formatDate(sale.date)}</td>
                            <td style={{ padding: '10px' }}>{sale.items.length} itens</td>
                            <td style={{ padding: '10px', color: 'green', fontWeight: 'bold' }}>
                                R$ {sale.total.toFixed(2)}
                            </td>
                        </tr>
                    ))}
                    {sales.length === 0 && (
                        <tr>
                            <td colSpan={4} style={{ padding: '20px', textAlign: 'center' }}>Nenhuma venda registrada.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}