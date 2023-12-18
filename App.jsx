import { TailwindProvider } from "tailwind-rn";
import utilities from "./tailwind.json";
import Recording from "./src/views/Recording";
import Geolocation from "@react-native-community/geolocation";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  getDataSP,
  saveDataSP,
  saveLocation,
} from "./src/services/activity.service";
import { BASE_URL } from "./src/utils/constants";
import { formatearFecha, pointInPolygon } from "./src/utils/functions";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import { saveNotification } from "./src/services/notificacion.service";

export default App = () => {
  const socket = io(BASE_URL);
  const [refresh, setRefresh] = useState(false);
  const [realTime, setRealTime] = useState(true);

  useEffect(() => {
    obtenerPermisoUbicacion();
  }, [refresh, realTime]);

  useEffect(() => {
    socket.on("actualizarPerimetro", async (data) => {
      await saveDataSP("tutorado", JSON.stringify(data));
    });
    socket.on("realTime", async (data) => {
      setRealTime(data);
    });
    return () => {
      socket.off("actualizarPerimetro");
      socket.off("realTime");
      socket.disconnect();
    };
  }, [realTime]);

  const obtenerUbicacion = async () => {
    const sp = await getDataSP("tutorado");
    const tutorado = JSON.parse(sp);
    if (tutorado && realTime) {
      Geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const ubicacion = {
            latitude,
            longitude,
          };
          console.log(ubicacion);
          socket.emit("ubicacion", { ubicacion, idTutorado: tutorado?._id });
          await saveLocation(tutorado?._id, ubicacion);
          const inPerimeter = pointInPolygon(
            [longitude, latitude],
            tutorado?.perimetro || "[]" || []
          );
          alertPerimetro(inPerimeter, tutorado, ubicacion);
        },
        (error) => {
          console.error(error);
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 0.01,
        }
      );
    } else {
      console.log("sin usuario");
    }
  };

  const alertPerimetro = async (inPerimeter, tutorado, ubicacion) => {
    console.log({ tutorado });
    if (tutorado?.perimetro?.length > 0 && !inPerimeter) {
      const data = {
        tutorado: tutorado?._id,
        mensaje: "El tutorado se ha salido del perimentro",
        fecha: formatearFecha(new Date()),
        ubicacion: JSON.stringify(ubicacion),
      };
      const resp = await saveNotification(data);
      if (resp) {
        socket.emit("notificacion", data);
      }
    }
  };

  const obtenerPermisoUbicacion = async () => {
    const solicitarPermisoRecursivamente = async () => {
      const result = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

      if (result === RESULTS.GRANTED) {
        // El permiso ya está otorgado, iniciar el seguimiento de la ubicación
        console.log("Permiso de ubicación otorgado.");
        obtenerUbicacion();
      } else {
        // El permiso no está otorgado, solicitarlo al usuario
        const requestResult = await request(
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        );
        if (requestResult === RESULTS.GRANTED) {
          // El usuario otorgó el permiso, iniciar el seguimiento de la ubicación
          console.log("Permiso de ubicación otorgado.");
          obtenerUbicacion();
        } else {
          // El usuario denegó el permiso, volver a solicitar
          console.log(
            "El usuario denegó el permiso de ubicación. Volviendo a solicitar..."
          );
          solicitarPermisoRecursivamente();
        }
      }
    };

    // Iniciar el proceso de solicitud de permiso
    solicitarPermisoRecursivamente();
  };

  return (
    <TailwindProvider utilities={utilities}>
      <Recording setRefresh={setRefresh} refresh={refresh} />
    </TailwindProvider>
  );
};
