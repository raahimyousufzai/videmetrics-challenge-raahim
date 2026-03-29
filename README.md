# VidMetrics — YouTube Channel Analyzer

A YouTube Competitor Analysis Tool that lets you paste any YouTube channel URL and instantly view video performance data with sorting, filtering, and visualizations.

Built as an MVP with a clean, modern SaaS-style UI.

![Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38bdf8)

---

## Features

- **Channel URL input** — supports `youtube.com/@handle`, `/channel/`, `/c/`, `/user/`, and bare `@handle` formats
- **Video list table** — thumbnail, title, views, likes, comments, publish date with pagination (20 per page)
- **Sortable columns** — sort by views, likes, comments, or date (asc/desc)
- **Date range filters** — All Time, Last 7 Days, Last 30 Days, Last 90 Days
- **Performance charts** — bar/line chart toggle with views/likes/comments metric selector (Recharts)
- **Stats dashboard** — total views, avg views, total likes, engagement rate
- **Trending indicators** — videos with >1.5x average views get a "Trending" badge
- **CSV export** — download all video data as a CSV file
- **Fully mobile responsive**

## Tech Stack

- **Next.js 14** (App Router)
- **Tailwind CSS** + shadcn/ui-style components
- **YouTube Data API v3** (via Next.js API routes — no separate backend)
- **Recharts** for charts/visualizations
- **TanStack Query** for data fetching
- **Lucide React** for icons

## Architecture

```
src/
├── app/
│   ├── api/
│   │   ├── channel/route.ts    # Resolve channel URL → channel ID + metadata
│   │   └── videos/route.ts     # Fetch videos + stats from YouTube API
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                # Main UI
├── components/
│   ├── ui/                     # Button, Input, Badge, Card
│   ├── ChannelHeader.tsx       # Channel avatar, name, subscriber count
│   ├── ChannelInput.tsx        # URL input with validation
│   ├── ExportButton.tsx        # CSV download
│   ├── MetricsChart.tsx        # Bar/line charts
│   ├── Providers.tsx           # TanStack Query provider
│   ├── StatsCards.tsx          # Summary metric cards
│   └── VideoTable.tsx          # Sortable, paginated video table
└── lib/
    ├── csv.ts                  # Client-side CSV export
    ├── utils.ts                # cn(), formatNumber(), formatDate()
    └── youtube.ts              # YouTube API helpers + pagination
```

## Getting Started

### Prerequisites

- Node.js 18+
- A [YouTube Data API v3 key](https://console.cloud.google.com/apis/api/youtube.googleapis.com)

### Setup

```bash
# Install dependencies
npm install

# Add your YouTube API key
cp .env.example .env.local
# Edit .env.local and set YOUTUBE_API_KEY=your_key_here

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and paste a YouTube channel URL.

### Deploy to Vercel

1. Push this repo to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Add `YOUTUBE_API_KEY` as an environment variable
4. Deploy

## Key Constraints

- No database, no auth — all data fetched live from YouTube API
- YouTube API key stored in `.env.local` (never committed)
- Fetches up to 500 videos per channel (paginated API calls)
- Deploy-ready on Vercel

---

## The Prompt That Started It All

This project was kicked off with a single prompt to Claude Code:

> **Build a YouTube Competitor Analysis Tool MVP.**
>
> **What it does:**
> User pastes a YouTube channel URL → app fetches and displays that channel's recent video performance data with sorting, filtering, and visualizations.
>
> ### Tech stack:
> - Next.js 14 (App Router)
> - Tailwind CSS + shadcn/ui for polished SaaS-style UI
> - YouTube Data API v3 (via Next.js API routes — no separate backend)
> - Recharts for charts/visualizations
> - TanStack Query for data fetching
> - Client-side CSV export
>
> ### Core features:
> 1. Channel URL input with validation (handle various YouTube URL formats)
> 2. Video list table showing: thumbnail, title, views, likes, comments, publish date
> 3. Sort by any metric (views, likes, date, etc.)
> 4. Filter by date range (this month, last 30 days, last 90 days)
> 5. Bar/line charts comparing video performance
> 6. Trending indicators (e.g. above-average views badge)
> 7. Export results to CSV
> 8. Fully mobile responsive
>
> ### Architecture:
> - app/page.tsx — main UI
> - app/api/channel/route.ts — resolve channel URL to channel ID
> - app/api/videos/route.ts — fetch videos + metrics from YouTube API
> - lib/youtube.ts — YouTube API helper functions
> - Component files for: ChannelInput, VideoTable, MetricsChart, ExportButton
>
> ### Key constraints:
> - No database, no auth — all data fetched live
> - YouTube API key stored in .env.local
> - Clean, modern SaaS look — not a developer prototype
> - Deploy-ready on Vercel

---

Built with [Claude Code](https://claude.ai/claude-code)
