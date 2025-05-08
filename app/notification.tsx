import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import globalStyles from "./styles";
import CollapsibleSection from "../components/CollapsedComponent";
import { formatDateInterval, formatDurationISO, formatDateHeureFr } from "./utils/timeUtils";
import { fetchVisitorsData, fetchCVDownloadsData, fetchPortfolioDetailsViewData } from "../api/visitorsDataApi"; // api
// redux
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux'

import { useDispatch } from 'react-redux'
import { addDataAtBeginning, addDataAtEnd, sortDataByDateDesc } from '../features/visitorsDataSlice'

import { setVisitorDataApiOffset, setCVDownloadsApiOffset, setPortfolioDetailsViewApiOffset } from '../features/apiOffset' // set offset

const NotificationsScreen = () => {
  const registeredOnlineVisitor = useSelector((state: RootState) => state.number_online.registered_visitor)
  const newOnlineVisitor = useSelector((state: RootState) => state.number_online.new_visitor)

  const navigation = useNavigation();
  const notification_data = useSelector((state: RootState) => state.visitors_data.formData);
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

  // ************ useEffect ***********
  useEffect(() => {
    // set date now
    const intervalId = setInterval(() => {
      setDateNow(new Date().toISOString());
    }, 1000);
    // request api
    if (notification_data.length === 0) {
      loadVisitorData();
      loadCVDownloadData();
      loadPortfolioDetailsViewData();
    }
    return () => clearInterval(intervalId);
  }, []);

  // ************ fonction ************
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
  const renderItem = ({ item }: { item: any }) => {

    if (item.message_type === "portfolio_details_view_alert") {
      return (
        <View key={item.unique_key} style={[styles.notificationCard, item.is_read == true? styles.viewCard : null]}>
          <CollapsibleSection title={"Un visiteur voir votre projet"} id_key={item.unique_key} is_read={item.is_read} notif_type={"portfolio_details_view_alert"}>
            <Text style={styles.message}>project_name : {item.project_name}</Text>
            <Text style={styles.message}>project_type : {item.project_type}</Text>
          </CollapsibleSection>
          <Text style={styles.status}>view_datetime : {formatDateHeureFr(item.view_datetime)}</Text>
        </View>
      );
    }

    else if (item.message_type === "cv_download_alert") {
      return (
        <View key={item.unique_key} style={[styles.notificationCard, item.is_read == true? styles.viewCard : null]}>
          <CollapsibleSection title={"Un visiteur a téléchargé votre CV"} id_key={item.unique_key} is_read={item.is_read} notif_type={"cv_download_alert"}>
            <Text style={styles.message}>visitor id : {item.visitor_uuid}</Text>
            <Text style={styles.message}>download_datetime : {item.download_datetime}</Text>
          </CollapsibleSection>
          <Text style={styles.status}>download_datetime : {formatDateHeureFr(item.download_datetime)}</Text>
        </View>
      );
    }
    else if (
      item.message_type === "data_api" ||
      item.message_type === "connected_alert" ||
      item.message_type === "disconnected_alert"
    ) {
      return (
        <View key={item.unique_key} style={[styles.notificationCard, item.is_read == true? styles.viewCard : null]}>
          <CollapsibleSection
            title={
              item.alert_new_visitor === ""
                ? "Un visiteur récurrent revisite votre portfolio"
                : "Un nouveau visiteur découvre votre portfolio"
            }
            id_key={item.unique_key}
            is_read={item.is_read}
            notif_type={"data_api"}
          >
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
        </View>
      );
    }

    return null;
  };

  
  // ************* return **************
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={16} color={globalStyles.primaryColor.color} />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications <Text>(3)</Text></Text>
      </View>

      {/* Description */}
      <Text style={styles.description}>
        Notifications pour afficher les nouveaux ou anciens visiteurs traqués
      </Text>
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
            hasMoreVisitorData? loadMoreVisitorData 
            : hasMoreCVDownloadsData? loadMoreCVDownloadData
            : hasMorePortfolioDetailsViewData? loadMorePortfolioDetailsViewData 
            : null
          } // Appelé quand on arrive en bas
          onEndReachedThreshold={0.5} // Appelé à mi-chemin avant le bas
          ListFooterComponent={isLoading ? renderFooter : null}
          contentContainerStyle={{ paddingBottom: 100 }}
          bounces={true}
          overScrollMode="always"
        />

      )}
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
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
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
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
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
});

export default NotificationsScreen;