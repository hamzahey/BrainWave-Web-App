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
    // maxSize: 500 * 1024 * 1024, // 500MB
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-white shadow-2xl rounded-2xl p-8 border border-gray-100">
          <h1 className="text-4xl font-extrabold text-[#0b021e] text-center mb-10">
            EEG Prognosis Prediction
          </h1>
  
          <div className="space-y-10">
            {/* File Upload Section */}
            <div className="space-y-6">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-200 cursor-pointer
                  ${
                    isDragActive
                      ? "border-[#0b021e] bg-[#0b021e0d]" // Slight tint
                      : "border-gray-300 hover:border-[#0b021e]"
                  }
                  ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <input {...getInputProps()} disabled={isLoading} />
                <div className="text-gray-600">
                  {isDragActive ? (
                    <p className="font-medium text-[#0b021e]">Drop ZIP file here</p>
                  ) : (
                    <>
                      <p className="text-lg font-medium">Drag & drop EEG data ZIP file here</p>
                      <p className="text-sm text-gray-500 mt-1">or click to browse</p>
                    </>
                  )}
                </div>
                {file && (
                  <p className="text-sm text-gray-700 mt-3">
                    Selected file:{" "}
                    <span className="font-semibold text-[#0b021e]">{file.name}</span>
                  </p>
                )}
              </div>
  
              <button
                onClick={handleInference}
                disabled={isLoading || !file}
                className={`w-full py-3 text-lg rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-3
                  ${
                    isLoading || !file
                      ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                      : "bg-[#0b021e] hover:bg-[#120431] text-white shadow-md"
                  }`}
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
              <div className="bg-red-100 border border-red-300 text-red-800 px-6 py-4 rounded-xl">
                <h3 className="font-semibold text-lg">⚠️ Error</h3>
                <p className="text-sm mt-1">{error}</p>
              </div>
            )}
  
            {/* Results Display */}
            {results && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-[#0b021e] border-b pb-2">
                  Analysis Results
                </h2>
  
                <div className="space-y-5">
                  {results.map((patient, index) => (
                    <div
                      key={patient.patient_id}
                      className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm"
                    >
                      <h3 className="text-lg font-semibold text-[#0b021e] mb-3">
                        Patient: {patient.patient_id}
                      </h3>
  
                      {patient.error ? (
                        <p className="text-sm text-red-600 font-medium">
                          Error: {patient.error}
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Prognosis:</span>
                            <span
                              className={`ml-2 font-semibold ${
                                patient.outcome
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {patient.outcome ? "Good Outcome" : "Poor Outcome"}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Confidence:</span>
                            <span className="ml-2 font-semibold text-[#0b021e]">
                              {(patient.outcome_probability! * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">CPC Score:</span>
                            <span className="ml-2 font-semibold text-[#0b021e]">
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