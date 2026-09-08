# CAPACITY CONNECT

### Digital Capacity Building and Learning Management Portal

CAPACITY CONNECT is a centralized web platform designed to support organizational training, competency development, skill-gap identification, and knowledge sharing.

The platform brings learning resources, employee development, assessments, and progress tracking into a single system.

---

## Features

* User authentication and role-based access
* Employee learning dashboard
* Course management and enrollment
* Learning progress tracking
* Competency and skill management
* Skill-gap analysis
* Personalized course recommendations
* Online assessments and scoring
* Digital certificates
* Knowledge sharing and resources
* Manager and administrator dashboards
* Learning and competency analytics
* AI-powered learning assistance

---

## User Roles

### Employee

* Browse and enroll in courses
* Access learning materials
* Track course progress
* Take assessments
* View competencies and skill gaps
* Receive course recommendations
* Access certificates and knowledge resources

### Trainer

* Create and manage courses
* Upload learning materials
* Create assessments
* Monitor learner progress

### Manager

* Monitor team development
* View competency gaps
* Track training completion
* Analyze team performance

### Administrator

* Manage users and roles
* Manage courses and training
* Assign training programs
* Monitor organization-wide analytics

---

## System Overview

```text
                    CAPACITY CONNECT
                           |
        +------------------+------------------+
        |                  |                  |
     Employee           Trainer            Admin
        |                  |                  |
        +------------------+------------------+
                           |
                    Application Layer
                           |
        +------------------+------------------+
        |                  |                  |
   Authentication       Database           AI Services
        |                  |                  |
        +------------------+------------------+
                           |
                      Web Application
```

---

## Technology Stack

| Layer           | Technology               |
| --------------- | ------------------------ |
| Frontend        | React, TypeScript        |
| Styling         | Tailwind CSS             |
| Backend         | Node.js                  |
| Database        | Firebase Firestore       |
| Authentication  | Firebase Authentication  |
| AI              | Google Gemini            |
| Deployment      | Google Cloud / Cloud Run |
| Version Control | Git                      |

---

## Project Structure

```text
capacity-connect/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   ├── services/
│   ├── hooks/
│   ├── utils/
│   ├── types/
│   └── App.tsx
├── server/
├── firebase/
├── package.json
├── tsconfig.json
└── README.md
```

---

## Getting Started

### Prerequisites

* Node.js
* npm
* Firebase project
* Gemini API key

### Installation

Clone the repository:

```bash
git clone https://github.com/YOUR-USERNAME/capacity-connect.git
cd capacity-connect
```

Install dependencies:

```bash
npm install
```

### Environment Configuration

Create a `.env` file and add the required Firebase configuration and Gemini API key.

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

GEMINI_API_KEY=your_gemini_api_key
```

Do not commit `.env` files or API keys to the repository.

### Run the Application

```bash
npm run dev
```

The application will be available at the local development address shown in the terminal.

---

## Core Workflow

```text
User Login
    ↓
Dashboard
    ↓
Competency Assessment
    ↓
Skill Gap Identification
    ↓
Course Recommendation
    ↓
Course Enrollment
    ↓
Learning
    ↓
Assessment
    ↓
Certificate
    ↓
Competency Update
```

---

## Objectives

* Centralize organizational learning and training.
* Improve competency development.
* Identify employee skill gaps.
* Provide relevant learning recommendations.
* Track learning and assessment progress.
* Support knowledge sharing.
* Provide useful analytics for managers and administrators.

---

## Future Scope

* Mobile application
* Advanced competency analytics
* Gamification
* HRMS integration
* Digital certificate verification
* Multi-language support
* AI-based workforce skill prediction

---

## License

This project is developed for educational and demonstration purposes.
