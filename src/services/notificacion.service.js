import axios from "axios";
import { BASE_API_URL } from "../utils/constants";
export const saveNotification = async (data) => {
  try {
    const response = await axios.post(`${BASE_API_URL}/notificacion`, data);
    return response?.data || {};
  } catch (error) {
    return error?.response?.data?.error;
  }
};
