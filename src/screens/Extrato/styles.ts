import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    
    flex: 1,
    backgroundColor: '#11181E',
    padding: 35,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    flex: 1,
  },
  transactionContainer: {
    backgroundColor: '#11181E',
    borderRadius: 20,
    padding: 16,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginBottom: 16,
    backgroundColor: '#4E3D8D',
    borderRadius: 10,
    height: 60,
  },
  transactionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionName: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    marginLeft: 10,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  transactionDate: {
    fontSize: 14,
    color: '#aaa',
    marginLeft: 10,
  },
  transactionDetails: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  noTransactionsText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 16,
  },

  positiveAmount: {
    color: 'green',
  },
  
  negativeAmount: {
    color: 'red',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
});
