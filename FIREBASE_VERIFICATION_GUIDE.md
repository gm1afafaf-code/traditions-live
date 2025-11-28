# Firebase Setup Verification & Testing Guide

## Project Details
- **Project ID**: traditions-c1cf5
- **Auth Domain**: traditions-c1cf5.firebaseapp.com
- **Database**: Firestore
- **Storage**: Cloud Storage

---

## ✅ Verification Checklist

### 1. Firestore Collections Created
- [ ] `users` collection exists
- [ ] `inventory` collection exists (should already exist)
- [ ] `pending_accounts` collection exists (optional)

**To verify:**
1. Go to https://console.firebase.google.com/
2. Select **traditions-c1cf5**
3. Click **Firestore Database**
4. Look for collections on the left

### 2. Security Rules Deployed
- [ ] Rules are in "production mode" (not test mode)
- [ ] Can read own user profile
- [ ] Can create products if has UPLOAD_PRODUCTS permission
- [ ] Cannot read other users' profiles

**To verify:**
1. Click **Firestore Database** → **Rules** tab
2. See the complete security rules published
3. Click **Publish** if not already published

### 3. Authentication Configured
- [ ] Email/Password enabled
- [ ] At least one test user created
- [ ] Users can sign in

**To verify:**
1. Click **Authentication** (left sidebar)
2. Click **Sign-in method** tab
3. See "Email/Password" is enabled
4. Click **Users** tab to see created accounts

### 4. Test Users Created (11 Total)
- [ ] GM11788@GMAIL.COM (vendor_premium)
- [ ] cultivator@traditions.local (vendor_premium)
- [ ] processor@traditions.local (vendor_premium)
- [ ] distributor@traditions.local (buyer_commercial)
- [ ] retailer@traditions.local (buyer_retail)
- [ ] transporter@traditions.local (vendor_standard)
- [ ] laboratory@traditions.local (vendor_standard)
- [ ] trial.vendor@traditions.local (vendor_trial)
- [ ] trial.buyer@traditions.local (buyer_trial)
- [ ] admin@traditions.local (platform_admin)
- [ ] manager@traditions.local (vendor_manager)

**To verify:**
1. Click **Authentication** → **Users** tab
2. Count the users listed

---

## 🧪 Testing Steps

### Test 1: Vendor Upload (Vendor Premium)
**Account**: GM11788@GMAIL.COM / VendorTest@2025!

1. Open `vendor-manager.html`
2. Sign in with above credentials
3. Verify you see:
   - ✅ Light blue upload sections
   - ✅ Vendor info card with license info
   - ✅ Single product upload form
   - ✅ Bulk upload section
4. Upload a product:
   - Name: "Test Flower"
   - Category: "Flower"
   - Unit: "lb"
   - Price: "300"
   - Click "Deploy Product"
5. Check Firestore:
   - Go to Firebase Console
   - Click **Firestore Database**
   - Open `inventory` collection
   - See your product with fields:
     - `productName`: "Test Flower"
     - `vendorId`: (your Firebase UID)
     - `vendorEmail`: "GM11788@GMAIL.COM"
     - `vendorName`: "Test Vendor - GM11788"

**Expected Result**: ✅ Product appears in Firestore with vendor metadata

---

### Test 2: Vendor Upload (Vendor Standard - Limited)
**Account**: transporter@traditions.local / Transporter@2025!

1. Open `vendor-manager.html`
2. Sign in with above credentials
3. Verify you see:
   - ✅ Light blue upload sections
   - ✅ But NO "Bulk Upload" section (standard vendors can't bulk upload)
   - ✅ Only "Single Upload" and "Inventory" tabs
4. Try to upload a product
5. Check Firestore - product should appear but with vendor: "transporter@traditions.local"

**Expected Result**: ✅ Upload works but limited features visible

---

### Test 3: Buyer Cannot Upload (Distributor/Commercial Buyer)
**Account**: distributor@traditions.local / Distributor@2025!

1. Open `vendor-manager.html`
2. Sign in with above credentials
3. Verify you see:
   - ✅ Login screen redirects or shows permission denied
   - ✅ No upload sections visible
4. Open `traditions-bulk.html` instead
5. You should see:
   - ✅ Marketplace products
   - ✅ Search/filter
   - ✅ Purchase buttons enabled
   - ✅ Offer creation enabled (commercial buyer feature)

**Expected Result**: ✅ Cannot access vendor manager, but can access marketplace

---

### Test 4: Trial Buyer (View Only)
**Account**: trial.buyer@traditions.local / TrialBuyer@2025!

1. Open `traditions-bulk.html`
2. Sign in with above credentials
3. Verify you see:
   - ✅ Marketplace products
   - ✅ Search/filter works
   - ✅ But purchase buttons are DISABLED
   - ✅ Message: "Upgrade account to purchase"

**Expected Result**: ✅ Can view but cannot buy

---

### Test 5: Admin/Vendor Manager
**Account**: manager@traditions.local / VendorMgr@2025!

1. Open `vendor-manager.html`
2. Sign in with above credentials
3. Verify you see:
   - ✅ Admin dashboard appears (not vendor upload interface)
   - ✅ Vendor management tools
   - ✅ Sales analytics
   - ✅ Listing approval interface

**Expected Result**: ✅ Admin dashboard accessible

---

### Test 6: Products Appear in Marketplace
1. Sign in as vendor: cultivator@traditions.local
2. Upload a product in `vendor-manager.html`
3. Open `traditions-bulk.html` (marketplace)
4. Search for the product you just uploaded
5. Verify:
   - ✅ Product appears in marketplace
   - ✅ Vendor name shows: "Cultivator Vendor"
   - ✅ Price and details correct
   - ✅ Buyer can see vendor info

**Expected Result**: ✅ Vendor products visible to all buyers

---

### Test 7: Vendor Ownership
1. Sign in as vendor: processor@traditions.local
2. Upload a product: "Concentrates"
3. Sign in as a different vendor: cultivator@traditions.local
4. Try to edit the "Concentrates" product
5. Verify:
   - ✅ Editing is blocked (permission denied)
   - ✅ Only original vendor can edit
   - ✅ Admins can edit any product

**Expected Result**: ✅ Vendor ownership enforced

---

## 🔍 Firestore Database Verification

### Check User Profiles
1. Firebase Console → Firestore Database
2. Click `users` collection
3. Click any document
4. Verify fields:
   ```
   uid: (Firebase user ID)
   email: (user's email)
   displayName: (user's name)
   licenseNumber: (e.g., CVAN-001)
   licenseType: (e.g., Cultivator)
   role: (e.g., vendor_premium)
   permissions: [array of permission strings]
   canUpload: (true/false)
   canBuy: (true/false)
   canManageVendors: (true/false)
   createdAt: (timestamp)
   isTestUser: (true)
   ```

### Check Product Records
1. Firebase Console → Firestore Database
2. Click `inventory` collection
3. Click any product document
4. Verify vendor-related fields:
   ```
   productName: "Test Product"
   category: "Flower"
   price: 300
   vendorId: (Firebase UID of vendor)
   vendorEmail: "GM11788@GMAIL.COM"
   vendorName: "Test Vendor - GM11788"
   createdAt: (timestamp)
   ```

### Check Security Rules Are Working
1. Open browser Developer Tools (F12)
2. Open Console tab
3. Sign in as trial.buyer@traditions.local
4. Go to `traditions-bulk.html`
5. Try to make a purchase (should work)
6. Open Network tab → See queries to Firestore
7. Verify:
   - ✅ Can READ marketplace (VIEW_MARKETPLACE permission)
   - ✅ Cannot WRITE orders (no MAKE_PURCHASES in trial_buyer)
   - ✅ Firestore security rules enforcing access

---

## 🐛 Troubleshooting

### Issue: "Cannot read property 'permissions' of undefined"
**Cause**: User profile not created in Firestore  
**Solution**:
1. Go to Firebase Console → Firestore
2. Click `users` collection
3. Create document manually with user data
4. Or run the initialize-users.js script to auto-create all

### Issue: "Permission denied" on upload
**Cause**: User doesn't have UPLOAD_PRODUCTS permission  
**Solution**:
1. Check user's role is "vendor_premium" or "vendor_standard"
2. Verify Firestore has `permissions` array with "UPLOAD_PRODUCTS"
3. Check security rules are allowing the write

### Issue: "User not found" on login
**Cause**: Test user doesn't exist in Firebase Auth  
**Solution**:
1. Go to Firebase Console → Authentication → Users
2. Click "Add user"
3. Create user with email and password from test accounts list
4. Or run initialize-users.js script to auto-create all

### Issue: Products don't appear in marketplace
**Cause**: Permissions or collection structure issue  
**Solution**:
1. Check `inventory` collection exists in Firestore
2. Verify product has `vendorId`, `vendorEmail`, `vendorName`
3. Check user can READ products (VIEW_MARKETPLACE permission)
4. Check marketplace.html queries correctly

### Issue: Can upload but products lost
**Cause**: Firestore quota or connection issue  
**Solution**:
1. Check Firebase quota: https://console.firebase.google.com/ → Usage
2. Verify database is not full
3. Check network connection
4. Retry upload

---

## 📊 Testing Report Template

After running all tests, fill this out:

```
TEST RESULTS - Traditions Vendor System
Date: ___________
Tester: ___________

AUTHENTICATION:
[ ] Test user login works
[ ] Password validation works
[ ] Session persists
[ ] Logout works

PERMISSIONS:
[ ] Vendor can upload
[ ] Buyer cannot upload
[ ] Buyer can purchase
[ ] Trial buyer cannot purchase
[ ] Admin can manage vendors

FIRESTORE:
[ ] Users collection has data
[ ] Products collection has data
[ ] Vendor metadata present
[ ] Security rules enforced

VENDOR MANAGER:
[ ] Light blue sections visible
[ ] Single upload works
[ ] Bulk upload works
[ ] Inventory shows products
[ ] Product editing works
[ ] Product deletion works

MARKETPLACE:
[ ] Products visible
[ ] Vendor info shows
[ ] Search works
[ ] Filtering works
[ ] Purchase flow works

OVERALL: [ ] PASS [ ] FAIL [ ] PARTIAL

Issues Found:
___________________________________________________________
___________________________________________________________

Notes:
___________________________________________________________
___________________________________________________________
```

---

## ✨ Success Indicators

You know everything is working when:

✅ **Vendor can sign in** to vendor-manager.html  
✅ **Upload section is light blue** - vendor features highlighted  
✅ **Single product uploads** - appears in Firestore  
✅ **Bulk upload works** - multiple products created  
✅ **Products appear in marketplace** - visible to all users  
✅ **Vendors can only edit own products** - ownership enforced  
✅ **Buyers can search products** - marketplace works  
✅ **Trial buyers can view but not purchase** - permissions work  
✅ **Firestore has all user data** - profiles synced  
✅ **Security rules allow correct access** - no permission errors  

---

## 🎓 What's Next?

After verifying everything works:

1. **Payment Integration** - Connect Stripe/payment processor
2. **Email Notifications** - Send order confirmations
3. **Order Management** - Track orders and shipments
4. **Analytics Dashboard** - Show vendor sales metrics
5. **Mobile App** - Extend to mobile platforms

---

## 📞 Support

For issues:
1. Check console errors (F12)
2. Check Firestore rules (security issue?)
3. Check user permissions (role/permissions correct?)
4. Check database (collection exists?)
5. Check test account credentials (exact match?)

All test account credentials are in `js/test-users.js` for reference.
