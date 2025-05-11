'use client';
import Link from "next/link";

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
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-[#0b021e] mb-10 text-center">
          Analysis Results
        </h1>
  
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-800 rounded-xl">
            ❌ <span className="font-medium">Error:</span> {error}
          </div>
        )}
  
        {analyses.length === 0 ? (
          <div className="text-center py-16 text-gray-500 text-lg">
            No analysis data available.
          </div>
        ) : (
          <div className="space-y-8">
            {analyses.map((analysis) => (
              <div
                key={analysis._id}
                className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-shadow duration-300"
              >
                <p className="text-xl font-semibold text-[#0b021e] mb-3">
                  🧠 Patient ID: {analysis.patientId}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-gray-700 text-sm">
                  <p>
                    <span className="font-medium text-gray-500">Status:</span>{" "}
                    <span className="capitalize">{analysis.status}</span>
                  </p>
                  <p>
                    <span className="font-medium text-gray-500">Classification:</span>{" "}
                    <span
                      className={`font-semibold ${
                        analysis.results.classification === "Good"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {analysis.results.classification}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium text-gray-500">Confidence Score:</span>{" "}
                    <span className="text-[#0b021e] font-semibold">
                      {analysis.results.confidenceScore.toFixed(2)}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium text-gray-500">CPC Score:</span>{" "}
                    <span className="text-[#0b021e] font-semibold">
                      {analysis.results.cpcScore}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium text-gray-500">Analysis Date:</span>{" "}
                    {new Date(analysis.results.analysisDate).toLocaleString()}
                  </p>
                  <p>
                    <span className="font-medium text-gray-500">Performed By:</span>{" "}
                    {analysis.performedBy.firstName} {analysis.performedBy.lastName}{" "}
                    <span className="text-sm text-gray-400">({analysis.performedBy.role})</span>
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
