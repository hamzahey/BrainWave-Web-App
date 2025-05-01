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
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Patient Management</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Input
              label="Search by Patient ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter patient ID"
              className="flex-grow text-black"
            />
            <Button onClick={searchPatient} className="h-[42px] mt-auto">
              Search
            </Button>
            <Button onClick={fetchPatients} className="h-[42px] mt-auto">
              Show All
            </Button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="py-3 px-4 text-left">Patient ID</th>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Phone</th>
                  <th className="py-3 px-4 text-left">Gender</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                {patients.map((patient) => (
                  <tr key={patient.patientId} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4">{patient.patientId}</td>
                    <td className="py-3 px-4">
                      {patient.userDetails.firstName} {patient.userDetails.lastName}
                    </td>
                    <td className="py-3 px-4">{patient.userDetails.email}</td>
                    <td className="py-3 px-4">{patient.userDetails.phoneNumber}</td>
                    <td className="py-3 px-4">{patient.gender}</td>
                    <td className="py-3 px-4">
                      <Button
                        onClick={() => deletePatient(patient.patientId)}
                        className="py-1 px-3 text-sm"
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {patients.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              No patients found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}