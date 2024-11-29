import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
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
    const [expiryMonthYear, setExpiryMonthYear] = useState<string>(''); // Alterado para mês e ano
    const [loading, setLoading] = useState<boolean>(false);
    const [userDataExists, setUserDataExists] = useState<boolean>(false);

    const auth = getAuth();
    const user: User | null = auth.currentUser;

    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                const userRef = doc(collection(db, "users"), user.uid); // Coleção de usuários
                const cardRef = doc(collection(db, "cardsDados"), user.uid); // Coleção de cartões
    
                try {
                    const userDocSnap = await getDoc(userRef);
    
                    if (userDocSnap.exists()) {
                        setUserDataExists(true); // Dados do usuário encontrados
    
                        const cardDocSnap = await getDoc(cardRef);
                        if (cardDocSnap.exists()) {
                            const cardData = cardDocSnap.data();
                            setCardName(cardData.nameCard || '');
                            setCardNumber(cardData.numberCard || '');
                            setExpiryMonthYear(cardData.validCard || ''); // Ajustado para mês e ano
                            console.log("Cartão existente carregado:", cardData);
                        } else {
                            console.log("Nenhum cartão encontrado para o usuário.");
                        }
                    } else {
                        console.log("Dados do usuário não encontrados.");
                        Alert.alert(
                            "Cadastro de Cartão",
                            "Você precisa cadastrar seus dados primeiro. Deseja cadastrar seus dados?",
                            [
                                {
                                    text: "Fechar",
                                    style: "cancel",
                                },
                                {
                                    text: "Cadastrar Dados",
                                    onPress: () => navigate("Profile"), // Navega para a tela de cadastro de dados
                                },
                            ]
                        );
                    }
                } catch (error) {
                    console.error("Erro ao verificar dados do usuário: ", error);
                }
            } else {
                console.log("Usuário não autenticado.");
            }
        };
    
        fetchUserData();
    }, [user, navigate]);

    const handleSaveCard = async () => {
        try {
            setLoading(true);

            if (!cardName || !cardNumber || !expiryMonthYear) {
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
                        validCard: expiryMonthYear, // Salva o mês e ano
                    },
                    { merge: true }
                );

                Alert.alert("Sucesso", "Cartão adicionado com sucesso");
                setCardName('');
                setCardNumber('');
                setExpiryMonthYear('');
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

    const handleExpiryMonthYearChange = (text: string) => {
        // Remove caracteres não numéricos
        let numericText = text.replace(/[^0-9]/g, '');

        // Garante que o mês sempre tenha 2 dígitos
        if (numericText.length > 2) {
            numericText = numericText.slice(0, 2) + '/' + numericText.slice(2, 6); // Adiciona a barra e limita o ano a 4 dígitos
        }

        // Se a barra for inserida antes de 2 dígitos de mês, a barra não aparece
        if (numericText.length <= 2) {
            setExpiryMonthYear(numericText); // Exibe apenas o mês
        } else {
            setExpiryMonthYear(numericText); // Exibe a validade formatada MM/AAAA
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

            {userDataExists ? (
                <>
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
                        placeholder="Validade (MM/AAAA)"
                        placeholderTextColor={"white"}
                        value={expiryMonthYear}
                        onChangeText={handleExpiryMonthYearChange}
                        keyboardType="numeric"
                        maxLength={7} // Formato MM/AAAA
                    />

                    <Pressable style={styles.formButton} onPress={handleSaveCard} disabled={loading}>
                        <Text style={styles.textButton}>
                            {loading ? "Salvando..." : "Cadastrar Cartão"}
                        </Text>
                    </Pressable>

                    <Text style={styles.description}>
                        Preencha os campos acima para adicionar os dados do cartão.
                    </Text>
                </>
            ) : (
                <Text style={styles.description}>Para cadastrar um cartão, primeiro cadastre seus dados pessoais.</Text>
            )}
        </View>
    );
}
