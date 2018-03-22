import React from 'react'
import axios from 'axios'
import moment from 'moment'

let intervalBox = null

export default class Notice extends React.Component {
  constructor() {
    super()
    this.startInterval = this.startInterval.bind(this)
    this.getData = this.getData.bind(this)
  }
  componentWillMount() {
    this.setState({
      money: 6.51,
      nowMoney: 0,
      fetchTime: '',
      buyList: [],
      sellList: []
    })
    this.getNotice()
  }
  componentDidMount() {
    this.getData()
    this.getListData()
    this.startInterval(this.state.money/1)
  }
  getNotice() {
    try {
      Notification.requestPermission().then(function (permission) {
        if (permission === 'granted') {
          console.log('用户允许通知');
        } else if (permission === 'denied') {
          console.log('用户拒绝通知');
        }
      });
    } catch (e) {
      alert(e)
    }
    
  }
  getData(money) {
    return this.fetchData().then(res => {
      const data = res.data.data
      this.setState({
        nowMoney: data[0].price,
        fetchTime: moment().format('HH:mm:ss')
      })
      if (data[0].price >= money) {
        try {
          var n = new Notification('attention', {
            body: data[0].price,
            tag: data[0].price,
            requireInteraction: true
          })
        } catch(error) {
          alert(data[0].price)
        }
         
      }
    })
  }
  getListData() {
    let currentPage = 1
    this.fetchBuyData(currentPage)
    this.fetchSellData(currentPage)
  }
  startInterval(money) {
    clearInterval(intervalBox)
    intervalBox = setInterval(() => {
      this.getData(money)
      this.setState({
        buyList: [],
        sellList: []
      })
      this.getListData()
    }, 60000)
  }
  fetchData() {
    return axios('https://otc-api.huobipro.com/v1/otc/trade/list/public?coinId=2&tradeType=0&currentPage=1&payWay=&country=&merchant=1&online=1&range=0')
  }
  fetchBuyData(page) {
    return axios('https://otc-api.huobipro.com/v1/otc/trade/list/public', {
      params: {
        coinId:2,
        tradeType:1,
        currentPage: 1,
        payWay:"",
        country:"",
        merchant:1,
        online:1,
        range:0,
        currPage: page
      }
    }).then(res => {
      this.setState({
        buyList: this.state.buyList.concat(res.data.data)
      })
      if(res.data.data.length == 10) {
        this.fetchBuyData(page+1)
      }
    })
  }
  fetchSellData(page) {
    return axios('https://otc-api.huobipro.com/v1/otc/trade/list/public', {
      params: {
        coinId:2,
        tradeType:0,
        currentPage: 1,
        payWay:"",
        country:"",
        merchant:1,
        online:1,
        range:0,
        currPage: page
      }
    }).then(res => {
      this.setState({
        sellList: this.state.sellList.concat(res.data.data)
      })
      if(res.data.data.length == 10) {
        this.fetchSellData(page+1)
      }
    })
  }
  change(name, value) {
    this.setState({
      [name]: value
    })
    this.startInterval(value/1)
  }
  render() {

    return ( 
      <div style={{
        padding: '5%',
        background: '#181B2A',
        color: '#eee',
        minHeight: '100%'
      }}>
      <div style={{
        marginBottom: '30px'
      }}>
        <h2>{this.state.nowMoney}</h2>
        <h3>{this.state.fetchTime}</h3>
          <input type = "text"
          value={this.state.money}
          onChange = {
            (e) => this.change('money', e.target.value)
          }/>
      </div>
      
        <div>
          <div style={{
            width:'50%',
            float: 'left',
          }}>
            {BuyRecords(this.state.buyList, "buy")}
          </div>
          <div style={{
            width:'50%',
            float: 'right'
          }}>
          {BuyRecords(this.state.sellList, 'sell')}
          </div>
          <div style={{
            clear: 'both'
          }}>

          </div>
        </div>
      </div>
    )
  }
}

const BuyRecords = (list) => {
  if (!list.length) {
    return
  }
  let priceLevel = {}
  let totalPrice = 0
  let topLevel = list[0].price;
  let totalCount = 0;
  list.forEach(it => {
    const {price} = it
    if (Math.abs(price - topLevel) > 0.05) {
      return
    }
    if (priceLevel[`$${price}`] == undefined) {
      priceLevel[`$${price}`] = 0
    }
    priceLevel[`$${price}`] = priceLevel[`$${price}`] + 1;
    totalPrice = totalPrice + price/1
    totalCount++
  })
  let avgPrice = totalPrice/totalCount
  return (
    <div>
      平均：{avgPrice}
      {
        Object.keys(priceLevel).map(it => {
          return <p key={it}>{it}: {priceLevel[it]}</p>
        })
      }
    </div>
  )
}