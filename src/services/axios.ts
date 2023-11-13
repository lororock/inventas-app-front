import axios, {AxiosInstance} from 'axios'

const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:9000/api/',
  headers: {
    'Content-type': 'application/json',
  },
})

axiosInstance.interceptors.request.use(async (config) => {
    config.headers['Authorization'] = localStorage.getItem("token-inventas");
    return config;
}, (error) => {
    return Promise.reject(error)
});

export default axiosInstance;