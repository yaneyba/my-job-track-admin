#!/bin/bash

# Deployment script for My Job Track Admin
# Usage: ./deploy.sh [environment]
# Environment options: development, staging, production

set -e

ENVIRONMENT=${1:-development}
BUILD_DIR="dist"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "🚀 Starting deployment for $ENVIRONMENT environment..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Run linting
echo "🔍 Running linter..."
npm run lint

# Run build
echo "🏗️  Building application..."
npm run build

# Create deployment package
echo "📦 Creating deployment package..."
PACKAGE_NAME="my-job-track-admin-${ENVIRONMENT}-${TIMESTAMP}.tar.gz"
tar -czf "$PACKAGE_NAME" -C "$BUILD_DIR" .

echo "✅ Build completed successfully!"
echo "📁 Build files are in: $BUILD_DIR"
echo "📦 Deployment package: $PACKAGE_NAME"

# Environment-specific deployment
case $ENVIRONMENT in
    "production")
        echo "🌟 Production deployment"
        echo "ℹ️  Please upload $PACKAGE_NAME to your production server"
        ;;
    "staging")
        echo "🧪 Staging deployment"
        echo "ℹ️  Please upload $PACKAGE_NAME to your staging server"
        ;;
    "development")
        echo "🔧 Development build complete"
        echo "ℹ️  Run 'npm run preview' to test the build locally"
        ;;
esac

echo "🎉 Deployment preparation complete!"
