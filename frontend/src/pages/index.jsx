import React from 'react';
// import { useRouter } from 'next/router'; // Removido: 'next/router' não é resolvido neste ambiente
import { DollarSign, BarChart2, CheckCircle, XCircle, Clock, TrendingUp, TrendingDown, CreditCard, Send, Zap, Package, Lock, User, Info, Wallet, PiggyBank, Briefcase, RefreshCcw, ArrowRight } from 'lucide-react';

// Define Gold DAO color palette
const colors = {
  darkBackground: '#0D0D0D', // Deep black
  cardBackground: '#1A1A1A', // Slightly lighter black for cards
  goldPrimary: '#FFD700',    // Vibrant gold
  blueAccent: '#000080',     // Dark blue
  whiteText: '#FFFFFF',      // Pure white
  lightGrey: '#B0B0B0',      // Light grey for secondary text
  greenSuccess: '#28A745',   // Green for success/active
  redError: '#DC3545',       // Red for error/inactive
};

// Generic Button component with consistent styling and icon support
const Button = ({ children, icon: Icon, onClick, className = '' }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center px-6 py-3 rounded-full font-semibold text-lg transition-all duration-300 ease-in-out
                bg-gradient-to-r from-[${colors.goldPrimary}] to-yellow-600 text-black
                hover:from-yellow-600 hover:to-[${colors.goldPrimary}] hover:shadow-xl
                focus:outline-none focus:ring-4 focus:ring-yellow-500 focus:ring-opacity-50
                ${className}`}
  >
    {Icon && <Icon size={20} className="mr-2" />}
    {children}
  </button>
);

// Main Landing Page component
const App = () => {
  // const router = useRouter(); // Removido: useRouter não pode ser usado sem um ambiente Next.js completo

  const handleNavigation = (path) => {
    // Usando window.location.href para simular a navegação em um ambiente de navegador simples
    // Em um ambiente Next.js real, você usaria router.push(path);
    console.log(`Navigating to: ${path}`);
    window.location.href = path;
  };

  return (
    <div className={`min-h-screen p-8 font-inter flex flex-col`} style={{ backgroundColor: colors.darkBackground, color: colors.whiteText }}>
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-12">
        <div className="flex items-center mb-4 md:mb-0">
          <img src="https://placehold.co/60x60/FFD700/000000?text=SL" alt="Superland Logo" className="rounded-full mr-4" />
          <h1 className="text-4xl font-bold" style={{ color: colors.goldPrimary }}>Superland</h1>
        </div>
        <nav className="flex space-x-6">
          <a href="#" onClick={() => handleNavigation('/')} className="text-lg font-medium hover:text-yellow-500 transition-colors duration-200">Home</a>
          <a href="#" onClick={() => handleNavigation('/staking')} className="text-lg font-medium hover:text-yellow-500 transition-colors duration-200">Staking</a>
          <a href="#" onClick={() => handleNavigation('/redeem')} className="text-lg font-medium hover:text-yellow-500 transition-colors duration-200">Redeem</a>
          <a href="#" onClick={() => handleNavigation('/support')} className="text-lg font-medium hover:text-yellow-500 transition-colors duration-200">Support</a>
        </nav>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <Button onClick={() => handleNavigation('/login')} className="bg-transparent hover:bg-transparent text-[${colors.goldPrimary}] hover:text-yellow-600 border border-yellow-500 hover:border-yellow-600 shadow-none hover:shadow-none">
            Login
          </Button>
          <Button onClick={() => handleNavigation('/register')}>
            Sign Up
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-grow flex flex-col items-center justify-center text-center py-20">
        <h2 className="text-6xl font-extrabold mb-6 leading-tight" style={{ color: colors.whiteText }}>
          Unlock Gold's Potential: <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[${colors.goldPrimary}] to-yellow-600">Earn Yield with AI-Powered DeFi</span>
        </h2>
        <p className="text-2xl text-gray-400 max-w-3xl mb-10">
          Superland transforms idle gold into a productive asset, offering up to 5% APY by integrating with carefully curated DeFi protocols.
        </p>
        <div className="flex space-x-6">
          <Button icon={ArrowRight} onClick={() => handleNavigation('/register')}>
            Get Started Now
          </Button>
          <Button
            onClick={() => handleNavigation('/dashboard')}
            className="bg-transparent hover:bg-transparent text-[${colors.goldPrimary}] hover:text-yellow-600 border border-yellow-500 hover:border-yellow-600 shadow-none hover:shadow-none"
          >
            Explore Dashboard
          </Button>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16">
        <h3 className="text-4xl font-bold text-center mb-12" style={{ color: colors.whiteText }}>
          Why Choose Superland?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Feature Card 1 */}
          <div className={`p-8 rounded-xl shadow-lg text-center`} style={{ backgroundColor: colors.cardBackground }}>
            <PiggyBank size={60} color={colors.goldPrimary} className="mx-auto mb-6" />
            <h4 className="text-2xl font-semibold mb-3" style={{ color: colors.whiteText }}>Up to 5% APY on Gold</h4>
            <p className="text-lg text-gray-400">
              Make your gold work for you. Earn significant returns by staking your tokenized gold.
            </p>
          </div>
          {/* Feature Card 2 */}
          <div className={`p-8 rounded-xl shadow-lg text-center`} style={{ backgroundColor: colors.cardBackground }}>
            <Zap size={60} color={colors.goldPrimary} className="mx-auto mb-6" />
            <h4 className="text-2xl font-semibold mb-3" style={{ color: colors.whiteText }}>AI-Powered DeFi Integration</h4>
            <p className="text-lg text-gray-400">
              Our intelligent system curates the best DeFi protocols for optimized yield and minimized risk.
            </p>
          </div>
          {/* Feature Card 3 */}
          <div className={`p-8 rounded-xl shadow-lg text-center`} style={{ backgroundColor: colors.cardBackground }}>
            <Package size={60} color={colors.goldPrimary} className="mx-auto mb-6" />
            <h4 className="text-2xl font-semibold mb-3" style={{ color: colors.whiteText }}>Optional Physical Redemption</h4>
            <p className="text-lg text-gray-400">
              Maintain tangible ownership. Redeem 1 oz gold bars, a bonus feature for true peace of mind.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 text-center">
        <h3 className="text-4xl font-bold mb-6" style={{ color: colors.whiteText }}>
          Ready to make your gold productive?
        </h3>
        <Button icon={ArrowRight} onClick={() => handleNavigation('/register')} className="mx-auto">
          Join Superland Today
        </Button>
      </section>

      {/* Footer Section */}
      <footer className="text-center text-gray-400 text-sm mt-auto py-8">
        <p>&copy; {new Date().getFullYear()} Superland. All rights reserved.</p>
        <p className="mt-2">
          <a href="#" className="hover:text-yellow-500 transition-colors duration-200">Terms of Service</a> |{' '}
          <a href="#" className="hover:text-yellow-500 transition-colors duration-200">Privacy Policy</a>
        </p>
      </footer>

      {/* Tailwind CSS CDN and JIT configuration for dynamic colors */}
      <script src="https://cdn.tailwindcss.com"></script>
      <script dangerouslySetInnerHTML={{ __html: `
        tailwind.config = {
          theme: {
            extend: {
              fontFamily: {
                inter: ['Inter', 'sans-serif'],
              },
              colors: {
                darkBackground: '${colors.darkBackground}',
                cardBackground: '${colors.cardBackground}',
                goldPrimary: '${colors.goldPrimary}',
                blueAccent: '${colors.blueAccent}',
                whiteText: '${colors.whiteText}',
                lightGrey: '${colors.lightGrey}',
                greenSuccess: '${colors.greenSuccess}',
                redError: '${colors.redError}',
              }
            }
          }
        }
      `}} />
    </div>
  );
};

export default App;
