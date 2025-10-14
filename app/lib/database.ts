import { openDatabaseAsync, SQLiteDatabase } from 'expo-sqlite';

let db: SQLiteDatabase;

// Initialize the database
export async function initDatabase() {
  if (!db) {
    db = await openDatabaseAsync('BudgetApp.db');
    await createTables();
  }
  return db;
}

// Create tables if they don't exist
async function createTables() {
  const db = await initDatabase();

  // Individual items
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS items (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      date TEXT NOT NULL,
      store TEXT NOT NULL,
      isOnline INTEGER NOT NULL,
      paymentMethod TEXT NOT NULL,
      cardUsed TEXT,
      category TEXT,
      notes TEXT
    );
  `);

  // Composite items (grouped purchases)
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS composite_items (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      itemIds TEXT NOT NULL, -- JSON array of item IDs
      date TEXT NOT NULL,
      totalPrice REAL NOT NULL,
      paymentMethod TEXT NOT NULL,
      cardUsed TEXT
    );
  `);

  // Linked purchase groups (non-destructive relationships)
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS link_groups (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      purchaseIds TEXT NOT NULL, -- JSON array of item or composite IDs
      createdAt TEXT NOT NULL,
      color TEXT,
      icon TEXT
    );
  `);
}
