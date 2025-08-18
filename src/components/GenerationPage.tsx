import { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { 
  ArrowLeft,
  CheckCircle,
  Download,
  FileText,
  Clock,
  Users,
  Zap,
  RotateCcw,
  Archive
} from "lucide-react";

interface GenerationPageProps {
  onBack: () => void;
  onStartOver: () => void;
}

interface GenerationStats {
  totalDocuments: number;
  generated: number;
  timeElapsed: number;
  estimatedTimeRemaining: number;
  successRate: number;
}

export function GenerationPage({ onBack, onStartOver }: GenerationPageProps) {
  const [isGenerating, setIsGenerating] = useState(true);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState<GenerationStats>({
    totalDocuments: 25,
    generated: 0,
    timeElapsed: 0,
    estimatedTimeRemaining: 180,
    successRate: 100
  });

  useEffect(() => {
    if (!isGenerating) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(prev + 4, 100);
        
        setStats(prevStats => ({
          ...prevStats,
          generated: Math.floor((newProgress / 100) * prevStats.totalDocuments),
          timeElapsed: prevStats.timeElapsed + 1,
          estimatedTimeRemaining: Math.max(0, Math.floor(((100 - newProgress) / 100) * 180))
        }));

        if (newProgress >= 100) {
          setIsGenerating(false);
          clearInterval(interval);
        }

        return newProgress;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isGenerating]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isGenerating) {
    return (
      <div className="flex-1 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Generating Documents
            </h1>
            <p className="text-gray-600">
              Please wait while we generate your reconciliation letters
            </p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Processing Documents...
                </h2>
                <p className="text-gray-600">
                  {stats.generated} of {stats.totalDocuments} documents generated
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                    <span className="text-sm font-medium text-blue-600">{progress.toFixed(0)}%</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Clock className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Time Elapsed</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatTime(stats.timeElapsed)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Zap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Est. Time Remaining</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatTime(stats.estimatedTimeRemaining)}
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-blue-600" />
                      <span className="text-blue-900 font-medium">Success Rate</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      {stats.successRate}%
                    </Badge>
                  </div>
                  <p className="text-sm text-blue-700 mt-2">
                    All documents are being generated successfully without errors.
                  </p>
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
    <div className="flex-1 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Documents Generated Successfully!
          </h1>
          <p className="text-gray-600">
            All reconciliation letters have been created and are ready for download
          </p>
        </div>

        {/* Success Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Generation Complete
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <FileText className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-900">{stats.totalDocuments}</p>
                <p className="text-sm text-green-700">Documents Generated</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-900">{formatTime(stats.timeElapsed)}</p>
                <p className="text-sm text-blue-700">Total Time</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Zap className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-900">{stats.successRate}%</p>
                <p className="text-sm text-purple-700">Success Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Download Options */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Download Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Archive className="w-8 h-8 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-blue-900">Download All (ZIP Archive)</h3>
                    <p className="text-sm text-blue-700">
                      All {stats.totalDocuments} documents in a single ZIP file (2.4 MB)
                    </p>
                  </div>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Download className="w-4 h-4 mr-2" />
                  Download ZIP
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-gray-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Download Individual Files</h3>
                    <p className="text-sm text-gray-600">
                      Select and download specific documents one by one
                    </p>
                  </div>
                </div>
                <Button variant="outline">
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
            <CardTitle>Generated Files</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {[
                'ABC_Corp_Reconciliation_2024.pdf',
                'XYZ_Ltd_Reconciliation_2024.pdf',
                'Smith_Industries_Reconciliation_2024.pdf',
                'Johnson_Co_Reconciliation_2024.pdf',
                'Brown_Enterprises_Reconciliation_2024.pdf'
              ].map((filename, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-900">{filename}</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {stats.totalDocuments > 5 && (
                <div className="text-center p-3 text-sm text-gray-500">
                  And {stats.totalDocuments - 5} more files...
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-blue-600 text-sm font-semibold">1</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Review Generated Letters</p>
                  <p className="text-sm text-gray-600">
                    Download and review a few sample letters to ensure quality
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-blue-600 text-sm font-semibold">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Send to Customers</p>
                  <p className="text-sm text-gray-600">
                    Distribute the reconciliation letters via email or postal mail
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-blue-600 text-sm font-semibold">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Track Responses</p>
                  <p className="text-sm text-gray-600">
                    Monitor customer responses and follow up as needed
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={onStartOver}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <RotateCcw className="w-4 h-4" />
            Create New Reconciliation
          </Button>
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Mapping
          </Button>
        </div>
      </div>
    </div>
  );
}
