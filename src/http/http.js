import axios from 'axios'
import qs from 'qs'
// import store from '../store/store.js';
// axios.defaults.baseURL = 'http://134.98.100.73:9090';
axios.defaults.timeout = 50000
axios.defaults.withCredentials = true
import store from '../store/index'
// 添加请求拦截器
let countnum = 0
axios.interceptors.request.use(
  function(config) {
    store.commit('setIsLoading', true)
    countnum += 1
    return config
  },
  function(error) {
    countnum -= 1
    return Promise.reject(error)
  }
)

// 添加响应拦截器
axios.interceptors.response.use(
  function(response) {
    countnum -= 1
    if (countnum <= 0) {
      setTimeout(function() {
        store.commit('setIsLoading', false)
      }, 800)
    }
    return response
  },
  function(error) {
    countnum -= 1
    if (countnum <= 0) {
      setTimeout(function() {
        store.commit('setIsLoading', false)
      }, 800)
    }
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
