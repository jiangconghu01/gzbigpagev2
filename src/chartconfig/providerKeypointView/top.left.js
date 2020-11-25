import { chartFontStyle } from '../static'
const option = {
  textStyle: chartFontStyle,
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {
    right: '17%',
    top: '2%',
    itemWidth: 15,
    itemHeight: 15,
    textStyle: {
      fontSize: 16,
      color: '#BFE4F2'
    },
    data: ['挂账金额', '支付金额', '余额']
  },
  grid: {
    left: '3%',
    right: '14%',
    bottom: '3%',
    containLabel: true
  },
  dataZoom: [
    {
      type: 'slider',
      yAxisIndex: 0,
      filterMode: 'empty',
      bottom: '12%',
      top: '12%',
      right: '2%',
      start: 60,
      end: 100,
      textStyle: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 12
      }
    },
    // {
    //     type: 'slider',
    //     yAxisIndex: 0,
    //     filterMode: 'empty'
    // },
    {
      type: 'inside',
      yAxisIndex: 0,
      filterMode: 'empty'
    }
    // {
    //     type: 'inside',
    //     yAxisIndex: 0,
    //     filterMode: 'empty'
    // }
  ],
  xAxis: {
    axisTick: {
      show: false
    },
    axisLabel: {
      color: '#388DD3'
    },
    axisLine: {
      show: false,
      lineStyle: {
        color: '#C9EFFA'
      }
    },
    splitLine: {
      lineStyle: {
        color: '#163485'
      }
    }
  },
  yAxis: [
    {
      type: 'category',
      triggerEvent: true,
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#BFE3F2',
        clickable: true,
        fontSize: 16
      },
      axisLine: {
        lineStyle: {
          color: '#183888'
        }
      },
      data: [{ name: '公司甲', value: '公司甲', v: 3 }, '公司乙', '公司丙', '公司丁']
    }
  ],
  series: [
    {
      name: '挂账金额',
      type: 'bar',
      barWidth: 15,
      //   barGap: '30',
      data: [732.45, 896.23, 628.06, 500.54],
      itemStyle: {
        color: '#16D4D2'
      },
      label: {
        show: true,
        position: 'right',
        color: '#BFE3F2',
        fontSize: 14,
        offset: [10, 0]
      }
    },
    {
      name: '支付金额',
      type: 'bar',
      barWidth: 15,
      //   barGap: '30',
      data: [567.15, 500.86, 754.53, 313.23],
      itemStyle: {
        color: '#F2DA32'
      },
      label: {
        show: true,
        position: 'right',
        color: '#BFE3F2',
        fontSize: 14,
        offset: [10, 0]
      }
    },
    {
      name: '余额',
      type: 'bar',
      barWidth: 15,
      //   barGap: '30',
      data: [682.15, 953.86, 754.53, 318.23],
      itemStyle: {
        color: '#58ABF1'
      },
      label: {
        show: true,
        position: 'right',
        color: '#58ABF1',
        fontSize: 14,
        offset: [10, 0]
      }
    }
  ]
}
export default option
