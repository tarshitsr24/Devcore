# DevCore — Connect Skills, Opportunities, and Careers.

DevCore is a complete, modern, responsive full-stack platform that connects applicants with organizations. Applicants can discover and apply for internships, track their technical/soft skills, build a verified career journey timeline, and receive AI-driven compatibility scores and certification recommendations. Organizations can post internships, evaluate applicant match scores, and manage application statuses. Supabase stores the backend application data.

---

## 🚀 Key Features Overview

1. **Common Branding**: Consistent "DevCore" branding, tagline *"Connect Skills, Opportunities, and Careers."*, glassmorphism card UI, responsive design.
2. **Unified Authentication & 3-Step Onboarding**:
   - Single `/login` and `/signup` pages for all roles.
   - 3-Step signup flow: Basic Details -> Purpose Selection (Applicant vs Organization) -> Optional Skills Addition.
   - JWT authentication & bcrypt password hashing.
3. **Applicant Suite**:
   - **Dashboard**: Profile completion gauge, skills summary, recommended & recent internships, recent applications, status tracking badges.
   - **Editable Profile**: Bio, photo, education, links (LinkedIn, GitHub, Portfolio, Resume), career preferences.
   - **My Skills**: Technical vs Soft skill categorization with Beginner, Intermediate, and Advanced level indicators.
   - **Internship Marketplace**: Search by title, org, skill, location + filter by domain, work mode, stipend.
   - **AI Match Engine**: Compatibility scores calculated by Python NLP service (TF-IDF vectorizer + Cosine similarity).
   - **My Journey**: Academic & professional history timeline with evidence file previews.
   - **Get Certified**: AI skill-gap based course recommendations with direct valid links.
4. **Organization Suite**:
   - **Organization Profile**: Logo, email, website, LinkedIn, industry, location, verification status badge.
   - **Organization Dashboard**: Active posts, total applications received, shortlisted candidates.
   - **Post Internship**: Draft saving, publication toggle, requirements, stipend, openings, deadline.
   - **Manage Applications**: Filter applications for own postings, view match score, shortlist, select, or reject candidates.
5. **Admin Suite**:
   - Organization verification approvals, platform statistics counter, user management.

---

## 🏗️ Project Architecture

```
devcore/
├── ai-service/          # Python FastAPI REST Service
│   ├── app.py           # REST Endpoints (/api/match, /api/recommendations, /api/certifications)
│   ├── matcher.py       # NLP TF-IDF Vectorizer & Skill Set Cosine Similarity Engine
│   └── requirements.txt # Python dependencies
├── backend/             # Node.js + Express + Supabase + JWT Backend
│   ├── src/
│   │   ├── models/      # User, ApplicantProfile, OrganizationProfile, Skill, Internship, Application, JourneyRecord
│   │   ├── routes/      # Auth, Profile, Skills, Internships, Applications, Journey, Recommendations, Admin
│   │   ├── middleware/  # JWT Auth, Role Guards, Multer Uploads
│   │   ├── utils/       # AI Client and Supabase database seed script
│   │   └── index.js     # Express server
│   ├── supabase-schema.sql # Supabase table definition
│   └── package.json
├── frontend/            # React + Vite + Tailwind CSS + Lucide Icons + Recharts
│   ├── src/
│   │   ├── components/  # Navbar, Footer, StatusBadge, SkillBadge, ProtectedRoutes, Modal
│   │   ├── context/     # AuthContext for session & role management
│   │   ├── pages/       # Login, Signup, Dashboards, Profiles, Marketplace, AI Match, My Journey, Get Certified
│   │   └── services/    # Axios API client
│   └── package.json
├── package.json         # Root scripts
└── README.md
```

---

## ⚡ How to Run Locally

### 1. Start Python AI Service (Port 5000)
```bash
cd ai-service
pip install -r requirements.txt
python app.py
```

### 2. Configure Supabase
Create a Supabase project, run `backend/supabase-schema.sql` in its SQL Editor, and put these values in `backend/.env`:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Start Express Backend (Port 5001)
```bash
cd backend
npm install
npm start
```
The backend automatically seeds demo accounts on the first startup when the Supabase table is empty.

### 4. Start React Frontend (Port 3000)
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Preset Demo Credentials for Testing

- **Applicant Account**: `applicant@devcore.com` / `password123`
- **Organization Account**: `techcorp@devcore.com` / `password123`
- **Admin Account**: `admin@devcore.com` / `password123`
