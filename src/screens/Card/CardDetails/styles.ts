import { StyleSheet } from "react-native";

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
  saldo: {
    fontSize: 18,
    fontWeight: 'bold',
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
    position: 'absolute', // Faz o ícone de lixeira ficar posicionado absolutamene
    top: 20, // Distância do topo
    right: 20, // Distância da direita
    backgroundColor: 'transparent', // Sem fundo, pois estamos usando apenas o ícone
    padding: 10, // Espaço em torno do ícone
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
  QrButton: {
    backgroundColor: '#11181E',
    padding: 15,
    borderRadius: 10,
  },
  QrText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  focusBox: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -100 }, { translateY: -100 }],
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: '#4E3D8D',
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
});
