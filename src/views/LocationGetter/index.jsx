import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import Geolocation from "@react-native-community/geolocation";

export default function LocationGetter() {
  const [location, setLocation] = useState(null);
  const [showLocationRealTime, SetShowLocationRealTime] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Solicitar permiso de ubicación (si no está concedido)
    Geolocation.requestAuthorization();

    const fetchLocation = () => {
      if (showLocationRealTime) {
        // Obtener la ubicación actual
        Geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });
            console.log({ latitude, longitude });
          },
          (error) => {
            console.error("Error al obtener la ubicación:", error);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000, // 15 segundos
            maximumAge: 10000, // 10 segundos (usar cache)
          }
        );
      }
    };

    // Obtener la ubicación inicial
    fetchLocation();

    // Actualizar la ubicación cada 10 segundos
    // const interval = setInterval(fetchLocation, 2000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Ubicación actual:</Text>
      {location ? (
        <Text>
          Latitud: {location.latitude}, Longitud: {location.longitude}
        </Text>
      ) : (
        <Text>Obteniendo ubicación...</Text>
      )}
    </View>
  );
}
