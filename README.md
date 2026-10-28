# 🌟 Maths Adventure

> **"Learn Maths. Play Games. Become a Maths Hero!"**

A modern, cartoon-style educational mathematics adventure game for children aged 6–12. Built with **React 19**, **TypeScript**, **Tailwind CSS v4**, **Express**, and **Vite PWA** with full offline capabilities and background service worker synchronization.

---

## 🚀 Key Features

### 1. 🗺️ Six Cartoon Themed Realms
- 🏝️ **Addition Island**: Fruit Basket counting, number balloons, missing numbers, and carrying word problems.
- 🌲 **Subtraction Forest**: Feeding hungry monster Grumble (15 − 6), balloon popping, animal rescue, and borrowing puzzles.
- ⛰️ **Multiplication Mountain**: Scaling snowy peaks with 2–12 times tables, star arrays, rocket launches, and missing factors.
- 🏰 **Division Castle**: Equal sharing of coins and royal bakery feasts, castle door locks, and remainder challenges.
- 🌊 **Ratio River**: Visual stone matching (🔵🔵🔵 : 🔴🔴), fruit smoothie recipes, and simplifying equivalent ratios.
- 🏙️ **Percentage City**: Real-world toy store discounts (e.g. 20% off ₦1,000), 100-square visual power grids, pizza slice fractions, and battery charge levels.

### 2. 🎮 Six Interactive Game Modes
- **Adventure Mode**: 5 progressive stages per realm with star ratings and boss battles.
- **Quick Play**: Rapid random math questions across all mathematical operations.
- **Time Challenge (60s Blitz)**: High-energy countdown timer with combos and high scores.
- **Boss Battles**: Face friendly cartoon monsters (*Grumble the Giant, Count Subtracto, Mega Multiply-tron, etc.*) with heart energy bars.
- **Memory Game**: Card-flipping match pairing math problems to their answers.
- **Number Race**: Live cartoon race where correct answers propel the player's avatar forward against Turbo Tortoise.
- **Daily Quests & Mystery Chest**: 4 daily missions with surprise chest rewards.

### 3. 🎨 Hero Avatar Customizer & Companions
- **5 Cartoon Guides**: Milo (explorer), Luna (star), Bobo (monkey), Pip (robot), and Zara (fox) providing encouraging positive reinforcement.
- **Hero Wardrobe Shop**: Customize skin tone, hairstyles, shirt colors, and unlock hats (Golden Crown, Wizard Hat, Astronaut Helmet), glasses (Star Shades, Cyber Goggles), and accessories (Rocket Jetpack, Hero Cape, Magic Wand) using earned coins.

### 4. 💡 Visual Learning & Pedagogical Hints
- Interactive fruit counters, 10-frames, dot arrays, sharing plates, and 100-grid percentage visualizers.
- Multi-step pedagogical hints that guide problem-solving step-by-step rather than spoiling the answer.

### 5. 👨‍🏫 Parent & Educator Portal + Classroom Mode
- Gated behind an adult verification check (`7 × 8 = 56`).
- Deep analytics: Topic mastery bars, accuracy percentages, strengths, and target focus areas.
- **Classroom Manager**: Create classes, student rosters, assign target topics and difficulty, and print report cards.
- **Friendly Honors**: Leaderboard celebrating weekly stars, best streak, and most improved.

### 6. 📱 100% Offline PWA & Service Worker Sync
- Installable on Android, iOS, iPad, Windows, and macOS with standalone display mode.
- Custom service worker (`src/sw.ts`) using the **Background Sync API** to cache progress locally in offline mode and automatically synchronize player stats to the server when an internet connection is detected.
- Built-in procedural Web Audio API sound synthesizer with zero external audio dependencies.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion, Lucide Icons, Canvas Confetti
- **Backend**: Express with Vite dev middleware
- **PWA & Offline**: `vite-plugin-pwa`, Workbox, Service Worker Background Sync API
- **Audio**: Web Audio API (procedural chimes, fanfares, clicks, and friendly boops)
- **Tooling**: Vite 8, tsx, Node.js

---

## 📦 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/<YOUR_USERNAME>/maths-adventure.git
cd maths-adventure
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for production
```bash
npm run build
npm start
```

---

## ☁️ How the Service Worker Sync Works

1. **Local Buffering**: All player stats (coins, stars, level, answers, badges) are immediately saved to `localStorage` and dispatched to the custom Service Worker cache (`maths-adventure-sync-v1`).
2. **Background Sync**: When internet connection is restored or detected (`window.online` or Service Worker `sync` event), queued stats are posted to `/api/sync/stats`.
3. **Server Persistence**: The server stores progress in `data/player_sync.json` and acknowledges with a `serverTimestamp`.
4. **Live Indicator**: The UI displays real-time connection badges (🟢 Synced, 🔄 Syncing, 🟡 Offline - Saved locally).

---

## 📄 License
MIT License. Built for playful, positive mathematical education for kids worldwide.
