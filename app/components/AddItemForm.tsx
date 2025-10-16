import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export type SubItemInput = {
  name: string;
  price: string;
  store: string;
  isOnline: boolean;
  paymentMethod: 'cash' | 'card';
  cardUsed?: string;
  category?: string;
  notes?: string;
};

type Props = {
  onSubmit: (data: SubItemInput) => void;
  submitLabel?: string;
  resetTrigger?: number;
};

export default function AddItemForm({ onSubmit, submitLabel, resetTrigger }: Props) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [store, setStore] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [cardUsed, setCardUsed] = useState('');
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    setName('');
    setPrice('');
    setStore('');
    setIsOnline(false);
    setPaymentMethod('cash');
    setCardUsed('');
    setCategory('');
    setNotes('');
  }, [resetTrigger]);

  const handleSubmit = () => {
    if (!name.trim() || !price.trim() || isNaN(Number(price)) || !store.trim()) {
      Alert.alert('Invalid input', 'Please fill in valid name, price, and store');
      return;
    }
    onSubmit({
      name: name.trim(),
      price: price.trim(),
      store: store.trim(),
      isOnline,
      paymentMethod,
      cardUsed: cardUsed.trim() || undefined,
      category: category.trim() || undefined,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <View>
      <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput placeholder="Store" value={store} onChangeText={setStore} style={styles.input} />

      {/* Add isOnline toggle */}
      <View style={styles.row}>
        <TouchableOpacity
          onPress={() => setIsOnline(false)}
          style={[styles.pill, !isOnline && styles.pillSelected]}>
          <Text style={!isOnline ? styles.pillTextSelected : styles.pillText}>Offline</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setIsOnline(true)}
          style={[styles.pill, isOnline && styles.pillSelected]}>
          <Text style={isOnline ? styles.pillTextSelected : styles.pillText}>Online</Text>
        </TouchableOpacity>
      </View>

      {/* Payment Method */}
      <View style={styles.row}>
        <TouchableOpacity
          onPress={() => setPaymentMethod('cash')}
          style={[styles.pill, paymentMethod === 'cash' && styles.pillSelected]}>
          <Text style={paymentMethod === 'cash' ? styles.pillTextSelected : styles.pillText}>Cash</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setPaymentMethod('card')}
          style={[styles.pill, paymentMethod === 'card' && styles.pillSelected]}>
          <Text style={paymentMethod === 'card' ? styles.pillTextSelected : styles.pillText}>Card</Text>
        </TouchableOpacity>
      </View>

      {/* Card used if payment method card */}
      {paymentMethod === 'card' && (
        <TextInput
          placeholder="Card Used"
          value={cardUsed}
          onChangeText={setCardUsed}
          style={styles.input}
        />
      )}

      <TextInput
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
        style={styles.input}
      />

      <TextInput
        placeholder="Notes"
        multiline
        textAlignVertical="top"
        value={notes}
        onChangeText={setNotes}
        style={[styles.input, { height: 80 }]}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{submitLabel || 'Save'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 12,
  },
  pill: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 20,
    alignItems: 'center',
  },
  pillSelected: {
    backgroundColor: '#007AFF',
  },
  pillText: {
    color: '#007AFF',
    fontSize: 16,
  },
  pillTextSelected: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
