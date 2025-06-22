import globalStyles from "@/app/styles";
import { Ionicons } from "@expo/vector-icons";
import { AnimatePresence, MotiView } from 'moti';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
    dialogType: 'info' | 'error' | 'warning' | 'success';
    message: string;
    onClose: () => void;
};

export const StatusMessage = ({ dialogType, message, onClose }: Props) => {
    const [visible, setVisible] = useState(true);

    const handleClose = () => {
        setVisible(false);
        setTimeout(() => {
            onClose();
        }, 100); // doit correspondre à la durée du exitTransition
    };

    return (
        <AnimatePresence>
            {visible && (
                <MotiView
                    from={{ opacity: 0, translateY: 20, scale: 0.95 }}
                    animate={{ opacity: 1, translateY: 0, scale: 1 }}
                    exit={{ opacity: 0, translateY: -20, scale: 0.95 }}
                    transition={{
                        opacity: { type: 'timing', duration: 400 },
                        translateY: { type: 'timing', duration: 400 },
                        scale: { type: 'spring', damping: 15, stiffness: 100 },
                    }}
                    exitTransition={{
                        opacity: { type: 'timing', duration: 200 },
                        translateY: { type: 'timing', duration: 200 },
                        scale: { type: 'spring', damping: 10, stiffness: 80 },
                    }}
                    style={[styles.statusMessage, styles.centeredRow]}
                >
                    <View style={[styles.leftContent, styles.centeredRow]}>
                        {dialogType === 'info' && (
                            <>
                                <Ionicons name="information-circle" size={24} color="#2ecc71" />
                                <Text style={[styles.message, {color: "#2ecc71"}]}>{message}</Text>
                            </>
                        )}
                        {dialogType === 'error' && (
                            <>
                            <Ionicons name="alert-circle" size={24} color={globalStyles.dangerColor.color} />
                            <Text style={[styles.message, {color: globalStyles.dangerColor.color}]}>{message}</Text>
                            </>
                        )}
                        {dialogType === 'warning' && (
                            <>
                            <Ionicons name="warning" size={24} color="#f39c12" />
                            <Text style={[styles.message, {color: "#f39c12"}]}>{message}</Text>
                            </>
                        )}
                        {dialogType === 'success' && (
                            <>
                            <Ionicons name="checkmark" size={24} color={globalStyles.primaryColor.color} />
                            <Text style={[styles.message, {color: globalStyles.primaryColor.color}]}>{message}</Text>
                            </>
                        )}
                        
                    </View>
                    <TouchableOpacity onPress={handleClose}>
                        <Ionicons name="close" size={24} color="#7f8c8d" />
                    </TouchableOpacity>
                </MotiView>
            )}
        </AnimatePresence>
    );
};

const styles = StyleSheet.create({
    centeredRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusMessage: {
        minHeight: 54,
        backgroundColor: 'rgb(28, 28, 30)',
        borderWidth: 1,
        borderColor: globalStyles.secondaryTextWithOpacity.color,
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 10,
        margin: 2,
        gap: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    leftContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    message: {
        fontSize: 14,
        marginLeft: 10,
        flexShrink: 1,
    }
});
