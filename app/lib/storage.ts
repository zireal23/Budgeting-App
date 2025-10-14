import { initDatabase } from './database';
import { v4 as uuidv4 } from 'uuid';

// Re-export types
export type Item = {
  id: string;
  name: string;
  price: number;
  date: string; // ISO string
  store: string;
  isOnline: boolean;
  paymentMethod: 'cash' | 'card';
  cardUsed?: string;
  category: string;
  notes?: string;
};

export type CompositeItem = {
  id: string;
  name: string;
  itemIds: string[];
  date: string;
  totalPrice: number;
  paymentMethod: 'cash' | 'card';
  cardUsed?: string;
};

export type LinkGroup = {
  id: string;
  name: string;
  description?: string;
  purchaseIds: string[];
  createdAt: string;
  color?: string;
  icon?: string;
};

// Add a new item
export async function addItem(item: Omit<Item, 'id'>): Promise<Item> {
  const db = await initDatabase();
  const id = uuidv4();
  const date = item.date || new Date().toISOString();

  // Convert undefined to null for SQLite
  const cardUsed = item.cardUsed ?? null;
  const category = item.category ?? null;
  const notes = item.notes ?? null;

  await db.runAsync(
    `INSERT INTO items (id, name, price, date, store, isOnline, paymentMethod, cardUsed, category, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      item.name,
      item.price,
      date,
      item.store,
      item.isOnline ? 1 : 0,
      item.paymentMethod,
      cardUsed,
      category,
      notes,
    ]
  );

  return { id, ...item, date };
}

// Get all items
export async function getAllItems(): Promise<Item[]> {
  const db = await initDatabase();
  const result = await db.getAllAsync<Item>('SELECT * FROM items ORDER BY date DESC');
  return result.map(item => ({
    ...item,
    isOnline: Boolean(item.isOnline),
  }));
}
export { initDatabase };

