import { useState } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { 
  Plus, 
  Calendar, 
  Building, 
  MapPin, 
  ArrowLeft,
  ArrowRight
} from "lucide-react";

interface CustomTextEditorPageProps {
  onNext: () => void;
  onBack: () => void;
}

const excelColumns = [
  { id: 'col1', name: 'SÜTUN A', sample: 'Müşteri Adı' },
  { id: 'col2', name: 'SÜTUN B', sample: 'Bakiye' },
  { id: 'col3', name: 'SÜTUN C', sample: 'Hesap No' },
  { id: 'col4', name: 'SÜTUN D', sample: 'Tarih' }
];

const staticOptions = [
  { id: 'company', name: 'Şirket Adı', icon: Building, placeholder: '{{COMPANY_NAME}}' },
  { id: 'today', name: 'Bugünün Tarihi', icon: Calendar, placeholder: '{{TODAY_DATE}}' },
  { id: 'address', name: 'Adres', icon: MapPin, placeholder: '{{ADDRESS}}' }
];

export function CustomTextEditorPage({ onNext, onBack }: CustomTextEditorPageProps) {
  const [customText, setCustomText] = useState(`Sayın {{SÜTUN A}},

{{TODAY_DATE}} tarihi itibariyle hesabınızın bakiyesi {{SÜTUN B}} TL'dir.

Herhangi bir sorunuz olması durumunda bizimle iletişime geçebilirsiniz.

Saygılarımızla,
{{COMPANY_NAME}}`);

  const insertPlaceholder = (placeholder: string) => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newText = customText.substring(0, start) + placeholder + customText.substring(end);
      setCustomText(newText);
      
      // Set cursor position after the inserted text
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + placeholder.length, start + placeholder.length);
      }, 0);
    }
  };

  return (
    <div className="flex-1" style={{ backgroundColor: '#FAF7F0' }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#3E2723' }}>
            Create Your Custom Text
          </h1>
          <p style={{ color: '#8B7D6B' }}>
            Write your text and insert Excel column placeholders where needed
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Data Sources Panel */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Excel Columns */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2" style={{ color: '#3E2723' }}>
                    📊 Available Excel Data
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {excelColumns.map((column) => (
                    <div
                      key={column.id}
                      className="flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors hover:opacity-80"
                      style={{ backgroundColor: '#87A96B' }}
                      onClick={() => insertPlaceholder(`{{${column.name}}}`)}
                    >
                      <div>
                        <div className="font-medium text-white">{column.name}</div>
                        <div className="text-sm text-white/80">{column.sample}</div>
                      </div>
                      <Plus className="w-4 h-4 text-white" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Static Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2" style={{ color: '#3E2723' }}>
                    🏢 Static Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {staticOptions.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors hover:opacity-80"
                      style={{ backgroundColor: '#DAA520', color: '#8B4513' }}
                      onClick={() => insertPlaceholder(option.placeholder)}
                    >
                      <div className="flex items-center gap-2">
                        <option.icon className="w-4 h-4" />
                        <span className="font-medium">{option.name}</span>
                      </div>
                      <Plus className="w-4 h-4" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Text Editor Panel */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle style={{ color: '#3E2723' }}>Text Editor</CardTitle>
                <p className="text-sm" style={{ color: '#8B7D6B' }}>
                  Click on data sources to insert placeholders
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    className="min-h-[400px] font-mono text-base leading-relaxed"
                    style={{ 
                      backgroundColor: 'white',
                      borderColor: '#8B4513',
                      color: '#3E2723'
                    }}
                    placeholder="Write your custom text here..."
                  />
                  
                  {/* Placeholder Legend */}
                  <div className="bg-white rounded-lg p-4 border" style={{ borderColor: '#F5DEB3' }}>
                    <h4 className="font-medium mb-3" style={{ color: '#3E2723' }}>
                      Placeholder Guide:
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {excelColumns.map((col) => (
                        <div key={col.id} className="flex justify-between">
                          <Badge variant="outline" style={{ backgroundColor: '#87A96B', color: 'white', borderColor: '#87A96B' }}>
                            {`{{${col.name}}}`}
                          </Badge>
                          <span style={{ color: '#8B7D6B' }}>{col.sample}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

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
            className="flex items-center space-x-2"
            style={{ backgroundColor: '#228B22', color: 'white' }}
            disabled={!customText.trim()}
          >
            <span>Sonraki Adım</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
