"""
Cost calculation service.

Supports different pricing patterns for cloud resources:
- hourly: usage_hours * cost_per_hour
- monthly: fixed monthly_cost
- per_request: request_count * cost_per_request
- storage_gb_month: storage_gb * cost_per_gb_month
"""

def calculate_resource_cost(resource):
    """Calculate total cost for a resource using the resource's billing type."""
    billing_type = getattr(resource, "billing_type", "hourly") or "hourly"

    if billing_type == "hourly":
        return (resource.usage_hours or 0) * (resource.cost_per_hour or 0)
    if billing_type == "monthly":
        return (resource.monthly_cost or 0) * (resource.billing_period_months or 1)
    if billing_type == "per_request":
        return (resource.request_count or 0) * (resource.cost_per_request or 0)
    if billing_type == "storage_gb_month":
        return (resource.storage_gb or 0) * (resource.cost_per_gb_month or 0)

    return 0.0


def get_billing_details(resource):
    billing_type = getattr(resource, "billing_type", "hourly") or "hourly"

    if billing_type == "hourly":
        return f"{resource.usage_hours or 0}h @ ${resource.cost_per_hour or 0:.4f}/h"
    if billing_type == "monthly":
        return f"{resource.billing_period_months or 1} month(s) @ ${resource.monthly_cost or 0:.2f}/month"
    if billing_type == "per_request":
        return f"{resource.request_count or 0} req @ ${resource.cost_per_request or 0:.4f}"
    if billing_type == "storage_gb_month":
        return f"{resource.storage_gb or 0} GB @ ${resource.cost_per_gb_month or 0:.4f}/GB"

    return "Unknown billing details"
