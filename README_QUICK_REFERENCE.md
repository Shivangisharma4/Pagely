# 📚 Pagely - Quick Reference Guide

Your complete reading tracker is running at: **http://localhost:3000**

---

## ⚡ Quick Commands

```bash
# Start the app
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Restart if needed
pkill -f node && npm run dev
```

---

## 🔑 Your Credentials

**Supabase**
- Project ID: `gzxafxhboeobywsdlwkx`
- URL: `https://gzxafxhboeobywsdlwkx.supabase.co`
- Dashboard: https://app.supabase.com/project/gzxafxhboeobywsdlwkx

**Google Books API**
- Key: `AIzaSyB_9J-e1MxndgaexUXCmYahLj-NbGt5hkk`

**Database Password**
- Password: `Alok@1735`

All credentials are in `.env.local`

---

## 🎯 Getting Started

### 1. Create Account
1. Go to http://localhost:3000
2. Click "Get Started Free"
3. Fill in email, password, username
4. Verify email (check inbox)

### 2. Add Your First Book
1. Click "Discover Books"
2. Search for a book
3. Click "Add to Library"
4. Update reading status

### 3. Track Progress
1. Go to "My Library"
2. Click on a book
3. Update current page
4. Log reading sessions

---

## 📱 Main Features

### Core
- 📚 **Library** - Organize books by status (Want to Read, Reading, Finished)
- 📊 **Statistics** - Charts, reading pace, time tracking
- 🎯 **Goals** - Set yearly/monthly reading targets
- 📝 **Notes** - Save thoughts and quotes

### Social
- ⭐ **Reviews** - Rate and review books
- 👥 **Follow** - Connect with other readers
- 💬 **Clubs** - Join book clubs
- 🏆 **Challenges** - Participate in reading challenges

### Advanced
- 📥 **Import** - Bring your Goodreads library
- 📤 **Export** - Download your data (CSV/JSON)
- 📋 **Lists** - Create custom book collections
- 🌙 **Dark Mode** - Toggle in header
- 📱 **PWA** - Install as app on mobile

---

## 🔧 Troubleshooting

### Server Won't Start
```bash
# Kill existing processes
lsof -ti:3000 | xargs kill -9

# Restart
npm run dev
```

### Database Connection Error
```bash
# Reconnect to Supabase
npx supabase link --project-ref gzxafxhboeobywsdlwkx --password "Alok@1735"

# Check status
npx supabase status
```

### Page Won't Load
- Hard refresh: `Cmd + Shift + R`
- Try: http://127.0.0.1:3000
- Clear browser cache
- Try incognito mode

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run dev
```

---

## 📂 Project Structure

```
src/
├── app/              # Pages (Next.js App Router)
│   ├── page.tsx      # Homepage
│   ├── library/      # Library page
│   ├── discover/     # Book search
│   ├── stats/        # Statistics
│   └── reading-goals/ # Goals page
├── components/       # UI components
├── hooks/           # Custom React hooks
├── lib/             # Utilities
└── tests/           # Test files (150 tests)
```

---

## 🎨 Customization

### Change Colors
Edit `src/app/globals.css` - modify CSS variables

### Update Homepage
Edit `src/app/page.tsx`

### Change App Name
Edit `src/app/layout.tsx` - update metadata

### Add Logo
Place in `public/` folder and update components

---

## 📊 Status

```
✅ Server: Running on port 3000
✅ Database: Connected (15 tables)
✅ Tests: 150 passing
✅ Features: All 30 tasks complete
✅ Fonts: Inter + JetBrains Mono
```

---

## 🚀 Deployment (Optional)

### Deploy to Vercel
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables from `.env.local`
4. Deploy!

See `DEPLOYMENT.md` for details.

---

## 📚 Additional Docs

- **Features List**: `PROJECT_COMPLETION_SUMMARY.md`
- **Test Results**: `TEST_RESULTS.md`
- **Deployment**: `DEPLOYMENT.md`
- **Quick Start**: `QUICK_START.md`

---

## 💡 Tips

- **Search**: Use `/` key to focus search
- **Dark Mode**: Toggle in header menu
- **Keyboard**: `Esc` closes dialogs
- **Mobile**: Install as PWA for offline access
- **Import**: Use CSV import for bulk adding books

---

## 🆘 Need Help?

1. Check troubleshooting section above
2. Review error messages in terminal
3. Check Supabase dashboard for database issues
4. Verify `.env.local` has all credentials

---

**App URL**: http://localhost:3000  
**Status**: ✅ OPERATIONAL  
**Last Updated**: 2025-09-29

**Happy Reading!** 📖✨
