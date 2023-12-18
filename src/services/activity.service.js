import axios from "axios";
import { BASE_API_URL } from "../utils/constants";
import SharedPreferences from "react-native-shared-preferences";

export const apiPostActivity = async (data) => {
  try {
    const response = await axios.post(`${BASE_API_URL}/activity`, data);
    return response || {};
  } catch (error) {
    console.log(error);
  }
};

export const apiAuthTutorado = async (codigo) => {
  try {
    const response = await axios.post(
      `${BASE_API_URL}/auth/signin-tutorado/${codigo}`
    );
    return response || {};
  } catch (error) {
    return error?.response?.data?.error || "";
  }
};

export const saveLocation = async (idTutorado, ubicacion) => {
  try {
    const response = await axios.put(
      `${BASE_API_URL}/tutorado/saveLocation/${idTutorado}`,
      {
        ubicacion,
      }
    );
    return response || {};
  } catch (error) {
    console.log(error);
  }
};

export const saveDataSP = async (key, value) => {
  await SharedPreferences.setItem(key, value);
};

export const getDataSP = async (key) => {
  return new Promise((resolve) => {
    SharedPreferences.getItem(key, (value) => {
      resolve(value);
    });
  });
};

export const removeDataSP = async () => {
  SharedPreferences.clear();
};
