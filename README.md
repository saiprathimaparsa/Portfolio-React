# Portfolio Website

A modern, interactive portfolio website showcasing projects and financial planning tools built with React and Vite.

## 🚀 Live Demo

[View Live Site](https://prathimaportfolio.vercel.app)

## ✨ Features

### Interactive Financial Calculators
- **Rent vs Buy Calculator** - Compare long-term costs of renting vs buying a home with break-even analysis
- **Commute Cost Calculator** - Calculate true commuting costs including time value and fuel/transit expenses
- **Lifestyle Inflation Calculator** - Visualize the opportunity cost of recurring expenses over time

### AI-Powered Quiz
- **QuizBot** - Interactive quiz application powered by OpenAI API with timed questions and detailed explanations

### Modern UI/UX
- Smooth scroll navigation with snap points
- Responsive design for all screen sizes
- Framer Motion animations
- Interactive data visualizations with Recharts

## 🛠️ Tech Stack

- **Frontend**: React 18.2, Vite 5.1
- **Styling**: Tailwind CSS 3.4
- **Animations**: Framer Motion 11.0
- **Charts**: Recharts 3.6
- **Routing**: React Router DOM 6.22
- **Forms**: EmailJS Browser 4.1
- **Backend**: Node.js, Express (for QuizBot API)
- **Deployment**: Vercel

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/saiprathimaparsa/Portfolio-React.git
cd Portfolio-React
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

4. Add your environment variables to `.env`:
```env
# Backend
PORT=8000
OPENAI_API_KEY=your_openai_api_key

# EmailJS (for contact form)
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

## 🚀 Development

Run both frontend and backend concurrently:
```bash
npm run dev:all
```

Or run them separately:
```bash
# Frontend only (port 3000)
npm run dev

# Backend only (port 8000)
npm run start
```

## 🏗️ Build

```bash
npm run build
```

## 📁 Project Structure

```
├── src/
│   ├── components/        # Reusable components (Header, Footer)
│   ├── projects/          # Calculator components
│   │   ├── RentVsBuyCalculator.jsx
│   │   ├── CommuteCostCalculator.jsx
│   │   └── LifestyleInflationCalculator.jsx
│   ├── Contact/           # Contact form component
│   ├── assets/            # Images and static files
│   ├── App.jsx            # Main app with routing
│   └── main.jsx           # Entry point
├── routes/                # Backend API routes
├── server.js              # Express server
└── vercel.json            # Vercel deployment config
```

## 🔑 Environment Variables

### Required for Development

| Variable | Description | Required For |
|----------|-------------|--------------|
| `OPENAI_API_KEY` | OpenAI API key | QuizBot functionality |
| `VITE_EMAILJS_SERVICE_ID` | EmailJS service ID | Contact form |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS template ID | Contact form |
| `VITE_EMAILJS_PUBLIC_KEY` | EmailJS public key | Contact form |

### Setting up EmailJS

1. Create an account at [EmailJS](https://www.emailjs.com/)
2. Create an email service (Gmail, Outlook, etc.)
3. Create an email template with variables: `{{from_name}}`, `{{reply_to}}`, `{{message}}`
4. Copy your Service ID, Template ID, and Public Key to `.env`

## 📝 Available Scripts

- `npm run dev` - Start Vite dev server (frontend only)
- `npm run dev:all` - Start both frontend and backend
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run start` - Start backend server

## 🌐 Deployment

This project is configured for automatic deployment on Vercel via GitHub integration.

### Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

**Important**: Make sure to add all environment variables in Vercel's project settings for full functionality.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Prathima Parsa**
- GitHub: [@saiprathimaparsa](https://github.com/saiprathimaparsa)
- LinkedIn: [saiprathimaparsa](https://www.linkedin.com/in/saiprathimaparsa)

## 🙏 Acknowledgments

- Design inspiration from modern portfolio websites
- Financial calculator formulas based on standard financial planning principles
- Icons and UI components from Heroicons and Tailwind CSS
