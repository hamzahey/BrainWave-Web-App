'use client';

import { useState, useEffect } from 'react';
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

export default function AdminAnalysisSearch() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [searchId, setSearchId] = useState('');
  const [searchType, setSearchType] = useState<'patient' | 'doctor'>('patient');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const fetchAllAnalyses = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/analysis/all', {
        credentials: 'include',
      });
      const data = await res.json();
      setAnalyses(data.analyses || []);
    } catch (err) {
      console.error('Failed to fetch analyses:', err);
      setError('Failed to load analyses');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all analyses on initial load
  useEffect(() => {
    fetchAllAnalyses();
  }, []);

  if (authLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!authLoading && (!isAuthenticated || user?.role !== 'admin')) {
    router.push('/auth/login');
    return null;
  }

  const searchAnalyses = async () => {
    if (!searchId.trim()) {
      setError('Please enter an ID to search');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const endpoint = searchType === 'patient'
        ? `http://localhost:5000/api/analysis/patient/${searchId}`
        : `http://localhost:5000/api/analysis/doctor/${searchId}`;

      const response = await fetch(endpoint, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`No analyses found for this ${searchType}`);
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

  const resetSearch = async () => {
    setSearchId('');
    setError('');
    await fetchAllAnalyses();
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
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Analysis Search</h1>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-grow">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search Type</label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    checked={searchType === 'patient'}
                    onChange={() => setSearchType('patient')}
                  />
                  <span className="ml-2 text-black">Patient ID</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    checked={searchType === 'doctor'}
                    onChange={() => setSearchType('doctor')}
                  />
                  <span className="ml-2 text-black">Doctor Registration Number</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Input
              label={searchType === 'patient' ? "Patient ID" : "Doctor Registration Number"}
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder={`Enter ${searchType} ID`}
              className="flex-grow text-black"
            />
            <Button
              onClick={searchAnalyses}
              className="h-[42px] mt-auto"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
            </Button>
            <Button
              onClick={resetSearch}
              className="h-[42px] mt-auto bg-gray-500 hover:bg-gray-600 text-white"
              disabled={loading}
            >
              Reset
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
              No analyses found. Please search by ID.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
