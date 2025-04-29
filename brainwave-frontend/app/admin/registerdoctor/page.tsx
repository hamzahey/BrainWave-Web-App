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
    <div className="flex items-center justify-center min-h-screen bg-white py-8">
      <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-black">Register a Doctor</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-black border-b pb-2 mb-4">Personal Information</h2>
            
            <div className="mb-4 grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="text-black"
              />
              
              <Input
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="text-black"
              />
            </div>
            
            <div className="mb-4">
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="text-black"
              />
            </div>
            
            <div className="mb-4 grid grid-cols-2 gap-4">
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="text-black"
              />
              
              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="text-black"
              />
            </div>
            
            <div className="mb-4">
              <Input
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className="text-black"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-black border-b pb-2 mb-4">Professional Information</h2>
            
            <div className="mb-4">
              <Input
                label="Specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                required
                className="text-black"
              />
            </div>
            
            <div className="mb-4">
              <Input
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className="text-black"
              />
            </div>
            
            <div className="mb-4">
              <Input
                label="Registration Number"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
                required
                className="text-black"
              />
            </div>
            
            <div className="mb-4">
              <Input
                label="Hospital Name"
                name="hospitalName"
                value={formData.hospitalName}
                onChange={handleChange}
                required
                className="text-black"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-black text-sm font-bold mb-2">
                Qualifications (comma-separated)
              </label>
              <textarea
                name="qualifications"
                value={formData.qualifications}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                rows={3}
                placeholder="MBBS, MD, MS, etc."
              />
            </div>
            
            <div className="mb-4">
              <Input
                label="Years of Experience"
                type="number"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleChange}
                className="text-black"
              />
            </div>
          </div>
          
          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Registering Doctor...' : 'Register Doctor'}
          </Button>
        </form>
      </div>
    </div>
  );
}