"use client";

import { useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { PatientResult, fetchInferenceResults } from "@/utils/inference";
import Navbar from "../components/Navbar";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function InferencePage() {
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<PatientResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

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

  const downloadPDF = async () => {
    if (!resultsRef.current) return;

    try {
      // Create a temporary container
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '-9999px';
      tempContainer.style.width = '800px';
      tempContainer.style.backgroundColor = 'white';
      tempContainer.style.padding = '20px';
      
      // Clone the content
      const content = resultsRef.current.cloneNode(true) as HTMLElement;
      
      // Convert Tailwind classes to standard colors
      const colorMap: { [key: string]: string } = {
        'bg-gray-50': 'background-color: #F9FAFB',
        'bg-[#0b021e]': 'background-color: #0b021e',
        'bg-[#120431]': 'background-color: #120431',
        'text-gray-500': 'color: #6B7280',
        'text-gray-700': 'color: #374151',
        'text-[#0b021e]': 'color: #0b021e',
        'text-green-600': 'color: #059669',
        'text-red-600': 'color: #DC2626',
        'border-gray-200': 'border-color: #E5E7EB',
        'border-gray-300': 'border-color: #D1D5DB',
      };

      // Apply color conversions
      const elements = content.getElementsByTagName('*');
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        if (!(element instanceof HTMLElement)) continue;
        
        const classList = element.classList;
        if (!classList || classList.length === 0) continue;

        let style = element.getAttribute('style') || '';
        
        Array.from(classList).forEach(cls => {
          if (colorMap[cls]) {
            style += colorMap[cls] + ';';
          }
        });
        
        if (style) {
          element.setAttribute('style', style);
        }
      }

      tempContainer.appendChild(content);
      document.body.appendChild(tempContainer);

      // Wait for the content to be rendered
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 800,
        height: tempContainer.scrollHeight,
        windowWidth: 800,
        windowHeight: tempContainer.scrollHeight,
        onclone: (clonedDoc) => {
          const style = clonedDoc.createElement('style');
          style.textContent = `
            body { 
              background: white;
              margin: 0;
              padding: 0;
            }
            * { 
              box-sizing: border-box;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            }
          `;
          clonedDoc.head.appendChild(style);
        }
      });

      // Clean up
      document.body.removeChild(tempContainer);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('eeg-analysis-report.pdf');
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError('Failed to generate PDF report. Please try again.');
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
              <div className="space-y-6" ref={resultsRef}>
                <div className="flex justify-between items-center border-b pb-2">
                  <h2 className="text-2xl font-bold text-[#0b021e]">
                    Analysis Results
                  </h2>
                  <button
                    onClick={downloadPDF}
                    className="px-4 py-2 bg-[#0b021e] text-white rounded-lg hover:bg-[#120431] transition-colors flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Download Report
                  </button>
                </div>
  
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