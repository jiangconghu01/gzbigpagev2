<template>
  <div class="provider-detailview">
    <div class="container top-box">
      <h2 class="chart-title"><i>基本</i> <i>信息</i></h2>
      <ul>
        <li class="th">
          <span class="item" v-for="item in tabledata" :key="item">{{ item.name }}</span>
        </li>
        <li class="td">
          <span class="item" v-for="item in tabledata" :key="item">{{ item.value }}</span>
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
    <!-- <userModalTable :isShowTabe="showTable" :type="tableType" @change="showStatusChange"></userModalTable> -->
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
import leftop_config from '../chartconfig/providerDetailView/top.left'
import centertop_config from '../chartconfig/providerDetailView/top.center'
import rightop_config from '../chartconfig/providerDetailView/top.right'
import leftbottom_config from '../chartconfig/providerDetailView/bottom.left'
import rightbottom_config from '../chartconfig/providerDetailView/bottom.right'
export default {
  data() {
    return {
      tabledata: []
    }
  },
  created() {},
  components: {},
  computed: {},
  methods: {
    showModalTable(param) {
      console.log(param)
    },
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
      this.centertopchart(date, citycode, businesstype)
      this.righttopchart(date, citycode, businesstype)
      this.leftbottomchart(date, citycode, businesstype)
      this.rightbottomchart(date, citycode, businesstype)
    },
    async lefttopchart(date, citycode, businesstype) {
      const encodes = await this.$http.post(getEncode, { idxGroup: '0301' })
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
  mounted() {}
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
