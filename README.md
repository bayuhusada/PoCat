# PokeCat 🐱

A mobile-first PWA for finding, photographing, and collecting real cats. Built with React + Vite + Tailwind CSS v4.

## Features

- **Camera** — Take cat photos with zoom controls, or upload from gallery
- **AI Detection** — TensorFlow.js + COCO-SSD automatically detects cats in photos
- **Frames** — 8 filter frames (Classic, Pink, Pixel, Nature, Neon, Halloween, Christmas, Legendary)
- **Gallery** — 2-column grid with search and color filter pills
- **Detail View** — Full photo, name, frame badge, date, time, location (with Google Maps link), story, favorite, share
- **Edit & Delete** — Edit name/story/frame or delete cats from detail view
- **CatDex** — 20 cat species to collect, with progress tracking
- **Badges** — 10 achievements with XP rewards
- **XP & Levels** — 100 XP per level with progress bar
- **Daily Missions** — Rotating daily tasks with XP rewards
- **Leaderboard** — Personal stats view
- **Map** — Leaflet + OpenStreetMap with cat location markers
- **Auth** — Email/password login with Supabase, guest mode with localStorage
- **Profile** — Username, password change, stats, cloud sync
- **Share** — Custom 1080×1350 share card as PNG
- **PWA** — Installable, works offline

## Tech Stack

- **Framework**: React 19 + Vite 8
- **Routing**: react-router-dom v7
- **Styling**: Tailwind CSS v4
- **UI**: Framer Motion, react-icons (Heroicons)
- **AI**: TensorFlow.js + COCO-SSD
- **Backend**: Supabase (auth + database)
- **Maps**: Leaflet + react-leaflet + OpenStreetMap
- **Camera**: react-webcam
- **PWA**: vite-plugin-pwa

## Getting Started

```bash
npm install
npm run dev
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | Run oxlint |
| `npm run preview` | Preview production build |

## Deployment

Deployed on Vercel. Push to `main` branch triggers auto-deploy.
