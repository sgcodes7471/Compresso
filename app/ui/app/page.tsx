"use client";

import { BACKEND_URL } from "@/lib/constants";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`/api/compress`); 
      const result = await res.json();
      if(result.status === 500)  throw new Error();
      if(result.status === 300)  redirect('/premium');
      const value = result.value;

      const response = await fetch(`${BACKEND_URL}/compress`, {
        method: "POST",
        body: formData,
      });

      if(!response.ok) throw new Error();

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `compressed_file_${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Upload a File</h2>
        <input type="file" onChange={handleFileChange} className="mb-4 w-full" />
        <button
          onClick={handleUpload}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
          disabled={!file || isUploading}
        >
          {isUploading ? "Uploading..." : "Upload and Download"}
        </button>
      </div>
    </div>
  );
}
