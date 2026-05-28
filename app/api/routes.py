from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import Resource as ResourceModel
from app.schemas import ResourceCreate, ResourceUpdate, Resource
from app.services.cost_service import calculate_resource_cost, get_billing_details


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def register_routes(app):
    @app.post("/resources/", response_model=Resource)
    def create_resource(resource: ResourceCreate, db: Session = Depends(get_db)):
        """Create a new resource and add it to the database."""
        try:
            db_resource = ResourceModel(
                name=resource.name,
                resource_type=resource.resource_type,
                billing_type=resource.billing_type,
                usage_hours=resource.usage_hours,
                cost_per_hour=resource.cost_per_hour,
                monthly_cost=resource.monthly_cost,
                billing_period_months=resource.billing_period_months,
                request_count=resource.request_count,
                cost_per_request=resource.cost_per_request,
                storage_gb=resource.storage_gb,
                cost_per_gb_month=resource.cost_per_gb_month
            )
            db.add(db_resource)
            db.commit()
            db.refresh(db_resource)
            return db_resource
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to create resource: {str(e)}")

    @app.delete("/resources/{resource_id}", response_model=dict)
    def delete_resource(resource_id: int, db: Session = Depends(get_db)):
        """Delete a resource by ID."""
        try:
            resource = db.query(ResourceModel).filter(ResourceModel.id == resource_id).first()
            if not resource:
                raise HTTPException(status_code=404, detail=f"Resource with ID {resource_id} not found")
            db.delete(resource)
            db.commit()
            return {"message": f"Resource '{resource.name}' deleted successfully", "id": resource_id}
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to delete resource: {str(e)}")

    @app.put("/resources/{resource_id}", response_model=Resource)
    def update_resource(resource_id: int, resource_update: ResourceUpdate, db: Session = Depends(get_db)):
        """Update a resource by ID."""
        try:
            resource = db.query(ResourceModel).filter(ResourceModel.id == resource_id).first()
            if not resource:
                raise HTTPException(status_code=404, detail=f"Resource with ID {resource_id} not found")
            
            # Update only provided fields
            if resource_update.name is not None:
                resource.name = resource_update.name
            if resource_update.resource_type is not None:
                resource.resource_type = resource_update.resource_type
            if resource_update.usage_hours is not None:
                resource.usage_hours = resource_update.usage_hours
            if resource_update.cost_per_hour is not None:
                resource.cost_per_hour = resource_update.cost_per_hour
            if resource_update.billing_type is not None:
                resource.billing_type = resource_update.billing_type
            if resource_update.monthly_cost is not None:
                resource.monthly_cost = resource_update.monthly_cost
            if resource_update.billing_period_months is not None:
                resource.billing_period_months = resource_update.billing_period_months
            if resource_update.request_count is not None:
                resource.request_count = resource_update.request_count
            if resource_update.cost_per_request is not None:
                resource.cost_per_request = resource_update.cost_per_request
            if resource_update.storage_gb is not None:
                resource.storage_gb = resource_update.storage_gb
            if resource_update.cost_per_gb_month is not None:
                resource.cost_per_gb_month = resource_update.cost_per_gb_month
            
            db.commit()
            db.refresh(resource)
            return resource
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to update resource: {str(e)}")

    @app.get("/resources/", response_model=list[Resource])
    def get_resources(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
        """Get all resources with pagination support."""
        try:
            resources = db.query(ResourceModel).offset(skip).limit(limit).all()
            return resources
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to retrieve resources: {str(e)}")

    @app.get("/cost/", response_model=dict)
    def get_cost(db: Session = Depends(get_db)):
        """Calculate total cost and breakdown for all resources."""
        try:
            resources = db.query(ResourceModel).all()
            total_cost = 0
            breakdown = []
            for resource in resources:
                cost = calculate_resource_cost(resource)
                total_cost += cost
                breakdown.append({
                    "name": resource.name,
                    "resource_type": resource.resource_type,
                    "billing_type": resource.billing_type,
                    "usage_hours": resource.usage_hours,
                    "cost_per_hour": resource.cost_per_hour,
                    "monthly_cost": resource.monthly_cost,
                    "request_count": resource.request_count,
                    "cost_per_request": resource.cost_per_request,
                    "storage_gb": resource.storage_gb,
                    "cost_per_gb_month": resource.cost_per_gb_month,
                    "details": get_billing_details(resource),
                    "cost": cost
                })
            return {"total_cost": total_cost, "breakdown": breakdown}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to calculate costs: {str(e)}")

    @app.get("/insights/", response_model=dict)
    def get_insights(db: Session = Depends(get_db)):
        """Get insights and recommendations about resource usage."""
        try:
            resources = db.query(ResourceModel).all()

            if not resources:
                return {"message": "No resources available to analyze"}

            costs = []
            total_cost = 0

            for r in resources:
                cost = calculate_resource_cost(r)
                costs.append(cost)
                total_cost += cost

            avg_cost = total_cost / len(resources)

            most_expensive = max(resources, key=lambda r: calculate_resource_cost(r))
            least_expensive = min(resources, key=lambda r: calculate_resource_cost(r))

            underutilized = [r for r in resources if r.usage_hours is not None and r.usage_hours < 50]

            return {
                "total_resources": len(resources),
                "total_cost": total_cost,
                "average_cost_per_resource": avg_cost,
                "most_expensive_resource": {
                    "name": most_expensive.name,
                    "resource_type": most_expensive.resource_type
                },
                "least_expensive_resource": {
                    "name": least_expensive.name,
                    "resource_type": least_expensive.resource_type
                },
                "underutilized_resources": len(underutilized),
                "recommendation": "Consider removing or downsizing low-usage resources"
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to generate insights: {str(e)}")

    @app.get("/export/resources/", response_model=dict)
    def export_resources(db: Session = Depends(get_db)):
        """Export all resources with their costs as data for CSV/download."""
        try:
            resources = db.query(ResourceModel).all()
            
            data = []
            total_cost = 0
            
            for resource in resources:
                cost = calculate_resource_cost(resource)
                total_cost += cost
                data.append({
                    "ID": resource.id,
                    "Name": resource.name,
                    "Type": resource.resource_type,
                    "Billing Type": resource.billing_type,
                    "Details": get_billing_details(resource),
                    "Total Cost": f"${cost:.2f}"
                })
            
            return {
                "resources": data,
                "total_cost": total_cost,
                "total_resources": len(resources),
                "export_date": __import__('datetime').datetime.now().isoformat()
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to export resources: {str(e)}")
