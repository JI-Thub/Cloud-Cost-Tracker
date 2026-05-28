import React, { useState, useEffect } from 'react';
import './EditResourceModal.css';
import { resourceAPI } from '../services/api';

const resourceTypes = ['EC2', 'RDS', 'S3', 'Lambda', 'CloudFront', 'DynamoDB', 'Elastic Cache', 'Other'];
const billingTypes = [
  { value: 'hourly', label: 'Hourly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'per_request', label: 'Per Request' },
  { value: 'storage_gb_month', label: 'Storage (GB / month)' },
];

function EditResourceModal({ resource, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    resource_type: '',
    billing_type: 'hourly',
    usage_hours: '',
    cost_per_hour: '',
    monthly_cost: '',
    billing_period_months: '1',
    request_count: '',
    cost_per_request: '',
    storage_gb: '',
    cost_per_gb_month: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (resource) {
      setFormData({
        name: resource.name || '',
        resource_type: resource.resource_type || 'EC2',
        billing_type: resource.billing_type || 'hourly',
        usage_hours: resource.usage_hours ?? '',
        cost_per_hour: resource.cost_per_hour ?? '',
        monthly_cost: resource.monthly_cost ?? '',
        billing_period_months: resource.billing_period_months ?? '1',
        request_count: resource.request_count ?? '',
        cost_per_request: resource.cost_per_request ?? '',
        storage_gb: resource.storage_gb ?? '',
        cost_per_gb_month: resource.cost_per_gb_month ?? '',
      });
    }
  }, [resource]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateBillingFields = () => {
    if (!formData.name) {
      return 'Please enter a resource name';
    }

    switch (formData.billing_type) {
      case 'hourly':
        if (!formData.usage_hours || !formData.cost_per_hour) {
          return 'Hourly billing requires usage hours and cost per hour';
        }
        break;
      case 'monthly':
        if (!formData.monthly_cost || !formData.billing_period_months) {
          return 'Monthly billing requires a monthly cost and a number of months';
        }
        break;
      case 'per_request':
        if (!formData.request_count || !formData.cost_per_request) {
          return 'Per-request billing requires request count and cost per request';
        }
        break;
      case 'storage_gb_month':
        if (!formData.storage_gb || !formData.cost_per_gb_month) {
          return 'Storage billing requires storage size and cost per GB/month';
        }
        break;
      default:
        return 'Unsupported billing type';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const validationError = validateBillingFields();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      const updateData = {
        name: formData.name,
        resource_type: formData.resource_type,
        billing_type: formData.billing_type,
      };

      if (formData.billing_type === 'hourly') {
        updateData.usage_hours = parseFloat(formData.usage_hours);
        updateData.cost_per_hour = parseFloat(formData.cost_per_hour);
      }
      if (formData.billing_type === 'monthly') {
        updateData.monthly_cost = parseFloat(formData.monthly_cost);
        updateData.billing_period_months = parseInt(formData.billing_period_months, 10);
      }
      if (formData.billing_type === 'per_request') {
        updateData.request_count = parseInt(formData.request_count, 10);
        updateData.cost_per_request = parseFloat(formData.cost_per_request);
      }
      if (formData.billing_type === 'storage_gb_month') {
        updateData.storage_gb = parseFloat(formData.storage_gb);
        updateData.cost_per_gb_month = parseFloat(formData.cost_per_gb_month);
      }

      await resourceAPI.updateResource(resource.id, updateData);
      onSave();
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(detail.map(d => d.msg || JSON.stringify(d)).join('; '));
      } else if (typeof detail === 'string') {
        setError(detail);
      } else {
        setError(err.response?.data?.detail || err.message || 'Failed to update resource');
      }
    } finally {
      setLoading(false);
    }
  };

  const costPreview = (() => {
    const hours = parseFloat(formData.usage_hours || 0);
    const hourly = parseFloat(formData.cost_per_hour || 0);
    const monthly = parseFloat(formData.monthly_cost || 0);
    const months = parseInt(formData.billing_period_months || 1, 10) || 1;
    const count = parseInt(formData.request_count || 0, 10);
    const perRequest = parseFloat(formData.cost_per_request || 0);
    const storage = parseFloat(formData.storage_gb || 0);
    const storagePrice = parseFloat(formData.cost_per_gb_month || 0);

    switch (formData.billing_type) {
      case 'monthly':
        return monthly * months;
      case 'per_request':
        return count * perRequest;
      case 'storage_gb_month':
        return storage * storagePrice;
      default:
        return hours * hourly;
    }
  })();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Resource</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="edit-form">
          {error && <div className="form-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="name">Resource Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Web Server 1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="resource_type">Resource Type</label>
            <select
              id="resource_type"
              name="resource_type"
              value={formData.resource_type}
              onChange={handleChange}
            >
              {resourceTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="billing_type">Billing Type</label>
            <select
              id="billing_type"
              name="billing_type"
              value={formData.billing_type}
              onChange={handleChange}
            >
              {billingTypes.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {formData.billing_type === 'hourly' && (
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="usage_hours">Usage Hours</label>
                <input
                  type="number"
                  id="usage_hours"
                  name="usage_hours"
                  value={formData.usage_hours}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="cost_per_hour">Cost per Hour ($)</label>
                <input
                  type="number"
                  id="cost_per_hour"
                  name="cost_per_hour"
                  value={formData.cost_per_hour}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>
          )}

          {formData.billing_type === 'monthly' && (
            <>
              <div className="form-group">
                <label htmlFor="monthly_cost">Monthly Cost ($)</label>
                <input
                  type="number"
                  id="monthly_cost"
                  name="monthly_cost"
                  value={formData.monthly_cost}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="billing_period_months">Billing Duration (months)</label>
                <input
                  type="number"
                  id="billing_period_months"
                  name="billing_period_months"
                  value={formData.billing_period_months}
                  onChange={handleChange}
                  step="1"
                  min="1"
                  required
                />
              </div>
            </>
          )}

          {formData.billing_type === 'per_request' && (
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="request_count">Request Count</label>
                <input
                  type="number"
                  id="request_count"
                  name="request_count"
                  value={formData.request_count}
                  onChange={handleChange}
                  step="1"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="cost_per_request">Cost per Request ($)</label>
                <input
                  type="number"
                  id="cost_per_request"
                  name="cost_per_request"
                  value={formData.cost_per_request}
                  onChange={handleChange}
                  step="0.0001"
                  min="0"
                  required
                />
              </div>
            </div>
          )}

          {formData.billing_type === 'storage_gb_month' && (
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="storage_gb">Storage (GB)</label>
                <input
                  type="number"
                  id="storage_gb"
                  name="storage_gb"
                  value={formData.storage_gb}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="cost_per_gb_month">Cost per GB ($)</label>
                <input
                  type="number"
                  id="cost_per_gb_month"
                  name="cost_per_gb_month"
                  value={formData.cost_per_gb_month}
                  onChange={handleChange}
                  step="0.0001"
                  min="0"
                  required
                />
              </div>
            </div>
          )}

          <div className="form-info">
            <p>💰 <strong>Estimated Cost:</strong> ${costPreview.toFixed(2)}</p>
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditResourceModal;
