import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { propsStack } from 'src/routes/types';
import { styles } from './styles';
import { getAuth, User } from 'firebase/auth';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from 'src/utils/firebase';

export default function AddCard() {
    const { navigate } = useNavigation<propsStack>();
    const [cardName, setCardName] = useState<string>('');
    const [cardNumber, setCardNumber] = useState<string>('');
    const [expiryYear, setExpiryYear] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const auth = getAuth();
    const user: User | null = auth.currentUser;

    // Fetch card data on component mount
    useEffect(() => {
        const fetchCardData = async () => {
            if (user) {
                try {
                    const cardRef = doc(collection(db, "cardsDados"), user.uid);
                    const cardSnap = await getDoc(cardRef);

                    if (cardSnap.exists()) {
                        const cardData = cardSnap.data();
                        setCardName(cardData.nameCard || '');
                        setCardNumber(cardData.numberCard || '');
                        setExpiryYear(cardData.validCard || '');
                    }
                } catch (error) {
                    console.error("Error fetching card data: ", error);
                }
            }
        };

        fetchCardData();
    }, [user]);

    const handleSaveCard = async () => {
        try {
            setLoading(true);

            if (!cardName || !cardNumber || !expiryYear) {
                Alert.alert("Erro", "Preencha todos os campos.");
                setLoading(false);
                return;
            }

            if (user) {
                const cardRef = doc(collection(db, "cardsDados"), user.uid);
                
                await setDoc(
                    cardRef,
                    {
                        nameCard: cardName,
                        numberCard: cardNumber,
                        validCard: expiryYear
                    },
                    { merge: true }
                );

                Alert.alert("Sucesso", "Cartão adicionado com sucesso");
                setCardName('');
                setCardNumber('');
                setExpiryYear('');
            }
        } catch (error) {
            Alert.alert(
                "Erro",
                "Houve um erro ao salvar os dados do cartão. Tente novamente mais tarde."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleExpiryYearChange = (text: string) => {
        const numericText = text.replace(/[^0-9]/g, '').slice(0, 8);

        if (numericText.length === 8) {
            setExpiryYear(`${numericText.slice(0, 4)}-${numericText.slice(4, 8)}`);
        } else {
            setExpiryYear(numericText);
        }
    };

    

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => navigate("Home")}>
                    <FontAwesome name="arrow-left" size={24} color="#4E3D8D" />
                </Pressable>
            </View>

            <Text style={styles.title}>Cadastrar Cartão</Text>

            <TextInput
                style={styles.formInput}
                placeholder="Nome do Cartão"
                placeholderTextColor={"white"}
                value={cardName}
                onChangeText={setCardName}
            />

            <TextInput
                style={styles.formInput}
                placeholder="Número do Cartão"
                placeholderTextColor={"white"}
                value={cardNumber}
                onChangeText={(text) => setCardNumber(text.replace(/[^0-9]/g, '').slice(0, 8))}
                keyboardType="numeric"
            />

            <TextInput
                style={styles.formInput}
                placeholder="Ano de Validade (Ex: 2024-2030)"
                placeholderTextColor={"white"}
                value={expiryYear}
                onChangeText={handleExpiryYearChange}
                keyboardType="numeric"
                maxLength={9}
            />

            <Pressable style={styles.formButton} onPress={handleSaveCard} disabled={loading}>
                <Text style={styles.textButton}>{loading ? "Salvando..." : "Cadastar Cartão"}</Text>
            </Pressable>

            <Text style={styles.description}>Preencha os campos acima para adicionar os dados do cartão.</Text>
        </View>
    );
}
