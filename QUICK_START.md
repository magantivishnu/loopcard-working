# LoopCard - Quick Start Guide

## 🎉 Congratulations! Your Foundation is Ready

The LoopCard application foundation has been built with:
- ✅ Complete project structure
- ✅ TypeScript configuration
- ✅ Tailwind CSS setup
- ✅ Supabase integration
- ✅ State management (Zustand)
- ✅ Routing setup
- ✅ Landing page UI
- ✅ Complete database schema
- ✅ Utility functions

## 📍 You Are Here: Project Location

Your project is located at: `/home/claude/loopcard/web`

## 🚀 Quick Start - 5 Steps to Run Locally

### Step 1: Navigate to Project
```bash
cd /home/claude/loopcard/web
```

### Step 2: Create Supabase Project
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in:
   - Name: `loopcard`
   - Database Password: (save this!)
   - Region: Choose closest to you
4. Wait 2-3 minutes for project to be ready

### Step 3: Set Up Database
1. In Supabase Dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy ALL contents from `/home/claude/loopcard/DATABASE_SCHEMA.sql`
4. Paste and click "Run"
5. You should see success message: "LoopCard database schema created successfully!"

### Step 4: Configure Environment
1. In Supabase, go to **Settings** > **API**
2. Copy:
   - Project URL (looks like: `https://xxxxx.supabase.co`)
   - `anon` `public` key (long string starting with `eyJ...`)

3. Create `.env` file in `/home/claude/loopcard/web/`:
```bash
cd /home/claude/loopcard/web
cp .env.example .env
nano .env  # or use any text editor
```

4. Paste your credentials:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_APP_URL=http://localhost:5173
VITE_APP_NAME=LoopCard
```

Save and exit (Ctrl+X, then Y, then Enter if using nano)

### Step 5: Run Development Server
```bash
cd /home/claude/loopcard/web
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

Open http://localhost:5173/ in your browser! 🎉

## 🎨 What You'll See

1. **Beautiful Landing Page** ✅
   - Hero section with gradient
   - Animated blobs
   - Card preview mockup
   - Features section
   - Pricing teaser
   - Footer

2. **Navigation Works** ✅
   - Click "Create Free LoopCard" → Goes to /signup (placeholder)
   - Click "Sign In" → Goes to /login (placeholder)

## ⚠️ Important Notes

### What's Completed (Phase 1 - Part 1)
- [x] Project scaffolding
- [x] Database schema
- [x] Type definitions
- [x] Supabase client
- [x] State management
- [x] Utilities library
- [x] Landing page UI
- [x] Routing setup

### What's Not Yet Built (You Can Build Next)
- [ ] Login page UI
- [ ] Signup page UI
- [ ] OTP verification
- [ ] Setup Wizard (4 steps)
- [ ] Dashboard page
- [ ] Public card view
- [ ] QR code generation
- [ ] Analytics tracking
- [ ] Mobile app (Expo/React Native)

## 🔧 Troubleshooting

### "Cannot find module" errors
```bash
npm install
```

### Tailwind classes not working
- Check `/home/claude/loopcard/web/tailwind.config.js` exists
- Check `/home/claude/loopcard/web/src/index.css` has `@tailwind` directives
- Restart dev server

### Supabase connection error
- Verify `.env` file exists in `/home/claude/loopcard/web/`
- Check credentials are correct (no extra spaces)
- Ensure Supabase project is active (not paused)

### Port 5173 already in use
```bash
# Kill process on port
lsof -ti:5173 | xargs kill -9
# Or use different port
npm run dev -- --port 3000
```

## 📂 Project Structure Explained

```
loopcard/web/
├── src/
│   ├── App.tsx                    # Main app with routing
│   ├── main.tsx                   # Entry point
│   ├── index.css                  # Global styles + Tailwind
│   │
│   ├── pages/
│   │   └── LandingPage.tsx       # ✅ BUILT
│   │   ├── LoginPage.tsx         # ❌ TODO
│   │   ├── SignUpPage.tsx        # ❌ TODO
│   │   └── ...                    # ❌ TODO
│   │
│   ├── components/
│   │   ├── ui/                    # ❌ TODO: Button, Input, Card
│   │   ├── auth/                  # ❌ TODO: Login forms
│   │   ├── cards/                 # ❌ TODO: Card components
│   │   └── dashboard/             # ❌ TODO: Dashboard UI
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   └── client.ts         # ✅ BUILT - Supabase helpers
│   │   ├── utils/
│   │   │   └── index.ts          # ✅ BUILT - Helper functions
│   │   └── store.ts              # ✅ BUILT - Zustand store
│   │
│   └── types/
│       └── index.ts              # ✅ BUILT - TypeScript types
│
├── .env                           # ❌ YOU NEED TO CREATE
├── .env.example                   # ✅ Template provided
├── package.json                   # ✅ Dependencies
├── tailwind.config.js             # ✅ Tailwind config
├── tsconfig.json                  # ✅ TypeScript config
└── vite.config.ts                 # ✅ Vite config
```

## 🎯 Next Development Steps

### Priority 1: Authentication (Required for MVP)
1. Create `LoginPage.tsx`
2. Create `SignUpPage.tsx`
3. Add OTP verification flow
4. Test with Supabase Auth

### Priority 2: Setup Wizard (Core Feature)
1. Create `SetupWizard/Step1Photo.tsx`
2. Create `SetupWizard/Step2BasicInfo.tsx`
3. Create `SetupWizard/Step3Contact.tsx`
4. Create `SetupWizard/Step4Social.tsx`
5. Integrate with Supabase to create card

### Priority 3: Public Card View
1. Create `PublicCardPage.tsx`
2. Fetch card data by slug
3. Display all card information
4. Add action buttons (call, email, etc.)
5. Implement vCard download

### Priority 4: Dashboard
1. Create `DashboardPage.tsx`
2. Display user's cards
3. Show basic analytics
4. Add edit/delete functionality

### Priority 5: QR Code Generation
1. Create Supabase Edge Function for QR generation
2. Integrate with card creation
3. Allow QR download

## 💡 Tips for Development

### Using Supabase Client
```typescript
import { db, auth, storage } from '@/lib/supabase/client'

// Create a card
const { data, error } = await db.createCard({
  user_id: user.id,
  full_name: 'John Doe',
  slug: 'john-doe-abc123',
  // ... other fields
})

// Track analytics
await db.trackEvent({
  card_id: cardId,
  event_type: 'view',
  device_type: 'mobile',
  // ... other fields
})
```

### Using State Management
```typescript
import { useAppStore } from '@/lib/store'

const MyComponent = () => {
  const { user, cards, showToast } = useAppStore()
  
  // Show success message
  showToast({
    type: 'success',
    message: 'Card created successfully!',
    duration: 3000
  })
}
```

### Using Utilities
```typescript
import { generateSlug, downloadVCard, formatNumber } from '@/lib/utils'

const slug = generateSlug('John Doe') // 'john-doe-abc123'
const formatted = formatNumber(1500) // '1.5K'
downloadVCard({ fullName: 'John', phone: '+1234567890' })
```

## 📚 Resources

- **Supabase Docs**: https://supabase.com/docs
- **React Router**: https://reactrouter.com/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Zustand**: https://github.com/pmndrs/zustand
- **TypeScript**: https://www.typescriptlang.org/docs

## 🆘 Need Help?

1. Check the README.md for detailed documentation
2. Review DATABASE_SCHEMA.sql for database structure
3. Look at type definitions in `src/types/index.ts`
4. Examine Supabase helpers in `src/lib/supabase/client.ts`

## ✅ Verification Checklist

Before you start development, verify:

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Supabase project created
- [ ] Database schema executed successfully
- [ ] `.env` file created with correct credentials
- [ ] `npm install` completed without errors
- [ ] `npm run dev` starts successfully
- [ ] Landing page loads at http://localhost:5173/
- [ ] No console errors in browser dev tools

---

**🎊 You're all set! Happy coding!**

The foundation is solid. Now you can build the remaining components one by one. Start with authentication, then the setup wizard, and gradually complete the MVP.

Remember: **Build incrementally, test often, commit frequently!**
