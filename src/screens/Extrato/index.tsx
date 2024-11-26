import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { propsStack } from '../../routes/types';
import { styles } from './styles';
import { collection, doc, getDoc } from 'firebase/firestore';
import { getAuth, User } from 'firebase/auth';
import { db } from 'src/utils/firebase';

interface Transaction {
  id: string;
  name: string;
  amount: string;
  date: string;
  icon: 'movie' | 'credit-card' | 'paypal' | 'attach-money' | 'error';
}

export default function Extrato() {
  const { navigate } = useNavigation<propsStack>();
  const auth = getAuth();
  const user: User | null = auth.currentUser;

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const fetchTransactions = useCallback(async () => {
    try {
      if (user) {
        const transactionsRef = doc(collection(db, "transactions"), user.uid);
        const transactionsDoc = await getDoc(transactionsRef);

        if (transactionsDoc.exists()) {
          const transactionsData = transactionsDoc.data();
          const userTransactions = transactionsData?.transactions || [];
          setTransactions(userTransactions);
        } else {
          setTransactions([]);
        }
      }
    } catch (error) {
      Alert.alert("Erro", "Houve um erro ao carregar o extrato de transações.");
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user, fetchTransactions]);

  const getValidIconName = (iconName: string): Transaction['icon'] => {
    const availableIcons: Transaction['icon'][] = [
      'movie',
      'credit-card',
      'paypal',
      'attach-money'
    ];
    return availableIcons.includes(iconName as Transaction['icon'])
      ? (iconName as Transaction['icon'])
      : 'error'; // Retorna 'error' se o ícone não for válido
  };

  const getAmountColor = (amount: string) => {
    return parseFloat(amount.replace(',', '.')) < 0 ? styles.negativeAmount : styles.positiveAmount;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigate("Home")}>
          <FontAwesome name="arrow-left" size={24} color="#4E3D8D" />
        </TouchableOpacity>
        <Text style={styles.title}>Extrato</Text>
        <MaterialIcons name="receipt" size={30} color="#fff" />
      </View>

      <ScrollView style={styles.transactionContainer}>
        <Text style={styles.sectionTitle}>Histórico de Transações</Text>

        {transactions.length > 0 ? (
          transactions.map((item) => (
            <View key={item.id} style={styles.transactionItem}>
              <View style={styles.transactionInfo}>
                {/* Verifica se o ícone é válido antes de renderizar */}
                <MaterialIcons name={getValidIconName(item.icon)} size={24} color="#fff" />
                <Text style={styles.transactionName}>{item.name}</Text>
              </View>
              <View style={styles.transactionDetails}>
                <Text style={[styles.transactionAmount, getAmountColor(item.amount)]}>
                  {item.amount}
                </Text>
                <Text style={styles.transactionDate}>{item.date}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noTransactionsText}>Nenhuma transação disponível</Text>
        )}
      </ScrollView>
    </View>
  );
}
