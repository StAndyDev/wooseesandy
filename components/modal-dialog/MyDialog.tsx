
import { Ionicons } from "@expo/vector-icons";
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import globalStyles from '../../app/styles';

type Props = {
    dialogType: 'confirm' | 'info';
    title: string
    onConfirm: () => void
    onCancel?: () => void
    onBackButtonPress: () => void
    onBackdropPress: () => void
    show: boolean
}

const MyDialog = ({dialogType, title, onConfirm, onCancel, onBackButtonPress, onBackdropPress, show = false }: Props) => {

    return (
        <Modal
            isVisible={show}
            animationIn="bounceIn"
            animationOut="bounceOut"
            animationInTiming={700}     // Durée de l'animation d'entrée en ms
            animationOutTiming={1200}    // Durée de l'animation de sortie en ms
            swipeDirection="down"
            backdropOpacity={0.5}
            onBackButtonPress={onBackButtonPress}
            onBackdropPress={onBackdropPress}
            style={{
                justifyContent: 'center', // ← ça centre verticalement
                alignItems: 'center',     // ← ça centre horizontalement
                margin: 0,                // ← enlève les marges pour qu’il soit bien centré
            }}
        >
            <View style={styles.container}>
                <Ionicons name="ellipsis-horizontal" size={25} color={globalStyles.secondaryText.color} />
                <Text style={{ color: 'red' }}>{dialogType === "confirm" ? "confirm ee" : "info ee"}</Text>
                <Text style={{ color: 'red' }}>{title}</Text>

                <TouchableOpacity
                    onPress={() => {

                    }}>
                    <Text style={{ color: 'red' }}>{title}</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgb(28, 28, 30)',
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: globalStyles.secondaryTextWithOpacity.color,

    },
    title: {
        color: globalStyles.primaryText.color,
        fontSize: 20,
        fontWeight: "bold",
        marginLeft: 15,
    }

});
export default MyDialog;