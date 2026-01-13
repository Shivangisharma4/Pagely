# 🚀 Deploy Pagely from Private GitHub Repo

Your private repo: https://github.com/chaitanya-mishra-ai/pagely

---

## ⚡ Deploy via Vercel Dashboard (Easiest for Private Repos)

### Step 1: Go to Vercel
https://vercel.com/new

### Step 2: Import Your Private Repository

1. Click "Import Git Repository"
2. If you don't see your repo, click "Adjust GitHub App Permissions"
3. Grant Vercel access to your private repo
4. Select: `chaitanya-mishra-ai/pagely`
5. Click "Import"

### Step 3: Configure Project

Vercel will auto-detect Next.js. Verify settings:
- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `./`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### Step 4: Add Environment Variables

Click "Environment Variables" and add these 4 variables:

**Variable 1:**
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://gzxafxhboeobywsdlwkx.supabase.co
```

**Variable 2:**
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6eGFmeGhib2VvYnl3c2Rsd2t4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNjMyMTcsImV4cCI6MjA3NDYzOTIxN30.CaIZ93BVRKLxBeA382RYmV9WrSOMOxCYnsTw5r6WQkI
```

**Variable 3:**
```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6eGFmeGhib2VvYnl3c2Rsd2t4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTA2MzIxNywiZXhwIjoyMDc0NjM5MjE3fQ.B_XpecX3MHfHho4rJLRaS_PSQvtTUBSsmyTMQ4kDBkA
```

**Variable 4:**
```
Name: NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY
Value: AIzaSyB_9J-e1MxndgaexUXCmYahLj-NbGt5hkk
```

### Step 5: Deploy!

Click "Deploy" and wait 2-3 minutes.

---

## 🎯 Alternative: Vercel CLI

If you prefer CLI:

```bash
cd /Users/chaitanya/Repo/pagely/pagely-source

# Login to Vercel
npx vercel login

# Link to your GitHub repo
npx vercel link

# Deploy
npx vercel --prod
```

When prompted:
- Link to existing project? → **N** (create new)
- Project name? → **pagely**
- Directory? → **./**

Then add environment variables via dashboard or CLI.

---

## ✅ After Deployment

1. **Get your URL**: Something like `https://pagely-xxx.vercel.app`
2. **Test it**: Visit the URL
3. **Add final env var**:
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Add: `NEXT_PUBLIC_APP_URL` = `https://your-actual-url.vercel.app`
   - Redeploy

---

## 🔑 Quick Copy-Paste for Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://gzxafxhboeobywsdlwkx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6eGFmeGhib2VvYnl3c2Rsd2t4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNjMyMTcsImV4cCI6MjA3NDYzOTIxN30.CaIZ93BVRKLxBeA382RYmV9WrSOMOxCYnsTw5r6WQkI
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6eGFmeGhib2VvYnl3c2Rsd2t4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTA2MzIxNywiZXhwIjoyMDc0NjM5MjE3fQ.B_XpecX3MHfHho4rJLRaS_PSQvtTUBSsmyTMQ4kDBkA
NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY=AIzaSyB_9J-e1MxndgaexUXCmYahLj-NbGt5hkk
```

---

**Ready to deploy!** 🚀

**Recommended: Use Vercel Dashboard - it's easier for private repos!**

Go to: https://vercel.com/new
