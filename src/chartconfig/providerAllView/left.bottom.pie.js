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
  color: ['#D55CE7', '#F2DA32', '#6B51FE', '#16D4D2', '#fffb00', '#AD6BE7', '#F5952F', '#58ABF1'],
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)'
  },
  series: [
    {
      name: '统计',
      type: 'pie',
      radius: [50, 90],
      center: ['50%', '50%'],
      startAngle: 45,
      label: {
        show: true,
        color: '#fff',
        // alignTo: 'labelLine',
        // margin: 1,
        // bleedMargin: 50,
        // fontSize: 11,
        // padding: [5, 0, 0, 0],
        formatter: function(params) {
          //   return param.data.name + '\n{b|' + (param.data.value * 100).toFixed(1) + '%}'
          const l = params.name.length
          const lineNum = ~~(l / 7)
          const namelist = []
          for (let index = 0; index <= lineNum; index++) {
            const n = params.name.substr(index * 7, (index + 1) * 7)
            n && namelist.push(n)
          }
          const t_name_list = namelist.map((v) => {
            return '{b|' + v + '}'
          })

          return ['{a|' + (params.value * 100).toFixed(1) + '%}', ...t_name_list].join('\n')
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
