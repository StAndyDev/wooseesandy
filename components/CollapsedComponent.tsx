import { useSendMessageToServer } from '@/hooks/useWebSocket';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, Vibration, View } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { useDispatch } from 'react-redux';
import globalStyles from '../app/styles';
import { markAsRead } from '../features/visitorsDataSlice';
import { markCVDownloadAsRead, markPortfolioDetailViewAsRead, markVisitInfoAsRead } from '../services/backend';

// reducers
import { setUnreadNotificationCount } from '../features/numberNotificationSlice';
// redux
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
//hooks
import { useApiBaseUrl } from "@/hooks/useApiBaseUrl";

const CollapsibleSection = ({ title, id_key, is_read, notif_type, onLongPress, icon_notif_name, children }: { title: string; id_key: any; is_read: boolean; notif_type: string; onLongPress?: () => void  ;  icon_notif_name: any; children: React.ReactNode }) => {
  let apiBaseUrl = useApiBaseUrl();
  const [collapsed, setCollapsed] = useState(true);
  const dispatch = useDispatch()
  const sendMessage = useSendMessageToServer();
  // root state : notif count
  const visitinfo_unred_count = useSelector((state: RootState) => state.number_notification.unread.visitinfo_count)
  const cvdownload_unred_count = useSelector((state: RootState) => state.number_notification.unread.cvdownload_count)
  const portfoliodetailview_unred_count = useSelector((state: RootState) => state.number_notification.unread.portfoliodetailview_count)
  
  // update notification number
  const updateNotificationCount = (notif_type: string) => {
    if (notif_type === "data_api" ) {
      dispatch(setUnreadNotificationCount({
        visitinfo_count: visitinfo_unred_count -1,
        cvdownload_count: cvdownload_unred_count,
        portfoliodetailview_count: portfoliodetailview_unred_count,
      }))
    }
    else if (notif_type === "cv_download_alert") {
      dispatch(setUnreadNotificationCount({
        visitinfo_count: visitinfo_unred_count,
        cvdownload_count: cvdownload_unred_count -1,
        portfoliodetailview_count: portfoliodetailview_unred_count,
      }))
    }else if (notif_type === "portfolio_details_view_alert") {
      dispatch(setUnreadNotificationCount({
        visitinfo_count: visitinfo_unred_count,
        cvdownload_count: cvdownload_unred_count,
        portfoliodetailview_count: portfoliodetailview_unred_count -1,
      }))
    }
    
  }
  
  // mark block as read
  const markAsReadBlock = async (id: any, notif: string) => {
    if (collapsed) {

      if (notif === "data_api") {
        const response = await markVisitInfoAsRead(apiBaseUrl, id);
        (response) ? dispatch(markAsRead({ unique_key: id })) : null;
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
        const response = await markCVDownloadAsRead(apiBaseUrl, id);
        (response) ? dispatch(markAsRead({ unique_key: id })) : null;
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
        const response = await markPortfolioDetailViewAsRead(apiBaseUrl, id);
        (response) ? dispatch(markAsRead({ unique_key: id })) : null;
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
      // update state
      updateNotificationCount(notif);

    }
  };
  return (
    <View style={styles.container}>
      <Pressable 
        onPress={() => {
          setCollapsed(!collapsed);
          if (is_read === false) {
            markAsReadBlock(id_key, notif_type);
          }
        }}
        style={styles.header}
        onLongPress={() => {
          Vibration.vibrate(50);
          onLongPress?.(); // équivalent à : if (onLongPress) onLongPress();
        } }
        delayLongPress={400}
        // android_ripple={{ color: '#ddd' }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Ionicons
            style={styles.iconNotifContent}
            name={icon_notif_name}
            size={18}
            color="gray"
          />
          <Text style={styles.title}>{title}</Text>
        </View>
        
        <Ionicons
          name={collapsed ? 'chevron-down' : 'chevron-up'}
          size={20}
          color="gray"
        />
      
      </Pressable >

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
    fontSize: 14,
    fontWeight: 'bold',
    color: globalStyles.primaryText.color,
  },
  content: {
    paddingVertical: 10,
  },
  iconNotifContent: {
    borderWidth: 1,
    padding: 4,
    borderRadius: 5,
    borderColor: globalStyles.secondaryTextWithOpacity.color,
  }
});