// app/admin/patients/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Button from '../../components/Button';
import Input from '../../components/Input';

interface Patient {
  patientId: string;
  userDetails: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  };
  dateOfBirth: string;
  gender: string;
}

export default function PatientManagement() {
    // const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchId, setSearchId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/auth/login');
      return;
    }
    fetchPatients();
  }, [isAuthenticated, user, router]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/patients`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch patients');
      }

      const data = await response.json();
      setPatients(data.patients);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const searchPatient = async () => {
    if (!searchId.trim()) {
      fetchPatients();
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/patient/${searchId}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Patient not found');
      }

      const data = await response.json();
      setPatients([data.patient]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  const deletePatient = async (patientId: string) => {
    if (!confirm('Are you sure you want to delete this patient?')) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/patient/${patientId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete patient');
      }

      // Refresh the list
      fetchPatients();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete patient');
    }
  };

  if (loading && patients.length === 0) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#0b021e]">Patient Management</h1>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-[#0b021e]/10">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-grow">
              <label className="block text-sm font-medium text-[#0b021e] mb-1">Search by Patient ID</label>
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter patient ID"
                className="w-full px-4 py-2 border border-[#0b021e]/20 rounded-lg focus:ring-2 focus:ring-[#0b021e]/50 focus:border-[#0b021e]/50 text-[#0b021e]"
              />
            </div>
            <button 
              onClick={searchPatient}
              className="bg-[#0b021e] hover:bg-[#1a093a] text-white px-4 py-2 rounded-lg h-[42px] mt-auto transition-colors shadow-sm hover:shadow-md"
            >
              Search
            </button>
            <button 
              onClick={fetchPatients}
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
                  <th className="py-3 px-4 text-left text-sm font-semibold text-[#0b021e]">Patient ID</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-[#0b021e]">Name</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-[#0b021e]">Email</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-[#0b021e]">Phone</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-[#0b021e]">Gender</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-[#0b021e]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0b021e]/10">
                {patients.map((patient) => (
                  <tr key={patient.patientId} className="hover:bg-[#0b021e]/5">
                    <td className="py-3 px-4 text-sm text-[#0b021e]">{patient.patientId}</td>
                    <td className="py-3 px-4 text-sm text-[#0b021e]">
                      {patient.userDetails.firstName} {patient.userDetails.lastName}
                    </td>
                    <td className="py-3 px-4 text-sm text-[#0b021e]">{patient.userDetails.email}</td>
                    <td className="py-3 px-4 text-sm text-[#0b021e]">{patient.userDetails.phoneNumber}</td>
                    <td className="py-3 px-4 text-sm text-[#0b021e] capitalize">{patient.gender}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => deletePatient(patient.patientId)}
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
  
          {patients.length === 0 && !loading && (
            <div className="text-center py-8 text-[#0b021e]/50">
              No patients found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}