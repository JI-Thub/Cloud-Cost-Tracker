import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ResourceForm from './components/ResourceForm';
import CostBreakdown from './components/CostBreakdown';
import Insights from './components/Insights';
import { resourceAPI } from './services/api';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [resources, setResources] = useState([]);
  const [costs, setCosts] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [resourcesData, costsData, insightsData] = await Promise.all([
        resourceAPI.getResources(),
        resourceAPI.getCosts(),
        resourceAPI.getInsights(),
      ]);
      setResources(resourcesData);
      setCosts(costsData);
      setInsights(insightsData);
    } catch (err) {
      setError('Failed to fetch data. Please ensure the backend server is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResourceCreated = async () => {
    await fetchData();
    setActiveTab('dashboard');
  };

  return (
    <div className="App">
      <Header />
      <div className="container">
        <nav className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
          <button
            className={`nav-tab ${activeTab === 'add-resource' ? 'active' : ''}`}
            onClick={() => setActiveTab('add-resource')}
          >
            ➕ Add Resource
          </button>
          <button
            className={`nav-tab ${activeTab === 'costs' ? 'active' : ''}`}
            onClick={() => setActiveTab('costs')}
          >
            💰 Cost Breakdown
          </button>
          <button
            className={`nav-tab ${activeTab === 'insights' ? 'active' : ''}`}
            onClick={() => setActiveTab('insights')}
          >
            💡 Insights
          </button>
        </nav>

        <div className="content-area">
          {error && <div className="error-banner">{error}</div>}

          {activeTab === 'dashboard' && (
            <Dashboard
              resources={resources}
              costs={costs}
              loading={loading}
              onRefresh={fetchData}
            />
          )}

          {activeTab === 'add-resource' && (
            <ResourceForm onResourceCreated={handleResourceCreated} />
          )}

          {activeTab === 'costs' && <CostBreakdown costs={costs} loading={loading} />}

          {activeTab === 'insights' && (
            <Insights insights={insights} loading={loading} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
