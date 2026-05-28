import React from 'react';
import './CostBreakdown.css';

function CostBreakdown({ costs, loading }) {
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!costs || !costs.breakdown) {
    return (
      <div className="cost-breakdown">
        <div className="empty-state">
          <p>No cost data available yet.</p>
        </div>
      </div>
    );
  }

  const sortedBreakdown = [...costs.breakdown].sort((a, b) => (b.cost || 0) - (a.cost || 0));
  const totalCost = costs.total_cost || 0;

  const billingTypeLabels = {
    hourly: 'Hourly',
    monthly: 'Monthly',
    per_request: 'Per Request',
    storage_gb_month: 'Storage',
    unknown: 'Other',
  };

  const groupedBreakdown = sortedBreakdown.reduce((groups, item) => {
    const type = item.billing_type || 'unknown';
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(item);
    return groups;
  }, {});

  const billingTypeOrder = ['hourly', 'monthly', 'per_request', 'storage_gb_month', 'unknown'];
  const groupedEntries = [
    ...billingTypeOrder.filter((type) => groupedBreakdown[type]),
    ...Object.keys(groupedBreakdown).filter((type) => !billingTypeOrder.includes(type)),
  ];

  const formatBillingInfo = (item) => {
    switch (item.billing_type) {
      case 'hourly': {
        const usage = item.usage_hours != null ? `${item.usage_hours.toFixed(2)} hrs` : '-';
        const rate = item.cost_per_hour != null ? `$${item.cost_per_hour.toFixed(2)} /hr` : '-';
        return `${usage} @ ${rate}`;
      }
      case 'monthly':
        return item.details || (item.monthly_cost != null ? `$${item.monthly_cost.toFixed(2)} / month` : '-');
      case 'per_request':
        return item.details || (item.request_count != null && item.cost_per_request != null
          ? `${item.request_count} req @ $${item.cost_per_request.toFixed(4)} /req`
          : '-');
      case 'storage_gb_month':
        return item.details || (item.storage_gb != null && item.cost_per_gb_month != null
          ? `${item.storage_gb} GB @ $${item.cost_per_gb_month.toFixed(2)} /GB-mo`
          : '-');
      default:
        return item.details || '-';
    }
  };

  return (
    <div className="cost-breakdown">
      <h2>Cost Breakdown</h2>

      <div className="cost-summary">
        <div className="total-cost-card">
          <h3>Total Cost</h3>
          <p className="total-cost-amount">${totalCost.toFixed(2)}</p>
        </div>
      </div>

      {groupedEntries.map((billingType) => {
        const items = groupedBreakdown[billingType];
        const label = billingTypeLabels[billingType] || billingType;
        return (
          <div key={billingType} className="breakdown-group">
            <h3>{label} Resources</h3>
            <div className="breakdown-table">
              <table>
                <thead>
                  <tr>
                    <th>Resource Name</th>
                    <th>Type</th>
                    <th>Billing Info</th>
                    <th>Total Cost</th>
                    <th>% of Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => {
                    const itemCost = item.cost != null ? item.cost : 0;
                    const percentage = totalCost > 0 ? ((itemCost / totalCost) * 100).toFixed(1) : '0.0';
                    return (
                      <tr key={index}>
                        <td className="resource-name">{item.name}</td>
                        <td className="resource-type">{item.resource_type}</td>
                        <td>{formatBillingInfo(item)}</td>
                        <td className="cost-cell">${itemCost.toFixed(2)}</td>
                        <td className="percentage">
                          <div className="percentage-bar">
                            <div
                              className="percentage-fill"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          {percentage}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      {sortedBreakdown.length > 0 && (
        <div className="chart-section">
          <h3>Cost Distribution</h3>
          <div className="pie-chart">
            {sortedBreakdown.map((item, index) => {
              const colors = [
                '#667eea',
                '#764ba2',
                '#f093fb',
                '#4facfe',
                '#00f2fe',
                '#43e97b',
                '#fa709a',
                '#fee140',
              ];
              const color = colors[index % colors.length];
              const itemCost = item.cost != null ? item.cost : 0;
              const percentage = totalCost > 0 ? (itemCost / totalCost) * 100 : 0;

              return (
                <div
                  key={index}
                  className="pie-segment"
                  style={{
                    background: color,
                    width: percentage + '%',
                  }}
                  title={`${item.name}: ${percentage.toFixed(1)}%`}
                ></div>
              );
            })}
          </div>
          <div className="legend">
            {sortedBreakdown.slice(0, 6).map((item, index) => {
              const colors = [
                '#667eea',
                '#764ba2',
                '#f093fb',
                '#4facfe',
                '#00f2fe',
                '#43e97b',
              ];
              return (
                <div key={index} className="legend-item">
                  <div
                    className="legend-color"
                    style={{ background: colors[index] }}
                  ></div>
                  <span>{item.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default CostBreakdown;
