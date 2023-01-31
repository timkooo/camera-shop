import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
// import { toast } from 'react-toastify';
// import { getToken } from './token';
// import history from '../browser-history';
import { APIRoute, AppRoutes } from '../const';

const SERVER_URL = 'https://camera-shop.accelerator.pages.academy/';
const TIMEOUT = 5000;

export const api: AxiosInstance = axios.create({
  baseURL: SERVER_URL,
  timeout: TIMEOUT,
});

// api.interceptors.request.use((config: AxiosRequestConfig) => {
//   const token = getToken();

//   if (token) {
//     config.headers['x-token'] = token;
//   }

//   return config;
// });

// api.interceptors.response.use(
//   (response) => response,
//   (error: AxiosError) => {
//     if (
//       error.response &&
//       error.response.status === StatusCodeMapping.UNAUTHORIZED
//     ) {
//       if (
//         error.response.config.url !== `/${AppRoutes.Login}`
//       ) {
//         toast.warn(error.response.data.error, {
//           toastId: 'authorization',
//         });
//       }
//     }
//     if (
//       error.response &&
//       error.response.status === StatusCodeMapping.NOT_FOUND
//     ) {
//       if (
//         error.response.config.url !== APIRoute.Places &&
//         error.response.config.url !== APIRoute.Login
//       ) {
//         history.replace(AppRoutes.PageNotFound);
//       }
//       if (error.response.config.url === APIRoute.Places) {
//         toast.warn('Не удалось получить данные от сервера', {
//           toastId: 'bad_request',
//         });
//       }
//     }
//     if (
//       error.response &&
//       error.response.status === StatusCodeMapping.BAD_REQUEST
//     ) {
//       toast.warn(error.response.data.error, {
//         toastId: 'bad_request',
//       });
//     }
//     throw error;
//   }
// );
