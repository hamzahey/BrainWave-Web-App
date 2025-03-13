export async function fetchInferenceResults(directoryPath: string) {
    const response = await fetch("http://localhost:5001/infer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ directory_path: directoryPath }),
    });
  
    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    
    return data.test_preds;
  }
  