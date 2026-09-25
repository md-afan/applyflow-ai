# ApplyFlow AI

> A full-stack job and internship application tracking platform with AI-powered job analysis, reminders, interviews, analytics, and PDF reporting.

## Overview

**ApplyFlow AI** helps students and job seekers manage their complete job and internship application journey from one centralized workspace.

Users can track applications, monitor deadlines, analyze job descriptions against their saved skills, manage interviews and reminders, view application statistics, and generate PDF progress reports.

---

## Problem

Job and internship applications are often managed across different places such as:

- Notes
- Spreadsheets
- Emails
- Calendars
- Job platforms

This makes it difficult to track application status, deadlines, interviews, follow-ups, required skills, and overall progress.

## Solution

ApplyFlow AI brings these activities into one platform where users can manage their applications and monitor their complete application journey.

---

## Features

### Application Management

Create, view, update, and delete applications with:

- Company name
- Job role
- Job URL
- Job description
- Application status
- Deadline
- Application date
- Notes

Supported statuses:

`Applied` · `Shortlisted` · `Interview` · `Selected` · `Rejected`

### AI Job Analysis

Analyze a job description against the user's saved skills.

The AI provides:

- Matched skills
- Missing skills
- Short summary

The analysis uses an OpenRouter LLM and stores the result for the related application.

### Dashboard

View application progress through:

- Total applications
- Applied
- Shortlisted
- Interviews
- Selected
- Rejected
- Upcoming deadlines

### Interview Tracking

Manage interviews associated with applications.

Information includes:

- Interview date
- Interview type
- Interview notes

### Reminders

Create and manage application-related reminders such as:

- Follow-ups
- Application deadlines
- Interviews
- Other reminders

### Background Jobs

**Inngest** handles scheduled background processing for checking pending reminders.

### PDF Reports

Generate an application progress PDF containing:

- Application statistics
- Company
- Role
- Status
- Application date
- Deadline

PDF generation is handled using **Playwright**.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js | Frontend and routing |
| React | UI components |
| Tailwind CSS | Styling |
| Node.js | Backend runtime |
| Express.js | REST API |
| Supabase Auth | Authentication |
| Supabase PostgreSQL | Database |
| OpenRouter | AI integration |
| Inngest | Background jobs |
| Playwright | PDF generation |

---

## Architecture

```text
                    ApplyFlow AI
                         |
                  Next.js Frontend
                         |
                  Express REST API
                         |
        +----------------+----------------+
        |                |                |
   Supabase DB      OpenRouter        Inngest
        |                |                |
 Applications       AI Analysis     Background Jobs
 Skills
 Interviews
 Reminders
 Reports
                         |
                     Playwright
                         |
                      PDF Report

applyflow-ai/
│
├── frontend/
│   ├── app/
│   │   ├── login/
│   │   ├── signup/
│   │   ├── dashboard/
│   │   ├── applications/
│   │   └── reports/
│   │
│   ├── components/
│   ├── lib/
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   └── inngest/
│   │
│   ├── reports/
│   └── package.json
│
├── database/
│   └── schema.sql
│
├── README.md
└── .gitignore

Authentication & Security

ApplyFlow AI uses Supabase Auth for user authentication.

Protected backend APIs use bearer access tokens. The backend verifies the authenticated user before processing protected requests.

User-owned database queries are filtered using the authenticated user's ID.

Sensitive credentials such as:

SUPABASE_SERVICE_ROLE_KEY
OPENROUTER_API_KEY

are kept on the backend.

Environment files are excluded from Git using .gitignore.

API
Applications
GET    /api/applications
POST   /api/applications
GET    /api/applications/:id
PATCH  /api/applications/:id
DELETE /api/applications/:id
Dashboard
GET /api/dashboard
AI Analysis
POST /api/applications/:id/analyze
Skills
GET    /api/skills
POST   /api/skills
DELETE /api/skills/:id
Interviews
GET  /api/applications/:applicationId/interviews
POST /api/applications/:applicationId/interviews
Reminders
GET    /api/reminders
POST   /api/reminders
PATCH  /api/reminders/:id
DELETE /api/reminders/:id
Reports
POST /api/reports
GET  /api/reports/:id/file
Local Development
1. Clone Repository
git clone https://github.com/md-afan/applyflow-ai.git
cd applyflow-ai
2. Frontend
cd frontend
npm install
npm run dev

Frontend:

http://localhost:3000
3. Backend

Open another terminal:

cd backend
npm install
npm run dev

Backend:

http://localhost:4000
4. Inngest

Open another terminal:

cd backend
npx inngest-cli@latest dev

Inngest dashboard:

http://localhost:8288
Environment Variables
Frontend
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_API_URL=http://localhost:4000
Backend
PORT=4000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENROUTER_API_KEY=your_openrouter_api_key
INNGEST_DEV=1

Never commit environment files or API keys to GitHub.

Main User Flow
Sign Up
   ↓
Login
   ↓
Dashboard
   ↓
Add Application
   ↓
Application Details
   ↓
AI Job Analysis
   ↓
Track Status
   ↓
Schedule Interview
   ↓
Create Reminder
   ↓
Background Reminder Check
   ↓
Generate PDF Report
   ↓
Download Report
Engineering Concepts Demonstrated

ApplyFlow AI demonstrates:

REST API development
CRUD operations
Authentication
Authorization
PostgreSQL database design
Supabase integration
LLM integration
Structured AI responses
Background jobs
Scheduled processing
PDF generation
Protected routes
Error handling
Responsive frontend development
Capstone Concepts

The project combines multiple Backend AI Engineering concepts:

Concept	Implementation
API Endpoints	Express REST APIs
Database	Supabase PostgreSQL
Authentication	Supabase Auth
Background Jobs	Inngest
Reporting	Playwright PDF
LLM Integration	OpenRouter
Project Goal

ApplyFlow AI was built as a Backend AI Engineering 10x Solution to demonstrate how authentication, database design, REST APIs, AI integration, background processing, reporting, and frontend development can work together in a practical full-stack application.

Author

MD Afan

Backend Developer / B.Tech CSE

GitHub:
https://github.com/md-afan

LinkedIn:
https://www.linkedin.com/in/md-afan-43a0a5287/

Portfolio:
https://md-afan.netlify.app/
