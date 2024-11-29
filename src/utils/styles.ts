import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

    container: {
        marginTop: 28,
        flex: 1,
        backgroundColor: '#11181E',
        alignItems: 'center',
        justifyContent: 'center',

    },

    formTitle: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff',
        margin: 10,
    },

    formInput: {
        width: '80%',
        padding: 10,
        marginVertical: 10,
        borderColor: '#fff',
        borderWidth: 1,
        borderRadius: 12,
        color: '#fff',
        fontSize: 20,
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

    subContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '80%',
    },

    subButton: {
        alignItems: 'center',
        padding: 10,
    },

    subTextButton: {
        color: '#fff',
    },

    formImage: {
        width: 250,
        height: 100,
    },

    formInputPassword: {
        width: '100%',
        padding: 10,
        marginVertical: 10,
        borderColor: '#fff',
        borderWidth: 1,
        borderRadius: 12,
        color: '#fff',
        fontSize: 20,
    },

    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '80%',
        borderRadius: 5,
        marginVertical: 10,
        position: 'relative',
    },

    iconContainer: {
        position: 'absolute',
        right: 15, 
        top: '50%',
        transform: [{ translateY: -12 }],
    },

});
