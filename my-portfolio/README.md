# Portfolio Frontend

A modern, responsive portfolio website built with Vue 3 and Vite, featuring AI-powered chatbot integration and interactive components.

## Features

- Modern, responsive design with Neoclassical styling
- AI-powered chatbot integration using Google Gemini
- Budget calculator with PDF proposal generation
- Currency converter
- Project showcase with dynamic filtering
- Contact form with email notifications
- Admin dashboard for content management
- Real-time consultation booking integration

## Tech Stack

- **Framework**: Vue 3 with Options API
- **Build Tool**: Vite
- **UI Library**: Custom components with Tailwind CSS
- **State Management**: Composition API
- **API Integration**: Axios
- **Authentication**: Supabase Auth
- **PDF Generation**: PDFKit
- **Calendar Integration**: Calendly

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Joshuawayne/bookme.git
```

2. Navigate to the frontend directory:
```bash
cd my-portfolio
```

3. Install dependencies:
```bash
npm install
```

4. Copy `.env.example` to `.env` and configure your environment variables:
```bash
cp .env.example .env
```

5. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

## Project Structure

```
my-portfolio/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── global/     # Global UI components
│   │   ├── sections/   # Main page sections
│   │   └── ui/         # Reusable UI components
│   ├── composables/    # Vue 3 composables
│   ├── layouts/        # Page layouts
│   ├── router/         # Vue Router configuration
│   ├── services/       # API services
│   └── views/          # Main views/pages
├── vite.config.js
└── package.json
```

## Development

The project uses Vue 3's Options API with Vite for fast development experience. All components are organized by feature and follow a consistent naming convention.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the LICENSE file for details.
