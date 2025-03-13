"use client";

import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { fetchInferenceResults } from "@/utils/inference";

const InferencePage = () => {
  const [directoryPath, setDirectoryPath] = useState<string>("");
  const [testPreds, setTestPreds] = useState<number[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleInference = async (): Promise<void> => {
    setLoading(true);
    setTestPreds(null);
    setError(null);

    try {
      const preds = await fetchInferenceResults(directoryPath);
      setTestPreds(preds);
    } catch (err) {
      setError(`Error fetching inference results: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">EEG Model Inference</h1>
          
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <div className="flex-grow">
                <label htmlFor="directory-input" className="block text-sm font-medium text-gray-700 mb-2">
                  EEG Data Directory
                </label>
                <input
                  id="directory-input"
                  type="text"
                  value={directoryPath}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDirectoryPath(e.target.value)}
                  placeholder="Enter EEG data directory path"
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                />
              </div>
              
              <button
                onClick={handleInference}
                disabled={loading || !directoryPath}
                className={`px-6 py-3 rounded-md text-white font-medium flex items-center justify-center min-w-32 transition-all ${
                  loading || !directoryPath
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Run Inference"
                )}
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                <p className="font-medium">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {testPreds && (
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                <h3 className="font-semibold text-lg mb-3 text-black">Inference Predictions:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {testPreds.map((pred, index) => (
                    <div key={index} className="bg-white p-3 rounded border border-gray-200 shadow-sm">
                      <span className="text-gray-500 text-sm">Prediction {index + 1}</span>
                      <div className="text-xl font-bold text-black">{pred === 1 ? "Poor" : "Good"}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InferencePage;