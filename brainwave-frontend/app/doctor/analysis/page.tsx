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
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Patient Analysis Search</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Input
              label="Patient ID"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              placeholder="Enter patient ID"
              className="flex-grow text-black"
            />
            <Button 
              onClick={searchPatientAnalyses} 
              className="h-[42px] mt-auto"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
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
                  <th className="py-3 px-4 text-left">Performed By</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Classification</th>
                  <th className="py-3 px-4 text-left">CPC Score</th>
                  <th className="py-3 px-4 text-left">Confidence</th>
                  <th className="py-3 px-4 text-left">Analysis Date</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                {analyses.map((analysis) => (
                  <tr key={analysis._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4">{analysis.patientId}</td>
                    <td className="py-3 px-4">
                      {`${analysis.performedBy.firstName} ${analysis.performedBy.lastName}`}
                      <span className="block text-xs text-gray-500">
                        {analysis.performedBy.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded ${
                        analysis.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {analysis.status}
                      </span>
                    </td>
                    <td className={`py-3 px-4 font-medium ${getClassificationColor(analysis.results.classification)}`}>
                      {analysis.results.classification}
                    </td>
                    <td className="py-3 px-4">{analysis.results.cpcScore}</td>
                    <td className="py-3 px-4">{(analysis.results.confidenceScore * 100).toFixed(2)}%</td>
                    <td className="py-3 px-4">{formatDate(analysis.results.analysisDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {analyses.length === 0 && !loading && !error && (
            <div className="text-center py-8 text-gray-500">
              No analyses found for this patient.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}