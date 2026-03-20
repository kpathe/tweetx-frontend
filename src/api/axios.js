import axios from "axios";
import conf from "../conf/conf";

const apiClient = axios.create({
  baseURL: conf.apiUrl,
  withCredentials: true,
  // timeout: 1000, // Set a default timeout
});



export default apiClient;
