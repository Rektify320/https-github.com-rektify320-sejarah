const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;
const DB_FILE = path.join(__dirname, 'data', 'db_players.json');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
      fs.writeFileSync(DB_FILE, JSON.stringify({ players: [] }, null, 2));
    }
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  } catch (e) {
    return { players: [] };
  }
}

function writeDb(data) {
  try {
    fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Error writing DB:', e);
  }
}

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = decodeURI(parsedUrl.pathname);

  // Set default CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // --- API ROUTING ---
  if (pathname === '/api/player' && req.method === 'GET') {
    const name = parsedUrl.searchParams.get('name') || '';
    const db = readDb();
    const player = db.players.find(p => p.name.toLowerCase() === name.trim().toLowerCase()) || null;
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ success: true, player }));
    return;
  }

  if (pathname === '/api/player/score' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const name = (payload.name || '').trim();
        if (!name) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Nama pemain wajib diisi.' }));
          return;
        }

        const db = readDb();
        let player = db.players.find(p => p.name.toLowerCase() === name.toLowerCase());
        if (!player) {
          player = {
            name: name,
            points: Number(payload.points) || 0,
            hp: Number(payload.hp) || 100,
            completedQuests: payload.completedQuests || [],
            history: payload.history || [],
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
          };
          db.players.push(player);
        } else {
          if (payload.points !== undefined) player.points = Number(payload.points);
          if (payload.hp !== undefined) player.hp = Number(payload.hp);
          if (payload.completedQuests) player.completedQuests = payload.completedQuests;
          if (payload.history) player.history = payload.history;
          player.lastUpdated = new Date().toISOString();
        }

        writeDb(db);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: true, player }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Invalid payload' }));
      }
    });
    return;
  }

  if (pathname === '/api/leaderboard' && req.method === 'GET') {
    const db = readDb();
    const sorted = [...db.players].sort((a, b) => (b.points || 0) - (a.points || 0)).slice(0, 20);
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ success: true, leaderboard: sorted }));
    return;
  }

  // --- STATIC FILE SERVING ---
  let reqPath = pathname;
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  const filePath = path.join(__dirname, reqPath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log('Server aktif di http://localhost:' + PORT + '/');
});
