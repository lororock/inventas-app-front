import axios, { AxiosInstance } from 'axios'

const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'https://api.openbrewerydb.org',
  headers: {
    'Content-type': 'application/json',
  },
})

axiosInstance.interceptors.request.use(async (config) => {
    const accessToken = localStorage.getItem("token-inventas");
    config.headers['Authorization'] = accessToken;
    return config;
}, (error) => {
    return Promise.reject(error)
});

export default axiosInstance;