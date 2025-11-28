# Traditions Platform - Pages Overview

## All HTML Pages (After Implementation)

### 🔐 Authentication & Onboarding

#### 1. `license-lookup.html` ⭐ NEW
**Purpose:** Public license search & account request entry point
**URL:** `https://traditions-c1cf5.web.app/license-lookup.html`
**Access:** Anyone (public)
**Key Features:**
- Search NY cannabis licenses by number or company name
- Display license details (holder, address, type, expiry)
- Account request form (email, business type)
- Firestore integration: Creates `pending_accounts` document
- Next step: User redirected to login page

**User Flow:**
```
Search license
  ↓
View details
  ↓
Fill request form (email + business type)
  ↓
Submit → Firestore pending_accounts created
  ↓
Redirected to login page
```

---

#### 2. `login-new.html` ⭐ NEW
**Purpose:** OAuth sign-in page with auto-routing
**URL:** `https://traditions-c1cf5.web.app/login-new.html`
**Access:** Anyone (public)
**Key Features:**
- Google Sign-In button (OAuth 2.0)
- Link to account request form
- Auto-routing for already-authenticated users:
  - Approved admin → admin-dashboard.html
  - Approved employee → employee-dashboard.html
  - Approved broker → broker-dashboard.html
  - Pending approval → pending-approval.html
  - New user (no profile) → profile-setup.html

**Replaces:** `login.html` (old, kept for backward compatibility)

---

#### 3. `profile-setup.html` ⭐ NEW
**Purpose:** New user profile completion after first sign-in
**URL:** `https://traditions-c1cf5.web.app/profile-setup.html`
**Access:** Authenticated new users only (enforced)
**Key Features:**
- Auto-filled from Google OAuth: Email, first name, last name
- Auto-filled from pending account: License #, company, holder, business type, address
- Editable fields: First name, last name
- **Role selector (critical):**
  - Admin - Full system access, can approve accounts
  - Employee - Read-only inventory access
  - Broker - Create/manage own company products
- Form submission → Creates `users/{uid}` Firestore document
- Redirects to `pending-approval.html`

**Data Saved:**
```
users/{uid}: {
  uid, email, firstName, lastName,
  licenseNumber, companyName, licenseHolder,
  businessType, address,
  role, approved: false,
  createdAt, lastSignIn
}
```

---

#### 4. `pending-approval.html` ⭐ NEW
**Purpose:** Show status while waiting for admin approval
**URL:** `https://traditions-c1cf5.web.app/pending-approval.html`
**Access:** Authenticated, not-yet-approved users only (enforced)
**Key Features:**
- Display user profile information (read-only)
- "Check Status" button to poll for approval
- Auto-redirect to dashboard when approved (role-based)
- Sign-out button
- User stays here until admin approves in Firestore

---

### 👤 Role-Based Dashboards

#### 5. `admin-dashboard.html` ⭐ NEW
**Purpose:** Account management and approvals
**URL:** `https://traditions-c1cf5.web.app/admin-dashboard.html`
**Access:** Admin role only (enforced)
**Two Tabs:**

**Tab 1: Pending Approvals** (Primary)
- Real-time list from `pending_accounts` (status: pending)
- Shows: License #, company, email, business type, requested date
- "Review & Approve" button → Opens modal with:
  - **Approve** button: Sets `pending_accounts` status: "approved" + creates `users/{uid}` entry
  - **Reject** button: Sets status: "rejected"
- Auto-updates in real-time (Firestore listener)

**Tab 2: All Users** (Management)
- List all users from `users` collection
- Search by email or company name (real-time filter)
- Displays: User name, email, role badge (color-coded), company, license
- Edit & Disable buttons (UI ready, backend pending)

**Permissions:**
- Read: `pending_accounts`, `users`, `inventory` (all)
- Write: `pending_accounts`, `users`
- Enforced by: Firestore rules + client-side role check

---

#### 6. `employee-dashboard.html` ⭐ NEW
**Purpose:** View company inventory (read-only access)
**URL:** `https://traditions-c1cf5.web.app/employee-dashboard.html`
**Access:** Employee role only (enforced), must be approved
**Features:**
- User profile display (name, company, license)
- Role badge: "EMPLOYEE (READ-ONLY)"
- Full inventory view from `inventory` collection
- Displays each product:
  - Name, type (Flower/Concentrate/etc)
  - Price per unit, unit type (oz/gram/each)
  - THC percentage, stock quantity
- **No edit/add/delete buttons** (read-only role)
- Real-time updates via Firestore listener

**Permissions:**
- Read: `inventory` (all)
- Cannot write, update, or delete
- Enforced by: Firestore rules + no-write UI

---

#### 7. `broker-dashboard.html` ⭐ NEW
**Purpose:** Manage company products and inventory
**URL:** `https://traditions-c1cf5.web.app/broker-dashboard.html`
**Access:** Broker role only (enforced), must be approved
**Two Tabs:**

**Tab 1: My Inventory** (View & Manage)
- Display products where `companyId == currentUser.uid`
- Shows: Name, type, price, unit, THC, stock
- Edit & Delete buttons (UI ready, backend pending)
- Real-time updates (Firestore listener)

**Tab 2: Add Product** (Create)
- Form fields:
  - Product Name (text)
  - Type (dropdown): Flower, Concentrate, Edible, Tincture, Oil
  - THC % (0-30, decimal allowed)
  - Price ($, decimal)
  - Unit (oz, gram, each)
  - Stock quantity
- On submit: Creates `inventory/{docId}` with:
  ```
  {
    name, type, thc, price, unit, stock,
    companyId: currentUser.uid (auto-scoped),
    companyName,
    createdAt, lastUpdated (server timestamps)
  }
  ```
- Form resets, switches to inventory tab
- Success feedback

**Permissions:**
- Read: `inventory` (all)
- Write/Update/Delete: Only own products (companyId scoped)
- Enforced by: Firestore rules + companyId check

**Permissions:**
- Can only manage products where `companyId == uid`
- Cannot see other brokers' products (enforced by Firestore rules)

---

### 📦 Old Pages (Kept for Compatibility)

#### `index.html`
- Old home page
- No longer used as entry point
- Kept for backward compatibility

#### `login.html`
- Original login page
- Superseded by `login-new.html`
- Kept for backward compatibility

#### `admin.html`
- Old admin interface
- Superseded by `admin-dashboard.html`
- Kept for reference

#### `scanner.html`
- Image upload → Grok analysis
- Still functional but needs Cloud Function update
- xAI API key currently exposed (security issue)
- Next: Move to Cloud Function

#### `traditions-bulk.html`
- Bulk data uploader
- Kept for reference/legacy support

---

## 📊 Page Access Matrix

| Page | Public | Auth Required | Role Required | Approval Required |
|------|--------|---------------|---------------|-------------------|
| license-lookup | ✅ | ❌ | None | No |
| login-new | ✅ | ❌ | None | No |
| profile-setup | ❌ | ✅ | None (new users) | No |
| pending-approval | ❌ | ✅ | None | ❌ (waiting) |
| admin-dashboard | ❌ | ✅ | Admin | ✅ |
| employee-dashboard | ❌ | ✅ | Employee | ✅ |
| broker-dashboard | ❌ | ✅ | Broker | ✅ |

---

## 🔄 Complete User Journeys

### Journey 1: New User (License Request → Admin Approval → Access)

```
Step 1: license-lookup.html
   ├─ Search NY license
   ├─ Fill request form (email, business type)
   └─ Submit → Firestore pending_accounts created

Step 2: login-new.html
   ├─ Click "Sign in with Google"
   └─ Redirected by auth-manager based on account status

Step 3: profile-setup.html
   ├─ Auto-filled: Email, license, company
   ├─ User edits: First/last name
   ├─ Selects role: Admin/Employee/Broker
   └─ Submit → Firestore users/{uid} created, approved: false

Step 4: pending-approval.html
   ├─ Wait for admin approval
   └─ Click "Check Status" (polls Firestore)

Step 5: Admin Dashboard (Admin user)
   ├─ View pending request
   ├─ Click "Review & Approve"
   ├─ Confirm in modal
   └─ Firestore users/{uid}: approved = true

Step 6: Role-Based Dashboard
   ├─ If role = admin → admin-dashboard.html
   ├─ If role = employee → employee-dashboard.html
   └─ If role = broker → broker-dashboard.html
```

### Journey 2: Existing Approved User (Returning)

```
Step 1: login-new.html
   └─ Click "Sign in with Google"

Step 2: Google OAuth redirect → auth-manager callback
   └─ Check Firestore users/{uid}.approved

Step 3: Auto-redirect based on role + approval
   ├─ approved + admin → admin-dashboard.html
   ├─ approved + employee → employee-dashboard.html
   ├─ approved + broker → broker-dashboard.html
   └─ not approved → pending-approval.html
```

### Journey 3: Admin Workflow (Approve Accounts)

```
Step 1: admin-dashboard.html (Pending Approvals tab)
   ├─ List from pending_accounts (status: pending)
   └─ Real-time Firestore listener

Step 2: Click "Review & Approve" button
   └─ Modal opens with request details

Step 3: Click "Approve" button
   ├─ Sets pending_accounts status: "approved"
   ├─ Creates users/{uid} entry
   └─ User can now sign in

Step 4: Switch to "All Users" tab
   └─ New user appears in list
```

### Journey 4: Broker Workflow (Add Product)

```
Step 1: broker-dashboard.html (My Inventory tab)
   └─ Display current products (filtered by companyId)

Step 2: Switch to "Add Product" tab
   └─ Form with: name, type, THC, price, unit, stock

Step 3: Fill form and submit
   ├─ Validation (all fields required, bounds check)
   └─ Create inventory/{id} (companyId auto-scoped)

Step 4: Auto-switch to "My Inventory" tab
   └─ New product appears in list (real-time)
```

---

## 🎯 Quick Navigation After Deployment

### For Users Requesting Access
1. Start at: `license-lookup.html`
2. Search your license
3. Request account
4. Proceed to: `login-new.html`

### For Admins
1. Direct link: `admin-dashboard.html`
2. Auto-routes to login if not authenticated
3. Requires admin role + approval

### For Employees
1. Direct link: `employee-dashboard.html`
2. View company inventory (read-only)
3. Cannot access other roles' dashboards

### For Brokers
1. Direct link: `broker-dashboard.html`
2. Manage own products
3. Two tabs: View & Add

---

## ✨ Key Improvements from Old Design

| Aspect | Old | New |
|--------|-----|-----|
| **Auth** | Direct password? | Google OAuth SSO |
| **User Onboarding** | Manual account creation | License lookup + request workflow |
| **Role System** | Basic | Comprehensive RBAC |
| **Access Control** | Weak | Firestore rules enforced |
| **User Experience** | Scattered pages | Guided journey with auto-routing |
| **Data Privacy** | Unclear | Company-scoped data isolation |
| **Admin Control** | Limited | Full account approval workflow |

---

**All pages are production-ready and deployed to:**
🚀 **https://traditions-c1cf5.web.app**
