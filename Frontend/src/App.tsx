import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';

// Um componente simples só para testar o redirecionamento pós-login
const Dashboard = () => (
  <div style={{ padding: '20px' }}>
    <h1>Bem-vindo ao Sistema de Vendas! 🚀</h1>
    <p>Você está logado.</p>
    <button onClick={() => {
        localStorage.clear();
        window.location.href = '/';
    }}>Sair</button>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;