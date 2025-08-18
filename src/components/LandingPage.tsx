import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Upload, FileText, Download, CheckCircle } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="flex-1 bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Reconciliation Letter Generator
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Generate automatic reconciliation letters from your Excel data. 
                Streamline your accounting process with professional templates 
                and automated document generation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700 px-8 py-3"
                  onClick={onGetStarted}
                >
                  Get Started
                </Button>
                <Button variant="outline" size="lg" className="px-8 py-3">
                  Watch Demo
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1734336009361-f8d43327430f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBvZmZpY2UlMjBkZXNrJTIwYWNjb3VudGluZ3xlbnwxfHx8fDE3NTUzNTczMzB8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Professional accounting workspace"
                  className="w-full h-80 object-cover rounded-xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Simple 3-Step Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Upload your Excel data, select a template, and generate professional 
              reconciliation letters in minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="p-8 text-center border-2 hover:border-blue-200 transition-colors">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Upload className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  📊 Upload Excel
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Easily upload your Excel files with client data, account balances, 
                  and reconciliation information.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="p-8 text-center border-2 hover:border-green-200 transition-colors">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  📝 Select Template
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Choose from ready-made professional templates or upload 
                  your own custom reconciliation letter format.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="p-8 text-center border-2 hover:border-orange-200 transition-colors">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Download className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  📄 Generate Letters
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Automatically generate personalized reconciliation letters 
                  and download them as individual files or ZIP archive.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Why Choose ReconciliationGen?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Save Time</h4>
                    <p className="text-gray-600">
                      Generate hundreds of reconciliation letters in minutes instead of hours
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Professional Quality</h4>
                    <p className="text-gray-600">
                      Use professionally designed templates that maintain consistency
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Error Reduction</h4>
                    <p className="text-gray-600">
                      Minimize manual entry errors with automated data mapping
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Easy Integration</h4>
                    <p className="text-gray-600">
                      Works with your existing Excel workflows and data formats
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">Reconciliation Progress</span>
                  <span className="text-sm font-semibold text-green-600">95% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Letters Generated</span>
                    <span className="font-semibold">247/260</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Time Elapsed</span>
                    <span className="font-semibold">2:34</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Success Rate</span>
                    <span className="font-semibold text-green-600">100%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">RL</span>
                </div>
                <span className="font-semibold">ReconciliationGen</span>
              </div>
              <p className="text-gray-400">
                Streamline your accounting process with automated reconciliation letter generation.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ReconciliationGen. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
