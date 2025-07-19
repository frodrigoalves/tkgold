const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Obtém os saldos USD e GOLD do usuário.
 * GET /api/wallet/balance
 */
exports.getBalance = async (req, res) => {
  const userId = req.user.userId; // ID do usuário do token JWT
  try {
    const wallet = await prisma.wallet.findUnique({
      where: { userId: parseInt(userId) },
    });

    if (!wallet) {
      // Se a carteira não existir, cria uma com saldos zero
      const newWallet = await prisma.wallet.create({
        data: {
          userId: parseInt(userId),
          balanceUSD: 0,
          balanceGOLD: 0,
          stakedGOLD: 0,
        },
      });
      return res.json({ success: true, data: { usd: newWallet.balanceUSD, gold: newWallet.balanceGOLD, stakedGold: newWallet.stakedGOLD } });
    }

    res.json({ success: true, data: { usd: wallet.balanceUSD, gold: wallet.balanceGOLD, stakedGold: wallet.stakedGOLD } });
  } catch (error) {
    console.error('Erro ao obter saldo da carteira:', error);
    res.status(500).json({ error: 'Erro interno ao obter saldo da carteira.' });
  }
};

/**
 * Simula um depósito USD.
 * POST /api/wallet/deposit
 */
exports.depositUSD = async (req, res) => {
  const userId = req.user.userId;
  const { amount } = req.body;

  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'Quantidade de depósito inválida.' });
  }

  try {
    const wallet = await prisma.wallet.upsert({
      where: { userId: parseInt(userId) },
      update: { balanceUSD: { increment: amount } },
      create: {
        userId: parseInt(userId),
        balanceUSD: amount,
        balanceGOLD: 0,
        stakedGOLD: 0,
      },
    });
    res.json({ success: true, message: `Depositado $${amount} USD. Novo saldo: $${wallet.balanceUSD} USD.` });
  } catch (error) {
    console.error('Erro ao simular depósito USD:', error);
    res.status(500).json({ error: 'Erro interno ao processar depósito.' });
  }
};

/**
 * Simula um saque USD.
 * POST /api/wallet/withdraw
 */
exports.withdrawUSD = async (req, res) => {
  const userId = req.user.userId;
  const { amount } = req.body;

  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'Quantidade de saque inválida.' });
  }

  try {
    const wallet = await prisma.wallet.findUnique({
      where: { userId: parseInt(userId) },
    });

    if (!wallet || wallet.balanceUSD < amount) {
      return res.status(400).json({ error: 'Saldo USD insuficiente.' });
    }

    const updatedWallet = await prisma.wallet.update({
      where: { userId: parseInt(userId) },
      data: { balanceUSD: { decrement: amount } },
    });
    res.json({ success: true, message: `Sacado $${amount} USD. Novo saldo: $${updatedWallet.balanceUSD} USD.` });
  } catch (error) {
    console.error('Erro ao simular saque USD:', error);
    res.status(500).json({ error: 'Erro interno ao processar saque.' });
  }
};
