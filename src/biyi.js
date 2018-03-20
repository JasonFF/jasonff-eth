var fetch = require('node-fetch')
var moment = require('moment')
var xlsx = require('node-xlsx')
var fs = require('fs')

const levelPercent = 0.08

const buy = 6.50
const sell = 6.54


const buyLevel = (avg) => {
  // return 0.8
  const cha = Math.abs(buy - avg)
  if (cha > levelPercent) {
    return 1
  }
  return cha/1/levelPercent
  // return 0.2
}
const sellLevel = (avg) => {
  // return 0.8
  const cha = Math.abs(avg - sell)
  if (cha > levelPercent) {
    return 1
  }
  return cha/1/levelPercent
}

let totalMoney = 10000
let totalUSDT = 0

let totalIn = totalMoney + totalUSDT*buy
let totalOut = 0

fetch('https://www.coinyee.com/data/USDT_CNY_day.js?20183201455').then(res => res.json()).then(res => {
  const result = [['时间', '交易量', '开盘价', '最高价', '最低价', '收盘价', '平均价', '买入', '卖出', '总金额', '总个数', '总价值']]
  res.forEach((it, index, arr) => {
    if (index == 0) {
      return
    }
    const time = moment(it[0]).format("YYYY-MM-DD HH:mm:ss")
    it[0] = time

    const avg = (it[3]/1 + it[4]/1)/2
   
    if (avg >= 6.7) {
      return
    }
    it.push(avg)

    if (avg <= buy) {
      it.push('true')
      const buyMoney = totalMoney*buyLevel(avg)
      const getUSDT = buyMoney/avg
      totalUSDT = totalUSDT + getUSDT
      totalMoney = totalMoney - buyMoney
    } else {
      it.push('false')
    }

    if (avg >= sell) {
      it.push('true')
      const buyUSDT = totalUSDT*sellLevel(avg)
      const getMoney = buyUSDT*(avg-0.02)
      totalUSDT = totalUSDT - buyUSDT
      totalMoney = totalMoney + getMoney
    } else {
      it.push('false')
    }

    it.push(totalMoney)
    it.push(totalUSDT)

    it.push(totalMoney/1+totalUSDT/1*avg)

    result.push(it)
  })

  const finalTotalOut = result[result.length-1][11]/1
  const profit = finalTotalOut - totalIn

  const percent = profit/totalIn*100
  const perYear = percent/(result.length-1)*365
  console.log('总利润'+' '+ profit)
  console.log('收益百分比'+(profit/totalIn*100))
  console.log('年化'+(profit/totalIn*100/(result.length-1)*365))

  var buffer = xlsx.build([{name: "mySheetName", data: result}]);
  fs.writeFile('abc.xls', buffer, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
})