<template>
  <div class="provider-allview">
    <div class="left-top frame-back-box">
      <h2 class="chart-title">供应商业务类型情况统计图</h2>
      <div class="chart-box" id="all-view-left-top"></div>
    </div>
    <div class="left-bottom frame-back-box">
      <h2 class="chart-title">供应商行业类型情况统计图</h2>
      <div class="chart-box" id="all-view-left-bottom"></div>
    </div>
    <div class="center-list">
      <ul>
        <li class="item">
          <p class="text"><i>供应商总数</i> <i>需关注供应商</i></p>
          <p class="number">
            <span class="lum-1"
              ><i class="num">{{ labelItems[0] && labelItems[0].idxValue }}</i
              ><i class="unit">个</i></span
            >
            <span class="lum-2 active" @click="showModalTable('provider_num')"
              ><i class="num">{{ labelItems[1] && labelItems[1].idxValue }}</i
              ><i class="unit">个</i></span
            >
          </p>
        </li>
        <li class="item">
          <p class="text"><i>新签合同额</i> <i>需关注合同</i></p>
          <p class="number">
            <span class="lum-1"
              ><i class="num">{{ labelItems[2] && (labelItems[2].idxValue / 100000000).toFixed(2) }}</i
              ><i class="unit">亿</i></span
            >
            <span class="lum-2 active" @click="showModalTable('contract_num')"
              ><i class="num">{{ labelItems[3] && labelItems[3].idxValue }}</i
              ><i class="unit">个</i></span
            >
          </p>
        </li>
        <li class="item">
          <p class="text"><i>列账总额</i> <i>需关注列账数</i></p>
          <p class="number">
            <span class="lum-1"
              ><i class="num">{{ labelItems[4] && (labelItems[4].idxValue / 100000000).toFixed(2) }}</i
              ><i class="unit">亿</i></span
            >
            <span class="lum-2 active" @click="showModalTable('bill_num')"
              ><i class="num">{{ labelItems[5] && (labelItems[5].idxValue / 100000000).toFixed(2) }}</i
              ><i class="unit">亿</i></span
            >
          </p>
        </li>
        <li class="item">
          <p class="text"><i>已付金额</i> <i>余额</i></p>
          <p class="number">
            <span class="lum-1"
              ><i class="num">{{ labelItems[6] && (labelItems[6].idxValue / 100000000).toFixed(2) }}</i
              ><i class="unit">亿</i></span
            >
            <span class="lum-2"
              ><i class="num">{{ labelItems[7] && (labelItems[7].idxValue / 100000000).toFixed(2) }}</i
              ><i class="unit">亿</i></span
            >
          </p>
        </li>
      </ul>
    </div>
    <div class="center-map" id="all-view-center-map"></div>
    <div class="center-bottom frame-back-box">
      <h2 class="chart-title">列账采购方式统计图</h2>
      <div class="chart-unit-text" style="top:30px;">单位：万元</div>
      <div class="chart-box" id="all-view-center-bottom"></div>
    </div>
    <div class="right-top frame-back-box">
      <h2 class="chart-title keypoint_part" @click="toKeyPointPage()">重点供应商在整个公司的占比堆积图</h2>
      <div class="chart-unit-text">单位：万元</div>
      <div class="chart-box" id="all-view-right-top"></div>
    </div>
    <div class="right-bottom frame-back-box">
      <h2 class="chart-title">列账趋势分析图</h2>
      <div class="chart-unit-text">单位：万元</div>
      <div class="chart-box" id="all-view-right-bottom"></div>
    </div>
    <userModalTable ref="modal-table" :type="tableType" @change="showStatusChange"></userModalTable>
  </div>
</template>

<script>
const typeMap = {
  all: '00',
  asset: '01',
  cost: '02',
  income: '03',
  other: '04'
}
//取图形的指标接口，图形编码从上到下，从左到右
const getEncode = '/channelBigScreen/modInfoList'
//取指标值的接口
const encodeUrl = '/channelBigScreen/modIdxVOList'
import { getDatesParams } from '../utils/commFun'

import { GZProvinceCityItem, GZProvinceCityEnum } from '../chartconfig/static'
import { indexdata } from '../chartconfig/static'
import leftop_config from '../chartconfig/providerAllView/left.top.pie'
import lefbottom_config from '../chartconfig/providerAllView/left.bottom.pie'
import centerbottom_config from '../chartconfig/providerAllView/center.bottom.pillar'
import righttop_config from '../chartconfig/providerAllView/right.top.pillar'
import rightbottom_config from '../chartconfig/providerAllView/right.bottom'
import mapConfig from '../chartconfig/map'
import gzMapJson from 'echarts/map/json/province/guizhou.json'
import userModalTable from '../components/allview/userModalTable.vue'
import { mapGetters, mapMutations } from 'vuex'
export default {
  data() {
    return {
      labelItems: [],
      encodeList: indexdata,
      tableType: ''
    }
  },
  created() {},
  components: {
    userModalTable
  },
  computed: {
    ...mapGetters(['getCityCode', 'getSelectDate', 'getBuniessType'])
  },
  methods: {
    ...mapMutations(['setCityCode']),
    inintPage() {
      //请求指标，因为测试环境没有返回正常的数据，直接静态化了
      const businesstype = window.sessionStorage.getItem('buniessType')
      this.$http
        .post(getEncode, { viewCode: '2001', chnlType: typeMap[businesstype] })
        .then((res) => {
          console.log(res)
          this.encodeList = res.data
          this.updateMapJson(this.getCityCode)
          this.updatePage()
        })
        .catch((e) => {
          console.log(e)
          this.$message.error('指标加载失败！')
        })
      //   this.updateMapJson(this.getCityCode)
      //   this.updatePage()
    },
    updateMapData(mapBox) {
      const mapcon = mapBox || this.$echarts.init(document.getElementById('all-view-center-map'))
      const date = window.sessionStorage.getItem('selectDate')
      const businesstype = typeMap[window.sessionStorage.getItem('buniessType')]
      //地图数据

      const mapcncode = this.encodeList[2].idxs.map((ele) => ele.idxCde)
      const chartCodeMap = this.encodeList[2].chartCode
      const citycodelist = Object.keys(GZProvinceCityItem)
      const mapParam = JSON.parse(getDatesParams([date], citycodelist, mapcncode, businesstype, chartCodeMap))
      this.$http
        .post(encodeUrl, mapParam)
        .then((res) => {
          const data = res.data.map((val) => {
            const t = {}
            t.name = GZProvinceCityEnum[val.accountCode]
            t.value = val.idxValue
            t.value2 = val.accountCode
            return t
          })
          mapConfig.series[0].data = data
          mapcon.setOption(mapConfig)
        })
        .catch((e) => {
          console.log(e)
        })
    },
    updateMapJson(nv) {
      if (nv === 'A52') {
        this.$echarts.registerMap('guizhou', gzMapJson)
        const mapBox = this.$echarts.init(document.getElementById('all-view-center-map'))
        mapBox.setOption(mapConfig)
        this.updateMapData(mapBox)
        mapBox.off('click')
        const _this = this
        mapBox.on('click', function(params) {
          console.log(params)
          _this.setCityCode(params.data.value2)
        })
        let count = 0
        let ishover = false

        mapBox.off('globalout')
        mapBox.off('mouseover')
        mapBox.on('globalout', () => {
          ishover = false
        })
        mapBox.on('mouseover', () => {
          ishover = true
        })
        setTimeout(function loop() {
          setTimeout(loop, 1700)
          const isGz = window.sessionStorage.getItem('cityCode') === 'A52'
          if (!isGz || ishover) {
            return
          }
          mapBox.dispatchAction({
            type: 'showTip',
            seriesIndex: 0,
            dataIndex: count
          })
          count++
          if (count >= 8) {
            count = 0
          }
        }, 1700)
        return
      }
      this.$http
        .post('/channel/map/assembleJsonObject', { parentOrgCode: nv })
        .then((res) => {
          const resdata = res
          const mapBox = this.$echarts.init(document.getElementById('all-view-center-map'))
          mapBox.clear()
          if (!resdata.features) {
            this.$message.warning('没有加载到对应地图！')
          } else {
            this.$echarts.registerMap('guizhou', resdata)
            const config = JSON.parse(JSON.stringify(mapConfig))
            config.series[0].data = []
            config.series[1].data = []
            mapBox.setOption(config)
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    updatePage() {
      const date = window.sessionStorage.getItem('selectDate')
      const citycode = window.sessionStorage.getItem('cityCode')
      const businesstype = typeMap[window.sessionStorage.getItem('buniessType')]
      this.lefttopchart(date, citycode, businesstype)
      this.topAllLabel(date, citycode, businesstype)
      this.rightTopChart(date, citycode, businesstype)
      this.leftBottomChart(date, citycode, businesstype)
      this.centerBootomChart(date, citycode, businesstype)
      this.rightBootomChart(date, citycode, businesstype)
    },
    //left-top图表请求数据逻辑
    lefttopchart(date, citycode, businesstype) {
      const encondelefttop = this.encodeList[0].idxs.map((ele) => ele.idxCde)
      const chartCode = this.encodeList[0].chartCode
      const paramLeftTop = JSON.parse(getDatesParams([date], [citycode], encondelefttop, businesstype, chartCode))
      this.$http
        .post(encodeUrl, paramLeftTop)
        .then((res) => {
          const label = ['成本类', '工程采购类', '合作分成类', '其他']
          leftop_config.series[0].data = res.data.map((val, index) => {
            let name = val.idxName.split('_')[0]
            if (name) {
              name = name.replace('占比', '')
            }
            return {
              name: name,
              value: val.idxValue
            }
          })
          const box = this.$echarts.init(document.getElementById('all-view-left-top'))
          box.setOption(leftop_config)
        })
        .catch((e) => {
          console.log(e)
        })
    },
    //topAll总体数据
    topAllLabel(date, citycode, businesstype) {
      const encondeTopAll = this.encodeList[1].idxs.map((ele) => ele.idxCde)
      const chartCode = this.encodeList[1].chartCode
      const paramTopAll = JSON.parse(getDatesParams([date], [citycode], encondeTopAll, businesstype, chartCode))
      this.$http
        .post(encodeUrl, paramTopAll)
        .then((res) => {
          this.labelItems = res.data
        })
        .catch((e) => {
          console.log(e)
        })
    },
    //rightTop数据
    rightTopChart(date, citycode, businesstype) {
      const enconderighttop = this.encodeList[3].idxs.map((ele) => ele.idxCde)
      const chartCode = this.encodeList[3].chartCode
      const paramRightTop = JSON.parse(getDatesParams([date], [citycode], enconderighttop, businesstype, chartCode))
      this.$http
        .post(encodeUrl, paramRightTop)
        .then((res) => {
          const config = righttop_config
          const label = ['新签合同额', '列账', '付款', '余额']
          const x = []
          const y = []
          res.data.map((val, index) => {
            if (Number(val.idxOrd) % 2 !== 0) {
              x.push((Number(val.idxValue) / 10000).toFixed(2))
            } else {
              y.push((Number(val.idxValue) / 10000).toFixed(2))
            }
          })
          config.series[0].data = x
          config.series[1].data = y
          const box = this.$echarts.init(document.getElementById('all-view-right-top'))
          box.setOption(config)
        })
        .catch((e) => {
          console.log(e)
        })
    },
    //left-bottom图表请求数据逻辑
    leftBottomChart(date, citycode, businesstype) {
      const encondeleftbottom = this.encodeList[4].idxs.map((ele) => ele.idxCde)
      const chartCode = this.encodeList[4].chartCode
      const paramLeftBottom = JSON.parse(getDatesParams([date], [citycode], encondeleftbottom, businesstype, chartCode))
      this.$http
        .post(encodeUrl, paramLeftBottom)
        .then((res) => {
          console.log(res)

          const t_data = res.data.slice(0, 6)
          const d = res.data.filter((val) => val.idxName === '其他')

          t_data.push(d[0])
          const label = ['房地产', '汽车', '通讯设备', '土木工程', '软件和技术服务', '批发占比']
          lefbottom_config.series[0].data = t_data.map((val, index) => {
            let name = val.idxName.split('_')[0]
            if (name) {
              name = name.replace('占比', '')
            }

            return {
              name: name,
              value: val.idxValue
            }
          })
          const box = this.$echarts.init(document.getElementById('all-view-left-bottom'))
          box.setOption(lefbottom_config)
        })
        .catch((e) => {
          console.log(e)
        })
    },
    //center-bootom图表请求数据逻辑
    centerBootomChart(date, citycode, businesstype) {
      const encondecenterbottom = this.encodeList[5].idxs.map((ele) => ele.idxCde)
      const chartCode = this.encodeList[5].chartCode
      const paramCenterBottom = JSON.parse(getDatesParams([date], [citycode], encondecenterbottom, businesstype, chartCode))
      this.$http
        .post(encodeUrl, paramCenterBottom)
        .then((res) => {
          const label = ['公开招标', '邀请招标', '单一采购（公示）', '邀请询价', '邀请竞争谈判', '公开比选', '公开询价', '单一采购（非公示）', '公开竞争谈判', '电商采购']
          centerbottom_config.series[0].data = res.data.map((val, index) => {
            return {
              name: label[index],
              value: (Number(val.idxValue) / 10000).toFixed(2)
            }
          })
          const box = this.$echarts.init(document.getElementById('all-view-center-bottom'))
          box.setOption(centerbottom_config)
        })
        .catch((e) => {
          console.log(e)
        })
    },
    //right-bootom图表请求数据逻辑
    rightBootomChart(date, citycode, businesstype) {
      const encondecenterbottom = this.encodeList[5].idxs.map((ele) => ele.idxCde)
      const chartCode = this.encodeList[5].chartCode
      const paramCenterBottom = JSON.parse(getDatesParams([date], [citycode], encondecenterbottom, businesstype, chartCode))
      this.$http
        .post(encodeUrl, paramCenterBottom)
        .then((res) => {
          const label = Array.from({ length: 12 }, (v, k) => {
            return k + 1 < 10 ? '0' + (k + 1) + '月' : k + 1 + '月'
          })
          rightbottom_config.xAxis.data = label
          rightbottom_config.series[0].data = res.data.map((val, index) => {
            return {
              name: label[index],
              value: (Number(val.idxValue) / 10000).toFixed(2),
              datalength: 12
            }
          })
          const box = this.$echarts.init(document.getElementById('all-view-right-bottom'))
          box.setOption(rightbottom_config)
        })
        .catch((e) => {
          console.log(e)
        })
    },
    showModalTable(param) {
      this.tableType = param
      this.$refs['modal-table'].showModal()
    },
    showStatusChange() {
      console.log(123)
    },
    toKeyPointPage() {
      const { href } = this.$router.resolve({ name: 'keypointview' })
      window.open(href, '_blank')
    }
  },
  watch: {
    getCityCode(nv, ov) {
      console.log(nv)
      this.updateMapJson(nv)
      this.updatePage()
    },
    getSelectDate(nv, ov) {
      this.updatePage()
      this.getCityCode === 'A52' && this.updateMapJson('A52')
    },
    getBuniessType(nv, ov) {
      this.updatePage()
      this.getCityCode === 'A52' && this.updateMapJson('A52')
    }
  },
  mounted() {
    this.inintPage()
  }
}
// import userModalTable from '../components/allview/userModalTable.vue'
// import { defineComponent, ref, onMounted, getCurrentInstance, ComponentInternalInstance, computed, watch } from 'vue'
// import { OneArgVoidFun } from '../utils/commFun'
// import { useRouter } from 'vue-router'
// import echarts from 'echarts'
// import mapConfig from '../chartconfig/map'
// import { inintCharts } from '../chartconfig/installchart'
// import store from '../store'
// import { requestPostData } from '../http/http'
// // import gzMapJson from 'echarts/map/json/province/guizhou.json'
// const gzMapJson = require('echarts/map/json/province/guizhou.json')
// export default defineComponent({
//   name: 'providerAllView',
//   components: {
//     userModalTable
//   },
//   setup(props, context) {
//     const instance = getCurrentInstance() as ComponentInternalInstance //vue的this实例
//     const _this = instance.appContext.config.globalProperties //全局对象属性
//     //头部的一排label值
//     const labelItems = computed(() => {
//       return store.state.allviewItems
//     })
//     //显示弹框内容，业务写在弹框的业务组件里
//     const showTable = ref(false)
//     const tableType = ref('')
//     const showModalTable: OneArgVoidFun<string> = (type) => {
//       console.log(type, showTable.value)
//       tableType.value = type
//       showTable.value = true
//     }
//     const showStatusChange: OneArgVoidFun<boolean> = (val) => {
//       showTable.value = val
//     }
//     //注册地图
//     const regiseterMap: () => void = () => {
//       echarts.registerMap('guizhou', gzMapJson)
//       //   const mapBox = echarts.init(document.getElementById('all-view-center-map') as HTMLCanvasElement)
//       //   mapBox.setOption(mapConfig)
//     }
//     onMounted(() => {
//       regiseterMap()
//     })
//     //选择同步地图
//     const cityValue = computed(() => {
//       return store.state.cityCode
//     })
//     watch(cityValue, (nv, ov) => {
//       requestPostData('/channel/map/assembleJsonObject', { parentOrgCode: nv })
//         .then((res) => {
//           const resdata = res.data as any
//           if (!resdata.features) {
//             const mapBox = echarts.init(document.getElementById('all-view-center-map') as HTMLCanvasElement)
//             mapBox.clear()
//             _this.$message.warning('没有加载到对应地图！')
//           } else {
//             echarts.registerMap('guizhou', res.data as any)
//             const mapBox = echarts.init(document.getElementById('all-view-center-map') as HTMLCanvasElement)
//             mapBox.clear()
//             if (nv === 'A52') {
//               mapBox.setOption(mapConfig)
//             } else {
//               const config = JSON.parse(JSON.stringify(mapConfig))
//               config.series[0].data = []
//               config.series[1].data = []
//               mapBox.setOption(config)
//             }
//           }
//         })
//         .catch((e) => {
//           console.log(e)
//         })
//     })
//     //挂载图表
//     inintCharts('providerAllView')
//     //跳转重点页面
//     const router = useRouter()
//     const toKeyPointPage: () => void = () => {
//       //   const { href } = router.resolve({ name: 'keypointview', params: { date: store.state.selectDate, type: store.state.buniessType, city: store.state.cityCode } })
//       const { href } = router.resolve({ name: 'keypointview', query: { date: store.state.selectDate, type: store.state.buniessType, city: store.state.cityCode } })
//       window.open(href, '_blank')
//       //   router.push({ name: 'keypointview', query: { date: store.state.selectDate, type: store.state.buniessType, city: store.state.cityCode } })
//     }
//     return {
//       showTable,
//       tableType,
//       showModalTable,
//       showStatusChange,
//       labelItems,
//       toKeyPointPage
//     }
//   }
// })
</script>
<style lang="scss" scoped>
.provider-allview {
  position: relative;
  & > div {
    position: absolute;
  }
  .left-top {
    left: 0;
    top: 0;
    width: 455px;
    height: 460px;
  }
  .left-bottom {
    left: 0;
    top: 480px;
    width: 455px;
    height: 460px;
  }
  .right-top {
    right: 0;
    top: 0;
    width: 455px;
    height: 460px;
    .keypoint_part {
      position: relative;
      cursor: pointer;
      &:hover {
        color: #27dfdf;
        // color: transparent;
        // -webkit-background-clip: text;
        // background-image: -webkit-linear-gradient(bottom, #17d3ba, #afebf7);
      }
      &:hover::after {
        content: '';
        display: block;
        position: absolute;
        height: 2px;
        width: 80%;
        background-color: #17d3ba;
        left: 6%;
        bottom: 8px;
      }
    }
  }
  .right-bottom {
    right: 0;
    top: 480px;
    width: 455px;
    height: 460px;
  }
  .center-list {
    left: 480px;
    top: 20px;
    width: 900px;
    height: 105px;
    ul {
      display: flex;
      height: 100%;
      .item {
        flex: 1;
        height: 100%;
        background: url('../assets/item_back.jpg') no-repeat;
        background-size: cover;
        .text {
          height: 20px;
          line-height: 20px;
          margin-left: 20px;
          margin-top: 25px;
          margin-bottom: 0;
          font-size: 16px;
          letter-spacing: -2px;
          i {
            font-weight: bold;
            display: inline-block;
            text-shadow: 2px 5px 3px rgba(0, 0, 0, 0.35), 5px 5px 3px rgba(0, 0, 0, 0.705);
          }
          i:nth-child(1) {
            width: 75px;
          }
          i:nth-child(2) {
            margin-left: 15px;
          }
        }
        .number {
          height: 40px;
          line-height: 40px;
          margin-bottom: 0;
          margin-left: 20px;
          .lum-1 {
            display: inline-block;
            width: 80px;
            white-space: nowrap;
          }
          .lum-2 {
            margin-left: 15px;
            display: inline-block;
            cursor: pointer;
          }
          .active {
            position: relative;
            &:hover {
              color: transparent;
              -webkit-background-clip: text;
              background-image: -webkit-linear-gradient(bottom, #17d3ba, #afebf7);
              color: #27dfdf;
            }
            &:hover::after {
              content: '';
              display: block;
              position: absolute;
              height: 2px;
              width: 100%;
              background-color: #17d3ba;
              left: 0;
              bottom: 8px;
            }
          }
          .num {
            font-size: 25px;
            font-weight: bold;
          }
          .unit {
            margin-left: 3px;
            font-size: 15px;
            font-weight: bold;
          }
        }
      }
    }
  }
  .center-map {
    left: 480px;
    top: 130px;
    width: 900px;
    height: 500px;
  }
  .center-bottom {
    left: 480px;
    top: 640px;
    width: 900px;
    height: 300px;
  }
}
</style>
<style lang="scss">
.map-tooltip {
  padding: 5px 15px;
  min-width: 120px;
  p {
    height: 25px;
    line-height: 25px;
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 5px;
  }
}
</style>
