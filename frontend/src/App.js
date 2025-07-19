import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Importação das páginas da aplicação
import Login from "./pages/login.js"; // Adicionado .js
import Register from "./pages/register.js"; // Adicionado .js
import Dashboard from "./pages/dashboard.js"; // Adicionado .js
import Trade from "./pages/trade.js"; // Página de Trading // Adicionado .js
import Borrow from "./pages/borrow.js"; // Página de Empréstimo DeFi // Adicionado .js
import Redeem from "./pages/redeem.js"; // Página de Resgate Físico // Adicionado .js
import KycPf from "./pages/kyc/pf.js"; // KYC Pessoa Física // Adicionado .js
import KycPj from "./pages/kyc/pj.js"; // KYC Pessoa Jurídica // Adicionado .js

function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas de Autenticação */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rotas Principais (protegidas por autenticação em uma aplicação real) */}
        <Route path="/" element={<Dashboard />} /> {/* Rota padrão */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Rotas de Funcionalidades */}
        <Route path="/trade" element={<Trade />} />
        <Route path="/borrow" element={<Borrow />} />
        <Route path="/redeem" element={<Redeem />} />

        {/* Rotas de KYC */}
        <Route path="/kyc/pf" element={<KycPf />} />
        <Route path="/kyc/pj" element={<KycPj />} />

        {/* Rotas de Exemplo para Termos e Privacidade (se necessário) */}
        {/* <Route path="/terms" element={<TermsPage />} /> */}
        {/* <Route path="/privacy" element={<PrivacyPolicyPage />} /> */}

        {/* TODO: Adicionar rota para o Painel Administrativo (ex: /admin) */}
        {/* <Route path="/admin" element={<AdminDashboard />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
