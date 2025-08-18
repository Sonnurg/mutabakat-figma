import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import API_BASE_URL from "../config";

interface ExcelUploadPageProps {
  onNext: (data: ExcelData) => void;
  onBack: () => void;
}

interface ExcelData {
  fileId: string;
  filename: string;
  headers: string[];
  rowCount: number;
  preview: any[];
}

export function ExcelUploadPage({ onNext, onBack }: ExcelUploadPageProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [uploadedData, setUploadedData] = useState<ExcelData | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Dosya tipi kontrolü
    const allowedTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'text/csv'];
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/i)) {
      setErrorMessage('Lütfen sadece Excel dosyaları (.xlsx, .xls, .csv) yükleyin.');
      setUploadStatus('error');
      return;
    }

    // Dosya boyutu kontrolü (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Dosya boyutu 10MB\'dan küçük olmalıdır.');
      setUploadStatus('error');
      return;
    }

    setIsUploading(true);
    setUploadStatus('idle');
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('excel', file);

  
const response = await fetch(`${API_BASE_URL}/api/upload-excel`, {
  method: "POST",
  body: formData,
});

      const result = await response.json();

      if (result.success) {
        const excelData: ExcelData = {
          fileId: result.data.fileId,
          filename: result.data.filename,
          headers: result.data.headers,
          rowCount: result.data.rowCount,
          preview: result.data.preview
        };

        setUploadedData(excelData);
        setUploadStatus('success');
        console.log('Excel yükleme başarılı:', excelData);
      } else {
        setErrorMessage(result.error || 'Dosya yükleme başarısız');
        setUploadStatus('error');
      }
    } catch (error) {
      console.error('Upload hatası:', error);
      setErrorMessage('Sunucu bağlantı hatası. Backend çalışıyor mu?');
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleContinue = () => {
    if (uploadedData) {
      onNext(uploadedData);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center min-h-[80vh] bg-[#FAF7F0] p-6">
      <div className="max-w-2xl mx-auto w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#3E2723] mb-4">
            Excel Dosyanızı Yükleyin
          </h1>
          <p className="text-lg text-[#8B7D6B]">
            Mutabakat mektubu oluşturmak için Excel dosyanızı seçin
          </p>
        </div>

        {/* Upload Area */}
        <div className="mb-8">
          <div
            className={`
              border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200
              ${isDragOver 
                ? 'border-[#228B22] bg-[#98D8C8] bg-opacity-20' 
                : uploadStatus === 'success'
                ? 'border-[#228B22] bg-[#98D8C8] bg-opacity-10'
                : uploadStatus === 'error'
                ? 'border-red-400 bg-red-50'
                : 'border-[#8B4513] bg-white hover:border-[#228B22] hover:bg-[#F5DEB3] hover:bg-opacity-30'
              }
              cursor-pointer
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileSelect}
              className="hidden"
            />

            {isUploading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#228B22] mb-4"></div>
                <p className="text-[#3E2723] font-medium">Dosya yükleniyor...</p>
              </div>
            ) : uploadStatus === 'success' ? (
              <div className="flex flex-col items-center text-[#228B22]">
                <CheckCircle className="w-16 h-16 mb-4" />
                <p className="text-xl font-semibold mb-2">Başarılı!</p>
                <p className="text-[#3E2723]">{uploadedData?.filename}</p>
              </div>
            ) : uploadStatus === 'error' ? (
              <div className="flex flex-col items-center text-red-600">
                <AlertCircle className="w-16 h-16 mb-4" />
                <p className="text-xl font-semibold mb-2">Hata!</p>
                <p className="text-red-700">{errorMessage}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center text-[#8B7D6B]">
                <Upload className="w-16 h-16 mb-4 text-[#DAA520]" />
                <p className="text-xl font-semibold text-[#3E2723] mb-2">
                  Excel dosyanızı buraya sürükleyin
                </p>
                <p className="text-lg mb-4">veya</p>
                <button className="bg-[#228B22] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#1a6b1a] transition-colors">
                  Dosya Seç
                </button>
              </div>
            )}
          </div>

          <p className="text-center text-sm text-[#8B7D6B] mt-4">
            Desteklenen formatlar: .xlsx, .xls, .csv (Max 10MB)
          </p>
        </div>

        {/* Data Preview */}
        {uploadedData && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E5E7EB] mb-8">
            <h3 className="text-lg font-semibold text-[#3E2723] mb-4">Veri Önizlemesi</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-[#F5DEB3] bg-opacity-30 p-3 rounded-lg">
                <p className="text-sm text-[#8B7D6B]">Toplam Satır</p>
                <p className="text-xl font-bold text-[#3E2723]">{uploadedData.rowCount}</p>
              </div>
              <div className="bg-[#F5DEB3] bg-opacity-30 p-3 rounded-lg">
                <p className="text-sm text-[#8B7D6B]">Sütun Sayısı</p>
                <p className="text-xl font-bold text-[#3E2723]">{uploadedData.headers.length}</p>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-[#3E2723] mb-2">Sütun Başlıkları:</h4>
              <div className="flex flex-wrap gap-2">
                {uploadedData.headers.map((header, index) => (
                  <span 
                    key={index}
                    className="bg-[#87A96B] text-white px-3 py-1 rounded-full text-sm"
                  >
                    {header}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-[#3E2723] mb-2">İlk 3 Satır Önizlemesi:</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#F5DEB3] bg-opacity-50">
                      {uploadedData.headers.map((header, index) => (
                        <th key={index} className="text-left p-2 font-medium text-[#3E2723]">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {uploadedData.preview.slice(0, 3).map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-b border-[#E5E7EB]">
                        {uploadedData.headers.map((header, colIndex) => (
                          <td key={colIndex} className="p-2 text-[#3E2723]">
                            {String(row[header] || '')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            onClick={onBack}
            className="bg-[#F5DEB3] text-[#8B4513] px-6 py-3 rounded-lg font-medium hover:bg-[#DAA520] hover:text-white transition-colors"
          >
            Geri
          </button>
          
          {uploadedData && (
            <button
              onClick={handleContinue}
              className="bg-[#228B22] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#1a6b1a] transition-colors"
            >
              Devam Et
            </button>
          )}
        </div>
      </div>
    </div>
  );
}