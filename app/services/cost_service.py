"""
Cost calculation service.

Reference pricing for common AWS services:
- EC2: $0.10/hour
- S3: $0.02/hour  
- RDS: $0.15/hour
"""

def calculate_resource_cost(resource):
    """Calculate total cost for a resource based on usage hours and cost per hour."""
    return resource.usage_hours * resource.cost_per_hour
