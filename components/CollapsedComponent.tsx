import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { Ionicons } from '@expo/vector-icons';
import globalStyles from '../app/styles';
import { markVisitInfoAsRead, markCVDownloadAsRead, markPortfolioDetailViewAsRead } from '../api/visitorsDataApi'
import { useDispatch } from 'react-redux'
import { markAsRead } from '../features/visitorsDataSlice'
import { useSendMessageToServer } from '@/hooks/useWebSocket';

const CollapsibleSection = ({ title, id_key, is_read, notif_type, children }: { title: string; id_key: any; is_read: boolean; notif_type: string; children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(true);
  const dispatch = useDispatch()
  const sendMessage = useSendMessageToServer();
  const markAsReadBlock = async (id: any, notif: string) => {
    if (collapsed) {

      if (notif === "data_api") {
        const response = await markVisitInfoAsRead(id);
        (response.status === 200) ? dispatch(markAsRead({ unique_key: id })) : null;
        // send update to the server
        sendMessage({
          data: {
            type: 'update_server_cache',
            uuid: id,
            cache_type: notif,
            is_read: true,
          },
        });

      } 
      
      else if (notif === "cv_download_alert") {
        const response = await markCVDownloadAsRead(id);
        (response.status === 200) ? dispatch(markAsRead({ unique_key: id })) : null;
        // send update to the server
        sendMessage({
          data: {
            type: 'update_server_cache',
            uuid: id,
            cache_type: notif,
            is_read: true,
          },
        });

      } else if (notif === "portfolio_details_view_alert") {
        const response = await markPortfolioDetailViewAsRead(id);
        (response.status === 200) ? dispatch(markAsRead({ unique_key: id })) : null;
        // send update to the server
        sendMessage({
          data: {
            type: 'update_server_cache',
            uuid: id,
            cache_type: notif,
            is_read: true,
          },
        });
      }

    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          setCollapsed(!collapsed);
          if (is_read === false) {
            markAsReadBlock(id_key, notif_type);
          }
        }}
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