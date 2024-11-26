import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { getAuth } from 'firebase/auth';
import { db } from 'src/utils/firebase';
import { collection, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { propsStack } from 'src/routes/types';
import { styles } from './styles';

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
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanning, setScanning] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    fetchCardDetails();

    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const fetchCardDetails = async () => {
    if (user) {
      const cardRef = doc(collection(db, 'cardsDados'), user.uid);
      const userDoc = await getDoc(cardRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        setCardDetails({
          cardName: data.nameCard || '',
          bankName: 'BussPass',
          cardNumber: data.numberCard ? `**** ${data.numberCard.slice(-4)}` : '',
          status: data.status || 'Active',
          validPeriod: data.validCard || '',
          balance: data.saldo || 0,
        });
      }
    }
  };

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    setScanning(false);

    if (cardDetails.balance >= 4.6) {
      const newBalance = cardDetails.balance - 4.6;

      if (user) {
        const cardRef = doc(collection(db, 'cardsDados'), user.uid);
        const transactionsRef = doc(collection(db, 'transactions'), user.uid);

        const newTransaction = {
          id: String(new Date().getTime()), // ID único baseado no timestamp
          qrCode: data, // Número do QR Code
          amount: '-4.60', // Valor da transação (com sinal negativo)
          date: new Date().toLocaleDateString(), // Data da transação
          name: `Compra na Linha ${data}`, // Nome da transação
          type: 'saida', // Tipo de transação (saida para valores negativos)
        };

        try {
          // Atualiza o saldo no banco
          await setDoc(cardRef, { saldo: newBalance }, { merge: true });

          // Salva a transação no banco
          const transactionsDoc = await getDoc(transactionsRef);
          const existingTransactions = transactionsDoc.exists()
            ? transactionsDoc.data()?.transactions || []
            : [];

          await setDoc(
            transactionsRef,
            { transactions: [newTransaction, ...existingTransactions] },
            { merge: true }
          );

          Alert.alert(
            'Transação realizada!',
            `Linha: ${data}\nDebitado: R$ 4,60`
          );
          setCardDetails((prev) => ({ ...prev, balance: newBalance }));
        } catch (error) {
          Alert.alert(
            'Erro',
            'Não foi possível registrar a transação. Tente novamente mais tarde.'
          );
        }
      }
    } else {
      Alert.alert('Saldo insuficiente', 'Não foi possível realizar a transação.');
    }
  };

  const handleDeleteCard = async () => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir os dados deste cartão?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            if (user) {
              try {
                const cardRef = doc(collection(db, 'cardsDados'), user.uid);
                await deleteDoc(cardRef);
                Alert.alert('Sucesso', 'Cartão excluído com sucesso');
                setCardDetails({
                  cardName: '',
                  bankName: 'BussPass',
                  cardNumber: '',
                  status: 'Active',
                  validPeriod: '',
                  balance: 0,
                });
                navigate('Home'); // Redireciona para a página Home
              } catch (error) {
                Alert.alert('Erro', 'Não foi possível excluir os dados do cartão.');
              }
            }
          },
        },
      ]
    );
  };

  const handleQrCodePress = () => {
    // Verifica se o cartão está cadastrado antes de permitir ler o QR Code
    if (cardDetails.cardName && cardDetails.cardNumber) {
      setScanning(true);
    } else {
      Alert.alert('Cartão não cadastrado', 'Para ler um QR Code, é necessário ter um cartão cadastrado.');
    }
  };

  if (hasPermission === null) {
    return <Text>Solicitando permissão para usar a câmera...</Text>;
  }

  if (hasPermission === false) {
    return <Text>Permissão para usar a câmera foi negada.</Text>;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigate('Home')}>
        <FontAwesome name="arrow-left" size={24} color="#4E3D8D" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteCard}>
        <FontAwesome name="trash" size={24} color="red" />
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

      {/* Adicionando a verificação antes de permitir ler o QR Code */}
      {!scanning && (
        <TouchableOpacity
          style={[styles.QrButton, { backgroundColor: '#4E3D8D' }]}
          onPress={handleQrCodePress} 
        >
          <Text style={styles.QrText}>Ler QR Code</Text>
        </TouchableOpacity>
      )}

      {scanning && (
        <View style={StyleSheet.absoluteFillObject}>
          <BarCodeScanner
            onBarCodeScanned={handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.focusBox} />
        </View>
      )}
    </View>
  );
}
