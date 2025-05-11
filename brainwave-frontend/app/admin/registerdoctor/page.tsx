'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Button from '../../components/Button';
import Input from '../../components/Input';


export default function RegisterDoctor() {
  const [formData, setFormData] = useState({
    // User data
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    // Doctor specific data
    specialization: '',
    department: '',
    registrationNumber: '',
    qualifications: '',
    yearsOfExperience: '',
    hospitalName: ''
  });
  
  const [error, setError] = useState('');
  const { registerDoctor, loading, isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check if the user is authenticated and is an admin
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/auth/login');
      } else if (user?.role !== 'admin') {
        console.log(user?.role)
        router.push('/dashboard');
      }
    }
  }, [loading, isAuthenticated, user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Process qualifications to send as an array
      const qualificationsArray = formData.qualifications
        ? formData.qualifications.split(',').map(q => q.trim())
        : [];

      // Remove confirmPassword before sending to API
      const { confirmPassword, qualifications, ...doctorData } = formData;
      
      // Parse yearsOfExperience to number
      const doctorInput = {
        ...doctorData,
        qualifications: qualificationsArray,
        yearsOfExperience: formData.yearsOfExperience ? parseInt(formData.yearsOfExperience) : undefined
      };
      
      await registerDoctor(doctorInput);
      setError('');
      // Reset form or show success message
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        specialization: '',
        department: '',
        registrationNumber: '',
        qualifications: '',
        yearsOfExperience: '',
        hospitalName: ''
      });
      alert('Doctor registered successfully!');
    } catch (error) {
      setError((error as Error).message || 'Doctor registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f8f9fa] py-8">
      <div className="w-full max-w-2xl p-8 bg-white rounded-xl shadow-md border border-[#0b021e]/10">
        <h1 className="text-2xl font-bold text-center mb-6 text-[#0b021e]">Register a Doctor</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg border border-red-200">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* Personal Information Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-[#0b021e] border-b border-[#0b021e]/20 pb-2 mb-4">Personal Information</h2>
            
            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#0b021e] mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-[#0b021e]/20 rounded-lg focus:ring-2 focus:ring-[#0b021e]/50 focus:border-[#0b021e]/50 text-[#0b021e]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#0b021e] mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-[#0b021e]/20 rounded-lg focus:ring-2 focus:ring-[#0b021e]/50 focus:border-[#0b021e]/50 text-[#0b021e]"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#0b021e] mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-[#0b021e]/20 rounded-lg focus:ring-2 focus:ring-[#0b021e]/50 focus:border-[#0b021e]/50 text-[#0b021e]"
              />
            </div>
            
            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#0b021e] mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-[#0b021e]/20 rounded-lg focus:ring-2 focus:ring-[#0b021e]/50 focus:border-[#0b021e]/50 text-[#0b021e]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#0b021e] mb-1">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-[#0b021e]/20 rounded-lg focus:ring-2 focus:ring-[#0b021e]/50 focus:border-[#0b021e]/50 text-[#0b021e]"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#0b021e] mb-1">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-[#0b021e]/20 rounded-lg focus:ring-2 focus:ring-[#0b021e]/50 focus:border-[#0b021e]/50 text-[#0b021e]"
              />
            </div>
          </div>
          
          {/* Professional Information Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-[#0b021e] border-b border-[#0b021e]/20 pb-2 mb-4">Professional Information</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#0b021e] mb-1">Specialization</label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-[#0b021e]/20 rounded-lg focus:ring-2 focus:ring-[#0b021e]/50 focus:border-[#0b021e]/50 text-[#0b021e]"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#0b021e] mb-1">Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-[#0b021e]/20 rounded-lg focus:ring-2 focus:ring-[#0b021e]/50 focus:border-[#0b021e]/50 text-[#0b021e]"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#0b021e] mb-1">Registration Number</label>
              <input
                type="text"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-[#0b021e]/20 rounded-lg focus:ring-2 focus:ring-[#0b021e]/50 focus:border-[#0b021e]/50 text-[#0b021e]"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#0b021e] mb-1">Hospital Name</label>
              <input
                type="text"
                name="hospitalName"
                value={formData.hospitalName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-[#0b021e]/20 rounded-lg focus:ring-2 focus:ring-[#0b021e]/50 focus:border-[#0b021e]/50 text-[#0b021e]"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#0b021e] mb-1">
                Qualifications (comma-separated)
              </label>
              <textarea
                name="qualifications"
                value={formData.qualifications}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[#0b021e]/20 rounded-lg focus:ring-2 focus:ring-[#0b021e]/50 focus:border-[#0b021e]/50 text-[#0b021e]"
                rows={3}
                placeholder="MBBS, MD, MS, etc."
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#0b021e] mb-1">Years of Experience</label>
              <input
                type="number"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[#0b021e]/20 rounded-lg focus:ring-2 focus:ring-[#0b021e]/50 focus:border-[#0b021e]/50 text-[#0b021e]"
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0b021e] hover:bg-[#1a093a] text-white py-3 px-4 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registering Doctor...
              </span>
            ) : 'Register Doctor'}
          </button>
        </form>
      </div>
    </div>
  );
}