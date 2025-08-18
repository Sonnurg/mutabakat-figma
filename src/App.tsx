import { useState } from 'react';
import { Header } from './components/Header';
import { TextChoicePage } from './components/TextChoicePage';
import { CustomTextEditorPage } from './components/CustomTextEditorPage';
import { TemplateSelectionGridPage } from './components/TemplateSelectionGridPage';
import { ExcelUploadPage } from './components/ExcelUploadPage';
import { DownloadPage } from './components/DownloadPage';

type Step = 1 | 2 | 3 | 4;
type TextChoice = 'custom' | 'template' | null;

export default function App() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [textChoice, setTextChoice] = useState<TextChoice>(null);

  const navigateToStep = (step: Step) => {
    setCurrentStep(step);
  };

  const handleTextChoice = (choice: TextChoice) => {
    setTextChoice(choice);
    setCurrentStep(2);
  };

  const handleStartOver = () => {
    setCurrentStep(1);
    setTextChoice(null);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <TextChoicePage 
            onSelectCustom={() => handleTextChoice('custom')}
            onSelectTemplate={() => handleTextChoice('template')}
          />
        );
      case 2:
        if (textChoice === 'custom') {
          return (
            <CustomTextEditorPage 
              onNext={() => navigateToStep(3)}
              onBack={() => navigateToStep(1)}
            />
          );
        } else {
          return (
            <TemplateSelectionGridPage 
              onNext={() => navigateToStep(3)}
              onBack={() => navigateToStep(1)}
            />
          );
        }
      case 3:
        return (
          <ExcelUploadPage 
            onNext={() => navigateToStep(4)}
            onBack={() => navigateToStep(2)}
          />
        );
      case 4:
        return (
          <DownloadPage 
            onStartOver={handleStartOver}
          />
        );
      default:
        return (
          <TextChoicePage 
            onSelectCustom={() => handleTextChoice('custom')}
            onSelectTemplate={() => handleTextChoice('template')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header currentStep={currentStep} />
      {renderCurrentStep()}
    </div>
  );
}
