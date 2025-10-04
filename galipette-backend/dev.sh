#!/bin/bash

# Bash script for Galipette Backend Development

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to display help
show_help() {
    echo -e "${GREEN}Galipette Backend Development Scripts${NC}"
    echo ""
    echo "Available commands:"
    echo "  start     - Start the development environment (PostgreSQL + Backend)"
    echo "  stop      - Stop the development environment"
    echo "  restart   - Restart the development environment"
    echo "  logs      - Show logs from all services"
    echo "  db        - Connect to PostgreSQL database"
    echo "  migrate   - Run database migrations"
    echo "  reset     - Reset database and restart services"
    echo "  clean     - Clean up Docker containers and volumes"
    echo ""
}

# Function to start services
start_services() {
    echo -e "${YELLOW}Starting Galipette development environment...${NC}"
    docker-compose up -d
    echo -e "${GREEN}Services started! Backend available at http://localhost:3000${NC}"
}

# Function to stop services
stop_services() {
    echo -e "${YELLOW}Stopping Galipette development environment...${NC}"
    docker-compose down
    echo -e "${GREEN}Services stopped!${NC}"
}

# Function to restart services
restart_services() {
    echo -e "${YELLOW}Restarting Galipette development environment...${NC}"
    docker-compose down
    docker-compose up -d
    echo -e "${GREEN}Services restarted!${NC}"
}

# Function to show logs
show_logs() {
    docker-compose logs -f
}

# Function to connect to database
connect_database() {
    echo -e "${YELLOW}Connecting to PostgreSQL database...${NC}"
    docker-compose exec postgres psql -U postgres -d galipette_db
}

# Function to run migrations
run_migrations() {
    echo -e "${YELLOW}Running database migrations...${NC}"
    docker-compose exec backend npm exec --workspace=galipette-backend -- prisma migrate dev
}

# Function to reset database
reset_database() {
    echo -e "${YELLOW}Resetting database...${NC}"
    docker-compose down -v
    docker-compose up -d postgres
    sleep 5
    docker-compose up -d backend
    echo -e "${GREEN}Database reset complete!${NC}"
}

# Function to clean up
clean_up() {
    echo -e "${YELLOW}Cleaning up Docker containers and volumes...${NC}"
    docker-compose down -v --remove-orphans
    docker system prune -f
    echo -e "${GREEN}Cleanup complete!${NC}"
}

# Main script logic
COMMAND=${1:-help}

case $COMMAND in
    start)
        start_services
        ;;
    stop)
        stop_services
        ;;
    restart)
        restart_services
        ;;
    logs)
        show_logs
        ;;
    db)
        connect_database
        ;;
    migrate)
        run_migrations
        ;;
    reset)
        reset_database
        ;;
    clean)
        clean_up
        ;;
    help)
        show_help
        ;;
    *)
        echo -e "${RED}Unknown command: $COMMAND${NC}"
        show_help
        ;;
esac

