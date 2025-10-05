#!/bin/bash

echo "🚀 Starting deployment..."

# Pull latest changes
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
npm install
cd backend && npm install
cd ../frontend && npm install && cd ..

# Build applications
echo "🔨 Building applications..."
cd backend && npm run build
cd ../frontend && npm run build && cd ..

# Run database migrations
echo "🗄️ Running database migrations..."
npm run prisma:migrate

# Restart PM2 processes
echo "🔄 Restarting applications..."
pm2 restart ecosystem.config.js

echo "✅ Deployment complete!"