import { useState } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { 
  Search, 
  FileText, 
  Plus, 
  Check,
  ArrowLeft,
  ArrowRight,
  Filter,
  Upload
} from "lucide-react";

interface TemplateSelectionPageProps {
  onNext: () => void;
  onBack: () => void;
}

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  preview: string;
  isPopular?: boolean;
}

const templates: Template[] = [
  {
    id: '1',
    name: 'Standard Reconciliation',
    description: 'Basic reconciliation letter template for general use',
    category: 'General',
    preview: 'Dear {{CustomerName}},\n\nWe are writing to confirm the balance on your account as of {{Date}}...',
    isPopular: true
  },
  {
    id: '2', 
    name: 'Professional Corporate',
    description: 'Formal template for corporate clients with detailed formatting',
    category: 'Corporate',
    preview: 'Dear {{CustomerName}},\n\nRe: Account Reconciliation - {{AccountNumber}}\n\nFurther to our records...'
  },
  {
    id: '3',
    name: 'Small Business Friendly',
    description: 'Casual tone template suitable for small business relationships',
    category: 'Small Business',
    preview: 'Hi {{CustomerName}},\n\nHope you\'re doing well! We wanted to touch base regarding...',
    isPopular: true
  },
  {
    id: '4',
    name: 'Year-End Reconciliation',
    description: 'Comprehensive template for annual reconciliation processes',
    category: 'Annual',
    preview: 'Dear {{CustomerName}},\n\nAs we close our fiscal year, we are reconciling all accounts...'
  },
  {
    id: '5',
    name: 'Monthly Statement',
    description: 'Regular monthly reconciliation with payment reminders',
    category: 'Monthly',
    preview: 'Dear {{CustomerName}},\n\nAttached is your monthly account statement for {{Month}}...'
  },
  {
    id: '6',
    name: 'Dispute Resolution',
    description: 'Template for handling account discrepancies and disputes',
    category: 'Disputes',
    preview: 'Dear {{CustomerName}},\n\nWe have received your inquiry regarding the discrepancy...'
  }
];

export function TemplateSelectionPage({ onNext, onBack }: TemplateSelectionPageProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'General', 'Corporate', 'Small Business', 'Annual', 'Monthly', 'Disputes'];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-green-600">Upload Excel</p>
                    <p className="text-sm text-gray-500">Completed</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-blue-600">Select Template</p>
                    <p className="text-sm text-gray-500">Current step</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 opacity-50">
                  <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Map Fields</p>
                    <p className="text-sm text-gray-500">Next step</p>
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
                Choose Reconciliation Template
              </h1>
              <p className="text-gray-600">
                Select a template that matches your business style and requirements
              </p>
            </div>

            {/* Search and Filters */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search templates..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
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
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Template Grid */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
              {/* Custom Template Upload */}
              <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Upload Your Own Template
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Use your existing Word document as a template
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Template
                  </Button>
                </CardContent>
              </Card>

              {/* Template Cards */}
              {filteredTemplates.map((template) => (
                <Card 
                  key={template.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedTemplate === template.id 
                      ? 'ring-2 ring-blue-500 border-blue-500' 
                      : 'hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1 flex items-center gap-2">
                          {template.name}
                          {template.isPopular && (
                            <Badge variant="secondary" className="text-xs">
                              Popular
                            </Badge>
                          )}
                        </CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {template.category}
                        </Badge>
                      </div>
                      {selectedTemplate === template.id && (
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4">
                      {template.description}
                    </p>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Preview:</p>
                      <div className="text-xs text-gray-700 font-mono leading-relaxed max-h-20 overflow-hidden">
                        {template.preview}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Selected Template Details */}
            {selectedTemplate && (
              <Card className="mb-6 border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-900">
                    Selected Template
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const template = templates.find(t => t.id === selectedTemplate);
                    return template ? (
                      <div>
                        <h3 className="font-semibold text-blue-900 mb-2">
                          {template.name}
                        </h3>
                        <p className="text-blue-700 text-sm mb-4">
                          {template.description}
                        </p>
                        <div className="bg-white rounded-lg p-4">
                          <p className="text-sm text-gray-600 mb-2">Full Preview:</p>
                          <div className="text-sm text-gray-800 whitespace-pre-line font-mono">
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
              <Button variant="outline" onClick={onBack} className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
              
              <Button 
                onClick={onNext} 
                disabled={!selectedTemplate}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                <span>Next: Map Fields</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
