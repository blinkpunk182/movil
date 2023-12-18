import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome"; // Importa el icono de la librería
import { useTailwind } from "tailwind-rn";

export default Home = () => {
  const tailwind = useTailwind();

  const onPressRecord = () => {
    // Aquí podrías implementar la lógica para comenzar a grabar audio

    console.log("sss");
  };

  return (
    <View style={tailwind("flex-1 items-center justify-center bg-white")}>
      <TouchableOpacity
        onPress={onPressRecord}
        style={tailwind(
          ` p-8 rounded-full h-64 w-64 flex items-center justify-center`
        )}
      >
        <Icon name="microphone" style={tailwind("text-white text-[200px]")} />
      </TouchableOpacity>
    </View>
  );
};
