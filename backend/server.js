import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { initializeDatabase, getDb } from './database.js';
import { authenticateUser, requireAuth, requireAdminOrSafety } from './auth.js';
import { categories, questions, calculateCategoryScores, calculateIPS } from './questionnaireData.js';
import { generateFullReport } from './reportGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

// ========== DECLARAÇÃO DO APP ==========
const app = express();
const PORT = process.env.PORT || 3001;

// ========== MIDDLEWARES ==========
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

await initializeDatabase();

// ========== SERVE O FRONTEND (BUILD DO REACT) ==========
const frontendPath = join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(frontendPath));

// ========== ROTAS DA API ==========
app.get('/api/questionnaire', (req, res) => {
  res.json({ categories, questions });
});

app.post('/api/responses', async (req, res) => {
  const { sector, answers, observations } = req.body;
  if (!sector || !answers || answers.length !== 50) {
    return res.status(400).json({ error: 'Setor e todas as respostas são obrigatórios' });
  }
  const scores = calculateCategoryScores(answers);
  const { ips, level } = calculateIPS(scores);
  const db = getDb();
  await db.run(
    'INSERT INTO responses (sector, answers, observations, ips_score, risk_level) VALUES (?, ?, ?, ?, ?)',
    [sector, JSON.stringify(answers), observations || '', ips, level]
  );
  const miniReport = { scores, ips, ipsLevel: level, message: 'Avaliação concluída. Relatório gerado conforme NR-01.' };
  res.json({ success: true, miniReport });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const result = await authenticateUser(email, password);
  if (!result) return res.status(401).json({ error: 'Credenciais inválidas' });
  res.json(result);
});

app.get('/api/responses', requireAuth, requireAdminOrSafety, async (req, res) => {
  const db = getDb();
  const rows = await db.all('SELECT id, sector, created_at, ips_score, risk_level FROM responses ORDER BY created_at DESC');
  res.json({ responses: rows });
});

app.get('/api/reports/stats', requireAuth, requireAdminOrSafety, async (req, res) => {
  const db = getDb();
  const responses = await db.all('SELECT sector, ips_score, risk_level FROM responses');
  const total = responses.length;
  const sectors = [...new Set(responses.map(r => r.sector))];
  const sectorStats = sectors.map(s => {
    const sectorResponses = responses.filter(r => r.sector === s);
    const avgIps = sectorResponses.reduce((acc, r) => acc + (r.ips_score || 0), 0) / sectorResponses.length;
    return { sector: s, total: sectorResponses.length, avgIps: avgIps.toFixed(2) };
  });
  const riskDist = { Baixo: 0, Moderado: 0, Alto: 0, Crítico: 0 };
  responses.forEach(r => { if (r.risk_level) riskDist[r.risk_level]++; });
  res.json({ totalResponses: total, sectorStats, riskDistribution: riskDist });
});

app.get('/api/reports/pdf', requireAuth, requireAdminOrSafety, async (req, res) => {
  const { sector } = req.query;
  if (!sector) return res.status(400).json({ error: 'Setor obrigatório' });
  const db = getDb();
  const responses = await db.all('SELECT answers FROM responses WHERE sector = ?', [sector]);
  if (!responses.length) return res.status(404).json({ error: 'Nenhuma resposta para este setor' });
  try {
    const pdfBuffer = await generateFullReport(responses, sector, 'Minha Empresa');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=relatorio_${sector}_${Date.now()}.pdf`);
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao gerar PDF: ' + err.message });
  }
});

app.delete('/api/responses/sector/:sector', requireAuth, requireAdminOrSafety, async (req, res) => {
  const { sector } = req.params;
  if (!sector) return res.status(400).json({ error: 'Setor não informado' });
  const db = getDb();
  const result = await db.run('DELETE FROM responses WHERE sector = ?', [sector]);
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Nenhuma resposta encontrada para este setor' });
  }
  res.json({ success: true, deletedCount: result.changes });
});

app.get('/api/share-link', requireAuth, requireAdminOrSafety, (req, res) => {
  const frontendUrl = req.headers.origin || `${req.protocol}://${req.get('host')}`;
  res.json({ link: `${frontendUrl}/responder` });
});

// ========== FALLBACK PARA O FRONTEND (ROTAS DO REACT) ==========
app.get('*', (req, res) => {
  res.sendFile(join(frontendPath, 'index.html'));
});

// ========== INICIA O SERVIDOR ==========
app.listen(PORT, '0.0.0.0', () => console.log(`Backend rodando na porta ${PORT} - acessível na rede`));

app.post('/api/debug/check-password', async (req, res) => {
  const { email, password } = req.body;
  const db = getDb();
  const user = await db.get('SELECT password FROM users WHERE email = ?', [email]);
  if (!user) return res.json({ exists: false });
  const valid = await bcrypt.compare(password, user.password);
  res.json({ email, valid });
});