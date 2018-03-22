import React, { Component } from 'react';
import './App.css';
import {
  HashRouter as Router,
  Route,
} from 'react-router-dom'

import Calculate from '../Calculate/Calculate'
import Notice from '../Notice/Notice'
import Index from '../Index/Index'

const App = () => (
  <Router>
    <div style={{width:'100%'}}>
      <Route exact path="/" component={Index}></Route>
      <Route exact path="/calculate" component={Calculate}/>
      <Route exact path="/notice" component={Notice}/>
    </div>
  </Router>
)
  


export default App;
