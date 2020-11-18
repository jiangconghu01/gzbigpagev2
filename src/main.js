import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue'
import echarts from 'echarts'
import './assets/scss/base.scss'
import 'ant-design-vue/dist/antd.css'
import http from './http/http'
Vue.config.productionTip = false
Vue.use(Antd)
Vue.prototype.$http = http
Vue.prototype.$echarts = echarts
new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
