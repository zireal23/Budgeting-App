import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  selectedItem: {
    backgroundColor: '#d2e6ff',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#007AFF',
    marginRight: 8,
  },
  checkboxSelected: {
    backgroundColor: '#007AFF',
  },
  itemContent: {
    flex: 1,
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
  deleteButton: {
    marginLeft: 12,
  },
  deleteText: {
    fontSize: 18,
  },
});
