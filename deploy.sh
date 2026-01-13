#!/bin/bash

echo "🚀 Deploying Pagely to Vercel..."
echo ""

# Check if logged in
echo "✓ Checking Vercel login..."
npx vercel whoami

echo ""
echo "📦 Starting deployment..."
echo ""

# Deploy to Vercel
npx vercel --yes

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "1. Copy the deployment URL from above"
echo "2. Add environment variables in Vercel dashboard"
echo "3. Redeploy with: npx vercel --prod"
echo ""
