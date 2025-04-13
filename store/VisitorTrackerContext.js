import React, { createContext, useState, useEffect, useContext, useRef } from "react";
import platform from 'platform';

const socketUrl = "ws://127.0.0.1:8000/ws/visitor-tracker/";
const VisitorTrackerContext = createContext();

export const VisitorTrackerProvider = ({ children }) => {

  const [res, setRes] = useState("");
  const [message, setMessage] = useState({
    uuidExists: "",
    navigator_info: "",
    os: "",
    device_type: "",
    ip_address: "",
    location_approx: {
      latitude: "",
      longitude: "",
    },
  });

  // Utilisation d'une référence pour éviter de déclencher le useEffect
  const messageRef = useRef(message);

  useEffect(() => {
    const socketInstance = new WebSocket(socketUrl);
    const messageCopy = { ...messageRef.current };

    // create and send data
    const packageData = () => {
      messageCopy.uuidExists = localStorage.getItem("uuid_sa") === null ? "" : localStorage.getItem("uuid_sa");

      if (socketInstance.readyState === WebSocket.OPEN) {
        messageCopy.navigator_info = navigator.userAgent;
        messageCopy.os = platform.os.toString();
        messageCopy.device_type = platform.os.family;
        messageCopy.ip_address = "192.168.123.23";
        // axios.get('https://api.ipify.org?format=json')
        // .then(response => {
        //   messageCopy.ip_address = response.data.ip;
        // })
        // .catch(error => {
        //   messageCopy.ip_address = "Erreur : " + error;
        // });

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              messageCopy.location_approx.latitude = latitude;
              messageCopy.location_approx.longitude = longitude;
              socketInstance.send(JSON.stringify({ data: messageCopy }));
            },
            (err) => {
              messageCopy.location_approx.latitude = "Erreur : " + err.message;
              messageCopy.location_approx.longitude = "Erreur : " + err.message;
              socketInstance.send(JSON.stringify({ data: messageCopy }));
            }
          );
        } else {
          socketInstance.send(JSON.stringify({ mes: messageCopy }));
        }
      } else {
        console.error("WebSocket n'est pas ouvert !");
      }
    };
    // ON OPEN
    socketInstance.onopen = (event) => {
      console.log("WebSocket connecté !");
      event.preventDefault(); // Empêcher le rechargement de la page
      packageData();
    };
    // ON MESSAGE
    socketInstance.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setRes(data.uuid);
      localStorage.setItem('uuid_sa', data.uuid);
      console.log("Message reçu :", data);
      if(data.alert_returning_visitor){
        console.log("Alert returning visitor ! ", data.alert_returning_visitor, "DATE :", data.visit_start_datetime);
      }else if(data.alert_new_visitor){
        console.log("Alert new visitor ! ", data.alert_new_visitor, "DATE :", data.visit_start_datetime);
      }
      if(data.alert_disconnected_visitor){
        console.log("Alert disconnected visitor ! ", data.alert_disconnected_visitor, "DATE :", data.visit_end_datetime);
      }
    };
    // ON ERROR
    socketInstance.onerror = (error) => {
      console.error("WebSocket Erreur : ", error);
    };
    // ON CLOSE
    socketInstance.onclose = () => {
      console.log("WebSocket déconnecté !");
    };
    // ON UNMOUNT
    return () => {
      if (socketInstance.readyState === WebSocket.OPEN) {
        socketInstance.close();
      }
    };
  }, []);

  return (
    <VisitorTrackerContext.Provider value={{ message, setMessage, res }}>
      {children}
    </VisitorTrackerContext.Provider>
  );
};

export const useVisitorTracker = () => useContext(VisitorTrackerContext);