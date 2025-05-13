import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, BackHandler, FlatList, Modal, Pressable, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { deleteCVDownload, deletePortfolioDetailView, deleteVisitInfo, fetchCVDownloadsData, fetchPortfolioDetailsViewData, fetchVisitorsData } from "../api/visitorsDataApi"; // api
import CollapsibleSection from "../components/CollapsedComponent";
import globalStyles from "./styles";
import { formatDateHeureFr, formatDateInterval, formatDurationISO } from "./utils/timeUtils";
// redux
import { RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { removeNewVisitorOnline, removeRegisteredVisitorOnline } from '../features/numberOnlineSlice';
import { addDataAtBeginning, addDataAtEnd, deleteCVDownloadEE, deletePortfolioDetailViewEE, deleteVisitInfoEE, sortDataByDateDesc, } from '../features/visitorsDataSlice';

import Checkbox from 'expo-checkbox';
import { MotiView } from 'moti'; // animationd
import { setCVDownloadsApiOffset, setPortfolioDetailsViewApiOffset, setVisitorDataApiOffset } from '../features/apiOffset'; // set offset

const NotificationsScreen = () => {
  /* --- store ---*/
  // notification data
  const notification_data = useSelector((state: RootState) => state.visitors_data.formData);
  // online nbr
  const registeredOnlineVisitor = useSelector((state: RootState) => state.number_online.registered_visitor)
  const newOnlineVisitor = useSelector((state: RootState) => state.number_online.new_visitor)
  // notif non lu
  const visitinfo_unred_count = useSelector((state: RootState) => state.number_notification.unread.visitinfo_count)
  const cvdownload_unred_count = useSelector((state: RootState) => state.number_notification.unread.cvdownload_count)
  const portfoliodetailview_unred_count = useSelector((state: RootState) => state.number_notification.unread.portfoliodetailview_count)
  
  const navigation = useNavigation();
  const [date_now, setDateNow] = useState(new Date().toISOString());

  const dispatch = useDispatch()
  // api
  const [isLoading, setIsLoading] = useState(false);
  // limit & offset
  const [limit] = useState(10);
  const visitor_data_offset = useSelector((state: RootState) => state.api_offset.visitorDataApiOffset);
  const cv_downloads_offset = useSelector((state: RootState) => state.api_offset.cvDownloadsApiOffset);
  const portfolio_details_view_offset = useSelector((state: RootState) => state.api_offset.portfolioDetailsViewApiOffset);
  // has more data
  const [hasMoreVisitorData, setHasMoreVisitorData] = useState(true); // pour savoir s'il y a plus de données à charger
  const [hasMoreCVDownloadsData, setHasMoreCVDownloadsData] = useState(true);
  const [hasMorePortfolioDetailsViewData, setHasMorePortfolioDetailsViewData] = useState(true);
  // long press, selection multiple
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<{ message_type: string; unique_key: string; is_new_visitor: boolean; is_online: boolean }[]>([]);
  // btn suppr
  const [isDelDisabled, setIsDelDisabled] = useState(true);
  // floating modal
  const [visibleModal, setVisibleModal] = useState(false);

  /* ************
   USE EFFECT
  *****************/
  useEffect(() => {
    // set date now
    const intervalId = setInterval(() => {
      setDateNow(new Date().toISOString());
    }, 400);
    // request api
    if (notification_data.length === 0) {
      loadVisitorData();
      loadCVDownloadData();
      loadPortfolioDetailsViewData();
    }
    return () => clearInterval(intervalId);
  }, []);

  /* comportement perso du back button,
   handle back button */
  useEffect(() => {
    const backAction = () => {
      if (isSelectionMode) {
        setIsSelectionMode(false);
        setSelectedItems([]);
        return true; // Empêche l'action par défaut (fermer l'app)
      }
      return false; // Laisse le comportement normal (fermeture de l'app)
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );
    return () => backHandler.remove();
  }, [isSelectionMode]);

  // met à jour le selectedItems après le set.., pour le btn suppr
  useEffect(() => {
    if (selectedItems.length === 0) {
      setIsDelDisabled(true);
    } else {
      setIsDelDisabled(false);
    }
  }, [selectedItems]);
  

  /************
  FONCTION 
  ************/

  // function loadVisitorData
  const loadVisitorData = async () => {
    if (!hasMoreVisitorData || isLoading) return;
    setIsLoading(true);
    try {
      const data = await fetchVisitorsData(limit, visitor_data_offset);
      if (data.results.length === 0) {
        setHasMoreVisitorData(false);
        return;
      }
      data.results.forEach((item: any) => {
        const visitorData = {
          message_type: "data_api",
          unique_key: item.id_visit_info,
          date_sort: item.visit_end_datetime,
          visitor_uuid: item.visitor.id_visitor,
          visit_info_uuid: item.id_visit_info,
          alert_new_visitor: item.visitor.is_new_visitor == true ? "new visitor" : "",
          alert_returning_visitor: item.visitor.is_new_visitor == false ? "récurrent visitor" : "",
          visit_start_datetime: item.visit_start_datetime,
          visit_end_datetime: item.visit_end_datetime,
          visit_duration: item.visit_duration,
          navigator_info: item.visitor.navigator_info,
          os: item.visitor.os,
          device_type: item.visitor.device_type,
          ip_address: item.ip_address,
          location_approx: item.location_approx,
          is_read: item.is_read
        }
        dispatch(
          registeredOnlineVisitor + newOnlineVisitor > 0
            ? addDataAtEnd(visitorData)
            : addDataAtBeginning(visitorData)
        );

      });
      // set offset
      dispatch(setVisitorDataApiOffset(visitor_data_offset + limit));
      dispatch(sortDataByDateDesc()); // trier les données par date
    } catch (error) {
      console.error('Erreur lors du chargement des visiteurs:', error);
    } finally {
      setIsLoading(false);
    }
  };


  // function loadCVDownloadData
  const loadCVDownloadData = async () => {
    if (!hasMoreCVDownloadsData || isLoading) return;
    setIsLoading(true);
    try {
      const data = await fetchCVDownloadsData(limit, cv_downloads_offset);
      if (data.results.length === 0) {
        setHasMoreCVDownloadsData(false);
        return;
      }
      data.results.forEach((item: any) => {
        const cvDownloadData = {
          message_type: "cv_download_alert",
          unique_key: item.id_cv_download,
          date_sort: item.download_datetime,
          id_cv_download: item.id_cv_download,
          visitor_uuid: item.visitor.id_visitor,
          download_datetime: item.download_datetime,
          is_read: item.is_read
        }
        dispatch(
          registeredOnlineVisitor + newOnlineVisitor > 0
            ? addDataAtEnd(cvDownloadData)
            : addDataAtBeginning(cvDownloadData)
        );

      });
      // set offset
      dispatch(setCVDownloadsApiOffset(cv_downloads_offset + limit));
      dispatch(sortDataByDateDesc()); // trier les données par date
    } catch (error) {
      console.error('Erreur lors du chargement des cvdowloader list:', error);
    } finally {
      setIsLoading(false);
    }
  };
  // function loadPortfolioDetailsViewData
  const loadPortfolioDetailsViewData = async () => {
    if (!hasMorePortfolioDetailsViewData || isLoading) return;
    setIsLoading(true);
    try {
      const data = await fetchPortfolioDetailsViewData(limit, portfolio_details_view_offset);
      if (data.results.length === 0) {
        setHasMorePortfolioDetailsViewData(false);
        return;
      }
      data.results.forEach((item: any) => {
        const portfolioDetailsViewData = {
          message_type: "portfolio_details_view_alert",
          unique_key: item.id_portfolio_detail_view,
          date_sort: item.view_datetime,
          visitor_uuid: item.visitor.id_visitor,
          id_portfolio_detail_view: item.id_portfolio_detail_view,
          project_name: item.project_name,
          project_type: item.project_type,
          view_datetime: item.view_datetime,
          is_read: item.is_read
        }
        dispatch(
          registeredOnlineVisitor + newOnlineVisitor > 0
            ? addDataAtEnd(portfolioDetailsViewData)
            : addDataAtBeginning(portfolioDetailsViewData)
        );

      });
      // set offset
      dispatch(setPortfolioDetailsViewApiOffset(portfolio_details_view_offset + limit));
      dispatch(sortDataByDateDesc()); // trier les données par date
    } catch (error) {
      console.error('Erreur lors du chargement des portfoliodataview list:', error);
    } finally {
      setIsLoading(false);
    }
  };


  // load more
  const loadMoreVisitorData = () => {
    setTimeout(() => {
      loadVisitorData();
    }, 1500);
  }
  const loadMoreCVDownloadData = () => {
    setTimeout(() => {
      loadCVDownloadData();
    }, 1500);
  }
  const loadMorePortfolioDetailsViewData = () => {
    setTimeout(() => {
      loadPortfolioDetailsViewData();
    }, 1500);
  }

  // handleLongPress
  const handleLongPress = (id: string, message_type: string, is_new_visitor: boolean, is_online: boolean) => {
    setIsSelectionMode(true);
    toggleSelection({ message_type, unique_key: id, is_new_visitor: is_new_visitor, is_online }); // toggle selection
  };
  // selectionnement
  const toggleSelection = (item: { message_type: string; unique_key: string; is_new_visitor: boolean; is_online: boolean }) => {
    setSelectedItems(prev => {
      const isAlreadySelected = prev.some(i => i.unique_key === item.unique_key);
      if (isAlreadySelected) {
        return prev.filter(i => i.unique_key !== item.unique_key);
      } else {
        return [...prev, item];
      }
    });
  };
  // clear selection
  const clearSelection = () => {
    setSelectedItems([]);
    setIsSelectionMode(false);
  };
  // show delete alert
    const showDeletedAlert = () => {
      Alert.alert(
        'Notification',
        'Notification supprimée avec succès.',
        [{ text: 'OK', style: 'default' }],
        { cancelable: true }
      );
    };
    
  // suppression
  const handleDelete = () => {
    selectedItems.forEach(async item => {
      if (item.message_type === "data_api" ||
        item.message_type === "connected_alert" ||
        item.message_type === "disconnected_alert") 
        {
        const response = await deleteVisitInfo(item.unique_key);
        if (response.status === 200) {
          dispatch(deleteVisitInfoEE({ unique_key: item.unique_key }));
          if(item.is_online){
            (item.is_new_visitor) ? dispatch(removeNewVisitorOnline(1)) : dispatch(removeRegisteredVisitorOnline(1));
          }
          showDeletedAlert();
          setVisibleModal(false);
        } else if(response.status === 404){
          alert("Not Found")
        }
      } else if (item.message_type === "cv_download_alert") {
        const response = await deleteCVDownload(item.unique_key);
        if (response.status === 200) {
          dispatch(deleteCVDownloadEE({ unique_key: item.unique_key }))
          showDeletedAlert();
          setVisibleModal(false);
        }
      } else if (item.message_type === "portfolio_details_view_alert") {
        const response = await deletePortfolioDetailView(item.unique_key);
        if (response.status === 200) {
          dispatch(deletePortfolioDetailViewEE({ unique_key: item.unique_key }));
          showDeletedAlert();
          setVisibleModal(false);
        }
      }
    });

  }

  /****************
   RENDER FUNCTION
   **************/
  // render Modal
  const renderModal = () => {
    return (
      <View style={styles.modalContainer}>
  
        {/* Boîte de dialogue flottante */}
        <Modal
          transparent={true}
          visible={visibleModal}
          onRequestClose={() => setVisibleModal(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPressOut={() => setVisibleModal(false)}
          >
            <View style={styles.dialogBox}>
              {!isDelDisabled && (
                <TouchableOpacity style={styles.menuItem} onPress={ () => handleDelete()} >
                  <Ionicons name="trash-outline" size={20} color={globalStyles.backgroundColorPrimary.backgroundColor} />
                  <Text style={{ color: globalStyles.backgroundColorPrimary.backgroundColor }}>Supprimer</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.menuItem}
                onPress={() => {
                  if (selectedItems.length === notification_data.length) {
                    setSelectedItems([]);
                    setIsDelDisabled(true);
                  } else {
                    setSelectedItems(
                      notification_data.map(
                        item => (
                          { message_type: item.message_type, 
                            unique_key: item.unique_key, 
                            is_new_visitor: (item.alert_new_visitor != "")? true : false,
                            is_online: (item.visit_duration != "")? true : false,
                           }
                          )));
                    setIsDelDisabled(false);
                  }
                }}>
                
                {notification_data.length === selectedItems.length ? (
                  <>
                    <Ionicons name="checkmark" size={20} color={globalStyles.backgroundColorPrimary.backgroundColor} />
                    <Text style={{ color: globalStyles.backgroundColorPrimary.backgroundColor }}>Désélectionner tout</Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="checkmark-done" size={20} color={globalStyles.backgroundColorPrimary.backgroundColor} />
                    <Text style={{ color: globalStyles.backgroundColorPrimary.backgroundColor }}>Sélectionner tout</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }

  // render footer
  const renderFooter = () => {
    return (
      <>
        <Text style={[styles.delai, { textAlign: 'center', color: globalStyles.secondaryText.color }]}>chargement...</Text>
        <ActivityIndicator style={{ margin: 10 }} />
      </>
    )
  }

  // render item
  const renderItem = ({ item, index }: { item: any; index: number }) => {

    if (item.message_type === "portfolio_details_view_alert") {
      return (
        
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: index * 100 }}
        >
          <Pressable key={item.unique_key} style={[styles.notificationCard, item.is_read == true ? styles.viewCard : null]}
          onLongPress={() => handleLongPress(item.unique_key, item.message_type, (item.alert_new_visitor != "")? true : false, (!item.visit_duration)? true : false, )}
          >
          {isSelectionMode && (
            <Checkbox
                // check if item is selected
                onValueChange={() => toggleSelection({ message_type: item.message_type, unique_key: item.unique_key, is_new_visitor: (item.alert_new_visitor != "")? true : false, is_online: (!item.visit_duration)? true : false })}
                style={styles.checkboxStyle}
                value={selectedItems.some(i => i.unique_key === item.unique_key)} // check if item is selected
              />
            )}
            <CollapsibleSection
              title={"Un visiteur voir votre projet"}
              id_key={item.unique_key}
              is_read={item.is_read}
              notif_type={"portfolio_details_view_alert"}
              icon_notif_name="information-circle-outline"
              onLongPress={() => handleLongPress(item.unique_key, item.message_type, (item.alert_new_visitor != "")? true : false, (!item.visit_duration)? true : false,)} // handle long press
            >
              <Text style={styles.message}>unique key: {item.unique_key}</Text>
              <Text style={styles.message}>project_name : {item.project_name}</Text>
              <Text style={styles.message}>project_type : {item.project_type}</Text>
            </CollapsibleSection>
            <Text style={styles.status}>view_datetime : {formatDateHeureFr(item.view_datetime)}</Text>
          </Pressable>

        </MotiView>
      );
    }

    else if (item.message_type === "cv_download_alert") {
      return (
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: index * 100 }}
        >
          <Pressable key={item.unique_key} style={[styles.notificationCard, item.is_read == true ? styles.viewCard : null]}
          onLongPress={() => handleLongPress(item.unique_key, item.message_type, (item.alert_new_visitor != "")? true : false, (!item.visit_duration)? true : false,)}
          >
            {isSelectionMode && (
              <Checkbox
                // check if item is selected
                onValueChange={() => toggleSelection({ message_type: item.message_type, unique_key: item.unique_key, is_new_visitor: (item.alert_new_visitor != "")? true : false, is_online: (!item.visit_duration)? true : false })}
                style={styles.checkboxStyle}
                value={selectedItems.some(i => i.unique_key === item.unique_key)} // check if item is selected
              />
            )}
            <CollapsibleSection
              title={"Un visiteur a téléchargé votre CV"}
              id_key={item.unique_key}
              is_read={item.is_read}
              notif_type={"cv_download_alert"}
              icon_notif_name="download-outline"
              onLongPress={() => handleLongPress(item.unique_key, item.message_type, (item.alert_new_visitor != "")? true : false, (!item.visit_duration)? true : false,)} // handle long press
            >
              <Text style={styles.message}>unique key: {item.unique_key}</Text>
              <Text style={styles.message}>visitor id : {item.visitor_uuid}</Text>
              <Text style={styles.message}>download_datetime : {item.download_datetime}</Text>
            </CollapsibleSection>
            <Text style={styles.status}>download_datetime : {formatDateHeureFr(item.download_datetime)}</Text>
          </Pressable>
        </MotiView>
      );
    }
    else if (
      item.message_type === "data_api" ||
      item.message_type === "connected_alert" ||
      item.message_type === "disconnected_alert"
    ) {
      return (
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: index * 100 }}
        >

          <Pressable key={item.unique_key} style={[styles.notificationCard, item.is_read == true ? styles.viewCard : null]}
          onLongPress={() => handleLongPress(item.unique_key, item.message_type, (item.alert_new_visitor != "")? true : false, (!item.visit_duration)? true : false,)}
          >
            {isSelectionMode && (
              <Checkbox
                // check if item is selected
                onValueChange={() => toggleSelection({ message_type: item.message_type, unique_key: item.unique_key, is_new_visitor: (item.alert_new_visitor != "")? true : false, is_online: (!item.visit_duration)? true : false })}
                style={styles.checkboxStyle}
                value={selectedItems.some(i => i.unique_key === item.unique_key)} // check if item is selected
              />
            )}
            <CollapsibleSection
              title={
                item.alert_new_visitor === ""
                  ? "Un visiteur récurrent revisite votre portfolio"
                  : "Un nouveau visiteur découvre votre portfolio"
              }
              id_key={item.unique_key}
              is_read={item.is_read}
              notif_type={"data_api"}
              onLongPress={() => handleLongPress(item.unique_key, item.message_type, (item.alert_new_visitor != "")? true : false, (!item.visit_duration)? true : false,)} // handle long press
              icon_notif_name="eye-outline"
            >

              <Text style={styles.message}>unique key: {item.unique_key}</Text>
              <Text style={styles.message}>visitor id : {item.visitor_uuid}</Text>
              <Text style={styles.message}>uuid de la visite : {item.visit_info_uuid}</Text>
              <Text style={styles.message}>adresse ip : {item.ip_address}</Text>
              <Text style={styles.message}>date de début : {item.visit_start_datetime}</Text>
              <Text style={styles.message}>
                date de fin : {item.visit_end_datetime ? item.visit_end_datetime : "N/A"}
              </Text>
              <Text style={styles.message}>
                durée de visite :{" "}
                {item.visit_duration
                  ? formatDurationISO(item.visit_duration, true)
                  : formatDateInterval(date_now, item.visit_start_datetime, true)}
              </Text>
              <Text style={styles.message}>navigateur : {item.navigator_info}</Text>
              <Text style={styles.message}>système d'exploitation : {item.os}</Text>
              <Text style={styles.message}>type d'appareil : {item.device_type}</Text>
            </CollapsibleSection>

            {item.visit_end_datetime && item.visit_end_datetime.trim() === "" || item.visit_end_datetime === undefined ? (
              <Text style={styles.status}>[status : en ligne]</Text>
            ) : (
              <Text style={styles.delai}>
                il y a {formatDateInterval(date_now, item.visit_end_datetime)}
              </Text>
            )}
          </Pressable>

        </MotiView>
      );
    }

    return null;
  };


  /* ************* 
  RETURN
  ************** */
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* Header */}
      <View style={styles.header}>

        <View style={styles.first_header}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={20} color={globalStyles.primaryColor.color} />
            </TouchableOpacity>
            <Text style={styles.title}>Notifications <Text>({visitinfo_unred_count + cvdownload_unred_count + portfoliodetailview_unred_count})</Text></Text>
          </View>
          {/* Selection mode */}
          
          {isSelectionMode && (
            <View style={{ flexDirection: "row", gap: 20 }}>
              <TouchableOpacity onPress={() => clearSelection()}>
                <Ionicons name="close" size={20} color={globalStyles.primaryColor.color} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setVisibleModal(true)}>
                <Ionicons name="ellipsis-vertical" size={20} color={globalStyles.primaryColor.color} />
              </TouchableOpacity>
            </View>
          )}

          

        </View>
        {/* Description */}
        <View>
          <Text style={styles.description}>
            Notifications pour afficher les nouveaux ou anciens visiteurs traqués
          </Text>
        </View>

      </View>

      {/* if ntf empty or not */}
      {!hasMoreVisitorData && notification_data.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: globalStyles.secondaryText.color }}>Aucune notification</Text>
        </View>
      ) : (
        <FlatList
          data={notification_data}
          keyExtractor={(item) => item.unique_key}
          renderItem={renderItem} // content
          initialNumToRender={4}
          onEndReached={
            hasMoreVisitorData ? loadMoreVisitorData
              : hasMoreCVDownloadsData ? loadMoreCVDownloadData
                : hasMorePortfolioDetailsViewData ? loadMorePortfolioDetailsViewData
                  : null
          } // Appelé quand on arrive en bas
          onEndReachedThreshold={0.5} // Appelé à mi-chemin avant le bas
          ListFooterComponent={isLoading ? renderFooter : null}
          contentContainerStyle={{ paddingBottom: 100 }}
          bounces={true}
          overScrollMode="always"
        />
        
      )}
      {renderModal()}
    </View>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalStyles.backgroundColorPrimary.backgroundColor,
    paddingHorizontal: globalStyles.boxPadding.padding,
  },
  header: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
    gap: 10,
  },
  first_header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

  },
  title: {
    color: globalStyles.primaryText.color,
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 15,
  },
  description: {
    color: globalStyles.secondaryText.color,
    fontSize: 14,
    marginBottom: 20,
  },
  notificationCard: {
    backgroundColor: globalStyles.tertiaryColor.color, // non lu
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 5,
  },
  viewCard: {
    backgroundColor: globalStyles.backgroundColorSecondary.backgroundColor,  // lu
  },
  status: {
    color: globalStyles.primaryColor.color,
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 5,
  },
  message: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "500",
  },
  delai: {
    color: "#888",
    fontSize: 12,
    marginTop: 5,
  },
  checkboxStyle: {
    borderWidth: 2,
    height: 30,
    width: 29,
    borderRadius: 5,
    marginTop: -30,
    top: 35,
    zIndex: 1,
    backgroundColor: globalStyles.backgroundColorPrimary.backgroundColor,
  },
  // modal
  modalContainer: {
    flex: 1,
    alignItems: 'flex-end', // Aligner à droite
  },
  // le modalOverlay est la zone sombre qui recouvre l'écran
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  dialogBox: {
    marginTop: 52,
    marginRight: 10,
    backgroundColor: globalStyles.secondaryColor.color,
    borderRadius: 10,
    padding: 8,
    elevation: 4, // Ombre sur Android
    shadowColor: '#000', // Ombre sur iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
  },
  menuItem: {
    padding: 10,
    flexDirection: 'row',
    gap : 10,
  },
});

export default NotificationsScreen;