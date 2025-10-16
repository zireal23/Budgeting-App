import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { router, useFocusEffect } from 'expo-router';

import { useBudgetItems } from './hooks/useBudgetItems';
import ItemRow from './components/itemRow';
import MultiSelectControls from './components/multiSelectControls';

import styles from './styles/indexStyles';

export default function Index() {
  const {
    items,
    multiSelect,
    selectedIds,
    loadItems,
    toggleMultiSelect,
    toggleSelectItem,
    handleDelete,
  } = useBudgetItems();

  useFocusEffect(
    React.useCallback(() => {
      loadItems();
    }, [loadItems])
  );

  const navigateToCreateComposite = () => router.push('/items/CompositeItemScreen');

  const createCompositeFromSelection = () => {
    if (selectedIds.size < 2) {
      alert('Select at least 2 items');
      return;
    }
    router.push({
      pathname: '/items/CompositeItemScreen',
      params: { existingItemIds: Array.from(selectedIds).join(',') }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Budget App</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/items/AddItemScreen')}>
        <Text style={styles.buttonText}>➕ Add New Purchase</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={navigateToCreateComposite}>
        <Text style={styles.secondaryButtonText}>📁 Create Composite (New Items)</Text>
      </TouchableOpacity>

      <MultiSelectControls
        multiSelect={multiSelect}
        onToggleMultiSelect={toggleMultiSelect}
        selectedCount={selectedIds.size}
        onCreateComposite={createCompositeFromSelection}
      />

      <Text style={styles.subtitle}>Items ({items.length})</Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ItemRow
            item={item}
            multiSelect={multiSelect}
            isSelected={selectedIds.has(item.id)}
            onSelect={toggleSelectItem}
            onDelete={handleDelete}
            onPress={() =>
              router.push({
                pathname: '/items/EditItemScreen',
                params: {
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  store: item.store,
                  isOnline: String(item.isOnline),
                  paymentMethod: item.paymentMethod,
                  cardUsed: item.cardUsed || '',
                  category: item.category || '',
                  notes: item.notes || '',
                },
              })
            }
          />
        )}
      />
    </View>
  );
}
