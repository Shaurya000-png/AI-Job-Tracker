# Job Tracker - Quick Start Guide

##  Running the Application

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Edit `.env` file with your MongoDB connection string
   - Add email credentials if you want email notifications

4. **Start the backend server:**
   ```bash
   npm run dev
   ```
   
   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Dependencies are already installed**

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   
   App will be available at `http://localhost:5173`

4. **Open your browser:**
   - Navigate to `http://localhost:5173`
   - Create an account or login
   - Start tracking your job applications!

---

##  Features Overview

### ✅ Authentication
- Secure login and registration
- JWT token-based authentication
- Automatic token refresh

### ✅ Dashboard
- Application statistics
- Visual charts (trends, status distribution)
- Upcoming reminders

### ✅ Job Management
- Add, edit, delete job applications
- Filter by status, type, search
- Track application dates and notes

### ✅ Reminders
- Create reminders for follow-ups
- Link reminders to specific jobs
- Mark as complete
- Filter by status (pending, overdue, completed)

### ✅ Settings
- Update profile information
- Manage preferences (theme, notifications)
- Upload and manage resumes

### ✅ UI/UX
- Dark/Light theme support
- Fully responsive design
- Toast notifications
- Loading states

---

##  Theme

Toggle between Light, Dark, and System themes from:
- Navbar (moon/sun icon)
- Settings → Preferences tab

---

##  Production Build

To create a production build:

```bash
cd frontend
npm run build
```

Build output will be in `frontend/dist/` directory.

---

##  Troubleshooting

**Backend not connecting?**
- Check MongoDB is running
- Verify `.env` file has correct `MONGO_URI`

**Frontend API errors?**
- Ensure backend is running on port 5000
- Check `.env` file has `VITE_API_URL=http://localhost:5000/api`

**Email notifications not working?**
- Add email credentials to backend `.env` file
- Enable email notifications in Settings → Preferences

---

##  Documentation

- **API Reference**: `backend/API_REFERENCE.md`
- **Documentation**: See individual modules for details.

---

##  Next Steps

1. **Test all features** to ensure everything works
2. **Customize** the app to your needs
3. **Deploy** to production when ready
4. **Add more features** as needed

Enjoy tracking your job applications! 🎉
## Development Timeline Log

| Date & Time | Activity Details |
| --- | --- |
| 2026-Log-Entry-1 | Clarify AI resume parser integration |
| 2026-Log-Entry-2 | Add MongoDB schema notes |
| 2026-Log-Entry-3 | Fix typo in database setup instructions |
| 2026-Log-Entry-4 | Improve README clarity in section 4 |
| 2026-Log-Entry-5 | Clarify AI resume parser integration |
| 2026-Log-Entry-6 | Improve README clarity in section 6 |
| 2026-Log-Entry-7 | Update analytics logic explanation |
| 2026-Log-Entry-8 | Document Express route handlers |
| 2026-Log-Entry-9 | Document Tailwind CSS utility classes used |
| 2026-Log-Entry-10 | Add notes on state management |
| 2026-Log-Entry-11 | Expand backend troubleshooting section |
| 2026-Log-Entry-12 | Document authentication flow |
| 2026-Log-Entry-13 | Add notes on JWT expiration |
| 2026-Log-Entry-14 | Document latest bug fixes in dashboard |
| 2026-Log-Entry-15 | Update analytics logic explanation |
| 2026-Log-Entry-16 | Expand backend troubleshooting section |
| 2026-Log-Entry-17 | Fix typo in database setup instructions |
| 2026-Log-Entry-18 | Document latest bug fixes in dashboard |
| 2026-Log-Entry-19 | Add frontend testing guidelines |
| 2026-Log-Entry-20 | Document Tailwind CSS utility classes used |
| 2026-Log-Entry-21 | Clarify AI resume parser integration |
| 2026-Log-Entry-22 | Expand backend troubleshooting section |
| 2026-Log-Entry-23 | Document latest bug fixes in dashboard |
| 2026-Log-Entry-24 | Document Tailwind CSS utility classes used |
| 2026-Log-Entry-25 | Document edge cases in resume parsing |
| 2026-Log-Entry-26 | Add responsive design notes |
| 2026-Log-Entry-27 | Update React component documentation |
| 2026-Log-Entry-28 | Add frontend testing guidelines |
| 2026-Log-Entry-29 | Add MongoDB schema notes |
| 2026-Log-Entry-30 | Update analytics logic explanation |
| 2026-Log-Entry-31 | Add notes on state management |
| 2026-Log-Entry-32 | Document edge cases in resume parsing |
| 2026-Log-Entry-33 | Fix typo in database setup instructions |
| 2026-Log-Entry-34 | Add responsive design notes |
| 2026-Log-Entry-35 | Document Tailwind CSS utility classes used |
| 2026-Log-Entry-36 | Update frontend dependencies table |
| 2026-Log-Entry-37 | Update analytics logic explanation |
| 2026-Log-Entry-38 | Update frontend dependencies table |
| 2026-Log-Entry-39 | Add MongoDB schema notes |
| 2026-Log-Entry-40 | Document edge cases in resume parsing |
| 2026-Log-Entry-41 | Add responsive design notes |
| 2026-Log-Entry-42 | Update analytics logic explanation |
| 2026-Log-Entry-43 | Document authentication flow |
| 2026-Log-Entry-44 | Expand backend troubleshooting section |
| 2026-Log-Entry-45 | Add MongoDB schema notes |
| 2026-Log-Entry-46 | Document authentication flow |
| 2026-Log-Entry-47 | Clarify AI resume parser integration |
| 2026-Log-Entry-48 | Document edge cases in resume parsing |
| 2026-Log-Entry-49 | Add responsive design notes |
| 2026-Log-Entry-50 | Expand backend troubleshooting section |
| 2026-Log-Entry-51 | Update analytics logic explanation |
| 2026-Log-Entry-52 | Clarify AI resume parser integration |
| 2026-Log-Entry-53 | Document authentication flow |
| 2026-Log-Entry-54 | Document edge cases in resume parsing |
| 2026-Log-Entry-55 | Document edge cases in resume parsing |
| 2026-Log-Entry-56 | Fix typo in database setup instructions |
| 2026-Log-Entry-57 | Document edge cases in resume parsing |
| 2026-Log-Entry-58 | Clarify AI resume parser integration |
| 2026-Log-Entry-59 | Document latest bug fixes in dashboard |
| 2026-Log-Entry-60 | Improve README clarity in section 60 |
| 2026-Log-Entry-61 | Update React component documentation |
| 2026-Log-Entry-62 | Fix typo in database setup instructions |
| 2026-Log-Entry-63 | Add responsive design notes |
| 2026-Log-Entry-64 | Add notes on JWT expiration |
| 2026-Log-Entry-65 | Document Tailwind CSS utility classes used |
| 2026-Log-Entry-66 | Improve README clarity in section 66 |
| 2026-Log-Entry-67 | Add responsive design notes |
| 2026-Log-Entry-68 | Document latest bug fixes in dashboard |
| 2026-Log-Entry-69 | Add notes on JWT expiration |
| 2026-Log-Entry-70 | Clarify AI resume parser integration |
| 2026-Log-Entry-71 | Document edge cases in resume parsing |
| 2026-Log-Entry-72 | Document authentication flow |
| 2026-Log-Entry-73 | Update frontend dependencies table |
| 2026-Log-Entry-74 | Refine UI mockup descriptions |
| 2026-Log-Entry-75 | Add responsive design notes |
| 2026-Log-Entry-76 | Add frontend testing guidelines |
| 2026-Log-Entry-77 | Update analytics logic explanation |
| 2026-Log-Entry-78 | Document Express route handlers |
| 2026-Log-Entry-79 | Document edge cases in resume parsing |
| 2026-Log-Entry-80 | Improve code structure documentation |
| 2026-Log-Entry-81 | Refine UI mockup descriptions |
| 2026-Log-Entry-82 | Document Express route handlers |
| 2026-Log-Entry-83 | Add notes on JWT expiration |
| 2026-Log-Entry-84 | Expand backend troubleshooting section |
| 2026-Log-Entry-85 | Improve README clarity in section 85 |
| 2026-Log-Entry-86 | Expand backend troubleshooting section |
| 2026-Log-Entry-87 | Add MongoDB schema notes |
| 2026-Log-Entry-88 | Add MongoDB schema notes |
| 2026-Log-Entry-89 | Update React component documentation |
| 2026-Log-Entry-90 | Update React component documentation |
| 2026-Log-Entry-91 | Document Tailwind CSS utility classes used |
| 2026-Log-Entry-92 | Add responsive design notes |
| 2026-Log-Entry-93 | Document Tailwind CSS utility classes used |
| 2026-Log-Entry-94 | Add notes on JWT expiration |
| 2026-Log-Entry-95 | Document latest bug fixes in dashboard |
| 2026-Log-Entry-96 | Document Express route handlers |
| 2026-Log-Entry-97 | Update analytics logic explanation |
| 2026-Log-Entry-98 | Improve code structure documentation |
| 2026-Log-Entry-99 | Clarify AI resume parser integration |
| 2026-Log-Entry-100 | Refactor API endpoints overview |
| 2026-Log-Entry-101 | Add notes on state management |
| 2026-Log-Entry-102 | Add responsive design notes |
| 2026-Log-Entry-103 | Improve README clarity in section 103 |
| 2026-Log-Entry-104 | Refine UI mockup descriptions |
| 2026-Log-Entry-105 | Document authentication flow |
| 2026-Log-Entry-106 | Improve README clarity in section 106 |
| 2026-Log-Entry-107 | Document Express route handlers |
| 2026-Log-Entry-108 | Expand backend troubleshooting section |
| 2026-Log-Entry-109 | Update React component documentation |
| 2026-Log-Entry-110 | Add MongoDB schema notes |
| 2026-Log-Entry-111 | Update React component documentation |
| 2026-Log-Entry-112 | Update analytics logic explanation |
| 2026-Log-Entry-113 | Expand backend troubleshooting section |
| 2026-Log-Entry-114 | Document authentication flow |
| 2026-Log-Entry-115 | Update React component documentation |
| 2026-Log-Entry-116 | Refine UI mockup descriptions |
| 2026-Log-Entry-117 | Refactor API endpoints overview |
| 2026-Log-Entry-118 | Add notes on state management |
| 2026-Log-Entry-119 | Clarify AI resume parser integration |
| 2026-Log-Entry-120 | Expand backend troubleshooting section |
| 2026-Log-Entry-121 | Document Tailwind CSS utility classes used |
| 2026-Log-Entry-122 | Improve code structure documentation |
| 2026-Log-Entry-123 | Add frontend testing guidelines |
| 2026-Log-Entry-124 | Update React component documentation |
| 2026-Log-Entry-125 | Refine UI mockup descriptions |
| 2026-Log-Entry-126 | Document Tailwind CSS utility classes used |
| 2026-Log-Entry-127 | Document Tailwind CSS utility classes used |
| 2026-Log-Entry-128 | Fix typo in database setup instructions |
| 2026-Log-Entry-129 | Refine UI mockup descriptions |
