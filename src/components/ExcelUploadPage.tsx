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

interface ExcelUploadPageProps {
  onNext: () => void;
  onBack: () => void;
}

interface FileData {
  name: string;
  size: number;
  type: string;
  preview?: any[];
}

export function ExcelUploadPage({ onNext, onBack }: ExcelUploadPageProps) {
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

  const handleFileUpload = (file: File) => {
    if (file.type.includes('sheet') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv')) {
      setUploading(true);
      setUploadProgress(0);

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setUploading(false);
            
            // Mock file data with preview
            setUploadedFile({
              name: file.name,
              size: file.size,
              type: file.type,
              preview: [
                { "SÜTUN A": "ABC Şirketi", "SÜTUN B": "15,250.00", "SÜTUN C": "HSP001", "SÜTUN D": "15.01.2024" },
                { "SÜTUN A": "XYZ Ltd Şti", "SÜTUN B": "8,750.50", "SÜTUN C": "HSP002", "SÜTUN D": "16.01.2024" },
                { "SÜTUN A": "Ömer Mühendislik", "SÜTUN B": "22,100.75", "SÜTUN C": "HSP003", "SÜTUN D": "17.01.2024" },
                { "SÜTUN A": "Yılmaz Ticaret", "SÜTUN B": "5,675.25", "SÜTUN C": "HSP004", "SÜTUN D": "18.01.2024" },
                { "SÜTUN A": "Demir İnşaat", "SÜTUN B": "31,500.00", "SÜTUN C": "HSP005", "SÜTUN D": "19.01.2024" }
              ]
            });
            return 100;
          }
          return prev + 20;
        });
      }, 400);
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
    <div className="flex-1" style={{ backgroundColor: '#FAF7F0' }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#3E2723' }}>
            Upload Your Excel File
          </h1>
          <p style={{ color: '#8B7D6B' }}>
            Upload your Excel file containing the data to be merged
          </p>
        </div>

        {!uploadedFile ? (
          <Card className="mb-6">
            <CardContent className="p-8">
              {uploading ? (
                <div className="text-center">
                  <FileSpreadsheet className="w-16 h-16 mx-auto mb-4" style={{ color: '#228B22' }} />
                  <h3 className="text-lg font-semibold mb-2" style={{ color: '#3E2723' }}>
                    Uploading File...
                  </h3>
                  <Progress 
                    value={uploadProgress} 
                    className="w-full max-w-md mx-auto mb-2"
                  />
                  <p className="text-sm" style={{ color: '#8B7D6B' }}>
                    {uploadProgress}% complete
                  </p>
                </div>
              ) : (
                <div
                  className={`border-3 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                    dragActive 
                      ? 'border-[#228B22] bg-[#98D8C8]' 
                      : 'border-[#87A96B] hover:border-[#228B22] hover:bg-[#98D8C8]'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="mb-6">
                    <div 
                      className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
                      style={{ backgroundColor: '#DAA520' }}
                    >
                      <Upload className="w-10 h-10 text-white" />
                    </div>
                    <span className="text-6xl">📊</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: '#3E2723' }}>
                    Drag your Excel file here
                  </h3>
                  <p className="mb-6" style={{ color: '#8B7D6B' }}>
                    or click to browse files
                  </p>
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button 
                      className="mb-4"
                      style={{ backgroundColor: '#228B22', color: 'white' }}
                    >
                      Browse Files
                    </Button>
                  </label>
                  <p className="text-sm" style={{ color: '#8B7D6B' }}>
                    Supported formats: .xlsx, .xls, .csv (Max 10MB)
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* File Info */}
            <Card 
              style={{ 
                backgroundColor: '#98D8C8',
                borderColor: '#228B22'
              }}
            >
              <CardHeader>
                <CardTitle className="flex items-center space-x-2" style={{ color: '#3E2723' }}>
                  <CheckCircle className="w-5 h-5" style={{ color: '#228B22' }} />
                  <span>File Uploaded Successfully</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="flex items-center space-x-4 p-4 rounded-lg"
                  style={{ backgroundColor: 'white' }}
                >
                  <FileSpreadsheet className="w-8 h-8" style={{ color: '#228B22' }} />
                  <div className="flex-1">
                    <p className="font-medium" style={{ color: '#3E2723' }}>
                      {uploadedFile.name}
                    </p>
                    <p className="text-sm" style={{ color: '#8B7D6B' }}>
                      {formatFileSize(uploadedFile.size)} • Excel Spreadsheet
                    </p>
                  </div>
                  <Badge 
                    style={{ 
                      backgroundColor: '#228B22',
                      color: 'white'
                    }}
                  >
                    Ready
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Data Preview */}
            <Card>
              <CardHeader>
                <CardTitle style={{ color: '#3E2723' }}>Data Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr style={{ backgroundColor: '#228B22' }}>
                        {Object.keys(uploadedFile.preview?.[0] || {}).map((header) => (
                          <th 
                            key={header}
                            className="text-left p-3 font-medium text-white"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {uploadedFile.preview?.map((row, index) => (
                        <tr 
                          key={index} 
                          className="hover:opacity-80 transition-opacity"
                          style={{ 
                            backgroundColor: index % 2 === 0 ? 'white' : '#FAF7F0'
                          }}
                        >
                          {Object.values(row).map((value, cellIndex) => (
                            <td 
                              key={cellIndex}
                              className="p-3"
                              style={{ 
                                color: '#3E2723',
                                borderBottom: '1px solid #F5DEB3'
                              }}
                            >
                              {value as string}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div 
                  className="mt-4 p-4 rounded-lg"
                  style={{ backgroundColor: '#98D8C8' }}
                >
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 mt-0.5" style={{ color: '#228B22' }} />
                    <div>
                      <p className="font-medium" style={{ color: '#3E2723' }}>
                        File Analysis Complete
                      </p>
                      <p className="text-sm" style={{ color: '#3E2723' }}>
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
          <Button 
            variant="outline" 
            onClick={onBack} 
            className="flex items-center space-x-2"
            style={{ borderColor: '#8B4513', color: '#8B4513' }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Geri</span>
          </Button>
          
          <Button 
            onClick={onNext} 
            disabled={!uploadedFile}
            className="flex items-center space-x-2"
            style={{ 
              backgroundColor: uploadedFile ? '#228B22' : '#8B7D6B',
              color: 'white'
            }}
          >
            <span>Sonraki Adım</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
