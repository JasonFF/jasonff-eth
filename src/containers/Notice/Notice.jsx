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
      fetchTime: ''
    })
    this.getNotice()
  }
  componentDidMount() {
    this.getData()
    this.startInterval(this.state.money/1)
  }
  getNotice() {
    Notification.requestPermission().then(function (permission) {
      if (permission === 'granted') {
        console.log('用户允许通知');
      } else if (permission === 'denied') {
        console.log('用户拒绝通知');
      }
    });
  }
  getData(money) {
    return this.fetchData().then(res => {
      const data = res.data.data
      this.setState({
        nowMoney: data[0].price,
        fetchTime: moment().format('HH:mm:ss')
      })
      if (data[0].price >= money) {
        var n = new Notification('attention', {
          body: data[0].price,
          tag: data[0].price,
          requireInteraction: true
        })
      }
    })
  }
  startInterval(money) {
    clearInterval(intervalBox)
    intervalBox = setInterval(() => {
      this.getData(money)
    }, 20000)
  }
  fetchData() {
    return axios('https://otc-api.huobipro.com/v1/otc/trade/list/public?coinId=2&tradeType=0&currentPage=1&payWay=&country=&merchant=1&online=1&range=0')
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
        padding: '10%'
      }}>
      <h2>{this.state.nowMoney}</h2>
      <h3>{this.state.fetchTime}</h3>
        <input type = "text"
        value={this.state.money}
        onChange = {
          (e) => this.change('money', e.target.value)
        }/>
      </div>
    )
  }
}