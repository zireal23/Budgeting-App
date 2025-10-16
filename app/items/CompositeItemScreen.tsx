import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  Modal,
  StyleSheet,
} from 'react-native';
import AddItemForm, { SubItemInput } from '../components/AddItemForm';
import { v4 as uuidv4 } from 'uuid';
import styles from '../styles/compositeStyles';
import { createCompositeGroup } from '../lib/compositeService';
import { useRouter } from 'expo-router';

type SubItemWithId = SubItemInput & { id: string };

export default function CompositeBuilder() {
    const router = useRouter();
  const [groupName, setGroupName] = useState('');
  const [subItems, setSubItems] = useState<SubItemWithId[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleAddSubItem = (itemData: SubItemInput) => {
    const newItem: SubItemWithId = { id: uuidv4(), ...itemData };
    setSubItems((prev) => [...prev, newItem]);
  };

  const handleRemoveSubItem = (id: string) => {
    setSubItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSaveComposite = async () => {
  if (!groupName.trim()) {
    Alert.alert('Error', 'Please enter a name for the composite');
    return;
  }
  if (subItems.length === 0) {
    Alert.alert('Error', 'Please add at least one sub-item');
    return;
  }

  try {
    setShowToast(true);
    setProgress(0);

    await createCompositeGroup(groupName, subItems);

    let p = 0;
    const interval = setInterval(() => {
      p += 0.05;
      setProgress(p);
      if (p >= 1) {
        clearInterval(interval);
        setShowToast(false);
        setGroupName('');
        setSubItems([]);
        setTimeout(() => {
          router.push('/');
        }, 800); // Delay navigation for toast/modal visibility
      }
    }, 50);
  } catch (error) {
    setShowToast(false);
    Alert.alert('Error', 'Failed to save composite');
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

      <ScrollView style={styles.container}>
        <Text style={styles.title}>Create Composite</Text>

        <TextInput
          style={styles.groupNameInput}
          placeholder="Composite Name"
          value={groupName}
          onChangeText={setGroupName}
        />

        <AddItemForm onSubmit={handleAddSubItem} submitLabel="Add Sub-Item" />

        <View style={styles.subItemsList}>
          {subItems.length > 0 ? (
            <FlatList
              data={subItems}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.subItemRow}>
                  <View style={styles.subItemTextContainer}>
                    <Text style={styles.subItemName}>
                      {item.name} – ₹{item.price}
                    </Text>
                    <Text style={styles.subItemDetails}>{item.store || '-'}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveSubItem(item.id)}
                  >
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          ) : (
            <Text style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>
              No sub-items added yet.
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={[styles.saveButton, subItems.length === 0 && { opacity: 0.6 }]}
          onPress={handleSaveComposite}
          disabled={subItems.length === 0}
        >
          <Text style={styles.saveButtonText}>Save Composite</Text>
        </TouchableOpacity>
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
