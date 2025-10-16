import { StyleSheet } from 'react-native';

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
  groupNameInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    fontSize: 18,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  subItemsList: {
    marginTop: 20,
  },
  subItemRow: {
    flexDirection: 'row',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginVertical: 6,
    alignItems: 'center',
  },
  subItemTextContainer: {
    flex: 1,
  },
  subItemName: {
    fontSize: 16,
    fontWeight: '600',
  },
  subItemDetails: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  removeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#ff4d4d',
    borderRadius: 8,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  saveButton: {
    marginTop: 24,
    backgroundColor: '#28a745',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default styles;
