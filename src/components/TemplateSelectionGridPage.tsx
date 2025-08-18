import { useState } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { 
  Search, 
  Plus, 
  Upload,
  ArrowLeft,
  ArrowRight,
  FileText,
  Check
} from "lucide-react";

interface TemplateSelectionGridPageProps {
  onNext: () => void;
  onBack: () => void;
}

interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  preview: string;
}

const templates: Template[] = [
  {
    id: '1',
    name: 'Müşteri Mutabakatı',
    category: 'Müşteri',
    description: 'Standart müşteri bakiye mutabakat mektubu',
    preview: 'Sayın {{MÜŞTERI_ADI}}, Hesabınızın {{TARIH}} tarihi itibariyle bakiyesi {{BAKİYE}} TL\'dir...'
  },
  {
    id: '2',
    name: 'Tedarikçi Ödemesi',
    category: 'Tedarikçi',
    description: 'Tedarikçi ödeme bildirimi mektubu',
    preview: 'Sayın {{TEDARİKÇİ_ADI}}, {{TARIH}} tarihinde {{TUTAR}} TL ödeme gerçekleştirilmiştir...'
  },
  {
    id: '3',
    name: 'Personel Bordrosu',
    category: 'Personel',
    description: 'Aylık personel maaş bordrosu',
    preview: 'Sayın {{PERSONEL_ADI}}, {{AY}} ayı maaş bordronuz: Brüt: {{BRÜT}}, Net: {{NET}}...'
  },
  {
    id: '4',
    name: 'Genel Mutabakat',
    category: 'Genel',
    description: 'Genel amaçlı mutabakat mektubu',
    preview: 'Sayın İlgili, {{TARIH}} tarihi itibariyle hesap durumunuz ekte sunulmuştur...'
  },
  {
    id: '5',
    name: 'Yıllık Özet',
    category: 'Rapor',
    description: 'Yıllık hesap özeti raporu',
    preview: 'Sayın {{MÜŞTERİ}}, {{YIL}} yılı hesap özeti: Toplam: {{TOPLAM}}, Bakiye: {{BAKİYE}}...'
  },
  {
    id: '6',
    name: 'Ödeme Hatırlatması',
    category: 'Ödeme',
    description: 'Ödeme tarih hatırlatma mektubu',
    preview: 'Sayın {{MÜŞTERİ}}, {{VADE_TARİHİ}} vadeli {{TUTAR}} TL borcunuz bulunmaktadır...'
  },
  {
    id: '7',
    name: 'Fatura Detayı',
    category: 'Fatura',
    description: 'Detaylı fatura bilgilendirmesi',
    preview: 'Fatura No: {{FATURA_NO}}, Tarih: {{TARİH}}, Tutar: {{TUTAR}}, KDV: {{KDV}}...'
  },
  {
    id: '8',
    name: 'Kredi Bildirimi',
    category: 'Kredi',
    description: 'Kredi hesap hareketleri bildirimi',
    preview: 'Sayın {{MÜŞTERİ}}, kredi hesabınıza {{TARİH}} tarihinde {{TUTAR}} TL yatırılmıştır...'
  }
];

const categories = ['Tümü', 'Müşteri', 'Tedarikçi', 'Personel', 'Genel', 'Rapor', 'Ödeme', 'Fatura', 'Kredi'];

export function TemplateSelectionGridPage({ onNext, onBack }: TemplateSelectionGridPageProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tümü' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-1" style={{ backgroundColor: '#FAF7F0' }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#3E2723' }}>
            Choose a Template
          </h1>
          <p style={{ color: '#8B7D6B' }}>
            Select from our collection of professional templates
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: '#8B7D6B' }} />
                <Input
                  placeholder="Şablon ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  style={{ borderColor: '#8B4513' }}
                />
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="whitespace-nowrap"
                    style={{
                      backgroundColor: selectedCategory === category ? '#228B22' : 'transparent',
                      borderColor: '#8B4513',
                      color: selectedCategory === category ? 'white' : '#8B4513'
                    }}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Template Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
          {/* Upload Custom Template Card */}
          <Card 
            className="border-2 border-dashed transition-all duration-300 hover:scale-105 cursor-pointer"
            style={{ 
              borderColor: '#8B4513',
              backgroundColor: '#F5DEB3'
            }}
          >
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <Plus className="w-12 h-12 mx-auto mb-2" style={{ color: '#DAA520' }} />
                <span className="text-3xl">+</span>
              </div>
              <h3 className="font-semibold mb-2" style={{ color: '#8B4513' }}>
                Kendi Şablonunu Yükle
              </h3>
              <p className="text-sm mb-4" style={{ color: '#8B4513' }}>
                Mevcut Word belgenizi şablon olarak kullanın
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                style={{ borderColor: '#8B4513', color: '#8B4513' }}
              >
                <Upload className="w-4 h-4 mr-2" />
                Şablon Yükle
              </Button>
            </CardContent>
          </Card>

          {/* Template Cards */}
          {filteredTemplates.map((template) => (
            <Card 
              key={template.id}
              className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                selectedTemplate === template.id 
                  ? 'ring-2 shadow-lg' 
                  : ''
              }`}
              style={{
                backgroundColor: 'white',
                borderColor: selectedTemplate === template.id ? '#228B22' : '#F5DEB3',
                ringColor: selectedTemplate === template.id ? '#228B22' : 'transparent'
              }}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1" style={{ color: '#3E2723' }}>
                      {template.name}
                    </CardTitle>
                    <Badge 
                      variant="outline" 
                      className="text-xs"
                      style={{ 
                        borderColor: '#87A96B',
                        color: '#87A96B',
                        backgroundColor: 'transparent'
                      }}
                    >
                      {template.category}
                    </Badge>
                  </div>
                  {selectedTemplate === template.id && (
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: '#228B22' }}
                    >
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4" style={{ color: '#8B7D6B' }}>
                  {template.description}
                </p>
                <div 
                  className="rounded-lg p-3"
                  style={{ backgroundColor: '#FAF7F0' }}
                >
                  <p className="text-xs mb-1" style={{ color: '#8B7D6B' }}>
                    Önizleme:
                  </p>
                  <div 
                    className="text-xs font-mono leading-relaxed max-h-16 overflow-hidden"
                    style={{ color: '#3E2723' }}
                  >
                    {template.preview}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selected Template Preview */}
        {selectedTemplate && (
          <Card 
            className="mb-6"
            style={{ 
              backgroundColor: '#98D8C8',
              borderColor: '#228B22'
            }}
          >
            <CardHeader>
              <CardTitle style={{ color: '#3E2723' }}>
                Selected Template
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const template = templates.find(t => t.id === selectedTemplate);
                return template ? (
                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: '#3E2723' }}>
                      {template.name}
                    </h3>
                    <p className="text-sm mb-4" style={{ color: '#3E2723' }}>
                      {template.description}
                    </p>
                    <div 
                      className="rounded-lg p-4"
                      style={{ backgroundColor: 'white' }}
                    >
                      <p className="text-sm mb-2" style={{ color: '#8B7D6B' }}>
                        Full Preview:
                      </p>
                      <div 
                        className="text-sm whitespace-pre-line font-mono"
                        style={{ color: '#3E2723' }}
                      >
                        {template.preview}
                      </div>
                    </div>
                  </div>
                ) : null;
              })()}
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
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
            disabled={!selectedTemplate}
            className="flex items-center space-x-2"
            style={{ 
              backgroundColor: selectedTemplate ? '#228B22' : '#8B7D6B',
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
