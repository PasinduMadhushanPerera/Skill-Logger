# Skill Logger

A comprehensive, mobile-first Progressive Web App for tracking your software engineering skills and accelerating your learning journey with gamification and professional tools.

## ✨ Features

### Core Features
- **Skill Tracking**: Track skills with levels (Beginner, Intermediate, Advanced)
- **Custom Categories**: Create and manage your own skill categories
- **Smart Search & Filter**: Find skills instantly with search and multi-level filtering
- **Visual Analytics**: Beautiful charts showing skill distribution and progress
- **Dark Mode**: Full dark mode support for comfortable viewing

### 🎯 Learning Tools
- **Activity Heatmap**: GitHub-style calendar showing your daily learning activity
- **Confidence Rating**: 5-star self-assessment system for each skill
- **Skill Gap Analyzer**: Paste job descriptions to identify missing skills
- **Learning Streak**: Track consecutive days of learning with fire emoji badges
- **Decay Warnings**: Get alerted when skills haven't been practiced in 30+ days

### 📚 Knowledge Management
- **Resources Manager**: Attach articles, videos, courses, books, and documentation to each skill
- **Learning Journal**: Document daily progress, insights, and challenges
- **Certificate Manager**: Track certifications with issue/expiry dates and credential links
- **Practice Timer**: Pomodoro-style focus timer (25/5/15 minutes) linked to skill practice time

### 🎮 Gamification
- **Daily Challenges**: Complete 3 daily tasks to earn XP points
- **Achievement Badges**: Unlock 6+ badges (Committed Learner, Expert, Polyglot, Full Stack, On Fire, Diamond)
- **Experience Points**: Earn XP through daily challenges and track your progress

### 🚀 Productivity
- **Skill Templates**: Quick-start with pre-made skill sets (MERN, Full Stack, Data Science, DevOps, Mobile)
- **PDF Resume Export**: Generate professional skill resume organized by category
- **Expandable Skill Cards**: Click "Show Details" to access resources, journal, certificates, and timer

### 📊 Stats & Insights
- **Comprehensive Dashboard**: Total skills, level breakdown, category distribution
- **Recent Activity Timeline**: View last 5 skills added with relative timestamps
- **Pie Charts**: Visual representation of skill levels
- **Category Summary**: Skills count per category

## 🔥 What's New in v0.1.0-beta

This update adds **10 major professional features**:
1. ✅ Skill Heatmap Calendar (365-day activity visualization)
2. ✅ Learning Resources Hub (attach links/courses to skills)
3. ✅ Skill Gap Analysis Tool (compare against job descriptions)
4. ✅ Skill Journal/Learning Log (daily notes with timestamps)
5. ✅ Certificate Manager (track credentials and expiry)
6. ✅ Daily Challenges System (earn XP with 3 daily tasks)
7. ✅ Confidence Level Rating (5-star self-assessment)
8. ✅ Skill Decay Warnings (alerts for stale skills)
9. ✅ Practice Timer (Pomodoro with focus/break modes)
10. ✅ Skill Templates Library (5 pre-made skill sets)

## 📱 Live Demo

🚀 **[Launch App](https://skill-logger-app.web.app)**

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite 7.2.2
- **Charts**: Recharts 3.4.1
- **Storage**: LocalStorage (client-side persistence)
- **PWA**: vite-plugin-pwa 1.1.0 (offline support, installable)
- **Deployment**: Firebase Hosting
- **Repository**: GitHub

## 🚀 Quick Start

Clone the repository:
```bash
git clone https://github.com/PasinduMadhushanPerera/Skill-Logger.git
cd Skill-Logger
```

Install dependencies:
```bash
npm install
```

Run development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Deploy to Firebase:
```bash
firebase deploy --only hosting
```

## 📖 Usage Guide

### Basic Workflow
1. **Add Skills**: Tap the "Add" tab to create new skills with name, level, category, and notes
2. **Track Progress**: Promote skills through levels as you improve
3. **Expand Details**: Click "Show Details" on any skill card to access:
   - Resources Manager (add learning materials)
   - Journal (log daily progress)
   - Certificates (track credentials)
   - Practice Timer (Pomodoro sessions)
4. **View Stats**: Check the "Stats" tab for heatmap, charts, and analytics
5. **Use Tools**: Access "Tools" tab for daily challenges and gap analysis
6. **Export Resume**: Generate PDF resume from Settings tab

### Advanced Features
- **Streak Building**: Add or update skills daily to build your learning streak
- **Custom Categories**: Add new categories via dropdown menu
- **Skill Templates**: Import pre-made skill sets from Settings tab
- **Gap Analysis**: Paste job descriptions in Tools tab to find missing skills
- **Dark Mode**: Toggle in Settings for comfortable night viewing

## 🎯 Achievements

Unlock badges by completing milestones:
- 🎯 **Committed Learner**: Track 10+ skills
- ⭐ **Expert Level**: Reach 5+ advanced skills
- 🌈 **Polyglot**: Master 5+ categories
- 🚀 **Full Stack**: 3+ Frontend + 3+ Backend skills
- 🔥 **On Fire**: Maintain 7+ day streak
- 💎 **Diamond**: Reach 30+ day streak

## 📂 Project Structure

```
skill-logger/
├── src/
│   ├── components/
│   │   ├── CertificateManager.jsx
│   │   ├── ConfidenceRating.jsx
│   │   ├── DailyChallenges.jsx
│   │   ├── DecayWarning.jsx
│   │   ├── PracticeTimer.jsx
│   │   ├── ResourcesManager.jsx
│   │   ├── SkillGapAnalyzer.jsx
│   │   ├── SkillHeatmap.jsx
│   │   ├── SkillJournal.jsx
│   │   └── SkillTemplates.jsx
│   ├── App.jsx          # Main component with state management
│   ├── index.css        # Global styles with dark mode
│   └── main.jsx         # App entry point
├── public/              # Static assets
├── firebase.json        # Firebase hosting config
├── vite.config.js       # Vite configuration
└── package.json         # Dependencies and scripts
```

## 🔐 Data Storage

All data is stored locally in your browser using LocalStorage:
- Skills, custom categories, and preferences
- Learning streak, daily challenges, XP points
- No server, no sign-in, completely private

## 🌐 Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Optimized

## 📝 License

MIT License - Free to use, modify, and distribute

## 👨‍💻 Developer

**W. Pasindu Madhushan Perera**  
📧 pasindumadushan1219@gmail.com  
🐙 [GitHub](https://github.com/PasinduMadhushanPerera/Skill-Logger)  
🌐 [Portfolio](https://pasindu-perera.web.app)

---

### Version History

**v0.1.0-beta** (Current)
- Initial beta release with 10 major features
- Heatmap, resources, journal, certificates, timer
- Daily challenges, gap analyzer, confidence ratings
- Skill templates, decay warnings
- Professional UI with dark mode

---

**Made with ❤️ for software engineers who love learning**
