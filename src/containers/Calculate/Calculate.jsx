import React, { Component } from 'react';
import moment from 'moment'

class App extends Component {
  componentWillMount() {
    this.setState({
      initDate: moment('2018/3/14 20:00:00'),
      nowDate: moment(),
      amount: 0,
      perMoney: 0,
      elecPer: 0.3
    })
  }
  change(name, value) {
    this.setState(
      {
        [name]: value
      }
    )
  }
  render() {
    const longtime = this.state.nowDate.diff(this.state.initDate,'hours',true)
    const totalIncome = this.state.amount*this.state.perMoney
    const netIncome = totalIncome-longtime*this.state.elecPer
    return (
      <div className="App">
      <h1>JasonFF eth</h1>
      <h3>开始时间：2018/3/14 20:00:00</h3>
      <h3>当前时间：{this.state.nowDate.format('YYYY/MM/DD HH:mm:ss')}</h3>
      <h3>持续时间：{longtime} h</h3>
      <h3>电费：{this.state.elecPer}元/h => {this.state.elecPer * longtime}元</h3>
      <h3>币量：<input type="text" onChange={e => this.change('amount', e.target.value)} value={this.state.amount}/></h3>
      <h3>币价：<input type="text" onChange={e => this.change('perMoney', e.target.value)} value={this.state.perMoney}/></h3>
      <h3>总收益：{totalIncome}</h3>
      <h3>净收益：{netIncome}</h3>
      <h3>每小时净收益：{netIncome/longtime}</h3>
      <h3>每天净收益：{netIncome/longtime*24}</h3>
      <h3>每月净收益：{netIncome/longtime*24*30}</h3>
      </div>
    );
  }
}

export default App;
