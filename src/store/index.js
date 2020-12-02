import Vue from 'vue'
import Vuex from 'vuex'
// const PageType = 'allview' || 'detailview' || 'keypointview'
const curDate = new Date()
const defDate =
  window.sessionStorage.getItem('selectDate') ||
  (curDate.getMonth() === 0 ? curDate.getFullYear() - 1 + '-12' : curDate.getFullYear() + (curDate.getMonth() > 8 ? '-' + (curDate.getMonth() + 1) : '-0' + (curDate.getMonth() + 1)))
const defCity = window.sessionStorage.getItem('cityCode') || 'A52'
const defType = window.sessionStorage.getItem('buniessType') || 'all'
const defProvider = window.sessionStorage.getItem('keypointProvider') || ''
window.sessionStorage.setItem('cityCode', defCity)
window.sessionStorage.setItem('selectDate', defDate)
window.sessionStorage.setItem('buniessType', defType)
window.sessionStorage.setItem('keypointProvider', defProvider)
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currntPage: 'allview',
    cityCode: defCity,
    selectDate: defDate,
    buniessType: defType,
    detailTabledate: {},
    allviewItems: {},
    keypointProvider: {},
    isLoading: false
  },
  getters: {
    getIsLoading(state) {
      return state.isLoading
    },
    getDetailTabledate(state) {
      return state.detailTabledate
    },
    getAllviewItems(state) {
      return state.allviewItems
    },
    getCurrentPage(state) {
      return state.currntPage
    },
    getCityCode(state) {
      return state.cityCode
    },
    getSelectDate(state) {
      return state.selectDate
    },
    getBuniessType(state) {
      return state.buniessType
    }
  },
  mutations: {
    setCurrentPage(state, curpage) {
      state.currntPage = curpage
    },
    setCityCode(state, city) {
      state.cityCode = city
      window.sessionStorage.setItem('cityCode', city)
    },
    setSelectDate(state, date) {
      state.selectDate = date
      window.sessionStorage.setItem('selectDate', date)
    },
    setBuniessType(state, type) {
      state.buniessType = type
      window.sessionStorage.setItem('buniessType', type)
    },
    setDetailTabledate(state, data) {
      state.detailTabledate = data
    },
    setAllviewItems(state, data) {
      state.allviewItems = data
    },
    setKeypointProvider(state, data) {
      state.keypointProvider = data
      const sessionData = JSON.stringify(data)
      window.sessionStorage.setItem('keypointProvider', sessionData)
    },
    setIsLoading(state, load) {
      state.isLoading = load
    }
  },
  actions: {},
  modules: {}
})
