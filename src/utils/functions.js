import Tts from "react-native-tts";

export const initVoice = () => {
  Tts.getInitStatus().then(() => {
    // Tts.setDefaultLanguage("es-MX"); // Establece el idioma (cambia a tu idioma)
    Tts.setDefaultLanguage("es-ES"); // Establece el idioma (cambia a tu idioma)
    Tts.setDefaultRate(0.5); // Establece la velocidad de habla (opcional)
    Tts.setDefaultPitch(1); // Establece el tono de voz (opcional)
  });
};

export const responseVoice = (voice = "Sin resultado") => {
  Tts.speak(voice);
};

export const convertSlugToText = (slug = "") => {
  return slug
    ?.split("_") // Dividir el slug en partes separadas por guiones
    ?.map((part) => part.charAt(0).toUpperCase() + part.slice(1)) // Convertir la primera letra de cada parte en mayúscula
    ?.join(" "); // Unir las partes con espacios en blanco
};

export const convertTextToSlug = (text = "") => {
  return text
    ?.normalize("NFD")
    ?.replace(/[\u0300-\u036f]/g, "")
    ?.toLowerCase()
    ?.replace(/\s+/g, "_");
};

export const pointInPolygon = (point, polygon) => {
  if (point.length > 0 && polygon.length > 0) {
    var x = point[0],
      y = point[1];
    var inside = false;
    for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      var xi = polygon[i][0],
        yi = polygon[i][1];
      var xj = polygon[j][0],
        yj = polygon[j][1];
      var intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  }
  return false;
};

export const formatearFecha = (fecha) => {
  const diasSemana = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const diaSemana = diasSemana[fecha.getDay()];
  const diaMes = fecha.getDate();
  const mes = meses[fecha.getMonth()];
  const anio = fecha.getFullYear();
  let hora = fecha.getHours();
  let minutos = fecha.getMinutes();

  // Formatear la hora en formato de 12 horas (AM/PM)
  const amPm = hora >= 12 ? "PM" : "AM";
  hora = hora % 12 || 12; // Convertir la hora a formato de 12 horas

  // Agregar un 0 delante si los minutos son menores a 10
  minutos = minutos < 10 ? "0" + minutos : minutos;

  const fechaFormateada = `${diaSemana} ${diaMes} de ${mes} del ${anio} a las ${hora}:${minutos}${amPm}`;
  return fechaFormateada;
};
