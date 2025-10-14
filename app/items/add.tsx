import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    View as DefaultView,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { addItem } from '../lib/storage';

export default function AddItemScreen() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [store, setStore] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('card');
  const [cardUsed, setCardUsed] = useState('');
  const [category, setCategory] = useState('');
    const [notes, setNotes] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

  const [errorToast, setErrorToast] = useState(false);
  const [successToast, setSuccessToast] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async () => {
    const nameTrimmed = name.trim();
    const storeTrimmed = store.trim();
    const priceNum = parseFloat(price.replace(/,/g, '')); // Allow commas

    // Validate
    if (!name.trim()) {
  setErrorMessage('Item name is required.');
  setErrorToast(true);
  setTimeout(() => {
    setErrorToast(false);
    setErrorMessage('');
  }, 2500);
  return;
}

  if (!price || isNaN(priceNum) || priceNum <= 0) {
  setErrorMessage('Valid price is required (e.g., 999 or 1,299).');
  setErrorToast(true);
  setTimeout(() => {
    setErrorToast(false);
    setErrorMessage('');
  }, 2500);
  return;
}
   if (!store.trim()) {
  setErrorMessage('Store name is required.');
  setErrorToast(true);
  setTimeout(() => {
    setErrorToast(false);
    setErrorMessage('');
  }, 2500);
  return;
}

    try {
      // Show success toast
      setSuccessToast(true);
      setProgress(0);

      // Save item
      await addItem({
        name: nameTrimmed,
        price: priceNum,
        date: new Date().toISOString(),
        store: storeTrimmed,
        isOnline,
        paymentMethod,
        cardUsed: cardUsed.trim() || undefined,
        category: category.trim() || 'General',
        notes: notes.trim() || undefined,
      });

      // Animate progress to 100% over ~1 second
      let p = 0;
      const interval = setInterval(() => {
        p += 0.02;
        setProgress(p);
        if (p >= 1) {
            clearInterval(interval);
            setSuccessToast(false); // ✅ Clear toast state
            router.push('/');
        }
      }, 10);

    } catch (error: any) {
      setSuccessToast(false);
      setErrorToast(true);
      setTimeout(() => setErrorToast(false), 2000);
    }
  };

  return (
    <>
      {/* Error Toast */}
      <Modal transparent visible={errorToast} animationType="fade">
        <DefaultView style={styles.toastOverlay}>
          <View style={styles.errorToast}>
            <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
          </View>
        </DefaultView>
      </Modal>

      {/* Success Toast with Progress */}
      <Modal transparent visible={successToast} animationType="fade">
        <DefaultView style={styles.toastOverlay}>
          <View style={styles.successToast}>
            <Text style={styles.successText}>Saving purchase...</Text>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
            </View>
          </View>
        </DefaultView>
      </Modal>

      <ScrollView style={styles.container}>
        <Text style={styles.title}>Add New Purchase</Text>

        <Text style={styles.label}>Item Name *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="e.g., Book"
          autoCapitalize="words"
        />

        <Text style={styles.label}>Price *</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice} // Allow any input
          placeholder="e.g., 1999"
          keyboardType="default" // Allow full keyboard
        />

        <Text style={styles.label}>Store *</Text>
        <TextInput
          style={styles.input}
          value={store}
          onChangeText={setStore}
          placeholder="e.g., Amazon"
          autoCapitalize="words"
        />

        <Text style={styles.label}>Purchase Type</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.pill, !isOnline && styles.pillSelected]}
            onPress={() => setIsOnline(false)}>
            <Text style={[styles.pillText, !isOnline && styles.pillTextSelected]}>Offline</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.pill, isOnline && styles.pillSelected]}
            onPress={() => setIsOnline(true)}>
            <Text style={[styles.pillText, isOnline && styles.pillTextSelected]}>Online</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Payment Method</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.pill, paymentMethod === 'cash' && styles.pillSelected]}
            onPress={() => setPaymentMethod('cash')}>
            <Text style={[styles.pillText, paymentMethod === 'cash' && styles.pillTextSelected]}>
              Cash
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.pill, paymentMethod === 'card' && styles.pillSelected]}
            onPress={() => setPaymentMethod('card')}>
            <Text style={[styles.pillText, paymentMethod === 'card' && styles.pillTextSelected]}>
              Card
            </Text>
          </TouchableOpacity>
        </View>

        {paymentMethod === 'card' && (
          <>
            <Text style={styles.label}>Card Used</Text>
            <TextInput
              style={styles.input}
              value={cardUsed}
              onChangeText={setCardUsed}
              placeholder="e.g., HDFC Visa"
              autoCapitalize="words"
            />
          </>
        )}

        <Text style={styles.label}>Category</Text>
        <TextInput
          style={styles.input}
          value={category}
          onChangeText={setCategory}
          placeholder="e.g., Education"
          autoCapitalize="words"
        />

        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Any details..."
          multiline
          textAlignVertical="top"
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Save Purchase</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 16, marginVertical: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
  },
  row: { flexDirection: 'row', gap: 12, marginVertical: 8, marginBottom: 16 },
  pill: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    alignItems: 'center',
  },
  pillSelected: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  pillText: { color: '#333', fontSize: 16 },
  pillTextSelected: { color: '#fff', fontWeight: '600' },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 24,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },

  // Toast Styles
  toastOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  errorToast: {
    backgroundColor: '#D32F2F',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 280,
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  successToast: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 280,
  },
  successText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  progressBarBackground: {
    height: 6,
    width: '100%',
    backgroundColor: '#333',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 3,
  },
});
