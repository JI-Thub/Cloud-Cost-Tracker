from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import Resource as ResourceModel
from app.schemas import ResourceCreate, Resource
from app.services.cost_service import calculate_resource_cost


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
                usage_hours=resource.usage_hours,
                cost_per_hour=resource.cost_per_hour
            )
            db.add(db_resource)
            db.commit()
            db.refresh(db_resource)
            return db_resource
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to create resource: {str(e)}")

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
                    "usage_hours": resource.usage_hours,
                    "cost_per_hour": resource.cost_per_hour,
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

            underutilized = [r for r in resources if r.usage_hours < 50]

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
