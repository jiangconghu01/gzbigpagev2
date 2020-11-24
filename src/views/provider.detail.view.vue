<template>
  <div class="provider-detailview">
    <div class="container top-box">
      <h2 class="chart-title"><i>基本</i> <i>信息</i></h2>
      <ul>
        <li class="th">
          <span class="item" v-for="item in tabledata" :key="item.name">{{ item.name }}</span>
        </li>
        <li class="td">
          <span class="item" v-for="(item, index) in tabledata" :key="index">{{ item.value }}</span>
        </li>
      </ul>
    </div>
    <div class="container center-box">
      <div class="center-left frame-back-box">
        <h2 class="chart-title">近3年采购来源渠道分析图</h2>
        <div class="chart-box" id="detail-view-top-left"></div>
      </div>
      <div class="center-center frame-back-box" @click="showModalTable('score_num')">
        <h2 class="chart-title">综合指标得分情况（满分100）</h2>
        <div class="chart-box" id="detail-view-top-center"></div>
      </div>
      <div class="center-right frame-back-box">
        <h2 class="chart-title">关键指标雷达图</h2>
        <div class="chart-box" id="detail-view-top-right"></div>
      </div>
    </div>
    <div class="container bottom-box">
      <div class="bottom-left frame-back-box">
        <h2 class="chart-title">账龄金额统计分析图</h2>
        <div class="chart-box" id="detail-view-bottom-left"></div>
      </div>
      <div class="bottom-right frame-back-box">
        <h2 class="chart-title">全年度列账与付款情况分析</h2>
        <div class="chart-box" id="detail-view-bottom-right"></div>
      </div>
    </div>
    <userModalTable ref="modal-table" :type="tableType"></userModalTable>
  </div>
</template>

<script>
//取供应商接口
const getProvider = '/bigScreen/guiz/supplierIndexData/supplierList'
//取图形的指标接口，图形编码从上到下，从左到右0101，0102（总览图：01，重点图：02，详情图：03）
const getEncode = '/bigScreen/guiz/supplierIndexData/indexGroups'
//取指标值的接口
const encodeUrl = '/bigScreen/guiz/supplierIndexData/indexValues'
import { getDatesParamsNew } from '../utils/commFun'
import leftop_config from '../chartconfig/providerDetailView/top.left'
import centertop_config from '../chartconfig/providerDetailView/top.center'
import rightop_config from '../chartconfig/providerDetailView/top.right'
import leftbottom_config from '../chartconfig/providerDetailView/bottom.left'
import rightbottom_config from '../chartconfig/providerDetailView/bottom.right'
import userModalTable from '../components/allview/userModalTable.vue'
export default {
  data() {
    return {
      tabledata: [],
      tableType: ''
    }
  },
  created() {},
  components: {
    userModalTable
  },
  computed: {},
  methods: {
    showModalTable(param) {
      this.tableType = param
      this.$refs['modal-table'].showModal()
    },
    initPage() {
      const date = window.sessionStorage.getItem('selectDate')
      const citycode = window.sessionStorage.getItem('cityCode')
      const businesstype = window.sessionStorage.getItem('buniessType')
      const current_provider = JSON.parse(window.sessionStorage.getItem('keypointProvider'))
      this.topTable(date, citycode, businesstype, current_provider)
      this.lefttopchart(date, citycode, businesstype, current_provider)
      this.centertopchart(date, citycode, businesstype, current_provider)
      this.righttopchart(date, citycode, businesstype, current_provider)
      this.leftbottomchart(date, citycode, businesstype, current_provider)
      this.rightbottomchart(date, citycode, businesstype, current_provider)
    },
    //top图表格请求参数
    async topTable(date, citycode, businesstype, current_provider) {
      const encodes = await this.$http.post(getEncode, { idxGroup: '0301' })
      const encodetop = encodes.data.map((val) => val.idxCde)
      const topParam = JSON.parse(getDatesParamsNew([date], [citycode], encodetop, [current_provider.gysbm], businesstype))
      this.$http
        .post(encodeUrl, topParam)
        .then((resData) => {
          const encodelist = encodes.data
          const gysbm = current_provider.gysbm
          const gysmc = current_provider.gysmc
          const tabledata = encodelist.map((val) => {
            const t = resData.data.find((ele) => ele.idxCode === val.idxCde)
            val.value = t.idxValue
            if (val.idxName === '注册资本') {
              val.name = val.idxName + '(万)'
              val.value = (t.idxValue / 10000).toFixed(2)
            } else if (val.idxName === '实缴资本') {
              val.name = val.idxName + '(万)'
              val.value = (t.idxValue / 10000).toFixed(2)
            } else if (val.idxName === '资本差异') {
              val.name = val.idxName + '(%)'
            } else if (val.idxName === '法律诉讼') {
              val.name = val.idxName + '(次)'
            } else if (val.idxName === '不良记录') {
              val.name = val.idxName + '(笔)'
            } else {
              val.name = val.idxName
            }
            return val
          })
          tabledata.unshift({ name: '供应商名称', value: gysmc })
          tabledata.unshift({ name: '供应商编码', value: gysbm })
          this.tabledata = tabledata
        })
        .catch((e) => {
          console.log(e)
        })
    },
    async lefttopchart(date, citycode, businesstype, current_provider) {
      const encodesres = await this.$http.post(getEncode, { idxGroup: '0302' })
      const encodes = encodesres.data.map((val) => val.idxCde)
      const curDate = new Date()
      const dateArr = [String(curDate.getFullYear() - 2 + '-12'), String(curDate.getFullYear() - 1 + '-12'), date]
      const param = JSON.parse(getDatesParamsNew(dateArr, [citycode], encodes, [current_provider.gysbm], businesstype))
      this.$http
        .post(encodeUrl, param)
        .then((resData) => {
          const config = leftop_config
          const legend = encodesres.data.map((val) => val.idxName.replace('_合同金额', ''))
          const serises = encodesres.data.map((val) => {
            const t = {
              name: val.idxName.replace('_合同金额', ''),
              type: 'bar',
              stack: 'y',
              data: []
            }
            const data = resData.data ? resData.data.filter((ele) => ele.idxCode === val.idxCde) : []
            const data2 = data.map((e) => {
              const t = e
              t.value = (Number(e.idxValue) / 10000).toFixed(2)
              t.name = e.idxName
              return t
            })
            t.data = data2
            return t
          })
          config.legend.data = legend
          config.series = serises
          const box = this.$echarts.init(document.getElementById('detail-view-top-left'))
          box.setOption(config)
        })
        .catch((e) => {
          console.log(e)
        })
    },
    async centertopchart(date, citycode, businesstype, current_provider) {
      const encodesres = await this.$http.post(getEncode, { idxGroup: '0303' })
      const encodes = encodesres.data.map((val) => val.idxCde)
      const param = JSON.parse(getDatesParamsNew([date], [citycode], encodes, [current_provider.gysbm], businesstype))
      this.$http
        .post(encodeUrl, param)
        .then((resData) => {
          const config = centertop_config
          config.series[2].data[0].value = resData.data[0].idxValue
          const box = this.$echarts.init(document.getElementById('detail-view-top-center'))
          box.setOption(config)
        })
        .catch((e) => {
          console.log(e)
        })
    },
    async righttopchart(date, citycode, businesstype, current_provider) {
      const encodesres = await this.$http.post(getEncode, { idxGroup: '0304' })
      const encodes = encodesres.data.map((val) => val.idxCde)
      const param = JSON.parse(getDatesParamsNew([date], [citycode], encodes, [current_provider.gysbm], businesstype))
      this.$http
        .post(encodeUrl, param)
        .then((resData) => {
          const config = rightop_config

          const indicator = encodesres.data.map((val) => {
            val.name = val.idxName
            val.max = 1
            return val
          })
          const data = resData.data.map((val) => val.idxValue)
          config.indicator = indicator
          config.series[0].data[0] = data
          const box = this.$echarts.init(document.getElementById('detail-view-top-right'))
          box.setOption(config)
        })
        .catch((e) => {
          console.log(e)
        })
    },
    async leftbottomchart(date, citycode, businesstype, current_provider) {
      const encodesres = await this.$http.post(getEncode, { idxGroup: '0305' })
      const encodes = encodesres.data.map((val) => val.idxCde)
      const param = JSON.parse(getDatesParamsNew([date], [citycode], encodes, [current_provider.gysbm], businesstype))
      this.$http
        .post(encodeUrl, param)
        .then((resData) => {
          const config = leftbottom_config
          const data = resData.data.map((val) => (Number(val.idxValue) / 10000).toFixed(2))
          config.series[0].data = data
          const box = this.$echarts.init(document.getElementById('detail-view-bottom-left'))
          box.setOption(config)
        })
        .catch((e) => {
          console.log(e)
        })
    },
    async rightbottomchart(date, citycode, businesstype, current_provider) {
      const encodesres = await this.$http.post(getEncode, { idxGroup: '0306' })
      const encodes = encodesres.data.map((val) => val.idxCde)
      const curDate = new Date()
      const dateList = Array.from({ length: 12 }, (v, k) => {
        const d = k + 1 > 9 ? k + 1 : '0' + (k + 1)
        return curDate.getFullYear() + '-' + d
      })
      const param = JSON.parse(getDatesParamsNew(dateList, [citycode], encodes, [current_provider.gysbm], businesstype))
      this.$http
        .post(encodeUrl, param)
        .then((resData) => {
          const config = rightbottom_config
          const encodes = encodesres.data
          const encode1 = encodes[0].idxCde
          const encode2 = encodes[1].idxCde
          const data1 = []
          const data2 = []
          resData.data.forEach((val) => {
            if (val.idxCode === encode1) {
              data1.push({ name: val.idxName, value: (Number(val.idxValue) / 10000).toFixed(2) })
            }
            if (val.idxCode === encode2) {
              data2.push({ name: val.idxName, value: (Number(val.idxValue) / 10000).toFixed(2) })
            }
          })
          config.series[0].data = data1
          config.series[1].data = data2
          const box = this.$echarts.init(document.getElementById('detail-view-bottom-right'))
          box.setOption(config)
        })
        .catch((e) => {
          console.log(e)
        })
    }
  },
  mounted() {
    this.initPage()
  }
}
</script>
<style lang="scss" scoped>
.provider-detailview {
  .top-box {
    height: 140px;
    background: url('../assets/box_top_back.jpg') no-repeat;
    background-size: contain;
    display: flex;
    ul {
      flex: 1;
      padding: 20px 30px 20px 15px;
      .th {
        height: 50%;
        display: flex;
        align-items: center;
        background-color: #173fb0;
        & .item:nth-child(2) {
          flex: 1;
        }
      }
      .td {
        display: flex;
        height: 50%;
        align-items: center;
        background-color: rgba(23, 64, 176, 0.411);
        & .item:nth-child(2) {
          flex: 1;
        }
      }
      .item {
        min-width: 170px;
        font-size: 20px;
        font-weight: bold;
      }
    }
    .chart-title {
      width: 70px;
      height: 100%;
      font-size: 22px;

      color: #fff;
      margin-bottom: 0;
      padding-top: 55px;
      padding-left: 15px;
      text-shadow: 5px 7px 5px rgba(0, 0, 0, 0.24), 5px 9px 5px rgba(0, 0, 0, 0.521);
      position: relative;
      i {
        font-weight: bold;
      }
      &::before {
        content: '';
        display: block;
        position: absolute;
        right: 0;
        top: 0;
        height: 100%;
        width: 2px;
        background-color: rgba(13, 60, 140, 0.836);
      }
      &::after {
        content: '';
        display: block;
        position: absolute;
        right: 1px;
        top: 25px;
        width: 4px;
        height: 35px;
        background-color: #0d9bff;
      }
    }
  }
  .center-box {
    height: 380px;
    margin-top: 20px;
    display: flex;
    & > div {
      flex: 1;
    }
    .center-center {
      margin: 0 25px;
    }
  }
  .bottom-box {
    height: 380px;
    margin-top: 20px;
    display: flex;
    .bottom-left {
      width: 800px;
    }
    .bottom-right {
      margin-left: 20px;
      flex: 1;
    }
  }
}
</style>
