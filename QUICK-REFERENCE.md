# ⚡ QR Code Quick Reference Card

## 🚀 5-Minute Install

```bash
# 1. Install
npm install qrcode.react @types/qrcode.react --save-dev

# 2. Copy files to app/components/
# - QRCodeDisplay.tsx
# - QRCodeSection.tsx  
# - QRCodeManager.tsx

# 3. Replace app/[slug]/page.tsx

# 4. Add to .env.local
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# 5. Test
npm run dev
```

---

## 📁 File Structure

```
app/
├── components/
│   ├── QRCodeDisplay.tsx      ← NEW
│   ├── QRCodeSection.tsx      ← NEW
│   └── QRCodeManager.tsx      ← NEW
└── [slug]/
    └── page.tsx               ← UPDATED
```

---

## 🎯 What It Does

**Adds to card pages:**
- "Show QR Code" button
- Modal with QR code
- Download as PNG
- Mobile responsive

---

## 🎨 Customization

```tsx
// Bigger QR code
<QRCodeDisplay size={512} />

// Custom filename
downloadFileName="my-card-qr"

// Hide download button
showDownloadButton={false}

// Different error level
level="M"  // L, M, Q, or H
```

---

## 🐛 Common Fixes

| Problem | Solution |
|---------|----------|
| Module error | `npm install qrcode.react` |
| No QR shown | Set `NEXT_PUBLIC_SITE_URL` |
| Wrong URL | Update `.env.local` |
| No download | Check browser console |

---

## ✅ Test Checklist

- [ ] Button shows on card page
- [ ] Modal opens on click
- [ ] QR code displays
- [ ] Download works
- [ ] Phone scan works

---

## 📚 Full Docs

See package files for detailed guides:
- `INSTALLATION-STEPS.md` - Full setup
- `QUICK-START-CHECKLIST.md` - Printable
- `VISUAL-GUIDE.md` - Examples

---

**Total Time: 10-15 minutes** 🎉
