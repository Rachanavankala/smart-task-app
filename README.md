# smart-task-app-final
# Smart Task Management App

A full-stack MERN application with role-based access, AI features, and data exporting.

## Live Demo

*   **Frontend:** [https://smart-task-app-sigma.vercel.app]
*   **Backend API:** [https://smart-task-app-0233.onrender.com]

## Features Implemented

- **User Authentication**: Secure JWT-based login/registration and Google OAuth 2.0 integration.
- **Task Management**: Full CRUD (Create, Read, Update, Delete) operations for tasks.
- **Admin Panel**: Admins can view a list of all users and deactivate accounts.
- **Data Visualization**: A dashboard chart displays tasks completed over the last 7 days.
- **Filtered Views**: Dashboard sections for "Tasks Due Today" and "Upcoming Tasks".
- **Data Exporting**: Users can download their task list as CSV, Excel, or PDF.
- **AI Integration**:
  - Automatically predicts a task's category based on the title.
  - Automatically generates a detailed task description from the title.
- **Audit Logging**: All task creation, updates, and deletions are logged in the database for traceability.

## Tech Stack

- **Frontend**: React, Redux Toolkit, React Router, Axios, Chart.js
- **Backend**: Node.js, Express.js, MongoDB
- **Database**: MongoDB Atlas (Cloud-hosted)
- **Authentication**: JWT, Passport.js (for Google OAuth)
- **AI**: OpenAI API (gpt-3.5-turbo)
- **Deployment**:
  - **Frontend:** Vercel (CI/CD from GitHub)
  - **Backend:** Render (CI/CD from GitHub)

## Setup and Run Locally

**Prerequisites:**
- Node.js
- npm
- MongoDB Atlas account
- OpenAI API Key
- Google OAuth Credentials

**Backend Setup:**
1.  Navigate to the `backend` directory: `cd backend`
2.  Install dependencies: `npm install`
3.  Create a `.env` file and add the required environment variables (`MONGO_URI`, `JWT_SECRET`, etc.).
4.  Start the server: `npm start` (or `node server.js`)

**Frontend Setup:**
1.  Navigate to the `frontend` directory: `cd frontend`
2.  Install dependencies: `npm install`
3.  Start the client: `npm run dev`

## Cloud Architecture

The application is deployed using a modern, decoupled architecture. The frontend is hosted on Vercel's global edge network for speed, and the backend is a managed web service on Render.

┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  ┌────────────────┐      (1) User Request           ┌─────────────┐│
│  │   👤 End User  ├──────> smart-task-app.com ──────>│  🌐 Vercel  ││
│  │ (Web Browser)  │      (or .vercel.app URL)       │  DNS        ││
│  └────────────────┘      ┌─────────────────────┐    └─────────────┘│
│         │                │                     │                   │
│         │                │ (2) Frontend Files  │                   │
│         │                │   Served from       │                   │
│         │                │   Vercel Edge       │                   │
│         │                │   Network           │                   │
│         │                └─────────────────────┘                   │
│         │                                                         │
│         │ (4) API Request to api.smart-task-app.com               │
│         │                                                         │
│         ▼                                                         │
│  ┌─────────────────────┐  (3) CORS Request   ┌───────────────────┐│
│  │ ⚡ Vercel Platform   │<───────────────────>│ 🚀 Render Platform││
│  │ (Global CDN for     │                     │ (Managed Backend  ││
│  │  React Frontend)    │                     │  Web Service)     ││
│  └─────────────────────┘                     │                   ││
│                                              │ ┌───────────────┐ ││
│                                              │ │ Node.js       │ ││
│                                              │ │ Container     │ ││
│                                              │ └───────────────┘ ││
│                                              │ ┌───────────────┐ ││
│                                              │ │ Auto-Scaling  │ ││
│                                              │ └───────────────┘ ││
│                                              └───────────────────┘│
│                                                      │             │
│                                            (5) Secure│ DB Query    │
│                                                      ▼             │
│                                              ┌───────────────────┐│
│                                              │ 🗃️ Database      ││
│                                              │      ││
│                                              │ (MongoDB)         ││
│                                              └───────────────────┘│
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘