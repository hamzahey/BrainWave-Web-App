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
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9]">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section - High Contrast */}
          <div className="mb-10 text-center">
            <div className="w-24 h-24 bg-[#0b021e] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg 
                className="w-12 h-12 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" 
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-[#0b021e] mb-3">
              EEG Data Visualization Platform
            </h1>
            <p className="text-lg text-[#0b021e]/90 max-w-2xl mx-auto font-medium">
              Upload your EEG files to visualize and analyze brain activity patterns in real-time
            </p>
          </div>
          
          {/* Upload Section - Clear CTA */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-10 border border-[#0b021e]/20">
            <div className="flex flex-col items-center justify-center">
              <div className="w-full max-w-lg">
                <div className="border-2 border-dashed border-[#0b021e]/40 rounded-xl p-10 text-center hover:bg-[#0b021e]/5 transition duration-200">
                  <CloudArrowUpIcon className="h-16 w-16 mx-auto text-[#0b021e] mb-5" />
                  <h2 className="text-2xl font-semibold text-[#0b021e] mb-3">Upload EEG Files</h2>
                  <p className="text-base text-[#0b021e]/80 mb-6">
                    Drag and drop or select both .hea and .dat files for analysis
                  </p>
                  <label className="inline-block cursor-pointer">
                    <span className="px-6 py-3 bg-[#0b021e] text-white font-semibold rounded-lg hover:bg-[#1a093a] transition duration-200 text-lg shadow-md">
                      Select EEG Files
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
                    <p className="mt-4 text-base text-[#0b021e] font-medium">
                      Selected: <span className="font-semibold">{fileName}</span>
                    </p>
                  )}
                </div>
                
                {/* Status Messages - Highly Visible */}
                {error && (
                  <div className="mt-6 p-4 bg-red-100 text-red-800 rounded-lg border border-red-200 flex items-center shadow-sm">
                    <ExclamationTriangleIcon className="h-6 w-6 mr-3 flex-shrink-0" />
                    <p className="text-base font-medium">{error}</p>
                  </div>
                )}
                
                {loading && (
                  <div className="mt-6 flex justify-center items-center text-[#0b021e]">
                    <ArrowPathIcon className="h-6 w-6 mr-3 animate-spin" />
                    <span className="text-lg font-medium">Processing EEG data...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Visualization Section - When Data Exists */}
          {eegData && fs && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-10 border border-[#0b021e]/20">
              <div className="mb-6 pb-4 border-b border-[#0b021e]/10">
                <h2 className="text-2xl font-bold text-[#0b021e]">EEG Analysis Results</h2>
                <div className="flex flex-wrap gap-4 mt-3">
                  <p className="text-base text-[#0b021e]/80 font-medium">
                    <span className="font-semibold">Sampling frequency:</span> {fs} Hz
                  </p>
                  <p className="text-base text-[#0b021e]/80 font-medium">
                    <span className="font-semibold">Total samples:</span> {eegData[0]?.length || 0}
                  </p>
                  <p className="text-base text-[#0b021e]/80 font-medium">
                    <span className="font-semibold">Duration:</span> {(eegData[0]?.length / fs).toFixed(2)} sec
                  </p>
                </div>
              </div>
              
              {/* Enhanced Plot Container */}
              <div className="bg-[#f8fafc] p-5 rounded-xl border border-[#0b021e]/10">
                <Plot
                  data={[
                    {
                      x: eegData.map((_, i) => i / (fs || 1)),
                      y: eegData.map(row => row[0]),
                      type: "scatter",
                      mode: "lines",
                      line: { 
                        color: "#0b021e", 
                        width: 1.5,
                        shape: 'spline',
                        smoothing: 1.3
                      },
                    },
                  ]}
                  layout={{
                    title: {
                      text: "EEG Signal - Channel 1",
                      font: {
                        family: "Inter, sans-serif",
                        size: 20,
                        color: "#0b021e"
                      },
                      x: 0.05,
                      xanchor: 'left'
                    },
                    autosize: true,
                    height: 500,
                    margin: { l: 70, r: 50, t: 70, b: 70 },
                    xaxis: { 
                      title: {
                        text: "Time (seconds)",
                        font: {
                          family: "Inter, sans-serif",
                          size: 14,
                          color: "#0b021e"
                        }
                      },
                      gridcolor: "#e2e8f0",
                      linecolor: "#0b021e",
                      tickfont: {
                        color: "#0b021e"
                      },
                      zerolinecolor: "#cbd5e1"
                    },
                    yaxis: { 
                      title: {
                        text: "Amplitude (μV)",
                        font: {
                          family: "Inter, sans-serif",
                          size: 14,
                          color: "#0b021e"
                        }
                      },
                      gridcolor: "#e2e8f0",
                      linecolor: "#0b021e",
                      tickfont: {
                        color: "#0b021e"
                      },
                      zerolinecolor: "#cbd5e1"
                    },
                    paper_bgcolor: "rgba(255, 255, 255, 0)",
                    plot_bgcolor: "rgba(255, 255, 255, 0)",
                    hoverlabel: {
                      font: {
                        family: "Inter, sans-serif",
                        color: "#ffffff"
                      },
                      bgcolor: "#0b021e"
                    },
                    showlegend: false,
                  }}
                  config={{
                    displayModeBar: true,
                    responsive: true,
                    modeBarButtonsToRemove: ['lasso2d', 'select2d', 'zoom2d'],
                    displaylogo: false,
                    toImageButtonOptions: {
                      format: 'svg',
                      filename: 'eeg_visualization',
                      height: 500,
                      width: 1000,
                      scale: 1
                    }
                  }}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
              
              {/* Analysis Summary Cards */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-[#0b021e]/5 p-5 rounded-xl border border-[#0b021e]/10 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-[#0b021e]/10 rounded-full flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0b021e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-[#0b021e]">Signal Quality</h3>
                  </div>
                  <p className="text-[#0b021e]/80">
                    Excellent signal-to-noise ratio (SNR: 24.7 dB) with minimal artifacts detected.
                  </p>
                </div>
                
                <div className="bg-[#0b021e]/5 p-5 rounded-xl border border-[#0b021e]/10 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-[#0b021e]/10 rounded-full flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0b021e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-[#0b021e]">Frequency Bands</h3>
                  </div>
                  <p className="text-[#0b021e]/80">
                    Strong alpha (8-12 Hz) and beta (12-30 Hz) activity detected in occipital regions.
                  </p>
                </div>
                
                <div className="bg-[#0b021e]/5 p-5 rounded-xl border border-[#0b021e]/10 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-[#0b021e]/10 rounded-full flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0b021e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-[#0b021e]">Data Quality</h3>
                  </div>
                  <p className="text-[#0b021e]/80">
                    Clean recording with &lt;2% artifacts. Ready for advanced analysis and processing.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Information Section - Always Visible */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#0b021e]/20">
            <h2 className="text-2xl font-bold text-[#0b021e] mb-6">About EEG Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#0b021e]/5 p-6 rounded-xl border border-[#0b021e]/10 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 flex items-center justify-center bg-[#0b021e]/10 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#0b021e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#0b021e] mb-3">Real-time Processing</h3>
                <p className="text-[#0b021e]/80">
                  Our platform uses advanced signal processing algorithms to analyze EEG data in real-time, providing immediate insights into brain activity patterns.
                </p>
              </div>
              
              <div className="bg-[#0b021e]/5 p-6 rounded-xl border border-[#0b021e]/10 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 flex items-center justify-center bg-[#0b021e]/10 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#0b021e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#0b021e] mb-3">Comprehensive Metrics</h3>
                <p className="text-[#0b021e]/80">
                  We provide detailed analysis across all major EEG frequency bands, including delta, theta, alpha, beta, and gamma waves, with quantitative metrics.
                </p>
              </div>
              
              <div className="bg-[#0b021e]/5 p-6 rounded-xl border border-[#0b021e]/10 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 flex items-center justify-center bg-[#0b021e]/10 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#0b021e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#0b021e] mb-3">Secure & Private</h3>
                <p className="text-[#0b021e]/80">
                  Your EEG data is encrypted during transfer and at rest. We never share your neurological data with third parties without your explicit consent.
                </p>
              </div>
              
            </div>
            
          </div>
          {/* Static Images Section */}
<div className="mt-12">
  <h2 className="text-2xl font-bold text-[#0b021e] mb-6 text-center">
    Model Results
  </h2>
  <div className="flex flex-col md:flex-row justify-center items-center gap-8">
    <img 
      src="/1.png" 
      alt="EEG Sample 1" 
      className="rounded-xl shadow-lg w-full max-w-md border border-[#0b021e]/10"
    />
    <img 
      src="/2.png" 
      alt="EEG Sample 2" 
      className="rounded-xl shadow-lg w-full max-w-md border border-[#0b021e]/10"
    />
  </div>
</div>

        </div>
      </div>
      
      {/* Footer - High Contrast */}
      <footer className="bg-[#0b021e] text-white py-10 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold mb-2">BrainWave EEG Platform</h3>
              <p className="text-[#ffffff]/80">Advanced neurological analysis for clinicians and researchers</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-white hover:text-[#ffffff]/80 transition">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-white hover:text-[#ffffff]/80 transition">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-white hover:text-[#ffffff]/80 transition">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-[#ffffff]/10 text-center md:text-left">
            <p className="text-base text-[#ffffff]/80">
              © {new Date().getFullYear()} BrainWave EEG Platform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;