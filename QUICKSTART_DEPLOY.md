# Quick Start - Deploy Traditions Platform

## Status
All frontend files created. Ready to deploy to Firebase Hosting.

## Files Created (Complete List)

### HTML Pages (Public folder)
- ✅ `license-lookup.html` - Public license search & account request
- ✅ `login-new.html` - OAuth login page
- ✅ `profile-setup.html` - New user profile completion
- ✅ `pending-approval.html` - Approval status page
- ✅ `admin-dashboard.html` - Admin account management & approvals
- ✅ `employee-dashboard.html` - Employee read-only inventory view
- ✅ `broker-dashboard.html` - Broker product management

### JavaScript Modules (Public/js folder)
- ✅ `auth-manager.js` - Google Sign-In & auth routing (261 lines)
- ✅ `licenses.js` - NY cannabis license database with search (54 lines)
- ✅ `firebase-init.js` - Firebase app initialization (existing)
- ✅ `firebase-config.js` - Firebase config (existing)

### Configuration
- ✅ `firestore.rules` - Firestore security rules with RBAC
- ✅ `firebase.json` - Firebase hosting config (existing)

## Step-by-Step Deployment

### 1. Install Node.js & Tools (One-time)
If you haven't installed Node.js:
- Download from https://nodejs.org/ (LTS version)
- Install to your machine
- Open new PowerShell/Command Prompt

Verify installation:
```powershell
node --version
npm --version
```

Install Firebase CLI globally:
```powershell
npm install -g firebase-tools
```

### 2. Navigate to Project Directory
```powershell
cd "c:\Users\gm117\Desktop\traditions-live"
```

### 3. Login to Firebase (One-time)
```powershell
firebase login
```
- Opens browser to Google sign-in
- Authorizes Firebase CLI to access `traditions-c1cf5` project

### 4. Deploy Firestore Security Rules
```powershell
firebase deploy --only firestore:rules
```

Expected output:
```
i  firestore: reading rules from firestore.rules...
✔  firestore: rules updated successfully
```

### 5. Deploy Hosting (HTML & JS files)
```powershell
firebase deploy --only hosting
```

Expected output:
```
i  hosting: uploading files from public [###] 100%
✔  hosting: deploy complete

Hosting URL: https://traditions-c1cf5.web.app
```

### 6. Full Deploy (Both)
Or do everything at once:
```powershell
firebase deploy
```

---

## After Deployment - Test the Flow

### Test 1: Request Account
1. Visit: `https://traditions-c1cf5.web.app/license-lookup.html`
2. Search: "OCM" (find sample licenses)
3. Click a license to select
4. Enter email: `test@example.com`
5. Select business type: "Processor"
6. Click "Submit Account Request"
7. **Verify:** Open Firebase Console → Firestore → `pending_accounts` collection
   - Should see new document with status: "pending"

### Test 2: Admin Approval
1. Visit: `https://traditions-c1cf5.web.app/admin-dashboard.html`
   - You'll be redirected to login (expected)
2. Visit: `https://traditions-c1cf5.web.app/login-new.html`
3. Sign in with Google (must be approved admin to see dashboard)
4. After sign-in, check which page you land on:
   - **New user** → `profile-setup.html`
   - **Approved admin** → `admin-dashboard.html`
   - **Pending approval** → `pending-approval.html`

### Test 3: Full User Journey
1. Go to `license-lookup.html`
2. Request account with test email
3. Sign in with Google (will go to profile setup)
4. Complete profile (select "admin" role)
5. Redirected to `pending-approval.html`
6. In Firebase Console, approve the account:
   - Open `users` collection
   - Find your user document
   - Set `approved: true`
7. Back on website, click "Check Status"
8. Should redirect to `admin-dashboard.html`

---

## File Structure After Deploy

```
public/
├── admin-dashboard.html
├── admin.html (old)
├── broker-dashboard.html
├── employee-dashboard.html
├── firebase-config.js
├── firebase-init.js
├── index.html (old)
├── license-lookup.html
├── login-new.html
├── login.html (old)
├── pending-approval.html
├── profile-setup.html
├── scanner.html (old - needs Cloud Function)
├── traditions-bulk.html (old)
└── js/
    ├── auth-manager.js (NEW)
    ├── firebase-config.js (copy)
    ├── firebase-init.js (copy)
    └── licenses.js (NEW)
```

---

## Verify Deployment

After deploy, check:
1. ✅ All HTML pages load (no 404 errors)
2. ✅ Google Sign-In button appears
3. ✅ License search works
4. ✅ Firestore rules applied (check Console)
5. ✅ Account requests save to `pending_accounts` collection

---

## Troubleshooting

**Issue:** "firebase: The term 'firebase' is not recognized"
- **Fix:** Install Node.js first, then install Firebase CLI globally
- Run: `npm install -g firebase-tools`

**Issue:** Deploy says "Too many files"
- **Fix:** Ensure `.firebaserc` and `firebase.json` are in project root
- Check that `.firebaseignore` exists and excludes `node_modules/`

**Issue:** Pages show blank or errors
- **Fix:** Open browser DevTools (F12) → Console
- Check for errors, usually related to Firebase initialization
- Verify Firebase config is correct in `firebase-config.js`

**Issue:** Google Sign-In doesn't work
- **Fix:** Ensure domain is added to OAuth consent screen
- Firebase Hosting domains are auto-approved, but verify in Google Cloud Console

---

## Important URLs After Deploy

- **Home/Login:** https://traditions-c1cf5.web.app/login-new.html
- **License Lookup:** https://traditions-c1cf5.web.app/license-lookup.html
- **Admin Dashboard:** https://traditions-c1cf5.web.app/admin-dashboard.html
- **Broker Dashboard:** https://traditions-c1cf5.web.app/broker-dashboard.html
- **Employee Dashboard:** https://traditions-c1cf5.web.app/employee-dashboard.html

---

## What's Next

After successful deployment:

1. **Expand License Database**
   - Import full NY OCM cannabis license CSV into `js/licenses.js`
   - Current: 3 sample records
   - Action: Parse CSV and populate array

2. **Create Cloud Function for Grok API**
   - Move xAI API key from client to secure Cloud Function
   - Endpoint: `/api/analyzeImage` (HTTP callable)
   - Update `scanner.html` to call function

3. **Complete Product Upload**
   - Finish `uploadData()` in `scanner.html`
   - Integrate with `inventory` collection
   - Add role checks (broker only)

4. **Add Input Validation**
   - License format validation
   - Email validation
   - Number bounds checking
   - XSS sanitization

5. **Monitor & Optimize**
   - Check Firestore usage in Console
   - Monitor auth metrics
   - Test with multiple users

---

## Command Reference

```powershell
# Login
firebase login

# Deploy everything
firebase deploy

# Deploy only hosting
firebase deploy --only hosting

# Deploy only Firestore rules
firebase deploy --only firestore:rules

# View deployment logs
firebase deploy --debug

# Check status
firebase status

# View real-time logs
firebase functions:log
```

---

Done! Your Traditions platform SSO system is ready for deployment. 🚀
