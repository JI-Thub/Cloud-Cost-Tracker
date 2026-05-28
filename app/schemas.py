from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

BILLING_TYPES = ["hourly", "monthly", "per_request", "storage_gb_month"]

class ResourceCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100, description="Resource name")
    resource_type: str = Field(min_length=1, max_length=50, description="Resource type (e.g., EC2, S3)")
    billing_type: str = Field(default="hourly", description="Billing type for this resource")
    usage_hours: float | None = Field(None, ge=0, le=8760, description="Usage hours per month")
    cost_per_hour: float | None = Field(None, ge=0, description="Cost per hour")
    monthly_cost: float | None = Field(None, ge=0, description="Fixed monthly cost")
    billing_period_months: int | None = Field(None, ge=1, description="Number of months for monthly billing")
    request_count: int | None = Field(None, ge=0, description="Monthly request count")
    cost_per_request: float | None = Field(None, ge=0, description="Cost per request")
    storage_gb: float | None = Field(None, ge=0, description="Storage size in GB per month")
    cost_per_gb_month: float | None = Field(None, ge=0, description="Cost per GB per month")

    model_config = ConfigDict(from_attributes=True)

    @field_validator("billing_type", mode="before")
    def normalize_billing_type(cls, value):
        if isinstance(value, str):
            return value.strip().lower()
        return value

    @model_validator(mode="after")
    def check_pricing_fields(self):
        if self.billing_type not in BILLING_TYPES:
            raise ValueError(f"Unsupported billing type: {self.billing_type}")

        if self.billing_type == "hourly":
            if self.usage_hours is None or self.cost_per_hour is None:
                raise ValueError("Hourly billing requires usage_hours and cost_per_hour")
        elif self.billing_type == "monthly":
            if self.monthly_cost is None or self.billing_period_months is None:
                raise ValueError("Monthly billing requires monthly_cost and billing_period_months")
        elif self.billing_type == "per_request":
            if self.request_count is None or self.cost_per_request is None:
                raise ValueError("Per-request billing requires request_count and cost_per_request")
        elif self.billing_type == "storage_gb_month":
            if self.storage_gb is None or self.cost_per_gb_month is None:
                raise ValueError("Storage billing requires storage_gb and cost_per_gb_month")
        return self

class ResourceUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=100, description="Resource name")
    resource_type: str | None = Field(None, min_length=1, max_length=50, description="Resource type (e.g., EC2, S3)")
    billing_type: str | None = Field(None, description="Billing type for this resource")
    usage_hours: float | None = Field(None, ge=0, le=8760, description="Usage hours per month")
    cost_per_hour: float | None = Field(None, ge=0, description="Cost per hour")
    monthly_cost: float | None = Field(None, ge=0, description="Fixed monthly cost")
    billing_period_months: int | None = Field(None, ge=1, description="Number of months for monthly billing")
    request_count: int | None = Field(None, ge=0, description="Monthly request count")
    cost_per_request: float | None = Field(None, ge=0, description="Cost per request")
    storage_gb: float | None = Field(None, ge=0, description="Storage size in GB per month")
    cost_per_gb_month: float | None = Field(None, ge=0, description="Cost per GB per month")

    model_config = ConfigDict(from_attributes=True)

    @field_validator("billing_type", mode="before")
    def normalize_billing_type(cls, value):
        if isinstance(value, str):
            return value.strip().lower()
        return value

class Resource(BaseModel):
    id: int
    name: str
    resource_type: str
    billing_type: str
    usage_hours: float | None = None
    cost_per_hour: float | None = None
    monthly_cost: float | None = None
    billing_period_months: int | None = None
    request_count: int | None = None
    cost_per_request: float | None = None
    storage_gb: float | None = None
    cost_per_gb_month: float | None = None
    total_cost: float | None = None

    model_config = ConfigDict(from_attributes=True)
