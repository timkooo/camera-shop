import axios, { AxiosInstance } from 'axios';

const SERVER_URL = 'https://camera-shop.accelerator.pages.academy/';
const TIMEOUT = 5000;

export const api: AxiosInstance = axios.create({
  baseURL: SERVER_URL,
  timeout: TIMEOUT,
});
