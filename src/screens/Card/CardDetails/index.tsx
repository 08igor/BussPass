import React, { useEffect, useState } from 'react';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { propsStack } from '../../../routes/types';
import { styles } from './styles';
import { getAuth, User } from 'firebase/auth';
import { collection, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from 'src/utils/firebase';

// Inicia o NFC Manager
NfcManager.start();

interface CardDetailsType {
  cardName: string;
  bankName: string;
  cardNumber: string;
  status: string;
  validPeriod: string;
  balance: number; // Mantenha o balance aqui
}

export default function CardDetails() {
  const { navigate } = useNavigation<propsStack>();
  
  // Estado inicial para os detalhes do cartão
  const [cardDetails, setCardDetails] = useState<CardDetailsType>({
    cardName: '',
    bankName: 'BussPass',
    cardNumber: '',
    status: 'Active',
    validPeriod: '',
    balance: 0, // Mantenha o balance no estado
  });

  const [nfcErrorDisplayed, setNfcErrorDisplayed] = useState<boolean>(false); // Estado para controlar a exibição do alerta de erro NFC

  const auth = getAuth();
  const user: User | null = auth.currentUser;

  useEffect(() => {
    const fetchCardDetails = async () => {
      if (user) {
        try {
          const cardRef = doc(collection(db, "cardsDados"), user.uid);
          const docSnap = await getDoc(cardRef);

          if (docSnap.exists()) {
            const data = docSnap.data();

            // Verifica se os dados não são nulos ou indefinidos
            setCardDetails({
              cardName: data?.nameCard || '',
              bankName: 'BussPass',
              cardNumber: data?.numberCard ? `**** ${data.numberCard.slice(-4)}` : '',
              status: data?.status || 'Active',
              validPeriod: data?.validCard || '',
              balance: data?.balance || 0, // Mantenha a atribuição do balance
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

    fetchCardDetails();

    const handleNfc = async () => {
      try {
        // Solicita a tecnologia NFC e aguarda até que o usuário aproxime o cartão
        const tech = await NfcManager.requestTechnology(NfcTech.Ndef);
        
        if (!tech) {
          Alert.alert("Erro", "Falha ao iniciar a tecnologia NFC.");
          return;
        }

        const tag = await NfcManager.getTag();

        if (!tag) {
          if (!nfcErrorDisplayed) {
            setNfcErrorDisplayed(true);
            Alert.alert("Erro", "Tag NFC não lida corretamente.");
          }
          return;
        }

        // Realiza o pagamento apenas se houver um cartão com saldo suficiente
        if (cardDetails && cardDetails.balance >= 4.60) {
          const newBalance = cardDetails.balance - 4.60;
          const cardRef = doc(collection(db, "cardsDados"), user?.uid);

          // Verifica se o user e cardRef são válidos
          if (user && cardRef) {
            await updateDoc(cardRef, { balance: newBalance });

            setCardDetails(prevDetails => ({
              ...prevDetails,
              balance: newBalance, // Atualiza o saldo no estado
            }));

            Alert.alert("Sucesso", "Pagamento realizado com sucesso.");
          }
        } else {
          Alert.alert("Erro", "Saldo insuficiente ou cartão não cadastrado.");
        }
      } catch (ex) {
        if (!nfcErrorDisplayed) {
          setNfcErrorDisplayed(true);
          Alert.alert("Erro", "Falha na leitura do NFC.");
        }
        console.warn(ex);
      } finally {
        NfcManager.cancelTechnologyRequest();
      }
    };

    handleNfc(); // Executa a função NFC assim que o componente é montado

    return () => {
      NfcManager.cancelTechnologyRequest(); // Cancela a solicitação NFC ao desmontar o componente
    };
  }, [cardDetails, user, nfcErrorDisplayed]);

  // Função para deletar o cartão
  const deleteCard = async () => {
    if (user) {
      try {
        const cardRef = doc(collection(db, "cardsDados"), user.uid);
        await deleteDoc(cardRef);
        Alert.alert("Sucesso", "Cartão deletado com sucesso.");
        
        // Limpa os detalhes do cartão da tela
        setCardDetails({
          cardName: '',
          bankName: 'BussPass',
          cardNumber: '',
          status: '',
          validPeriod: '',
          balance: 0, // Limpa o saldo ao deletar
        });

        // Redireciona para a tela inicial ou outra tela desejada
        navigate("Home");
      } catch (error) {
        Alert.alert("Erro", "Erro ao deletar o cartão.");
        console.error(error);
      }
    }
  };

  // Função para exibir o alerta de confirmação
  const confirmDelete = () => {
    Alert.alert(
      "Deseja excluir o seu cartão?",
      "Esta ação não pode ser desfeita.",
      [
        { text: "Não", style: "cancel" },
        { text: "Sim", onPress: deleteCard }
      ]
    );
  };

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

      {/* Botão de deletar */}
      <TouchableOpacity style={styles.deleteButton} onPress={confirmDelete}>
        <Text style={styles.deleteButtonText}>Delete Card</Text>
      </TouchableOpacity>
    </View>
  );
}
