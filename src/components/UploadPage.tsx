import { useState, useCallback } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { 
  Upload, 
  FileSpreadsheet, 
  CheckCircle, 
  AlertCircle,
  File,
  ArrowLeft,
  ArrowRight
} from "lucide-react";

interface UploadPageProps {
  onNext: () => void;
  onBack: () => void;
}

interface FileData {
  name: string;
  size: number;
  type: string;
  preview?: any[];
}

export function UploadPage({ onNext, onBack }: UploadPageProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<FileData | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  }, []);

const handleFileUpload = async (file: File) => {
  if (file.type.includes('sheet') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("excel", file);

    try {
     const res = await fetch(
  import.meta.env.VITE_API_URL + "/api/upload-excel",
  {
    method: "POST",
    body: formData,
  }
);

      const data = await res.json();
      if (data.success) {
        setUploadedFile({
          name: file.name,
          size: file.size,
          type: file.type,
          preview: data.rows || []   // ✅ backend’den excel’den parse edilen satırları döndür
        });
      } else {
        alert("Yükleme hatası: " + data.message);
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Sunucuya bağlanılamadı ❌");
    } finally {
      setUploading(false);
      setUploadProgress(100);
    }
  }
};


  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="flex-1 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Progress Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-blue-600">Upload Excel</p>
                    <p className="text-sm text-gray-500">Current step</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 opacity-50">
                  <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Select Template</p>
                    <p className="text-sm text-gray-500">Next step</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 opacity-50">
                  <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Map Fields</p>
                    <p className="text-sm text-gray-500">Step 3</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 opacity-50">
                  <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold">4</span>
                  </div>
                  <div>
                    <p className="font-medium">Generate</p>
                    <p className="text-sm text-gray-500">Final step</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Upload Your Excel File
              </h1>
              <p className="text-gray-600">
                Upload your Excel file containing customer data and account information
              </p>
            </div>

            {!uploadedFile ? (
              <Card>
                <CardContent className="p-8">
                  {uploading ? (
                    <div className="text-center">
                      <FileSpreadsheet className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Uploading File...
                      </h3>
                      <Progress value={uploadProgress} className="w-full max-w-md mx-auto mb-2" />
                      <p className="text-sm text-gray-500">{uploadProgress}% complete</p>
                    </div>
                  ) : (
                    <div
                      className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                        dragActive 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Drag your Excel file here
                      </h3>
                      <p className="text-gray-600 mb-6">
                        or click to browse files
                      </p>
                      <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          Browse Files
                        </Button>
                      </label>
                      <p className="text-sm text-gray-500 mt-4">
                        Supported formats: .xlsx, .xls (Max 10MB)
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* File Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span>File Uploaded Successfully</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                      <FileSpreadsheet className="w-8 h-8 text-green-600" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(uploadedFile.size)} • Excel Spreadsheet
                        </p>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Ready
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Data Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Data Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-3 font-medium text-gray-900">Customer Name</th>
                            <th className="text-left p-3 font-medium text-gray-900">Balance</th>
                            <th className="text-left p-3 font-medium text-gray-900">Account</th>
                            <th className="text-left p-3 font-medium text-gray-900">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {uploadedFile.preview?.map((row, index) => (
                            <tr key={index} className="border-b hover:bg-gray-50">
                              <td className="p-3 text-gray-900">{row.CustomerName}</td>
                              <td className="p-3 text-gray-900">{row.Balance}</td>
                              <td className="p-3 text-gray-600">{row.Account}</td>
                              <td className="p-3 text-gray-600">{row.Date}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-blue-900">File Analysis Complete</p>
                          <p className="text-sm text-blue-700">
                            Found 5 records with 4 columns. All data appears to be valid and ready for processing.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={onBack} className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
              
              <Button 
                onClick={onNext} 
                disabled={!uploadedFile}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                <span>Next: Select Template</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
