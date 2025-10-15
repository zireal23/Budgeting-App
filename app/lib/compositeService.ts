import { initDatabase } from './database';
import { v4 as uuidv4 } from 'uuid';

export async function createCompositeGroup(
  name: string,
  subItems: { id: string; name: string; price: string; store: string }[]
) {
  const db = await initDatabase();
  const groupId = uuidv4();
  const createdAt = new Date().toISOString();

  await db.runAsync(
    'INSERT INTO composite_groups (id, name, createdAt) VALUES (?, ?, ?)',
    [groupId, name, createdAt]
  );

  for (const item of subItems) {
    const itemId = uuidv4();
    await db.runAsync(
      `INSERT INTO items (id, name, price, date, store, isOnline, paymentMethod)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        itemId,
        item.name,
        parseFloat(item.price),
        new Date().toISOString(),
        item.store,
        0,
        'cash',
      ]
    );

    await db.runAsync(
      `INSERT INTO composite_items (groupId, itemId) VALUES (?, ?)`,
      [groupId, itemId]
    );
  }
}
