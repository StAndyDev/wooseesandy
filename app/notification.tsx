import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import globalStyles from "./styles";
import CollapsibleSection from "../components/CollapsedComponent";
import { formatDateInterval, formatDurationISO } from "./utils/timeUtils";
import { fetchVisitorsData } from "../api/visitorsDataApi";
// redux
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux'

import { useDispatch } from 'react-redux'
import { addVisitor } from '../features/visitorsDataSlice'

import { setVisitorDataApiOffset } from '../features/apiOffset'

const NotificationsScreen = () => {
  const navigation = useNavigation();
  const notification_data = useSelector((state: RootState) => state.visitors_data.formData);
  const [date_now, setDateNow] = useState(new Date().toISOString());

  const dispatch = useDispatch()
  // api
  const [isLoading, setIsLoading] = useState(false);
  const [limit] = useState(10);
  const offset = useSelector((state: RootState) => state.visitor_data_api_offset.visitorDataApiOffset);
  const [hasMoreData, setHasMoreData] = useState(true); // pour savoir s'il y a plus de données à charger

  // ************ useEffect ***********
  useEffect(() => {
    // set date now
    const intervalId = setInterval(() => {
      setDateNow(new Date().toISOString());
    }, 1000);
    // request api
    if (notification_data.length === 0) {
      loadVisitorData();
    }
    
    return () => clearInterval(intervalId);
  }, []);

  // ************ fonction ************
  const loadVisitorData = async () => {
    if (!hasMoreData || isLoading) return;
    setIsLoading(true);
    try {
      const data = await fetchVisitorsData(limit, offset);
      if (data.results.length === 0) {
        setHasMoreData(false);
        return;
      }
      data.results.forEach((item: any) => {
        const visitorData = {
          alert_type: "data_api",
          visitor_uuid: item.visitor.id_visitor,
          visit_info_uuid: item.id_visit_info,
          alert_new_visitor: "************",
          alert_returning_visitor: "************",
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
        dispatch(addVisitor(visitorData));
      });
      dispatch(setVisitorDataApiOffset(offset + limit));
      console.log("**********OFFSET******* : " + offset);
    } catch (error) {
      console.error('Erreur lors du chargement des visiteurs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreVisitorData = () => {
    setTimeout(() => {
      loadVisitorData();
    }, 1500);
  }

  const renderFooter = () => {
    return (
      <>
        <Text style={[styles.delai, { textAlign: 'center', color: globalStyles.secondaryText.color }]}>chargement...</Text>
        <ActivityIndicator style={{ margin: 10 }} />
      </>
    )
  }

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
      {!hasMoreData && notification_data.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: globalStyles.secondaryText.color }}>Aucune notification</Text>
        </View>
      ) : (
        <FlatList
          data={notification_data}
          keyExtractor={(item) => item.visit_info_uuid}
          initialNumToRender={2}
          onEndReached={loadMoreVisitorData} // Appelé quand on arrive en bas
          onEndReachedThreshold={0.5} // Appelé à mi-chemin avant le bas
          ListFooterComponent={isLoading ? renderFooter : null}
          contentContainerStyle={{ paddingBottom: 100 }}
          bounces={true}
          overScrollMode="always"
          renderItem={({ item }) => (
            <View style={styles.notificationCard}>
              <CollapsibleSection
                title={
                  item.alert_new_visitor === ""
                    ? "Un visiteur récurrent revisite votre portfolio"
                    : "Un nouveau visiteur découvre votre portfolio"
                }
              >
                <Text style={styles.message}>visitor id : {item.visitor_uuid}</Text>
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

          )}
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
    // backgroundColor: globalStyles.backgroundColorSecondary.backgroundColor,
    backgroundColor: globalStyles.tertiaryColor.color,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
  },
  emptyCard : {
    backgroundColor: globalStyles.tertiaryColor.color,
    height: 100,
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