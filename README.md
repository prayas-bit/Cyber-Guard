#Cyber Guard
# 🛡️ Gamified Cyber Security Learning Platform

An interactive, gamified platform for learning cybersecurity fundamentals through hands-on challenges and missions. Master essential security concepts while competing on a global leaderboard.

![Cyber Security](https://img.shields.io/badge/security-cybersecurity-red)
![React](https://img.shields.io/badge/react-18.3.1-blue)
![Vite](https://img.shields.io/badge/vite-6.3.5-purple)
![Supabase](https://img.shields.io/badge/supabase-enabled-green)

## 🎯 Features

### 🎮 Interactive Learning Modules
- **Password Security Lab** - Learn password strength analysis and best practices
- **Phishing Detection Game** - Train to identify phishing attempts and social engineering
- **SQL Injection Module** - Understand and defend against injection attacks
- **Terminal Security Quiz** - Master command-line security concepts

### 🏆 Gamification Elements
- **Real-time Leaderboard** - Compete globally with other security learners
- **Progress Tracking** - Monitor your advancement through modules
- **Score System** - Earn points for completing challenges
- **Achievement System** - Unlock badges and milestones

### 🔐 User Authentication
- Secure sign-up and login with Supabase Auth
- Persistent user progress and scores
- Protected routes and user sessions

## 🚀 Tech Stack

- **Frontend Framework**: React 18.3.1
- **Build Tool**: Vite 6.3.5
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Backend**: Supabase (Auth + Edge Functions)
- **Database**: Supabase PostgreSQL
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Charts**: Recharts

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/prayas-bit/hack-proj.git
cd hack-proj
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Supabase**
   - Create a project at [supabase.com](https://supabase.com)
   - Copy your project credentials
   - Update `/src/utils/supabase/info.tsx` with your:
     - `projectId`
     - `publicAnonKey`

4. **Run development server**
```bash
npm run dev
```

5. **Build for production**
```bash
npm run build
```

## 🌐 Deployment

### Deploy to Vercel

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Click Deploy

3. **Configure Environment Variables** (if needed)
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Deploy Supabase Edge Functions

1. **Install Supabase CLI**
```bash
npm install -g supabase
```

2. **Login and Link Project**
```bash
supabase login
supabase link --project-ref YOUR_PROJECT_ID
```

3. **Deploy Edge Function**
```bash
supabase functions deploy make-server-05209d75
```

## 🎓 Learning Modules

### 1️⃣ Password Security Lab
Learn about:
- Password strength metrics
- Common password attacks
- Best practices for secure passwords
- Password managers and 2FA

### 2️⃣ Phishing Detection Game
Practice identifying:
- Suspicious email addresses
- Phishing URLs and domains
- Social engineering tactics
- Safe browsing habits

### 3️⃣ SQL Injection Module
Understand:
- How SQL injection works
- Input validation techniques
- Prepared statements
- Defense strategies

### 4️⃣ Terminal Security Quiz
Master:
- Command-line security tools
- File permissions and access control
- Network security basics
- Security monitoring commands

## 📊 Architecture

```
┌─────────────────┐
│   React App     │
│   (Frontend)    │
└────────┬────────┘
         │
         ├──────────────┐
         │              │
         ▼              ▼
┌────────────────┐ ┌────────────────┐
│  Supabase Auth │ │ Edge Functions │
│   (Backend)    │ │   (API/Logic)  │
└────────────────┘ └────────────────┘
         │              │
         └──────┬───────┘
                ▼
        ┌───────────────┐
        │   PostgreSQL  │
        │   (Database)  │
        └───────────────┘
```

## 🔧 Configuration Files

- `vite.config.ts` - Vite build configuration
- `package.json` - Dependencies and scripts
- `tailwind.config.js` - Tailwind CSS setup (if present)
- `/src/utils/supabase/info.tsx` - Supabase credentials

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 🐛 Troubleshooting

### Common Issues

**Build fails with "Output Directory not found"**
- Solution: Set Output Directory to `build` in Vercel settings

**Leaderboard not loading**
- Check if Edge Function is deployed
- Verify Supabase credentials
- Check browser console for errors

**Authentication errors**
- Verify Supabase project is active
- Check that credentials in `info.tsx` are correct
- Ensure Supabase Auth is enabled in dashboard

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👥 Authors

- **Prayas** - [prayas-bit](https://github.com/prayas-bit)

## 🙏 Acknowledgments

- UI Components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Backend powered by [Supabase](https://supabase.com/)
- Deployed on [Vercel](https://vercel.com/)

## 📞 Support

For support, please open an issue in the GitHub repository or contact the maintainers.

---

**Made with 💚 by cybersecurity enthusiasts**

*Learn. Compete. Secure.*
