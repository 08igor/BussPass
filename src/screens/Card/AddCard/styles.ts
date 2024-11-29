import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

  container: {
    marginTop: 28,
    padding: 35,
    flex: 1,
    backgroundColor: '#11181E',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  formInput: {
    width: '80%',
    padding: 10,
    marginVertical: 10,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 12,
    color: '#fff',
    fontSize: 16, 
  },

  formButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    margin: 10,
    width: '80%',
  },

  textButton: {
    color: '#11181E',
    fontSize: 20,
    fontWeight: 'bold',
  },

  header: {
    alignSelf: 'flex-start',
    marginBottom: 24,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 24,
  },
  card: {
    width: 240,
    height: 160,
    borderRadius: 20,
    backgroundColor: '#4E3D8D',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  cardIcon: {
    marginBottom: 16,
  },
  iconPlaceholder: {
    width: 40,
    height: 40,
    backgroundColor: '#4E3D8D',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  cardLabel: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  description: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginHorizontal: 16,
  },
});

