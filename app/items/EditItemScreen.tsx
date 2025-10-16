import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { updateItem } from '../lib/storage';

// Define types
type ItemParams = {
  id: string;
  name: string;
  price: string;
  store: string;
  isOnline: string;
  paymentMethod: 'cash' | 'card';
  cardUsed?: string;
  category?: string;
  notes?: string;
};

export default function EditItemScreen() {
  const { id, name, price, store, isOnline, paymentMethod, cardUsed, category, notes } =
    useLocalSearchParams<ItemParams>();

  const [formName, setFormName] = useState(name || '');
  const [formPrice, setFormPrice] = useState(price || '');
  const [formStore, setFormStore] = useState(store || '');
  const [formIsOnline, setFormIsOnline] = useState(isOnline === 'true');
  const [formPaymentMethod, setFormPaymentMethod] = useState<'cash' | 'card'>(
    paymentMethod === 'cash' ? 'cash' : 'card'
  );
  const [formCardUsed, setFormCardUsed] = useState(cardUsed || '');
  const [formCategory, setFormCategory] = useState(category || '');
  const [formNotes, setFormNotes] = useState(notes || '');

  const [successToast, setSuccessToast] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async () => {
    const nameTrimmed = formName.trim();
    const storeTrimmed = formStore.trim();
    const priceNum = parseFloat(formPrice.replace(/,/g, ''));

    if (!nameTrimmed) {
      return Alert.alert('Error', 'Item name is required.');
    }
    if (!formPrice || isNaN(priceNum) || priceNum <= 0) {
      return Alert.alert('Error', 'Valid price is required.');
    }
    if (!storeTrimmed) {
      return Alert.alert('Error', 'Store name is required.');
    }

    try {
      setSuccessToast(true);
      setProgress(0);

      await updateItem(id!, {
        name: nameTrimmed,
        price: priceNum,
        store: storeTrimmed,
        isOnline: formIsOnline,
        paymentMethod: formPaymentMethod,
        cardUsed: formCardUsed.trim() || undefined,
        category: formCategory.trim() || 'General',
        notes: formNotes.trim() || undefined,
      });

      let p = 0;
      const interval = setInterval(() => {
        p += 0.02;
        setProgress(p);
        if (p >= 1) {
          clearInterval(interval);
          setSuccessToast(false);
          router.back();
        }
      }, 10);

    } catch (error: any) {
      Alert.alert('Save Failed', error.message || 'Unknown error');
    }
  };

  return (
    <>
      {/* Success Toast */}
      <Modal transparent visible={successToast} animationType="fade">
        <View style={styles.toastOverlay}>
          <View style={styles.successToast}>
            <Text style={styles.successText}>Saving changes...</Text>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView style={styles.container}>
        <Text style={styles.title}>Edit Purchase</Text>

        <Text style={styles.label}>Item Name *</Text>
        <TextInput
          style={styles.input}
          value={formName}
          onChangeText={setFormName}
          placeholder="e.g., Book"
          autoCapitalize="words"
        />

        <Text style={styles.label}>Price *</Text>
        <TextInput
          style={styles.input}
          value={formPrice}
          onChangeText={setFormPrice}
          placeholder="1999"
          keyboardType="default"
        />

        <Text style={styles.label}>Store *</Text>
        <TextInput
          style={styles.input}
          value={formStore}
          onChangeText={setFormStore}
          placeholder="e.g., Amazon"
          autoCapitalize="words"
        />

        <Text style={styles.label}>Purchase Type</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.pill, !formIsOnline && styles.pillSelected]}
            onPress={() => setFormIsOnline(false)}>
            <Text style={[styles.pillText, !formIsOnline && styles.pillTextSelected]}>Offline</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.pill, formIsOnline && styles.pillSelected]}
            onPress={() => setFormIsOnline(true)}>
            <Text style={[styles.pillText, formIsOnline && styles.pillTextSelected]}>Online</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Payment Method</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.pill, formPaymentMethod === 'cash' && styles.pillSelected]}
            onPress={() => setFormPaymentMethod('cash')}>
            <Text style={[styles.pillText, formPaymentMethod === 'cash' && styles.pillTextSelected]}>
              Cash
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.pill, formPaymentMethod === 'card' && styles.pillSelected]}
            onPress={() => setFormPaymentMethod('card')}>
            <Text style={[styles.pillText, formPaymentMethod === 'card' && styles.pillTextSelected]}>
              Card
            </Text>
          </TouchableOpacity>
        </View>

        {formPaymentMethod === 'card' && (
          <>
            <Text style={styles.label}>Card Used</Text>
            <TextInput
              style={styles.input}
              value={formCardUsed}
              onChangeText={setFormCardUsed}
              placeholder="e.g., HDFC Visa"
              autoCapitalize="words"
            />
          </>
        )}

        <Text style={styles.label}>Category</Text>
        <TextInput
          style={styles.input}
          value={formCategory}
          onChangeText={setFormCategory}
          placeholder="e.g., Education"
          autoCapitalize="words"
        />

        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          value={formNotes}
          onChangeText={setFormNotes}
          placeholder="Any details..."
          multiline
          textAlignVertical="top"
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

// ✅ Define styles locally
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
