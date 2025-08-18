import { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { 
  CheckCircle,
  Download,
  FileText,
  Clock,
  Zap,
  RotateCcw,
  Archive,
  File
} from "lucide-react";

interface DownloadPageProps {
  onStartOver: () => void;
}

interface GenerationStats {
  totalDocuments: number;
  timeElapsed: number;
  successRate: number;
}

const generatedFiles = [
  'ABC_Şirketi_Mutabakat_2024.pdf',
  'XYZ_Ltd_Şti_Mutabakat_2024.pdf',
  'Ömer_Mühendislik_Mutabakat_2024.pdf',
  'Yılmaz_Ticaret_Mutabakat_2024.pdf',
  'Demir_İnşaat_Mutabakat_2024.pdf'
];

export function DownloadPage({ onStartOver }: DownloadPageProps) {
  const [isGenerating, setIsGenerating] = useState(true);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState<GenerationStats>({
    totalDocuments: 5,
    timeElapsed: 0,
    successRate: 100
  });

  useEffect(() => {
    if (!isGenerating) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(prev + 8, 100);
        
        setStats(prevStats => ({
          ...prevStats,
          timeElapsed: prevStats.timeElapsed + 1
        }));

        if (newProgress >= 100) {
          setIsGenerating(false);
          clearInterval(interval);
          setStats(prevStats => ({
            ...prevStats,
            timeElapsed: 23 // Final time: 2.3 seconds
          }));
        }

        return newProgress;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isGenerating]);

  const formatTime = (deciseconds: number) => {
    const seconds = deciseconds / 10;
    return `${seconds.toFixed(1)} saniye`;
  };

  if (isGenerating) {
    return (
      <div className="flex-1" style={{ backgroundColor: '#FAF7F0' }}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#3E2723' }}>
              Generating Documents
            </h1>
            <p style={{ color: '#8B7D6B' }}>
              Please wait while we generate your documents
            </p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div 
                  className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: '#98D8C8' }}
                >
                  <div 
                    className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin"
                    style={{ borderColor: '#228B22', borderTopColor: 'transparent' }}
                  ></div>
                </div>
                <h2 className="text-xl font-semibold mb-2" style={{ color: '#3E2723' }}>
                  Processing Documents...
                </h2>
                <p style={{ color: '#8B7D6B' }}>
                  {Math.floor((progress / 100) * stats.totalDocuments)} of {stats.totalDocuments} documents generated
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium" style={{ color: '#3E2723' }}>
                      Overall Progress
                    </span>
                    <span className="text-sm font-medium" style={{ color: '#228B22' }}>
                      {progress.toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={progress} className="h-3" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div 
                    className="text-center p-4 rounded-lg"
                    style={{ backgroundColor: '#F5DEB3' }}
                  >
                    <Clock className="w-8 h-8 mx-auto mb-2" style={{ color: '#8B4513' }} />
                    <p className="text-sm" style={{ color: '#8B4513' }}>
                      Time Elapsed
                    </p>
                    <p className="text-lg font-semibold" style={{ color: '#3E2723' }}>
                      {formatTime(stats.timeElapsed)}
                    </p>
                  </div>
                  <div 
                    className="text-center p-4 rounded-lg"
                    style={{ backgroundColor: '#98D8C8' }}
                  >
                    <Zap className="w-8 h-8 mx-auto mb-2" style={{ color: '#228B22' }} />
                    <p className="text-sm" style={{ color: '#3E2723' }}>
                      Success Rate
                    </p>
                    <p className="text-lg font-semibold" style={{ color: '#3E2723' }}>
                      {stats.successRate}%
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Completion state
  return (
    <div className="flex-1" style={{ backgroundColor: '#FAF7F0' }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: '#98D8C8' }}
          >
            <CheckCircle className="w-16 h-16" style={{ color: '#228B22' }} />
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#3E2723' }}>
            Documents Generated Successfully!
          </h1>
          <p style={{ color: '#8B7D6B' }}>
            All documents have been created and are ready for download
          </p>
        </div>

        {/* Success Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: '#3E2723' }}>
              <CheckCircle className="w-5 h-5" style={{ color: '#228B22' }} />
              Generation Complete
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div 
                className="text-center p-4 rounded-lg"
                style={{ backgroundColor: '#98D8C8' }}
              >
                <FileText className="w-8 h-8 mx-auto mb-2" style={{ color: '#228B22' }} />
                <p className="text-2xl font-bold" style={{ color: '#3E2723' }}>
                  {stats.totalDocuments}
                </p>
                <p className="text-sm" style={{ color: '#3E2723' }}>
                  Documents Generated
                </p>
              </div>
              <div 
                className="text-center p-4 rounded-lg"
                style={{ backgroundColor: '#F5DEB3' }}
              >
                <Clock className="w-8 h-8 mx-auto mb-2" style={{ color: '#8B4513' }} />
                <p className="text-2xl font-bold" style={{ color: '#3E2723' }}>
                  {formatTime(stats.timeElapsed)}
                </p>
                <p className="text-sm" style={{ color: '#3E2723' }}>
                  Total Time
                </p>
              </div>
              <div 
                className="text-center p-4 rounded-lg"
                style={{ backgroundColor: '#DAA520', color: '#8B4513' }}
              >
                <Zap className="w-8 h-8 mx-auto mb-2" />
                <p className="text-2xl font-bold" style={{ color: '#3E2723' }}>
                  {stats.successRate}%
                </p>
                <p className="text-sm" style={{ color: '#3E2723' }}>
                  Success Rate
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Download Options */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle style={{ color: '#3E2723' }}>Download Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div 
                className="flex items-center justify-between p-4 rounded-lg"
                style={{ backgroundColor: '#98D8C8' }}
              >
                <div className="flex items-center gap-3">
                  <Archive className="w-8 h-8" style={{ color: '#228B22' }} />
                  <div>
                    <h3 className="font-semibold" style={{ color: '#3E2723' }}>
                      Download All (ZIP Archive)
                    </h3>
                    <p className="text-sm" style={{ color: '#3E2723' }}>
                      All {stats.totalDocuments} documents in a single ZIP file (1.2 MB)
                    </p>
                  </div>
                </div>
              <Button 
  style={{ backgroundColor: '#228B22', color: 'white' }}
  onClick={() => window.open(`${import.meta.env.VITE_API_BASE_URL}/api/download-zip`, "_blank")}
>
  <Download className="w-4 h-4 mr-2" />
  Download ZIP
</Button>
              </div>

              <div 
                className="flex items-center justify-between p-4 rounded-lg"
                style={{ backgroundColor: '#F5DEB3' }}
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8" style={{ color: '#8B4513' }} />
                  <div>
                    <h3 className="font-semibold" style={{ color: '#8B4513' }}>
                      Download Individual Files
                    </h3>
                    <p className="text-sm" style={{ color: '#8B4513' }}>
                      Select and download specific documents one by one
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline"
                  style={{ borderColor: '#8B4513', color: '#8B4513' }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Browse Files
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* File List Preview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle style={{ color: '#3E2723' }}>Generated Files</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {generatedFiles.map((filename, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{ backgroundColor: '#FAF7F0' }}
                >
                  <div className="flex items-center gap-3">
                    <File className="w-5 h-5" style={{ color: '#8B7D6B' }} />
                    <span className="text-sm" style={{ color: '#3E2723' }}>
                      {filename}
                    </span>
                  </div>
                 <Button 
  variant="ghost" 
  size="sm"
  onClick={() => window.open(`${import.meta.env.VITE_API_BASE_URL}/api/download-file/${encodeURIComponent(filename)}`, "_blank")}
>
  <Download className="w-4 h-4" />
</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle style={{ color: '#3E2723' }}>What's Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center mt-0.5"
                  style={{ backgroundColor: '#98D8C8' }}
                >
                  <span className="text-sm font-semibold" style={{ color: '#3E2723' }}>
                    1
                  </span>
                </div>
                <div>
                  <p className="font-medium" style={{ color: '#3E2723' }}>
                    Review Generated Documents
                  </p>
                  <p className="text-sm" style={{ color: '#8B7D6B' }}>
                    Download and review a few sample documents to ensure quality
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center mt-0.5"
                  style={{ backgroundColor: '#98D8C8' }}
                >
                  <span className="text-sm font-semibold" style={{ color: '#3E2723' }}>
                    2
                  </span>
                </div>
                <div>
                  <p className="font-medium" style={{ color: '#3E2723' }}>
                    Send to Recipients
                  </p>
                  <p className="text-sm" style={{ color: '#8B7D6B' }}>
                    Distribute the reconciliation letters via email or postal mail
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center mt-0.5"
                  style={{ backgroundColor: '#98D8C8' }}
                >
                  <span className="text-sm font-semibold" style={{ color: '#3E2723' }}>
                    3
                  </span>
                </div>
                <div>
                  <p className="font-medium" style={{ color: '#3E2723' }}>
                    Track Responses
                  </p>
                  <p className="text-sm" style={{ color: '#8B7D6B' }}>
                    Monitor customer responses and follow up as needed
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-center">
          <Button 
            onClick={onStartOver}
            className="flex items-center gap-2"
            style={{ backgroundColor: '#DAA520', color: '#8B4513' }}
          >
            <RotateCcw className="w-4 h-4" />
            Create New Document
          </Button>
        </div>
      </div>
    </div>
  );
}
