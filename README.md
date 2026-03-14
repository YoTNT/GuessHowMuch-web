# GuessHowMuch Web

The frontend of [GuessHowMuch](https://github.com/YoTNT/GuessHowMuch) — an AI-powered US stock prediction platform.

## Features

- **Terminal aesthetic** — Inspired by Homebrew, monospace font, minimal design
- **Real-time quotes** — Live stock price and market data
- **AI predictions** — Next-day price direction predictions with reasoning
- **News sentiment** — Recent news analyzed by ensemble AI models
- **Quick picks** — One-click access to popular stocks

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
│   └── client.ts          # Centralized API calls
├── components/
│   ├── Header.tsx          # Top navigation
│   ├── SearchBar.tsx       # Stock symbol input
│   ├── QuoteCard.tsx       # Real-time quote display
│   ├── PredictionCard.tsx  # AI prediction display
│   ├── NewsCard.tsx        # News sentiment display
│   └── SentimentBadge.tsx  # Sentiment label
├── hooks/
│   └── useStock.ts         # Stock data fetching hook
├── pages/
│   ├── HomePage.tsx        # Search page
│   └── StockPage.tsx       # Stock detail page
├── types/
│   └── index.ts            # TypeScript type definitions
├── App.tsx
└── main.tsx
```

---

## Configuration

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:3000` | GuessHowMuch backend URL |

---

## Related

- [GuessHowMuch Backend](https://github.com/YoTNT/GuessHowMuch) — The API powering this frontend