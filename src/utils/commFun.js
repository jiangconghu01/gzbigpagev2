/**
 * @description 获取对应年月之前n个月的月份数组
 * @param {Number,String} c_year 年份
 * @param {Number,String} c_month 月份
 * @param {Number} n 数组月份数量
 * @param {String} split 分隔符
 * @param {Boolean} short_year 年份是否两位简写
 * @return {Array} 年月的数组
 */

export function getMonthsArr(c_year, c_month, n = 12, c_split = '', short_year = false) {
  const dataArr = []
  const x = n
  const split = c_split
  const data = new Date(Number(c_year), Number(c_month) - 1)
  const year = data.getFullYear()
  data.setMonth(data.getMonth() + 1, 1) //获取到当前月份,设置月份
  for (let i = 0; i < x; i++) {
    data.setMonth(data.getMonth() - 1) //每次循环一次 月份值减1
    let m = data.getMonth() + 1
    m = m < 10 ? split + '0' + m : split + m
    const y = short_year ? (year + '').slice(-2) : year
    dataArr.unshift(y + '' + m)
  }
  return dataArr
}

export function getFormatDate() {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  const seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  const weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  const wk = date.getDay()
  const week = weeks[wk]
  return { date: year + '年' + month + '月' + day + '日 ', week, time: hours + ':' + minutes + ':' + seconds }
}
//图1获取参数
// dates 时间数组
// cityCodeArr 城市编码数组
// encodeArray 指标编码数组
// type 类型
export function getDatesParams(dates, cityCodeArr, encodeArray, type, chartCode) {
  let paramStr = '['
  for (let k = 0; k < dates.length; k++) {
    const date = dates[k]
    for (let index = 0, len = cityCodeArr.length; index < len; index++) {
      const element = cityCodeArr[index]
      for (let i = 0, len2 = encodeArray.length; i < len2; i++) {
        const ele = encodeArray[i]
        paramStr += '{"idxCde":"' + ele + '","chnlType":"' + type + '","chartCode":"' + chartCode + '","accountCode":"' + element + '","periodDate":"' + date + '","rptType":"1' + '"},'
      }
    }
  }
  paramStr = paramStr.substring(0, paramStr.length - 1)
  return paramStr + ']'
}
//图2,3获取参数
// dates 时间数组
// cityCodeArr 城市编码数组
// encodeArray 指标编码数组
// type 类型
//供应商编码数组
export function getDatesParamsNew(dates, cityCodeArr, encodeArray, providers, type) {
  let paramStr = '['
  for (let k = 0; k < dates.length; k++) {
    const date = dates[k]
    for (let index = 0, len = cityCodeArr.length; index < len; index++) {
      const element = cityCodeArr[index]
      for (let i = 0, len2 = encodeArray.length; i < len2; i++) {
        const ele = encodeArray[i]
        for (let index = 0; index < providers.length; index++) {
          const provider = providers[index]
          paramStr += '{"idxCde":"' + ele + '","ywlx":"' + type + '","accountCode":"' + element + '","monthId":"' + date + '","gysbm":"' + provider + '"},'
        }
      }
    }
  }
  paramStr = paramStr.substring(0, paramStr.length - 1)
  return paramStr + ']'
}

export function getQueryVariable(variable) {
  const query = window.location.search.substring(1)
  const vars = query.split('&')
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=')
    if (pair[0] == variable) {
      return pair[1]
    }
  }
  return false
}
