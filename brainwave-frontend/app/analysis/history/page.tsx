'use client';

import { useEffect, useState } from 'react';

interface PerformedBy {
  _id: string;
  role: string;
  firstName: string;
  lastName: string;
}

interface Results {
  patientId: string;
  classification: 'Good' | 'Poor';
  confidenceScore: number;
  cpcScore: number;
  analysisDate: string;
}

interface Analysis {
  _id: string;
  patientId: string;
  performedBy: PerformedBy;
  status: string;
  results: Results;
  createdAt: string;
  updatedAt: string;
}

export default function AnalysisPage() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/analysis/', {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch data');
        const data = await res.json();
        setAnalyses(data);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyses();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading analyses...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Analysis Results</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            Error: {error}
          </div>
        )}

        {analyses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No analysis data available.
          </div>
        ) : (
          <div className="space-y-6">
            {analyses.map((analysis) => (
              <div
                key={analysis._id}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <p className="text-lg font-semibold text-gray-800 mb-2">
                  Patient ID: {analysis.patientId}
                </p>
                <div className="text-gray-700 space-y-1">
                  <p>Status: <span className="capitalize">{analysis.status}</span></p>
                  <p>
                    Classification:{" "}
                    <span className={`font-semibold ${analysis.results.classification === 'Good' ? 'text-green-600' : 'text-red-600'}`}>
                      {analysis.results.classification}
                    </span>
                  </p>
                  <p>Confidence Score: {analysis.results.confidenceScore.toFixed(2)}</p>
                  <p>CPC Score: {analysis.results.cpcScore}</p>
                  <p>Analysis Date: {new Date(analysis.results.analysisDate).toLocaleString()}</p>
                  <p>
                    Performed By: {analysis.performedBy.firstName} {analysis.performedBy.lastName} ({analysis.performedBy.role})
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
