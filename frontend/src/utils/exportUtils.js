/**
 * Utility function to export data as CSV
 */
export const downloadCSV = (data, filename = 'export.csv') => {
  // Convert array of objects to CSV format
  if (!data || data.length === 0) {
    console.error('No data to export');
    return;
  }

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        // Escape quotes and wrap in quotes if contains comma or newline
        if (typeof value === 'string' && (value.includes(',') || value.includes('\n') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  // Create a blob and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Generate a summary CSV with totals and metadata
 */
export const generateSummaryCSV = (exportData) => {
  const timestamp = new Date(exportData.export_date).toLocaleDateString();
  
  const summaryContent = [
    'Cloud Cost Tracker - Export Summary',
    `Export Date: ${timestamp}`,
    '',
    'Summary Statistics',
    `Total Resources: ${exportData.total_resources}`,
    `Total Cost: $${exportData.total_cost.toFixed(2)}`,
    '',
    'Resources Details',
    ...exportData.resources.map(r => 
      `${r.Name},${r.Type},${r['Usage Hours']},${r['Cost per Hour']},${r['Total Cost']}`
    )
  ].join('\n');

  return summaryContent;
};

/**
 * Prepare resource data for CSV export
 */
const billingTypeLabels = {
  hourly: 'Hourly',
  monthly: 'Monthly',
  per_request: 'Per Request',
  storage_gb_month: 'Storage (GB / month)',
};

const getResourceBillingDetails = (resource) => {
  switch (resource.billing_type) {
    case 'monthly':
      return `${resource.billing_period_months || 1} mo @ $${(resource.monthly_cost || 0).toFixed(2)}/month`;
    case 'per_request':
      return `${resource.request_count || 0} requests @ $${(resource.cost_per_request || 0).toFixed(6)}`;
    case 'storage_gb_month':
      return `${resource.storage_gb || 0} GB @ $${(resource.cost_per_gb_month || 0).toFixed(6)}/GB`;
    default:
      return `${resource.usage_hours || 0}h @ $${(resource.cost_per_hour || 0).toFixed(2)}/h`;
  }
};

const getResourceCost = (resource) => {
  switch (resource.billing_type) {
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

export const prepareResourcesForCSV = (resources) => {
  return resources.map(resource => ({
    'ID': resource.id,
    'Name': resource.name,
    'Type': resource.resource_type,
    'Billing Type': billingTypeLabels[resource.billing_type] || resource.billing_type || 'Hourly',
    'Details': getResourceBillingDetails(resource),
    'Total Cost': `$${getResourceCost(resource).toFixed(2)}`,
  }));
};
