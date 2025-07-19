// services/api.js

// URL base da sua API de backend
// Em um ambiente de produção, isso seria uma variável de ambiente (ex: process.env.NEXT_PUBLIC_API_URL)
const API_BASE_URL = 'http://localhost:4000/api'; // Ajustado para a porta 4000

/**
 * Função auxiliar para fazer requisições à API.
 * Lida com tokens JWT, cabeçalhos e tratamento de erros.
 * @param {string} endpoint - O endpoint da API (ex: '/auth/login').
 * @param {object} options - Opções da requisição (method, body, headers, etc.).
 * @returns {Promise<object>} - A resposta da API.
 */
async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('jwt_token'); // Obter o token JWT do armazenamento local
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      // Lidar com erros HTTP (4xx, 5xx)
      const error = new Error(data.error || 'Ocorreu um erro na requisição.');
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data; // Retorna { success: true, data: ... }
  } catch (error) {
    console.error(`Erro na requisição para ${endpoint}:`, error);
    // Relançar o erro para que o componente que chamou possa tratá-lo
    throw error;
  }
}

// --- Funções Específicas da API ---

/**
 * Registra um novo usuário.
 * POST /api/auth/register
 * @param {object} userData - Dados do usuário (name, email, password, type).
 * @returns {Promise<object>}
 */
export async function register(userData) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

/**
 * Realiza o login do usuário.
 * POST /api/auth/login
 * @param {object} credentials - Credenciais do usuário (email, password).
 * @returns {Promise<object>} - Retorna o token JWT e dados do usuário em caso de sucesso.
 */
export async function login(credentials) {
  const response = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  if (response.success && response.data.token) {
    localStorage.setItem('jwt_token', response.data.token); // Armazenar o token
  }
  return response;
}

/**
 * Obtém os dados do usuário autenticado.
 * GET /api/user/me
 * @returns {Promise<object>}
 */
export async function getUserMe() {
  return apiRequest('/user/me', {
    method: 'GET',
  });
}

/**
 * Obtém o status KYC e saldo do usuário.
 * GET /api/user/status
 * @returns {Promise<object>}
 */
export async function getUserStatus() {
  return apiRequest('/user/status', {
    method: 'GET',
  });
}

/**
 * Envia dados KYC para pessoa física.
 * POST /api/kyc/pf
 * @param {object} kycData - Dados KYC (fullName, documentType, documentNumber, documentUrl, selfieUrl).
 * @returns {Promise<object>}
 */
export async function submitKycPf(kycData) {
  return apiRequest('/kyc/pf', {
    method: 'POST',
    body: JSON.stringify(kycData),
  });
}

/**
 * Envia dados KYC para pessoa jurídica.
 * POST /api/kyc/pj
 * @param {object} kycData - Dados KYC (companyName, cnpj, registrationDocumentUrl, proofOfAddressUrl, authorizedSignatory).
 * @returns {Promise<object>}
 */
export async function submitKycPj(kycData) {
  return apiRequest('/kyc/pj', {
    method: 'POST',
    body: JSON.stringify(kycData),
  });
}

/**
 * Obtém o saldo USD e GOLD do usuário.
 * GET /api/wallet/balance
 * @returns {Promise<object>}
 */
export async function getWalletBalance() {
  return apiRequest('/wallet/balance', {
    method: 'GET',
  });
}

/**
 * Simula um depósito USD.
 * POST /api/wallet/deposit
 * @param {number} amount - Quantidade a depositar.
 * @returns {Promise<object>}
 */
export async function depositUSD(amount) {
  return apiRequest('/wallet/deposit', {
    method: 'POST',
    body: JSON.stringify({ amount }),
  });
}

/**
 * Simula um saque USD.
 * POST /api/wallet/withdraw
 * @param {number} amount - Quantidade a sacar.
 * @returns {Promise<object>}
 */
export async function withdrawUSD(amount) {
  return apiRequest('/wallet/withdraw', {
    method: 'POST',
    body: JSON.stringify({ amount }),
  });
}

/**
 * Obtém o preço atualizado do ouro.
 * GET /api/gold/price
 * @returns {Promise<object>}
 */
export async function getGoldPrice() {
  return apiRequest('/gold/price', {
    method: 'GET',
  });
}

/**
 * Simula a compra de GOLD.
 * POST /api/gold/buy
 * @param {object} tradeData - Dados da compra (amount, price, total).
 * @returns {Promise<object>}
 */
export async function buyGold(tradeData) {
  return apiRequest('/gold/buy', {
    method: 'POST',
    body: JSON.stringify(tradeData),
  });
}

/**
 * Simula a venda de GOLD.
 * POST /api/gold/sell
 * @param {object} tradeData - Dados da venda (amount, price, total).
 * @returns {Promise<object>}
 */
export async function sellGold(tradeData) {
  return apiRequest('/gold/sell', {
    method: 'POST',
    body: JSON.stringify(tradeData),
  });
}

/**
 * Simula o stake de GOLD como colateral.
 * POST /api/defi/stake
 * @param {number} amount - Quantidade de GOLD a stakar.
 * @returns {Promise<object>}
 */
export async function stakeGold(amount) {
  return apiRequest('/defi/stake', {
    method: 'POST',
    body: JSON.stringify({ amount }),
  });
}

/**
 * Simula um empréstimo USDC/BTC.
 * POST /api/defi/borrow
 * @param {object} loanData - Dados do empréstimo (amount, collateralGold, ltv, currency).
 * @returns {Promise<object>}
 */
export async function borrowFunds(loanData) {
  return apiRequest('/defi/borrow', {
    method: 'POST',
    body: JSON.stringify(loanData),
  });
}

/**
 * Obtém a posição/risco do empréstimo.
 * GET /api/defi/status
 * @returns {Promise<object>}
 */
export async function getDefiStatus() {
  return apiRequest('/defi/status', {
    method: 'GET',
  });
}

/**
 * Solicita o resgate físico de ouro.
 * POST /api/gold/redeem
 * @param {object} redeemData - Dados do resgate (amount, deliveryAddress).
 * @returns {Promise<object>}
 */
export async function redeemPhysicalGold(redeemData) {
  return apiRequest('/gold/redeem', {
    method: 'POST',
    body: JSON.stringify(redeemData),
  });
}
