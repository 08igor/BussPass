import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  header: {
    alignSelf: 'flex-start',
    marginBottom: 24,
  },

  container: {
    marginTop: 28,
    flex: 1,
    padding: 25,
    backgroundColor: '#11181E',
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: -20,
    textAlign: 'center',
    color: 'white',
    marginTop: 55,
  },
  formInput: {
    height: 48,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    color: '#fff',
    marginBottom: 12,
  },

  buttonVoltar: {
    marginTop: 30,

  },

  formButton: {
    backgroundColor: '#4e2780',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  logoutButton: {
    backgroundColor: '#4E3D8D',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  textButton: {
    color: 'fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollViewContent: {
    paddingBottom: 16,
  },
});
