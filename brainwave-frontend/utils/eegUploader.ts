export async function uploadEEGFiles(files: FileList): Promise<{ fs: number; eegData: number[][] }> {
    const formData = new FormData();
    for (const file of files) {
      formData.append("files", file);
    }
  
    const response = await fetch("http://localhost:5001/upload", {
      method: "POST",
      body: formData,
    });
  
    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
  
    return { fs: data.fs, eegData: data.eeg_data };
}
  