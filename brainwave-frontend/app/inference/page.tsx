"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { PatientResult, fetchInferenceResults } from "@/utils/inference";
import Navbar from "../components/Navbar";

export default function InferencePage() {
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<PatientResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/zip': ['.zip']
    },
    multiple: false,
    maxSize: 500 * 1024 * 1024, // 500MB
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
      setError(null);
      setResults(null);
    }
  });

  const handleInference = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const results = await fetchInferenceResults(file);
      setResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process file");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            EEG Prognosis Prediction
          </h1>

          <div className="space-y-8">
            {/* File Upload Section */}
            <div className="space-y-4">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
                  ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}
                  ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <input {...getInputProps()} disabled={isLoading} />
                <div className="space-y-2">
                  <div className="text-gray-600">
                    {isDragActive ? (
                      "Drop ZIP file here"
                    ) : (
                      <>
                        <p>Drag & drop EEG data ZIP file here</p>
                        <p className="text-sm text-gray-500 mt-1">or click to browse</p>
                      </>
                    )}
                  </div>
                  {file && (
                    <p className="text-sm text-gray-600 mt-2">
                      Selected file: <span className="font-medium">{file.name}</span>
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={handleInference}
                disabled={isLoading || !file}
                className={`w-full py-3 rounded-xl font-medium transition-all
                  ${isLoading || !file
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"}
                  flex items-center justify-center gap-2`}
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin">🌀</span>
                    Analyzing EEG Data...
                  </>
                ) : (
                  "Start Analysis"
                )}
              </button>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                <h3 className="text-red-800 font-medium">Error</h3>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            )}

            {/* Results Display */}
            {results && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">Analysis Results</h2>
                <div className="space-y-4">
                  {results.map((patient, index) => (
                    <div 
                      key={patient.patient_id}
                      className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                    >
                      <h3 className="font-medium text-gray-800 mb-2">
                        Patient: {patient.patient_id}
                      </h3>
                      
                      {patient.error ? (
                        <div className="text-red-600 text-sm">
                          Error: {patient.error}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Prognosis:</span>
                            <span className={`ml-2 font-semibold ${
                              patient.outcome ? "text-green-600" : "text-red-600"
                            }`}>
                              {patient.outcome ? "Good Outcome" : "Poor Outcome"}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Confidence:</span>
                            <span className="ml-2 font-semibold text-gray-800">
                              {(patient.outcome_probability! * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">CPC Score:</span>
                            <span className="ml-2 font-semibold text-gray-800">
                              {patient.cpc}
                            </span>
                          </div>
                        </div>
                      )}
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
}