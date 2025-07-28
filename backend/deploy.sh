#!/bin/bash

# =============================================================================
# PRODUCTION DEPLOYMENT SCRIPT
# =============================================================================

set -e  # Exit on any error

echo "🚀 Starting production deployment..."

# =============================================================================
# CONFIGURATION
# =============================================================================
APP_NAME="portfolio-backend"
DOCKER_IMAGE="portfolio-backend:latest"
CONTAINER_NAME="portfolio-backend"
NETWORK_NAME="portfolio-network"
DB_CONTAINER_NAME="portfolio-db"
REDIS_CONTAINER_NAME="portfolio-redis"

# =============================================================================
# FUNCTIONS
# =============================================================================

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

check_dependencies() {
    log "📋 Checking dependencies..."
    
    if ! command -v docker &> /dev/null; then
        echo "❌ Docker is not installed"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        echo "❌ Docker Compose is not installed"
        exit 1
    fi
    
    log "✅ Dependencies check passed"
}

backup_database() {
    log "💾 Creating database backup..."
    
    if docker ps -q -f name=$DB_CONTAINER_NAME | grep -q .; then
        docker exec $DB_CONTAINER_NAME pg_dump -U postgres ashish_portfolio > backup_$(date +%Y%m%d_%H%M%S).sql
        log "✅ Database backup created"
    else
        log "⚠️  Database container not running, skipping backup"
    fi
}

build_image() {
    log "🔨 Building Docker image..."
    docker build -t $DOCKER_IMAGE .
    log "✅ Docker image built successfully"
}

stop_services() {
    log "🛑 Stopping existing services..."
    docker-compose down || true
    log "✅ Services stopped"
}

start_services() {
    log "🚀 Starting services..."
    docker-compose up -d
    log "✅ Services started"
}

wait_for_health() {
    log "🏥 Waiting for health checks..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
            log "✅ Health check passed"
            return 0
        fi
        
        log "⏳ Health check attempt $attempt/$max_attempts..."
        sleep 10
        attempt=$((attempt + 1))
    done
    
    log "❌ Health check failed after $max_attempts attempts"
    return 1
}

run_migrations() {
    log "🔄 Running database migrations..."
    docker exec $CONTAINER_NAME npm run migration:run || true
    log "✅ Migrations completed"
}

initialize_admin() {
    log "👤 Initializing admin user..."
    docker exec $CONTAINER_NAME npm run init-admin || true
    log "✅ Admin user initialized"
}

cleanup() {
    log "🧹 Cleaning up old images..."
    docker image prune -f
    log "✅ Cleanup completed"
}

# =============================================================================
# MAIN DEPLOYMENT PROCESS
# =============================================================================

main() {
    log "🎯 Starting deployment for $APP_NAME"
    
    # Check dependencies
    check_dependencies
    
    # Backup database
    backup_database
    
    # Build new image
    build_image
    
    # Stop existing services
    stop_services
    
    # Start services
    start_services
    
    # Wait for health check
    if wait_for_health; then
        # Run migrations
        run_migrations
        
        # Initialize admin
        initialize_admin
        
        # Cleanup
        cleanup
        
        log "🎉 Deployment completed successfully!"
        log "📊 Application is running at http://localhost:3000"
        log "🔍 Health check: http://localhost:3000/api/health"
    else
        log "❌ Deployment failed - health check timeout"
        exit 1
    fi
}

# =============================================================================
# SCRIPT EXECUTION
# =============================================================================

# Check if script is run with correct arguments
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "Usage: $0 [--help]"
    echo ""
    echo "Options:"
    echo "  --help, -h    Show this help message"
    echo ""
    echo "This script deploys the portfolio backend to production."
    exit 0
fi

# Run main deployment
main "$@" 