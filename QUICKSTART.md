# 🚀 LoopCard - Quick Start (5 Minutes)

## What You Need
- Node.js 18+ installed
- A Supabase account (free)

## Steps

### 1. Extract & Install (2 min)
```bash
tar -xzf loopcard-source.tar.gz -C loopcard
cd loopcard
npm install
```

### 2. Setup Supabase (2 min)
1. Go to https://supabase.com → Create project
2. Get Project URL and anon key from Settings > API
3. Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run Database Migration (1 min)
1. Open Supabase Dashboard → SQL Editor
2. Copy contents of `supabase/migrations/001_initial_schema.sql`
3. Paste and Run

### 4. Create Storage Buckets
Go to Storage → Create 3 public buckets:
- `avatars`
- `card-images`
- `qr-codes`

### 5. Start Dev Server
```bash
npm run dev
```

Visit http://localhost:3000 🎉

## What's Built

✅ Landing page with hero, features, pricing
✅ Complete database schema
✅ Authentication ready
✅ Type-safe TypeScript
✅ Tailwind CSS design system

## Next: Build Authentication Pages

Ready to continue? Check SETUP_GUIDE.md for detailed instructions!
