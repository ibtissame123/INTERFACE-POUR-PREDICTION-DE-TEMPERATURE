import React, { useState } from 'react';
import Layout from './components/Layout';
import DashboardView from './views/DashboardView';
import PredictionView from './views/PredictionView';
import ComparisonView from './views/ComparisonView';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'prediction':
        return <PredictionView />;
      case 'comparison':
        return <ComparisonView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;