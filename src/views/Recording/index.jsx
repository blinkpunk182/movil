import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableHighlight,
  ScrollView,
} from "react-native";
import Voice from "@react-native-community/voice";
import Icon from "react-native-vector-icons/FontAwesome"; // Importa el icono de la librería
import { useTailwind } from "tailwind-rn";
import {
  cerrarSesion,
  dataVoice,
  registerActivity,
  registerCode,
} from "./utils/extends";
import { convertTextToSlug } from "../../utils/functions";
import Tts from "react-native-tts";

export default Recording = ({ setRefresh, refresh }) => {
  const tailwind = useTailwind();
  const [partialResults, setPartialResults] = useState([]);
  const [results, setResults] = useState([]);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    // initVoice();
    Tts.getInitStatus().then((e) => {
      if (e === "success") {
        Tts.setDefaultLanguage("es-ES"); // Establece el idioma (cambia a tu idioma)
        Tts.setDefaultRate(0.5); // Establece la velocidad de habla (opcional)
        Tts.setDefaultPitch(1); // Establece el tono de voz (opcional)
      }
    });

    const onSpeechStart = (e) => {
      console.log("onSpeechStart: ", e);
      console.log(e);
      // setStarted("√");
    };
    const onSpeechEnd = (e) => {
      console.log("onSpeechEnd: ", e);
      // setEnd(e.value);
      setIsRecording(false);
    };
    const onSpeechError = (e) => {
      console.log("onSpeechError: ", e);
      setIsRecording(false);

      // setError(e.value);
    };
    const onSpeechResults = (e) => {
      console.log("onSpeechResults: ", e);
      setResults(e.value);
      setTimeout(() => {
        save(e.value);
      }, 1000);
    };
    const onSpeechPartialResults = (e) => {
      console.log("onSpeechPartialResults: ", e);
      setPartialResults(e.value);
    };
    const onSpeechVolumeChanged = (e) => {
      console.log("onSpeechVolumeChanged: ", e);
      // setPitch(e.value);
    };

    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  // Voice.getSpeechRecognitionServices().then((e) => {
  //   console.log(e.length);
  //   if (e.length === 0) {
  //     return (
  //       <View style={tailwind("flex-1 items-center justify-center bg-white")}>
  //         <Text>Versión de paquetes de Google, no compatibles</Text>
  //       </View>
  //     );
  //   }
  // });

  const _startRecognizing = async () => {
    try {
      setIsRecording(true);
      await Voice.start("es-ES");
      // setPitch("");
      // setError("");
      // setStarted("");
      setResults([]);
      setPartialResults([]);
      // setEnd("");      }
    } catch (e) {
      console.error(e);
      console.log("catch");
    }
  };

  const save = async (value = []) => {
    const finalValue = value.length > 0 ? convertTextToSlug(value[0]) : [];

    if (finalValue.startsWith("tutorado")) {
      registerCode(finalValue, setRefresh, refresh);
      return;
    } else {
      const { output = () => registerActivity(finalValue) } =
        dataVoice.find((dv) => dv?.input?.includes(finalValue)) || {};
      output(setRefresh, refresh);
    }
  };

  return (
    <View style={tailwind("flex-1 items-center justify-center bg-white")}>
      <TouchableHighlight
        disabled={isRecording ? true : false}
        onPress={_startRecognizing}
        style={tailwind(
          `${
            !isRecording ? "bg-red-500" : "bg-green-500"
          } p-8 rounded-full h-72 w-72 flex items-center justify-center`
        )}
      >
        <Icon name="microphone" style={tailwind("text-white text-[200px]")} />
      </TouchableHighlight>
    </View>
  );
};
