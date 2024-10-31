import axios from "axios";

const instance = axios.create({
  baseURL: "https://backend-api-system.azurewebsites.net",
});

export default instance;
