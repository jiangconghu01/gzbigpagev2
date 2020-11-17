import axios from "axios";
import qs from "qs";
// import store from '../store/store.js';
// axios.defaults.baseURL = 'http://134.98.100.73:9090';
axios.defaults.timeout = 50000;
axios.defaults.withCredentials = true;
// 添加请求拦截器
axios.interceptors.request.use(
  function(config) {
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axios.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {
    return Promise.reject(error);
  }
);
const http = {
  get(url, params) {
    params = params || {};
    return axios.get(url, { params: params });
  },
  post(url, params, type) {
    const param = type === "test" ? qs.stringify(params) : params;
    return axios.post(url, param);
  }
};
export default http;
