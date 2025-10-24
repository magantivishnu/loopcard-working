# LoopCard - Complete Setup Guide

## 📦 What You Have

Your LoopCard application is ready! The source code is in `loopcard-source.tar.gz`.

## 🎯 What We've Built (Phase 1 - MVP)

✅ **Complete Project Structure**
- Next.js 14 with App Router
- TypeScript configuration
- Tailwind CSS with custom design system
- Supabase integration ready

✅ **Core Files Created**
- Landing page with hero, features, pricing
- Authentication setup (ready for Supabase)
- Database schema and migrations
- Utility functions and validation schemas
- Type-safe database types

✅ **Design System**
- Modern gradient-based color scheme
- Mobile-first responsive design
- Custom animations and transitions
- Professional UI components ready

## 🚀 Step-by-Step Setup Instructions

### Prerequisites

Before starting, install:
1. **Node.js 18+**: Download from https://nodejs.org
2. **VS Code** (recommended): Download from https://code.visualstudio.com
3. **Git**: Download from https://git-scm.com

### Step 1: Extract and Open Project

```bash
# Extract the source code
tar -xzf loopcard-source.tar.gz -C loopcard
cd loopcard

# Open in VS Code
code .
```

### Step 2: Install Dependencies

```bash
# Install all npm packages
npm install

# This will take 2-3 minutes
```

### Step 3: Create Supabase Project

1. **Go to Supabase**
   - Visit https://supabase.com
   - Click "Start your project"
   - Sign in with GitHub (recommended)

2. **Create New Project**
   - Click "New Project"
   - Organization: Create or select
   - Project Name: `loopcard`
   - Database Password: Generate a strong password (save it!)
   - Region: Choose closest to you
   - Click "Create new project"
   - Wait 2-3 minutes for setup

3. **Get Your Project Credentials**
   - Click on "Project Settings" (gear icon)
   - Go to "API" section
   - Copy:
     - Project URL (looks like: `https://xxxxx.supabase.co`)
     - `anon` public key (long string starting with `eyJ...`)

### Step 4: Configure Environment Variables

1. **Copy the example env file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local` file:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_APP_NAME=LoopCard
   ```

### Step 5: Set Up Database

1. **Open Supabase SQL Editor**
   - In your Supabase dashboard
   - Click "SQL Editor" in left sidebar
   - Click "New query"

2. **Run the Migration**
   - Open `supabase/migrations/001_initial_schema.sql` in VS Code
   - Copy ALL the content
   - Paste into Supabase SQL Editor
   - Click "Run" button
   - You should see "Success. No rows returned"

3. **Verify Tables Created**
   - Click "Table Editor" in left sidebar
   - You should see: `profiles`, `cards`, `qr_codes`, `analytics_events`

### Step 6: Configure Authentication

1. **Enable Email Auth**
   - Go to "Authentication" > "Providers"
   - Enable "Email" provider
   - Click "Save"

2. **Configure Email Templates (Optional)**
   - Go to "Authentication" > "Email Templates"
   - You can customize the magic link email later

3. **Set Site URL**
   - Go to "Authentication" > "URL Configuration"
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/**`
   - Click "Save"

### Step 7: Set Up Storage Buckets

1. **Create Storage Buckets**
   - Go to "Storage" in left sidebar
   - Click "New bucket"
   
   Create these 3 buckets:
   
   **Bucket 1: avatars**
   - Name: `avatars`
   - Public bucket: ✅ Yes
   - Click "Save"
   
   **Bucket 2: card-images**
   - Name: `card-images`
   - Public bucket: ✅ Yes
   - Click "Save"
   
   **Bucket 3: qr-codes**
   - Name: `qr-codes`
   - Public bucket: ✅ Yes
   - Click "Save"

2. **Set Storage Policies**
   - Click on each bucket
   - Go to "Policies" tab
   - Click "New Policy"
   - Template: "Allow public read access"
   - Click "Review" then "Save"

### Step 8: Start Development Server

```bash
# Start the Next.js development server
npm run dev
```

You should see:
```
  ▲ Next.js 14.0.4
  - Local:        http://localhost:3000
  - Ready in 2.3s
```

### Step 9: Test the Application

1. **Open Browser**
   - Go to http://localhost:3000
   - You should see the beautiful landing page!

2. **Test Navigation**
   - Click "Create Free LoopCard" button
   - It will redirect to `/auth/signup` (we'll build this next)

## ✅ Verification Checklist

Before moving to Phase 2, verify:

- [ ] Landing page loads at http://localhost:3000
- [ ] No console errors in browser DevTools (F12)
- [ ] Supabase tables are created
- [ ] Storage buckets are set up
- [ ] Authentication is enabled
- [ ] Environment variables are configured

## 🎨 What's Been Built

### 1. Landing Page (`/`)
- Hero section with animated gradients
- Feature showcase (6 key features)
- Pricing table (Free, Pro, Enterprise)
- Footer with links
- Fully responsive design

### 2. Configuration Files
- `package.json` - All dependencies
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Design system
- `next.config.js` - Next.js settings

### 3. Database Schema
- Users (profiles table)
- Digital Cards (cards table)
- QR Codes (qr_codes table)
- Analytics (analytics_events table)
- Row Level Security policies
- Automatic triggers

### 4. Utility Functions
- Form validation schemas (Zod)
- Helper functions (slug generation, formatters)
- Type-safe database types
- Supabase client configuration

## 📝 Next Steps (Phase 2)

Now that Phase 1 is complete, here's what we'll build next:

### Priority 1: Authentication Pages
1. Sign Up page with email/OTP
2. Sign In page
3. OAuth providers (Google, Apple)
4. Protected route middleware

### Priority 2: Setup Wizard
1. Step 1: Upload photo
2. Step 2: Basic info
3. Step 3: Contact details
4. Step 4: Social links
5. Step 5: Preview & generate QR

### Priority 3: Dashboard
1. My Cards overview
2. Analytics dashboard
3. Card editor
4. Settings page

### Priority 4: Public Card View
1. Dynamic route `[slug]`
2. Card rendering
3. Analytics tracking
4. vCard download
5. Share functionality

## 🐛 Troubleshooting

### Issue: npm install fails
**Solution**: 
```bash
# Clear cache and try again
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Module not found" errors
**Solution**:
```bash
# Restart the dev server
# Press Ctrl+C to stop
npm run dev
```

### Issue: Supabase connection fails
**Solution**:
- Double-check `.env.local` values
- Ensure no extra spaces in environment variables
- Restart dev server after changing `.env.local`

### Issue: Database migration fails
**Solution**:
- Check if tables already exist (delete them first)
- Run migration line by line to find the error
- Ensure UUID extension is enabled

## 💡 Development Tips

1. **Hot Reload**: Save any file and the page auto-refreshes
2. **TypeScript**: Hover over any variable to see its type
3. **Tailwind**: Use VS Code extension "Tailwind CSS IntelliSense"
4. **Console**: Always keep browser DevTools open (F12)
5. **Git**: Commit your work frequently

## 📞 Need Help?

If you encounter any issues:

1. **Check Console**: Browser DevTools (F12) > Console tab
2. **Check Terminal**: Look for error messages in VS Code terminal
3. **Check Supabase Logs**: Dashboard > Logs
4. **Read Error Messages**: They usually tell you exactly what's wrong!

## 🎉 Congratulations!

You now have:
- ✅ A working Next.js application
- ✅ Supabase backend configured
- ✅ Beautiful landing page
- ✅ Database ready
- ✅ Development environment set up

**You're ready to build the rest of the features!**

---

## Quick Command Reference

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Check TypeScript
npx tsc --noEmit
```

---

**Current Version**: Phase 1 Complete
**Next**: Build Authentication & Setup Wizard
