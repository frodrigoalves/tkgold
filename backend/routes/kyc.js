const express = require('express');
const router = express.Router();

// Exemplo: rota de teste de KYC
router.get('/test', (req, res) => {
  res.json({ msg: 'KYC route funcionando!' });
});

module.exports = router;
