import React, { useState } from 'react';
import './Dashboard.css';
import EditResourceModal from './EditResourceModal';
import { resourceAPI } from '../services/api';
import { downloadCSV, prepareResourcesForCSV } from '../utils/exportUtils';

const billingLabels = {
  hourly: 'Hourly',
  monthly: 'Monthly',
  per_request: 'Per Request',
  storage_gb_month: 'Storage (GB / month)',
};

function Dashboard({ resources, costs, loading, onRefresh }) {
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [editingResource, setEditingResource] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState(null);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  const totalCost = costs?.total_cost || 0;
  const resourceCount = resources?.length || 0;
  const avgCost = resourceCount > 0 ? totalCost / resourceCount : 0;
  const maxCost = costs?.breakdown?.length > 0
    ? Math.max(...costs.breakdown.map(r => r.cost))
    : 0;

  const getResourceCost = (resource) => {
    const billingType = resource.billing_type || 'hourly';
    switch (billingType) {
      case 'monthly':
        return (resource.monthly_cost || 0) * (resource.billing_period_months || 1);
      case 'per_request':
        return (resource.request_count || 0) * (resource.cost_per_request || 0);
      case 'storage_gb_month':
        return (resource.storage_gb || 0) * (resource.cost_per_gb_month || 0);
      default:
        return (resource.usage_hours || 0) * (resource.cost_per_hour || 0);
    }
  };

  const getResourceDetail = (resource) => {
    const billingType = resource.billing_type || 'hourly';
    switch (billingType) {
      case 'monthly':
        return `${billingLabels[billingType]} • ${resource.billing_period_months || 1} mo @ $${(resource.monthly_cost || 0).toFixed(2)}/month`;
      case 'per_request':
        return `${billingLabels[billingType]} • ${resource.request_count || 0} req @ $${(resource.cost_per_request || 0).toFixed(4)}`;
      case 'storage_gb_month':
        return `${billingLabels[billingType]} • ${resource.storage_gb || 0} GB @ $${(resource.cost_per_gb_month || 0).toFixed(4)}/GB`; 
      default:
        return `${billingLabels[billingType]} • ${(resource.usage_hours || 0).toFixed(1)}h @ $${(resource.cost_per_hour || 0).toFixed(2)}/h`;
    }
  };

  const handleDelete = async (resourceId, resourceName) => {
    if (!window.confirm(`Are you sure you want to delete "${resourceName}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(resourceId);
    setDeleteError(null);

    try {
      await resourceAPI.deleteResource(resourceId);
      onRefresh();
    } catch (error) {
      setDeleteError(`Failed to delete resource: ${error.response?.data?.detail || error.message}`);
      setDeletingId(null);
    }
  };

  const handleEditSave = async () => {
    setEditingResource(null);
    onRefresh();
  };

  const handleExport = async () => {
    if (!resources || resources.length === 0) {
      setExportError('No resources to export');
      return;
    }

    setExporting(true);
    setExportError(null);

    try {
      const csvData = prepareResourcesForCSV(resources);

      const summaryRow = {
        ID: '',
        Name: 'TOTAL',
        Type: '',
        'Billing Type': '',
        Details: '',
        'Total Cost': `$${totalCost.toFixed(2)}`,
      };

      csvData.push(summaryRow);

      const now = new Date();
      const timestamp = now.toISOString().slice(0, 10);
      const filename = `cloud-cost-tracker-${timestamp}.csv`;

      downloadCSV(csvData, filename);
    } catch (error) {
      setExportError('Failed to export data');
      console.error(error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <div className="header-actions">
          <button className="export-btn" onClick={handleExport} disabled={exporting || !resources?.length}>
            {exporting ? '⏳' : '📥'} Export CSV
          </button>
          <button className="refresh-btn" onClick={onRefresh}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {exportError && <div className="export-error">{exportError}</div>}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Total Cost</h3>
            <p className="stat-value">${totalCost.toFixed(2)}</p>
            <span className="stat-label">All resources</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>Total Resources</h3>
            <p className="stat-value">{resourceCount}</p>
            <span className="stat-label">Active resources</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Average Cost</h3>
            <p className="stat-value">${avgCost.toFixed(2)}</p>
            <span className="stat-label">Per resource</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>Max Cost</h3>
            <p className="stat-value">${maxCost.toFixed(2)}</p>
            <span className="stat-label">Highest resource</span>
          </div>
        </div>
      </div>

      <div className="resources-section">
        <h3>All Resources</h3>
        {deleteError && <div className="delete-error">{deleteError}</div>}
        {resources?.length > 0 ? (
          <div className="resources-list">
            {resources.map(resource => (
              <div key={resource.id} className="resource-item">
                <div className="resource-icon">
                  {resource.resource_type === 'EC2' && '🖥️'}
                  {resource.resource_type === 'RDS' && '🗄️'}
                  {resource.resource_type === 'S3' && '📦'}
                  {resource.resource_type === 'Lambda' && '⚡'}
                  {resource.resource_type === 'CloudFront' && '🌐'}
                  {!['EC2', 'RDS', 'S3', 'Lambda', 'CloudFront'].includes(resource.resource_type) && '☁️'}
                </div>
                <div className="resource-details">
                  <h4>{resource.name}</h4>
                  <p>{getResourceDetail(resource)}</p>
                </div>
                <div className="resource-cost">
                  ${getResourceCost(resource).toFixed(2)}
                </div>
                <button
                  className="edit-btn"
                  onClick={() => setEditingResource(resource)}
                  title="Edit this resource"
                >
                  ✏️
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(resource.id, resource.name)}
                  disabled={deletingId === resource.id}
                  title="Delete this resource"
                >
                  {deletingId === resource.id ? '⏳' : '🗑️'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No resources yet. Add one to get started!</p>
          </div>
        )}
      </div>

      {editingResource && (
        <EditResourceModal
          resource={editingResource}
          onClose={() => setEditingResource(null)}
          onSave={handleEditSave}
        />
      )}
    </div>
  );
}

export default Dashboard;
