from sqlalchemy import Column, Integer, String, Float
from app.database import Base

class Resource(Base):
    __tablename__ = "resources"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    resource_type = Column(String, index=True, nullable=False)
    billing_type = Column(String, index=True, nullable=False, default="hourly")
    usage_hours = Column(Float, nullable=True)
    cost_per_hour = Column(Float, nullable=True)
    monthly_cost = Column(Float, nullable=True)
    billing_period_months = Column(Integer, nullable=False, default=1)
    request_count = Column(Integer, nullable=True)
    cost_per_request = Column(Float, nullable=True)
    storage_gb = Column(Float, nullable=True)
    cost_per_gb_month = Column(Float, nullable=True)
