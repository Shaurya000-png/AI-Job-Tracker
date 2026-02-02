# Troubleshooting Network Error

## Problem
The frontend is showing a network error when trying to connect to the backend API.

## Root Cause
The backend server requires MongoDB to be running, but MongoDB is likely not installed or not running on your system.

## Solutions

### Option 1: Use MongoDB Atlas (Recommended - Free Cloud Database)

This is the easiest solution and doesn't require installing anything locally.

1. **Create a free MongoDB Atlas account:**
   - Go to https://www.mongodb.com/cloud/atlas/register
   - Sign up for a free account

2. **Create a cluster:**
   - Choose the FREE tier (M0)
   - Select a cloud provider and region close to you
   - Click "Create Cluster"

3. **Set up database access:**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Create a username and password (save these!)
   - Give the user "Read and write to any database" permissions

4. **Set up network access:**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. **Get your connection string:**
   - Go to "Database" in the left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster.xxxxx.mongodb.net/`)

6. **Update your backend `.env` file:**
   ```env
   MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/job-tracker?retryWrites=true&w=majority
   ```
   Replace `YOUR_USERNAME`, `YOUR_PASSWORD`, and `YOUR_CLUSTER` with your actual values.

7. **Restart the backend server:**
   - Stop the current backend server (Ctrl+C in the terminal)
   - Run `npm run dev` again

---

### Option 2: Install MongoDB Locally

If you prefer to run MongoDB on your local machine:

1. **Download MongoDB Community Server:**
   - Go to https://www.mongodb.com/try/download/community
   - Download the Windows installer
   - Run the installer and follow the setup wizard
   - Choose "Complete" installation
   - Install MongoDB as a Windows Service

2. **Verify MongoDB is running:**
   ```powershell
   Get-Service -Name MongoDB
   ```
   Status should be "Running"

3. **If MongoDB service is not running, start it:**
   ```powershell
   Start-Service -Name MongoDB
   ```

4. **The backend should now connect successfully**
   - The default connection string `mongodb://localhost:27017/job-tracker` should work

---

### Option 3: Use Docker (If you have Docker installed)

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

---

## Quick Test

After setting up MongoDB, test the backend:

1. **Open a browser and go to:**
   ```
   http://localhost:5000/api/auth/me
   ```

2. **You should see:**
   - Either a JSON response (if authenticated)
   - Or an error message about authentication (this is good - it means the server is working!)

3. **If you see "Cannot connect" or network error:**
   - MongoDB is still not connected
   - Check the backend terminal for error messages

---

## Current Status

- ✅ Frontend is running on http://localhost:5173
- ✅ Backend is starting on http://localhost:5000
- ❌ MongoDB connection needed

Choose one of the options above to fix the MongoDB connection, and the network error will be resolved!
