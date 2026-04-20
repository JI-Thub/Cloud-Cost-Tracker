from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine


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
        Base.metadata.create_all(bind=engine)
    
    @app.get("/")
    def root():
        return {"message": "Cloud Cost Tracker API is running"}
    
    return app


app = create_app()
