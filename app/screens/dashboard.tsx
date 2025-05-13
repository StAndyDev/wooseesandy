import React, { useEffect } from 'react';
import MyDashboard from '../../components/DashboardElement';
import globalStyles from '../styles';
// redux
import { RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
// recuder
import { setUnreadNotificationCount } from '../../features/numberNotificationSlice';
// api
import { fetchNotificationCount } from '../../api/visitorsDataApi';

import {
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

const histogramData = [
  { page: "Home", visites: 100 },
  { page: "About", visites: 80 },
  { page: "Contact", visites: 50 },
  { page: "Blog", visites: 30 },
  { page: "Portfolio", visites: 20 },
  { page: "Services", visites: 10 },
  { page: "Testimonials", visites: 5 },
  { page: "FAQ", visites: 2 },
  { page: "Privacy Policy", visites: 1 },
  { page: "Terms of Service", visites: 1 },
  { page: "Sitemap", visites: 1 },
  { page: "Careers", visites: 1 },
  { page: "", visites: 1 },
  { page: "", visites: 1 },
  { page: "", visites: 1 },
];

export default function Dashboard() {

  const registeredOnlineVisitor = useSelector((state: RootState) => state.number_online.registered_visitor)
  const newOnlineVisitor = useSelector((state: RootState) => state.number_online.new_visitor)
  // reducers

  // notif non lu
  const visitinfo_unred_count = useSelector((state: RootState) => state.number_notification.unread.visitinfo_count)
  const cvdownload_unred_count = useSelector((state: RootState) => state.number_notification.unread.cvdownload_count)
  const portfoliodetailview_unred_count = useSelector((state: RootState) => state.number_notification.unread.portfoliodetailview_count)
  const dispatch = useDispatch()

  useEffect(() => {
    const loadNumberNotification = async () => {
      const res = await fetchNotificationCount(false); // nbr notif non lu
      if (res.status === 200) {
        // charger en Redux
        const data_unred = {
          visitinfo_count: visitinfo_unred_count + res.data.visitinfo_count,
          cvdownload_count: cvdownload_unred_count + res.data.cvdownload_count,
          portfoliodetailview_count: portfoliodetailview_unred_count + res.data.portfoliodetailview_count,
        }
        dispatch(setUnreadNotificationCount(data_unred))
      }
    }
    loadNumberNotification();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.parent}>

        {registeredOnlineVisitor > 0 && newOnlineVisitor > 0 ? (
          <MyDashboard
            title="En ligne"
            ioniconsElementName="information-circle-outline"
            numbers={registeredOnlineVisitor + newOnlineVisitor}
            content={
              <Text>
                <Text style={{ color: globalStyles.primaryColor.color }}>{registeredOnlineVisitor}</Text> récurrent(s) et
                <Text style={{ color: globalStyles.primaryColor.color }}> {newOnlineVisitor}</Text> nouveau(x) visiteur(s) connecté(s)
              </Text>
            }
          />
        ) : registeredOnlineVisitor > 0 && newOnlineVisitor === 0 ? (
          <MyDashboard
            title="En ligne"
            ioniconsElementName="information-circle-outline"
            numbers={registeredOnlineVisitor}
            content={
              <>
              <Text style={{ color: globalStyles.primaryColor.color }}>{registeredOnlineVisitor}</Text> récurrent(s) visiteur(s) connecté(s)
              </>
            }
          />
        ) : registeredOnlineVisitor === 0 && newOnlineVisitor > 0 ? (
          <MyDashboard
            title="En ligne"
            ioniconsElementName="information-circle-outline"
            numbers={newOnlineVisitor}
            content={
              <>
              <Text style={{ color: globalStyles.primaryColor.color }}>{newOnlineVisitor}</Text> nouveau(x) visiteur(s) connecté(s)
              </>
            }
          />
        ) : (
          <MyDashboard
            title="En ligne"
            ioniconsElementName="information-circle-outline"
            numbers={0}
            content="Aucun visiteur connecté pour le moment"
          />
        )}
        <MyDashboard title="Métriques de visites" ioniconsElementName="people" numbers={0} content="Nombre total de visites accumulés" percentage="0%" textPercentage=" depuis le mois dernier" />
        <MyDashboard title="Vues du portfolio-détails" ioniconsElementName="eye" numbers={373} content="Total des vues de pages sur le portfolio" ioniconsName="arrow-down" percentage="2,9%" textPercentage=" depuis le mois dernier" />
        <MyDashboard title="CV download" ioniconsElementName="download" numbers={42} content="Nombre de CV téléchargés" ioniconsName="arrow-up" percentage="23%" textPercentage=" depuis le mois dernier" />
      </View>
      {/* <View style={styles.parent}>
        <Chart/>
        <Histogram data={histogramData}/>
        <ProgressRing/>
      </View> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalStyles.backgroundColorPrimary.backgroundColor,
  },
  parent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    columnGap: 15,
    rowGap: 15,
  },
});