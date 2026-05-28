from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect, text

from app.database import Base, engine
from app.models import Resource as ResourceModel
from app.api.routes import register_routes


def ensure_database_schema():
    inspector = inspect(engine)
    if not inspector.has_table(ResourceModel.__tablename__):
        Base.metadata.create_all(bind=engine)
        return

    existing_columns = {column["name"] for column in inspector.get_columns(ResourceModel.__tablename__)}
    for column in ResourceModel.__table__.columns:
        if column.name not in existing_columns:
            type_name = column.type.compile(engine.dialect)
            nullable = "NULL" if column.nullable else "NOT NULL"
            default_clause = ""

            if column.default is not None and column.default.arg is not None:
                default_value = column.default.arg
                if isinstance(default_value, str):
                    default_clause = f" DEFAULT '{default_value}'"
                else:
                    default_clause = f" DEFAULT {default_value}"

            ddl = f"ALTER TABLE {ResourceModel.__tablename__} ADD COLUMN {column.name} {type_name}{default_clause} {nullable}"
            with engine.begin() as conn:
                conn.exec_driver_sql(ddl)

    if "billing_type" not in existing_columns:
        with engine.begin() as conn:
            conn.exec_driver_sql(
                f"UPDATE {ResourceModel.__tablename__} SET billing_type='hourly' WHERE billing_type IS NULL"
            )


def create_app():
    app = FastAPI()
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"]
    )
    
    @app.on_event("startup")
    def startup_event():
        ensure_database_schema()
    
    register_routes(app)

    @app.get("/")
    def root():
        return {"message": "Cloud Cost Tracker API is running"}
    
    return app


app = create_app()
