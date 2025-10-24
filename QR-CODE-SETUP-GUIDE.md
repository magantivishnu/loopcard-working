# 🎯 QR Code Feature - Complete Setup Guide

## 📦 Step 1: Install Dependencies

Open your terminal in your project directory (`C:\Users\magan\files\`) and run:

```bash
npm install qrcode.react
npm install --save-dev @types/qrcode.react
```

---

## 📁 Step 2: Create Components Directory

If you don't already have a `components` folder in your `app` directory, create it:

```
app/
  components/
    QRCodeDisplay.tsx      (Create this file)
    QRCodeSection.tsx      (Create this file)
    QRCodeManager.tsx      (Create this file)
```

---

## 📝 Step 3: Add the Component Files

### File 1: `app/components/QRCodeDisplay.tsx`

Copy the contents from the file I created: `QRCodeDisplay.tsx`

This is the base QR code component with download functionality.

---

### File 2: `app/components/QRCodeSection.tsx`

Copy the contents from the file I created: `QRCodeSection.tsx`

This shows the QR code in a modal on public card pages.

---

### File 3: `app/components/QRCodeManager.tsx`

Copy the contents from the file I created: `QRCodeManager.tsx`

This lets you view QR codes from the dashboard.

---

## 🔧 Step 4: Update Your Public Card Page

Replace your current `app/[slug]/page.tsx` with the updated version from `slug-page-with-qr.tsx`.

**Key additions:**
- QR code button next to Share and Download buttons
- Modal popup showing QR code
- Download functionality built-in

---

## 🎨 Step 5: Add QR Codes to Dashboard (Optional)

To show QR codes in your dashboard cards list, update your dashboard cards component:

```tsx
import QRCodeManager from '@/components/QRCodeManager';

// In your card list item:
<div className="flex items-center gap-2">
  {/* Your existing action buttons */}
  <QRCodeManager 
    card={card} 
    baseUrl={process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'} 
  />
</div>
```

---

## ⚙️ Step 6: Add Environment Variable

Make sure you have this in your `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**For production**, update this to your actual domain:
```env
NEXT_PUBLIC_SITE_URL=https://yourapp.com
```

---

## 🚀 Step 7: Test It Out

1. Restart your dev server:
   ```bash
   npm run dev
   ```

2. Visit any public card page: `http://localhost:3000/your-slug`

3. Click the **"Show QR Code"** button

4. Test downloading the QR code

5. Scan it with your phone to verify it works!

---

## ✨ What You Get

### On Public Card Pages:
- ✅ "Show QR Code" button next to Share/Download
- ✅ Beautiful modal with QR code display
- ✅ Download button for PNG export
- ✅ Helpful tips for users

### QR Code Features:
- ✅ High-quality PNG export (256x256 or customizable)
- ✅ Error correction level 'H' (highest)
- ✅ White background with padding
- ✅ Mobile responsive modal
- ✅ Click outside to close

### Optional Dashboard Integration:
- ✅ Quick QR code view from dashboard
- ✅ Download QR codes for all your cards
- ✅ One-click access per card

---

## 🎨 Customization Options

### Change QR Code Size:
In `QRCodeDisplay.tsx`, modify the `size` prop:
```tsx
<QRCodeDisplay 
  value={url} 
  size={300}  // Make it bigger
/>
```

### Change Colors:
Add color props to QRCodeCanvas:
```tsx
<QRCodeCanvas
  value={value}
  size={size}
  bgColor="#ffffff"     // Background color
  fgColor="#000000"     // QR code color
  level={level}
/>
```

### Add Logo to QR Code:
```tsx
<QRCodeCanvas
  value={value}
  size={size}
  imageSettings={{
    src: '/logo.png',
    height: 40,
    width: 40,
    excavate: true,
  }}
/>
```

---

## 🐛 Troubleshooting

### Error: "Module not found: qrcode.react"
**Solution:** Make sure you installed the package:
```bash
npm install qrcode.react
```

### QR Code Not Displaying
**Solution:** Check that the `value` prop has a valid URL:
```tsx
console.log(cardUrl); // Should print full URL
```

### Download Not Working
**Solution:** Check browser console for errors. Make sure the canvas is rendered before clicking download.

### QR Code Scans to Wrong URL
**Solution:** Update your `NEXT_PUBLIC_SITE_URL` environment variable to your actual domain.

---

## 📱 Mobile Testing

1. Generate a QR code for your card
2. Download it to your computer
3. Open it on your phone or use a QR scanner
4. Verify it opens the correct card page

---

## 🎯 Next Steps After QR Codes

Once QR codes are working, you might want to add:
- 📊 Track QR code scans in analytics
- 🎨 Custom QR code styling (colors, logos)
- 📄 QR codes in PDF exports
- 📧 QR codes in email signatures
- 🖨️ Printable business card templates with QR codes

---

## 📞 Need Help?

If you run into issues:
1. Check that all files are in the correct locations
2. Restart your dev server
3. Clear your browser cache
4. Check the browser console for errors
5. Let me know what error you're seeing!

---

**Ready to add QR codes?** Just follow the steps above and you'll have working QR codes in minutes! 🚀
