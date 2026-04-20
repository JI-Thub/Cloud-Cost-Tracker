import uvicorn
from app import app
from app.api.routes import register_routes

# Register all routes
register_routes(app)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)