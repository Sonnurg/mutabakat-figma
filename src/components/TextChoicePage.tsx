import { Card, CardContent } from "./ui/card";
import { Edit, FileText } from "lucide-react";

interface TextChoicePageProps {
  onSelectCustom: () => void;
  onSelectTemplate: () => void;
}

export function TextChoicePage({ onSelectCustom, onSelectTemplate }: TextChoicePageProps) {
  return (
    <div 
      className="flex-1 flex items-center justify-center px-4 py-8"
      style={{ backgroundColor: '#FAF7F0' }}
    >
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#3E2723' }}>
            Choose Your Method
          </h1>
          <p className="text-xl" style={{ color: '#8B7D6B' }}>
            How would you like to create your reconciliation text?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Custom Text Card */}
          <Card 
            className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl"
            style={{ backgroundColor: '#228B22', borderColor: '#228B22' }}
            onClick={onSelectCustom}
          >
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <Edit className="w-16 h-16 text-white mx-auto mb-4" />
                <span className="text-4xl">✍️</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                KENDİM YAZACAĞIM
              </h2>
              <p className="text-white/90 text-lg leading-relaxed">
                Create custom text with Excel data placeholders
              </p>
              <div className="mt-6 text-white/80 text-sm">
                Perfect for unique business requirements
              </div>
            </CardContent>
          </Card>

          {/* Template Selection Card */}
          <Card 
            className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-2"
            style={{ 
              backgroundColor: '#F5DEB3', 
              borderColor: '#8B4513'
            }}
            onClick={onSelectTemplate}
          >
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <FileText className="w-16 h-16 mx-auto mb-4" style={{ color: '#8B4513' }} />
                <span className="text-4xl">📄</span>
              </div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#8B4513' }}>
                HAZIR ŞABLONLARDAN SEÇECEĞİM
              </h2>
              <p className="text-lg leading-relaxed" style={{ color: '#8B4513' }}>
                Use ready-made professional templates
              </p>
              <div className="mt-6 text-sm" style={{ color: '#8B4513' }}>
                Quick start with proven formats
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12">
          <div className="max-w-2xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: '#98D8C8' }}>
                  <span className="text-xl">📊</span>
                </div>
                <h3 className="font-medium mb-2" style={{ color: '#3E2723' }}>Excel Integration</h3>
                <p className="text-sm" style={{ color: '#8B7D6B' }}>Seamlessly merge your data</p>
              </div>
              <div>
                <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: '#98D8C8' }}>
                  <span className="text-xl">⚡</span>
                </div>
                <h3 className="font-medium mb-2" style={{ color: '#3E2723' }}>Fast Generation</h3>
                <p className="text-sm" style={{ color: '#8B7D6B' }}>Create documents in seconds</p>
              </div>
              <div>
                <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: '#98D8C8' }}>
                  <span className="text-xl">📄</span>
                </div>
                <h3 className="font-medium mb-2" style={{ color: '#3E2723' }}>Professional Output</h3>
                <p className="text-sm" style={{ color: '#8B7D6B' }}>Ready-to-use documents</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
