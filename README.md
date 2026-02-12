# HEIN Assistant - Support Portal

Professional support portal for Hein oven and cooling technologies. Chat interface connected to an n8n AI workflow backend.

## Setup

**Prerequisites:** Node.js 18+

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run locally:
   ```bash
   npm run dev
   ```

3. Open http://localhost:3000

## Deployment

Build for production:
```bash
npm run build
```

The `dist/` folder can be deployed to any static hosting (Vercel, Netlify, GitHub Pages, etc.).

## Architecture

- **Frontend:** React + TypeScript + Tailwind CSS (via CDN)
- **Backend:** n8n webhook workflow (AI chatbot)
- **Storage:** IndexedDB for manual PDF uploads (client-side)

The chat sends messages to the n8n webhook at:
```
POST https://donlem0n.app.n8n.cloud/webhook/2ff70050-69cc-4a7a-90da-8355aaacb7ba
{ "message": "...", "sessionId": "...", "language": "EN" }
```

And expects a response with:
```json
{ "output": "Assistant response text..." }
```

## Project Structure

```
├── index.html          # Entry HTML
├── index.tsx           # React entry point
├── App.tsx             # Main app component
├── types.ts            # TypeScript types
├── translations.ts     # i18n strings (EN/FR/DE/NL)
├── services/
│   ├── n8n.ts          # n8n webhook chat service
│   ├── connectivity.ts # Connection status checker
│   └── storage.ts      # IndexedDB for manuals
├── components/
│   ├── TopBar.tsx
│   ├── Sidebar.tsx
│   ├── ChatPanel.tsx
│   ├── MessageBubble.tsx
│   ├── HistoryView.tsx
│   ├── ManualsView.tsx
│   ├── ComingSoonView.tsx
│   └── AdminModal.tsx
├── package.json
├── tsconfig.json
└── vite.config.ts
```

Developed by Louis Kohnen and [flowly.lu](https://flowly.lu/)
