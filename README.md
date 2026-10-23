# Ariyan Birthday Wish

A polished, animated birthday experience for Ariyan Shanto, built with React, Vite and TypeScript.

## Features

- Four white-and-pink intro slides with progress indicators.
- Animated Go to inside transition with candles and confetti.
- User-supplied portrait in a refined square frame.
- Wish page with typing text animation, colorful firecracker burst, vibration support and synthesized firecracker sound on user interaction.
- Local GIF assets and responsive mobile layout.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run typecheck
npm run build
```

The Vercel configuration publishes `dist/public` and rewrites SPA routes such as `/wish` to `index.html`.
