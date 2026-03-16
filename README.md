# GuessHowMuch Web

The frontend of [GuessHowMuch](https://github.com/YoTNT/GuessHowMuch) — an AI-powered US stock prediction platform.

## Features

- **Terminal aesthetic** — Inspired by Homebrew, monospace font, minimal design
- **Real-time quotes** — Live stock price and market data
- **Technical indicators** — RSI, MACD, Bollinger Bands, SMA, EMA, Volume Ratio with signal colors
- **AI predictions** — Next-day price direction predictions with reasoning
- **News sentiment** — Recent news analyzed by ensemble AI models
- **Skeleton loading** — Smooth loading states for all data cards
- **Error handling** — Friendly error messages with retry support
- **Quick picks** — One-click access to popular stocks
- **Watchlist UX** — Browse any stock, add to watchlist to generate predictions
- **Announcement banner** — System announcements with INFO/WARNING/NEW/DONATION types
- **Unified button component** — Consistent hover, loading, and disabled states
- **User authentication** — JWT login/register modal with remember me option
- **API key management** — Per-user encrypted API keys (BYOK), masked display

---

## Tech Stack

- **Framework** — React + TypeScript
- **Build tool** — Vite
- **Styling** — Tailwind CSS + CSS variables
- **API** — Connects to GuessHowMuch backend

---

## Prerequisites

- Node.js 18+
- [GuessHowMuch backend](https://github.com/YoTNT/GuessHowMuch) running locally

---

## Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/YoTNT/GuessHowMuch-web.git
cd GuessHowMuch-web
```

### 2. Install dependencies
```bash
npm install --legacy-peer-deps
```

### 3. Set up environment variables
```bash
cp .env.example .env.local
```

Open `.env.local` and set your backend URL:

| Variable | Description |
|---|---|
| `VITE_API_URL` | URL of the GuessHowMuch backend |

### 4. Start the dev server
```bash
npm run dev
```

Frontend runs at `http://localhost:5173`

---

## Environment Setup

This project uses environment files per environment:

| File | Environment | Committed to git |
|---|---|---|
| `.env` | Shared defaults | Yes |
| `.env.local` | Local development | No |
| `.env.qa` | QA | No |
| `.env.production` | Production | No |

---

## Project Structure
```
src/
├── api/
│   └── client.ts            # Centralized API calls
├── components/
│   ├── Banner.tsx            # System announcement banner
│   ├── Button.tsx            # Unified button component
│   ├── Header.tsx            # Top navigation
│   ├── SearchBar.tsx         # Stock symbol input
│   ├── QuoteCard.tsx         # Real-time quote display
│   ├── IndicatorsCard.tsx    # Technical indicators display
│   ├── PredictionCard.tsx    # AI prediction display
│   ├── NewsCard.tsx          # News sentiment display
│   ├── SentimentBadge.tsx    # Sentiment label
│   └── Skeleton.tsx          # Loading placeholders
├── hooks/
│   ├── useStock.ts           # Stock data fetching hook
│   └── useDots.ts            # Animated loading dots hook
├── pages/
│   ├── HomePage.tsx          # Search page
│   └── StockPage.tsx         # Stock detail page
├── types/
│   └── index.ts              # TypeScript type definitions
├── App.tsx
└── main.tsx
```

---

## Configuration

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:3000` | GuessHowMuch backend URL |

---

## Deploying to AWS

This project is deployed as a static site on AWS S3 + CloudFront. Infrastructure is managed via Terraform (see [GuessHowMuch-infra](https://github.com/YoTNT/GuessHowMuch-infra)).
```bash
npm run build
# Upload dist/ to S3 via CI/CD pipeline
```

---

## Related

- [GuessHowMuch Backend](https://github.com/YoTNT/GuessHowMuch) — The API powering this frontend
- [GuessHowMuch Infra](https://github.com/YoTNT/GuessHowMuch-infra) — Terraform infrastructure

---

## Roadmap

- [x] Terminal / Homebrew aesthetic
- [x] Real-time stock quote display
- [x] Technical indicators (RSI, MACD, Bollinger Bands)
- [x] AI prediction display with reasoning
- [x] News sentiment display
- [x] Skeleton loading states
- [x] Error handling with retry
- [x] Multi-environment configuration
- [x] Unified Button component with hover and loading states
- [x] Watchlist UX (browse any stock, add to watchlist to generate predictions)
- [x] System announcement banner
- [x] User login / registration pages (modal with remember me)
- [x] User settings page (API key management with masked display)
- [x] JWT token management (access + refresh tokens)
- [ ] AWS deployment (S3 + CloudFront)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Conversational UI (second phase)
- [ ] Portfolio tracking dashboard
- [ ] Mobile responsive design