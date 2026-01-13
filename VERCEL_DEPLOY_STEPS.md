# 🚀 Deploy Pagely to Vercel - Step by Step

Your GitHub repo: https://github.com/chaitanya-mishra-ai/pagely

---

## 📋 Deployment Steps

### Step 1: Login to Vercel

```bash
cd /Users/chaitanya/Repo/pagely/pagely-source
npx vercel login
```

This will:
1. Open your browser
2. Ask you to verify your email
3. Confirm login in terminal

### Step 2: Link to Your GitHub Repo (Optional)

First, let's initialize git in this folder and connect to your repo:

```bash
# Initialize git
git init

# Add your GitHub repo as remote
git remote add origin https://github.com/chaitanya-mishra-ai/pagely.git

# Fetch the repo
git fetch origin

# Set up tracking
git branch --set-upstream-to=origin/main main
```

### Step 3: Deploy to Vercel

```bash
npx vercel
```

**Answer the prompts:**
- Set up and deploy? → **Y** (Yes)
- Which scope? → Select your account
- Link to existing project? → **N** (No, create new)
- What's your project's name? → **pagely** (or press Enter)
- In which directory is your code located? → **./** (press Enter)
- Want to modify settings? → **N** (No)

Vercel will:
1. Build your app
2. Deploy to a preview URL
3. Give you a URL like: `https://pagely-xxx.vercel.app`

### Step 4: Add Environment Variables

After deployment, add your environment variables:

```bash
npx vercel env add NEXT_PUBLIC_SUPABASE_URL
```
Enter: `https://gzxafxhboeobywsdlwkx.supabase.co`

```bash
npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
```
Enter: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6eGFmeGhib2VvYnl3c2Rsd2t4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNjMyMTcsImV4cCI6MjA3NDYzOTIxN30.CaIZ93BVRKLxBeA382RYmV9WrSOMOxCYnsTw5r6WQkI`

```bash
npx vercel env add SUPABASE_SERVICE_ROLE_KEY
```
Enter: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6eGFmeGhib2VvYnl3c2Rsd2t4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTA2MzIxNywiZXhwIjoyMDc0NjM5MjE3fQ.B_XpecX3MHfHho4rJLRaS_PSQvtTUBSsmyTMQ4kDBkA`

```bash
npx vercel env add NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY
```
Enter: `AIzaSyB_9J-e1MxndgaexUXCmYahLj-NbGt5hkk`

For each variable, when asked:
- Which Environments? → Select **Production, Preview, Development** (use space to select, enter to confirm)

### Step 5: Deploy to Production

```bash
npx vercel --prod
```

This will deploy to your production URL!

---

## 🎯 Alternative: Deploy via Vercel Dashboard

If CLI is giving issues, use the dashboard:

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Enter: `https://github.com/chaitanya-mishra-ai/pagely`
4. Click "Import"
5. Configure:
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`
6. Add Environment Variables (click "Environment Variables"):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://gzxafxhboeobywsdlwkx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6eGFmeGhib2VvYnl3c2Rsd2t4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNjMyMTcsImV4cCI6MjA3NDYzOTIxN30.CaIZ93BVRKLxBeA382RYmV9WrSOMOxCYnsTw5r6WQkI
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6eGFmeGhib2VvYnl3c2Rsd2t4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTA2MzIxNywiZXhwIjoyMDc0NjM5MjE3fQ.B_XpecX3MHfHho4rJLRaS_PSQvtTUBSsmyTMQ4kDBkA
   NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY=AIzaSyB_9J-e1MxndgaexUXCmYahLj-NbGt5hkk
   ```
7. Click "Deploy"

---

## ✅ After Deployment

1. **Get your URL**: Vercel will give you a URL like `https://pagely.vercel.app`
2. **Test it**: Visit the URL and test all features
3. **Update App URL**: 
   ```bash
   npx vercel env add NEXT_PUBLIC_APP_URL
   ```
   Enter your production URL
4. **Redeploy**:
   ```bash
   npx vercel --prod
   ```

---

## 🔧 Useful Commands

```bash
# Check deployment status
npx vercel ls

# View logs
npx vercel logs

# Open project in browser
npx vercel open

# Remove deployment
npx vercel rm [deployment-url]
```

---

## 🆘 Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Make sure Node.js version is 18+

### Environment Variables Not Working
- Redeploy after adding variables
- Check variable names match exactly
- Verify they're set for Production environment

### Database Connection Issues
- Verify Supabase URL and keys are correct
- Check Supabase project is not paused
- Test connection in Supabase dashboard

---

## 📝 Notes

- First deployment creates a preview URL
- Use `--prod` flag for production deployment
- Vercel auto-deploys on git push (if connected to GitHub)
- You can have multiple deployments (preview, production)

---

**Ready to deploy!** Run the commands above to get Pagely live! 🚀
