<template>
  <div class="page-header">
    <div class="left-select">
      <a-month-picker @change="handleDateChange" placeholder="选择年月" :locale="zhLocale" :defaultValue="moment(defDate, dateFmater)">
        <a-icon slot="suffixIcon" type="caret-down" />
      </a-month-picker>
      <span v-show="getCurrentPage !== 'detailview'">
        <a-select style="width: 120px" :value="citycode" @change="handleCityChange">
          <a-icon slot="suffixIcon" type="caret-down" />
          <a-select-option v-for="(val, key) in cityList" :value="key" :key="key">{{ val }}</a-select-option>
        </a-select>
      </span>
      <span v-show="getCurrentPage !== 'detailview'">
        <a-select style="width: 120px" :defaultValue="defType" @change="handleTypeChange">
          <a-icon slot="suffixIcon" type="caret-down" />
          <a-select-option value="all">全部业务</a-select-option>
          <a-select-option value="asset">资产类</a-select-option>
          <a-select-option value="cost">成本费</a-select-option>
          <a-select-option value="income">收入</a-select-option>
          <a-select-option value="other">其他</a-select-option>
        </a-select>
      </span>
    </div>
    <div class="center-title">
      <h1 @click="changePage">贵州电信智慧核算分析平台-供应商{{ titleText }}情况</h1>
    </div>
    <div class="right-date">
      <i>{{ rightDate }}</i>
      <i>{{ rightTime }}</i>
      <i>{{ rightWeek }}</i>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'
import 'moment/locale/zh-cn'
import { GZProvinceCityItem } from '../chartconfig/static'
import { getFormatDate } from '../utils/commFun'
import { mapMutations, mapGetters } from 'vuex'
moment.locale('zh-cn')
let timer = null
export default {
  data() {
    return {
      rightDate: '',
      rightTime: '',
      rightWeek: '',
      titleText: '',
      defDate: window.sessionStorage.getItem('selectDate'),
      //   defCity: window.sessionStorage.getItem('cityCode'),
      defType: window.sessionStorage.getItem('buniessType'),
      citycode: window.sessionStorage.getItem('cityCode'),
      //   storePage: this.$route.name,
      dateFmater: 'YYYY-MM',
      cityList: GZProvinceCityItem,
      zhLocale: locale,
      moment: moment
    }
  },
  created() {},
  components: {},
  computed: {
    ...mapGetters(['getCityCode', 'getCurrentPage'])
  },
  methods: {
    ...mapMutations(['setCityCode', 'setSelectDate', 'setBuniessType']),
    changePage() {
      console.log(111)
    },
    handleDateChange(val) {
      console.log(val)
      const sdate = val.format('YYYY-MM')
      this.setSelectDate(sdate)
    },
    handleCityChange(val) {
      console.log(val)
      this.setCityCode(val)
    },
    handleTypeChange(val) {
      console.log(val)
      this.setBuniessType(val)
    },
    updateDate() {
      this.rightDate = getFormatDate().date
      this.rightTime = getFormatDate().time
      this.rightWeek = getFormatDate().week
    }
  },
  watch: {
    getCityCode(nv, ov) {
      this.citycode = nv
    }
  },
  mounted() {
    timer = window.setInterval(this.updateDate, 1000)
    console.log(this.$router.history.current)
  },
  destroyed() {
    window.clearInterval(timer)
  }
}
// import { defineComponent, ref, watch, ComputedRef, computed, onMounted, onUnmounted, getCurrentInstance, ComponentInternalInstance } from 'vue'
// import { useRouter, useRoute } from 'vue-router'
// import { CaretDownFilled } from '@ant-design/icons-vue'
// import { getFormatDate, OneArgVoidFun } from '../utils/commFun'
// import { GZProvinceCityItem } from '../chartconfig/static'
// import store, { PageType } from '../store/index'
// import moment from 'moment'
// import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'
// import 'moment/locale/zh-cn'
// moment.locale('zh-cn')
// type dateFmater = 'YYYY-MM' | 'YYYYMM/DD' | 'YYYYMM'
// import { updateProviderAllView } from '../chartconfig/providerAllView/update.page.chart'
// import { updateProviderDetailView } from '../chartconfig/providerDetailView/update.page.chart'
// import { updateProviderKeypointView } from '../chartconfig/providerKeypointView/update.page.chart'

// export default defineComponent({
//   name: 'pageCommonHeader',
//   components: {
//     CaretDownFilled
//   },
//   setup() {
//     const instance = getCurrentInstance() as ComponentInternalInstance //vue的this实例
//     const _this = instance.appContext.config.globalProperties //全局对象属性
//     //时间选择
//     const dateValue = ref<Date>(new Date())
//     const zhLocale = ref<Record<string, any>>(locale)
//     const dateFmater: dateFmater = 'YYYY-MM'
//     const curDate = new Date()
//     const defDateSys =
//       curDate.getMonth() === 0 ? curDate.getFullYear() - 1 + '-12' : curDate.getFullYear() + (curDate.getMonth() > 8 ? '-' + (curDate.getMonth() + 1) : '-0' + (curDate.getMonth() + 1))
//     // const defDate = store.state.selectDate || defDateSys
//     const defDate = ref(store.state.selectDate) || ref(defDateSys)
//     const handleDateChange: OneArgVoidFun<moment.Moment> = (value: moment.Moment) => {
//       const sdate = value.format('YYYY-MM')
//       console.log(value)
//       //   defDate.value = moment(value, dateFmater)
//       defDate.value = sdate
//       store.commit('setSelectDate', sdate)
//     }
//     //城市选择
//     // const cityValue = store.state.cityCode || ref('A52')
//     // const cityValue = ref(store.state.cityCode)
//     const cityValue = computed(() => {
//       return store.state.cityCode
//     })
//     const cityList: Record<string, string> = GZProvinceCityItem
//     const handleCityChange: OneArgVoidFun<string> = (value) => {
//       console.log(value, store.state.currntPage)
//       store.commit('setCityCode', value)
//     }
//     //类型选择
//     const typeValue = ref(store.state.buniessType)
//     const handleTypeChange: OneArgVoidFun<string> = (value) => {
//       store.commit('setBuniessType', value)
//       console.log(value)
//     }
//     //当前时间显示
//     const rightDate = ref('')
//     const rightTime = ref('')
//     const rightWeek = ref('')
//     const updateDate: () => void = () => {
//       rightDate.value = getFormatDate().date
//       rightTime.value = getFormatDate().time
//       rightWeek.value = getFormatDate().week
//     }
//     let timer: number

//     onMounted(() => {
//       timer = window.setInterval(updateDate, 1000)
//       console.log(zhLocale)
//       updateProviderAllView(_this)
//     })
//     onUnmounted(() => {
//       window.clearInterval(timer)
//     })
//     //选择不同的
//     //标题设置
//     type Dictionary<T> = { [key: string]: T }
//     const Titles: Dictionary<string> = {
//       allview: '整体',
//       detailview: '详细',
//       keypointview: '重点'
//     }
//     const currntPage = computed(() => store.state.currntPage)
//     const titleText = computed(() => {
//       return Titles[currntPage.value]
//     })
//     //点击标题切换路由
//     const router = useRouter()
//     const route = useRoute()
//     const changePage: () => void = () => {
//       //   const routelist: string[] = Object.keys(Titles)
//       //   const currentIndex: number = routelist.indexOf(route.name as string)
//       //   const toPage: string = currentIndex + 1 > 2 ? routelist[0] : routelist[currentIndex + 1]
//       let toPage = 'keypointview'
//       if (route.name === 'detailview') {
//         toPage = 'keypointview'
//       } else if (route.name === 'allview') {
//         toPage = 'keypointview'
//       } else {
//         toPage = 'allview'
//       }
//       router.push({ name: toPage })
//     }
//     //监听全局的参数变化
//     const storeDate: ComputedRef<string> = computed(() => store.state.selectDate)
//     const storeType: ComputedRef<string> = computed(() => store.state.buniessType)
//     const storeCity: ComputedRef<string> = computed(() => store.state.cityCode)
//     const storePage: ComputedRef<string> = computed(() => store.state.currntPage)
//     watch<ComputedRef<string>[], false>([storeDate, storeType, storeCity, storePage], ([c_d, c_t, c_c, c_p], [preDate, prevType, preCity, prePage]) => {
//       store.commit('setIsLoading', true)
//       try {
//         const currntPage = c_p as PageType
//         const oldPage = prePage as PageType
//         // if (oldPage !== currntPage) {
//         //   defDate.value = store.state.selectDate
//         //   cityValue.value = store.state.cityCode
//         //   typeValue.value = store.state.buniessType
//         // }
//         currntPage === 'allview' && updateProviderAllView(_this)
//         currntPage === 'detailview' && updateProviderDetailView(_this)
//         currntPage === 'keypointview' && updateProviderKeypointView(_this)
//       } catch (error) {
//         _this.$message.error(error)
//         // store.commit('setIsLoading', false)
//       }
//     })
//     return {
//       dateValue,
//       cityValue,
//       typeValue,
//       zhLocale,
//       dateFmater,
//       defDate,
//       handleTypeChange,
//       handleDateChange,
//       handleCityChange,
//       moment,
//       rightDate,
//       rightTime,
//       rightWeek,
//       titleText,
//       changePage,
//       cityList,
//       storePage
//     }
//   }
// })
</script>
<style lang="scss" scoped>
.page-header {
  height: 85px;
  display: flex;
  .left-select {
    flex: 1;
    display: flex;
    align-items: flex-end;
    padding-left: 50px;
    /deep/ .ant-select {
      margin-left: 20px;
      .ant-select-selection {
        background-color: #3a5697;
        border-color: rgba(0, 0, 0, 0);
        color: #fff;
        font-weight: bold;
      }
      .ant-select-selection-selected-value {
        font-size: 18px;
        font-weight: bold;
      }
    }
  }
  .center-title {
    width: 45%;
    text-align: center;
    margin-top: 12px;
    h1 {
      //   color: transparent;
      //   -webkit-background-clip: text;
      //   background-image: -webkit-linear-gradient(bottom, #00ffd5, #c1f0fa);
      color: #27dfdf;
      cursor: pointer;
      font-size: 40px;
      font-weight: 900;
      font-family: '黑体', '微软雅黑', '楷体';
    }
  }
  .right-date {
    flex: 1;
    padding-right: 50px;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    color: #fff;
    i {
      font-size: 22px;
      font-weight: bold;
      margin-right: 10px;
    }
  }
  .ant-calendar-picker {
    background-color: #3a5697;
    color: #fff;
  }
  ::v-deep .ant-calendar-picker-input {
    background-color: #3a5697;
    border-color: rgba(0, 0, 0, 0);
    color: #fff;
    font-weight: bold;
  }
  /deep/ .ant-select-arrow {
    font-size: 16px;
    color: #6197ef;
  }
  /deep/ .ant-calendar-picker-icon {
    font-size: 16px;
    color: #6197ef;
  }
  /deep/ .ant-calendar-picker-clear {
    font-size: 16px;
    color: #6197ef;
  }
  /deep/ .ant-calendar-picker-input {
    font-size: 18px;
    font-weight: bold;
  }
}
@keyframes text-pop-up-top {
  0% {
    transform: translateY(0);
    transform-origin: 50% 50%;
    text-shadow: none;
  }
  100% {
    transform: translateY(-20px);
    transform-origin: 50% 50%;
    text-shadow: 0 1px 0 #4cefff, 0 2px 0 #4cefff, 0 3px 0 #4cefff, 0 3px 0 #4cefff, 0 4px 0 #4cefff, 0 3px 0 #4cefff, 0 4px 0 #4cefff, 0 4px 0 #4cefff, 0 5px 0 #4cefff,
      5px 10px 9px rgba(0, 0, 0, 0.35), 15px 12px 5px rgba(0, 0, 0, 0.705);
  }
}
</style>
