// app/admin/dashboard/page.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Button from '../../components/Button';
import Link from 'next/link';



export default function AdminDashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!loading && (!isAuthenticated || user?.role !== 'admin')) {
    router.push('/auth/login');
    return null;
  }


  
  return (
    <div className="min-h-screen bg-[#f8f9fa] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#0b021e]">Admin Dashboard</h1>
          <Link 
            href="/admin/registerdoctor" 
            className="bg-[#0b021e] hover:bg-[#1a093a] text-white px-5 py-3 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Register New Doctor</span>
          </Link>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Patients Card */}
          <Link href="/admin/patients" className="block group">
            <div className="bg-white p-6 rounded-xl shadow-md group-hover:shadow-lg transition-all h-full border-l-4 border-[#0b021e] group-hover:border-[#1a093a]">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-[#0b021e]/10 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#0b021e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-[#0b021e]">Manage Patients</h2>
              </div>
              <p className="text-gray-600">View, search, and manage all patient records.</p>
            </div>
          </Link>
  
          {/* Doctors Card */}
          <Link href="/admin/doctors" className="block group">
            <div className="bg-white p-6 rounded-xl shadow-md group-hover:shadow-lg transition-all h-full border-l-4 border-[#0b021e] group-hover:border-[#1a093a]">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-[#0b021e]/10 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#0b021e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-[#0b021e]">Manage Doctors</h2>
              </div>
              <p className="text-gray-600">View, search, and manage all doctor records.</p>
            </div>
          </Link>
  
          {/* Analysis Card */}
          <Link href="/admin/getanalysis" className="block group">
            <div className="bg-white p-6 rounded-xl shadow-md group-hover:shadow-lg transition-all h-full border-l-4 border-[#0b021e] group-hover:border-[#1a093a]">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-[#0b021e]/10 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#0b021e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-[#0b021e]">Analysis Reports</h2>
              </div>
              <p className="text-gray-600">View and analyze patient recovery predictions.</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}