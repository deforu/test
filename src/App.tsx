import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import SetupPage from './components/SetupPage';
import Dashboard from './components/Dashboard';
import ApologyWizard from './components/ApologyWizard';
import PreviewPage from './components/PreviewPage';
import { useAuth } from './hooks/useAuth';
import type { AppPage, DetectedMessage, ApologyData } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('landing');
  const [selectedMessage, setSelectedMessage] = useState<DetectedMessage | null>(null);
  const [apologyData, setApologyData] = useState<ApologyData | null>(null);
  const { hasRequiredConnections, loading } = useAuth();

  const handlePageChange = (page: AppPage) => {
    setCurrentPage(page);
  };

  const handleGetStarted = () => {
    if (hasRequiredConnections()) {
      setCurrentPage('dashboard');
    } else {
      setCurrentPage('setup');
    }
  };

  const handleSetupComplete = () => {
    setCurrentPage('dashboard');
  };

  const handleMessageSelect = (message: DetectedMessage) => {
    setSelectedMessage(message);
    setCurrentPage('wizard');
  };

  const handleApologyComplete = (data: ApologyData) => {
    setApologyData(data);
    setCurrentPage('preview');
  };

  const handleBackToDashboard = () => {
    setSelectedMessage(null);
    setApologyData(null);
    setCurrentPage('dashboard');
  };

  const handleRetryApology = () => {
    setApologyData(null);
    setCurrentPage('wizard');
  };

  // Show loading screen while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage === 'landing' && (
        <LandingPage onGetStarted={handleGetStarted} />
      )}
      
      {currentPage === 'setup' && (
        <SetupPage 
          onBack={() => setCurrentPage('landing')}
          onComplete={handleSetupComplete}
        />
      )}
      
      {currentPage === 'dashboard' && (
        <Dashboard onMessageSelect={handleMessageSelect} />
      )}
      
      {currentPage === 'wizard' && selectedMessage && (
        <ApologyWizard
          message={selectedMessage}
          onComplete={handleApologyComplete}
          onBack={handleBackToDashboard}
        />
      )}
      
      {currentPage === 'preview' && apologyData && (
        <PreviewPage
          apologyData={apologyData}
          onBack={handleBackToDashboard}
          onRetry={handleRetryApology}
        />
      )}
    </div>
  );
}

export default App;