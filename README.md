# Face Detection and Expression Tracker

A modern web app that detects faces from your webcam and tracks facial expressions in real time.

It highlights the dominant emotion, logs expression confidence scores automatically, and visualizes emotional trends through an interactive dashboard.

## Features

- Real-time face detection in the browser
- Live dominant emotion + confidence display
- Micro-expression breakdown (top probabilities)
- Automatic emotion logging at regular intervals
- Dashboard with:
  - Emotion timeline (stacked area chart)
  - Dominant emotion distribution (bar chart)
  - Recent log history
- Local-first storage using browser `localStorage`
- Privacy-first flow (camera data processed in-browser)

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite
- **Face/Expression Model:** `@vladmandic/face-api`
- **Charts:** Recharts
- **UI:** Tailwind CSS + Lucide Icons

## Project Structure

```text
src/
  components/
    LiveTracker.tsx   # Webcam capture, face detection, expression inference, auto-logging
    Dashboard.tsx     # Trend charts, distribution chart, and log list
    About.tsx         # Project/technology overview inside the app
  store.ts            # localStorage helpers (read, add, clear logs)
  types.ts            # Emotion and EmotionLog types
  App.tsx             # Main tab-based layout (Tracker / Dashboard / About)
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- A browser with webcam support

### Installation

```bash
npm install
```

### Run in Development

```bash
npm run dev
```

Open the app at `http://localhost:3000`.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Type Check

```bash
npm run lint
```

## How It Works

1. The app loads lightweight face detection and expression models in the browser.
2. After camera permission is granted, frames are analyzed continuously.
3. The strongest expression is treated as the dominant emotion.
4. Every few seconds, a log entry is saved with:
   - timestamp
   - dominant emotion
   - confidence score
   - full expression probability map
5. The dashboard reads logs from local storage and renders trend visualizations.

## Privacy

- Camera processing runs locally in your browser.
- Emotion logs are stored only in your browser’s `localStorage`.
- No backend is required for the core tracking flow.

## Supported Emotions

- neutral
- happy
- sad
- angry
- fearful
- disgusted
- surprised

## Troubleshooting

- **Camera not working:** Verify browser permission and ensure no other app is locking the webcam.
- **Blank/slow detection:** Check internet access for model download CDN and use a modern browser.
- **No dashboard data:** Keep camera on for a few seconds so logs can be captured.

## License

This project is open source. Add a `LICENSE` file if you want to specify formal licensing terms.
