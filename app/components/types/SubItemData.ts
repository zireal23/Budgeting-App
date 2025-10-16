// Data without id - input form usage
export type SubItem = {
  name: string;
  price: string;
  store: string;
  isOnline: boolean;
  paymentMethod: 'cash' | 'card';
  cardUsed?: string;
  category?: string;
  notes?: string;
};

// Complete item with generated id - app state usage
export type SubItemWithID = SubItem & { id: string };