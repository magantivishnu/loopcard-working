# LoopCard Setup Checklist ✅

Use this checklist to set up and run LoopCard locally. Check off each step as you complete it.

## 📋 Pre-Setup Verification

- [ ] I have Node.js 18+ installed (`node --version`)
- [ ] I have npm installed (`npm --version`)
- [ ] I have a code editor (VS Code recommended)
- [ ] I can access the terminal/command line

## 🚀 Step 1: Create Supabase Project (15 minutes)

- [ ] Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
- [ ] Click "Sign Up" or "Sign In"
- [ ] Click "New Project"
- [ ] Fill in project details:
  - [ ] Organization: Create new or select existing
  - [ ] Project name: `loopcard` (or your choice)
  - [ ] Database password: **SAVE THIS SECURELY**
  - [ ] Region: Select closest to you
- [ ] Click "Create new project"
- [ ] Wait 2-3 minutes for provisioning
- [ ] Project shows "Healthy" status

## 🗄️ Step 2: Set Up Database (10 minutes)

- [ ] In Supabase dashboard, click on your project
- [ ] Go to "SQL Editor" in left sidebar
- [ ] Click "+ New query"
- [ ] Open `DATABASE_SCHEMA.sql` from `/mnt/user-data/outputs/`
- [ ] Copy ALL content (Ctrl+A, Ctrl+C)
- [ ] Paste into Supabase SQL Editor (Ctrl+V)
- [ ] Click "Run" (or press Ctrl+Enter)
- [ ] Wait for execution to complete
- [ ] Verify success message: "LoopCard database schema created successfully!"
- [ ] Go to "Table Editor" and verify tables exist:
  - [ ] profiles
  - [ ] cards
  - [ ] organizations
  - [ ] analytics_events
  - [ ] lead_captures
  - [ ] card_templates

## 🔐 Step 3: Get API Credentials (5 minutes)

- [ ] In Supabase dashboard, go to "Settings" (gear icon)
- [ ] Click "API" in left sidebar
- [ ] Find "Project URL" section
  - [ ] Copy URL (looks like: `https://xxxxx.supabase.co`)
  - [ ] Paste it in a text file temporarily
- [ ] Find "Project API keys" section
  - [ ] Copy the `anon` `public` key (long string starting with `eyJ...`)
  - [ ] Paste it in the same text file

## ⚙️ Step 4: Configure Environment (5 minutes)

- [ ] Open terminal/command prompt
- [ ] Navigate to project:
  ```bash
  cd /home/claude/loopcard/web
  ```
- [ ] Copy environment template:
  ```bash
  cp .env.example .env
  ```
- [ ] Open `.env` file in your editor
- [ ] Replace placeholders with your Supabase credentials:
  ```env
  VITE_SUPABASE_URL=https://your-actual-project-id.supabase.co
  VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
  VITE_APP_URL=http://localhost:5173
  VITE_APP_NAME=LoopCard
  ```
- [ ] Save and close the file
- [ ] Verify no extra spaces or quotes around values

## 🎨 Step 5: Install Dependencies (2 minutes)

- [ ] In terminal, ensure you're in `/home/claude/loopcard/web`
- [ ] Run installation:
  ```bash
  npm install
  ```
- [ ] Wait for installation to complete
- [ ] Check for any error messages (should see "added X packages")

## 🚀 Step 6: Start Development Server (1 minute)

- [ ] In terminal, run:
  ```bash
  npm run dev
  ```
- [ ] Wait for server to start
- [ ] Look for message like:
  ```
  VITE v5.x.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/
  ```
- [ ] Copy the URL

## 🌐 Step 7: Test in Browser (5 minutes)

- [ ] Open browser (Chrome, Firefox, or Edge)
- [ ] Go to `http://localhost:5173/`
- [ ] Verify landing page loads
- [ ] Check you see:
  - [ ] LoopCard logo and navigation
  - [ ] Hero section with gradient background
  - [ ] Animated background blobs
  - [ ] "Create Free LoopCard" button
  - [ ] Card preview mockup
  - [ ] Features section
  - [ ] Pricing section
  - [ ] Footer
- [ ] Open browser Developer Tools (F12)
- [ ] Check Console tab for errors
  - [ ] No red error messages (warnings are okay)

## 🧪 Step 8: Test Navigation (3 minutes)

- [ ] Click "Create Free LoopCard" button
  - [ ] Should go to `/signup` (shows "SignUp Page - Coming Soon")
- [ ] Click back button
- [ ] Click "Sign In" or "Load Existing Card"
  - [ ] Should go to `/login` (shows "Login Page - Coming Soon")
- [ ] Click back button
- [ ] All links work without errors

## 🎉 Success Verification

If you checked all boxes above, congratulations! Your LoopCard development environment is ready!

### You should now have:
✅ Supabase project running
✅ Database with all tables
✅ Local development server running
✅ Landing page loading perfectly
✅ No console errors
✅ Navigation working

## 🚧 Next Development Steps

Now you can start building the remaining components:

### Week 1: Authentication
- [ ] Build login page
- [ ] Build signup page  
- [ ] Add OTP verification
- [ ] Test authentication flow

### Week 2: Setup Wizard
- [ ] Create photo upload step
- [ ] Create basic info step
- [ ] Create contact details step
- [ ] Create social links step

### Week 3: Public Card
- [ ] Build card display
- [ ] Add action buttons
- [ ] Implement vCard download
- [ ] Add QR code display

### Week 4: Dashboard
- [ ] Display user cards
- [ ] Show analytics
- [ ] Add edit functionality
- [ ] Implement delete

## 🆘 Troubleshooting

### Server won't start?
- [ ] Check port 5173 isn't in use
- [ ] Try `npm install` again
- [ ] Restart terminal

### Can't connect to Supabase?
- [ ] Verify `.env` file exists
- [ ] Check credentials are correct
- [ ] No extra spaces in `.env`
- [ ] Supabase project is active (not paused)

### Styles not working?
- [ ] Check `tailwind.config.js` exists
- [ ] Verify `index.css` has Tailwind directives
- [ ] Restart dev server

### Still having issues?
- [ ] Read `QUICK_START.md` for detailed instructions
- [ ] Check `README.md` for troubleshooting section
- [ ] Review `PROJECT_SUMMARY.md` for architecture overview

## 📚 Documentation Links

- [Quick Start Guide](computer:///mnt/user-data/outputs/QUICK_START.md)
- [Complete README](computer:///mnt/user-data/outputs/README.md)
- [Database Schema](computer:///mnt/user-data/outputs/DATABASE_SCHEMA.sql)
- [Project Summary](computer:///mnt/user-data/outputs/PROJECT_SUMMARY.md)

---

**Ready to build? Start coding! 🚀**
