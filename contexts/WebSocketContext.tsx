// src/contexts/WebSocketContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import { useDispatch } from 'react-redux'
import {
  addRegisteredVisitorOnline,
  removeRegisteredVisitorOnline,
  addNewVisitorOnline,
  removeNewVisitorOnline
} from '../features/numberOnlineSlice'
import {
  addDataAtBeginning,
  updateVisitEndDatetime,
  updateVisitDuration
} from '../features/visitorsDataSlice'

// Crée un contexte pour stocker l'instance WebSocket
const WebSocketContext = createContext<WebSocket | null>(null)

// Provider
export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch()
  const socketRef = useRef<WebSocket | null>(null)
  const [socketInstance, setSocketInstance] = useState<WebSocket | null>(null)

  useEffect(() => {
    const wooseeandy_token = 'a3b7e8f9c2d4g5h6j0k1l2m3n9p8q7r'
    // const wsUrl = `ws://127.0.0.1:8000/ws/visitor-tracker/?token=${wooseeandy_token}`
    const wsUrl = `ws://192.168.137.1:8000/ws/visitor-tracker/?token=${wooseeandy_token}`

    const socket = new WebSocket(wsUrl)
    socketRef.current = socket

    socket.onopen = () => {
      console.log('WebSocket connecté !')
      setSocketInstance(socket)
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)

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
      } else if (data.alert_type === 'cv_download_alert') {
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
      } else if (data.alert_type === 'portfolio_details_view_alert') {
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
      }
    }

    socket.onerror = (e) => {
      console.error('WebSocket error:', e)
    }

    return () => {
      socket.close()
      console.log('WebSocket déconnecté !')
    }
  }, [dispatch])

  return (
    <WebSocketContext.Provider value={socketInstance}>
      {children}
    </WebSocketContext.Provider>
  )
}

// Hook personnalisé pour utiliser le contexte
export const useWebSocketContext = () => useContext(WebSocketContext)