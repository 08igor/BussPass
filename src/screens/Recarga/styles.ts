import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({


container: {
  marginTop: 28,
    flex: 1,
    backgroundColor: '#11181E',
    alignItems: 'center',
    padding: 35,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  amount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4E3D8D',
    marginBottom: 20,
  },
  bankSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 30,
    width: '100%',
    justifyContent: 'space-between',
  },
  bankText: {
    fontSize: 18,
    color: '#4E3D8D',
  },
  numPad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 30,
  },
  numButton: {
    width: '30%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: '#FFF',
    elevation: 1,
  },
  numText: {
    fontSize: 24,
    color: '#4E3D8D',
    fontWeight: 'bold',
  },
  transferButton: {
    backgroundColor: '#4E3D8D',
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 10,
    marginTop: -60,
  },
  transferButtonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },

  qrContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
},

qrCodePlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
},
qrButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
},
qrButton: {
  marginTop: 22,
    padding: 10,
    backgroundColor: '#4E3D8D',
    borderRadius: 5,
},
qrButtonText: {
    color: '#fff',
    fontWeight: 'bold',
},
successMessageContainer: {
    alignItems: 'center',
    marginTop: 20,
},
successImage: {
    width: 100,
    height: 100,
},
successMessageText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4E3D8D',
    fontWeight: 'bold',
},
});
