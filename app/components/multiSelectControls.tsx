import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import styles from '../styles/multiSelectControlsStyle';

type Props = {
  multiSelect: boolean;
  onToggleMultiSelect: () => void;
  selectedCount: number;
  onCreateComposite: () => void;
};

export default function MultiSelectControls({ multiSelect, onToggleMultiSelect, selectedCount, onCreateComposite }: Props) {
  return (
    <>
      <TouchableOpacity style={styles.secondaryButton} onPress={onToggleMultiSelect}>
        <Text style={styles.secondaryButtonText}>
          {multiSelect ? '❌ Cancel Selection' : '☑️ Select Existing Items'}
        </Text>
      </TouchableOpacity>

      {multiSelect && (
        <TouchableOpacity
          style={[styles.saveButton, { opacity: selectedCount >= 2 ? 1 : 0.5 }]}
          disabled={selectedCount < 2}
          onPress={onCreateComposite}>
          <Text style={styles.saveText}>📦 Create Composite from Selected ({selectedCount})</Text>
        </TouchableOpacity>
      )}
    </>
  );
}
