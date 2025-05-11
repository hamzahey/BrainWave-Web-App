'use client';

import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Landing() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-700">
        Loading...
      </div>
    );
  }

  const handleRoleNavigation = () => {
    if (!user?.role) return;
    if (user.role === 'admin') {
      router.push('/admin/dashboard');
    } else if (user.role === 'doctor') {
      router.push('/doctor/analysis');
    }
  };

  const historyNavigation = () => {
    router.push('/analysis/history');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b021e]/5 to-[#0b021e]/10 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#0b021e]/10">

          {/* Header with Brand Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-[#0b021e] rounded-full flex items-center justify-center mb-4">
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
            <h1 className="text-3xl font-bold text-[#0b021e] text-center">
              Welcome to BrainWave
            </h1>
            <p className="text-[#0b021e]/70 mt-2 text-center">
              Neurological Recovery Prediction Dashboard
            </p>
          </div>

          {/* User Profile Section */}
          {user && (
            <div className="mb-8 bg-[#0b021e]/5 rounded-xl p-6 border border-[#0b021e]/10">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-[#0b021e]/10 flex items-center justify-center text-2xl font-bold text-[#0b021e]">
                  {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-[#0b021e]">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="text-[#0b021e]/70 capitalize">{user.role}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border border-[#0b021e]/10">
                  <p className="text-sm text-[#0b021e]/60">Email</p>
                  <p className="font-medium text-[#0b021e]">{user.email}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-[#0b021e]/10">
                  <p className="text-sm text-[#0b021e]/60">Account Status</p>
                  <p className="font-medium text-green-600">Active</p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-[#0b021e] mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(user?.role === 'admin' || user?.role === 'doctor') && (
                <button 
                  onClick={handleRoleNavigation}
                  className="flex items-center space-x-3 bg-[#0b021e]/5 hover:bg-[#0b021e]/10 p-4 rounded-xl border border-[#0b021e]/10 transition-colors"
                >
                  <div className="w-10 h-10 bg-[#0b021e]/10 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0b021e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <span className="font-medium text-[#0b021e]">
                    {user.role === 'admin' ? 'Admin Dashboard' : 'Doctor Analysis'}
                  </span>
                </button>
              )}

              <button onClick={historyNavigation}
              className="flex items-center space-x-3 bg-[#0b021e]/5 hover:bg-[#0b021e]/10 p-4 rounded-xl border border-[#0b021e]/10 transition-colors">
                <div className="w-10 h-10 bg-[#0b021e]/10 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0b021e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="font-medium text-[#0b021e]">View Reports</span>
              </button>
            </div>
          </div>

          {/* Logout or Patient Action */}
          <div className="flex justify-end">
            <button 
              onClick={logout}
              className="px-6 py-2.5 bg-gradient-to-r from-[#0b021e] to-[#1a093a] text-white rounded-xl hover:shadow-lg transition-all flex items-center space-x-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
