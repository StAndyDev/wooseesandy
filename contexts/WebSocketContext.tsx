// src/contexts/WebSocketContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import { useDispatch } from 'react-redux';
import {
  addCurrentMonthCvDownload,
  addCurrentMonthPortfolioDetail,
  addCurrentMonthVisits,
  addCvDownloadCount,
  addVisitorCount,
  addVuesPortfolioDetailsCount,
  setCvDownloadPercentageMonthly,
  setPortfolioDetailPercentageMonthly,
  setVisitInfoPercentageMonthly
} from '../features/counterSlice';
import {
  addNewVisitorOnline,
  addRegisteredVisitorOnline,
  removeNewVisitorOnline,
  removeRegisteredVisitorOnline
} from '../features/numberOnlineSlice';
import {
  addDataAtBeginning,
  updateVisitDuration,
  updateVisitEndDatetime
} from '../features/visitorsDataSlice';

// reducers
import { setReadNotificationCount, setUnreadNotificationCount } from '../features/numberNotificationSlice';
// redux
import { setSocketConnection } from '@/features/connectionSlice'; // setters
import { addMessage, clearMessagesByConnexion } from '@/features/messageStatusSlice';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
// utils
import { calculateChangePercentage } from '../app/utils/stats';
// base url
import { useWsBaseUrl } from '@/hooks/useWsBaseUrl';

// Crée un contexte pour stocker l'instance WebSocket
const WebSocketContext = createContext<WebSocket | null>(null)

// Provider
export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  let wsBaseUrl = useWsBaseUrl();
  const dispatch = useDispatch();
  const socketRef = useRef<WebSocket | null>(null);
  const [socketInstance, setSocketInstance] = useState<WebSocket | null>(null);

  // count
  const visitinfo_unread_count = useSelector((state: RootState) => state.number_notification.unread.visitinfo_count)
  const cvdownload_unread_count = useSelector((state: RootState) => state.number_notification.unread.cvdownload_count)
  const portfoliodetailview_unread_count = useSelector((state: RootState) => state.number_notification.unread.portfoliodetailview_count)
  const visitinfo_read_count = useSelector((state: RootState) => state.number_notification.read.visitinfo_count)
  const cvdownload_read_count = useSelector((state: RootState) => state.number_notification.read.cvdownload_count)
  const portfoliodetailview_read_count = useSelector((state: RootState) => state.number_notification.read.portfoliodetailview_count)
  // count per month
  const current_month_visits = useSelector((state: RootState) => state.counter.current_month_visits )
  const last_month_visits = useSelector((state: RootState) => state.counter.last_month_visits )
  const current_month_cv_download = useSelector((state: RootState) => state.counter.current_month_cv_download)
  const last_month_cv_download = useSelector((state: RootState) => state.counter.last_month_cv_download )
  const current_month_portfolio_detail = useSelector ((state: RootState) => state.counter.current_month_portfolio_detail )
  const last_month_portfolio_detail = useSelector ((state: RootState) => state.counter.last_month_portfolio_detail )

  // ref de cette count
  const visitinfoUnreadRef = useRef(visitinfo_unread_count)
  const cvdownloadUnreadRef = useRef(cvdownload_unread_count)
  const portfolioUnreadRef = useRef(portfoliodetailview_unread_count)
  const visitinfoReadRef = useRef(visitinfo_read_count)
  const cvdownloadReadRef = useRef(cvdownload_read_count)
  const portfolioReadRef = useRef(portfoliodetailview_read_count)
  // ref count per month
  const currentMonthVisitsRef = useRef(current_month_visits)
  const lastMonthVisitsRef = useRef(last_month_visits)
  const currentMonthCvDownloadRef = useRef(current_month_cv_download)
  const lastMonthCvDownloadRef = useRef(last_month_cv_download)
  const currentMonthPortfolioDetailRef = useRef(current_month_portfolio_detail)
  const lastMonthPortfolioDetailRef = useRef(last_month_portfolio_detail)
  
  // Mettre à jour les refs à chaque changement
  useEffect(() => {
    visitinfoUnreadRef.current = visitinfo_unread_count;
    cvdownloadUnreadRef.current = cvdownload_unread_count;
    portfolioUnreadRef.current = portfoliodetailview_unread_count;
    visitinfoReadRef.current = visitinfo_read_count;
    cvdownloadReadRef.current = cvdownload_read_count;
    portfolioReadRef.current = portfoliodetailview_read_count;
    currentMonthVisitsRef.current = current_month_visits;
    lastMonthVisitsRef.current = last_month_visits;
    currentMonthCvDownloadRef.current = current_month_cv_download;
    lastMonthCvDownloadRef.current = last_month_cv_download;
    currentMonthPortfolioDetailRef.current = current_month_portfolio_detail;
    lastMonthPortfolioDetailRef.current = last_month_portfolio_detail;
  }, 
  [
    visitinfo_unread_count, 
    cvdownload_unread_count, 
    portfoliodetailview_unread_count, 
    visitinfo_read_count,
    cvdownload_read_count, 
    portfoliodetailview_read_count,
    current_month_visits,
    last_month_visits,
    current_month_cv_download,
    last_month_cv_download,
    current_month_portfolio_detail,
    last_month_portfolio_detail,
    wsBaseUrl
  ]);

  useEffect(() => {
    initWebSocket();
  }, [dispatch, wsBaseUrl])


  // Fonction pour initialiser la connexion WebSocket
  const initWebSocket = async () => {
    try {
      const socket = new WebSocket(wsBaseUrl);
      socketRef.current = socket;
    // ------------ on open --------------
    socket.onopen = () => {
      dispatch(clearMessagesByConnexion('websocket'));
      dispatch(setSocketConnection(true));
      dispatch(addMessage('success', 'websocket', 'Socket bien connecté'));
      setSocketInstance(socket)
    }
    // --------- on message ------------
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)

      // connection alert
      if (data.alert_type === 'connected_alert') {
        if (data.alert_returning_visitor?.trim()) {
          dispatch(addRegisteredVisitorOnline(1))
        }
        if (data.alert_new_visitor?.trim()) {
          dispatch(addNewVisitorOnline(1))
        }
        dispatch(
          addDataAtBeginning({
            message_type: data.alert_type,
            unique_key: data.visit_info_uuid,
            date_sort: data.visit_end_datetime || data.visit_start_datetime,
            visitor_uuid: data.visitor_uuid,
            visit_info_uuid: data.visit_info_uuid,
            alert_new_visitor: data.alert_new_visitor,
            alert_returning_visitor: data.alert_returning_visitor,
            visit_start_datetime: data.visit_start_datetime,
            visit_end_datetime: data.visit_end_datetime,
            visit_duration: data.visit_duration,
            navigator_info: data.navigator_info,
            os: data.os,
            device_type: data.device_type,
            ip_address: data.ip_address,
            location_approx: data.location_approx,
            is_read: data.is_read
          })
        )
        // maj du redux state via socket
        // charger en Redux , visitInfo
        if (data.is_read == false){
          const data_unread = {
            visitinfo_count: visitinfoUnreadRef.current + 1,
            cvdownload_count: cvdownloadUnreadRef.current,
            portfoliodetailview_count: portfolioUnreadRef.current,
          }
          dispatch(setUnreadNotificationCount(data_unread))
        }else {
          const data_read = {
            visitinfo_count: visitinfoReadRef.current + 1,
            cvdownload_count: cvdownloadReadRef.current,
            portfoliodetailview_count: portfolioReadRef.current,
          }
          dispatch(setReadNotificationCount(data_read));
        }
        // maj visitor counter
        if(data.alert_new_visitor.trim() !== "") {
          dispatch(addVisitorCount(1));
        }
        // maj counter per month
        const visitInfoMonthPercentage = calculateChangePercentage(currentMonthVisitsRef.current + 1, lastMonthVisitsRef.current);
        dispatch(addCurrentMonthVisits(1));
        dispatch(setVisitInfoPercentageMonthly(visitInfoMonthPercentage));
        
      
      /******* DISCONNECTED ALERT *******/
      } else if (data.alert_type === 'disconnected_alert' && data.is_new_visitor !== undefined) {
        if (data.is_new_visitor) {
          dispatch(removeNewVisitorOnline(1))
        } else {
          dispatch(removeRegisteredVisitorOnline(1))
        }

        if (data.visit_end_datetime?.trim()) {
          dispatch(
            updateVisitEndDatetime({
              visit_info_uuid: data.visit_info_uuid,
              visit_end_datetime: data.visit_end_datetime
            })
          )
        }

        if (data.visit_duration?.trim()) {
          dispatch(
            updateVisitDuration({
              visit_info_uuid: data.visit_info_uuid,
              visit_duration: data.visit_duration
            })
          )
        }
      }

      // cv download alert
      else if (data.alert_type === 'cv_download_alert') {
        dispatch(
          addDataAtBeginning({
            message_type: data.alert_type,
            unique_key: data.id_cv_download,
            date_sort: data.download_datetime,
            id_cv_download: data.id_cv_download,
            visitor_uuid: data.visitor_uuid,
            download_datetime: data.download_datetime,
            is_read: data.is_read
          })
        )
        // maj du redux state via socket
        // charger en Redux , cvDownload
        if (data.is_read == false){
          const data_unread = {
            visitinfo_count: visitinfoUnreadRef.current,
            cvdownload_count: cvdownloadUnreadRef.current + 1,
            portfoliodetailview_count: portfolioUnreadRef.current,
          }
          dispatch(setUnreadNotificationCount(data_unread))
        } else {
          const data_read = {
            visitinfo_count: visitinfoReadRef.current,
            cvdownload_count: cvdownloadReadRef.current + 1,
            portfoliodetailview_count: portfolioReadRef.current,
          }
          dispatch(setReadNotificationCount(data_read))
        }
        // maj cvdownload count
        dispatch(addCvDownloadCount(1))
        // maj counter per month
        const cvDownloadMonthPercentage = calculateChangePercentage(currentMonthCvDownloadRef.current + 1, lastMonthCvDownloadRef.current);
        dispatch(addCurrentMonthCvDownload(1));
        dispatch(setCvDownloadPercentageMonthly(cvDownloadMonthPercentage));
        
      }
      // portfolio details view alert
      else if (data.alert_type === 'portfolio_details_view_alert') {
        dispatch(
          addDataAtBeginning({
            message_type: data.alert_type,
            unique_key: data.id_portfolio_detail_view,
            date_sort: data.view_datetime,
            visitor_uuid: data.visitor_uuid,
            id_portfolio_detail_view: data.id_portfolio_detail_view,
            project_name: data.project_name,
            project_type: data.project_type,
            view_datetime: data.view_datetime,
            is_read: data.is_read
          })
        )
        // maj du redux state via socket
        // charger en Redux , portfolioDetailsView
        if (data.is_read == false){
          const data_unread = {
            visitinfo_count: visitinfoUnreadRef.current,
            cvdownload_count: cvdownloadUnreadRef.current,
            portfoliodetailview_count: portfolioUnreadRef.current + 1,
          }
          dispatch(setUnreadNotificationCount(data_unread))
        }else {
          const data_read = {
            visitinfo_count: visitinfoReadRef.current,
            cvdownload_count: cvdownloadReadRef.current,
            portfoliodetailview_count: portfolioReadRef.current + 1,
          }
          dispatch(setUnreadNotificationCount(data_read))
        }
        // portfoliodetailsview count
        dispatch(addVuesPortfolioDetailsCount(1))
        // maj counter per month
        const portfolioDetailMonthPercentage = calculateChangePercentage(currentMonthPortfolioDetailRef.current + 1, lastMonthPortfolioDetailRef.current);
                dispatch(addCurrentMonthPortfolioDetail(1));
                dispatch(setPortfolioDetailPercentageMonthly(portfolioDetailMonthPercentage));
      }
    }

    // on error
    socket.onerror = (event) => {
      dispatch(clearMessagesByConnexion('websocket'));
      dispatch(setSocketConnection(false));
      dispatch(addMessage('error', 'websocket', 'impossible de se connecter'));
    };

    // on close
    socket.onclose = (event) => {
      if (!event.wasClean) {
        dispatch(clearMessagesByConnexion('websocket'));
        dispatch(setSocketConnection(false));
        dispatch(addMessage('warning', 'websocket', 'Connexion perdue ! veuillez vérifier votre connexion internet'));
      } else {
        dispatch(clearMessagesByConnexion('websocket'));
        dispatch(setSocketConnection(false));
        dispatch(addMessage('info', 'websocket','Socket fermé proprement'));
      }
    };
    
    return () => {
      socket.close()
      dispatch(clearMessagesByConnexion('websocket'));
      dispatch(setSocketConnection(false));
      dispatch(addMessage('info', 'websocket','Socket déconnecté !'));
    }
  } catch (error) {
    dispatch(clearMessagesByConnexion('websocket'));
    dispatch(setSocketConnection(false));
    dispatch(addMessage('error', 'websocket','Socket fermée de manière inattendue :'+error));
  }
  }

  return (
    <WebSocketContext.Provider value={socketInstance}>
      {children}
    </WebSocketContext.Provider>
  )
}

// Hook personnalisé pour utiliser le contexte
export const useWebSocketContext = () => useContext(WebSocketContext)