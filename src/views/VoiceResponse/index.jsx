// import React, { useState, useEffect } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   SafeAreaView,
//   Image,
//   TouchableHighlight,
//   ScrollView,
// } from "react-native";
// import Icon from "react-native-vector-icons/FontAwesome"; // Importa el icono de la librería
// import { useTailwind } from "tailwind-rn";
// import Tts from "react-native-tts";

// export default VoiceResponse = () => {
//   const tailwind = useTailwind();

//   useEffect(() => {
//     // Configura react-native-tts
//     Tts.setDefaultLanguage("es-ES"); // Establece el idioma (cambia a tu idioma)
//     Tts.setDefaultRate(0.5); // Establece la velocidad de habla (opcional)
//     Tts.setDefaultPitch(1); // Establece el tono de voz (opcional)
//   }, []);

//   const saveTask = () => {
//     Tts.speak("hola en que puedo ayudarte");
//   };

//   return (
//     <View style={tailwind("flex-1 items-center justify-center bg-white")}>
//       <TouchableHighlight
//         onPress={saveTask}
//         style={tailwind(
//           "bg-blue-500 p-8 rounded-full h-64 w-64 flex items-center justify-center"
//         )}
//       >
//         <Icon name="microphone" style={tailwind("text-white text-[200px]")} />
//       </TouchableHighlight>
//     </View>
//   );
// };
