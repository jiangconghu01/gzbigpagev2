import axios from 'axios'
import qs from 'qs'
// import store from '../store/store.js';
// axios.defaults.baseURL = 'http://134.98.100.73:9090';
axios.defaults.timeout = 50000
axios.defaults.withCredentials = true
// 添加请求拦截器
axios.interceptors.request.use(
  function(config) {
    return config
  },
  function(error) {
    return Promise.reject(error)
  }
)

// 添加响应拦截器
axios.interceptors.response.use(
  function(response) {
    return response
  },
  function(error) {
    return Promise.reject(error)
  }
)
const http = {
  get(url, params) {
    params = params || {}
    return new Promise((resolve, reject) => {
      axios
        .get(url, { params: params })
        .then((data) => {
          resolve(data.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  post(url, params, type) {
    // const param = params || {}
    const param = type === 'test' ? qs.stringify(params) : params
    return new Promise((resolve, reject) => {
      axios
        .post(url, param)
        .then((data) => {
          resolve(data.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}
export default http
