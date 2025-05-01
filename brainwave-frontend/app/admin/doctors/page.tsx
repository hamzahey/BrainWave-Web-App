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
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Doctor Management</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Input
              label="Search by Registration Number"
              value={searchReg}
              onChange={(e) => setSearchReg(e.target.value)}
              placeholder="Enter registration number"
              className="flex-grow text-black"
            />
            <Button onClick={searchDoctor} className="h-[42px] mt-auto">
              Search
            </Button>
            <Button onClick={fetchDoctors} className="h-[42px] mt-auto">
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
                  <th className="py-3 px-4 text-left">Reg. Number</th>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Specialization</th>
                  <th className="py-3 px-4 text-left">Department</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                {doctors.map((doctor) => (
                  <tr key={doctor.registrationNumber} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4">{doctor.registrationNumber}</td>
                    <td className="py-3 px-4">{getUserName(doctor)}</td>
                    <td className="py-3 px-4">{getUserEmail(doctor)}</td>
                    <td className="py-3 px-4">{doctor.specialization || 'N/A'}</td>
                    <td className="py-3 px-4">{doctor.department || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <Button
                       
                        onClick={() => deleteDoctor(doctor.registrationNumber)}
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

          {doctors.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              No doctors found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}