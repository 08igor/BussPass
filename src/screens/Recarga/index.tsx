import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Alert, Clipboard } from 'react-native';
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
    const [showModal, setShowModal] = useState<boolean>(false);
    const [qrCodeValue, setQrCodeValue] = useState<string>(''); // Valor do código gerado
    const [remainingTime, setRemainingTime] = useState<number>(60);

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

    useEffect(() => {
        let timer: NodeJS.Timeout;
    
        if (showModal) {
            if (remainingTime > 0) {
                timer = setInterval(() => {
                    setRemainingTime((prevTime) => prevTime - 1);
                }, 1000);
            } else {
                // Quando o tempo chega a 0
                clearInterval(timer); // Limpa o intervalo
                Alert.alert(
                    "Tempo Expirado",
                    "O tempo para pagamento expirou. Por favor, tente novamente.",
                    [
                        {
                            text: "OK",
                            onPress: () => {
                                setShowModal(false); // Fecha o modal
                                setSaldo(''); // Limpa o saldo
                                setRemainingTime(60); // Reseta o tempo para 1 minuto
                            }
                        }
                    ]
                );
            }
        }
    
        return () => clearInterval(timer); // Limpa o timer ao desmontar ou mudar o estado
    }, [showModal, remainingTime]);
    
    

    const handlePress = (value: string) => {
        setSaldo((prev) => prev + value);
    };

    const handleDelete = () => {
        setSaldo((prev) => prev.slice(0, -1));
    };

    const generateQrCodeValue = () => {
        // Gera um código aleatório para o QR
        const randomCode = Math.random().toString(36).substring(2, 12).toUpperCase();
        return `PIX-${randomCode}-VALOR:${saldo}`;
    };

    const handleSaveSaldo = async () => {
        const cleanedSaldo = saldo.replace(/^0+/, ''); // Remove zeros à esquerda
        const numericSaldo = parseFloat(cleanedSaldo); // Converte o valor para número

        if (isNaN(numericSaldo) || numericSaldo <= 0) {
            Alert.alert("Erro", "Preencha um saldo válido.");
            return;
        }

        if (numericSaldo > 100) {
            Alert.alert("Erro", "O valor máximo por recarga é R$100.");
            return;
        }

        if (user) {
            const userRef = doc(collection(db, "dailyLimits"), user.uid); // Referência ao limite diário
            const today = new Date().toISOString().split('T')[0]; // Obtém a data atual (yyyy-mm-dd)

            try {
                const dailyLimitDoc = await getDoc(userRef);

                let dailyRecarga = 0;
                if (dailyLimitDoc.exists()) {
                    const data = dailyLimitDoc.data();
                    if (data.date === today) {
                        dailyRecarga = data.totalRecarga || 0;
                    }
                }

                const newDailyTotal = dailyRecarga + numericSaldo;

                if (newDailyTotal > 100) {
                    Alert.alert("Erro", "O limite diário de R$100 já foi atingido.");
                    return;
                }

                // Atualiza o limite diário no Firestore
                await setDoc(
                    userRef,
                    {
                        date: today,
                        totalRecarga: newDailyTotal
                    },
                    { merge: true }
                );

                const qrValue = generateQrCodeValue();
                setQrCodeValue(qrValue); // Define o valor do QR gerado
                setShowModal(true);
            } catch (error) {
                Alert.alert("Erro", "Não foi possível verificar o limite diário. Tente novamente.");
            }
        }
    };


    const handleCopyCode = () => {
        Clipboard.setString(qrCodeValue);
        Alert.alert("Sucesso", "Código copiado para a área de transferência!");
    };

    const handlePaymentCompleted = async () => {
        if (user) {
            const userRef = doc(collection(db, "cardsDados"), user.uid);
            const transactionsRef = doc(collection(db, "transactions"), user.uid);
            const newSaldo = currentSaldo + parseFloat(saldo.replace(/^0+/, ''));

            const newTransaction = {
                id: String(new Date().getTime()),
                name: 'Recarga de Saldo',
                amount: `$${parseFloat(saldo).toFixed(2)}`,
                date: new Date().toLocaleDateString(),
                icon: 'attach-money',
            };

            try {
                await setDoc(
                    userRef,
                    { saldo: newSaldo },
                    { merge: true }
                );

                const transactionDoc = await getDoc(transactionsRef);

                if (transactionDoc.exists()) {
                    await setDoc(transactionsRef, {
                        transactions: [newTransaction, ...(transactionDoc.data()?.transactions || [])]
                    }, { merge: true });
                } else {
                    await setDoc(transactionsRef, {
                        transactions: [newTransaction]
                    });
                }

                Alert.alert("Sucesso", "Recarregado com sucesso");

                setSaldo('');
                setShowModal(false);
                setCurrentSaldo(newSaldo);

            } catch (error) {
                Alert.alert("Erro", "Houve um erro ao atualizar o saldo e a transação. Tente novamente mais tarde.");
            }
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigate("Home")}>
                <FontAwesome name="arrow-left" size={24} color="#4E3D8D" />
            </TouchableOpacity>

            <Text style={styles.amount}>{`$${saldo || '0'}`}</Text>

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

            {/* Modal */}
            <Modal visible={showModal} animationType="slide" transparent>
                <View style={styles.qrContainer}>
                    <QRCode value={qrCodeValue} size={180} />
                    <TouchableOpacity style={styles.qrButton} onPress={handleCopyCode}>
                        <Text style={styles.qrButtonText}>Copiar Código</Text>
                    </TouchableOpacity>
                    <Text style={styles.amount}>VALOR: R$ {saldo}</Text>

                    <Text style={{ color: '#fff', marginBottom: 20 }}>
                        TEMPO RESTANTE: {Math.floor(remainingTime / 60)}:{(remainingTime % 60).toString().padStart(2, '0')}
                    </Text>

                    <View style={styles.qrButtons}>
                        <TouchableOpacity style={styles.qrButton} onPress={handlePaymentCompleted}>
                            <Text style={styles.qrButtonText}>Pago</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.qrButton}
                            onPress={() => {
                                setShowModal(false);
                                setSaldo('');
                                setRemainingTime(60 * 60); // Reseta o tempo para 1 hora
                            }}
                        >
                            <Text style={styles.qrButtonText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
