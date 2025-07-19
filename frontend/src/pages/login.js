import React, { useState } from 'react';
import { Lock, Mail, ArrowRight } from 'lucide-react';

// Define Gold DAO color palette
const colors = {
  darkBackground: '#0D0D0D',
  cardBackground: '#1A1A1A',
  goldPrimary: '#FFD700',
  whiteText: '#FFFFFF',
  lightGrey: '#B0B0B0',
  redError: '#DC3545',
};

// Reusable Button component (as defined in the Landing Page)
const Button = ({ children, icon: Icon, onClick, className = '', type = 'button' }) => (
  <button
    type={type}
    onClick={onClick}
    className={`flex items-center justify-center px-6 py-3 rounded-full font-semibold text-lg transition-all duration-300 ease-in-out
                bg-gradient-to-r from-[${colors.goldPrimary}] to-yellow-600 text-black
                hover:from-yellow-600 hover:to-[${colors.goldPrimary}] hover:shadow-xl
                focus:outline-none focus:ring-4 focus:ring-yellow-500 focus:ring-opacity-50 w-full mb-2
                ${className}`}
  >
    {Icon && <Icon size={20} className="mr-2" />}
    {children}
  </button>
);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Changed 'err' to 'error' for consistency

  // Simulated login function (replace with actual backend integration!)
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    // TODO: Integrate with backend /api/auth/login
    // Example fetch call (replace with your actual API service)
    /*
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();

      if (result.success) {
        alert('Login successful!');
        window.location.href = '/dashboard'; // Navigate to dashboard on success
      } else {
        setError(result.error || 'Invalid email or password.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
    }
    */

    // Simulated success for demonstration
    alert('Simulated Login!\nEmail: ' + email);
    window.location.href = '/dashboard'; // Navigate to dashboard after simulated login
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: colors.darkBackground }}>
      <div className="w-full max-w-md bg-[rgba(26,26,26,0.98)] p-8 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: colors.goldPrimary }}>
          Sign In to Superland
        </h2>
        <form onSubmit={handleLogin}>
          <div className="mb-6">
            <label htmlFor="email" className="block mb-2 text-lg" style={{ color: colors.lightGrey }}>
              Email
            </label>
            <div className="flex items-center bg-[#181818] rounded-lg p-3">
              <Mail size={20} color={colors.goldPrimary} className="mr-3" />
              <input
                id="email"
                type="email"
                className="bg-transparent outline-none w-full text-white placeholder-gray-500"
                placeholder="Your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-lg" style={{ color: colors.lightGrey }}>
              Password
            </label>
            <div className="flex items-center bg-[#181818] rounded-lg p-3">
              <Lock size={20} color={colors.goldPrimary} className="mr-3" />
              <input
                id="password"
                type="password"
                className="bg-transparent outline-none w-full text-white placeholder-gray-500"
                placeholder="Your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
          </div>
          {error && <div className="mb-4 text-sm text-center" style={{ color: colors.redError }}>{error}</div>}
          <Button icon={ArrowRight} type="submit">
            Sign In
          </Button>
        </form>
        <div className="mt-6 text-center">
          <a href="/register" className="text-base font-medium hover:underline" style={{ color: colors.goldPrimary }}>
            Don't have an account? Sign Up
          </a>
        </div>
      </div>
      {/* Tailwind CSS CDN is usually included in _app.js in a Next.js project,
          but for standalone preview, it's kept here. */}
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
}
