import React, { useState, useEffect } from 'react';
import globalStyles from '../styles';
import MyDashboard from '../../components/DashboardElement';
import Chart from '../../components/ChartElement';
import ProgressRing from '../../components/ProgressElement';
import Map from '@/components/MapElement';

import {
  ScrollView ,
  StyleSheet,
  View,
} from 'react-native';

export default function Dashboard() {
  const [message, setMessage] = useState(''); // Message à envoyer
  const [messages, setMessages] = useState(["azieee", "aranommez", "ranoel", "setkle"]); // Liste des messages reçus
  const [socket, setSocket] = useState(null); // WebSocket instance


  return (
    <ScrollView style={styles.container}>
      <View style={styles.parent}>
        <MyDashboard title="Active Now" ioniconsElementName="information-circle-outline" numbers={3} content="1 Current visitos and 2 new Visitors" />
        <MyDashboard title="Total Visitors" ioniconsElementName="people" numbers={1208} content="Unique visitors to you portfolio" ioniconsName="arrow-up" percentage="12,5%" textPercentage="from last week" />
        <MyDashboard title="Page Views" ioniconsElementName="eye" numbers={35473} content="Total page views across all sections" ioniconsName="arrow-down" percentage="2,9%" textPercentage="from last week" />
        <MyDashboard title="Interactions" ioniconsElementName="book" numbers={453002} content="Cliks scrolls, and forum submissions" ioniconsName="arrow-up" percentage="23%" textPercentage="from last week" />
      </View>
      <View style={styles.parent}>
        <Chart/>
        <ProgressRing/>
      </View>      
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