import Database from 'better-sqlite3';
import { join } from 'path';
import { readFileSync } from 'fs';

// Singleton database connection
let dbInstance = null;

export function getDb() {
  if (!dbInstance) {
    // Use the new database file to avoid locking issues
    const dbPath = process.env.DATABASE_URL || join(process.cwd(), 'budimind-new.db');
    dbInstance = new Database(dbPath);
    
    // Enable foreign key constraints
    dbInstance.pragma('foreign_keys = ON');
  }
  
  return dbInstance;
}

// Initialize database with schema
export function initDb() {
  const db = getDb();
  
  // Read and execute schema
  const schema = readFileSync(join(process.cwd(), 'db', 'schema.sql'), 'utf8');
  db.exec(schema);
  
  // Optionally seed data
  const seed = readFileSync(join(process.cwd(), 'db', 'seed.sql'), 'utf8');
  db.exec(seed);
  
  return db;
}

// Close database connection (for graceful shutdown)
export function closeDb() {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}