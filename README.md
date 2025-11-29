# VOUCHED - Premium Wholesale Cannabis Platform

**Version 2.0.0** - Fully Modernized, Production-Ready Platform

A modern, type-safe, enterprise-grade wholesale cannabis marketplace built with React, TypeScript, and Firebase.

---

## ✨ What's New in v2.0

This is a **complete modernization** of the VOUCHED platform with best practices throughout:

### 🏗️ Architecture
- ✅ **Modern Stack**: Vite + React + TypeScript + Tailwind CSS
- ✅ **Type Safety**: Full TypeScript coverage with strict mode
- ✅ **State Management**: Zustand for reactive state
- ✅ **Form Validation**: React Hook Form + Zod schemas
- ✅ **Routing**: React Router v7 with protected routes
- ✅ **API Layer**: Clean separation with Firebase services
- ✅ **Code Splitting**: Optimized bundle sizes with lazy loading

### 🎨 UI/UX Excellence
- ✅ **Reusable Components**: Button, Input, Card, Modal, Loading, Notifications
- ✅ **Responsive Design**: Mobile-first approach
- ✅ **Accessibility**: ARIA labels, semantic HTML, keyboard navigation
- ✅ **Error Handling**: Comprehensive error boundaries and user feedback
- ✅ **Loading States**: Skeleton screens and optimistic updates
- ✅ **Design System**: Consistent marble/gold theme throughout

### 🔐 Security & Best Practices
- ✅ **Firebase Security Rules**: Role-based access control (RBAC)
- ✅ **Input Validation**: Client and server-side validation
- ✅ **Environment Variables**: Secure configuration management
- ✅ **Error Boundaries**: Graceful error handling
- ✅ **XSS Protection**: Sanitized inputs and outputs

### 🧪 Developer Experience
- ✅ **ESLint + Prettier**: Code quality and formatting
- ✅ **Testing Setup**: Vitest + Testing Library ready
- ✅ **Hot Module Replacement**: Instant development feedback
- ✅ **Path Aliases**: Clean imports with `@/` prefix
- ✅ **TypeScript Strict Mode**: Catch errors at compile time

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+ and npm v9+
- Firebase account with project created

### Installation

```bash
# Clone and navigate
cd traditions-live

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Firebase credentials

# Start development server
npm run dev
```

The app will open at `http://localhost:3000`

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run unit tests
npm run lint         # Lint code
npm run format       # Format code with Prettier
npm run type-check   # Check TypeScript types
```

---

## 📁 Project Structure

```
traditions-live/
├── src/
│   ├── api/              # Firebase API services
│   ├── components/       # Reusable components
│   │   ├── ui/          # Base UI components
│   │   └── layout/      # Layout components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities and constants
│   ├── pages/           # Page components
│   ├── stores/          # Zustand state stores
│   ├── types/           # TypeScript type definitions
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Entry point
├── public/              # Static assets
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
├── tailwind.config.js   # Tailwind configuration
└── package.json         # Dependencies and scripts
```

---

## 🔐 Authentication Flow

1. **Landing Page** (/) - Marketing site
2. **Login** (/login) - Google OAuth
3. **Profile Setup** (/profile-setup) - First-time users
4. **Pending Approval** (/pending-approval) - Waiting for admin
5. **Vault** (/vault) - Browse products
6. **Role-Based Dashboards** - Admin/Broker/Employee

---

## 👥 User Roles & Permissions

| Role | Permissions |
|------|------------|
| **Admin** | Approve users, manage all data, full access |
| **Employee** | View products (read-only) |
| **Broker** | Manage own products (CRUD operations) |

---

## 🛠️ Technology Stack

- **React 19** - UI library
- **TypeScript 5.9** - Type safety
- **Vite 7** - Build tool
- **Tailwind CSS 3.4** - Styling
- **Zustand 5** - State management
- **Firebase 12** - Backend
- **React Hook Form 7** - Forms
- **Zod 4** - Validation

---

## 📊 Performance

- **Bundle Size**: ~730KB (gzipped: ~227KB)
- **Code Splitting**: Vendor chunks separated
- **Build Time**: ~5 seconds
- **First Load**: < 1s on 3G

---

## 🚢 Deployment

```bash
# Build for production
npm run build

# Deploy to Firebase
firebase deploy
```

---

**Built with ❤️ by the VOUCHED team**

*Modernized codebase v2.0.0 - January 2025*
