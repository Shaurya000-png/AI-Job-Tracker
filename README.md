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
