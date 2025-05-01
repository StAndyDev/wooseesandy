import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { addRegisteredVisitorOnline, removeRegisteredVisitorOnline, addNewVisitorOnline, removeNewVisitorOnline } from '../features/numberOnlineSlice'
import { addVisitor, updateVisitEndDatetime, updateVisitDuration } from '../features/visitorsDataSlice'

export const useOnlineSocket = () => {

  const wooseeandy_token = "a3b7e8f9c2d4g5h6j0k1l2m3n9p8q7r"
  const dispatch = useDispatch()

  useEffect(() => {
    let socket = null
    console.log("anaty socket!!!")
    try {
      // socket = new WebSocket('ws://127.0.0.1:8000/ws/visitor-tracker/?token=' + wooseeandy_token)
      socket = new WebSocket('ws://192.168.137.1:8000/ws/visitor-tracker/?token=' + wooseeandy_token)
      console.log("SOCKET : " + socket)
    }
    catch (error) {
      console.error('WebSocket error:', error)
    }
    finally {
      if (socket === null) {
        console.error('WebSocket connection failed')
        return
      }
    }

    // ON OPEN
    socket.onopen = (event) => {
      console.log("WebSocket connecté !");
    };

    // ON MESSAGE
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      // DATA : ALERT CONNEXION
      if (data.alert_type === "connected_alert") {
        // state nbr online : returning/new
        if (data.alert_returning_visitor.replace(/\s+/g, '').length !== 0) dispatch(addRegisteredVisitorOnline(1))
        if (data.alert_new_visitor.replace(/\s+/g, '').length !== 0) dispatch(addNewVisitorOnline(1))
        // state visitor data
        const visitorData = {
          alert_type: data.alert_type,
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
          is_read: false
        }
        dispatch(addVisitor(visitorData))
      }
      // DATA : ALERT DECONNEXION
      else if(data.alert_type === "disconnected_alert" && data.is_new_visitor !== undefined) {
        (data.is_new_visitor == true)? dispatch(removeNewVisitorOnline(1)) : dispatch(removeRegisteredVisitorOnline(1));
        // update visitor data
        (data.visit_end_datetime !== undefined && data.visit_end_datetime.replace(/\s+/g, '') !== "")? dispatch(updateVisitEndDatetime({ visit_info_uuid: data.visit_info_uuid, visit_end_datetime: data.visit_end_datetime })) : null;
        (data.visit_duration !== undefined && data.visit_duration.replace(/\s+/g, '') !== "")? dispatch(updateVisitDuration({ visit_info_uuid: data.visit_info_uuid, visit_duration: data.visit_duration })) : null;
      }

    }

    socket.onerror = (e) => {
      console.error('WebSocket error:', e)
    }

    return () => {
      socket.close()
    }
  }, [dispatch])
}