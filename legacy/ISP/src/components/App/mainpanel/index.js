import React, { Component } from 'react';
import { select, range } from 'd3';

import { HashRouter, Route, Redirect, Switch, Link } from 'react-router-dom';
import Battery from '../battery/battery.js';
import Thermal from '../thermal';
import MapIFrame from '../map';
import styles from './app.css';

export default class Mainpanel extends Component {

  render() {
    return (
      <div class="row center-block">
        <div className={styles.container}>
          <Switch>
            <Route exact path="/" component={MapIFrame}/>
            <Route path="/map" component={MapIFrame}/>
            <Route path="/battery" component={Battery}/>
            <Route path="/thermal" component={Thermal}/>
          </Switch>
        </div>
      </div>
    )
  }
}
