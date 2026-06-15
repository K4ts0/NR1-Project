import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { getDb } from './database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'nr01-secret-key-change-in-production';
const JWT_EXPIRY = '8h';

export async function authenticateUser(email, password) {
  const db = getDb();
  const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
  if (!user) return null;
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return null;
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
  return { token, user: { id: user.id, email: user.email, role: user.role, name: user.name } };
}

export function verifyToken(token) {
  try { return jwt.verify(token, JWT_SECRET); } catch { return null; }
}

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ error: 'Token não fornecido' });
  const decoded = verifyToken(authHeader.split(' ')[1]);
  if (!decoded) return res.status(401).json({ error: 'Token inválido ou expirado' });
  req.user = decoded;
  next();
}

export function requireAdminOrSafety(req, res, next) {
  if (!req.user || (req.user.role !== 'Administração' && req.user.role !== 'Segurança do trabalho')) 
    return res.status(403).json({ error: 'Acesso negado' });
  next();
}