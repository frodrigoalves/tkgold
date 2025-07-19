const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

/**
 * Lógica para registrar um novo usuário.
 * @param {object} req - Objeto de requisição do Express.
 * @param {object} res - Objeto de resposta do Express.
 */
exports.register = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    // Validação básica de entrada
    if (!email || !password) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    }

    // Verifica se o usuário já existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Usuário já cadastrado com este e-mail.' });
    }

    // Hash da senha antes de salvar no banco de dados
    const hash = await bcrypt.hash(password, 10);

    // Cria o novo usuário no banco de dados
    const user = await prisma.user.create({
      data: { email, password: hash, name },
    });

    // Retorna os dados do usuário (sem a senha hashed)
    res.status(201).json({ id: user.id, email: user.email, name: user.name, success: true });
  } catch (error) {
    console.error('Erro no registro de usuário:', error); // Log detalhado do erro no servidor
    res.status(500).json({ error: error.message || 'Erro interno ao registrar usuário.' });
  }
};

/**
 * Lógica para autenticar um usuário e gerar um token JWT.
 * @param {object} req - Objeto de requisição do Express.
 * @param {object} res - Objeto de resposta do Express.
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Busca o usuário pelo e-mail
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas: E-mail não encontrado.' });
    }

    // Compara a senha fornecida com a senha hashed no banco de dados
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Credenciais inválidas: Senha incorreta.' });
    }

    // Gera um token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'dev_secret', // Use uma variável de ambiente para o segredo!
      { expiresIn: '7d' } // Token expira em 7 dias
    );

    // Cria uma sessão no banco de dados (opcional, mas bom para rastreamento de sessões ativas)
    await prisma.session.create({
      data: {
        userId: user.id,
        token, // Armazena o token (ou um hash dele)
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias a partir de agora
      },
    });

    // Retorna o token JWT e dados básicos do usuário
    res.json({ token, user: { id: user.id, email: user.email, name: user.name }, success: true });
  } catch (error) {
    console.error('Erro no login de usuário:', error); // Log detalhado do erro no servidor
    res.status(500).json({ error: 'Erro interno ao fazer login.' });
  }
};
