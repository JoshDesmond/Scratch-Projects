import express from 'express';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());

// API endpoint to load stats
app.get('/api/stats/:file', (req, res) => {
  const filePath = join(__dirname, 'data', req.params.file);
  
  if (!existsSync(filePath)) {
    return res.json({
      persons: {},
      actions: {},
      objects: {},
      failures: {
        persons: {},
        actions: {},
        objects: {},
      },
    });
  }
  
  try {
    const content = readFileSync(filePath, 'utf-8');
    const stats = JSON.parse(content);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read stats file' });
  }
});

// API endpoint to save stats
app.post('/api/stats/:file', (req, res) => {
  const filePath = join(__dirname, 'data', req.params.file);
  
  try {
    writeFileSync(filePath, JSON.stringify(req.body, null, 2), 'utf-8');
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to write stats file' });
  }
});

// API endpoint to load PAO data
app.get('/api/pao-data', (req, res) => {
  const filePath = join(__dirname, 'data', 'PAO.csv');
  
  try {
    const content = readFileSync(filePath, 'utf-8');
    res.type('text/plain');
    res.send(content);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read PAO data file' });
  }
});

// Create Vite server in middleware mode and use it
const vite = await createViteServer({
  server: { middlewareMode: true },
  appType: 'spa',
});

app.use(vite.middlewares);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
