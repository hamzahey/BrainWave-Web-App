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
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/admin/patients">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Manage Patients</h2>
              <p className="text-gray-600">View, search, and manage all patient records</p>
            </div>
          </Link>

          <Link href="/admin/doctors">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Manage Doctors</h2>
              <p className="text-gray-600">View, search, and manage all doctor records</p>
            </div>
          </Link>
        </div>

        <div className="mt-8">
          <Link href="/admin/registerdoctor">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Register New Doctor
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}