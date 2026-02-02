# Job Tracker Backend - API Reference

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer {your_access_token}
```

---

## Reminders API

### Create Reminder
```http
POST /reminders
```
**Body:**
```json
{
  "title": "Follow up with recruiter",
  "description": "Send thank you email",
  "reminderDate": "2026-02-05T10:00:00Z",
  "priority": "High",
  "job": "job_id_here"
}
```

### Get All Reminders
```http
GET /reminders?status=upcoming&priority=High
```
**Query Parameters:**
- `status`: `completed`, `pending`, `overdue`, `upcoming`
- `priority`: `Low`, `Medium`, `High`
- `startDate`, `endDate`: ISO date strings
- `jobId`: Filter by job ID

### Get Reminder Statistics
```http
GET /reminders/stats
```

### Get Single Reminder
```http
GET /reminders/:id
```

### Update Reminder
```http
PUT /reminders/:id
```

### Delete Reminder
```http
DELETE /reminders/:id
```

### Toggle Completion
```http
PATCH /reminders/:id/complete
```

---

## File Upload API

### Upload Resume
```http
POST /upload/resume
Content-Type: multipart/form-data

resume: [file]
```

### List Resumes
```http
GET /upload/resumes
```

### Download Resume
```http
GET /upload/resume/:filename
```

### Delete Resume
```http
DELETE /upload/resume/:filename
```

---

## User Profile & Preferences API

### Get Profile
```http
GET /auth/me
```

### Update Profile
```http
PUT /auth/profile
```
**Body:**
```json
{
  "name": "John Doe",
  "phone": "+1234567890",
  "location": "New York, NY",
  "linkedIn": "https://linkedin.com/in/johndoe",
  "portfolio": "https://johndoe.com"
}
```

### Update Preferences
```http
PUT /auth/preferences
```
**Body:**
```json
{
  "emailNotifications": true,
  "reminderNotifications": true,
  "theme": "dark",
  "timezone": "Asia/Kolkata"
}
```

---

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [...]
}
```
