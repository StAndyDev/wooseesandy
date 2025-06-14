
import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import globalStyles from '../../app/styles';

type Props = {
    dialogType: 'confirm' | 'info' | 'error' | 'success'
    title?: string
    dialogText: string
    successTitle?: string
    failedTitle?: string
    onConfirm: () => void
    onCancel?: () => void
    confirmBtnText?: string
    cancelBtnText?: string
    onBackButtonPress: () => void
    onBackdropPress: () => void
    show: boolean
    hideDialogWithSuccès?: boolean
}

const MyDialog = ({ dialogType, title,dialogText, successTitle, failedTitle, onConfirm, onCancel, confirmBtnText = "OK", cancelBtnText = "Annuler", onBackButtonPress, onBackdropPress, show = false, hideDialogWithSuccès }: Props) => {

    const [changeIconToSucces, setChangeIconToSucces] = useState(false);
    const [changeIconToFailed, setChangeIconToFailed] = useState(false);
    const [titleState, setTitleState] = useState(title);
    const [disableConfirmBtn, setDisableConfirmBtn] = useState(false);

    // Création d'une référence pour la valeur animée
    const scaleValue = useRef(new Animated.Value(1)).current;
    const rotateValue = useRef(new Animated.Value(0)).current;

    const handlePressConfirm = () => {
        setChangeIconToSucces(false);
        setChangeIconToFailed(false);

        // Réinitialiser les valeurs avant de démarrer une nouvelle animation
        scaleValue.setValue(1);
        rotateValue.setValue(0);
        Animated.parallel([
            Animated.sequence([
                Animated.timing(scaleValue, {
                    toValue: 1.3,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleValue, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]),

            Animated.timing(rotateValue, {
                toValue: 1,
                duration: 500,
                easing: Easing.elastic(1.5),
                useNativeDriver: true,
            }),
        ]).start();
        hideDialogWithSuccès
        ? ( setChangeIconToSucces(true),
            (dialogType === "confirm") && setTitleState(successTitle) 
        )
        : ( setChangeIconToFailed(true),
            (dialogType === "confirm") && setTitleState(failedTitle) )

        setTimeout(() => {
            onConfirm();
        }, (dialogType === "confirm")? 500 : 0);
        // mettre par defaut
        hideDialogWithSuccès
        ? (setTimeout(() => {setChangeIconToSucces(false); setTitleState(title)}, 1500))
        : (setTimeout(() => {setChangeIconToFailed(false); setTitleState(title)}, 1500))
    };

    const rotateInterpolation = rotateValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const handlePressCancel = () => {
        setDisableConfirmBtn(true);
        (onCancel) && onCancel();
        (setTimeout(() => {setDisableConfirmBtn(false)}, 1500))
    }

    return (
        <Modal
            isVisible={show}
            animationIn="bounceIn"
            animationOut="bounceOut"
            animationInTiming={700}     // Durée de l'animation d'entrée en ms
            animationOutTiming={1000}    // Durée de l'animation de sortie en ms
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
                <View style={{ borderWidth: 1, borderColor: globalStyles.secondaryTextWithOpacity.color, borderRadius: 50, padding: 5 }}>
                    {dialogType === "confirm" ?
                    (<Animated.View
                        style={{
                            transform: [
                                { scale: scaleValue },
                                { rotate: rotateInterpolation },
                            ],
                        }}
                    >

                        {(changeIconToSucces === false && changeIconToFailed === false) 
                        ? (<Ionicons
                            name="help"
                            size={30}
                            color={globalStyles.secondaryText.color}
                        />) : (changeIconToSucces) 
                        ?(<Ionicons
                            name="checkmark"
                            size={30}
                            color={globalStyles.primaryColor.color}
                        />) : (changeIconToFailed) 
                        ?(<Ionicons
                            name="close"
                            size={30}
                            color={globalStyles.dangerColor.color}
                        />) : null
                        }
                    </Animated.View>)

                     : dialogType === "error" ? (
                        <Ionicons
                            name="close"
                            size={30}
                            color={globalStyles.dangerColor.color}
                        />
                    ) : dialogType === "success" ? (
                        <Ionicons
                            name="checkmark"
                            size={30}
                            color={globalStyles.primaryColor.color}
                        />
                    )
                    : (<Ionicons
                        name="alert"
                        size={30}
                        color={globalStyles.secondaryText.color}
                    />)}
                </View>
                <Text
                    style={
                        dialogType === "confirm"
                            ? {
                                color: changeIconToSucces
                                    ? globalStyles.primaryColor.color
                                    : changeIconToFailed
                                        ? globalStyles.dangerColor.color
                                        : globalStyles.primaryText.color,
                                fontSize: 20,
                            }
                            : { color: globalStyles.primaryText.color, fontSize: 20 }
                    }
                >
                    {titleState}
                </Text>

                <Text style={{ color: globalStyles.secondaryText.color }}>
                    {dialogText}
                </Text>

                <View style={styles.btnContainer}>
                    <TouchableOpacity
                        style={styles.btn}
                        onPress={handlePressConfirm}
                        disabled={disableConfirmBtn}
                    >
                        <Text style={{ color: globalStyles.primaryColor.color }}>{confirmBtnText}</Text>
                    </TouchableOpacity>
                    {(dialogType === "confirm") && (
                    <TouchableOpacity
                        style={styles.btn}
                        onPress={handlePressCancel}
                    >
                        <Text style={{ color: globalStyles.primaryColor.color }}>{cancelBtnText}</Text>
                    </TouchableOpacity>)}
                </View>

            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(28, 28, 30)',
        minWidth: 230,
        paddingVertical: 20,
        paddingHorizontal: 35,
        gap: 5,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: globalStyles.secondaryTextWithOpacity.color,

    },
    btnContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    btn: {
        backgroundColor: globalStyles.secondaryTextWithOpacity.color,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginTop: 10,
    }

});
export default MyDialog;