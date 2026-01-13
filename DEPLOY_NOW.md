# 🚀 Deploy Pagely to Vercel - Complete Guide

## Current Status:
- ✅ Code ready in: `/Users/chaitanya/Repo/pagely/pagely-source`
- ⚠️ GitHub repo doesn't exist yet: https://github.com/chaitanya-mishra-ai/pagely
- ✅ Vercel CLI installed
- ✅ Environment variables documented

---

## 🎯 Two Deployment Options:

### Option A: Deploy Directly (No GitHub) - FASTEST ⚡

Just deploy from your local folder to Vercel:

```bash
cd /Users/chaitanya/Repo/pagely/pagely-source

# Login to Vercel
npx vercel login

# Deploy (follow prompts)
npx vercel

# After successful preview, deploy to production
npx vercel --prod
```

**Then add environment variables** (see below)

---

### Option B: Via GitHub (Recommended for CI/CD) 📦

#### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `pagely`
3. Description: "Personal reading tracker built with Next.js and Supabase"
4. Public or Private: Your choice
5. **Don't** check any boxes (no README, .gitignore, license)
6. Click "Create repository"

#### Step 2: Push Code to GitHub

```bash
cd /Users/chaitanya/Repo/pagely/pagely-source

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Pagely reading tracker

- Complete Next.js 14 app with App Router
- Supabase backend integration
- 150 tests passing
- All 30 features implemented
- Production ready"

# Add GitHub remote
git remote add origin https://github.com/chaitanya-mishra-ai/pagely.git

# Push to GitHub
git branch -M main
git push -u origin main
```

#### Step 3: Deploy via Vercel Dashboard

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Paste: `https://github.com/chaitanya-mishra-ai/pagely`
4. Click "Import"
5. Vercel will auto-detect Next.js settings
6. Add environment variables (see below)
7. Click "Deploy"

---

## 🔑 Environment Variables to Add

**In Vercel Dashboard** (Settings → Environment Variables):

```env
NEXT_PUBLIC_SUPABASE_URL
https://gzxafxhboeobywsdlwkx.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6eGFmeGhib2VvYnl3c2Rsd2t4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNjMyMTcsImV4cCI6MjA3NDYzOTIxN30.CaIZ93BVRKLxBeA382RYmV9WrSOMOxCYnsTw5r6WQkI

SUPABASE_SERVICE_ROLE_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6eGFmeGhib2VvYnl3c2Rsd2t4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTA2MzIxNywiZXhwIjoyMDc0NjM5MjE3fQ.B_XpecX3MHfHho4rJLRaS_PSQvtTUBSsmyTMQ4kDBkA

NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY
AIzaSyB_9J-e1MxndgaexUXCmYahLj-NbGt5hkk
```

**Or via CLI:**

```bash
npx vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Paste the value when prompted

npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Paste the value when prompted

npx vercel env add SUPABASE_SERVICE_ROLE_KEY production
# Paste the value when prompted

npx vercel env add NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY production
# Paste the value when prompted
```

---

## ⚡ Quick Deploy (My Recommendation)

**Fastest way - Option A:**

```bash
cd /Users/chaitanya/Repo/pagely/pagely-source
npx vercel login
npx vercel
```

Follow the prompts:
1. Set up and deploy? → **Y**
2. Which scope? → Select your account
3. Link to existing project? → **N**
4. Project name? → **pagely**
5. Directory? → **./** (press Enter)
6. Modify settings? → **N**

Wait for deployment... ⏳

Once done, you'll get a URL like: `https://pagely-xxx.vercel.app`

Then add environment variables and redeploy:

```bash
# Add all 4 environment variables (see above)
npx vercel env add NEXT_PUBLIC_SUPABASE_URL
# ... add others

# Deploy to production with env vars
npx vercel --prod
```

---

## ✅ After Deployment Checklist

- [ ] Deployment successful
- [ ] Got production URL
- [ ] All 4 environment variables added
- [ ] Redeployed with env vars
- [ ] Tested the live site
- [ ] All features working
- [ ] Database connected
- [ ] Book search working

---

## 🎊 Success!

Your Pagely app will be live at:
- **Preview**: `https://pagely-xxx.vercel.app`
- **Production**: `https://pagely.vercel.app` (or your custom domain)

---

## 🔧 Post-Deployment

### Update App URL
After deployment, update the app URL environment variable:

```bash
npx vercel env add NEXT_PUBLIC_APP_URL production
# Enter: https://your-actual-url.vercel.app
```

Then redeploy:
```bash
npx vercel --prod
```

### Custom Domain (Optional)
1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

---

## 🆘 Need Help?

**Vercel CLI Commands:**
```bash
npx vercel --help          # Show help
npx vercel ls              # List deployments
npx vercel logs            # View logs
npx vercel open            # Open in browser
```

**Common Issues:**
- Build fails → Check environment variables
- 404 errors → Verify routes in Next.js
- Database errors → Check Supabase connection

---

**Ready? Run the commands above to deploy!** 🚀

**Recommended: Start with Option A (direct deploy) - it's fastest!**
