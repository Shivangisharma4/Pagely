# Deployment Guide

## Prerequisites
- Node.js 18+
- Vercel account
- Supabase project
- Railway account (optional for Redis)

## Environment Variables

### Vercel
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GOOGLE_BOOKS_API_KEY=your_google_books_key
```

### Supabase
- Configure RLS policies
- Run migrations in order
- Set up Edge Functions

## Deployment Steps

### 1. Vercel Setup
```bash
npm install -g vercel
vercel login
vercel link
vercel env pull
```

### 2. Supabase Migrations
```bash
npx supabase link --project-ref your-project-ref
npx supabase db push
```

### 3. Deploy
```bash
vercel --prod
```

## Monitoring
- Vercel Analytics: https://vercel.com/dashboard
- Supabase Dashboard: https://app.supabase.com
- Error tracking via Sentry

## Rollback
```bash
vercel rollback
```
