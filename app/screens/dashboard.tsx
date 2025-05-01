import React, { useState, useEffect } from 'react';
import globalStyles from '../styles';
import MyDashboard from '../../components/DashboardElement';
import Chart from '../../components/ChartElement';
import ProgressRing from '../../components/ProgressElement';
import Histogram from '@/components/HistogramElement';
// redux
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux'
// hooks
import { useOnlineSocket } from '@/hooks/useOnlineSocket';

import {
  ScrollView,
  StyleSheet,
  View,
  Text
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

  useOnlineSocket()

  const [message, setMessage] = useState(''); // Message à envoyer
  const [messages, setMessages] = useState(["azieee", "aranommez", "ranoel", "setkle"]); // Liste des messages reçus
  const [socket, setSocket] = useState(null); // WebSocket instance


  const registeredOnlineVisitor = useSelector((state: RootState) => state.number_online.registered_visitor)
  const newOnlineVisitor = useSelector((state: RootState) => state.number_online.new_visitor)

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
        <MyDashboard title="Vues du portfolio" ioniconsElementName="eye" numbers={373} content="Total des vues de pages sur le portfolio" ioniconsName="arrow-down" percentage="2,9%" textPercentage=" depuis le mois dernier" />
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