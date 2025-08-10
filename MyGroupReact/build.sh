
#!/bin/bash

echo "Building MyGroup React Application for Production..."

# Install backend dependencies
echo "Installing backend dependencies..."
cd MyGroupReact/backend
npm install --production

# Install frontend dependencies and build
echo "Installing frontend dependencies..."
cd ../frontend
npm install --legacy-peer-deps

echo "Building frontend for production..."
npm run build

echo "Build completed successfully!"
echo "Backend available at: https://your-app-name.replit.app/api"
echo "Frontend available at: https://your-app-name.replit.app"
