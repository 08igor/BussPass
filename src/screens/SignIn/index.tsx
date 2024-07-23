import { Pressable, Text, TextInput, View, Image, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { styles } from '../../utils/styles';
import { useNavigation } from '@react-navigation/native';
import { propsStack } from '../../routes/types';

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signIn, isLoading } = useAuth();
  const { navigate } = useNavigation<propsStack>();

  const userLogin = () => {
    signIn({ email, password });
  };

  return (
    <View style={styles.container}>
      <Image 
        style={styles.formImage}
        source={require('../../assets/tcc-logo.png')}
      />

      <TextInput 
        style={styles.formInput}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput 
        style={styles.formInput}
        placeholder="Password"
        autoCapitalize="none"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Pressable 
        style={styles.formButton}
        onPress={userLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <Text style={styles.textButton}>Logar</Text>
        )}
      </Pressable>

      <View style={styles.subContainer}>
        <Pressable 
          style={styles.subButton}
          onPress={() => navigate("SignUp")}
        >
          <Text style={styles.subTextButton}>Cadastrar</Text>
        </Pressable>
        <Pressable 
          style={styles.subButton}
          onPress={() => navigate("ReplacePass")}
        >
          <Text style={styles.subTextButton}>Esqueceu a senha</Text>
        </Pressable>
      </View>
    </View>
  );
}
