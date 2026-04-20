from pydantic import BaseModel, ConfigDict, Field

class ResourceCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100, description="Resource name")
    resource_type: str = Field(min_length=1, max_length=50, description="Resource type (e.g., EC2, S3)")
    usage_hours: float = Field(gt=0, le=8760, description="Usage hours per month (0-8760)")
    cost_per_hour: float = Field(gt=0, description="Cost per hour (must be positive)")

class Resource(BaseModel):
    id: int
    name: str
    resource_type: str
    usage_hours: float
    cost_per_hour: float
    
    model_config = ConfigDict(from_attributes=True)
