import { getDb, initDb } from './src/lib/db.js';

console.log('Initializing database...');
const db = initDb();
console.log('Database initialized at:', db.filename);

// Test a simple query
const result = db.prepare('SELECT COUNT(*) as count FROM consultants').get();
console.log('Consultant count:', result.count);

db.close();
console.log('Database closed.');