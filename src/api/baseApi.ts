import { logoutHandler, tokenValue } from "@/utils/helper";
import axios, { AxiosInstance, AxiosResponse } from "axios";

export const baseURL = "https://api.norma.safiabakery.uz";

const logoutObj: { [key: number]: boolean } = {
  401: true,
  403: true,
};

const baseApi: AxiosInstance = axios.create({
  baseURL,
});

baseApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(tokenValue);

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
      logoutHandler();
    }
    return Promise.reject(error);
  }
);

export default baseApi;
