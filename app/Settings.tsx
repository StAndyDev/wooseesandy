import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from 'react';
import { BackHandler, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Modal from 'react-native-modal';
import { RadioButton } from 'react-native-paper';
import globalStyles from "./styles";

const Settings = () => {
    const [baseUrl, setBaseUrl] = useState('');
    const [webSocketUrl, setWebSocketUrl] = useState('');
    const navigation = useNavigation();
    const [isModalVisible, setModalVisible] = useState(false);
    const [baseURLValue, setBaseURLValue] = React.useState('192.123.32.0');

    // form in modal
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: 'HTTP', value: 'http://' },
        { label: 'HTTPS', value: 'https://' },
        { label: 'WebSocket', value: 'ws://' },
        { label: 'WebSocket(TLS)', value: 'wss://' },
    ]);
    const [textInput, setTextInput] = useState('');


    // Gérer le bouton retour Android
    useEffect(() => {
        const backAction = () => {
            if (isModalVisible) {
                toggleModal(); // Fermer le modal
                return true;   // Bloquer le comportement par défaut
            }
            return false;    // Sinon, laisser l'app gérer normalement
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        return () => backHandler.remove(); // Nettoyage à la fermeture du composant
    }, [isModalVisible]);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const handleSave = () => {
        // Save settings logic here
        console.log('Base URL:', baseUrl);
        console.log('WebSocket URL:', webSocketUrl);
        alert('Settings saved successfully!');
    };

    return (
        <View style={styles.container}>
            <View style={styles.first_header}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={20} color={globalStyles.primaryColor.color} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Paramètres</Text>
                </View>
            </View>
            {/* content */}
            <View>
                <Text style={styles.contentTitle}>Connection serveur</Text>
                <View>
                    {/* item 1 */}
                    <View style={styles.contentItem}>
                        <View>
                            <Ionicons name="cloud-done" size={30} color={globalStyles.tertiaryColor.color} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: globalStyles.primaryText.color }}>Base URL</Text>
                            <Text style={{ color: globalStyles.secondaryText.color }}>https://example.com</Text>
                        </View>
                        <View>
                            <TouchableOpacity onPress={toggleModal}>
                                <Ionicons name="ellipsis-horizontal" size={25} color={globalStyles.secondaryText.color} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* item 2 */}
                    <View style={styles.contentItem}>
                        <View>
                            <Ionicons name="sync" size={30} color={globalStyles.tertiaryColor.color} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: globalStyles.primaryText.color }}>WebSocket URL</Text>
                            <Text style={{ color: globalStyles.secondaryText.color }}>wss://example.com</Text>
                        </View>
                        <View>
                            <TouchableOpacity>
                                <Ionicons name="ellipsis-horizontal" size={25} color={globalStyles.secondaryText.color} />
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            </View>

            {/* ------ Modal ------ */}
            <Modal
                isVisible={isModalVisible}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                animationInTiming={500}     // Durée de l'animation d'entrée en ms
                animationOutTiming={300}    // Durée de l'animation de sortie en ms
                swipeDirection="down"
                backdropOpacity={0.5}
                onBackdropPress={toggleModal}
                onSwipeComplete={toggleModal}
                swipeThreshold={200}
                propagateSwipe={true}
                onBackButtonPress={toggleModal} // btn retour Android
                style={{ justifyContent: 'flex-end', alignItems: 'flex-end', margin: 0 }}
            >
                <View style={styles.modalContent}>

                    {/* HEADER MODAL */}
                    <View style={styles.headerModal}>
                        <View style={styles.modalHandler}></View>
                        <Ionicons name="cloud-done" size={30} color={globalStyles.tertiaryColor.color} style={{ alignSelf: "center" }} />
                        <Text style={styles.modalTitle}>URL de base</Text>
                        <View>
                            <Text style={{ alignSelf: "center", color: globalStyles.primaryColor.color, marginBottom: 2 }}>Connecté à l'adresse</Text>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5 }}>
                                <View style={styles.point}></View>
                                <Text style={{ color: globalStyles.secondaryText.color, letterSpacing: 0.5 }}>192.129.02.23</Text>
                            </View>
                        </View>
                    </View>


                    {/* BODY MODAL */}
                    <View style={styles.bodyModal}>
                        {/* row 1 */}
                        <Text style={styles.bodyTitle}>Ajouter un URL</Text>
                        <View style={[styles.row_body, { marginBottom: 20 }]}>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 }}>
                                <Text style={styles.label}>Protocole :</Text>
                                <DropDownPicker
                                    open={open}
                                    value={value}
                                    items={items}
                                    setOpen={setOpen}
                                    setValue={setValue}
                                    setItems={setItems}
                                    listItemLabelStyle={{
                                        color: globalStyles.primaryText.color,
                                        fontWeight: 'bold',
                                    }}
                                    labelStyle={{
                                        color: globalStyles.primaryText.color,
                                        fontWeight: 'bold',
                                    }}
                                    placeholder="Type de serveur"
                                    placeholderStyle={{
                                        color: globalStyles.secondaryTextWithOpacity.color,
                                        // fontWeight: 'bold'
                                    }}
                                    showArrowIcon={true}
                                    ArrowDownIconComponent={() => (
                                      <Ionicons name="chevron-down" size={20} color={globalStyles.primaryColor.color} />
                                    )}
                                    ArrowUpIconComponent={() => (
                                      <Ionicons name="chevron-up" size={20} color={globalStyles.primaryColor.color} />
                                    )}
                                    style={{
                                        backgroundColor: globalStyles.backgroundColorSecondary.backgroundColor,
                                        borderColor: globalStyles.secondaryTextWithOpacity.color,
                                        minHeight: 28, // Hauteur du champ de sélection
                                        width: '45%', // Largeur (peut être en % ou pixels)
                                        borderRadius: 5,
                                    }}
                                    dropDownContainerStyle={{
                                        backgroundColor: globalStyles.backgroundColorSecondary.backgroundColor,
                                        borderColor: globalStyles.secondaryTextWithOpacity.color,
                                        width: '45%',
                                    }}
                                    textStyle={{
                                        fontSize: 12,
                                    }}
                                />
                            </View>
                            
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 }}>
                                <Text style={styles.label}>Adresse du serveur :</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="IP ou domaine"
                                    placeholderTextColor={globalStyles.secondaryTextWithOpacity.color}
                                    cursorColor={globalStyles.primaryColor.color}
                                    value={textInput}
                                    onChangeText={setTextInput}
                                />
                            </View>

                            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 }}>
                                <Text style={styles.label}>Port :</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ex : 8080"
                                    placeholderTextColor={globalStyles.secondaryTextWithOpacity.color}
                                    cursorColor={globalStyles.primaryColor.color}
                                    value={textInput}
                                    onChangeText={setTextInput}
                                />
                            </View>

                            <TouchableOpacity style={styles.button}>
                                <Text style={styles.buttonText}>SAUVEGARDER</Text>
                            </TouchableOpacity>
                        </View>
                        {/* row 2 */}
                        <Text style={styles.bodyTitle}>Liste des URL</Text>
                        <View style={[styles.row_body, { padding: 0 }]}>
                            {/* child 1 */}
                            <View style={styles.list_child}>
                                <Ionicons name="unlink-outline" size={20} color={globalStyles.secondaryText.color} />
                                <View>
                                    <Text style={{ color: globalStyles.primaryText.color }}>Serveur : HTTP</Text>
                                    <Text style={{ color: globalStyles.secondaryText.color, fontSize: 12, letterSpacing: 0.5 }}>127.0.0.1:8000</Text>
                                </View>
                                <View style={{ flexDirection: "row", gap: 10, marginLeft: "auto" }}>
                                    <TouchableOpacity style={{ borderWidth: 1, borderColor: globalStyles.primaryColor.color, padding: 5, borderRadius: 5 }}>
                                        <Ionicons name="pencil" size={15} color={globalStyles.secondaryText.color} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ borderWidth: 1, borderColor: globalStyles.primaryColor.color, padding: 5, borderRadius: 5 }}>
                                        <Ionicons name="trash" size={15} color={globalStyles.secondaryText.color} />
                                    </TouchableOpacity>
                                </View>
                                <View>
                                    <RadioButton.Group onValueChange={newValue => setBaseURLValue(newValue)} value={baseURLValue}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <RadioButton value="first" color={globalStyles.primaryColor.color} uncheckedColor={globalStyles.secondaryTextWithOpacity.color} />
                                        </View>
                                    </RadioButton.Group>
                                </View>

                            </View>
                            {/* child 2 */}
                            <View style={styles.list_child}>
                                <Ionicons name="link-outline" size={20} color={globalStyles.secondaryText.color} />
                                <View>
                                    <Text style={{ color: globalStyles.primaryText.color }}>Serveur : HTTPS</Text>
                                    <Text style={{ color: globalStyles.secondaryText.color, fontSize: 12, letterSpacing: 0.5 }}>127.0.0.1:8000</Text>
                                </View>
                                <View style={{ flexDirection: "row", gap: 10, marginLeft: "auto" }}>
                                    <TouchableOpacity style={{ borderWidth: 1, borderColor: globalStyles.primaryColor.color, padding: 5, borderRadius: 5 }}>
                                        <Ionicons name="pencil" size={15} color={globalStyles.secondaryText.color} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ borderWidth: 1, borderColor: globalStyles.primaryColor.color, padding: 5, borderRadius: 5 }}>
                                        <Ionicons name="trash" size={15} color={globalStyles.secondaryText.color} />
                                    </TouchableOpacity>
                                </View>
                                <View>
                                    <RadioButton.Group onValueChange={newValue => setBaseURLValue(newValue)} value={baseURLValue} >
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <RadioButton value="second" color={globalStyles.primaryColor.color} uncheckedColor={globalStyles.secondaryTextWithOpacity.color} />
                                        </View>
                                    </RadioButton.Group>
                                </View>
                            </View>
                            {/* child 3 */}
                            <View style={[styles.list_child, { justifyContent: "center", alignItems: "center" }]}>
                                <TouchableOpacity>
                                    <Ionicons name="add-circle-outline" size={32} color={globalStyles.secondaryTextWithOpacity.color} />
                                </TouchableOpacity>
                            </View>
                            {/* child 4 */}
                            <View style={[styles.list_child, { justifyContent: "center", alignItems: "center" }]}>
                                <TouchableOpacity>
                                    <Ionicons name="add-circle-outline" size={32} color={globalStyles.secondaryTextWithOpacity.color} />
                                </TouchableOpacity>
                            </View>

                        </View>

                    </View>
                </View>
            </Modal>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: globalStyles.backgroundColorPrimary.backgroundColor,
        paddingHorizontal: globalStyles.boxPadding.padding,
    },
    title: {
        color: globalStyles.primaryText.color,
        fontSize: 20,
        fontWeight: "bold",
        marginLeft: 15,
    },
    first_header: {
        width: "100%",
        flexDirection: "row",
        paddingVertical: globalStyles.headerPadding.padding,
        marginLeft: 5
    },
    contentTitle: {
        color: globalStyles.primaryColor.color,
        marginLeft: 10,
        marginBottom: 10,
    },
    contentItem: {
        display: "flex",
        alignSelf: 'center',
        flexDirection: "row",
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderBottomColor: globalStyles.quaternaryColorWithOpacity.color,
        borderTopColor: globalStyles.quaternaryColorWithOpacity.color,
        paddingVertical: 10,
        paddingHorizontal: 10,
        gap: 10,
    },
    // Modal
    modalContent: {
        width: "100%",
        height: "93%",
        backgroundColor: globalStyles.backgroundColorSecondary.backgroundColor,
        borderWidth: globalStyles.boxBorderWidth.borderWidth,
        borderColor: globalStyles.secondaryTextWithOpacity.color,
        paddingVertical: 20,
        alignSelf: 'center',
    },
    headerModal: {
        borderBottomWidth: 1,
        borderBottomColor: globalStyles.quaternaryColorWithOpacity.color,
        paddingBottom: 20,
    },
    bodyModal: {
        flex: 1,
        backgroundColor: globalStyles.backgroundColorPrimary.backgroundColor,
        width: '100%',
        height: 300,
        padding: 20,
    },
    bodyTitle: {
        color: globalStyles.secondaryText.color,
        fontSize: 12,
        marginBottom: 10,
    },
    row_body: {
        backgroundColor: globalStyles.backgroundColorSecondary.backgroundColor,
        borderWidth: 1,
        borderColor: globalStyles.secondaryTextWithOpacity.color,
        borderRadius: 10,
        padding: 20,
    },
    list_child: {
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: globalStyles.secondaryTextWithOpacity.color,
        paddingVertical: 10,
        paddingHorizontal: 10,
        gap: 10,
        minHeight: 54,
    },
    modalHandler: {
        width: 40,
        height: 5,
        backgroundColor: globalStyles.primaryText.color,
        borderRadius: 10,
        alignSelf: 'center',
        marginBottom: 15,
    },
    modalTitle: {
        alignSelf: 'center',
        color: globalStyles.secondaryText.color,
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    point: {
        width: 8,
        height: 8,
        backgroundColor: globalStyles.primaryColor.color,
        borderRadius: 5,
    },
    // forms modal
    label: {
        fontSize: 14,
        color: globalStyles.primaryText.color,
        minWidth: 120,
    },
    dropdown: {
        width: '100%',
        borderRadius: 5,
        backgroundColor: '#eee',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: globalStyles.secondaryTextWithOpacity.color,
        color: globalStyles.primaryText.color,
        fontSize: 12,
        padding: 5,
        minWidth: "45%",
        maxWidth: "45%",
        height: 28,
        borderRadius: 5,
        letterSpacing: 0.5,
        
    },
    button: {
        marginTop: 10,
        paddingVertical: 10,
        borderRadius: 5,
        backgroundColor: globalStyles.tertiaryColor.color
    },
    buttonText: {
        color: globalStyles.primaryText.color,
        textAlign: "center"
    }

});

export default Settings;