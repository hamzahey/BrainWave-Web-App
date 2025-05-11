
'use client';

import { useEffect ,useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '../../components/Button';
import Input from '../../components/Input';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: 'male', // Default value
    patientId: '',
  });
  const [error, setError] = useState('');
  const { register, loading, isAuthenticated } = useAuth();
  const router = useRouter()

  useEffect(()=>{
    if(!loading && isAuthenticated){
      router.push('/dashboard')
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
    } catch (error) {
      setError((error as Error).message || 'Registration failed');
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0b021e]/5 to-[#0b021e]/10 py-8 px-4">
      <div className="w-full max-w-2xl p-8 bg-white rounded-2xl shadow-xl border border-[#0b021e]/10">
        {/* Header */}
        <div className="text-center mb-8">
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
          <h1 className="text-3xl font-bold text-[#0b021e]">Create Your Account</h1>
          <p className="text-[#0b021e]/70 mt-2">Join BrainWave to access neurological insights</p>
        </div>
  
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 flex items-start">
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
  
        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="py-3 border-[#0b021e]/20 focus:border-[#0b021e]/50 focus:ring-2 focus:ring-[#0b021e]/20 text-[#0b021e]"
              labelClassName="text-[#0b021e]/80 font-medium"
            />
            
            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="py-3 border-[#0b021e]/20 focus:border-[#0b021e]/50 focus:ring-2 focus:ring-[#0b021e]/20 text-[#0b021e]"
              labelClassName="text-[#0b021e]/80 font-medium"
            />
  
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="py-3 border-[#0b021e]/20 focus:border-[#0b021e]/50 focus:ring-2 focus:ring-[#0b021e]/20 text-[#0b021e]"
              labelClassName="text-[#0b021e]/80 font-medium"
            />
  
            <Input
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className="py-3 border-[#0b021e]/20 focus:border-[#0b021e]/50 focus:ring-2 focus:ring-[#0b021e]/20 text-[#0b021e]"
              labelClassName="text-[#0b021e]/80 font-medium"
            />
  
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="py-3 border-[#0b021e]/20 focus:border-[#0b021e]/50 focus:ring-2 focus:ring-[#0b021e]/20 text-[#0b021e]"
              labelClassName="text-[#0b021e]/80 font-medium"
            />
  
            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="py-3 border-[#0b021e]/20 focus:border-[#0b021e]/50 focus:ring-2 focus:ring-[#0b021e]/20 text-[#0b021e]"
              labelClassName="text-[#0b021e]/80 font-medium"
            />
  
            <Input
              label="Date of Birth"
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
              className="py-3 border-[#0b021e]/20 focus:border-[#0b021e]/50 focus:ring-2 focus:ring-[#0b021e]/20 text-[#0b021e]"
              labelClassName="text-[#0b021e]/80 font-medium"
            />
  
            <div className="space-y-2">
              <label className="text-[#0b021e]/80 font-medium block">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#0b021e]/20 rounded-xl focus:border-[#0b021e]/50 focus:ring-2 focus:ring-[#0b021e]/20 text-[#0b021e]"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
  
            <Input
              label="Patient ID"
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              required
              className="py-3 border-[#0b021e]/20 focus:border-[#0b021e]/50 focus:ring-2 focus:ring-[#0b021e]/20 text-[#0b021e]"
              labelClassName="text-[#0b021e]/80 font-medium"
            />
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
                Creating Account...
              </>
            ) : 'Register Now'}
          </Button>
        </form>
  
        <div className="mt-6 text-center">
          <p className="text-[#0b021e]/70">
            Already have an account?{' '}
            <Link 
              href="/auth/login" 
              className="text-[#0b021e] font-medium hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
