# Traditions Platform - Complete File Manifest

## Project: Cannabis Supply Chain SSO & Role-Based Access Control

**Created:** Today
**Status:** Ready for Firebase deployment (requires Node.js + Firebase CLI)
**Deployment URL:** https://traditions-c1cf5.web.app

---

## Authentication & Core Files

### `public/js/auth-manager.js` ⭐ NEW
**Purpose:** Google Sign-In integration and authentication flow
**Size:** 261 lines
**Key Exports:**
- `initializeGoogleSignIn()` - Initialize Google OAuth
- `handleGoogleSignIn(response)` - OAuth callback, Firebase sign-in, role-based routing
- `renderGoogleSignInButton(containerId)` - Render sign-in button
- `signOut()` - Firebase sign-out, redirect to login
- `getUserRole(uid)` - Fetch user role from Firestore

**Auth Flow:**
```
User clicks Google Sign-In
    ↓
handleGoogleSignIn() fires
    ↓
Sign in to Firebase with Google credential
    ↓
Check if user profile exists in Firestore
    ├─ No profile → profile-setup.html (new user)
    ├─ Profile exists, not approved → pending-approval.html
    └─ Profile exists, approved → dashboard based on role
        ├─ admin → admin-dashboard.html
        ├─ employee → employee-dashboard.html
        └─ broker → broker-dashboard.html
```

### `public/js/licenses.js` ⭐ NEW
**Purpose:** NY cannabis license database for account lookup
**Size:** 54 lines
**Key Functions:**
- `searchLicenses(query)` - Full-text search (case-insensitive)
- `getLicenseByNumber(licenseNumber)` - Get single license

**Data Fields:**
- licenseNumber (OCM-XXXX format)
- companyName, licenseHolder
- address, city, state, zip
- licenseType (Processor|Distributor|Cultivator)
- issuedDate, expiryDate

**Current:** 3 sample records (ready to expand with full NY OCM data)

### `public/js/firebase-init.js` ⭐ EXISTING
**Purpose:** Centralized Firebase app initialization
**Exports:** `app`, `db`, `storage`, `auth`
**Prevents:** Duplicate Firebase initialization across pages

### `public/js/firebase-config.js` ⭐ EXISTING
**Purpose:** Firebase project credentials (no secrets)
**Contains:** Project ID, API key, auth domain, database URL, etc.

---

## User-Facing Pages

### `public/license-lookup.html` ⭐ NEW
**Access:** Public (anyone)
**Purpose:** Find your NY cannabis license & request an account

**Features:**
1. **License Search**
   - Search by license # or company name
   - Real-time results (imports from `licenses.js`)
   - Display full license details

2. **Account Request Form**
   - Email address input
   - Business type selector
   - Submits to Firestore `pending_accounts` collection

**Firestore Integration:**
```javascript
pending_accounts/{requestId}: {
  licenseNumber, licenseHolder, companyName, email, businessType,
  status: 'pending', requestedAt, address, city, zip
}
```

**Next Steps:** User gets redirected to login page

---

### `public/login-new.html` ⭐ NEW
**Access:** Public (anyone)
**Purpose:** Sign in with Google OAuth

**Features:**
1. Google Sign-In button (styled)
2. Link to account request form
3. Auto-routing for already-logged-in users

**Auth Check:**
- If authenticated + approved → Role-based dashboard
- If authenticated + pending → Pending approval page
- If authenticated + no profile → Profile setup page
- If not authenticated → Show sign-in button

**Old File:** `public/login.html` (superseded but kept for compatibility)

---

### `public/profile-setup.html` ⭐ NEW
**Access:** Authenticated new users only (enforced via auth check)
**Purpose:** Complete profile after first Google Sign-In

**Features:**
1. **Auto-filled Fields (read-only)**
   - Email (from Google)
   - First/Last name (from Google)
   - License number, company, holder, business type (from pending account)
   - Address (from license data)

2. **Editable Fields**
   - First name, last name (override Google)

3. **Role Selection**
   - Admin (full system access)
   - Employee (read-only inventory)
   - Broker (manage own company products)

4. **Form Submission**
   - Save to Firestore `users/{uid}`
   - Redirect to `pending-approval.html`

**Firestore Save:**
```javascript
users/{uid}: {
  uid, email, firstName, lastName, licenseNumber, companyName,
  licenseHolder, businessType, address, role,
  approved: false, createdAt, lastSignIn
}
```

---

### `public/pending-approval.html` ⭐ NEW
**Access:** Authenticated users awaiting admin approval
**Purpose:** Show approval status and wait for admin action

**Features:**
1. Display user's profile information
2. "Check Status" button (polls Firestore for approval)
3. Auto-redirect when approved (based on role)
4. Sign-out button

**Displays:**
- Email, license, company, role
- Status message: "Awaiting admin approval"

---

### `public/admin-dashboard.html` ⭐ NEW
**Access:** Admin role only (enforced via auth check)
**Purpose:** Manage accounts and approve user requests

**Tab 1: Pending Approvals**
- List all `pending_accounts` with status: "pending"
- Shows: License #, company, email, business type, request date
- "Review & Approve" button opens modal with:
  - **Approve** button: Sets `approved: true`, creates user entry
  - **Reject** button: Sets status: "rejected"

**Tab 2: All Users**
- List all users from `users` collection
- Search by email or company name
- Displays: Name, email, role badge, company, license
- Edit & Disable buttons (UI ready, backend pending)

**Firestore Queries:**
- Read: `pending_accounts` (status: pending), `users` (all)
- Write: Updates status, sets approved flag

---

### `public/employee-dashboard.html` ⭐ NEW
**Access:** Employee role only (enforced)
**Purpose:** View company inventory (read-only)

**Features:**
1. User profile display
2. Full inventory view from `inventory` collection
3. Read-only access (no add/edit buttons)

**Displays:**
- Product name, type, price per unit, unit type, THC %, stock qty

**Firestore:**
- Read: All `inventory` documents
- Cannot write or delete

**Permissions:** Can only view, cannot manage products

---

### `public/broker-dashboard.html` ⭐ NEW
**Access:** Broker role only (enforced)
**Purpose:** Manage products and inventory

**Tab 1: My Inventory**
- Display products where `companyId == currentUser.uid`
- Shows: Name, type, price, unit, THC, stock
- Edit button (UI, backend pending)

**Tab 2: Add Product**
- Form fields:
  - Product Name
  - Type (Flower|Concentrate|Edible|Tincture|Oil)
  - THC percentage (0-30)
  - Price, Unit, Stock quantity
- On submit: Creates `inventory` document

**Firestore Save:**
```javascript
inventory/{docId}: {
  name, type, thc, price, unit, stock,
  companyId: currentUser.uid,
  companyName,
  createdAt, lastUpdated (server timestamps)
}
```

**Permissions:**
- Can only view own company products
- Can create/update/delete own products
- Firestore rules enforce scoping

---

## Configuration & Rules

### `firestore.rules` ⭐ NEW
**Purpose:** Database-level security and role-based access control
**Status:** Ready to deploy (via `firebase deploy --only firestore:rules`)

**Collections Protected:**
- `users` - Admin writes all, users read own
- `pending_accounts` - Public can create, admin manages
- `inventory` - All authenticated read, brokers own only

**Role-Based Rules:**
```
Admin:    Read/write all
Employee: Read-only inventory
Broker:   Read all inventory, write/delete own company
Public:   Can create pending_accounts (account requests)
```

### `firebase.json` ⭐ EXISTING
**Hosting Config:**
- Public directory: `public/`
- Ignored: `node_modules/`, `.git/`, etc.
- No SPA rewrites (correct for multi-page app)

### `.firebaserc` ⭐ SHOULD EXIST
**Project Binding:**
```json
{
  "projects": {
    "default": "traditions-c1cf5"
  }
}
```

### `IMPLEMENTATION_GUIDE.md` ⭐ NEW
**Documentation:** Complete implementation reference
- Database schema details
- Firestore rules explanation
- Deployment instructions
- Testing checklist
- Next steps for Cloud Functions

### `QUICKSTART_DEPLOY.md` ⭐ NEW
**Quick Reference:** Step-by-step deployment guide
- Node.js setup
- Firebase CLI installation
- Deployment commands
- Testing flows
- Troubleshooting

---

## Old Files (Superseded but Kept)

### `public/login.html`
- Original login page
- Replaced by `login-new.html`
- Kept for backward compatibility

### `public/scanner.html`
- Image upload → Grok analysis
- Status: Functional but needs Cloud Function integration
- Next step: Move Grok API to secure Cloud Function

### `public/admin.html`
- Old admin interface
- Replaced by `admin-dashboard.html`

### `public/traditions-bulk.html`
- Bulk data uploader
- Kept for reference

### `public/index.html`
- Old home page
- Kept for reference

---

## Data Model Summary

### `users` Collection
```
{
  uid: "Firebase_UID",
  email: "user@example.com",
  firstName: "John",
  lastName: "Doe",
  licenseNumber: "OCM-001",
  companyName: "Example Cannabis Co",
  businessType: "Processor",
  role: "broker|admin|employee",
  approved: true|false,
  createdAt: timestamp,
  lastSignIn: timestamp
}
```

### `pending_accounts` Collection
```
{
  licenseNumber: "OCM-001",
  companyName: "Example Cannabis Co",
  email: "user@example.com",
  businessType: "Processor",
  status: "pending|approved|rejected",
  requestedAt: timestamp,
  approvedBy: "admin_uid" (if approved),
  rejectedBy: "admin_uid" (if rejected)
}
```

### `inventory` Collection
```
{
  name: "Premium Flower - Purple Haze",
  type: "Flower",
  thc: 22.5,
  price: 12.99,
  unit: "oz",
  stock: 50,
  companyId: "broker_uid",
  companyName: "Example Cannabis Co",
  createdAt: timestamp,
  lastUpdated: timestamp
}
```

---

## Deployment Checklist

- [ ] Install Node.js (if not already installed)
- [ ] Install Firebase CLI: `npm install -g firebase-tools`
- [ ] Navigate to project: `cd c:\Users\gm117\Desktop\traditions-live`
- [ ] Login to Firebase: `firebase login`
- [ ] Deploy rules: `firebase deploy --only firestore:rules`
- [ ] Deploy hosting: `firebase deploy --only hosting`
- [ ] Test license lookup: `https://traditions-c1cf5.web.app/license-lookup.html`
- [ ] Test login flow: `https://traditions-c1cf5.web.app/login-new.html`
- [ ] Verify Firestore: Check `pending_accounts`, `users` collections in Firebase Console
- [ ] Monitor: Watch Firestore usage in Firebase Console

---

## Key Statistics

| Category | Count |
|----------|-------|
| **New HTML Pages** | 7 |
| **New JS Modules** | 2 |
| **New Config Files** | 2 |
| **Total Lines of Code** | ~2,500+ |
| **Collections** | 3 (users, pending_accounts, inventory) |
| **User Roles** | 3 (admin, employee, broker) |
| **Business Types** | 3 (Processor, Distributor, Cultivator) |

---

## Next Priority Tasks

1. **Deploy** ⭐ High Priority
   - Install Node.js
   - Run: `firebase deploy`

2. **Expand License Database** ⭐ High Priority
   - Import full NY OCM CSV data
   - Update `public/js/licenses.js`

3. **Create Cloud Function** ⭐ High Priority
   - Move Grok API to secure endpoint
   - Remove client-side xAI key

4. **Input Validation** - Medium Priority
   - Add validation to all forms
   - Sanitize user inputs

5. **Email Notifications** - Low Priority
   - Notify users on approval
   - Notify admins on requests

---

**Created:** Today
**Status:** 80% Complete - Ready for deployment
**Contact:** Implementation complete, awaiting Node.js environment setup for Firebase CLI deployment.
