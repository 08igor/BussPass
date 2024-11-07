import React, { useEffect, useState } from 'react';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { propsStack } from '../../../routes/types';
import { styles } from './styles';
import { getAuth, User } from 'firebase/auth';
import { collection, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from 'src/utils/firebase';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';

NfcManager.start();

const UID_TAG = "a3d2859a"; // Defina o UID da tag NFC que será utilizado

interface CardDetailsType {
  cardName: string;
  bankName: string;
  cardNumber: string;
  status: string;
  validPeriod: string;
  balance: number;
}

export default function CardDetails() {
  const { navigate } = useNavigation<propsStack>();
  const [cardDetails, setCardDetails] = useState<CardDetailsType>({
    cardName: '',
    bankName: 'BussPass',
    cardNumber: '',
    status: 'Active',
    validPeriod: '',
    balance: 0,
  });

  const auth = getAuth();
  const user: User | null = auth.currentUser;
  const handleNfc = async () => {
    try {
      await NfcManager.start();
      await NfcManager.requestTechnology(NfcTech.Ndef);
  
      const tag = await NfcManager.getTag();
      
      // Verifique se a tag foi lida corretamente
      if (!tag || !tag.id) {
        Alert.alert("Erro", "Tag não encontrada ou inválida.");
        return;
      }
  
      const cardUID = tag.id;
  
      // Aqui você pode verificar se o UID corresponde ao UID do usuário
      if (cardUID === UID_TAG) {
        if (cardDetails.balance >= 4.60) {
          const newBalance = cardDetails.balance - 4.60;
          const cardRef = doc(collection(db, "cardsDados"), user.uid);
  
          await updateDoc(cardRef, { balance: newBalance });
          setCardDetails(prevDetails => ({
            ...prevDetails,
            balance: newBalance,
          }));
  
          Alert.alert("Sucesso", "Pagamento realizado com sucesso.");
        } else {
          Alert.alert("Erro", "Saldo insuficiente.");
        }
      } else {
        Alert.alert("Erro", "Tag NFC não reconhecida.");
      }
    } catch (error) {
      console.error("Erro ao ler a tag NFC:", error);
      Alert.alert("Erro", error.message || "Falha na leitura do NFC.");
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  };

  const fetchCardDetails = async () => {
    if (user) {
      try {
        const cardRef = doc(collection(db, "cardsDados"), user.uid);
        const docSnap = await getDoc(cardRef);
  
        if (docSnap.exists()) {
          const data = docSnap.data();
  
          // Verifique se os dados não são nulos ou indefinidos
          if (!data) {
            Alert.alert("Erro", "Nenhum dado encontrado para este cartão.");
            return;
          }
  
          // Acesso seguro aos dados
          setCardDetails({
            cardName: data.nameCard || '', // Agora sem o operador de encadeamento opcional
            bankName: 'BussPass',
            cardNumber: data.numberCard ? `**** ${data.numberCard.slice(-4)}` : '',
            status: data.status || 'Active',
            validPeriod: data.validCard || '',
            balance: data.balance || 0,
          });
        } else {
          Alert.alert("Erro", "Nenhum cartão encontrado.");
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes do cartão:", error);
        Alert.alert("Erro", "Não foi possível buscar os detalhes do cartão.");
      }
    }
  };
  
  
  
  // O resto do seu código do React Native permanece o mesmo


  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigate("Home")}>
        <FontAwesome name="arrow-left" size={24} color="#4E3D8D" />
      </TouchableOpacity>

      <Text style={styles.title}>Cartão</Text>

      <View style={styles.card}>
        <Text style={styles.cardText}>{"BussPass"}</Text>
      </View>

      <View style={styles.cardDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Nome</Text>
          <Text style={styles.detailValue}>{cardDetails.cardName}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Número do Cartão</Text>
          <Text style={styles.detailValue}>{cardDetails.cardNumber}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Validade do cartão</Text>
          <Text style={styles.detailValue}>{cardDetails.validPeriod}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.actionButton} onPress={handleNfc}>
        <Text style={styles.actionButtonText}>Aproximar Cartão</Text>
      </TouchableOpacity>

    </View>
  );
}
