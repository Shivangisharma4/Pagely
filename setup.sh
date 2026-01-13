#!/bin/bash

# Pagely Quick Setup Script
# This script helps you set up Pagely quickly

echo "================================================"
echo "🚀 Pagely Quick Setup"
echo "================================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed!"
    exit 1
fi

echo "✅ npm $(npm -v) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found"
    echo "📝 Creating .env.local from example..."
    cp .env.local.example .env.local
    echo "✅ Created .env.local"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env.local and add your credentials!"
    echo "   1. Supabase URL and keys"
    echo "   2. Google Books API key"
    echo ""
    echo "Press Enter to open .env.local in your default editor..."
    read
    
    # Try to open in various editors
    if command -v code &> /dev/null; then
        code .env.local
    elif command -v nano &> /dev/null; then
        nano .env.local
    elif command -v vim &> /dev/null; then
        vim .env.local
    else
        echo "Please edit .env.local manually"
    fi
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "================================================"
echo "📚 Next Steps:"
echo "================================================"
echo ""
echo "1. Make sure you've filled in .env.local with your credentials"
echo ""
echo "2. Set up your Supabase database:"
echo "   npx supabase link --project-ref YOUR_PROJECT_REF"
echo "   npx supabase db push"
echo ""
echo "3. Start the development server:"
echo "   npm run dev"
echo ""
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "================================================"
echo "✨ Setup Complete!"
echo "================================================"
echo ""
echo "For detailed instructions, see INSTALLATION_GUIDE.md"
echo ""
