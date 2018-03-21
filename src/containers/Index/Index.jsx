import React from 'react'
import {Link} from 'react-router-dom'

export default class Index extends React.Component {
  render() {
    return (
      <div style={{padding: '10%'}}>
        <h3><Link to="/calculate">calculate</Link></h3>
        <h3><Link to="/notice">notice</Link></h3>
      </div>
    )
  }
}
