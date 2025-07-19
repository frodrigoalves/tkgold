import React, { useState, useEffect } from 'react';
import { ArrowLeft, DollarSign, BarChart2, Zap, Loader, CheckCircle, XCircle } from 'lucide-react';

// Importações do Firebase
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, onSnapshot, updateDoc, setDoc } from 'firebase/firestore';

// Importar componentes reutilizáveis
import Button from '../components/Button.js';
import Card from '../components/Card.js';

// Importar funções de API
import { stakeGold, borrowFunds, getDefiStatus } from '../services/api.js';

export default function BorrowPage() {
  const [goldToStake, setGoldToStake] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [loanCurrency, setLoanCurrency] = useState('USDC'); // 'USDC' ou 'BTC'
  const [ltv, setLtv] = useState(70); // Loan-to-Value padrão
  const [interestRate, setInterestRate] = useState(5); // Taxa de juros anual
  const [loanTerm, setLoanTerm] = useState(30); // Prazo do empréstimo em dias
  const [usdBalance, setUsdBalance] = useState(0);
  const [goldBalance, setGoldBalance] = useState(0);
  const [stakedGold, setStakedGold] = useState(0);
  const [currentLoan, setCurrentLoan] = useState(null); // { amount, currency, collateral, status }
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

  // Buscar saldos e status DeFi
  useEffect(() => {
    if (!db || !userId) return;

    const fetchBalancesAndDefiStatus = () => {
      const userWalletRef = doc(db, `artifacts/${appId}/users/${userId}/wallet/balances`);
      const userDefiRef = doc(db, `artifacts/${appId}/users/${userId}/defi/status`);

      const unsubscribeWallet = onSnapshot(userWalletRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUsdBalance(data.balanceUSD || 0);
          setGoldBalance(data.balanceGOLD || 0);
          setStakedGold(data.stakedGOLD || 0);
        } else {
          setDoc(userWalletRef, { balanceUSD: 10000, balanceGOLD: 0, stakedGOLD: 0 }, { merge: true });
        }
      }, (error) => {
        console.error("Erro ao buscar dados da carteira:", error);
        setError("Falha ao carregar dados da carteira.");
      });

      const unsubscribeDefi = onSnapshot(userDefiRef, (docSnap) => {
        if (docSnap.exists()) {
          setCurrentLoan(docSnap.data().currentLoan || null);
        } else {
          setDoc(userDefiRef, { currentLoan: null }, { merge: true });
        }
      }, (error) => {
        console.error("Erro ao buscar status DeFi:", error);
        setError("Falha ao carregar status DeFi.");
      });

      setLoading(false);
      return () => {
        unsubscribeWallet();
        unsubscribeDefi();
      };
    };

    fetchBalancesAndDefiStatus();
  }, [db, userId, appId]);

  const handleStakeGold = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    const amount = parseFloat(goldToStake);
    if (isNaN(amount) || amount <= 0) {
      setError('Por favor, insira uma quantidade válida de GOLD para staking.');
      setLoading(false);
      return;
    }
    if (goldBalance < amount) {
      setError('Saldo GOLD insuficiente para staking.');
      setLoading(false);
      return;
    }

    try {
      const result = await stakeGold(amount); // Chamada à API
      if (result.success) {
        setSuccessMessage(`${amount} oz de GOLD stakados com sucesso!`);
        // Atualizar saldos no Firestore
        if (db && userId) {
          const userWalletRef = doc(db, `artifacts/${appId}/users/${userId}/wallet/balances`);
          await updateDoc(userWalletRef, {
            balanceGOLD: goldBalance - amount,
            stakedGOLD: stakedGold + amount,
          });
        }
        setGoldToStake('');
      } else {
        setError(result.error || 'Falha ao stakar GOLD.');
      }
    } catch (err) {
      console.error('Erro ao stakar GOLD:', err);
      setError(err.message || 'Ocorreu um erro inesperado ao stakar GOLD.');
    } finally {
      setLoading(false);
    }
  };

  const handleBorrowFunds = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    const amount = parseFloat(loanAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('Por favor, insira uma quantidade válida para o empréstimo.');
      setLoading(false);
      return;
    }
    if (stakedGold <= 0) {
      setError('Você precisa stakar GOLD como colateral primeiro.');
      setLoading(false);
      return;
    }

    const loanData = {
      amount,
      currency: loanCurrency,
      collateralGold: stakedGold, // Usar todo o GOLD stakado como colateral
      ltv,
      interestRate,
      loanTerm,
    };

    try {
      const result = await borrowFunds(loanData); // Chamada à API
      if (result.success) {
        setSuccessMessage(`Empréstimo de ${amount} ${loanCurrency} aprovado!`);
        // Atualizar status de empréstimo e saldos no Firestore
        if (db && userId) {
          const userDefiRef = doc(db, `artifacts/${appId}/users/${userId}/defi/status`);
          await updateDoc(userDefiRef, {
            currentLoan: {
              amount,
              currency: loanCurrency,
              collateral: stakedGold,
              status: 'active',
              startDate: new Date(),
              dueDate: new Date(Date.now() + loanTerm * 24 * 60 * 60 * 1000),
            }
          });
          const userWalletRef = doc(db, `artifacts/${appId}/users/${userId}/wallet/balances`);
          // Adiciona o valor do empréstimo ao saldo USD ou BTC (simulando USDC/BTC como USD por simplicidade)
          await updateDoc(userWalletRef, {
            balanceUSD: usdBalance + amount, // Assumindo que USDC/BTC se convertem para USD no saldo
          });
        }
        setLoanAmount('');
      } else {
        setError(result.error || 'Falha ao solicitar empréstimo.');
      }
    } catch (err) {
      console.error('Erro ao solicitar empréstimo:', err);
      setError(err.message || 'Ocorreu um erro inesperado ao solicitar empréstimo.');
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
            Empréstimo DeFi com Colateral em Ouro
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-cardBackground rounded-lg p-4 text-center">
            <p className="text-lightGrey text-lg">Seu Saldo GOLD:</p>
            <p className="text-whiteText text-3xl font-bold">{goldBalance.toLocaleString('en-US', { minimumFractionDigits: 4 })} oz</p>
          </div>
          <div className="bg-cardBackground rounded-lg p-4 text-center">
            <p className="text-lightGrey text-lg">GOLD Stakado:</p>
            <p className="text-whiteText text-3xl font-bold">{stakedGold.toLocaleString('en-US', { minimumFractionDigits: 4 })} oz</p>
          </div>
        </div>

        {/* Seção de Staking de GOLD */}
        <h3 className="text-2xl font-semibold text-goldPrimary mb-4">Stakar GOLD como Colateral</h3>
        <form onSubmit={handleStakeGold} className="mb-8">
          <div className="mb-4">
            <label htmlFor="goldToStake" className="block text-lightGrey text-sm font-semibold mb-2">
              Quantidade de GOLD a Stakar (oz)
            </label>
            <div className="flex items-center bg-[#181818] rounded-lg px-4 py-2">
              <BarChart2 size={20} className="text-goldPrimary mr-3" />
              <input
                type="number"
                id="goldToStake"
                className="w-full bg-transparent text-whiteText focus:outline-none placeholder-lightGrey"
                placeholder="0.0000"
                step="0.0001"
                value={goldToStake}
                onChange={(e) => setGoldToStake(e.target.value)}
                required
              />
            </div>
          </div>
          <Button
            type="submit"
            icon={Zap}
            loading={loading}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'A stakar...' : 'Stakar GOLD'}
          </Button>
        </form>

        {/* Seção de Empréstimo */}
        <h3 className="text-2xl font-semibold text-goldPrimary mb-4">Solicitar Empréstimo</h3>
        {stakedGold > 0 ? (
          <form onSubmit={handleBorrowFunds}>
            <div className="mb-4">
              <label htmlFor="loanAmount" className="block text-lightGrey text-sm font-semibold mb-2">
                Valor do Empréstimo
              </label>
              <div className="flex items-center bg-[#181818] rounded-lg px-4 py-2">
                <DollarSign size={20} className="text-goldPrimary mr-3" />
                <input
                  type="number"
                  id="loanAmount"
                  className="w-full bg-transparent text-whiteText focus:outline-none placeholder-lightGrey"
                  placeholder="0.00"
                  step="0.01"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="loanCurrency" className="block text-lightGrey text-sm font-semibold mb-2">
                Moeda do Empréstimo
              </label>
              <select
                id="loanCurrency"
                className="w-full bg-[#181818] text-whiteText rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-goldPrimary"
                value={loanCurrency}
                onChange={(e) => setLoanCurrency(e.target.value)}
              >
                <option value="USDC">USDC</option>
                <option value="BTC">BTC</option>
              </select>
            </div>

            <div className="mb-4">
              <p className="text-lightGrey text-sm font-semibold mb-2">Parâmetros do Empréstimo:</p>
              <ul className="list-disc list-inside text-lightGrey ml-4">
                <li>LTV (Loan-to-Value): <span className="text-whiteText font-bold">{ltv}%</span></li>
                <li>Taxa de Juros Anual: <span className="text-whiteText font-bold">{interestRate}%</span></li>
                <li>Prazo: <span className="text-whiteText font-bold">{loanTerm} dias</span></li>
              </ul>
            </div>

            <Button
              type="submit"
              icon={DollarSign}
              loading={loading}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'A solicitar...' : 'Solicitar Empréstimo'}
            </Button>
          </form>
        ) : (
          <p className="text-lightGrey text-center">Stake GOLD para solicitar um empréstimo.</p>
        )}

        {currentLoan && (
          <div className="mt-8 pt-8 border-t border-gray-700">
            <h3 className="text-2xl font-semibold text-goldPrimary mb-4">Seu Empréstimo Ativo</h3>
            <div className="bg-cardBackground rounded-lg p-4">
              <p className="text-lightGrey">Valor: <span className="text-whiteText font-bold">{currentLoan.amount} {currentLoan.currency}</span></p>
              <p className="text-lightGrey">Colateral GOLD: <span className="text-whiteText font-bold">{currentLoan.collateral} oz</span></p>
              <p className="text-lightGrey">Status: <span className="text-greenSuccess font-bold">{currentLoan.status.toUpperCase()}</span></p>
              <p className="text-lightGrey">Data de Início: <span className="text-whiteText font-bold">{new Date(currentLoan.startDate).toLocaleDateString()}</span></p>
              <p className="text-lightGrey">Data de Vencimento: <span className="text-whiteText font-bold">{new Date(currentLoan.dueDate).toLocaleDateString()}</span></p>
              {/* TODO: Adicionar botões para Pagar/Liquidar Empréstimo */}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
