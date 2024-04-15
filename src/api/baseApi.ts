import axios, { AxiosInstance, AxiosResponse } from "axios";

export const baseURL = "http://10.0.0.103:8004";

const logoutObj: { [key: number]: boolean } = {
  401: true,
  403: true,
};

const baseApi: AxiosInstance = axios.create({
  baseURL,
});

baseApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (!!token) {
      if (config.headers) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

baseApi.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (logoutObj[error?.response?.status]) {
      logoutUser();
    }
    return Promise.reject(error);
  }
);

function logoutUser() {
  localStorage.removeItem("token");
  window.location.reload();
}

export default baseApi;
