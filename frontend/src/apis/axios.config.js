import axios from "axios";

const instance = axios.create({
  baseURL: 'http://localhost:3000/',
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  function (config) {
    config.headers.Authorization = `Bearer ${localStorage.getItem(
      "access_token"
    )}`;
    return config;
  },
  function (error) {

    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {

    if (response && response.data) return response.data;
    return response;
  },
  function (error) {

    return Promise.reject(error);
  }
);

export default instance;
