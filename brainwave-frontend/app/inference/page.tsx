"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import { fetchInferenceResults } from "@/utils/inference";

const InferencePage = () => {
  const [directoryPath, setDirectoryPath] = useState("");
  const [testPreds, setTestPreds] = useState<number[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // 👈 Add loading state

  const handleInference = async () => {
    setLoading(true); // 👈 Start loading
    setTestPreds(null);
    setError(null);

    try {
      const preds = await fetchInferenceResults(directoryPath);
      setTestPreds(preds);
    } catch (err) {
      setError("Error fetching inference results: " + err);
    } finally {
      setLoading(false); // 👈 Stop loading
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-center">EEG Model Inference</h1>
        <div className="mt-6 flex flex-col items-center">
          <input
            type="text"
            value={directoryPath}
            onChange={(e) => setDirectoryPath(e.target.value)}
            placeholder="Enter EEG data directory path"
            className="w-full max-w-lg p-2 border rounded-md"
          />
          <button
            onClick={handleInference}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md flex items-center"
            disabled={loading} // 👈 Disable button while loading
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
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
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Loading...
              </>
            ) : (
              "Run Inference"
            )}
          </button>

          {error && <p className="text-red-500 mt-4">{error}</p>}

          {testPreds && (
            <div className="mt-6 p-4 bg-white shadow-md rounded-md w-full max-w-lg">
              <h2 className="text-lg font-semibold text-black">Inference Predictions:</h2>
              <ul className="list-disc pl-5 text-black">
                {testPreds.map((pred, index) => (
                  <li key={index}>Prediction {index + 1}= {pred.toFixed(0)}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InferencePage;
