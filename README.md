# Cloud Cost Tracker

A full-stack web application for tracking, analyzing, and optimizing cloud resource costs. Built with a FastAPI backend and a React frontend.

## Features

- **Add Resources**: Track cloud resources (EC2, S3, RDS, Lambda, CloudFront, etc.) with custom pricing
- **Edit Resources**: Update name, type, usage hours, and cost per hour through a modal dialog
- **Delete Resources**: Remove unwanted resources with confirmation
- **Export Data**: Download resource data as CSV from the frontend
- **Cost Calculation**: Automatically calculate total and per-resource costs
- **Cost Insights**: Analytics on usage patterns with optimization recommendations
- **Resource Management**: Browse and manage all tracked resources in the dashboard
- **Input Validation**: Server-side validation ensures non-negative costs and valid usage values
- **Error Handling**: Friendly error messaging for form and API failures

## Tech Stack

### Backend
- **Python** - Server language
- **FastAPI** - Web API framework
- **SQLAlchemy** - ORM for database operations
- **Pydantic** - Request and response validation
- **SQLite** - Embedded database storage

### Frontend
- **React** - UI framework
- **Axios** - HTTP client for API communication
- **CSS3** - Styling with gradients, animations, and responsive layouts
- **JavaScript ES6+** - Modern JavaScript features

## Project Structure

```
Cloud Cost Tracker/
├── app/
│   ├── __init__.py              # FastAPI app factory and CORS setup
│   ├── database.py              # SQLAlchemy configuration
│   ├── models.py                # ORM models
│   ├── schemas.py               # Pydantic validation schemas
│   ├── api/
│   │   ├── __init__.py
│   │   └── routes.py            # API endpoints
│   └── services/
│       ├── __init__.py
│       └── cost_service.py      # Cost calculation logic
├── frontend/                    # React application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── services/            # API client
│   │   ├── utils/               # Export utilities
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   ├── .gitignore
│   └── .env.example
├── main.py                      # Application entry point
├── cloud_cost.db                # SQLite database file
└── README.md                    # This file
```

## Setup & Installation

### Prerequisites
- Python 3.9 or higher
- Node.js and npm

### Backend Setup

1. **Create a virtual environment**
```powershell
cd "Cloud Cost Tracker"
python -m venv .venv
.venv\Scripts\activate
```

2. **Install backend dependencies**
```powershell
pip install fastapi uvicorn sqlalchemy pydantic
```

3. **Run the backend**
```powershell
python main.py
```

The API will be available at `http://127.0.0.1:8000`.

### Frontend Setup

1. **Open a new terminal**

2. **Install frontend dependencies**
```powershell
cd frontend
npm install
```

3. **Start the React development server**
```powershell
npm start
```

The frontend will be available at `http://localhost:3000`.

## API Documentation

### Base URL
```
http://127.0.0.1:8000
```

### Endpoints

#### Create Resource
```
POST /resources/
```

#### Get All Resources
```
GET /resources/?skip=0&limit=10
```

#### Update Resource
```
PUT /resources/{resource_id}
```

#### Delete Resource
```
DELETE /resources/{resource_id}
```

#### Get Total Cost
```
GET /cost/
```

#### Get Insights
```
GET /insights/
```

#### Export Resources
```
GET /export/resources/
```

## Validation Rules

### Resource Data
- **Name**: required, 1-100 characters
- **Resource Type**: required, 1-50 characters
- **Usage Hours**: must be greater than 0 and no more than 8760
- **Cost per Hour**: must be greater than or equal to 0

## Running the Full App

1. Start the backend at `http://127.0.0.1:8000`
2. Start the frontend at `http://localhost:3000`
3. Use the React UI for adding, editing, deleting, and exporting resources

## Notes

- The frontend connects to the backend at `http://localhost:8000` by default.
- If you need a different backend URL, update `frontend/.env.local`.
- The frontend uses CSV export utilities to download resource data directly from the browser.

## Future Enhancements

- [ ] Authentication and user accounts
- [ ] Historical cost tracking and trends
- [ ] Budget alerts and notifications
- [ ] Dark mode theme
- [ ] Advanced filtering and search
- [ ] Cost forecasting
- [ ] Resource tagging and organization

- [ ] User authentication and multi-user support
- [ ] Database migrations using Alembic
- [ ] Unit and integration tests with pytest
- [ ] Cost trend tracking and charts
- [ ] Export reports to CSV/PDF
- [ ] Frontend framework migration (React/Vue)
- [ ] Docker containerization

## Development

### Running Tests
```bash
# (To be implemented)
pytest
```

### Database Reset
Delete `cloud_cost.db` and restart the application to reset the database.

## License

Open source - feel free to use for learning and projects.
