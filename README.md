# Health Intelligence Network API

A self-improving health intelligence network for rural disease prevention, enabling district health administrators, coordinators, and field workers to collaboratively manage and track health data across villages and districts.

## Product Vision

Create a self-improving health intelligence network where every district contributes to regional disease prevention patterns, every intervention refines predictive accuracy, and progressively healthier rural communities emerge through transparent, data-driven, collaborative preventive care.

## Target Audience

- **District Health Administrators**: Managing strategic planning and resource allocation
- **Health Coordinators**: Overseeing operational deployment across village clusters
- **Field Health Workers**: Delivering frontline care and collecting ground-truth observations

## Core Features

- **CRUD Operations**: Complete Create, Read, Update, Delete operations for:
  - Districts (health administrative units)
  - Villages (village clusters within districts)
  - Health Records (disease observations and interventions)
- **Data Tracking**: Track disease cases, severity levels, and intervention outcomes
- **Geographic Organization**: Hierarchical structure from districts to villages
- **Field Worker Support**: Record health observations with metadata

## Technology Stack

- **Backend Framework**: FastAPI (Python)
- **Database**: SQLite (SQLAlchemy ORM)
- **API Style**: RESTful
- **Architecture**: Modular Monolith

## Prerequisites

- Python 3.9 or higher
- pip (Python package manager)

## Installation

1. **Clone or navigate to the project directory**

```bash
cd /path/to/project
```

2. **Create a virtual environment**

```bash
python -m venv venv
```

3. **Activate the virtual environment**

On Linux/Mac:
```bash
source venv/bin/activate
```

On Windows:
```bash
venv\Scripts\activate
```

4. **Install dependencies**

```bash
pip install -r backend/requirements.txt
```

5. **Set up environment variables**

```bash
cp .env.example .env
```

Edit `.env` file and update the configuration values as needed, especially:
- `SECRET_KEY`: Use a strong random string in production
- `DATABASE_URL`: Update if using a different database

## Running the Application

### Development Mode

```bash
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Or run directly:

```bash
python backend/main.py
```

The API will be available at: `http://localhost:8000`

### API Documentation

Once the application is running, access the interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Health Check
- `GET /` - Root endpoint
- `GET /health` - Health check endpoint

### Districts
- `POST /api/v1/districts` - Create a new district
- `GET /api/v1/districts` - List all districts
- `GET /api/v1/districts/{district_id}` - Get a specific district
- `PUT /api/v1/districts/{district_id}` - Update a district
- `DELETE /api/v1/districts/{district_id}` - Delete a district

### Villages
- `POST /api/v1/villages` - Create a new village
- `GET /api/v1/villages` - List all villages
- `GET /api/v1/villages/{village_id}` - Get a specific village
- `PUT /api/v1/villages/{village_id}` - Update a village
- `DELETE /api/v1/villages/{village_id}` - Delete a village

### Health Records
- `POST /api/v1/health-records` - Create a new health record
- `GET /api/v1/health-records` - List all health records
- `GET /api/v1/health-records/{record_id}` - Get a specific health record
- `PUT /api/v1/health-records/{record_id}` - Update a health record
- `DELETE /api/v1/health-records/{record_id}` - Delete a health record

## Project Structure

```
.
├── backend/
│   ├── main.py              # Main FastAPI application
│   ├── config.py            # Configuration management
│   ├── models.py            # SQLAlchemy database models
│   ├── database.py          # Database connection and session
│   ├── routers/
│   │   └── health_data.py   # API routes for health data
│   └── requirements.txt     # Python dependencies
├── .env.example             # Environment variables template
└── README.md                # This file
```

## Database Models

### District
- Administrative health unit with population and area information
- Contains multiple villages

### Village
- Village cluster within a district
- Has geographic coordinates and population data

### Health Record
- Disease observations and intervention records
- Links to specific district and village
- Tracks severity, interventions, and outcomes

### Predictive Pattern
- Machine learning patterns for disease prevention
- Confidence scores and metadata

## Environment Variables

Key environment variables (see `.env.example` for full list):

- `DATABASE_URL`: Database connection string
- `SECRET_KEY`: Secret key for security operations
- `DEBUG`: Enable/disable debug mode
- `HOST`: Server host address
- `PORT`: Server port number
- `ALLOWED_ORIGINS`: CORS allowed origins

## Security Features

- Input validation using Pydantic models
- SQL injection prevention through SQLAlchemy ORM
- CORS middleware configuration
- Environment-based configuration
- Secure password handling ready (for future authentication)

## Development

### Database Initialization

The database tables are automatically created when the application starts. The SQLite database file will be created in the project root directory.

### Adding New Features

1. Define models in `backend/models.py`
2. Create Pydantic schemas in route files
3. Implement endpoints in `backend/routers/`
4. Register routers in `backend/main.py`

## Architecture

The application follows a **Modular Monolith** architecture:

- **Clear separation of concerns**: Models, routes, configuration, and database logic are separated
- **Single deployment unit**: All components run as one application
- **Shared database**: All modules use the same database
- **Module boundaries**: Each router handles a specific domain (districts, villages, health records)

## Logging

The application includes structured logging:
- Application events are logged with timestamps
- Database operations are tracked
- Error conditions are logged with details

## Future Enhancements

- Authentication and authorization
- Advanced analytics and reporting
- Predictive pattern generation
- Real-time notifications
- Mobile application support
- Data export capabilities

## Support

For issues or questions, refer to the API documentation at `/docs` when the application is running.
