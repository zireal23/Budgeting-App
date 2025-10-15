import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { getAllItems, initDatabase } from '../lib/storage';
import { v4 as uuidv4 } from 'uuid';
import { createCompositeGroup } from '../lib/compositeService';

export default function CompositeBuilder() {
  const [groupName, setGroupName] = useState('');
  const [subItems, setSubItems] = useState<
    { id: string; name: string; price: string; store: string }[]
  >([]);
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemStore, setItemStore] = useState('');

  // Add sub-item (local, not saved yet)
  const addSubItem = () => {
    if (!itemName.trim() || !itemPrice.trim()) {
      Alert.alert('Missing data', 'Item name and price are required');
      return;
    }

    const subItem = {
      id: uuidv4(),
      name: itemName.trim(),
      price: itemPrice,
      store: itemStore.trim() || 'Misc',
    };
    setSubItems((prev) => [...prev, subItem]);

    setItemName('');
    setItemPrice('');
    setItemStore('');
  };

  // Remove sub-item before save
  const removeSubItem = (id: string) => {
    setSubItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleSave = async () => {
    if (!groupName.trim()) {
      return Alert.alert('Error', 'Please give this composite a name');
    }
    if (!subItems.length) {
      return Alert.alert('Error', 'Add at least one sub-item');
    }

    try {
      await initDatabase();
      await createCompositeGroup(groupName.trim(), subItems);
      Alert.alert('Success', 'Composite saved successfully!');
      router.back();
    } catch (error: any) {
      console.log('❌ Save failed:', error);
      Alert.alert('Error', 'Failed to save composite.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create Composite Item</Text>
      <TextInput
        style={styles.input}
        value={groupName}
        onChangeText={setGroupName}
        placeholder="Composite Name (e.g. Work Setup)"
      />

      <View style={styles.section}>
        <Text style={styles.subtitle}>Add Sub-Items</Text>
        <TextInput
          style={styles.input}
          value={itemName}
          onChangeText={setItemName}
          placeholder="Item name"
        />
        <TextInput
          style={styles.input}
          value={itemPrice}
          onChangeText={setItemPrice}
          placeholder="Price"
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          value={itemStore}
          onChangeText={setItemStore}
          placeholder="Store"
        />
        <TouchableOpacity style={styles.addButton} onPress={addSubItem}>
          <Text style={styles.addButtonText}>➕ Add Sub Item</Text>
        </TouchableOpacity>
      </View>

      {/* Preview list of sub-items */}
      {subItems.length > 0 && (
        <View style={styles.preview}>
          <Text style={styles.subtitle}>Sub-items ({subItems.length})</Text>
          <FlatList
            data={subItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.subItemRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemText}>
                    {item.name} – ₹{item.price}
                  </Text>
                  <Text style={{ fontSize: 12, color: '#666' }}>
                    {item.store || '-'}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => removeSubItem(item.id)}>
                  <Text style={{ fontSize: 20 }}>🗑️</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      )}

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>💾 Save Composite</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  section: { marginTop: 12 },
  subtitle: { fontSize: 18, fontWeight: '600', marginVertical: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  preview: { marginTop: 20 },
  subItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginVertical: 4,
  },
  itemText: { fontSize: 16, fontWeight: '500' },
  saveButton: {
    backgroundColor: '#28a745',
    marginTop: 20,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveText: { color: 'white', fontSize: 18, fontWeight: '600' },
});
