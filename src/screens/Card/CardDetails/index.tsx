import React, { useEffect, useState } from 'react';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { propsStack } from '../../../routes/types';
import { styles } from './styles';
import { getAuth, User } from 'firebase/auth';
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from 'src/utils/firebase';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';

// Inicializa o gerenciador NFC
NfcManager.start();

interface CardDetailsType {
  cardName: string;
  bankName: string;
  cardNumber: string;
  status: string;
  validPeriod: string;
  balance: number;
  uid: string | null;
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
    uid: null,
  });

  const auth = getAuth();
  const user: User | null = auth.currentUser;

  // Carrega os detalhes do cartão na montagem do componente
  useEffect(() => {
    fetchCardDetails();
  }, []);

  const handleNfc = async () => {
    try {
      // Valida se o usuário está autenticado
      if (!user || !user.uid) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }

      // Inicia o NFC e solicita a tecnologia
      await NfcManager.start();
      await NfcManager.requestTechnology(NfcTech.Ndef);

      const tag = await NfcManager.getTag();

      // Valida se a tag foi lida corretamente
      if (!tag || !tag.id) {
        Alert.alert("Erro", "Tag NFC não encontrada ou inválida.");
        return;
      }

      const cardUID = tag.id;

      // Valida se o UID do cartão está disponível
      if (!cardDetails.uid) {
        Alert.alert("Erro", "UID do cartão não disponível.");
        return;
      }

      // Verifica se o UID da tag corresponde ao do cartão
      if (cardDetails.uid === cardUID) {
        if (cardDetails.balance >= 4.60) {
          const newBalance = cardDetails.balance - 4.60;
          const cardRef = doc(collection(db, "cardsDados"), user.uid);

          // Atualiza o saldo no Firestore
          await updateDoc(cardRef, { balance: newBalance });
          setCardDetails((prevDetails) => ({
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
    } catch (error: any) {
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

          if (!data) {
            Alert.alert("Erro", "Nenhum dado encontrado para este cartão.");
            return;
          }

          // Define os detalhes do cartão no estado
          setCardDetails({
            cardName: data.nameCard || '',
            bankName: 'BussPass',
            cardNumber: data.numberCard ? `**** ${data.numberCard.slice(-4)}` : '',
            status: data.status || 'Active',
            validPeriod: data.validCard || '',
            balance: data.balance || 0,
            uid: data.uid || null, // Busca o UID do cartão
          });
        } else {
          Alert.alert("Erro", "Nenhum cartão encontrado.");
        }
      } catch (error: any) {
        console.error("Erro ao buscar detalhes do cartão:", error);
        Alert.alert("Erro", "Não foi possível buscar os detalhes do cartão.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigate("Home")}>
        <FontAwesome name="arrow-left" size={24} color="#4E3D8D" />
      </TouchableOpacity>

      <Text style={styles.title}>Cartão</Text>

      <View style={styles.card}>
        <Text style={styles.cardText}>{cardDetails.bankName}</Text>
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
