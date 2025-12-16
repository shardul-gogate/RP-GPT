#!/bin/bash

# This script starts the backend and frontend servers.
# It's designed to be run from the root of the project.

# Exit on error
set -e

# Function to clean up background processes on exit
cleanup() {
    echo "Shutting down servers..."
    # Kill all background jobs of this script
    kill $(jobs -p) >/dev/null 2>&1
}

# Register the cleanup function to be called on script exit
trap cleanup EXIT

# Start the backend server in the background
echo "Starting backend server..."
cd node
node server.js &
cd ..

# Start the frontend server in the foreground
echo "Starting frontend development server..."
npm start
