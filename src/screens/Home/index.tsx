import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Pressable, Image, Alert, RefreshControl, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { propsStack } from '../../routes/types';
import { styles } from './styles';
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { getAuth, User } from 'firebase/auth';
import { db } from 'src/utils/firebase';
import { UserProfile } from 'src/models/UserProfile';
import { asyncGetUserProfile, asyncSetUserProfile } from 'src/utils/storage/UserStorage';

interface Transaction {
  id: string;
  name: string;
  amount: string;
  date: string;
  icon: 'movie' | 'credit-card' | 'paypal' | 'attach-money' | 'error';
  type: 'entrada' | 'saida';
}

export default function Home() {
  const { navigate } = useNavigation<propsStack>();
  const auth = getAuth();
  const user: User | null = auth.currentUser;

  const [photo, setPhoto] = useState<string | null>(null);
  const [saldo, setSaldo] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [showSaldo, setShowSaldo] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Foto user
  const fetchUserData = useCallback(async () => {
    if (user) {
      const userRef = doc(collection(db, "users"), user.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data() as UserProfile;
        await asyncSetUserProfile(userData);
        const userProfile = await asyncGetUserProfile();
        setPhoto(userProfile?.photo || null);
      }
    }
  }, [user]);

  // SALDO
  const fetchUserCardData = useCallback(() => {
    if (user) {
      const cardRef = doc(collection(db, "cardsDados"), user.uid);
      onSnapshot(cardRef, (cardDoc) => {
        if (cardDoc.exists()) {
          const cardData = cardDoc.data();
          setSaldo(cardData?.saldo ? parseFloat(cardData.saldo) : 0);
        } else {
          setSaldo(0);
        }
      });
    }
  }, [user]);

  // TRANSAÇÃO
  const fetchTransactions = useCallback(() => {
    if (user) {
      const transactionsRef = doc(collection(db, "transactions"), user.uid);
      onSnapshot(transactionsRef, (transactionsDoc) => {
        if (transactionsDoc.exists()) {
          const transactionsData = transactionsDoc.data();
          const userTransactions = transactionsData?.transactions || [];
          setTransactions(userTransactions);
        } else {
          setTransactions([]);
        }
      });
    }
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchUserData(), fetchUserCardData(), fetchTransactions()]);
    setRefreshing(false);
  };

  const toggleSaldoVisibility = () => {
    setShowSaldo((prev) => !prev);
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchUserData(), fetchUserCardData(), fetchTransactions()]);
    };

    fetchData();
  }, [fetchUserData, fetchUserCardData, fetchTransactions]);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Buss Pass</Text>
        <Pressable onPress={() => navigate('Profile')}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.profileImage} />
          ) : (
            <MaterialIcons name="person" size={40} color="gray" />
          )}
        </Pressable>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceText}>Saldo</Text>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceAmount}>
            {showSaldo ? `$ ${saldo !== null ? saldo.toFixed(2) : '0.00'}` : '****'}
          </Text>
          <Pressable onPress={toggleSaldoVisibility}>
            <MaterialIcons
              name={showSaldo ? 'visibility-off' : 'visibility'}
              size={24}
              color="#fff"
              style={styles.saldoIcon}
            />
          </Pressable>
        </View>

        <Text style={styles.cardName}>Cartão</Text>
        <Text style={styles.bankName}>Buss Pass</Text>
      </View>

      <View style={styles.actionRow}>
        <Pressable style={styles.actionButton} onPress={() => navigate('CardDetails')}>
          <MaterialIcons name="qr-code" size={24} color="#fff" />
          <Text style={styles.actionText}>Leitor QR</Text>
        </Pressable>

        <Pressable style={styles.actionButton} onPress={() => navigate('Recarga')}>
          <MaterialIcons name="attach-money" size={24} color="#fff" />
          <Text style={styles.actionText}>Recarga</Text>
        </Pressable>

        <Pressable style={styles.actionButton} onPress={() => navigate('AddCard')}>
          <MaterialIcons name="add-circle" size={24} color="#fff" />
          <Text style={styles.actionText}>Cadastrar Cartão</Text>
        </Pressable>
      </View>

      <View style={styles.transactionContainer}>
        <View style={styles.transactionHeader}>
          <Text style={styles.sectionTitle}>Última transação</Text>
          <Pressable style={styles.viewStatementButtonContainer} onPress={() => navigate('Extrato')}>
            <Text style={styles.viewStatementButton}>Ver Extrato</Text>
          </Pressable>
        </View>

        {transactions.length > 0 ? (
          transactions.slice(0, 4).map((item) => (
            <View key={item.id} style={styles.transactionItem}>
              <View style={styles.transactionInfo}>
                <MaterialIcons name={item.icon} size={24} color="#fff" />
                <Text style={styles.transactionName}>{item.name}</Text>
              </View>
              <View style={styles.transactionDetails}>
                <Text
                  style={[
                    styles.transactionAmount,
                    { color: item.type === 'saida' ? 'red' : 'green' }, // Condição para a cor
                  ]}
                >
                  {item.amount}
                </Text>
                <Text style={styles.transactionDate}>{item.date}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noTransactionsText}>Nenhuma transação disponível</Text>
        )}
      </View>
    </ScrollView>
  );
}
