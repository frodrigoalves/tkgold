import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { DollarSign, BarChart2, CheckCircle, XCircle, Clock, TrendingUp, TrendingDown, CreditCard, Send, Zap, Package, Lock, User, Info, Wallet, PiggyBank, Briefcase, RefreshCcw, ArrowLeft, Loader } from 'lucide-react';

// Importações do Firebase
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';

// Importar componentes reutilizáveis
// Caminho corrigido para incluir a extensão .js
import Button from '../components/Button.js'; 
// Card não é importado aqui, mas as classes Tailwind são usadas diretamente para os cards.
// Se você quiser usar o componente Card, precisaria importá-lo e envolver o conteúdo.

// Registrar componentes do Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Dados simulados para o gráfico de preços do ouro
const goldPriceData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  datasets: [
    {
      label: 'Preço do Ouro (USD/oz)',
      data: [2000, 2050, 2030, 2100, 2080, 2150, 2130],
      fill: false,
      borderColor: 'goldPrimary', // Usando o nome da cor do Tailwind
      tension: 0.1,
    },
  ],
};

// Opções do gráfico para responsividade e estilo
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: 'whiteText', // Usando o nome da cor do Tailwind
        font: {
          size: 14,
        },
      },
    },
    title: {
      display: true,
      text: 'Histórico de Preço do Ouro',
      color: 'whiteText', // Usando o nome da cor do Tailwind
      font: {
        size: 18,
      },
    },
    tooltip: {
      backgroundColor: 'cardBackground', // Usando o nome da cor do Tailwind
      titleColor: 'goldPrimary', // Usando o nome da cor do Tailwind
      bodyColor: 'whiteText', // Usando o nome da cor do Tailwind
      borderColor: 'goldPrimary', // Usando o nome da cor do Tailwind
      borderWidth: 1,
    }
  },
  scales: {
    x: {
      ticks: {
        color: 'lightGrey', // Usando o nome da cor do Tailwind
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
    },
    y: {
      ticks: {
        color: 'lightGrey', // Usando o nome da cor do Tailwind
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
    },
  },
};

// Componente de Status KYC para exibir o status de verificação
const KycStatus = ({ status }) => {
  let icon, colorClass, text; // Alterado para colorClass
  switch (status) {
    case 'approved':
      icon = CheckCircle;
      colorClass = 'text-greenSuccess'; // Usando classe Tailwind
      text = 'Verificado';
      break;
    case 'pending':
      icon = Clock;
      colorClass = 'text-goldPrimary'; // Usando classe Tailwind
      text = 'Pendente';
      break;
    case 'rejected':
      icon = XCircle;
      colorClass = 'text-redError'; // Usando classe Tailwind
      text = 'Rejeitado';
      break;
    default:
      icon = Info;
      colorClass = 'text-lightGrey'; // Usando classe Tailwind
      text = 'Não Iniciado';
  }

  const IconComponent = icon;

  return (
    <div className="flex items-center space-x-2">
      <IconComponent size={20} className={colorClass} /> {/* Usando className */}
      <span className={`font-semibold text-lg ${colorClass}`}>Status KYC: {text}</span>
    </div>
  );
};

// Componente principal da aplicação (Página do Dashboard)
export default function DashboardPage() {
  // Variáveis de estado para dados do usuário
  const [usdBalance, setUsdBalance] = useState(0);
  const [goldBalance, setGoldBalance] = useState(0);
  const [kycStatus, setKycStatus] = useState('not_started'); // 'approved', 'pending', 'rejected', 'not_started'
  const [goldPrice, setGoldPrice] = useState(2000); // Preço atual do ouro, inicializado para evitar erro
  const [apy, setApy] = useState(5.00); // APY simulado
  const [stakedGold, setStakedGold] = useState(0); // Ouro stakado
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
          // Autenticar anonimamente se nenhum usuário estiver autenticado
          if (initialAuthToken) {
            await signInWithCustomToken(firebaseAuth, initialAuthToken);
          } else {
            await signInAnonymously(firebaseAuth);
          }
        }
        setLoading(false); // O estado de autenticação está pronto
      });

      return () => unsubscribe();
    } catch (e) {
      console.error("Erro de inicialização do Firebase:", e);
      setError("Falha ao inicializar os serviços da aplicação.");
      setLoading(false);
    }
  }, [appId, firebaseConfig, initialAuthToken]); // Adicionar dependências para evitar re-inicialização desnecessária

  // Buscar dados do usuário e preço do ouro
  useEffect(() => {
    if (!db || !userId) return; // Esperar o Firebase ser inicializado e o ID do usuário ser definido

    const fetchBalancesAndStatus = () => {
      const userWalletRef = doc(db, `artifacts/${appId}/users/${userId}/wallet/balances`);
      const kycDocRef = doc(db, `artifacts/${appId}/users/${userId}/kyc/status`);

      // Ouvir atualizações em tempo real dos saldos da carteira
      const unsubscribeWallet = onSnapshot(userWalletRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUsdBalance(data.balanceUSD || 0);
          setGoldBalance(data.balanceGOLD || 0);
          setStakedGold(data.stakedGOLD || 0);
        } else {
          // Inicializar saldos se o documento não existir
          setDoc(userWalletRef, { balanceUSD: 0, balanceGOLD: 0, stakedGOLD: 0 }, { merge: true });
        }
      }, (error) => {
        console.error("Erro ao buscar dados da carteira:", error);
        setError("Falha ao carregar dados da carteira.");
      });

      // Ouvir atualizações em tempo real do status KYC
      const unsubscribeKyc = onSnapshot(kycDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setKycStatus(data.status || 'not_started');
        } else {
          // Inicializar status KYC se o documento não existir
          setDoc(kycDocRef, { status: 'not_started' }, { merge: true });
        }
      }, (error) => {
        console.error("Erro ao buscar status KYC:", error);
        setError("Falha ao carregar status KYC.");
      });

      return () => {
        unsubscribeWallet();
        unsubscribeKyc();
      };
    };

    const fetchGoldPrice = async () => {
      // Usando preço simulado para evitar erros de URL no ambiente atual
      // TODO: Substituir por chamada real à API do seu backend GET /api/gold/price
      const simulatedPrice = (Math.random() * (2150 - 2100) + 2100).toFixed(2);
      setGoldPrice(parseFloat(simulatedPrice));
      console.warn("Usando preço de ouro simulado. A chamada real da API está comentada para evitar erros de URL.");
    };

    fetchBalancesAndStatus();
    fetchGoldPrice();
    const priceInterval = setInterval(fetchGoldPrice, 10000); // Atualizar preço a cada 10 segundos

    // Simular atualizações de dados do gráfico
    const chartInterval = setInterval(() => {
      // Atualiza os dados do gráfico com um novo preço simulado
      const newPrice = (Math.random() * (2150 - 2100) + 2100).toFixed(2);
      setGoldPrice(parseFloat(newPrice)); // Atualiza o preço exibido também

      goldPriceData.datasets[0].data.push(parseFloat(newPrice));
      goldPriceData.labels.push(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));

      // Manter o número de pontos no gráfico limitado para melhor visualização
      if (goldPriceData.datasets[0].data.length > 7) {
        goldPriceData.datasets[0].data.shift();
        goldPriceData.labels.shift();
      }
      // Força a atualização do estado para que o gráfico seja redesenhado
      setGoldPrice(parseFloat(newPrice)); // Gatilho para re-renderizar o gráfico
    }, 5000); // Atualizar gráfico a cada 5 segundos

    return () => {
      clearInterval(priceInterval);
      clearInterval(chartInterval);
    };
  }, [db, userId, appId]); // Depender de db, userId e appId

  // Placeholder para manipulação de ações, será integrado com o backend depois
  const handleNavigation = (path) => {
    console.log(`Navegando para: ${path}`);
    window.location.href = path; // Usar window.location.href para navegação
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-darkBackground text-whiteText">
        <p className="text-xl flex items-center"><Loader size={24} className="animate-spin mr-3" /> A carregar dados...</p>
      </div>
    );
  }

  if (error && !loading) { // Exibir erro se não estiver a carregar
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-darkBackground text-redError">
        <XCircle size={48} className="mb-4" />
        <p className="text-xl text-center">Erro: {error}</p>
        <Button onClick={() => window.location.reload()} className="mt-6">Tentar Novamente</Button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-8 font-inter bg-darkBackground text-whiteText`}>
      {/* Secção do Cabeçalho */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-12">
        <div className="flex items-center mb-4 md:mb-0">
          {/* Logótipo Superland (Placeholder) */}
          <img src="https://placehold.co/60x60/FFD700/000000?text=SL" alt="Logótipo Superland" className="rounded-full mr-4" />
          <h1 className="text-4xl font-bold text-goldPrimary">Superland</h1>
        </div>
        {/* Menu de Navegação */}
        <nav className="flex space-x-6">
          <a href="#" onClick={() => handleNavigation('/dashboard')} className="text-lg font-medium hover:text-goldPrimary transition-colors duration-200">Painel</a>
          <a href="#" onClick={() => handleNavigation('/trade')} className="text-lg font-medium hover:text-goldPrimary transition-colors duration-200">Negociar</a>
          <a href="#" onClick={() => handleNavigation('/borrow')} className="text-lg font-medium hover:text-goldPrimary transition-colors duration-200">Empréstimo</a>
          <a href="#" onClick={() => handleNavigation('/redeem')} className="text-lg font-medium hover:text-goldPrimary transition-colors duration-200">Resgatar</a>
          <a href="#" onClick={() => handleNavigation('/kyc/pf')} className="text-lg font-medium hover:text-goldPrimary transition-colors duration-200">KYC</a> {/* Link KYC para fácil acesso */}
        </nav>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <Button onClick={() => handleNavigation('/login')} className="bg-transparent hover:bg-transparent text-goldPrimary hover:text-yellow-600 border border-goldPrimary hover:border-yellow-600 shadow-none hover:shadow-none">
            Sair
          </Button>
        </div>
      </header>

      {/* Secção de Mensagens de Destaque */}
      <section className="mb-12 text-center">
        <h2 className="text-4xl font-bold mb-4 text-whiteText">
          Aqui, o ouro <span className="text-goldPrimary">rende</span>, não fica parado.
        </h2>
        <p className="text-xl text-lightGrey mb-6">
          A primeira plataforma de ouro tokenizado impulsionada por IA do mundo.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Cartão de Funcionalidade: APY */}
          <div className="bg-cardBackground rounded-xl shadow-lg p-6 flex flex-col items-center text-center">
            <PiggyBank size={40} color="goldPrimary" className="mb-3" />
            <h3 className="text-2xl font-semibold mb-2 text-whiteText">Até {apy}% APY</h3>
            <p className="text-md text-lightGrey">Obtenha rendimento com o seu ouro.</p>
          </div>
          {/* Cartão de Funcionalidade: Resgate Físico */}
          <div className="bg-cardBackground rounded-xl shadow-lg p-6 flex flex-col items-center text-center">
            <Package size={40} color="goldPrimary" className="mb-3" />
            <h3 className="text-2xl font-semibold mb-2 text-whiteText">Resgate Físico</h3>
            <p className="text-md text-lightGrey">A partir de 1 oz (funcionalidade bónus).</p>
          </div>
          {/* Cartão de Funcionalidade: Experiência Simplificada */}
          <div className="bg-cardBackground rounded-xl shadow-lg p-6 flex flex-col items-center text-center">
            <Lock size={40} color="goldPrimary" className="mb-3" />
            <h3 className="text-2xl font-semibold mb-2 text-whiteText">Experiência Simplificada</h3>
            <p className="text-md text-lightGrey">Onboarding rápido e seguro.</p>
          </div>
        </div>
      </section>

      {/* Secção Principal do Painel */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Cartão de Saldo USD */}
        <div className="bg-cardBackground rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <DollarSign size={28} color="goldPrimary" className="mr-3" />
            <h2 className="text-2xl font-semibold text-whiteText">Saldo USD</h2>
          </div>
          <p className="text-5xl font-bold mb-2 text-whiteText">${usdBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          <p className="text-lg text-lightGrey">Disponível para transações.</p>
          <div className="mt-6 flex space-x-4">
            <Button icon={CreditCard} onClick={() => handleNavigation('/wallet/deposit')} className="flex-1">Depositar</Button>
            <Button icon={Send} onClick={() => handleNavigation('/wallet/withdraw')} className="flex-1">Levantar</Button>
          </div>
        </div>

        {/* Cartão de Ouro Tokenizado */}
        <div className="bg-cardBackground rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <BarChart2 size={28} color="goldPrimary" className="mr-3" />
            <h2 className="text-2xl font-semibold text-whiteText">Seu Ouro Tokenizado</h2>
          </div>
          <p className="text-5xl font-bold mb-2 text-whiteText">{goldBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} oz</p>
          <p className="text-lg text-lightGrey">Valor estimado: ${(goldBalance * goldPrice).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</p>
          <div className="mt-6 flex space-x-4">
            <Button icon={TrendingUp} onClick={() => handleNavigation('/trade')} className="flex-1">Comprar GOLD</Button>
            <Button icon={TrendingDown} onClick={() => handleNavigation('/trade')} className="flex-1">Vender GOLD</Button>
          </div>
        </div>

        {/* Cartão de Status e Ações Rápidas */}
        <div className="bg-cardBackground rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <User size={28} color="goldPrimary" className="mr-3" />
            <h2 className="text-2xl font-semibold text-whiteText">Status e Ações</h2>
          </div>
          <KycStatus status={kycStatus} />
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-3 text-whiteText">Ouro Produtivo</h3>
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg text-lightGrey">Seu ouro está stakado:</span>
              <span className={`font-bold text-lg ${stakedGold > 0 ? 'text-greenSuccess' : 'text-redError'}`}>
                {stakedGold > 0 ? 'ATIVO' : 'INATIVO'}
              </span>
            </div>
            <Button icon={Zap} onClick={() => handleNavigation('/borrow')} className="w-full mb-4">
              {stakedGold > 0 ? 'Gerir Stake' : 'Ativar Stake'}
            </Button>
            <Button icon={RefreshCcw} onClick={() => handleNavigation('/borrow')} className="w-full bg-gradient-to-r from-blueAccent to-blue-800 hover:from-blue-800 hover:to-blueAccent focus:ring-blue-500">
              Solicitar Empréstimo
            </Button>
          </div>
        </div>
      </section>

      {/* Secção do Gráfico de Preço do Ouro */}
      <section className="mb-12">
        <div className="bg-cardBackground rounded-xl shadow-lg p-6 h-96">
          <Line data={goldPriceData} options={chartOptions} />
        </div>
      </section>

      {/* Secção de Resgate Físico */}
      <section className="mb-12">
        <div className="bg-cardBackground rounded-xl shadow-lg p-6 text-center">
          <h2 className="text-3xl font-bold mb-4 text-whiteText">Resgatar Seu Ouro Físico</h2>
          <p className="text-lg text-lightGrey mb-6">
            Obtenha a posse tangível do seu ouro. Resgate a partir de 1 oz.
          </p>
          <Button icon={Wallet} onClick={() => handleNavigation('/redeem')} className="mx-auto">
            Resgatar Ouro
          </Button>
          <p className="text-sm text-lightGrey mt-4">
            *Taxas e condições de entrega aplicáveis. Esta é uma funcionalidade bónus, não o core.
          </p>
        </div>
      </section>

      {/* Secção do Rodapé */}
      <footer className="text-center text-lightGrey text-sm mt-12 py-8">
        <p>&copy; {new Date().getFullYear()} Superland. Todos os direitos reservados.</p>
        <p className="mt-2">
          <a href="#" className="hover:text-goldPrimary transition-colors duration-200">Termos de Serviço</a> |{' '}
          <a href="#" className="hover:text-goldPrimary transition-colors duration-200">Política de Privacidade</a>
        </p>
      </footer>
    </div>
  );
}
