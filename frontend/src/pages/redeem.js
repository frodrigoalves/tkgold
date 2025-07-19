import React, { useState, useEffect } from 'react';
import { ArrowLeft, Package, MapPin, Loader, CheckCircle, XCircle } from 'lucide-react';

// Importações do Firebase
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, onSnapshot, updateDoc } from 'firebase/firestore';

// Importar componentes reutilizáveis
import Button from '../components/Button.js';
import Card from '../components/Card.js';

// Importar funções de API
import { redeemPhysicalGold } from '../services/api.js';

export default function RedeemPage() {
  const [goldToRedeem, setGoldToRedeem] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [goldBalance, setGoldBalance] = useState(0);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);

  // Declarar variáveis globais para o ESLint
  const appId = typeof  !== 'undefined' ?  : 'default-app-id';
  const firebaseConfig = typeof firebaseConfig !== 'undefined' ? JSON.parse(firebaseConfig) : {};
  const initialAuthToken = typeof  !== 'undefined' ?  : null;

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

  // Buscar saldo de ouro
  useEffect(() => {
    if (!db || !userId) return;

    const fetchGoldBalance = () => {
      const userWalletRef = doc(db, `artifacts/${appId}/users/${userId}/wallet/balances`);

      const unsubscribe = onSnapshot(userWalletRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setGoldBalance(data.balanceGOLD || 0);
        } else {
          // Se o documento não existir, inicializa com 0 GOLD
          updateDoc(userWalletRef, { balanceGOLD: 0 }, { merge: true });
        }
      }, (error) => {
        console.error("Erro ao buscar saldo de ouro:", error);
        setError("Falha ao carregar saldo de ouro.");
      });

      return unsubscribe;
    };

    fetchGoldBalance();
  }, [db, userId, appId]);

  const handleRedeem = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    const amount = parseFloat(goldToRedeem);
    if (isNaN(amount) || amount <= 0 || amount < 1) { // Mínimo de 1 oz
      setError('Por favor, insira uma quantidade válida (mínimo 1 oz) de GOLD para resgate.');
      setLoading(false);
      return;
    }
    if (goldBalance < amount) {
      setError('Saldo GOLD insuficiente para resgate.');
      setLoading(false);
      return;
    }
    if (!deliveryAddress.trim()) {
      setError('Por favor, insira o endereço de entrega.');
      setLoading(false);
      return;
    }

    const redeemData = {
      amount,
      deliveryAddress,
    };

    try {
      const result = await redeemPhysicalGold(redeemData); // Chamada à API
      if (result.success) {
        setSuccessMessage(`Solicitação de resgate de ${amount} oz de GOLD enviada com sucesso para ${deliveryAddress}!`);
        // Atualizar saldo no Firestore
        if (db && userId) {
          const userWalletRef = doc(db, `artifacts/${appId}/users/${userId}/wallet/balances`);
          await updateDoc(userWalletRef, {
            balanceGOLD: goldBalance - amount,
          });
        }
        setGoldToRedeem('');
        setDeliveryAddress('');
      } else {
        setError(result.error || 'Falha ao solicitar resgate físico.');
      }
    } catch (err) {
      console.error('Erro ao solicitar resgate físico:', err);
      setError(err.message || 'Ocorreu um erro inesperado durante a solicitação de resgate.');
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
            Resgatar Ouro Físico
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

        <div className="mb-6 text-center bg-cardBackground rounded-lg p-4">
          <p className="text-lightGrey text-lg">Seu Saldo GOLD Disponível:</p>
          <p className="text-whiteText text-4xl font-bold">{goldBalance.toLocaleString('en-US', { minimumFractionDigits: 4 })} oz</p>
          <p className="text-sm text-lightGrey mt-2">Mínimo para resgate: 1.0000 oz</p>
        </div>

        <form onSubmit={handleRedeem}>
          <div className="mb-4">
            <label htmlFor="goldToRedeem" className="block text-lightGrey text-sm font-semibold mb-2">
              Quantidade de GOLD para Resgatar (oz)
            </label>
            <div className="flex items-center bg-[#181818] rounded-lg px-4 py-2">
              <Package size={20} className="text-goldPrimary mr-3" />
              <input
                type="number"
                id="goldToRedeem"
                className="w-full bg-transparent text-whiteText focus:outline-none placeholder-lightGrey"
                placeholder="1.0000"
                step="0.0001"
                min="1"
                value={goldToRedeem}
                onChange={(e) => setGoldToRedeem(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="deliveryAddress" className="block text-lightGrey text-sm font-semibold mb-2">
              Endereço de Entrega
            </label>
            <div className="flex items-center bg-[#181818] rounded-lg px-4 py-2">
              <MapPin size={20} className="text-goldPrimary mr-3" />
              <textarea
                id="deliveryAddress"
                className="w-full bg-transparent text-whiteText focus:outline-none placeholder-lightGrey resize-none"
                placeholder="Rua, Número, Bairro, Cidade, Estado, CEP, País"
                rows="3"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                required
              ></textarea>
            </div>
            <p className="text-sm mt-2 text-lightGrey">
              Por favor, forneça um endereço completo e preciso para a entrega.
            </p>
          </div>

          <Button
            type="submit"
            icon={Package}
            loading={loading}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'A enviar solicitação...' : 'Solicitar Resgate Físico'}
          </Button>
        </form>

        <p className="text-center text-lightGrey text-sm mt-6">
          *Taxas de envio e manuseio podem ser aplicadas.
        </p>
      </Card>
    </div>
  );
}
