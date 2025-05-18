#!/bin/bash

# Make the script executable
chmod +x dev.sh

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if a service is running
service_is_running() {
    docker-compose ps -q "$1" | grep -q .
}

# Function to create environment files
create_env_files() {
    # Create .env file if it doesn't exist
    if [ ! -f .env ]; then
        echo "Creating .env file..."
        cat > .env << EOL
# Application settings
PROJECT_NAME=Financial Insight View
VERSION=0.1.0
API_V1_STR=/api/v1
ENVIRONMENT=development

# Security
SECRET_KEY=$(openssl rand -hex 32)
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Database
DATABASE_URL=postgresql://postgres:postgres@db:5432/financial_insight

# Redis
REDIS_URL=redis://redis:6379/0

# CORS
BACKEND_CORS_ORIGINS=["http://localhost:8000","http://localhost:3000"]

# Supabase
SUPABASE_URL=your-supabase-project-url
SUPABASE_KEY=your-supabase-anon-key
SUPABASE_JWT_SECRET=your-supabase-jwt-secret
EOL
        echo "Please update the Supabase credentials in the .env file"
    fi
}

# Function to start development environment
start_dev() {
    echo "Starting development environment..."
    
    # Stop any running containers and remove volumes
    echo "Cleaning up..."
    docker-compose down -v

    # Build and start the containers
    echo "Building and starting containers..."
    docker-compose up --build -d

    # Wait for PostgreSQL to be ready
    echo "Waiting for PostgreSQL to be ready..."
    sleep 10

    # Check if web service is running
    if ! service_is_running web; then
        echo "Error: Web service failed to start. Check the logs with 'docker-compose logs web'"
        exit 1
    fi

    # Run database migrations
    echo "Running database migrations..."
    docker-compose exec web alembic upgrade head

    # Check if migrations were successful
    if [ $? -ne 0 ]; then
        echo "Error: Database migrations failed"
        exit 1
    fi

    # Start Tailwind CSS watcher in development mode
    echo "Starting Tailwind CSS watcher..."
    docker-compose exec -d web npm run watch:css

    # Show logs
    echo "Development environment is ready!"
    echo "The application is available at http://localhost:8000"
    echo "Showing logs (press Ctrl+C to stop)..."
    echo "----------------------------------------"
    docker-compose logs -f web

    # Keep the script running and handle Ctrl+C
    trap 'docker-compose down; exit' INT
    wait
}

# Function to show help
show_help() {
    echo "Usage: ./dev.sh [command]"
    echo ""
    echo "Commands:"
    echo "  start     Start the development environment with hot reload"
    echo "  help      Show this help message"
    echo ""
    echo "Example:"
    echo "  ./dev.sh start    # Start development environment"
}

# Check if Docker is installed
if ! command_exists docker; then
    echo "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command_exists docker-compose; then
    echo "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create environment files
create_env_files

# Parse command line arguments
case "$1" in
    "start")
        start_dev
        ;;
    "help"|"")
        show_help
        ;;
    *)
        echo "Unknown command: $1"
        show_help
        exit 1
        ;;
esac 