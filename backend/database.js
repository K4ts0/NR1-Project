import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcryptjs';
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

  // ========== FUNÇÃO QUE CRIA OU ATUALIZA SENHA ==========
  async function createOrUpdateUser(email, password, role, name) {
    const hashed = await bcrypt.hash(password, 10);
    const existing = await db.get('SELECT id FROM users WHERE email = ?', [email]);
    if (!existing) {
      await db.run(
        'INSERT INTO users (email, password, role, name) VALUES (?, ?, ?, ?)',
        [email, hashed, role, name]
      );
      console.log(`✅ Usuário criado: ${email} (${role})`);
    } else {
      // Atualiza a senha para garantir que está correta
      await db.run(
        'UPDATE users SET password = ?, name = ? WHERE email = ?',
        [hashed, name, email]
      );
      console.log(`🔄 Senha atualizada para: ${email}`);
    }
  }

  // ========== CRIA/ATUALIZA OS USUÁRIOS ==========
  await createOrUpdateUser('Admin', 'admin@2026', 'Administração', 'Administrador');
  await createOrUpdateUser('Segtrab', 'SEGtrab@2026', 'Segurança do trabalho', 'Segurança do Trabalho');
  await createOrUpdateUser('Informatica', 'infor@2026', 'Segurança do trabalho', 'Informática');
  // Opcional: manter os antigos
  await createOrUpdateUser('admin@administracao.com', 'admin123', 'Administração', 'Administrador (antigo)');
  await createOrUpdateUser('seguranca@empresa.com', 'senha123', 'Segurança do trabalho', 'Técnico de Segurança (antigo)');

  dbInstance = db;
  return db;
}

export function getDb() {
  if (!dbInstance) throw new Error('Database not initialized');
  return dbInstance;
}