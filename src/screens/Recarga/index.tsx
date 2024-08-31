import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Pressable, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { propsStack } from '../../routes/types';
import { styles } from './styles';
import { User, getAuth } from 'firebase/auth';
import { db } from 'src/utils/firebase';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import QRCode from 'react-native-qrcode-svg';

export default function Recarga() {
    const { navigate } = useNavigation<propsStack>();
    const [saldo, setSaldo] = useState<string>('');
    const [currentSaldo, setCurrentSaldo] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [showQRCode, setShowQRCode] = useState<boolean>(false);

    const auth = getAuth();
    const user: User | null = auth.currentUser;

    useEffect(() => {
        const fetchSaldo = async () => {
            if (user) {
                const userRef = doc(collection(db, "cardsDados"), user.uid);
                const docSnap = await getDoc(userRef);
                if (docSnap.exists()) {
                    setCurrentSaldo(docSnap.data().saldo || 0);
                }
            }
        };
        fetchSaldo();
    }, [user]);

    const handlePress = (value: string) => {
        setSaldo(prev => prev + value);
    };

    const handleDelete = () => {
        setSaldo(prev => prev.slice(0, -1));
    };

    const handleSaveSaldo = async () => {
        try {
            setLoading(true);

            const cleanedSaldo = saldo.replace(/^0+/, '');
            const numericSaldo = parseFloat(cleanedSaldo);

            if (isNaN(numericSaldo) || numericSaldo <= 0) {
                Alert.alert("Erro", "Preencha um saldo válido.");
                setLoading(false);
                return;
            }

            setShowQRCode(true);
        } catch (error) {
            Alert.alert(
                "Erro",
                "Houve um erro ao salvar os dados. Tente novamente mais tarde."
            );
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentCompleted = async () => {
        if (user) {
            const userRef = doc(collection(db, "cardsDados"), user.uid);
            const newSaldo = currentSaldo + parseFloat(saldo.replace(/^0+/, ''));

            try {
                await setDoc(
                    userRef,
                    { saldo: newSaldo },
                    { merge: true }
                );

                Alert.alert("Sucesso", "Recarregado com sucesso");

                setSaldo('');
                setShowQRCode(false);
            } catch (error) {
                Alert.alert("Erro", "Houve um erro ao atualizar o saldo. Tente novamente mais tarde.");
            }
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigate("Home")}>
                <FontAwesome name="arrow-left" size={24} color="#4E3D8D" />
            </TouchableOpacity>

            <Text style={styles.amount}>{`$${saldo || '0'}`}</Text>

            <Pressable style={styles.bankSelector}>
                <Text style={styles.bankText}>BussPass</Text>
                <FontAwesome name="chevron-down" size={16} color="#999" />
            </Pressable>

            <View style={styles.numPad}>
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '00', '0'].map((num, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.numButton}
                        onPress={() => handlePress(num)}
                    >
                        <Text style={styles.numText}>{num}</Text>
                    </TouchableOpacity>
                ))}
                <TouchableOpacity style={styles.numButton} onPress={handleDelete}>
                    <FontAwesome name="trash" size={24} color="#4E3D8D" />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.transferButton} onPress={handleSaveSaldo}>
                <Text style={styles.transferButtonText}>Recarregar</Text>
            </TouchableOpacity>

            {showQRCode && (
                <View style={styles.qrContainer}>
                    <QRCode
                        value={`Valor: ${saldo}`}
                        size={200}
                    />
                    <View style={styles.qrButtons}>
                        <TouchableOpacity style={styles.qrButton} onPress={handlePaymentCompleted}>
                            <Text style={styles.qrButtonText}>Pago</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}
