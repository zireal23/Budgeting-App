import * as React from 'react';
import { useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { deleteItem, getAllItems, initDatabase, Item } from './lib/storage';

export default function Index() {
  const [items, setItems] = useState<Item[]>([]);

  const loadItems = async () => {
    const data = await getAllItems();
    setItems(data);
  };

  const handleDelete = async (id: string) => {
    console.log('🗑️ Delete triggered for ID:', id);
    try {
      await deleteItem(id);
      console.log('✅ Item deleted successfully');
      await loadItems();
      console.log('🔁 List reloaded');
    } catch (error: any) {
      console.log('❌ Delete failed:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        await initDatabase();
        await loadItems();
      })();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Budget App</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/items/add')}>
        <Text style={styles.buttonText}>➕ Add New Purchase</Text>
      </TouchableOpacity>
      <Text style={styles.subtitle}>Items ({items.length}):</Text>
      <ScrollView>
        {items.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => {
              // Pass all item data to edit screen
              router.push({
                pathname: '/items/edit',
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
              });
            }}>
            <View style={styles.itemContainer}>
              <View style={styles.itemContent}>
                <Text style={styles.itemText}>
                  {item.name} – ₹{item.price} at {item.store}
                </Text>
                <Text style={styles.smallText}>
                  {item.isOnline ? 'Online' : 'Offline'} • {item.paymentMethod}
                  {item.cardUsed ? ` (${item.cardUsed})` : ''}
                </Text>
              </View>

              {/* Delete Button */}
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={(e) => {
                  // Prevent edit when deleting
                  e.stopPropagation();
                  console.log('🚨 Trash icon pressed!');
                  if (Platform.OS === 'web') {
                    if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
                      handleDelete(item.id);
                    }
                  } else {
                    Alert.alert(
                      'Delete Item',
                      `Are you sure you want to delete "${item.name}"?`,
                      [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Delete',
                          onPress: () => handleDelete(item.id),
                        },
                      ]
                    );
                  }
                }}>
                <View style={styles.deleteHitbox}>
                  <Text style={styles.deleteText}>🗑️</Text>
                </View>
              </TouchableOpacity>

              {/* Edit Icon */}
              <Text style={styles.editIcon}>✏️</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginVertical: 10,
    fontWeight: '600',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
  },
  itemContent: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  smallText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  deleteHitbox: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffeded',
    borderRadius: 20,
  },
  deleteText: {
    fontSize: 18,
  },
  editIcon: {
    fontSize: 18,
    marginLeft: 8,
    color: '#007AFF',
  },
});
