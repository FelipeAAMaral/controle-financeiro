# Financial Insight View

A comprehensive financial management application built with FastAPI, HTMX, and Tailwind CSS.

## Features

- User authentication and authorization
- Dashboard with financial overview
- Transaction management
- Recurring expenses tracking
- Financial goals tracking
- Beautiful and responsive UI with Tailwind CSS
- Real-time updates with HTMX

## Tech Stack

- Backend:
  - FastAPI
  - SQLAlchemy
  - PostgreSQL
  - Alembic for database migrations
  - JWT for authentication

- Frontend:
  - HTMX for dynamic updates
  - Tailwind CSS for styling
  - Alpine.js for interactivity
  - Chart.js for data visualization

## Prerequisites

- Python 3.8+
- PostgreSQL
- Node.js and npm (for Tailwind CSS)

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/financial-insight-view.git
cd financial-insight-view
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file in the root directory with the following content:
```env
# Application settings
PROJECT_NAME=Financial Insight View
VERSION=0.1.0
API_V1_STR=/api/v1

# Security
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/financial_insight

# CORS
CORS_ORIGINS=["http://localhost:8000", "http://localhost:3000"]
```

5. Create the database:
```bash
createdb financial_insight
```

6. Run database migrations:
```bash
alembic upgrade head
```

7. Install Tailwind CSS:
```bash
npm install -D tailwindcss
npx tailwindcss init
```

8. Build Tailwind CSS:
```bash
npx tailwindcss -i ./app/static/css/input.css -o ./app/static/css/tailwind.css --watch
```

9. Run the application:
```bash
uvicorn app.main:app --reload
```

The application will be available at http://localhost:8000

## Development

### Database Migrations

To create a new migration:
```bash
alembic revision --autogenerate -m "description of changes"
```

To apply migrations:
```bash
alembic upgrade head
```

To rollback migrations:
```bash
alembic downgrade -1  # Rollback one migration
```

### API Documentation

Once the application is running, you can access:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
