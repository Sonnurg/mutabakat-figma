import { Button } from "./ui/button";

interface HeaderProps {
  currentStep: number;
}

const steps = [
  { id: 1, label: 'YAZINI SEÇ', shortLabel: 'SEÇ' },
  { id: 2, label: 'SÜTUNLARI SEÇ', shortLabel: 'SÜTUN' },
  { id: 3, label: 'DOSYANI YÜKLE', shortLabel: 'YÜKLE' },
  { id: 4, label: 'İNDİR', shortLabel: 'İNDİR' }
];

export function Header({ currentStep }: HeaderProps) {
  return (
    <header className="w-full bg-white border-b" style={{ borderColor: '#F5DEB3' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo and Navigation */}
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold" style={{ color: '#228B22', fontFamily: 'Georgia, serif' }}>
              MUTABAKAT
            </h1>
          </div>

          <nav className="hidden md:flex space-x-8">
            <a href="#" className="hover:opacity-75 transition-opacity" style={{ color: '#8B4513' }}>
              Hakkımızda
            </a>
            <a href="#" className="hover:opacity-75 transition-opacity" style={{ color: '#8B4513' }}>
              İletişim
            </a>
          </nav>
        </div>

        {/* Progress Indicator */}
        <div className="pb-4">
          <div className="flex items-center justify-center space-x-2 sm:space-x-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                {/* Step Circle */}
                <div className="flex flex-col items-center">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      currentStep > step.id 
                        ? 'border-green-600 bg-green-600' 
                        : currentStep === step.id
                        ? 'border-green-600 bg-green-600'
                        : 'border-gray-300 bg-white'
                    }`}
                    style={{
                      borderColor: currentStep >= step.id ? '#228B22' : '#F5DEB3',
                      backgroundColor: currentStep >= step.id ? '#228B22' : 'white'
                    }}
                  >
                    {currentStep > step.id ? (
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span 
                        className={`font-semibold ${currentStep === step.id ? 'text-white' : 'text-gray-500'}`}
                        style={{ color: currentStep >= step.id ? 'white' : '#8B7D6B' }}
                      >
                        {step.id}
                      </span>
                    )}
                  </div>
                  <span 
                    className={`mt-2 text-xs sm:text-sm font-medium text-center ${
                      currentStep >= step.id ? 'text-green-600' : 'text-gray-500'
                    }`}
                    style={{ color: currentStep >= step.id ? '#228B22' : '#8B7D6B' }}
                  >
                    <span className="hidden sm:inline">{step.label}</span>
                    <span className="sm:hidden">{step.shortLabel}</span>
                  </span>
                </div>

                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div 
                    className={`hidden sm:block w-16 h-0.5 mx-4 transition-all duration-300`}
                    style={{ 
                      backgroundColor: currentStep > step.id ? '#87A96B' : '#F5DEB3'
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
