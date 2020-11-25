import echarts from 'echarts'
import { chartFontStyle } from '../static'
const option = {
  textStyle: chartFontStyle,
  tooltip: {
    show: true,
    trigger: 'axis',
    axisPointer: {
      lineStyle: {
        color: '#96B2CC'
      }
    },
    formatter: function(param) {
      //   let style = ''
      //   if (param[0] && param[0].data && param[0].data.datalength) {
      //     style = param[0].dataIndex < param[0].data.datalength - 3 ? '' : 'transform: rotate(180deg) scaleY(-1)'
      //   }
      return `<div class="test_triangle_border">
         <div class="popup">
          <span><em></em></span>
          <p class="name">${param[0].axisValueLabel}</p>
          <p class="num">${param[0].value}</p>
      </div>
     </div>`
      // return param.data.name + '\n{b|' + param.data.value * 100 + '%'
    },
    position: function(pos, params, dom, rect, size) {
      var obj = {
        top: pos[1] - 130
      }
      var t = 'left'
      if (params[0] && params[0].data && params[0].data.datalength) {
        t = params[0].dataIndex < params[0].data.datalength - 2 ? 'left' : 'right'
      }
      obj[t] = t === 'left' ? pos[0] : 0
      //   const

      return obj
    }
  },
  grid: {
    top: '15%',
    // left: '95',
    right: '2%',
    bottom: '5%',
    containLabel: true
  },
  xAxis: {
    axisLabel: {
      color: '#398FD1',
      interval: 0,
      rotate: 35,
      margin: 20,
      fontSize: 16
    },
    axisLine: {
      lineStyle: {
        color: '#183888'
      }
    },
    axisTick: {
      alignWithLabel: true,
      lineStyle: {
        width: 2,
        color: '#398FD1'
      }
    },
    splitLine: {
      lineStyle: {
        color: '#183888'
      }
    },
    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  },

  yAxis: {
    axisTick: {
      show: false
    },
    axisLabel: {
      textStyle: {
        color: '#398FD1',
        fontSize: 16,
        fontWeight: 0
      }
    },
    splitLine: {
      lineStyle: {
        color: '#183688'
      }
    },
    axisLine: {
      //坐标轴轴线相关设置。数学上的x轴
      show: false
    }
  },
  series: [
    {
      name: '注册总量',
      type: 'line',
      // smooth: true, //是否平滑
      showAllSymbol: true,
      // symbol: 'image://./static/images/guang-circle.png',
      symbol: 'circle',
      symbolSize: 16,
      lineStyle: {
        normal: {
          color: 'rgb(241, 218, 50)',
          shadowColor: 'rgba(0, 0, 0, .3)',
          shadowBlur: 0,
          shadowOffsetY: 5,
          shadowOffsetX: 5
        }
      },
      itemStyle: {
        color: 'rgb(241, 218, 50)',
        borderColor: '#fff',
        borderWidth: 3
        // shadowColor: 'rgba(0, 0, 0, .3)',
        // shadowBlur: 0,
        // shadowOffsetY: 2,
        // shadowOffsetX: 2
      },
      areaStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(
            0,
            0,
            0,
            1,
            [
              {
                offset: 0,
                color: '#96873e'
              },
              {
                offset: 1,
                color: '#18184d'
              }
            ],
            false
          ),
          shadowColor: 'rgba(108,80,243, 0.9)',
          shadowBlur: 20
        }
      },
      data: [502.84, 205.97, 332.79, 281.55, 398.35, 214.02]
    }
  ]
}
export default option
