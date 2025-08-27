# Yoof - Children's AI Education Centre

🚀 **Built with the 5 Day Sprint Framework by Omar Choudhry**

A modern web application designed to teach children aged 6-11 about AI through interactive play and creative activities. This project demonstrates the power of the 5 Day Sprint Framework for rapid, systematic development.

## 🎯 Project Overview

**Yoof** is a comprehensive AI education platform that makes complex AI concepts accessible and engaging for young learners through:

- **Interactive Learning Modules** - Age-appropriate AI lessons
- **Learning Through Play** - Gamified educational experiences
- **Art & Craft Integration** - Creative projects that reinforce AI concepts
- **Progress Tracking** - Comprehensive learning analytics
- **Parent Dashboard** - Monitoring and control features

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel
- **Icons**: Lucide React + Tabler Icons
- **Development**: 5 Day Sprint Framework

## 🚀 Quick Start

### Prerequisites

- Node.js 18.17.0 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd yoof
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with your API credentials:
   ```env
   # Supabase Configuration
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   
   # Project Context
   USER_FIRST_NAME=Oliver
   PROJECT_NAME=KidAI Play
   PROJECT_IDEA=A Children's AI Education Centre...
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
kidaai-play/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css         # Global styles with shadcn/ui
│   │   ├── layout.tsx          # Root layout component
│   │   ├── page.tsx            # Landing page
│   │   └── dashboard/          # Component showcase
│   │       └── page.tsx        # Dashboard page
│   ├── components/             # React components
│   │   └── ui/                 # shadcn/ui components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       └── badge.tsx
│   └── lib/                    # Utilities and configs
│       ├── utils.ts            # shadcn/ui utilities
│       └── supabase.ts         # Supabase client
├── .cursorrules                # Cursor workflow rules
├── components.json             # shadcn/ui configuration
├── tailwind.config.js          # Tailwind CSS config
├── tsconfig.json               # TypeScript config
└── package.json                # Dependencies
```

## 🎨 Design System

This project uses the **shadcn/ui ecosystem** for consistent, accessible, and beautiful components:

- **70+ Components** - Complete component library
- **Theme System** - CSS variables for easy customization
- **Responsive Design** - Mobile-first approach
- **Accessibility** - ARIA labels, keyboard navigation
- **TypeScript** - Full type safety

### Key Components Used

- **Button** - Interactive elements with variants
- **Card** - Content containers with headers
- **Badge** - Status indicators and labels
- **Layout Components** - Grid systems and containers

## 🔧 Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix linting issues
npm run format       # Format code with Prettier
npm run type-check   # TypeScript verification
```

## 🌐 Deployment

### Local Testing
1. Build the project: `npm run build`
2. Test production build: `npm run start`
3. Verify on localhost:3000

### Vercel Deployment
1. Push code to GitHub
2. Import project in Vercel dashboard
3. Configure environment variables
4. Deploy automatically

## 📚 5 Day Sprint Framework

This project was built using the **5 Day Sprint Framework**, a systematic approach to rapid web development:

### Framework Principles
- **Systematic Approach** - Structured development methodology
- **Security-First** - API keys stored in Supabase Edge Functions
- **shadcn/ui Ecosystem-First** - Official components before custom solutions
- **Environment Parity** - Identical localhost and production behavior
- **Component Showcase** - Comprehensive demonstration of capabilities

### Development Workflow
1. **Foundation Setup** - Project structure and configuration
2. **Component Installation** - shadcn/ui ecosystem setup
3. **Feature Development** - Systematic implementation
4. **Testing & Deployment** - Local verification before production
5. **Documentation** - Comprehensive project documentation

## 🎯 Learning Objectives

The KidAI Play platform is designed to teach children:

- **AI Fundamentals** - Basic artificial intelligence concepts
- **Creative Thinking** - Problem-solving through creativity
- **Digital Literacy** - Technology skills and understanding
- **Interactive Learning** - Engagement through play and activities

## 🔒 Security & Privacy

- **Child-Safe Environment** - Age-appropriate content and interactions
- **Secure Data Handling** - All sensitive data stored in Supabase
- **Privacy Compliance** - COPPA and GDPR considerations
- **API Security** - Keys stored securely in environment variables

## 📱 Responsive Design

- **Mobile-First** - Optimized for touch devices
- **Adaptive Layouts** - Responsive grid systems
- **Cross-Platform** - Works on all devices and browsers
- **Performance** - Fast loading times and smooth interactions

## 🤝 Contributing

This project follows the 5 Day Sprint Framework methodology:

1. **Systematic Development** - Follow structured approach
2. **Component-First** - Use shadcn/ui ecosystem
3. **Security Standards** - Maintain security best practices
4. **Documentation** - Keep comprehensive documentation

## 📄 License

Built with the 5 Day Sprint Framework by Omar Choudhry.

## 🆘 Support

For questions about the 5 Day Sprint Framework:
- **Documentation**: [5daysprint.com](https://5daysprint.com)
- **Community**: [Skool Community](https://www.skool.com/5-day-sprint/)
- **Creator**: Omar Choudhry

---

**Ready to build amazing applications? Start your own 5 Day Sprint today!** 🚀
