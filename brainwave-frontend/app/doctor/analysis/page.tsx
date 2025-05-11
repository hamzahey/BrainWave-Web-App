'use client';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Button from '../../components/Button';
import Input from '../../components/Input';

interface Analysis {
  _id: string;
  patientId: string;
  performedBy: {
    _id: string;
    role: string;
    firstName: string;
    lastName: string;
  };
  status: string;
  results: {
    patientId: string;
    classification: string;
    confidenceScore: number;
    cpcScore: number;
    analysisDate: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function DoctorAnalysisSearch() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [patientId, setPatientId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  // Show loading state when checking authentication
  if (authLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Redirect if not authenticated or not a doctor
  if (!authLoading && (!isAuthenticated || user?.role !== 'doctor')) {
    router.push('/auth/login');
    return null;
  }

  const searchPatientAnalyses = async () => {
    if (!patientId.trim()) {
      setError('Please enter a patient ID');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`http://localhost:5000/api/analysis/patient/${patientId}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('No analyses found for this patient');
      }

      const data = await response.json();
      setAnalyses(data.analyses || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setAnalyses([]);
    } finally {
      setLoading(false);
    }
  };

  const getClassificationColor = (classification: string) => {
    switch (classification.toLowerCase()) {
      case 'good':
        return 'text-green-600';
      case 'poor':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[#0b021e] mb-6">Patient Analysis Search</h1>
        
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-[#0b021e]/10">
          {/* Search Input */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-grow">
              <label className="block text-sm font-medium text-[#0b021e] mb-1">Patient ID</label>
              <input
                type="text"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                placeholder="Enter patient ID"
                className="w-full px-4 py-2 border border-[#0b021e]/20 rounded-lg focus:ring-2 focus:ring-[#0b021e]/50 focus:border-[#0b021e]/50 text-[#0b021e]"
              />
            </div>
            <button
              onClick={searchPatientAnalyses}
              disabled={loading}
              className="bg-[#0b021e] hover:bg-[#1a093a] text-white px-4 py-2 rounded-lg h-[42px] mt-auto transition-colors shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching...
                </span>
              ) : 'Search'}
            </button>
          </div>
  
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg border border-red-200">
              {error}
            </div>
          )}
  
          {/* Analysis Table */}
          <div className="overflow-x-auto rounded-lg border border-[#0b021e]/10">
            <table className="min-w-full">
              <thead className="bg-[#0b021e]/5">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-[#0b021e]">Patient ID</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-[#0b021e]">Performed By</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-[#0b021e]">Status</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-[#0b021e]">Classification</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-[#0b021e]">CPC Score</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-[#0b021e]">Confidence</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-[#0b021e]">Analysis Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0b021e]/10">
                {analyses.map((analysis) => (
                  <tr key={analysis._id} className="hover:bg-[#0b021e]/5">
                    <td className="py-3 px-4 text-sm text-[#0b021e] font-medium">{analysis.patientId}</td>
                    <td className="py-3 px-4 text-sm text-[#0b021e]">
                      <div>{`${analysis.performedBy.firstName} ${analysis.performedBy.lastName}`}</div>
                      <div className="text-xs text-[#0b021e]/70 mt-1">
                        {analysis.performedBy.role}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        analysis.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {analysis.status}
                      </span>
                    </td>
                    <td className={`py-3 px-4 text-sm font-medium ${getClassificationColor(analysis.results.classification)}`}>
                      {analysis.results.classification}
                    </td>
                    <td className="py-3 px-4 text-sm text-[#0b021e]">{analysis.results.cpcScore}</td>
                    <td className="py-3 px-4 text-sm text-[#0b021e]">{(analysis.results.confidenceScore * 100).toFixed(2)}%</td>
                    <td className="py-3 px-4 text-sm text-[#0b021e]">{formatDate(analysis.results.analysisDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
  
          {/* Empty State */}
          {analyses.length === 0 && !loading && !error && (
            <div className="text-center py-8 text-[#0b021e]/50">
              No analyses found for this patient.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}