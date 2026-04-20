# Cloud Cost Tracker

A full-stack web application for tracking, analyzing, and optimizing cloud resource costs. Built with FastAPI, SQLAlchemy, and vanilla JavaScript.

## Features

- **Add Resources**: Track cloud resources (EC2, S3, RDS, etc.) with custom pricing
- **Cost Calculation**: Automatically calculate total and per-resource costs
- **Cost Insights**: Get analytics on resource usage patterns and cost recommendations
- **Resource Management**: View all tracked resources with pagination
- **Input Validation**: Client and server-side validation for data integrity
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Reference Pricing**: Display common AWS service costs as a guide

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework with async support
- **SQLAlchemy** - ORM for database operations
- **Pydantic** - Data validation using Python type hints
- **SQLite** - Lightweight embedded database

### Frontend
- **HTML5** - Semantic markup
- **Vanilla JavaScript** - No framework dependencies
- **Fetch API** - For HTTP requests

## Project Structure

```
Cloud Cost Tracker/
├── app/
│   ├── __init__.py              # FastAPI app factory
│   ├── database.py              # SQLAlchemy configuration
│   ├── models.py                # SQLAlchemy ORM models
│   ├── schemas.py               # Pydantic validation schemas
│   ├── api/
│   │   ├── __init__.py
│   │   └── routes.py            # API endpoints
│   └── services/
│       ├── __init__.py
│       └── cost_service.py      # Business logic for cost calculations
├── frontend/
│   └── index.html               # Web UI
├── main.py                      # Application entry point
├── cloud_cost.db                # SQLite database
└── README.md                    # This file
```

## Setup & Installation

### Prerequisites
- Python 3.9 or higher
- pip (Python package installer)

### 1. Clone the Repository
```bash
cd "Cloud Cost Tracker"
```

### 2. Create Virtual Environment
```bash
# Windows
python -m venv .venv
.venv\Scripts\activate

# macOS/Linux
python -m venv .venv
source .venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install fastapi uvicorn sqlalchemy pydantic
```

### 4. Run the Application
```bash
# Option 1: Using uvicorn directly
uvicorn main:app --reload

# Option 2: Using Python
python main.py
```

The API will be available at `http://127.0.0.1:8000`

### 5. Open Frontend
Open `frontend/index.html` in your web browser

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
**Request Body:**
```json
{
  "name": "Production Server",
  "resource_type": "EC2",
  "usage_hours": 100,
  "cost_per_hour": 0.10
}
```
**Response:** Resource object with ID

#### Get All Resources
```
GET /resources/?skip=0&limit=10
```
**Response:**
```json
[
  {
    "id": 1,
    "name": "Production Server",
    "resource_type": "EC2",
    "usage_hours": 100,
    "cost_per_hour": 0.10
  }
]
```

#### Get Total Cost
```
GET /cost/
```
**Response:**
```json
{
  "total_cost": 10.50,
  "breakdown": [
    {
      "name": "Production Server",
      "resource_type": "EC2",
      "usage_hours": 100,
      "cost_per_hour": 0.10,
      "cost": 10.0
    }
  ]
}
```

#### Get Insights
```
GET /insights/
```
**Response:**
```json
{
  "total_resources": 3,
  "total_cost": 25.50,
  "average_cost_per_resource": 8.50,
  "most_expensive_resource": {
    "name": "Production DB",
    "resource_type": "RDS"
  },
  "least_expensive_resource": {
    "name": "Storage Bucket",
    "resource_type": "S3"
  },
  "underutilized_resources": 1,
  "recommendation": "Consider removing or downsizing low-usage resources"
}
```

## Reference Pricing

Common AWS service costs (per hour):
- **EC2**: $0.10/hour
- **S3**: $0.02/hour
- **RDS**: $0.15/hour

*Note: Actual pricing varies by region and instance type. Use these as guidelines.*

## Usage Example

1. **Add a Resource**
   - Enter resource name, type, usage hours, and cost per hour
   - Click "Add" button
   - Confirmation message will appear

2. **View Costs**
   - Click "Refresh Cost" to see total and breakdown
   - Results display in tabular JSON format

3. **Get Insights**
   - Click "Load Insights" for usage analytics
   - Includes recommendations for optimization

4. **List Resources**
   - Click "Load Resources" to see all tracked items
   - Supports pagination

## Validation Rules

### Resource Creation
- **Name**: 1-100 characters, required
- **Resource Type**: 1-50 characters, required
- **Usage Hours**: Must be positive, max 8760 (hours in a year)
- **Cost per Hour**: Must be positive

## Error Handling

The application includes comprehensive error handling:
- **Client-side validation**: Prevents invalid submissions
- **Server-side validation**: Pydantic enforces schemas
- **Database error handling**: Graceful rollback on failures
- **Network error handling**: User-friendly error messages

## Future Enhancements

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
