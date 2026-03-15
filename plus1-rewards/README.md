# +1 Rewards PWA

Offline-first Progressive Web App for earning and spending rewards at partner shops, integrated with Day1 Health insurance.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Environment Setup

Copy `.env.example` to `.env.local` and add your Supabase credentials:

```bash
cp .env.example .env.local
```

### Development

```bash
npm run dev
```

Visit `http://localhost:5174/`

### Build

```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/       # React components
├── lib/             # Supabase client
├── services/        # IndexedDB, sync logic
├── store/           # Zustand state management
├── App.tsx          # Main app component
└── index.css        # Tailwind styles

public/
├── manifest.json    # PWA manifest
└── sw.js           # Service Worker
```

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Emotion
- **State**: Zustand + TanStack Query
- **Database**: Supabase PostgreSQL
- **Offline**: IndexedDB + Service Workers
- **PWA**: Installable, offline-first

## 📱 Features

- ✅ Offline-first architecture
- ✅ QR code member identification
- ✅ Multi-tier policy ladder
- ✅ Real-time sync
- ✅ PWA installable
- ✅ Mobile-first responsive design

## 🔧 Available Scripts

- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 📚 Documentation

See `/documentation` folder for complete system specs, database schema, and business rules.

## 📄 License

Proprietary - +1 Rewards (Pty) Ltd
