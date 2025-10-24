# LoopCard - Project Architecture

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    USER DEVICES                         │
│  📱 Mobile Browser    💻 Desktop Browser   📲 Mobile App │
└──────────────────────┬──────────────────────────────────┘
                       │
                       │ HTTPS
                       │
┌──────────────────────▼──────────────────────────────────┐
│              NEXT.JS 14 APPLICATION                      │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐ │
│  │   Landing   │  │     Auth     │  │   Dashboard    │ │
│  │    Pages    │  │    Pages     │  │     Pages      │ │
│  └─────────────┘  └──────────────┘  └────────────────┘ │
│  ┌─────────────────────────────────────────────────────┤
│  │          API ROUTES & SERVER ACTIONS                │
│  └─────────────────────────────────────────────────────┤
└──────────────────────┬──────────────────────────────────┘
                       │
                       │ API Calls
                       │
┌──────────────────────▼──────────────────────────────────┐
│                  SUPABASE BACKEND                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  PostgreSQL  │  │ Authentication│  │   Storage    │  │
│  │   Database   │  │  (Auth.js)   │  │   Buckets    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Edge         │  │  Realtime    │  │   Row Level  │  │
│  │ Functions    │  │  (WebSocket) │  │   Security   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└──────────────────────────────────────────────────────────┘
```

## 📊 Database Schema

```
┌─────────────────┐
│    auth.users   │  (Supabase managed)
│                 │
│  • id (UUID)    │
│  • email        │
│  • created_at   │
└────────┬────────┘
         │
         │ 1:1
         │
┌────────▼────────┐     1:N     ┌─────────────────┐
│    profiles     │─────────────│      cards      │
│                 │             │                 │
│  • id (FK)      │             │  • id           │
│  • email        │             │  • user_id (FK) │
│  • full_name    │             │  • slug         │
│  • avatar_url   │             │  • full_name    │
│  • plan_type    │             │  • designation  │
│  • plan_expires │             │  • phone        │
│  • trial_ends   │             │  • email        │
└─────────────────┘             │  • social_links │
                                │  • theme        │
                                │  • is_active    │
                                │  • total_views  │
                                └────────┬────────┘
                                         │
                                         │ 1:N
                   ┌─────────────────────┼─────────────────────┐
                   │                     │                     │
         ┌─────────▼────────┐  ┌─────────▼──────────┐  ┌──────▼─────────┐
         │    qr_codes      │  │ analytics_events   │  │  lead_captures │
         │                  │  │                    │  │                │
         │  • id            │  │  • id              │  │  • id          │
         │  • card_id (FK)  │  │  • card_id (FK)    │  │  • card_id (FK)│
         │  • qr_image_url  │  │  • event_type      │  │  • name        │
         │  • qr_style      │  │  • ip_address      │  │  • email       │
         │  • is_dynamic    │  │  • device_type     │  │  • phone       │
         └──────────────────┘  │  • country         │  │  • message     │
                               │  • city            │  └────────────────┘
                               │  • session_id      │
                               └────────────────────┘
```

## 🗂️ File Structure

```
loopcard/
│
├── app/                          # Next.js 14 App Router
│   ├── layout.tsx               # Root layout (navigation, footer)
│   ├── page.tsx                 # Landing page
│   ├── globals.css              # Global styles + Tailwind
│   │
│   ├── auth/                    # Authentication routes
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   ├── signin/
│   │   │   └── page.tsx
│   │   └── callback/
│   │       └── route.ts
│   │
│   ├── dashboard/               # Protected routes
│   │   ├── layout.tsx          # Dashboard layout
│   │   ├── page.tsx            # Dashboard home
│   │   ├── cards/
│   │   │   ├── page.tsx        # My cards list
│   │   │   ├── new/            # Create new card wizard
│   │   │   └── [id]/
│   │   │       ├── page.tsx    # Card editor
│   │   │       └── analytics/  # Card analytics
│   │   └── settings/
│   │       └── page.tsx        # User settings
│   │
│   ├── [slug]/                  # Public card view
│   │   └── page.tsx            # Dynamic card page
│   │
│   └── api/                     # API routes
│       ├── cards/
│       │   ├── create/
│       │   └── [id]/
│       ├── qr/
│       │   └── generate/
│       └── analytics/
│           └── track/
│
├── components/                   # React components
│   ├── ui/                      # Base UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── ...
│   │
│   ├── landing/                 # Landing page components
│   │   ├── hero.tsx
│   │   ├── features.tsx
│   │   └── pricing.tsx
│   │
│   ├── auth/                    # Auth components
│   │   ├── signup-form.tsx
│   │   ├── signin-form.tsx
│   │   └── oauth-buttons.tsx
│   │
│   ├── cards/                   # Card components
│   │   ├── card-editor.tsx
│   │   ├── card-preview.tsx
│   │   └── card-templates.tsx
│   │
│   └── dashboard/               # Dashboard components
│       ├── stats-card.tsx
│       ├── recent-views.tsx
│       └── analytics-chart.tsx
│
├── lib/                         # Utilities & configs
│   ├── supabase/
│   │   ├── client.ts           # Browser client
│   │   ├── server.ts           # Server client
│   │   └── database.types.ts   # Generated types
│   │
│   ├── utils/
│   │   ├── helpers.ts          # Helper functions
│   │   └── constants.ts        # App constants
│   │
│   ├── validations/
│   │   └── schemas.ts          # Zod schemas
│   │
│   └── hooks/
│       ├── use-auth.ts         # Auth hook
│       └── use-analytics.ts    # Analytics hook
│
├── supabase/                    # Supabase configs
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   │
│   └── functions/               # Edge Functions
│       ├── generate-qr/
│       ├── track-analytics/
│       └── generate-vcard/
│
├── public/                      # Static assets
│   ├── images/
│   └── fonts/
│
├── types/                       # TypeScript types
│   └── index.ts
│
└── Configuration files
    ├── package.json
    ├── tsconfig.json
    ├── tailwind.config.js
    ├── next.config.js
    ├── postcss.config.js
    └── .env.local
```

## 🔄 Data Flow

### 1. User Sign Up Flow
```
User → Sign Up Page → Supabase Auth → Create Profile
                           ↓
                    Send OTP Email
                           ↓
                    Verify OTP → Redirect to Dashboard
```

### 2. Card Creation Flow
```
User → Setup Wizard → Collect Data → Validate with Zod
         ↓                              ↓
    Upload Images              Generate Slug
         ↓                              ↓
    Supabase Storage          Insert to Database
         ↓                              ↓
    Get Image URLs            Generate QR Code
         ↓                              ↓
    Update Card Data          Store QR in Storage
                                       ↓
                            Show Success & Preview
```

### 3. Public Card View Flow
```
Visitor → Scan QR or Click Link → Load Card Data
                                        ↓
                                Track View Event
                                        ↓
                           Insert Analytics (IP, Location, Device)
                                        ↓
                                 Render Card UI
                                        ↓
                    Visitor Clicks Button → Track Click Event
```

### 4. Analytics Flow
```
User → Dashboard → Fetch Analytics
                        ↓
           Query analytics_events table
                        ↓
            Group by date, location, device
                        ↓
              Calculate metrics (views, CTR)
                        ↓
               Render Charts & Tables
```

## 🔐 Security Layers

1. **Row Level Security (RLS)**
   - Users can only see their own profiles
   - Users can only edit their own cards
   - Public cards visible to everyone
   - Analytics only visible to card owner

2. **Authentication**
   - JWT tokens managed by Supabase
   - Secure OAuth flows
   - OTP verification for email sign-up

3. **Data Validation**
   - Zod schemas on client & server
   - Type-safe database operations
   - Input sanitization

4. **Rate Limiting**
   - API route protection
   - Prevent abuse of public endpoints

## 🎨 Design System

### Colors
```typescript
primary: {
  500: '#6366F1',  // Main brand color
  600: '#4F46E5',  // Hover states
}
secondary: {
  500: '#8B5CF6',  // Accent color
}
accent: {
  500: '#EC4899',  // Call-to-action
}
```

### Typography
- Font: Inter (Google Fonts)
- H1: 32px / Bold
- H2: 24px / Bold
- Body: 14px / Regular
- Small: 12px / Regular

### Spacing
- Unit: 4px
- Common: 4, 8, 12, 16, 24, 32, 48

## 📱 Responsive Breakpoints

```javascript
sm: '640px',   // Mobile landscape
md: '768px',   // Tablet
lg: '1024px',  // Desktop
xl: '1280px',  // Large desktop
2xl: '1536px'  // Extra large
```

## 🚀 Performance Optimizations

1. **Next.js Optimizations**
   - Image optimization with next/image
   - Automatic code splitting
   - Server-side rendering for public cards
   - Static generation for landing page

2. **Database**
   - Indexes on frequently queried columns
   - Materialized views for analytics (future)
   - Connection pooling via Supabase

3. **Caching**
   - CDN for static assets
   - Browser caching for images
   - Query result caching (future)

## 🧪 Testing Strategy (Future)

1. **Unit Tests**
   - Utility functions
   - Validation schemas
   - Component logic

2. **Integration Tests**
   - API routes
   - Database operations
   - Auth flows

3. **E2E Tests**
   - Critical user journeys
   - Card creation flow
   - Analytics tracking

---

**This architecture supports:**
- ✅ Scalability to millions of users
- ✅ Real-time updates
- ✅ Advanced analytics
- ✅ Multi-tenancy (organizations)
- ✅ API platform (future)
