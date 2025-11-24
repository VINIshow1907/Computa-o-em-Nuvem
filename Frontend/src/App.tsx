import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Sales from './pages/Sales';
import SalesHistory  from './pages/SalesHistory';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route path="/dashboard" element={<Dashboard />} />
  
        <Route path="/clients" element={<Clients />} />

        <Route path="/sales" element={<Sales />} />
        
        {/* --- CORREÇÃO AQUI (Use barra /) --- */}
        <Route path="/sales/history" element={<SalesHistory />} />

        {/* Essa linha abaixo é a culpada por te jogar pro Login quando a rota não existe: */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;