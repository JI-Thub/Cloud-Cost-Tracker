from sqlalchemy import Column, Integer, String, Float
from app.database import Base

class Resource(Base):
    __tablename__ = "resources"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    resource_type = Column(String, index=True)
    usage_hours = Column(Float)
    cost_per_hour = Column(Float)
