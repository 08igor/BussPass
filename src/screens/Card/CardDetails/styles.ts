import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#11181E',
    alignItems: 'center',
    padding: 35,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  card: {
    width: '100%',
    height: 200,
    backgroundColor: '#4E3D8D',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  cardText: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
  },
  cardDetails: {
    width: '100%',
    backgroundColor: '#11181E',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 16,
    color: '#fff',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  deleteButton: {
    backgroundColor: '#11181E',
    padding: 15,
    borderRadius: 10,
  },
  deleteButtonText: {
    fontSize: 18,
    color: '#FF3B30',
    textAlign: 'center',
  },
  simulateButton: {
    backgroundColor: '#4E3D8D',
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    marginVertical: 20,
  },
  simulateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  actionButton: {
    backgroundColor: '#11181E',
    padding: 15,
    borderRadius: 10,
  },

  actionButtonText: {
    fontSize: 18,
    color: '#FF3B30',
    textAlign: 'center',
  }

  
});