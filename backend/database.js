import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcryptjs'; // use bcryptjs
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

  // Tabela de respostas
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

  // ========== FUNÇÃO PARA CRIAR OU ATUALIZAR USUÁRIO ==========
  async function createUserIfNotExists(email, password, role, name) {
    const existing = await db.get('SELECT id FROM users WHERE email = ?', [email]);
    if (!existing) {
      const hashed = await bcrypt.hash(password, 10);
      await db.run(
        'INSERT INTO users (email, password, role, name) VALUES (?, ?, ?, ?)',
        [email, hashed, role, name]
      );
      console.log(`✅ Usuário criado: ${email} (${role})`);
    } else {
      console.log(`ℹ️ Usuário já existe: ${email}`);
    }
  }

  // ========== CRIAR USUÁRIOS ==========
  await createUserIfNotExists('Admin', 'admin@2026', 'Administração', 'Administrador');
  await createUserIfNotExists('Segtrab', 'SEGtrab@2026', 'Segurança do trabalho', 'Segurança do Trabalho');
  await createUserIfNotExists('Informatica', 'infor@2026', 'Segurança do trabalho', 'Informática');

  // (Opcional) manter usuários antigos se quiser
  await createUserIfNotExists('admin@administracao.com', 'admin123', 'Administração', 'Administrador (antigo)');
  await createUserIfNotExists('seguranca@empresa.com', 'senha123', 'Segurança do trabalho', 'Técnico de Segurança (antigo)');

  dbInstance = db;
  return db;
}

export function getDb() {
  if (!dbInstance) throw new Error('Database not initialized');
  return dbInstance;
}