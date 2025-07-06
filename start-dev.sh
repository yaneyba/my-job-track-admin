#!/bin/bash

# Development script to run both main app and admin interface
# Make sure you have both applications set up

echo "🚀 Starting My Job Track Development Environment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the my-job-track-admin directory"
    exit 1
fi

# Function to kill background processes on exit
cleanup() {
    echo "🛑 Stopping development servers..."
    kill $(jobs -p) 2>/dev/null || true
    exit
}

# Set up cleanup on script exit
trap cleanup EXIT INT TERM

# Start the main job track API (assuming it's in the parent directory)
if [ -d "../my-job-track" ]; then
    echo "🔄 Starting main Job Track API..."
    cd ../my-job-track
    if [ -f "package.json" ]; then
        npm run dev &
        API_PID=$!
        echo "✅ Main API started (PID: $API_PID)"
    else
        echo "⚠️  No package.json found in main app directory"
    fi
    cd - > /dev/null
else
    echo "⚠️  Main app directory not found. Admin will run without API."
fi

# Give the API time to start
sleep 3

# Start the admin interface
echo "🔄 Starting Admin Interface..."
npm run dev &
ADMIN_PID=$!
echo "✅ Admin interface started (PID: $ADMIN_PID)"

echo ""
echo "🎉 Development environment is ready!"
echo "📊 Admin Interface: http://localhost:3001"
echo "🔌 API Server: http://localhost:8787"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for all background processes
wait
