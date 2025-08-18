import { useState } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  ArrowLeft,
  ArrowRight,
  Check,
  Calendar,
  Building,
  Mail,
  Calculator,
  Hash,
  TrendingUp,
  Zap,
  Eye,
  RotateCcw
} from "lucide-react";

interface FieldMappingPageProps {
  onNext: () => void;
  onBack: () => void;
}

interface TemplateField {
  id: string;
  name: string;
  placeholder: string;
  required: boolean;
  description: string;
  mapped?: string;
}

interface ExcelColumn {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date';
  sample: string;
}

interface StaticValue {
  id: string;
  name: string;
  type: 'date' | 'text' | 'custom';
  icon: any;
  value?: string;
}

const templateFields: TemplateField[] = [
  {
    id: 'customerName',
    name: 'Customer Name',
    placeholder: '{{CustomerName}}',
    required: true,
    description: 'The name of the customer or company'
  },
  {
    id: 'accountNumber',
    name: 'Account Number',
    placeholder: '{{AccountNumber}}',
    required: true,
    description: 'Customer account identifier'
  },
  {
    id: 'balance',
    name: 'Account Balance',
    placeholder: '{{Balance}}',
    required: true,
    description: 'Current account balance amount'
  },
  {
    id: 'date',
    name: 'Statement Date',
    placeholder: '{{Date}}',
    required: true,
    description: 'Date of the reconciliation statement'
  },
  {
    id: 'companyName',
    name: 'Company Name',
    placeholder: '{{CompanyName}}',
    required: false,
    description: 'Your company name'
  },
  {
    id: 'message',
    name: 'Custom Message',
    placeholder: '{{Message}}',
    required: false,
    description: 'Additional message or note'
  }
];

const excelColumns: ExcelColumn[] = [
  { id: 'col1', name: 'Customer Name', type: 'text', sample: 'ABC Corp' },
  { id: 'col2', name: 'Balance', type: 'number', sample: '$2,500.00' },
  { id: 'col3', name: 'Account', type: 'text', sample: 'ACC001' },
  { id: 'col4', name: 'Date', type: 'date', sample: '2024-01-15' }
];

const staticValues: StaticValue[] = [
  { id: 'today', name: "Today's Date", type: 'date', icon: Calendar },
  { id: 'company', name: 'Company Name', type: 'text', icon: Building, value: 'Your Company Ltd.' },
  { id: 'custom', name: 'Custom Message', type: 'custom', icon: Mail }
];

const calculatedValues = [
  { id: 'sum', name: 'Sum', icon: Calculator, description: 'Sum of selected column' },
  { id: 'avg', name: 'Average', icon: TrendingUp, description: 'Average of selected column' },
  { id: 'count', name: 'Count', icon: Hash, description: 'Count of records' }
];

export function FieldMappingPage({ onNext, onBack }: FieldMappingPageProps) {
  const [mappedFields, setMappedFields] = useState<Record<string, string>>({});
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.setData('text/plain', itemId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, fieldId: string) => {
    e.preventDefault();
    const draggedItemId = e.dataTransfer.getData('text/plain');
    
    setMappedFields(prev => ({
      ...prev,
      [fieldId]: draggedItemId
    }));
    setDraggedItem(null);
  };

  const handleAutoMap = () => {
    // Auto-mapping logic based on field names
    const autoMappings: Record<string, string> = {};
    
    if (excelColumns.find(col => col.name.toLowerCase().includes('customer'))) {
      autoMappings.customerName = 'col1';
    }
    if (excelColumns.find(col => col.name.toLowerCase().includes('balance'))) {
      autoMappings.balance = 'col2';
    }
    if (excelColumns.find(col => col.name.toLowerCase().includes('account'))) {
      autoMappings.accountNumber = 'col3';
    }
    if (excelColumns.find(col => col.name.toLowerCase().includes('date'))) {
      autoMappings.date = 'col4';
    }
    
    autoMappings.companyName = 'company';
    autoMappings.message = 'custom';
    
    setMappedFields(autoMappings);
  };

  const handleClearMappings = () => {
    setMappedFields({});
  };

  const getMappedSource = (fieldId: string) => {
    const mappedId = mappedFields[fieldId];
    if (!mappedId) return null;
    
    const excelCol = excelColumns.find(col => col.id === mappedId);
    if (excelCol) return { type: 'excel', source: excelCol };
    
    const staticVal = staticValues.find(val => val.id === mappedId);
    if (staticVal) return { type: 'static', source: staticVal };
    
    return null;
  };

  const requiredFieldsMapped = templateFields
    .filter(field => field.required)
    .every(field => mappedFields[field.id]);

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
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-green-600">Select Template</p>
                    <p className="text-sm text-gray-500">Completed</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-blue-600">Map Fields</p>
                    <p className="text-sm text-gray-500">Current step</p>
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
                Map Template Fields
              </h1>
              <p className="text-gray-600">
                Connect your Excel columns to template fields by dragging and dropping
              </p>
            </div>

            {/* Auto Map Controls */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">Quick Actions</h3>
                    <p className="text-sm text-gray-600">Automatically map common fields or start fresh</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleClearMappings}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Clear All
                    </Button>
                    <Button size="sm" onClick={handleAutoMap} className="bg-blue-600 hover:bg-blue-700">
                      <Zap className="w-4 h-4 mr-2" />
                      Auto Map
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mapping Interface */}
            <div className="grid lg:grid-cols-3 gap-6 mb-6">
              {/* Template Fields */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Template Fields</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {templateFields.map((field) => {
                    const mappedSource = getMappedSource(field.id);
                    return (
                      <div
                        key={field.id}
                        className={`p-4 rounded-lg border-2 border-dashed transition-all ${
                          mappedSource 
                            ? 'border-green-300 bg-green-50' 
                            : 'border-gray-300 hover:border-blue-400'
                        }`}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, field.id)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-gray-900">{field.name}</span>
                              {field.required && (
                                <Badge variant="destructive" className="text-xs">Required</Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-600">{field.description}</p>
                          </div>
                          {mappedSource && (
                            <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                          )}
                        </div>
                        
                        {mappedSource ? (
                          <div className="bg-white rounded p-2 text-sm">
                            <span className="font-medium text-green-700">
                              {mappedSource.type === 'excel' 
                                ? `Excel: ${mappedSource.source.name}`
                                : `Static: ${mappedSource.source.name}`
                              }
                            </span>
                          </div>
                        ) : (
                          <div className="text-center text-gray-400 text-sm py-2">
                            Drop here
                          </div>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Excel Columns */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Excel Columns</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {excelColumns.map((column) => (
                    <div
                      key={column.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, column.id)}
                      className="p-4 bg-blue-50 border border-blue-200 rounded-lg cursor-move hover:bg-blue-100 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-blue-900">{column.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {column.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-blue-700">
                        Sample: <span className="font-mono">{column.sample}</span>
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Static & Calculated Values */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Static Values</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {staticValues.map((value) => (
                    <div
                      key={value.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, value.id)}
                      className="p-4 bg-gray-50 border border-gray-200 rounded-lg cursor-move hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <value.icon className="w-4 h-4 text-gray-600" />
                        <span className="font-medium text-gray-900">{value.name}</span>
                      </div>
                      {value.value && (
                        <p className="text-sm text-gray-600">
                          Value: {value.value}
                        </p>
                      )}
                    </div>
                  ))}
                  
                  <div className="pt-2 border-t">
                    <h4 className="font-medium text-gray-900 mb-2">Calculated Values</h4>
                    {calculatedValues.map((calc) => (
                      <div
                        key={calc.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, calc.id)}
                        className="p-3 bg-orange-50 border border-orange-200 rounded-lg cursor-move hover:bg-orange-100 transition-colors mb-2"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <calc.icon className="w-4 h-4 text-orange-600" />
                          <span className="font-medium text-orange-900">{calc.name}</span>
                        </div>
                        <p className="text-xs text-orange-700">{calc.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Preview */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Mapping Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">Sample output with current mappings:</p>
                  <div className="bg-white rounded p-4 font-mono text-sm">
                    <p>Dear {mappedFields.customerName ? 'ABC Corp' : '{{CustomerName}}'},</p>
                    <br />
                    <p>We are writing to confirm the balance on your account {mappedFields.accountNumber ? 'ACC001' : '{{AccountNumber}}'} as of {mappedFields.date ? '2024-01-15' : '{{Date}}'}.</p>
                    <br />
                    <p>Current balance: {mappedFields.balance ? '$2,500.00' : '{{Balance}}'}</p>
                    <br />
                    <p>Sincerely,</p>
                    <p>{mappedFields.companyName ? 'Your Company Ltd.' : '{{CompanyName}}'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Validation */}
            {!requiredFieldsMapped && (
              <Card className="mb-6 border-orange-200 bg-orange-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 text-sm">!</span>
                    </div>
                    <div>
                      <p className="font-medium text-orange-900">Required Fields Missing</p>
                      <p className="text-sm text-orange-700">
                        Please map all required fields before proceeding to the next step.
                      </p>
                    </div>
                  </div>
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
                disabled={!requiredFieldsMapped}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                <span>Next: Generate Letters</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
