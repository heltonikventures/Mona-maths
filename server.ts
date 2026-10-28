import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '5mb' }));

// Local persistent storage file for synced player stats
const DATA_DIR = path.join(__dirname, 'data');
const SYNC_FILE = path.join(DATA_DIR, 'player_sync.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory cache of synced players backed by file
let syncedPlayersMap: Record<string, any> = {};

try {
  if (fs.existsSync(SYNC_FILE)) {
    const raw = fs.readFileSync(SYNC_FILE, 'utf-8');
    syncedPlayersMap = JSON.parse(raw);
  }
} catch {
  syncedPlayersMap = {};
}

function persistSyncData() {
  try {
    fs.writeFileSync(SYNC_FILE, JSON.stringify(syncedPlayersMap, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist sync data to disk:', err);
  }
}

// ----------------------------------------------------
// API ROUTES FOR SERVICE WORKER & CLIENT STATS SYNC
// ----------------------------------------------------

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Maths Adventure Sync Service',
  });
});

// Endpoint to receive player stats from service worker or client
app.post('/api/sync/stats', (req, res) => {
  const {
    playerId = 'default-player',
    playerName = 'Hero',
    stats,
    level,
    stars,
    coins,
    gems,
    streak,
    realmProgress,
    badges,
    clientTimestamp,
  } = req.body;

  const serverTimestamp = new Date().toISOString();

  // Save / merge player sync record
  syncedPlayersMap[playerId] = {
    playerId,
    playerName,
    stats: stats || {},
    level: level || 1,
    stars: stars || 0,
    coins: coins || 0,
    gems: gems || 0,
    streak: streak || 0,
    realmProgress: realmProgress || {},
    badges: badges || [],
    clientTimestamp: clientTimestamp || serverTimestamp,
    serverTimestamp,
    lastSyncIp: req.ip,
  };

  persistSyncData();

  console.log(`[Sync] Stats synced for player "${playerName}" (${playerId}) at ${serverTimestamp}`);

  res.json({
    success: true,
    serverTimestamp,
    message: `Stats for "${playerName}" successfully synchronized with cloud server.`,
    playerId,
  });
});

// Endpoint to get stats for a specific player
app.get('/api/sync/stats/:playerId', (req, res) => {
  const { playerId } = req.params;
  const data = syncedPlayersMap[playerId];

  if (!data) {
    return res.status(404).json({
      success: false,
      message: `No server sync record found for player "${playerId}".`,
    });
  }

  res.json({
    success: true,
    data,
  });
});

// Endpoint to list all synced players (for teacher/parent dashboard overview)
app.get('/api/sync/all', (_req, res) => {
  res.json({
    success: true,
    count: Object.keys(syncedPlayersMap).length,
    players: Object.values(syncedPlayersMap),
  });
});

// ----------------------------------------------------
// VITE DEV MIDDLEWARE OR PRODUCTION STATIC SERVING
// ----------------------------------------------------
async function startServer() {
  if (!isProduction) {
    // Dynamic import of vite in dev mode
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static asset serving
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Maths Adventure server running at http://0.0.0.0:${PORT} [${isProduction ? 'production' : 'development'}]`);
  });
}

startServer();
