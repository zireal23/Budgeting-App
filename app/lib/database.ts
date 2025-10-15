import { openDatabaseAsync, SQLiteDatabase } from 'expo-sqlite';

let db: SQLiteDatabase;

// Initialize the database and create core tables
export async function initDatabase() {
  if (!db) {
    db = await openDatabaseAsync('BudgetApp.db');
    await db.execAsync(`
      PRAGMA journal_mode = WAL;

      -- Core items table
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

      CREATE TABLE IF NOT EXISTS composite_groups (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        createdAt TEXT NOT NULL
      );

      -- Link table for items in composite group
      CREATE TABLE IF NOT EXISTS composite_items (
        groupId TEXT NOT NULL,
        itemId TEXT NOT NULL,
        PRIMARY KEY (groupId, itemId),
        FOREIGN KEY (groupId) REFERENCES composite_groups(id) ON DELETE CASCADE,
        FOREIGN KEY (itemId) REFERENCES items(id) ON DELETE CASCADE
      );
    `);
  }
  return db;
}

// Optionally, call this on startup
export async function createTables() {
  await initDatabase();
}