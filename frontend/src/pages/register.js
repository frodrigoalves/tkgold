import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, UserPlus, Loader, XCircle } from 'lucide-react';

// Importações do Firebase
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Importar componentes reutilizáveis
import Button from '../components/Button.js';
import Card from '../components/Card.js';

// Importar funções de API (para integração real)
import { register } from '../services/api.js';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
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
          // Usuário já logado, redirecionar para o dashboard
          // window.location.href = '/dashboard'; // Comentado para permitir o registro
        } else {
          if (initialAuthToken) {
            await signInWithCustomToken(firebaseAuth, initialAuthToken);
          }
        }
      });

      return () => unsubscribe();
    } catch (e) {
      console.error("Erro de inicialização do Firebase:", e);
      setError("Falha ao inicializar os serviços da aplicação.");
    }
  }, [appId, firebaseConfig, initialAuthToken]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      setLoading(false);
      return;
    }

    try {
      // Registro de usuário no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // TODO: Integrar com o backend POST /api/auth/register
      // Enviar dados adicionais do usuário (nome) para o seu backend
      console.log("Simulando chamada à API de registro do backend...");
      const backendResponse = await register({ name, email, password }); // Exemplo de chamada à sua api.js

      if (backendResponse.success) {
        setSuccessMessage('Registro bem-sucedido! Você pode fazer login agora.');

        // Inicializar saldos e status KYC no Firestore para o novo usuário
        const userWalletRef = doc(db, `artifacts/${appId}/users/${user.uid}/wallet/balances`);
        const userKycRef = doc(db, `artifacts/${appId}/users/${user.uid}/kyc/status`);
        await setDoc(userWalletRef, { balanceUSD: 10000, balanceGOLD: 0, stakedGOLD: 0 }, { merge: true });
        await setDoc(userKycRef, { status: 'not_started' }, { merge: true });

        // Opcional: Redirecionar para a página de login após o registro
        // setTimeout(() => {
        //   window.location.href = '/login';
        // }, 2000);
      } else {
        setError(backendResponse.error || 'Erro desconhecido no backend.');
        // Se o registro no backend falhar, você pode querer reverter o usuário do Firebase Auth
        // ou lidar com isso de acordo com sua lógica de negócios.
      }

    } catch (err) {
      console.error('Erro de registro:', err);
      if (err.code) {
        switch (err.code) {
          case 'auth/email-already-in-use':
            setError('Este e-mail já está em uso.');
            break;
          case 'auth/invalid-email':
            setError('Endereço de e-mail inválido.');
            break;
          case 'auth/weak-password':
            setError('A senha é muito fraca. Use pelo menos 6 caracteres.');
            break;
          default:
            setError(`Erro de autenticação: ${err.message}`);
        }
      } else {
        setError(err.message || 'Ocorreu um erro desconhecido durante o registro.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-darkBackground text-whiteText p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <img src="https://placehold.co/80x80/FFD700/000000?text=SL" alt="Superland Logo" className="mx-auto mb-4 rounded-full" />
          <h2 className="text-3xl font-bold text-goldPrimary">Criar Nova Conta</h2>
          <p className="text-lightGrey">Junte-se à Superland hoje!</p>
        </div>

        {successMessage && (
          <div className="bg-greenSuccess text-whiteText p-3 rounded-md mb-4 flex items-center">
            <CheckCircle size={20} className="mr-2" />
            {successMessage}
          </div>
        )}

        {error && (
          <div className="bg-redError text-whiteText p-3 rounded-md mb-4 flex items-center">
            <XCircle size={20} className="mr-2" />
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-lightGrey text-sm font-semibold mb-2">
              Nome Completo
            </label>
            <div className="flex items-center bg-cardBackground rounded-lg px-4 py-2">
              <User size={20} className="text-goldPrimary mr-3" />
              <input
                type="text"
                id="name"
                className="w-full bg-transparent text-whiteText focus:outline-none placeholder-lightGrey"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-lightGrey text-sm font-semibold mb-2">
              Email
            </label>
            <div className="flex items-center bg-cardBackground rounded-lg px-4 py-2">
              <Mail size={20} className="text-goldPrimary mr-3" />
              <input
                type="email"
                id="email"
                className="w-full bg-transparent text-whiteText focus:outline-none placeholder-lightGrey"
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-lightGrey text-sm font-semibold mb-2">
              Senha
            </label>
            <div className="flex items-center bg-cardBackground rounded-lg px-4 py-2">
              <Lock size={20} className="text-goldPrimary mr-3" />
              <input
                type="password"
                id="password"
                className="w-full bg-transparent text-whiteText focus:outline-none placeholder-lightGrey"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-lightGrey text-sm font-semibold mb-2">
              Confirmar Senha
            </label>
            <div className="flex items-center bg-cardBackground rounded-lg px-4 py-2">
              <Lock size={20} className="text-goldPrimary mr-3" />
              <input
                type="password"
                id="confirmPassword"
                className="w-full bg-transparent text-whiteText focus:outline-none placeholder-lightGrey"
                placeholder="********"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <Button
            type="submit"
            icon={UserPlus}
            loading={loading}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'A registar...' : 'Registar'}
          </Button>
        </form>

        <p className="text-center text-lightGrey text-sm mt-6">
          Já tem uma conta?{' '}
          <a href="#" onClick={() => handleNavigation('/login')} className="text-goldPrimary hover:underline font-semibold">
            Entrar
          </a>
        </p>
      </Card>
    </div>
  );
}
