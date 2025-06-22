import axios from "axios";

const chatbotAxios = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  timeout: 10000,
});

// Không có interceptor nào cả
export default chatbotAxios;
