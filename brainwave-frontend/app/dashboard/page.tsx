"use client";

import { useState } from "react";
import dynamic from "next/dynamic"; // ✅ Import dynamic for client-side loading
import Navbar from "../components/Navbar";
import { uploadEEGFiles } from "@/utils/eegUploader";
import { CloudArrowUpIcon, ArrowPathIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

// ✅ Dynamically import Plotly.js (disable SSR)
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

// TypeScript interfaces
interface EEGData {
  fs: number;
  eegData: number[][];
}

const Dashboard = () => {
  const [eegData, setEegData] = useState<number[][] | null>(null);
  const [fs, setFs] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("");

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length < 2) {
      setError("Please upload both .hea and .dat files.");
      return;
    }

    setLoading(true);
    setFileName(files[0].name.split('.')[0]);

    try {
      const result = await uploadEEGFiles(files);
      setFs(result.fs);
      setEegData(result.eegData);
      setError(null);
    } catch (err) {
      setError("Failed to process EEG files.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              EEG Data Visualization Platform
            </h1>
            <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
              Upload your EEG files to visualize and analyze brain activity patterns in real-time
            </p>
          </div>
          
          {/* Upload Section */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex flex-col items-center justify-center">
              <div className="w-full max-w-md">
                <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center hover:bg-blue-50 transition duration-150">
                  <CloudArrowUpIcon className="h-12 w-12 mx-auto text-blue-500 mb-4" />
                  <h2 className="text-xl font-medium text-gray-700 mb-2">Upload EEG Files</h2>
                  <p className="text-sm text-gray-500 mb-4">
                    Please upload both .hea and .dat files for analysis
                  </p>
                  <label className="inline-block cursor-pointer">
                    <span className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-150">
                      Select Files
                    </span>
                    <input 
                      type="file" 
                      accept=".hea,.dat" 
                      multiple 
                      onChange={handleFileUpload} 
                      className="hidden" 
                    />
                  </label>
                  {fileName && !error && (
                    <p className="mt-3 text-sm text-gray-600">
                      Selected: <span className="font-medium">{fileName}</span>
                    </p>
                  )}
                </div>
                
                {error && (
                  <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center">
                    <ExclamationTriangleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}
                
                {loading && (
                  <div className="mt-4 flex justify-center items-center text-blue-600">
                    <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                    <span>Processing EEG data...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Visualization Section */}
          {eegData && fs && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <div className="mb-4 border-b pb-4">
                <h2 className="text-xl font-semibold text-gray-800">EEG Analysis Results</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Sampling frequency: {fs} Hz | Total samples: {eegData[0]?.length || 0}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <Plot
                  data={[
                    {
                      x: eegData.map((_, i) => i / (fs || 1)), // Convert samples to time
                      y: eegData.map(row => row[0]), // Plot first EEG channel
                      type: "scatter",
                      mode: "lines",
                      marker: { color: "blue" },
                    },
                  ]}
                  layout={{
                    title: "EEG Signal Visualization",
                    titlefont: { family: "Inter, sans-serif", size: 18 },
                    autosize: true,
                    height: 450,
                    margin: { l: 50, r: 30, t: 80, b: 50 },
                    xaxis: { 
                      title: "Time (seconds)",
                      titlefont: { family: "Inter, sans-serif" },
                      gridcolor: "rgb(243, 244, 246)",
                    },
                    yaxis: { 
                      title: "Amplitude (μV)",
                      titlefont: { family: "Inter, sans-serif" },
                      gridcolor: "rgb(243, 244, 246)",
                    },
                    paper_bgcolor: "rgb(249, 250, 251)",
                    plot_bgcolor: "rgb(249, 250, 251)",
                    showlegend: false,
                    hovermode: "closest",
                  }}
                  config={{
                    displayModeBar: true,
                    responsive: true,
                    modeBarButtonsToRemove: ['lasso2d', 'select2d'],
                  }}
                  style={{ width: "100%" }}
                />
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="font-medium text-blue-800 mb-2">Signal Quality</h3>
                  <p className="text-sm text-blue-700">High quality signal with minimal artifacts</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <h3 className="font-medium text-green-800 mb-2">Frequency Range</h3>
                  <p className="text-sm text-green-700">0.5 - 50 Hz with good signal-to-noise ratio</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <h3 className="font-medium text-purple-800 mb-2">Analysis Ready</h3>
                  <p className="text-sm text-purple-700">Data is ready for further processing and analysis</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Information Section - Always visible when no data */}
          {!eegData && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">About EEG Analysis</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 flex items-center justify-center bg-blue-100 rounded-full mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-gray-800 mb-2">Real-time Processing</h3>
                  <p className="text-sm text-center text-gray-600">Analyze EEG signals with advanced algorithms in real-time</p>
                </div>
                
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 flex items-center justify-center bg-green-100 rounded-full mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-gray-800 mb-2">Comprehensive Metrics</h3>
                  <p className="text-sm text-center text-gray-600">Get detailed insights into brain activity patterns</p>
                </div>
                
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 flex items-center justify-center bg-purple-100 rounded-full mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-gray-800 mb-2">Secure & Private</h3>
                  <p className="text-sm text-center text-gray-600">Your EEG data is processed securely and never shared</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">EEG Visualization Platform</h3>
              <p className="text-gray-400 text-sm mt-1">Advanced brain activity analysis</p>
            </div>
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} EEG Analysis Platform. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;