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
        <div class="chart-unit-text">单位：万元</div>
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
//取供应商接口
const getProvider = '/bigScreen/guiz/supplierIndexData/supplierList'
//取图形的指标接口，图形编码从上到下，从左到右0101，0102（总览图：01，重点图：02，详情图：03）
const getEncode = '/bigScreen/guiz/supplierIndexData/indexGroups'
//取指标值的接口
const encodeUrl = '/bigScreen/guiz/supplierIndexData/indexValues'
import { getDatesParams, getDatesParamsNew } from '../utils/commFun'
import leftop_config from '../chartconfig/providerKeypointView/top.left'
export default {
  data() {
    return {
      providerList: []
    }
  },
  created() {},
  components: {},
  computed: {},
  methods: {
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
            val.value = val.idxValue
            return val
          })
          const series2Data = series.data.filter((val) => val.idxCode === 'ZDGYS_0002')
          config.series[1].data = series2Data.map((val) => {
            val.name = val.gysjc
            val.value = val.idxValue
            return val
          })
          const series3Data = series.data.filter((val) => val.idxCode === 'ZDGYS_0003')
          config.series[2].data = series3Data.map((val) => {
            val.name = val.gysjc
            val.value = val.idxValue
            return val
          })
          const box = this.$echarts.init(document.getElementById('keypoint-view-top-left'))
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
