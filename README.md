# MERN Job Portal

A modern Job Portal built with the MERN stack. It supports candidate and employer workflows, job posting and applications, messaging, saved jobs, and an AI‑powered support chatbot.


## ✨ Features

- Candidate
  - Browse and filter jobs
  - View detailed job descriptions
  - Apply to jobs with resume upload
  - Save/unsave jobs for later
  - Profile management: bio, skills, resume
  - Messages with employers

- Employer/Admin
  - Company creation and setup
  - Post and manage jobs
  - View applicants per job
  - Messages with candidates

- AI Chatbot
  - Floating chat icon (bottom‑right) on every page
  - Maintains conversation context within the tab
  - Fresh chat on page reload
  - Uses OpenAI for smart Q&A; falls back to helpful FAQs if unavailable

- Other Features
  - Role‑based auth (candidate/employer)
  - JWT cookie login, logout, protected routes
  - Responsive UI on all screen sizes
  - Deployed on Render



## 🧭 Main Routes

- Home: `/`
- Jobs: `/jobs`
- Job Description: `/description/:id`
- Browse: `/browse`
- Saved: `/saved`
- Profile: `/profile`
- Messages: `/messages`
- Admin (protected): `/admin`
  - Companies
  - Company Create/Setup
  - Admin Jobs
  - Post Job
  - Applicants
  - Admin Messages



## 🔌 API Overview

- User: `/api/v1/user/*`
- Company: `/api/v1/company/*`
- Job: `/api/v1/job/*`
- Application: `/api/v1/application/*`
- Messaging: `/api/v1/messaging/*`
- AI Chat: `POST /api/chat`  
  - Body: `{ messages: [{ role, content }], userId?: string }`  
  - Returns: `{ success, message, role }`

> Note: Some routes require authentication; the UI handles protected access.



## 🤖 AI Chatbot

- Click the floating chat bubble (bottom‑right) to open the assistant.
- Ask questions like:
  - “How to apply?”
  - “How to post a job?”
  - “How to reset password?”
  - “How to update profile?”
- The assistant keeps context in the current tab and clears on page reload.



## 🖼️ Screenshot


<img width="1778" height="896" alt="image" src="https://github.com/user-attachments/assets/523b6f03-8458-4aeb-a27c-bdf697060fc5" />



## 🧱 Tech Stack

- Frontend: React 19, Vite, Tailwind CSS, ShadCN UI, Redux Toolkit, React Router
- Backend: Node.js, Express, Mongoose (MongoDB), JWT, Multer, Cloudinary
- AI: OpenAI API Key 


## 🔗 Useful Links

- Live App: [Visit now](https://jobportal-y1np.onrender.com/)
