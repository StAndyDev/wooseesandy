import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { Ionicons } from '@expo/vector-icons';
import globalStyles from '../app/styles';

const CollapsibleSection = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setCollapsed(!collapsed)}
        style={styles.header}
      >
        <Text style={styles.title}>{title}</Text>
        <Ionicons
          name={collapsed ? 'chevron-down' : 'chevron-up'}
          size={20}
          color="gray"
        />
      </TouchableOpacity>

      <Collapsible collapsed={collapsed}>
        <View style={styles.content}>
          {children}
        </View>
      </Collapsible>
    </View>
  );
};

export default CollapsibleSection;

const styles = StyleSheet.create({
  container: {
    // marginVertical: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: globalStyles.primaryText.color,
  },
  content: {
    paddingVertical: 10,
  }
});