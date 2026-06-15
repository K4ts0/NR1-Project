import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let dbInstance = null;

export async function initializeDatabase() {
  const db = await open({
    filename: join(__dirname, 'nr01.db'),
    driver: sqlite3.Database
  });

  // Tabela de usuários
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabela de respostas (anônimas, mas com setor e data)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS responses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sector TEXT NOT NULL,
      answers TEXT NOT NULL,
      observations TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      ips_score REAL,
      risk_level TEXT
    )
  `);

  // ========== USUÁRIOS PADRÃO (mantidos para compatibilidade) ==========
  const adminOldCount = await db.get('SELECT COUNT(*) as count FROM users WHERE email = "admin@administracao.com"');
  if (adminOldCount.count === 0) {
    const hashed = await bcrypt.hash('admin123', 10);
    await db.run(
      'INSERT INTO users (email, password, role, name) VALUES (?, ?, ?, ?)',
      ['admin@administracao.com', hashed, 'Administração', 'Administrador']
    );
  }

  const safetyOldCount = await db.get('SELECT COUNT(*) as count FROM users WHERE email = "seguranca@empresa.com"');
  if (safetyOldCount.count === 0) {
    const hashed = await bcrypt.hash('senha123', 10);
    await db.run(
      'INSERT INTO users (email, password, role, name) VALUES (?, ?, ?, ?)',
      ['seguranca@empresa.com', hashed, 'Segurança do trabalho', 'Técnico de Segurança']
    );
  }

  // ========== NOVOS USUÁRIOS SOLICITADOS ==========
  // Usuário: Admin (Administração)
  const adminNewCount = await db.get('SELECT COUNT(*) as count FROM users WHERE email = "Admin"');
  if (adminNewCount.count === 0) {
    const hashed = await bcrypt.hash('admin@2026', 10);
    await db.run(
      'INSERT INTO users (email, password, role, name) VALUES (?, ?, ?, ?)',
      ['Admin', hashed, 'Administração', 'Administrador']
    );
  }

  // Usuário: Segtrab (Segurança do trabalho)
  const segtrabCount = await db.get('SELECT COUNT(*) as count FROM users WHERE email = "Segtrab"');
  if (segtrabCount.count === 0) {
    const hashed = await bcrypt.hash('SEGtrab@2026', 10);
    await db.run(
      'INSERT INTO users (email, password, role, name) VALUES (?, ?, ?, ?)',
      ['Segtrab', hashed, 'Segurança do trabalho', 'Segurança do Trabalho']
    );
  }

  // Usuário: Informatica (Segurança do trabalho)
  const informaticaCount = await db.get('SELECT COUNT(*) as count FROM users WHERE email = "Informatica"');
  if (informaticaCount.count === 0) {
    const hashed = await bcrypt.hash('infor@2026', 10);
    await db.run(
      'INSERT INTO users (email, password, role, name) VALUES (?, ?, ?, ?)',
      ['Informatica', hashed, 'Segurança do trabalho', 'Informática']
    );
  }

  dbInstance = db;
  return db;
}

export function getDb() {
  if (!dbInstance) throw new Error('Database not initialized');
  return dbInstance;
}