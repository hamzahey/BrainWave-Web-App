'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '../../components/Button';
import Input from '../../components/Input';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading, isAuthenticated } = useAuth();
  const router = useRouter()

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [loading, isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
    } catch (error) {
      setError((error as Error).message || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0b021e]/5 to-[#0b021e]/20">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl border border-[#0b021e]/10">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-[#0b021e] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg 
              className="w-8 h-8 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" 
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-[#0b021e]">Welcome Back</h2>
          <p className="text-[#0b021e]/70">Sign in to your BrainWave account</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 flex items-start">
            <svg 
              className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="py-3 border-[#0b021e]/20 focus:border-[#0b021e]/50 focus:ring-2 focus:ring-[#0b021e]/20 text-[#0b021e]"
                labelClassName="text-[#0b021e]/80 font-medium"
              />
            </div>

            <div>
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="py-3 border-[#0b021e]/20 focus:border-[#0b021e]/50 focus:ring-2 focus:ring-[#0b021e]/20 text-[#0b021e]"
                labelClassName="text-[#0b021e]/80 font-medium"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Link 
              href="/auth/register" 
              className="text-sm font-medium text-[#0b021e]/70 hover:text-[#0b021e] transition-colors"
            >
              Create an account
            </Link>
            
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#0b021e] hover:bg-[#1a093a] focus-visible:outline-[#0b021e] text-white"
          >
            {loading ? (
              <>
                <svg 
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  ></circle>
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Signing in...
              </>
            ) : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  );
}
