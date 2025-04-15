import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { addRegisteredVisitorOnline, removeRegisteredVisitorOnline, addNewVisitorOnline, removeNewVisitorOnline } from '../features/online/onlineSlice'

export const useOnlineSocket = () => {

  const wooseeandy_token = "a3b7e8f9c2d4g5h6j0k1l2m3n9p8q7r"
  const dispatch = useDispatch()

  useEffect(() => {
    let socket = null
    console.log("anaty socket!!!")
    try {
      socket = new WebSocket('ws://127.0.0.1:8000/ws/visitor-tracker/?token=' + wooseeandy_token)
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

    // on open
    socket.onopen = (event) => {
      console.log("WebSocket connecté !");
    };
    // on message
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)

      if (data.alert_type === "visitor_alert") {
        if (data.alert_returning_visitor.trim().length !== 0) dispatch(addRegisteredVisitorOnline(1))
        if (data.alert_new_visitor.trim().length !== 0) dispatch(addNewVisitorOnline(1))
      }
      else if(data.alert_type === "disconnected_alert" && data.is_new_visitor !== undefined) {
        (data.is_new_visitor == true)? dispatch(removeNewVisitorOnline(1)) : dispatch(removeRegisteredVisitorOnline(1))
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