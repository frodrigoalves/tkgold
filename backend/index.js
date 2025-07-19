
require('dotenv').config(); // Carrega variáveis de ambiente do arquivo .env
const express = require('express');
const cors = require('cors'); // Middleware para habilitar o CORS

const app = express();
const PORT = process.env.PORT || 4000; // Define a porta do servidor, padrão 4000

// Middlewares
app.use(cors()); // Habilita o CORS para permitir requisições do frontend
app.use(express.json()); // Habilita o parsing de JSON no corpo das requisições

// Healthcheck endpoint
// Uma rota simples para verificar se o servidor está funcionando
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0' });
});

// *** Importante: conectar rotas ***
// Importa as rotas de autenticação
const authRoutes = require('./routes/auth');
// Importa as rotas de KYC
const kycRoutes = require('./routes/kyc'); // Adicionado: Importa as rotas de KYC

// Usa as rotas de autenticação com o prefixo /api/auth
app.use('/api/auth', authRoutes);
// Adicionado: Usa as rotas de KYC com o prefixo /api/kyc
app.use('/api/kyc', kycRoutes); 

// Rota raiz simples
app.get('/', (req, res) => {
  res.send('Backend rodando corretamente!');
});

// Inicia o servidor na porta definida
app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
});
