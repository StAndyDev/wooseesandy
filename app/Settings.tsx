import MyDialog from "@/components/modal-dialog/MyDialog";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Modal from 'react-native-modal';
import { RadioButton } from 'react-native-paper';
import globalStyles from "./styles";
// redux
import { RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { addUrl, setUrl } from '../features/baseUrlConfigSlice';
// local storage
import AsyncStorage from '@react-native-async-storage/async-storage'; // storage asynchrone
// hook
import { useTestConnection } from "@/hooks/useTestConnection";
import { ScrollView } from "moti";

const Settings = () => {
    // test de connexion à l'API
    const { checkApiConnection } = useTestConnection();
    // etat de la connexion
    const isApiConnected = useSelector((state: RootState) => state.connection.apiConnected);
    const isSocketConnected = useSelector((state: RootState) => state.connection.socketConnected);
    // State variables
    const baseUrlData = useSelector((state: RootState) => state.base_url.urls);
    const baseUrlCount = baseUrlData?.length ?? 0;

    const activeApiUrl = useSelector((state: RootState) =>
        state.base_url?.urls?.find(url => url.isActiveForApi) || null
    )
    const activeWsUrl = useSelector((state: RootState) =>
        state.base_url?.urls?.find(url => url.isActiveForWs) || null
    )
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [selectedModal, setSelectedModal] = useState<"api" | "websocket">("api");
    const [isBtnSaveDisabled, setIsBtnSaveDisabled] = useState(true) // desactiver/activer le bouton de sauvegarde
    const [btnMode, setBtnMode] = useState<'add' | 'edit'>('add'); // mode du bouton (ajouter ou modifier)
    const [btnModeColor, setBtnModeColor] = useState<'add' | 'edit' | 'none'>('none'); // couleur du bordure du header de Modal en fonction du mode du bouton (ajouter ou modifier)
    const [isModalVisible, setModalVisible] = useState(false);
    const [dataToEdit, setDataToEdit] = useState<{ id: number, isActiveForApi: boolean, isActiveForWs: boolean } | null>(null); // pour modifier les données d'une URL existante

    const [isVisibleSupprDialog, setIsVisibleSupprDialog] = useState(false); // pour le dialog de confirmation de suppression d'une URL
    const [idToDelete, setIdToDelete] = useState<number | null>(null);  // pour stocker l'ID de l'URL à supprimer
    const [isVisibleEmptyDialog, setIsVisibleEmptyDialog] = useState(false); // pour le dialog d'erreur si les champs sont vides
    const [isVisibleMajDialog, setIsVisibleMajDialog] = useState(false); // pour le dialog de mise à jour des données
    const [isVisibleInvalideProtocoleDialog, setIsVisibleInvalideProtocoleDialog] = useState(false); // pour le dialog d'erreur si le protocole n'est pas valide

    // forms
    const [openPicker, setOpenPicker] = useState(false);
    const [pickerItems, setPickerItems] = useState([
        { label: 'HTTP', value: 'http' },
        { label: 'HTTPS', value: 'https' },
        { label: 'WebSocket', value: 'ws' },
        { label: 'WebSocket(TLS)', value: 'wss' },
    ]);
    // value in form modal
    const [pickerValue, setPickerValue] = useState('');
    const [hostTextInput, setHostTextInput] = useState('');
    const [portTextInput, setPortTextInput] = useState('');

    // pour déclancher useEffect pour le test de connex
    const [triggerTest, setTriggerTest] = useState(false);


    // ---------------- UseEffect -----------------
    useEffect(() => {
        // Vérifier si le nombre d'URL de base dépasse 5
        if (baseUrlCount > 4 && btnMode === 'add') {
            setIsBtnSaveDisabled(true);
        } else {
            setIsBtnSaveDisabled(false);
        }
    }, [baseUrlData, btnMode]);

    useEffect(() => {
        if (triggerTest) {
            testConnection();
            setTriggerTest(false); // reset
        }
    }, [baseUrlData, triggerTest]);

    // ------------- End UseEffect ----------

    // ------------- function -------------
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const handleSave = async () => {
        if (!pickerValue || !hostTextInput) {
            setIsVisibleEmptyDialog(true);
            return;
        }
        console.log('\n ------handleSave called-------');
        try {
            // maj state
            const newUrl = {
                protocole: pickerValue,
                host: hostTextInput,
                port: portTextInput,
            };
            const updatedUrls = [...baseUrlData, {
                id: Date.now(),
                isActiveForApi: false,
                isActiveForWs: false,
                ...newUrl
            }];
            dispatch(addUrl(newUrl));
            // maj storage
            await AsyncStorage.setItem("base_urls", JSON.stringify(updatedUrls));
            // clear form inputs
            setPickerValue('');
            setHostTextInput('');
            setPortTextInput('');
            console.log('Donnée ajouté avec succès');
        } catch (e) {
            console.error('Impossible d"ajouter un url', e);
            throw e;
        }
    };
    const handleUpdate = () => {
        if (!pickerValue || !hostTextInput) {
            setIsVisibleEmptyDialog(true);
            return;
        }
        if (dataToEdit) {
            // Mise à jour des données de l'URL
            const updatedUrls = baseUrlData.map(url => {
                if (url.id === dataToEdit.id) {
                    return {
                        ...url,
                        protocole: pickerValue,
                        host: hostTextInput,
                        port: portTextInput,
                        isActiveForApi: url.isActiveForApi,
                        isActiveForWs: url.isActiveForWs,
                    };
                }
                return url;
            });
            dispatch(setUrl(updatedUrls));
            AsyncStorage.setItem("base_urls", JSON.stringify(updatedUrls));
            setIsVisibleMajDialog(true); // Afficher le dialog de succès de mise à jour
            // Clear form inputs
            clearForms();
            setBtnMode('add');
            setBtnModeColor('none');

        }
    };
    // clear forms
    const clearForms = () => {
        setPickerValue('');
        setHostTextInput('');
        setPortTextInput('');
        setDataToEdit(null);
    }
    // delete btn
    const handleDelete = () => {
        console.log(`Delete URL with ID: ${idToDelete}`);
        // Filtrer l'URL à supprimer
        const updatedUrls = baseUrlData.filter(url => url.id !== idToDelete);
        dispatch(setUrl(updatedUrls)); // Mise à jour dans Redux
        AsyncStorage.setItem("base_urls", JSON.stringify(updatedUrls)); // Mise à jour dans AsyncStorage
        setIsVisibleSupprDialog(false);
        clearForms();
    }
    // radio buttons action
    const activeForApiUrl = (id: number, protocole: string) => {
        if (protocole !== 'http' && protocole !== 'https') {
            setIsVisibleInvalideProtocoleDialog(true);
            return;
        }
        console.log(`Active API URL with ID: ${id}`);
        // Désactiver les autres URLs pour l'API
        const updatedUrls = baseUrlData.map(url => ({
            ...url,
            isActiveForApi: url.id === id ? true : false,
        }));
        dispatch(setUrl(updatedUrls)); // Mise à jour dans Redux
        AsyncStorage.setItem("base_urls", JSON.stringify(updatedUrls)); // Mise à jour dans AsyncStorage
        setTriggerTest(true); // demande de test (en useEffect)
    }
    const activeForWsUrl = (id: number, protocole: string) => {
        if (protocole !== 'ws' && protocole !== 'wss') {
            setIsVisibleInvalideProtocoleDialog(true);
            return;
        }
        console.log(`Active WebSocket URL with ID: ${id}`);
        // Désactiver les autres URLs pour WebSocket
        const updatedUrls = baseUrlData.map(url => ({
            ...url,
            isActiveForWs: url.id === id ? true : false,
        }));
        dispatch(setUrl(updatedUrls)); // Mise à jour dans Redux
        AsyncStorage.setItem("base_urls", JSON.stringify(updatedUrls)); // Mise à jour dans AsyncStorage
    }
    // Vérification de la connexion à l'API
    const testConnection = async () => {
        console.log("\n -------- Test micro ----- ")
        const isConnected = await checkApiConnection();
        if (isConnected) {
            console.log('Connexion à l\'API réussie :' + isConnected);
        } else {
            console.log('Échec de la connexion à l\'API :' + isConnected);
        }
    };

    return (
        <View style={styles.container}>
            {/* Mise à jour Dialog */}
            <MyDialog
                dialogType="success"
                title="Mis à jour effectuée"
                dialogText="l'adresse a été mise à jour avec succès"
                onConfirm={() => {
                    setIsVisibleMajDialog(false);
                }}
                onBackButtonPress={() => setIsVisibleMajDialog(false)}
                onBackdropPress={() => setIsVisibleMajDialog(false)}
                show={isVisibleMajDialog}
            />

            {/* Champ vide Dialog */}
            <MyDialog
                dialogType="info"
                title="Infos"
                dialogText="les champs ne doivent pas être vides"
                confirmBtnText="OK"
                onConfirm={() => {
                    setIsVisibleEmptyDialog(false);
                }}
                onBackButtonPress={() => setIsVisibleEmptyDialog(false)}
                onBackdropPress={() => setIsVisibleEmptyDialog(false)}
                show={isVisibleEmptyDialog}
            />
            {/* Suppr Dialog */}
            <MyDialog
                dialogType="confirm"
                title="Supprimer l'URL"
                dialogText="êtes-vous sûr ?"
                successTitle="Suppression effectuée"
                failedTitle="Echec"
                hideDialogWithSuccess={true}
                confirmBtnText="Oui"
                cancelBtnText="Non"
                onConfirm={() => {
                    handleDelete();
                }}
                onCancel={() => setIsVisibleSupprDialog(false)}
                onBackButtonPress={() => setIsVisibleSupprDialog(false)}
                onBackdropPress={() => setIsVisibleSupprDialog(false)}
                show={isVisibleSupprDialog}
            />
            {/* Invalide protocole Dialog */}
            <MyDialog
                dialogType="error"
                title="Protocole invalide"
                dialogText="Le protocole sélectionné n'est pas valide avec ce type de serveur."
                confirmBtnText="OK"
                onConfirm={() => {
                    setIsVisibleInvalideProtocoleDialog(false);
                }}
                onBackButtonPress={() => setIsVisibleInvalideProtocoleDialog(false)}
                onBackdropPress={() => setIsVisibleInvalideProtocoleDialog(false)}
                show={isVisibleInvalideProtocoleDialog}
            />


            {/* Header */}
            <View style={styles.first_header}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color={globalStyles.primaryColor.color} />
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
                            <Text style={{ color: globalStyles.primaryText.color }}>Serveur d'API</Text>
                            <Text style={[isApiConnected ? { color: globalStyles.secondaryText.color } : { color: globalStyles.secondaryTextWithOpacity.color }, { fontSize: 12 }]}>
                                {(activeApiUrl?.port)? activeApiUrl?.protocole + "://" + activeApiUrl?.host + ":" + activeApiUrl?.port : activeApiUrl?.protocole + "://" + activeApiUrl?.host + "/api"}
                            </Text>
                        </View>
                        <View>
                            <TouchableOpacity onPress={() => {
                                toggleModal();
                                setSelectedModal("api");
                            }}>
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
                            <Text style={{ color: globalStyles.primaryText.color }}>Serveur WebSocket</Text>
                            <Text style={[isSocketConnected ? { color: globalStyles.secondaryText.color } : { color: globalStyles.secondaryTextWithOpacity.color }, { fontSize: 12 }]}>
                                {(activeWsUrl?.port)? activeWsUrl?.protocole + "://" + activeWsUrl?.host + ":" + activeWsUrl?.port : activeWsUrl?.protocole + "://" + activeWsUrl?.host + "/ws/visitor-tracker/"}
                            </Text>
                        </View>
                        <View>
                            <TouchableOpacity onPress={() => {
                                toggleModal();
                                setSelectedModal("websocket");
                            }}>
                                <Ionicons name="ellipsis-horizontal" size={25} color={globalStyles.secondaryText.color} />
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            </View>

            {/* ------ Modal ------ */}
            <Modal
                removeClippedSubviews={true} // le prop "removeClippedSubviews" est plus utile (View, etc..) pour les longues listes et scrolls (pour améliorer les performances)
                isVisible={isModalVisible}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                animationInTiming={500}     // Durée de l'animation d'entrée en ms
                animationOutTiming={300}    // Durée de l'animation de sortie en ms
                swipeDirection="down"
                backdropOpacity={0.5}
                onBackdropPress={toggleModal} // Fermer le modal en appuyant sur le fond
                onBackButtonPress={() => {
                    if (btnMode === "edit") {
                        setBtnMode('add');
                        setBtnModeColor('none');
                        // clearForms();
                    } else {
                        toggleModal()
                    }
                }}
                onSwipeComplete={toggleModal}
                swipeThreshold={200}
                propagateSwipe={true}
                style={{ justifyContent: 'flex-end', alignItems: 'flex-end', margin: 0 }}
            >

                <View style={styles.modalContent} >
                    {/* HEADER MODAL */}
                    <View style={styles.headerModal}>
                        <View style={styles.modalHandler}></View>
                        <Ionicons name={selectedModal === "api" ? "cloud-done" : "sync"} size={30} color={globalStyles.tertiaryColor.color} style={{ alignSelf: "center" }} />
                        <Text style={styles.modalTitle}>{(selectedModal === 'api') ? "Serveur d'API" : "Serveur Websocket"}</Text>
                        <View>
                            {
                                selectedModal === "api" ?
                                    (activeApiUrl && isApiConnected
                                        ? (<Text style={{ alignSelf: "center", marginBottom: 2, color: globalStyles.primaryColor.color }}>Connecté à l'adresse</Text>)
                                        : (<Text style={{ alignSelf: "center", marginBottom: 2, color: globalStyles.dangerColor.color }}>Non Connecté</Text>)
                                    )
                                    : (activeWsUrl && isSocketConnected
                                        ? (<Text style={{ alignSelf: "center", marginBottom: 2, color: globalStyles.primaryColor.color }}>Connecté à l'adresse</Text>)
                                        : (<Text style={{ alignSelf: "center", marginBottom: 2, color: globalStyles.dangerColor.color }}>Non Connecté</Text>)
                                    )
                            }

                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 5, paddingHorizontal: 25 }}>
                                {
                                    selectedModal === "api"
                                        ? (activeApiUrl && (<View style={isApiConnected? styles.succes_point : styles.failed_point}></View>))
                                        : (activeWsUrl && (<View style={isSocketConnected? styles.succes_point : styles.failed_point}></View>))
                                }
                                
                                <Text style={{ color: globalStyles.secondaryText.color, letterSpacing: 0.5, fontSize: 12, textAlign: "center", maxWidth: 200 }}>
                                    {selectedModal === 'api'
                                        ? activeApiUrl
                                            ? (activeApiUrl.port)? `${activeApiUrl.protocole}://${activeApiUrl.host}:${activeApiUrl.port}:/api` : `${activeApiUrl.protocole}://${activeApiUrl.host}/api`
                                            : 'Aucune URL API active'
                                        : activeWsUrl
                                            ? (activeWsUrl.port)? `${activeWsUrl.protocole}://${activeWsUrl.host}:${activeWsUrl.port}:/ws/visitor-tracker/` : `${activeWsUrl.protocole}://${activeWsUrl.host}/ws/visitor-tracker/`
                                            : 'Aucune URL WS active'}
                                </Text>
                            </View>
                        </View>
                    </View>


                    {/* BODY MODAL */}
                    <View style={styles.bodyModal}>
                        {/* row 1 */}
                        <View style={styles.bodyTitle}>
                            <Text style={{ color: globalStyles.secondaryText.color, fontSize: 12 }}>{btnMode === "add" ? "Ajouter un URL" : "Modifier l'URL"}</Text>
                            {(btnMode === "edit") && (
                                <TouchableOpacity onPress={() => {
                                    setBtnMode('add')
                                    setBtnModeColor('none');
                                }
                                }>
                                    <Ionicons name="close" size={20} color={globalStyles.blueColor.color} />
                                </TouchableOpacity>
                            )}
                        </View>
                        <View
                            style={
                                [styles.row_body,
                                { marginBottom: 20 },
                                btnModeColor === 'add'
                                    ? { borderColor: globalStyles.primaryColor.color }
                                    : btnModeColor === 'edit'
                                        ? {
                                            borderColor: globalStyles.blueColor.color,
                                            // Styles iOS
                                            shadowColor: 'white',
                                            shadowOffset: {
                                                width: 0,
                                                height: 2,
                                            },
                                            shadowOpacity: 0.25,
                                            shadowRadius: 3.84,
                                            // Styles Android
                                            elevation: 5, // Élévation pour Android
                                        } : null
                                ]} >
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 }}>
                                <Text style={styles.label}>Protocole :</Text>
                                <DropDownPicker
                                    open={openPicker}
                                    setOpen={setOpenPicker}
                                    value={pickerValue}
                                    setValue={setPickerValue}
                                    items={pickerItems}
                                    setItems={setPickerItems}
                                    onOpen={() => {
                                        btnMode === "add" && setBtnModeColor('none')
                                    }}
                                    onClose={() => {
                                        btnMode === "add" && setBtnModeColor('none')
                                    }}
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
                                <Text style={styles.label}>Serveur hôte :</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="IP ou domaine"
                                    placeholderTextColor={globalStyles.secondaryTextWithOpacity.color}
                                    cursorColor={globalStyles.primaryColor.color}
                                    value={hostTextInput}
                                    onChangeText={(text) => setHostTextInput(text.toLowerCase())}
                                    onFocus={() => btnMode === "add" && setBtnModeColor('none')}
                                    onChange={() => btnMode === "add" && setBtnModeColor('none')}
                                />
                            </View>

                            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 }}>
                                <Text style={styles.label}>Port :</Text>
                                <TextInput
                                    keyboardType="numeric"
                                    style={styles.input}
                                    placeholder="Ex : 8080"
                                    placeholderTextColor={globalStyles.secondaryTextWithOpacity.color}
                                    cursorColor={globalStyles.primaryColor.color}
                                    value={portTextInput}
                                    onChangeText={setPortTextInput}
                                    onFocus={() => btnMode === "add" && setBtnModeColor('none')}
                                    onChange={() => btnMode === "add" && setBtnModeColor('none')}
                                />
                            </View>

                            <TouchableOpacity
                                onPress={btnMode === "add" ? handleSave : handleUpdate}
                                style={[styles.button, isBtnSaveDisabled && { opacity: 0.2 }]}
                                disabled={isBtnSaveDisabled}>
                                <Text style={styles.buttonText}>SAUVEGARDER</Text>
                            </TouchableOpacity>
                        </View>

                        {/* row 2 */}
                        <View style={styles.bodyTitle}>
                            <Text style={{ color: globalStyles.secondaryText.color, fontSize: 12 }}>Sélectionner un URL</Text>
                        </View>




                        <ScrollView style={[styles.row_body, { padding: 0 }]}>
                            {baseUrlData && baseUrlData.map(item => (
                                <TouchableOpacity key={item.id} style={styles.list_child}>
                                    <Ionicons
                                        name={
                                            selectedModal === 'api'
                                                ? (item.isActiveForApi ? 'link-outline' : 'unlink-outline')
                                                : (item.isActiveForWs ? 'link-outline' : 'unlink-outline')
                                        }
                                        size={20}
                                        color={globalStyles.secondaryText.color} />
                                    <View style={{ maxWidth: "50%" }}>
                                        <Text style={{ color: globalStyles.primaryText.color }}>Serveur : {item.protocole}</Text>
                                        <Text style={{ color: globalStyles.secondaryText.color, fontSize: 12, letterSpacing: 0.5 }}>
                                            {item.port? (item.host + ":" + item.port) : (item.host)}
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: "row", gap: 10, marginLeft: "auto" }}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setBtnModeColor('edit');
                                                setBtnMode('edit');
                                                setDataToEdit({ id: item.id, isActiveForApi: item.isActiveForApi, isActiveForWs: item.isActiveForWs });
                                                setPickerValue(item.protocole);
                                                setHostTextInput(item.host);
                                                setPortTextInput(item?.port?.toString() ?? '');
                                                setIsBtnSaveDisabled(false);
                                            }}
                                            style={{ borderWidth: 1, borderColor: globalStyles.primaryColor.color, padding: 5, borderRadius: 5 }}>
                                            <Ionicons name="pencil" size={15} color={globalStyles.secondaryText.color} />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPressOut={() => {
                                                setIsVisibleSupprDialog(true);
                                                setIdToDelete(item.id);
                                            }}
                                            style={{ borderWidth: 1, borderColor: globalStyles.primaryColor.color, padding: 5, borderRadius: 5 }}
                                        >
                                            <Ionicons name="trash" size={15} color={globalStyles.secondaryText.color} />
                                        </TouchableOpacity>
                                    </View>
                                    <View>
                                        <RadioButton.Group
                                            onValueChange={() => {
                                                selectedModal === 'api'
                                                ? (activeForApiUrl(item.id, item.protocole))
                                                : (activeForWsUrl(item.id, item.protocole))
                                            }}
                                            value={
                                                selectedModal === 'api'
                                                    ? item.isActiveForApi ? String(item.id) : ""
                                                    : item.isActiveForWs ? String(item.id) : ""
                                            }
                                        >
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <RadioButton value={String(item.id)} color={globalStyles.primaryColor.color} uncheckedColor={globalStyles.secondaryTextWithOpacity.color} />
                                            </View>
                                        </RadioButton.Group>
                                    </View>
                                </TouchableOpacity>
                            ))}

                            {baseUrlCount < 5 &&
                                Array.from({ length: 5 - baseUrlCount }).map((_, index) => (
                                    <TouchableOpacity key={`placeholder-${index}`} activeOpacity={0.8}>
                                    <View
                                        style={[styles.list_child, { justifyContent: 'center', alignItems: 'center' }]}
                                    >
                                        <TouchableOpacity
                                            onPress={() => {
                                                setBtnModeColor('add');
                                                setBtnMode('add');
                                            }}>
                                            <Ionicons
                                                name="add-circle-outline"
                                                size={32}
                                                color={globalStyles.secondaryTextWithOpacity.color}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    </TouchableOpacity>
                                ))}
                        </ScrollView>


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
    first_header: {
        marginTop: 20,
        width: "100%",
        flexDirection: "row",
        paddingVertical: globalStyles.headerPadding.padding,
        paddingLeft: 5,
    },
    title: {
        color: globalStyles.primaryText.color,
        fontSize: 20,
        fontWeight: "bold",
        marginLeft: 15,
    },

    contentTitle: {
        color: globalStyles.primaryColor.color,
        padding: 10,
    },
    contentItem: {
        display: "flex",
        alignSelf: 'center',
        alignItems: "center",
        flexDirection: "row",
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderBottomColor: globalStyles.quaternaryColorWithOpacity.color,
        borderTopColor: globalStyles.quaternaryColorWithOpacity.color,
        paddingVertical: 10,
        paddingHorizontal: 20,
        minHeight: 65,
        gap: 10,
    },
    // Modal
    modalContent: {
        width: "100%",
        height: "91%",
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
        marginBottom: 5,
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        padding: 5
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
        minHeight: 65,
    },
    modalHandler: {
        width: 40,
        height: 5,
        backgroundColor: globalStyles.primaryText.color,
        borderRadius: 10,
        alignSelf: 'center',
        marginBottom: 10,
    },
    modalTitle: {
        alignSelf: 'center',
        color: globalStyles.secondaryText.color,
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    succes_point: {
        width: 8,
        height: 8,
        backgroundColor: globalStyles.primaryColor.color,
        borderRadius: 5,
    },
    failed_point: {
        width: 8,
        height: 8,
        backgroundColor: globalStyles.dangerColor.color,
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