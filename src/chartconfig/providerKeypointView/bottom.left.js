import { chartFontStyle } from '../static'
const option = {
  textStyle: chartFontStyle,
  title: {
    text: '供应商\n业务类型',
    left: 'center',
    top: '41%',
    textStyle: {
      fontSize: 20,
      color: '#fff',
      lineHeight: 32,
      fontWeight: 'bold'
    }
  },
  grid: {
    top: '15%',
    left: '25%',
    right: '15%',
    bottom: '15%'
  },
  color: [
    '#D55CE7',
    '#6B51FE',
    '#E85089',
    '#AD6BE7',
    '#F5952F',
    '#58ABF1',
    '#F2DA32',
    '#16D4D2',
    '#16D4D2',
    '#F2DA32',
    '#58ABF1',
    '#6A50FF',
    '#D55CE7',
    '#FFB800',
    '#0066ff',
    '#2F4056',
    '#e5e91b',
    '#6fd21e'
  ],
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {d}%'
  },
  series: [
    {
      name: '统计',
      type: 'pie',
      radius: [50, 80],
      center: ['50%', '50%'],
      startAngle: 45,
      label: {
        show: true,
        lineHeight: 20,
        position: 'outer',
        alignTo: 'labelLine',
        margin: 1,
        color: 'rgba(255,255,255,0.8)',
        bleedMargin: 50,
        fontSize: 11,
        padding: [5, 0, 0, 0],
        // formatter: function(params) {
        // //   return `<p style="color:#17d3ba;">${(params.value * 100).toFixed(1)}%</p>
        // //     <p style="">${params.name}</p>`
        //     return params.value * 100 + '%' + '\n' + params.name
        // },
        //为0的不显示
        formatter: function(params) {
          const l = params.name.length
          const lineNum = ~~(l / 6)
          const namelist = []
          for (let index = 0; index <= lineNum; index++) {
            const n = params.name.substr(index * 6, (index + 1) * 6)
            n && namelist.push(n)
          }
          const t_name_list = namelist.map((v) => {
            return '{b|' + v + '}'
          })
          if (params.value == 0 || !params.value) {
            return ''
          } else {
            return ['{a|' + (params.value * 100).toFixed(1) + '%}', ...t_name_list].join('\n')
          }
        },

        rich: {
          a: {
            color: '#17d3ba',
            lineHeight: 10
          },
          b: {
            color: '#fff',
            height: 25,
            fontSize: 16,
            align: 'left'
          }
        },
        textStyle: {
          fontSize: 16,
          color: '#4FFFE4'
        }
        // position: 'outside'
      },
      labelLine: {
        lineStyle: {
          color: '#fff'
        }
      },
      emphasis: {
        label: {
          show: true
        }
      },
      data: [
        {
          value: 4.37,
          name: 'rose1'
        },
        {
          value: 1.46,
          name: 'rose2'
        },
        {
          value: 12.5,
          name: 'rose3'
        },
        {
          value: 14.58,
          name: 'rose4'
        },
        {
          value: 15.0,
          name: 'rose5'
        },
        {
          value: 19.38,
          name: 'rose6'
        },
        {
          value: 16.67,
          name: 'rose7'
        },
        {
          value: 16.04,
          name: 'rose8'
        }
      ]
    }
  ]
}
export default option
