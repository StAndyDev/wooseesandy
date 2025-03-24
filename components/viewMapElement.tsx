import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const MapElement = () => {
  // Liste de points à afficher (latitude, longitude)
  const markers = [
    {
      id: 1,
      title: "Paris",
      description: "Capitale de la France",
      latlng: { latitude: 48.8566, longitude: 2.3522 }
    },
    {
      id: 2,
      title: "Lyon",
      description: "Ville dans le sud-est de la France",
      latlng: { latitude: 45.7640, longitude: 4.8357 }
    },
    {
      id: 3,
      title: "Marseille",
      description: "Ville portuaire du sud de la France",
      latlng: { latitude: 43.2965, longitude: 5.3698 }
    }
  ];

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 46.2276, // Centre sur la France
          longitude: 2.2137,
          latitudeDelta: 8,   // Zoom (plus la valeur est petite, plus le zoom est proche)
          longitudeDelta: 8,
        }}
      >
        {markers.map(marker => (
          <Marker
            key={marker.id}
            coordinate={marker.latlng}
            title={marker.title}
            description={marker.description}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 500,
    width: 100,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default MapElement;