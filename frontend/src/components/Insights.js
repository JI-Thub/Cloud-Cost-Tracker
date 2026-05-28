import React from 'react';
import './Insights.css';

function Insights({ insights, loading }) {
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="insights">
        <div className="empty-state">
          <p>No insights available yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="insights">
      <h2>Cost Insights & Recommendations</h2>

      {insights.message && (
        <div className="info-banner">
          <p>{insights.message}</p>
        </div>
      )}

      <div className="insights-grid">
        <div className="insight-card primary">
          <div className="insight-icon">📊</div>
          <h3>Total Resources</h3>
          <p className="insight-value">{insights.total_resources}</p>
          <span className="insight-label">Resources in use</span>
        </div>

        <div className="insight-card">
          <div className="insight-icon">💰</div>
          <h3>Total Cost</h3>
          <p className="insight-value">${insights.total_cost?.toFixed(2) || '0.00'}</p>
          <span className="insight-label">Monthly estimate</span>
        </div>

        <div className="insight-card">
          <div className="insight-icon">📈</div>
          <h3>Average Cost</h3>
          <p className="insight-value">${insights.average_cost_per_resource?.toFixed(2) || '0.00'}</p>
          <span className="insight-label">Per resource</span>
        </div>
      </div>

      <div className="recommendations">
        <h3>📌 Key Findings</h3>

        {insights.most_expensive_resource && (
          <div className="recommendation-item warning">
            <div className="icon">⚠️</div>
            <div className="content">
              <h4>Most Expensive Resource</h4>
              <p>
                <strong>{insights.most_expensive_resource.name}</strong> ({insights.most_expensive_resource.resource_type})
                is your highest cost resource. Consider reviewing its configuration and usage patterns.
              </p>
            </div>
          </div>
        )}

        {insights.least_expensive_resource && (
          <div className="recommendation-item success">
            <div className="icon">✓</div>
            <div className="content">
              <h4>Most Efficient Resource</h4>
              <p>
                <strong>{insights.least_expensive_resource.name}</strong> ({insights.least_expensive_resource.resource_type})
                is your most cost-efficient resource. Consider this as a benchmark for optimization.
              </p>
            </div>
          </div>
        )}

        {insights.underutilized && insights.underutilized.length > 0 && (
          <div className="recommendation-item info">
            <div className="icon">💡</div>
            <div className="content">
              <h4>Underutilized Resources</h4>
              <p>
                The following resources have low usage hours ({insights.underutilized.length} found):
              </p>
              <ul className="underutilized-list">
                {insights.underutilized.map((resource, idx) => (
                  <li key={idx}>
                    {resource.name} - {resource.usage_hours} hours
                  </li>
                ))}
              </ul>
              <p>Consider right-sizing or consolidating these resources to reduce costs.</p>
            </div>
          </div>
        )}
      </div>

      <div className="optimization-tips">
        <h3>💡 Optimization Tips</h3>
        <div className="tips-grid">
          <div className="tip">
            <h4>🎯 Review Usage Patterns</h4>
            <p>Analyze when resources are used most and consider auto-scaling or reserved instances for peak hours.</p>
          </div>
          <div className="tip">
            <h4>🔍 Right-Size Resources</h4>
            <p>Evaluate if your resources are properly sized for your workload. Downsizing can lead to significant savings.</p>
          </div>
          <div className="tip">
            <h4>⏰ Schedule Resources</h4>
            <p>Stop or scale down resources during off-hours or weekends to reduce unnecessary costs.</p>
          </div>
          <div className="tip">
            <h4>📦 Consolidate Workloads</h4>
            <p>Combine underutilized resources to improve efficiency and reduce overall infrastructure costs.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Insights;
