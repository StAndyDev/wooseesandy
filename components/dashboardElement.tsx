import { Ionicons } from "@expo/vector-icons";
import { MotiView } from 'moti'; // animationd
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import globalStyles from '../app/styles';

interface MyDashboard {
    title: string;
    activeTitleAnimation?: boolean; // pour gérer l'animation du titre si nécessaire
    ioniconsElementName: string;
    numbers: number;
    content: React.ReactNode; // car content est un composant
    ioniconsName?: "arrow-up" | "arrow-down" | "remove";
    percentage?: string;
    textPercentage?: string;
    loadingNumbers?: boolean; // pour gérer le chargement si nécessaire
    indexAnimation: number; // pour gérer l'index si nécessaire
}

const DashboardElement: React.FC<MyDashboard> = ({ title, ioniconsElementName, numbers, loadingNumbers, content, ioniconsName, percentage, textPercentage, indexAnimation }) => {
  return (
        <MotiView
        style={styles.element}
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: indexAnimation*100 }}
        >
          <View style={styles.child}>
            <Text
             style={styles.titleElement}>
              {title}
            </Text>
            <Ionicons name={ioniconsElementName as any} size={16} color={globalStyles.primaryColor.color} style={{ marginRight: 5 }} />
          </View>
        <View style={styles.child}>
          {loadingNumbers === true ? (
            <ActivityIndicator color={globalStyles.primaryColor.color} size="small" />
          ) : (
            <Text style={{ color: globalStyles.primaryText.color, fontSize: 20, fontWeight: 'bold' }}>
              {numbers}
            </Text>
          )}
        </View>
          <View style={styles.child}>
            <Text style={styles.contentElement}>{content}</Text>
          </View>
          <View style={styles.child}>
        
              {ioniconsName === "arrow-up" ? (
                <Text style={{color: globalStyles.secondaryText.color, display: 'flex',alignItems: 'center'}}>
                    <Ionicons name={ioniconsName as any} size={16} color={globalStyles.primaryColor.color} style={{ marginRight: 5 }} />
                    <Text style={{color: globalStyles.primaryColor.color, fontWeight: 'bold'}}>{percentage}</Text> {textPercentage}
                </Text>
              ) : ioniconsName === "arrow-down" ? (
                <Text style={{color: globalStyles.secondaryText.color, display: 'flex',alignItems: 'center'}}>
                    <Ionicons name={ioniconsName as any} size={16} color={globalStyles.dangerColor.color} style={{ marginRight: 5 }} />
                    <Text style={{color: globalStyles.dangerColor.color, fontWeight: 'bold'}}>{percentage}</Text>{" "}{textPercentage}
                </Text>
              ) : (
                <Text style={{color: globalStyles.secondaryText.color, display: 'flex',alignItems: 'center'}}>
                    <Text style={{color: globalStyles.secondaryText.color, fontWeight: 'bold'}}>{percentage}</Text>{" "}{textPercentage}
                </Text>
              )}
              
            
          </View>
        </MotiView>
    );
};

export default DashboardElement;

const styles = StyleSheet.create({
    element: {
      flex: 1,
      height: 130,
      minWidth: 200,
      padding: globalStyles.boxPadding.padding,
      borderRadius: globalStyles.boxBorderRadius.borderRadius,
      borderWidth: globalStyles.boxBorderWidth.borderWidth,
      borderColor: globalStyles.quaternaryColorWithOpacity.color,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: globalStyles.backgroundColorSecondary.backgroundColor,
    },
    titleElement: {
      color: globalStyles.secondaryText.color,
      fontWeight: 'bold',
      fontSize: 14,
    },
    contentElement: {
      color: globalStyles.secondaryText.color,
    },
    child: {
      width: '100%',
      flexDirection: 'row',
      marginVertical: 2,
      justifyContent: 'space-between'
    },
  });
