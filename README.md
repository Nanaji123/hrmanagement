# HR Management System

A modern HR Management System built with Next.js, featuring role-based access control and comprehensive HR management features.

## Features

- 🔐 Role-based Authentication (HR Manager, HR Recruiter, Interviewer)
- 👥 User Management
- 📝 Interview Management
- 📊 Dashboard for different roles
- 🔒 Secure Authentication with NextAuth.js
- 🎨 Modern UI with Tailwind CSS

## Tech Stack

- **Framework:** Next.js 14
- **Authentication:** NextAuth.js
- **Database:** Prisma with PostgreSQL
- **Styling:** Tailwind CSS
- **State Management:** React Hooks
- **Form Handling:** React Hook Form
- **API:** RESTful API with Next.js API Routes

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database

## Getting Started

1. Clone the repository:
```bash
git clone [your-repository-url]
cd hr-management
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```env
DATABASE_URL="your-postgresql-connection-string"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
```

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
├── app/
│   ├── api/           # API routes
│   ├── auth/          # Authentication pages
│   ├── dashboard/     # Dashboard pages for different roles
│   └── components/    # Reusable components
├── lib/              # Utility functions and configurations
├── prisma/           # Database schema and migrations
└── public/           # Static assets
```

## Role-Based Access

The system supports three main roles:

1. **HR Manager**
   - Full system access
   - Manage recruiters and interviewers
   - View all reports and analytics

2. **HR Recruiter**
   - Manage job postings
   - Handle candidate applications
   - Schedule interviews

3. **Interviewer**
   - Conduct interviews
   - Submit interview feedback
   - View assigned candidates

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

