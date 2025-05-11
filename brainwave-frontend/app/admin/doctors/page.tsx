// app/admin/doctors/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Button from '../../components/Button';
import Input from '../../components/Input';

interface Doctor {
  registrationNumber: string;
  userDetails: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  } | null; // Make userDetails nullable
  specialization: string;
  department: string;
  qualifications: string[];
  yearsOfExperience: number;
}

export default function DoctorManagement() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchReg, setSearchReg] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/auth/login');
      return;
    }
    fetchDoctors();
  }, [isAuthenticated, user, router]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/doctors`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch doctors');
      }

      const data = await response.json();
      setDoctors(data.doctors || []); // Ensure we have an array
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const searchDoctor = async () => {
    if (!searchReg.trim()) {
      fetchDoctors();
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/doctor/${searchReg}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Doctor not found');
      }

      const data = await response.json();
      setDoctors([data.doctor].filter(Boolean)); // Filter out null/undefined
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteDoctor = async (registrationNumber: string) => {
    if (!confirm('Are you sure you want to delete this doctor?')) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/doctor/${registrationNumber}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete doctor');
      }

      fetchDoctors();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete doctor');
    }
  };

  if (loading && doctors.length === 0) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Helper function to safely access user details
  const getUserName = (doctor: Doctor) => {
    if (!doctor.userDetails) return 'N/A';
    return `${doctor.userDetails.firstName || ''} ${doctor.userDetails.lastName || ''}`.trim() || 'N/A';
  };

  const getUserEmail = (doctor: Doctor) => {
    return doctor.userDetails?.email || 'N/A';
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#0b021e]">Doctor Management</h1>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-[#0b021e]/10">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-grow">
              <label className="block text-sm font-medium text-[#0b021e] mb-1">Search by Registration Number</label>
              <input
                type="text"
                value={searchReg}
                onChange={(e) => setSearchReg(e.target.value)}
                placeholder="Enter registration number"
                className="w-full px-4 py-2 border border-[#0b021e]/20 rounded-lg focus:ring-2 focus:ring-[#0b021e]/50 focus:border-[#0b021e]/50 text-[#0b021e]"
              />
            </div>
            <button 
              onClick={searchDoctor}
              className="bg-[#0b021e] hover:bg-[#1a093a] text-white px-4 py-2 rounded-lg h-[42px] mt-auto transition-colors shadow-sm hover:shadow-md"
            >
              Search
            </button>
            <button 
              onClick={fetchDoctors}
              className="bg-white border border-[#0b021e] text-[#0b021e] hover:bg-[#0b021e]/5 px-4 py-2 rounded-lg h-[42px] mt-auto transition-colors shadow-sm hover:shadow-md"
            >
              Show All
            </button>
          </div>
  
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg border border-red-200">
              {error}
            </div>
          )}
  
          <div className="overflow-x-auto rounded-lg border border-[#0b021e]/10">
            <table className="min-w-full">
              <thead className="bg-[#0b021e]/5">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-[#0b021e]">Reg. Number</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-[#0b021e]">Name</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-[#0b021e]">Email</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-[#0b021e]">Specialization</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-[#0b021e]">Department</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-[#0b021e]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0b021e]/10">
                {doctors.map((doctor) => (
                  <tr key={doctor.registrationNumber} className="hover:bg-[#0b021e]/5">
                    <td className="py-3 px-4 text-sm text-[#0b021e] font-medium">{doctor.registrationNumber}</td>
                    <td className="py-3 px-4 text-sm text-[#0b021e]">{getUserName(doctor)}</td>
                    <td className="py-3 px-4 text-sm text-[#0b021e]">{getUserEmail(doctor)}</td>
                    <td className="py-3 px-4 text-sm text-[#0b021e] capitalize">{doctor.specialization || 'N/A'}</td>
                    <td className="py-3 px-4 text-sm text-[#0b021e] capitalize">{doctor.department || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => deleteDoctor(doctor.registrationNumber)}
                        className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
  
          {doctors.length === 0 && !loading && (
            <div className="text-center py-8 text-[#0b021e]/50">
              No doctors found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}