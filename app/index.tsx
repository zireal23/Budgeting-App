import * as React from 'react';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
// Adjust the import below if your storage file is in a different location
import { addItem, getAllItems, initDatabase, Item } from './lib/storage';

export default function Index() {
 const [items, setItems] = useState<Item[]>([]);

  const loadItems = async () => {
    const data = await getAllItems();
    setItems(data);
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
          <View key={item.id} style={styles.itemContainer}>
            <Text style={styles.itemText}>
              {item.name} – ₹{item.price} at {item.store}
            </Text>
            <Text style={styles.smallText}>
              {item.isOnline ? 'Online' : 'Offline'} • {item.paymentMethod}
              {item.cardUsed ? ` (${item.cardUsed})` : ''}
            </Text>
          </View>
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
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
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
});
