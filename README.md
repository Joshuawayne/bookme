# Professional Portfolio with AI Assistant

A modern portfolio website with integrated AI chatbot, project showcase, and interactive features, built with Vue 3, Express.js, and Supabase.

## Overview

This project consists of two main components:

1. **Frontend** (`my-portfolio/`)
   - Vue 3 application with Vite
   - Modern, responsive design
   - AI-powered chatbot integration
   - Interactive components and features

2. **Backend** (`portfolio-backend/`)
   - Express.js server
   - Google Gemini AI integration
   - Email notifications
   - PDF generation
   - Supabase database

## Features

- AI-powered chatbot with Google Gemini
- Real-time consultation booking
- Project showcase with filtering
- Budget calculator with PDF proposals
- Currency converter
- Contact form with email notifications
- Admin dashboard
- Responsive design

## Tech Stack

### Frontend
- Vue 3 (Options API)
- Vite
- Axios
- Tailwind CSS
- PDFKit
- Calendly API

### Backend
- Node.js/Express.js
- Google Gemini API
- Nodemailer
- Supabase
- PDFKit
- CORS

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account
- Gmail account for email notifications
- Google Cloud account for Gemini API

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Joshuawayne/bookme.git
```

2. Install backend dependencies:
```bash
cd portfolio-backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../my-portfolio
npm install
```

4. Configure environment variables:
   - Copy `.env.example` to `.env` in both frontend and backend directories
   - Update the environment variables with your credentials

### Environment Variables

#### Backend (.env)
```env
PORT=3000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
EMAIL_USER=your_gmail_username
EMAIL_PASS=your_gmail_app_password
YOUR_PERSONAL_EMAIL=your_email@example.com
GEMINI_API_KEY=your_gemini_api_key
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

### Running the Project

1. Start the backend server:
```bash
cd portfolio-backend
npm run dev
```

2. In a new terminal, start the frontend:
```bash
cd my-portfolio
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
portfolio/
├── my-portfolio/              # Frontend Vue.js application
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── composables/
│   │   ├── layouts/
│   │   ├── router/
│   │   ├── services/
│   │   └── views/
│   └── package.json
├── portfolio-backend/         # Backend Express.js server
│   ├── src/
│   │   ├── api/
│   │   ├── services/
│   │   └── server.js
│   └── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Acknowledgments

- Google Gemini API for AI integration
- Supabase for backend services
- Calendly for consultation booking
- Vite for fast development experience
