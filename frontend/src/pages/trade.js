import React, { useState, useEffect } from 'react';
import { ArrowLeft, DollarSign, BarChart2, TrendingUp, TrendingDown, Loader, CheckCircle, XCircle } from 'lucide-react';

// Importações do Firebase
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, onSnapshot, updateDoc } from 'firebase/firestore';

// Importar componentes reutilizáveis
import Button from '../components/Button.js';
import Card from '../components/Card.js';

// Importar funções de API
import { getGoldPrice, buyGold, sellGold } from '../services/api.js';

export default function TradePage() {
  const [tradeType, setTradeType] = useState('buy'); // 'buy' ou 'sell'
  const [amount, setAmount] = useState(''); // Quantidade de GOLD
  const [usdAmount, setUsdAmount] = useState(''); // Quantidade de USD (para compra/venda)
  const [goldPrice, setGoldPrice] = useState(0);
  const [usdBalance, setUsdBalance] = useState(0);
  const [goldBalance, setGoldBalance] = useState(0);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);

  // Declarar variáveis globais para o ESLint
  const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
  const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
  const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

  // Inicialização do Firebase e Listener de Autenticação
  useEffect(() => {
    try {
      const app = initializeApp(firebaseConfig);
      const firestore = getFirestore(app);
      const firebaseAuth = getAuth(app);

      setDb(firestore);
      setAuth(firebaseAuth);

      const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
        if (user) {
          setUserId(user.uid);
        } else {
          if (initialAuthToken) {
            await signInWithCustomToken(firebaseAuth, initialAuthToken);
          } else {
            await signInAnonymously(firebaseAuth);
          }
        }
        setLoading(false); // Autenticação inicial concluída
      });

      return () => unsubscribe();
    } catch (e) {
      console.error("Erro de inicialização do Firebase:", e);
      setError("Falha ao inicializar os serviços da aplicação.");
      setLoading(false);
    }
  }, [appId, firebaseConfig, initialAuthToken]);

  // Buscar saldos e preço do ouro
  useEffect(() => {
    if (!db || !userId) return;

    const fetchBalancesAndPrice = async () => {
      const userWalletRef = doc(db, `artifacts/${appId}/users/${userId}/wallet/balances`);

      const unsubscribeWallet = onSnapshot(userWalletRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUsdBalance(data.balanceUSD || 0);
          setGoldBalance(data.balanceGOLD || 0);
        } else {
          // Se o documento não existir, inicializa com valores padrão
          setDoc(userWalletRef, { balanceUSD: 10000, balanceGOLD: 0 }, { merge: true });
        }
      }, (error) => {
        console.error("Erro ao buscar dados da carteira:", error);
        setError("Falha ao carregar dados da carteira.");
      });

      try {
        const priceData = await getGoldPrice();
        setGoldPrice(priceData.price);
      } catch (err) {
        console.error("Erro ao buscar preço do ouro:", err);
        setError("Não foi possível carregar o preço do ouro.");
      }
      setLoading(false);
      return unsubscribeWallet;
    };

    fetchBalancesAndPrice();
  }, [db, userId, appId]);

  // Calcular USD ou GOLD com base no preço atual
  useEffect(() => {
    if (goldPrice > 0) {
      if (tradeType === 'buy') {
        if (usdAmount) {
          setAmount((parseFloat(usdAmount) / goldPrice).toFixed(4));
        } else if (amount) {
          setUsdAmount((parseFloat(amount) * goldPrice).toFixed(2));
        }
      } else { // sell
        if (amount) {
          setUsdAmount((parseFloat(amount) * goldPrice).toFixed(2));
        } else if (usdAmount) {
          setAmount((parseFloat(usdAmount) / goldPrice).toFixed(4));
        }
      }
    }
  }, [amount, usdAmount, goldPrice, tradeType]);

  const handleTrade = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    if (!amount || parseFloat(amount) <= 0) {
      setError('Por favor, insira uma quantidade válida.');
      setLoading(false);
      return;
    }

    const tradeData = {
      amount: parseFloat(amount),
      price: goldPrice,
      total: parseFloat(usdAmount),
    };

    try {
      let result;
      if (tradeType === 'buy') {
        if (usdBalance < tradeData.total) {
          setError('Saldo USD insuficiente para esta compra.');
          setLoading(false);
          return;
        }
        result = await buyGold(tradeData);
      } else { // sell
        if (goldBalance < tradeData.amount) {
          setError('Saldo GOLD insuficiente para esta venda.');
          setLoading(false);
          return;
        }
        result = await sellGold(tradeData);
      }

      if (result.success) {
        setSuccessMessage(`Operação de ${tradeType === 'buy' ? 'compra' : 'venda'} de GOLD realizada com sucesso!`);
        // Atualizar saldos no Firestore após a operação bem-sucedida
        if (db && userId) {
          const userWalletRef = doc(db, `artifacts/${appId}/users/${userId}/wallet/balances`);
          await updateDoc(userWalletRef, {
            balanceUSD: tradeType === 'buy' ? usdBalance - tradeData.total : usdBalance + tradeData.total,
            balanceGOLD: tradeType === 'buy' ? goldBalance + tradeData.amount : goldBalance - tradeData.amount,
          });
        }
        setAmount('');
        setUsdAmount('');
      } else {
        setError(result.error || `Falha na operação de ${tradeType === 'buy' ? 'compra' : 'venda'}.`);
      }
    } catch (err) {
      console.error('Erro na operação de trade:', err);
      setError(err.message || 'Ocorreu um erro inesperado durante a transação.');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-darkBackground text-whiteText">
        <p className="text-xl flex items-center"><Loader size={24} className="animate-spin mr-3" /> A carregar dados...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-darkBackground text-whiteText flex flex-col items-center">
      <Card className="w-full max-w-2xl p-8">
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => handleNavigation('/dashboard')} className="text-lightGrey hover:text-goldPrimary transition-colors duration-200">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-3xl font-bold text-center flex-grow text-goldPrimary">
            Negociar Ouro Tokenizado
          </h2>
          <div className="w-6"></div> {/* Espaçador */}
        </div>

        {successMessage && (
          <div className="mb-6 p-4 rounded-lg flex items-center justify-center bg-greenSuccess text-whiteText">
            <CheckCircle size={24} className="mr-3" />
            <p className="text-lg">{successMessage}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-lg flex items-center justify-center bg-redError text-whiteText">
            <XCircle size={24} className="mr-3" />
            <p className="text-lg">{error}</p>
          </div>
        )}

        <div className="flex justify-center mb-6 space-x-4">
          <button
            onClick={() => setTradeType('buy')}
            className={`px-6 py-2 rounded-full font-semibold text-lg transition-colors duration-200
              ${tradeType === 'buy' ? 'bg-goldPrimary text-black' : 'bg-cardBackground text-lightGrey hover:text-whiteText'}`}
          >
            Comprar GOLD
          </button>
          <button
            onClick={() => setTradeType('sell')}
            className={`px-6 py-2 rounded-full font-semibold text-lg transition-colors duration-200
              ${tradeType === 'sell' ? 'bg-goldPrimary text-black' : 'bg-cardBackground text-lightGrey hover:text-whiteText'}`}
          >
            Vender GOLD
          </button>
        </div>

        <div className="mb-6 text-center">
          <p className="text-xl text-lightGrey mb-2">Preço Atual do Ouro:</p>
          <p className="text-4xl font-bold text-goldPrimary">${goldPrice.toFixed(2)} / oz</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-cardBackground rounded-lg p-4 text-center">
            <p className="text-lightGrey text-lg">Seu Saldo USD:</p>
            <p className="text-whiteText text-3xl font-bold">${usdBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-cardBackground rounded-lg p-4 text-center">
            <p className="text-lightGrey text-lg">Seu Saldo GOLD:</p>
            <p className="text-whiteText text-3xl font-bold">{goldBalance.toLocaleString('en-US', { minimumFractionDigits: 4 })} oz</p>
          </div>
        </div>

        <form onSubmit={handleTrade}>
          <div className="mb-4">
            <label htmlFor="amountGold" className="block text-lightGrey text-sm font-semibold mb-2">
              Quantidade de GOLD (oz)
            </label>
            <div className="flex items-center bg-[#181818] rounded-lg px-4 py-2">
              <BarChart2 size={20} className="text-goldPrimary mr-3" />
              <input
                type="number"
                id="amountGold"
                className="w-full bg-transparent text-whiteText focus:outline-none placeholder-lightGrey"
                placeholder="0.0000"
                step="0.0001"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="amountUsd" className="block text-lightGrey text-sm font-semibold mb-2">
              Quantidade de USD
            </label>
            <div className="flex items-center bg-[#181818] rounded-lg px-4 py-2">
              <DollarSign size={20} className="text-goldPrimary mr-3" />
              <input
                type="number"
                id="amountUsd"
                className="w-full bg-transparent text-whiteText focus:outline-none placeholder-lightGrey"
                placeholder="0.00"
                step="0.01"
                value={usdAmount}
                onChange={(e) => setUsdAmount(e.target.value)}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            icon={tradeType === 'buy' ? TrendingUp : TrendingDown}
            loading={loading}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'A processar...' : `${tradeType === 'buy' ? 'Comprar' : 'Vender'} GOLD`}
          </Button>
        </form>
      </Card>
    </div>
  );
}
