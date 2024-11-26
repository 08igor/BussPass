import { StyleSheet } from "react-native";

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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  balanceCard: {
    backgroundColor: '#4E3D8D',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  balanceText: {
    fontSize: 18,
    color: '#DDD',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
  },
  saldoIcon: {
    marginLeft: 10,
    color: '#fff',
  },
  cardName: {
    fontSize: 18,
    color: '#DDD',
    marginTop: 16,
  },
  bankName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    marginTop: 8,
  },
  transactionContainer: {
    backgroundColor: '#11181E',
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 10,
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
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4E3D8D',
    textAlign: 'left',
    marginLeft: 8,
  },
  transactionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    marginLeft: 10,
  },
  transactionDate: {
    fontSize: 12,
    color: '#999',
    marginLeft: 8,
  },
  transactionTime: {},
  noTransactionsText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 16,
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

  viewStatementButton: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },

  viewStatementButtonContainer: {
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
});
