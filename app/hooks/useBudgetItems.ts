import { useState, useCallback } from 'react';
import { getAllItems, deleteItem, initDatabase, Item } from '../lib/storage';

export function useBudgetItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [multiSelect, setMultiSelect] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const loadItems = useCallback(async () => {
    await initDatabase();
    const data = await getAllItems();
    setItems(data);
    setSelectedIds(new Set());
  }, []);

  const toggleMultiSelect = () => {
    setMultiSelect(prev => !prev);
    if (multiSelect) setSelectedIds(new Set());
  };

  const toggleSelectItem = (id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleDelete = async (id: string) => {
    await deleteItem(id);
    await loadItems();
  };

  return {
    items,
    multiSelect,
    selectedIds,
    loadItems,
    toggleMultiSelect,
    toggleSelectItem,
    handleDelete,
  };
}
