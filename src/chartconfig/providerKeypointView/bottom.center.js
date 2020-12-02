import { chartFontStyle } from '../static'
const option = {
  textStyle: { ...chartFontStyle, color: '#ffffff' },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
    }
  },
  legend: {
    textStyle: {
      color: '#C7EBF9',
      fontSize: 16
    },
    left: 5,
    right: 90,
    itemWidth: 15,
    itemHeight: 15,
    data: ['公开招标', '邀请招标', '单一来源采购(公示)', '邀请询价', '邀请竞争性谈判', '公开比选', '公开询价', '单一来源采购(非公示)', '公开竞争性谈判', '电商采购']
  },
  grid: {
    left: '6%',
    right: '4%',
    bottom: 10,
    containLabel: true
  },
  xAxis: {
    triggerEvent: true,
    axisLabel: {
      interval: 0, //强制显示文字
      rotate: 30,
      color: '#398FD1',
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
    data: ['菜鸟网络', '长亭科技', '字节跳动', '字节跳动', '字节跳动', '字节跳动']
  },
  yAxis: [
    {
      axisTick: {
        lineStyle: {
          width: 2,
          color: '#398FD1'
        }
      },
      axisLabel: {
        textStyle: {
          color: '#398FD1',
          fontSize: 16
        }
      },
      splitLine: {
        lineStyle: {
          color: '#183688'
        }
      },
      axisLine: {
        //坐标轴轴线相关设置。数学上的x轴
        show: false,
        lineStyle: {
          color: '#C9EFFA'
        }
      }
    }
  ],
  color: ['#7211e2', '#ff8800', '#1d86db', '#6A50FF', '#D55CE7', '#FFB800', '#0066ff', '#2F4056', '#fffb00', '#05b36a'],
  series: [
    {
      name: '公开招标',
      type: 'bar',
      barWidth: '30%',
      stack: '广告',
      label: {
        normal: {
          show: true,
          position: 'inside',
          formatter: function(p) {
            return p.value > 0 ? p.value : ''
          },
          textStyle: {
            align: 'center',
            baseline: 'middle',
            fontSize: 15,
            fontWeight: '700'
          }
        }
      },
      data: [5, 3, 6, 5, 4, 2]
    },
    {
      name: '邀请招标',
      type: 'bar',
      stack: '广告',
      label: {
        normal: {
          show: true,
          position: 'inside',
          formatter: function(p) {
            return p.value > 0 ? p.value : ''
          },
          textStyle: {
            align: 'center',
            baseline: 'middle',
            fontSize: 15,
            fontWeight: '700'
          }
        }
      },
      data: [2, 0, 0, 0, 5, 0]
    },
    {
      name: '单一来源采购(公示)',
      type: 'bar',
      stack: '广告',
      label: {
        normal: {
          show: true,
          position: 'inside',
          formatter: function(p) {
            return p.value > 0 ? p.value : ''
          },
          textStyle: {
            align: 'center',
            baseline: 'middle',
            fontSize: 15,
            fontWeight: '700'
          }
        }
      },
      data: [1, 0, 0, 4, 0, 0]
    },
    {
      name: '邀请询价',
      type: 'bar',
      stack: '广告',
      label: {
        normal: {
          show: true,
          position: 'inside',
          formatter: function(p) {
            return p.value > 0 ? p.value : ''
          },
          textStyle: {
            align: 'center',
            baseline: 'middle',
            fontSize: 15,
            fontWeight: '700'
          }
        }
      },
      data: [0, 4, 0, 0, 0, 0]
    },
    {
      name: '邀请竞争性谈判',
      type: 'bar',
      stack: '广告',
      label: {
        normal: {
          show: true,
          position: 'inside',
          formatter: function(p) {
            return p.value > 0 ? p.value : ''
          },
          textStyle: {
            align: 'center',
            baseline: 'middle',
            fontSize: 15,
            fontWeight: '700'
          }
        }
      },
      data: [0, 0, 3, 2, 0, 4]
    },
    {
      name: '公开比选',
      type: 'bar',
      stack: '广告',
      label: {
        normal: {
          show: true,
          position: 'inside',
          formatter: function(p) {
            return p.value > 0 ? p.value : ''
          },
          textStyle: {
            align: 'center',
            baseline: 'middle',
            fontSize: 15,
            fontWeight: '700'
          }
        }
      },
      data: [0, 0, 3, 2, 0, 4]
    },
    {
      name: '公开询价',
      type: 'bar',
      stack: '广告',
      label: {
        normal: {
          show: true,
          position: 'inside',
          formatter: function(p) {
            return p.value > 0 ? p.value : ''
          },
          textStyle: {
            align: 'center',
            baseline: 'middle',
            fontSize: 15,
            fontWeight: '700'
          }
        }
      },
      data: [0, 0, 3, 2, 0, 4]
    },
    {
      name: '单一来源采购(非公示)',
      type: 'bar',
      stack: '广告',
      label: {
        normal: {
          show: true,
          position: 'inside',
          formatter: function(p) {
            return p.value > 0 ? p.value : ''
          },
          textStyle: {
            align: 'center',
            baseline: 'middle',
            fontSize: 15,
            fontWeight: '700'
          }
        }
      },
      data: [0, 0, 3, 2, 0, 4]
    },
    {
      name: '公开竞争性谈判',
      type: 'bar',
      stack: '广告',
      label: {
        normal: {
          show: true,
          position: 'inside',
          formatter: function(p) {
            return p.value > 0 ? p.value : ''
          },
          textStyle: {
            align: 'center',
            baseline: 'middle',
            fontSize: 15,
            fontWeight: '700'
          }
        }
      },
      data: [0, 0, 3, 2, 0, 4]
    },
    {
      name: '电商采购',
      type: 'bar',
      stack: '广告',
      label: {
        normal: {
          show: true,
          position: 'inside',
          formatter: function(p) {
            return p.value > 0 ? p.value : ''
          },
          textStyle: {
            align: 'center',
            baseline: 'middle',
            fontSize: 15,
            fontWeight: '700'
          }
        }
      },
      data: [0, 0, 3, 2, 0, 4]
    }
  ]
}
export default option
