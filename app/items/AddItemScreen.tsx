import React, { useState } from 'react';
import { ScrollView, Alert, Modal, View, Text, StyleSheet } from 'react-native';
import AddItemForm, { SubItemInput } from '../components/AddItemForm';
import { addItem } from '../lib/storage';
import { useRouter } from 'expo-router';

export default function AddItemScreen() {
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSave = async (data: SubItemInput) => {
    try {
      setShowToast(true);
      setProgress(0);

      await addItem({
        ...data,
        price: parseFloat(data.price),
        date: new Date().toISOString(),
        category: data.category ?? 'Uncategorized',
      });

      let p = 0;
      const interval = setInterval(() => {
        p += 0.05;
        setProgress(p);
        if (p >= 1) {
          clearInterval(interval);
          setShowToast(false);
          Alert.alert('Success', 'Purchase added!');
          router.push('/');
        }
      }, 50);
    } catch (error) {
      setShowToast(false);
      Alert.alert('Error', 'Failed to add purchase');
      console.error(error);
    }
  };

  return (
    <>
      <Modal transparent visible={showToast} animationType="fade">
        <View style={toastStyles.toastOverlay}>
          <View style={toastStyles.successToast}>
            <Text style={toastStyles.successText}>Saving changes...</Text>
            <View style={toastStyles.progressBarBackground}>
              <View style={[toastStyles.progressBar, { width: `${progress * 100}%` }]} />
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView style={{ flex: 1, padding: 20 }}>
        <AddItemForm onSubmit={handleSave} />
      </ScrollView>
    </>
  );
}

const toastStyles = StyleSheet.create({
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
