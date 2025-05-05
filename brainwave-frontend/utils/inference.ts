export interface PatientResult {
  patient_id: string;
  outcome?: number;
  outcome_probability?: number;
  cpc?: number;
  error?: string;
}

  
export async function fetchInferenceResults(file: File): Promise<PatientResult[]> {
  const formData = new FormData();
  formData.append("file", file );

  try {
    const response = await fetch("http://localhost:5001/predict", {
      method: "POST",
      body: formData,
    });

    if(!response.ok){
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.patients || !Array.isArray(data.patients)) {
      throw new Error("Invalid response format from server");
    }

    const formattedResults = data.patients.map((patient: any) => ({
      patient_id: patient.patient_id.toString(),
      outcome: patient.outcome !== undefined ? Number(patient.outcome) : undefined,
      outcome_probability: patient.outcome_probability !== undefined ? Number(patient.outcome_probability) : undefined,
      cpc: patient.cpc !== undefined ? Number(patient.cpc) : undefined,
      error: patient.error || undefined,
    }));

    const analysisResponse = await fetch('http://localhost:5000/api/analysis/save', {
      method: "POST",
      headers: {
          'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ patients: formattedResults }), // Wrap in patients object
  });

    if (!analysisResponse.ok) {
      const error = await analysisResponse.json();
      throw new Error(error.message || 'Failed to save analysis');
    }    

    return formattedResults;

  } catch (error) {
    if (error instanceof Error){
      throw new Error(`prediction Failed: ${error.message}`);
    }
    throw new Error("Unknown error occurred during prediction");
  }
}