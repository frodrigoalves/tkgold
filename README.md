# Tokenized Gold – Plataforma MVP

Tokenized Gold é uma plataforma de tokenização de ativos lastreados em ouro, integrando DeFi, contratos inteligentes e identidade verificada.

---

## Estrutura do Projeto

- `frontend/`: Interface (Next.js + TailwindCSS)
- `backend/`: API Node.js com Express
- `contracts/`: Smart contracts em Solidity (ERC20, staking, empréstimos)
- `api/`: Alternativa leve ao backend principal, com endpoints para KYC e trading

---

## Como executar localmente

### Instalar dependências:

```bash
cd api && npm install
cd ../contracts && npm install # se existir package.json
cd ../frontend && npm install
