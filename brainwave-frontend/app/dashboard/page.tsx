"use client";

import { useState } from "react";
import dynamic from "next/dynamic"; // ✅ Import dynamic for client-side loading
import Navbar from "../components/Navbar";
import { uploadEEGFiles } from "@/utils/eegUploader";

// ✅ Dynamically import Plotly.js (disable SSR)
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

const Dashboard = () => {
  const [eegData, setEegData] = useState<number[][] | null>(null);
  const [fs, setFs] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length < 2) {
      setError("Please upload both .hea and .dat files.");
      return;
    }

    try {
      const { fs, eegData } = await uploadEEGFiles(files);
      setFs(fs);
      setEegData(eegData);
      setError(null);
    } catch (err) {
      setError("Failed to process EEG files.");
      console.error(err);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-center">EEG Data Visualization</h1>
        <div className="mt-6 flex flex-col items-center">
          <input type="file" accept=".hea,.dat" multiple onChange={handleFileUpload} className="mb-4" />
          {error && <p className="text-red-500">{error}</p>}
          {eegData && (
            <div className="w-full max-w-3xl bg-white shadow-md p-4 rounded-lg">
              <h2 className="text-lg font-semibold">EEG Graph</h2>
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
                  title: "EEG Signal",
                  xaxis: { title: "Time (seconds)" },
                  yaxis: { title: "Amplitude" },
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
