# 🚀 Firebase Setup - Quick Start Checklist

**Project**: traditions-c1cf5  
**Status**: Ready to configure  
**Time to Complete**: 15-30 minutes  

---

## Step-by-Step Setup

### ☐ Step 1: Create Firestore Collections (5 min)

Go to: https://console.firebase.google.com/

1. [ ] Select **traditions-c1cf5** project
2. [ ] Click **Firestore Database** (left menu)
3. [ ] Click **+ Start Collection**
4. [ ] Create collection: `users`
   - [ ] Click Next
   - [ ] Click Save (skip first document for now)
5. [ ] Repeat for collections:
   - [ ] `inventory` (should exist already)
   - [ ] `pending_accounts` (optional)

**Result**: 3 collections ready ✓

---

### ☐ Step 2: Deploy Firestore Security Rules (3 min)

1. [ ] In Firestore → Click **Rules** tab
2. [ ] Replace all content with rules from: **FIREBASE_SETUP_GUIDE.md**
3. [ ] Click **Publish**
4. [ ] Wait for "Rules updated" message

**Result**: Security rules active ✓

---

### ☐ Step 3: Enable Firebase Authentication (2 min)

1. [ ] Click **Authentication** (left menu)
2. [ ] Click **Sign-in method** tab
3. [ ] Click **Email/Password**
   - [ ] Toggle ON
   - [ ] Click Save
4. [ ] Click **Google** (optional for later)

**Result**: Auth methods enabled ✓

---

### ☐ Step 4: Create Test Users - Option A: Manual (10 min)

**Skip if using Option B below**

1. [ ] Click **Authentication** → **Users** tab
2. [ ] For each test user, click **Add user**:
   - Email: `GM11788@GMAIL.COM`
   - Password: `VendorTest@2025!`
   - [ ] Click Create
3. [ ] Repeat for each account:

```
cultivator@traditions.local        Cultivator@2025!
processor@traditions.local         Processor@2025!
distributor@traditions.local       Distributor@2025!
retailer@traditions.local          Retailer@2025!
transporter@traditions.local       Transporter@2025!
laboratory@traditions.local        Laboratory@2025!
trial.vendor@traditions.local      TrialVendor@2025!
trial.buyer@traditions.local       TrialBuyer@2025!
admin@traditions.local             AdminPlatform@2025!
manager@traditions.local           VendorMgr@2025!
```

**Result**: 11 test users created ✓

---

### ☐ Step 4: Create Test Users - Option B: Automated (5 min)

**Use this instead of manual if you prefer**

1. [ ] Download Service Account Key:
   - Click **⚙️ Settings** (top right)
   - Click **Service Accounts**
   - Click **Generate New Private Key**
   - Save as `setup/serviceAccountKey.json`

2. [ ] Install dependencies:
   ```bash
   npm install firebase-admin
   ```

3. [ ] Run initialization script:
   ```bash
   node setup/initialize-users.js
   ```

4. [ ] Wait for "INITIALIZATION COMPLETE" message

**Result**: All test users auto-created in Auth & Firestore ✓

---

### ☐ Step 5: Verify Setup (5 min)

1. [ ] Open `vendor-manager.html`
2. [ ] Sign in: `GM11788@GMAIL.COM` / `VendorTest@2025!`
3. [ ] See vendor interface with light blue sections ✓
4. [ ] Upload test product
5. [ ] Check Firestore - product appears with vendor info ✓
6. [ ] Open `traditions-bulk.html`
7. [ ] Search for your product ✓
8. [ ] Try sign in as `distributor@traditions.local`
9. [ ] Verify upload sections NOT visible (buyer can't upload) ✓

**Result**: System working! ✓

---

## Quick Reference

### Test Accounts

```
YOUR MAIN VENDOR ACCOUNT:
Email: GM11788@GMAIL.COM
Password: VendorTest@2025!

All test accounts password format:
[Role]@2025!  or  [LicenseType]@2025!

Examples:
Cultivator@2025!      → cultivator@traditions.local
Processor@2025!       → processor@traditions.local
Distributor@2025!     → distributor@traditions.local
TrialVendor@2025!     → trial.vendor@traditions.local
AdminPlatform@2025!   → admin@traditions.local
```

### Key Files

| File | Purpose |
|------|---------|
| `FIREBASE_SETUP_GUIDE.md` | Detailed setup instructions |
| `FIREBASE_VERIFICATION_GUIDE.md` | Testing & troubleshooting |
| `setup/initialize-users.js` | Auto-create all test users |
| `js/permissions.js` | Permission definitions |
| `js/test-users.js` | Test account reference |
| `vendor-manager.html` | Vendor upload interface |

### Collections Structure

```
Firestore Collections:

📁 users/
   ├─ {uid}: { email, role, permissions, licenseNumber, ... }
   ├─ {uid}: { ... }
   └─ ...

📁 inventory/
   ├─ {productId}: { productName, vendorId, vendorEmail, price, ... }
   ├─ {productId}: { ... }
   └─ ...

📁 pending_accounts/
   └─ (Account requests awaiting approval)
```

---

## Troubleshooting Quick Fix

### "Permission denied" error
- [ ] Check Firestore rules are published
- [ ] Check user has correct role
- [ ] Check user profile in Firestore has `permissions` array

### "User not found"
- [ ] Create test users in Firebase Auth
- [ ] Or run `node setup/initialize-users.js`

### Upload fails silently
- [ ] Check browser console (F12)
- [ ] Check Firestore quota
- [ ] Verify `inventory` collection exists
- [ ] Check security rules

### Can't sign in
- [ ] Check email spelling (case matters!)
- [ ] Check password exactly: `[Type]@2025!`
- [ ] Clear browser cache
- [ ] Try different email

---

## Success Checklist ✨

After completing all steps, you should have:

- [ ] **Firestore collections created** - users, inventory, pending_accounts
- [ ] **Security rules deployed** - access control active
- [ ] **Firebase Auth enabled** - Email/Password sign-in working
- [ ] **11 test users created** - All license types available
- [ ] **User profiles in Firestore** - With roles and permissions
- [ ] **Vendor can sign in** - Light blue interface visible
- [ ] **Vendor can upload** - Products appear in Firestore
- [ ] **Marketplace works** - Products visible to buyers
- [ ] **Permissions enforced** - Buyers can't upload, sellers can
- [ ] **Ownership protected** - Vendors only edit their products

---

## 🎉 You're Ready!

Once all steps are complete:

1. **Sign in** as GM11788@GMAIL.COM to `vendor-manager.html`
2. **Upload products** and test the system
3. **Browse marketplace** at `traditions-bulk.html`
4. **Test different accounts** to verify permissions work
5. **Read FIREBASE_VERIFICATION_GUIDE.md** for detailed testing

---

**Total Setup Time**: ~20 minutes (manual) or ~10 minutes (automated)  
**Next Phase**: Payment integration, notifications, analytics

Need help? Check **FIREBASE_SETUP_GUIDE.md** or **FIREBASE_VERIFICATION_GUIDE.md**
