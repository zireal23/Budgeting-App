import React from 'react';
import { Text, TouchableOpacity, View, Platform, Alert } from 'react-native';
import styles from '../styles/itemRowStyles';

type Item = {
  id: string;
  name: string;
  price: number;
  store: string;
  isOnline: boolean;
  paymentMethod: string;
  cardUsed?: string;
  category?: string;
  notes?: string;
};

type Props = {
  item: Item;
  multiSelect: boolean;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onPress: () => void;
};

export default function ItemRow({ item, multiSelect, isSelected, onSelect, onDelete, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={multiSelect ? () => onSelect(item.id) : onPress}
      style={[styles.itemContainer, multiSelect && isSelected ? styles.selectedItem : null]}>
      {multiSelect && <View style={[styles.checkbox, isSelected && styles.checkboxSelected]} />}

      <View style={styles.itemContent}>
        <Text style={styles.itemText}>
          {item.name} – ₹{item.price} at {item.store}
        </Text>
        <Text style={styles.smallText}>
          {item.isOnline ? 'Online' : 'Offline'} • {item.paymentMethod}
          {item.cardUsed ? ` (${item.cardUsed})` : ''}
        </Text>
      </View>

      {!multiSelect && (
        <TouchableOpacity
          onPress={e => {
            e.stopPropagation();
            if (Platform.OS === 'web') {
              if (window.confirm(`Delete "${item.name}"?`)) {
                onDelete(item.id);
              }
            } else {
              Alert.alert(
                'Delete Item',
                `Are you sure you want to delete "${item.name}"?`,
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Delete', onPress: () => onDelete(item.id) },
                ],
              );
            }
          }}
          style={styles.deleteButton}>
          <Text style={styles.deleteText}>🗑️</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}
