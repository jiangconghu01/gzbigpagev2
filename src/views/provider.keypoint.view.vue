<template>
  <div class="provider-keypointview">
    <div class="container top-box">
      <div class="top-left frame-back-box">
        <h2 class="chart-title">供应商列账情况统计图</h2>
        <div class="chart-unit-text">单位：万元</div>
        <div class="chart-box" id="keypoint-view-top-left"></div>
      </div>
      <div class="top-right frame-back-box">
        <h2 class="chart-title">信用信息分布情况统计图</h2>
        <div class="chart-unit-text">单位：个</div>
        <div class="chart-box" id="keypoint-view-top-right"></div>
      </div>
    </div>
    <div class="container bottom-box">
      <div class="bottom-left frame-back-box">
        <h2 class="chart-title">供应商行业类型情况统计图</h2>
        <div class="chart-box" id="keypoint-view-bottom-left"></div>
      </div>
      <div class="bottom-center frame-back-box">
        <h2 class="chart-title">当年签订合同的采购方式分布统计图</h2>
        <div class="chart-unit-text">单位：个</div>
        <div class="chart-box" id="keypoint-view-bottom-center"></div>
      </div>
      <div class="bottom-right frame-back-box">
        <h2 class="chart-title">注册资本和实缴资本差异分析</h2>
        <div class="chart-unit-text">单位：百万元</div>
        <div class="chart-box" id="keypoint-view-bottom-right"></div>
      </div>
    </div>
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
//取供应商接口
const getProvider = '/bigScreen/guiz/supplierIndexData/supplierList'
//取图形的指标接口，图形编码从上到下，从左到右0101，0102（总览图：01，重点图：02，详情图：03）
const getEncode = '/bigScreen/guiz/supplierIndexData/indexGroups'
//取指标值的接口
const encodeUrl = '/bigScreen/guiz/supplierIndexData/indexValues'
import { getDatesParams, getDatesParamsNew } from '../utils/commFun'
import leftop_config from '../chartconfig/providerKeypointView/top.left'
import rightop_config from '../chartconfig/providerKeypointView/top.right.bar'
import bottomleft_config from '../chartconfig/providerKeypointView/bottom.left'
import centerbottom_config from '../chartconfig/providerKeypointView/bottom.center'
import rightbottom_config from '../chartconfig/providerKeypointView/bottom.right'
import { mapGetters, mapMutations } from 'vuex'
export default {
  data() {
    return {
      providerList: []
    }
  },
  created() {},
  components: {},
  computed: {
    ...mapGetters(['getCityCode', 'getSelectDate', 'getBuniessType'])
  },
  methods: {
    ...mapMutations(['setKeypointProvider']),
    async initPage() {
      const date = window.sessionStorage.getItem('selectDate')
      const citycode = window.sessionStorage.getItem('cityCode')
      const businesstype = window.sessionStorage.getItem('buniessType')
      const providerList = await this.$http.post(getProvider, { accountCode: citycode, monthId: date, ywlx: businesstype })
      if (!(providerList.data && providerList.data.length > 0)) {
        this.$message.error('本月暂无供应商！')
        return
      }
      this.providerList = providerList.data
      this.updatePage()
    },

    updatePage() {
      const date = window.sessionStorage.getItem('selectDate')
      const citycode = window.sessionStorage.getItem('cityCode')
      const businesstype = window.sessionStorage.getItem('buniessType')
      this.lefttopchart(date, citycode, businesstype)
      this.righttopchart(date, citycode, businesstype)
      this.leftbottomchart(date, citycode, businesstype)
      this.centerbottomchart(date, citycode, businesstype)
      this.rightbottomchart(date, citycode, businesstype)
    },
    //bottom-left图表用第一套接口查数据
    async leftbottomchart(date, citycode, businesstype) {
      this.$http.post('/channelBigScreen/modInfoList', { viewCode: '2002', chnlType: typeMap[businesstype] }).then((res) => {
        const update2pie = res.data[0].idxs.map((ele) => ele.idxCde)
        const chartCode = res.data[0].chartCode
        const update2pieParam = JSON.parse(getDatesParams([date], [citycode], update2pie, businesstype, chartCode))
        this.$http.post('/channelBigScreen/modIdxVOList', update2pieParam).then((resData) => {
          const label = ['房地产', '汽车', '通讯设备', '土木工程', '软件和技术服务', '批发']
          bottomleft_config.series[0].data = resData.data.map((val, index) => {
            return {
              name: label[index],
              value: val.idxValue
            }
          })
          const box = this.$echarts.init(document.getElementById('keypoint-view-bottom-left'))
          box.setOption(bottomleft_config)
        })
      })
    },
    async lefttopchart(date, citycode, businesstype) {
      const encodes = await this.$http.post(getEncode, { idxGroup: '0201' })
      //left-top图表请求参数
      const providerListRqu = this.providerList.map((ele) => ele.gysbm)
      const encodetopleft = encodes.data.map((v) => v.idxCde)
      const p = getDatesParamsNew([date], [citycode], encodetopleft, providerListRqu, businesstype)
      const leftTopParam = JSON.parse(p)
      this.$http
        .post(encodeUrl, leftTopParam)
        .then((resData) => {
          const providerListRqu = this.providerList.map((ele) => ele.gysjc)
          const config = leftop_config
          //纵坐标数据
          config.yAxis.data = providerListRqu
          //列账金额
          const series = resData
          const series1Data = series.data.filter((val) => val.idxCode === 'ZDGYS_0001')
          config.series[0].data = series1Data.map((val) => {
            val.name = val.gysjc
            val.value = (Number(val.idxValue) / 10000).toFixed(2)
            return val
          })
          const series2Data = series.data.filter((val) => val.idxCode === 'ZDGYS_0002')
          config.series[1].data = series2Data.map((val) => {
            val.name = val.gysjc
            val.value = (Number(val.idxValue) / 10000).toFixed(2)
            return val
          })
          const series3Data = series.data.filter((val) => val.idxCode === 'ZDGYS_0003')
          config.series[2].data = series3Data.map((val) => {
            val.name = val.gysjc
            val.value = (Number(val.idxValue) / 10000).toFixed(2)
            return val
          })
          const box = this.$echarts.init(document.getElementById('keypoint-view-top-left'))
          box.setOption(config)
          this.handleChartClick(box, 'yAxis.category')
        })
        .catch((e) => {
          console.log(e)
        })
    },

    async righttopchart(date, citycode, businesstype) {
      const encodes = await this.$http.post(getEncode, { idxGroup: '0202' })
      //right-top图表请求参数
      const providerListRqu = this.providerList.map((ele) => ele.gysbm)
      const encodetopright = encodes.data.map((v) => v.idxCde)
      const p = getDatesParamsNew([date], [citycode], encodetopright, providerListRqu, businesstype)
      const rightTopParam = JSON.parse(p)
      this.$http
        .post(encodeUrl, rightTopParam)
        .then((resData) => {
          const providerListRqu = this.providerList.map((ele) => ele.gysjc)
          const config = rightop_config
          //横坐标数据
          config.xAxis.data = providerListRqu
          //法律诉讼
          const series = resData
          const series1Data = series.data.filter((val) => val.idxCode === 'ZDGYS_0004')
          config.series[0].data = series1Data.map((val) => {
            val.name = val.gysjc
            val.value = val.idxValue
            return val
          })
          const series2Data = series.data.filter((val) => val.idxCode === 'ZDGYS_0005')
          config.series[1].data = series2Data.map((val) => {
            val.name = val.gysjc
            val.value = val.idxValue
            return val
          })
          const series3Data = series.data.filter((val) => val.idxCode === 'ZDGYS_0006')
          config.series[2].data = series3Data.map((val) => {
            val.name = val.gysjc
            val.value = val.idxValue
            return val
          })
          const box = this.$echarts.init(document.getElementById('keypoint-view-top-right'))
          box.setOption(config)
          this.handleChartClick(box)
        })
        .catch((e) => {
          console.log(e)
        })
    },

    async centerbottomchart(date, citycode, businesstype) {
      const encodes = await this.$http.post(getEncode, { idxGroup: '0204' })
      //center-bottom
      const providerListRqu = this.providerList.map((ele) => ele.gysbm)
      const encodebottomcenter = encodes.data.map((v) => v.idxCde)
      const p = getDatesParamsNew([date], [citycode], encodebottomcenter, providerListRqu, businesstype)
      const centerbottomParam = JSON.parse(p)
      this.$http
        .post(encodeUrl, centerbottomParam)
        .then((resData) => {
          const providerListRqu = this.providerList.map((ele) => ele.gysjc)
          const config = centerbottom_config
          //横坐标数据
          config.xAxis.data = providerListRqu
          const series = resData
          const series1Data = series.data.filter((val) => val.idxCode === 'ZDGYS_0007')
          config.series[0].data = series1Data.map((val) => {
            val.name = val.gysjc
            val.value = val.idxValue
            return val
          })
          const series2Data = series.data.filter((val) => val.idxCode === 'ZDGYS_0008')
          config.series[1].data = series2Data.map((val) => {
            val.name = val.gysjc
            val.value = val.idxValue
            return val
          })
          const series3Data = series.data.filter((val) => val.idxCode === 'ZDGYS_0009')
          config.series[2].data = series3Data.map((val) => {
            val.name = val.gysjc
            val.value = val.idxValue
            return val
          })
          const series4Data = series.data.filter((val) => val.idxCode === 'ZDGYS_0010')
          config.series[3].data = series4Data.map((val) => {
            val.name = val.gysjc
            val.value = val.idxValue
            return val
          })
          const series5Data = series.data.filter((val) => val.idxCode === 'ZDGYS_0011')
          config.series[4].data = series5Data.map((val) => {
            val.name = val.gysjc
            val.value = val.idxValue
            return val
          })
          const series6Data = series.data.filter((val) => val.idxCode === 'ZDGYS_0012')
          config.series[5].data = series6Data.map((val) => {
            val.name = val.gysjc
            val.value = val.idxValue
            return val
          })
          const series7Data = series.data.filter((val) => val.idxCode === 'ZDGYS_0013')
          config.series[6].data = series7Data.map((val) => {
            val.name = val.gysjc
            val.value = val.idxValue
            return val
          })
          const series8Data = series.data.filter((val) => val.idxCode === 'ZDGYS_0014')
          config.series[7].data = series8Data.map((val) => {
            val.name = val.gysjc
            val.value = val.idxValue
            return val
          })
          const series9Data = series.data.filter((val) => val.idxCode === 'ZDGYS_0015')
          config.series[8].data = series9Data.map((val) => {
            val.name = val.gysjc
            val.value = val.idxValue
            return val
          })
          const box = this.$echarts.init(document.getElementById('keypoint-view-bottom-center'))
          box.setOption(config)
          this.handleChartClick(box)
        })
        .catch((e) => {
          console.log(e)
        })
    },

    async rightbottomchart(date, citycode, businesstype) {
      const encodes = await this.$http.post(getEncode, { idxGroup: '0205' })
      //right-bottom
      const providerListRqu = this.providerList.map((ele) => ele.gysbm)
      const encodebottomright = encodes.data.map((v) => v.idxCde)
      const p = getDatesParamsNew([date], [citycode], encodebottomright, providerListRqu, businesstype)
      const rightbottomParam = JSON.parse(p)
      this.$http
        .post(encodeUrl, rightbottomParam)
        .then((resData) => {
          const providerListRqu = this.providerList.map((ele) => ele.gysjc)
          const config = rightbottom_config
          //横坐标数据
          config.xAxis.data = providerListRqu
          const series = resData
          const series1Data = series.data.filter((val) => val.idxCode === 'ZDGYS_0017')
          config.series[0].data = series1Data.map((val) => {
            val.name = val.gysjc
            val.value = (Number(val.idxValue) / 10000).toFixed(2)
            return val
          })
          const series2Data = series.data.filter((val) => val.idxCode === 'ZDGYS_0018')
          config.series[1].data = series2Data.map((val) => {
            val.name = val.gysjc
            val.value = (Number(val.idxValue) / 10000).toFixed(2)
            return val
          })
          const series3Data = series.data.filter((val) => val.idxCode === 'ZDGYS_0019')
          config.series[2].data = series3Data.map((val) => {
            val.name = val.gysjc
            val.value = (Number(val.idxValue) / 10000).toFixed(2)
            return val
          })
          const box = this.$echarts.init(document.getElementById('keypoint-view-bottom-right'))
          box.setOption(config)
        })
        .catch((e) => {
          console.log(e)
        })
    },
    handleChartClick(box, type) {
      const target = type || 'xAxis.category'
      const _this = this
      box.off('click')
      box.on('click', target, function(params) {
        const t = _this.providerList.filter((ele) => ele.gysjc === params.value)
        const provider = t[0] ? t[0] : {}
        _this.setKeypointProvider(provider)
        _this.toDetailPage()
      })
    },
    toDetailPage() {
      const { href } = this.$router.resolve({ name: 'detailview' })
      window.open(href, '_blank')
    }
  },
  watch: {
    getCityCode(nv, ov) {
      this.updatePage()
    },
    getSelectDate(nv, ov) {
      this.updatePage()
    },
    getBuniessType(nv, ov) {
      this.updatePage()
    }
  },
  mounted() {
    this.initPage()
  }
}
</script>
<style lang="scss" scoped>
.provider-keypointview {
  .top-box {
    height: 460px;
    display: flex;
    .top-left {
      width: 780px;
    }
    .top-right {
      margin-left: 20px;
      flex: 1;
    }
  }
  .bottom-box {
    margin-top: 25px;
    height: 460px;
    display: flex;
    .bottom-left {
      width: 460px;
    }
    .bottom-center {
      margin-left: 20px;
      flex: 1;
    }
    .bottom-right {
      margin-left: 20px;
      flex: 1;
    }
  }
}
</style>
