import React, { Component } from 'react';
import { select, range } from 'd3';

import { HashRouter, Route, Redirect, Switch, Link } from 'react-router-dom';
import Battery from '../battery/battery.js';
import Thermal from '../thermal/index.js';
import GoogleMap from '../googlemap';
import Settings from '../settings';
import styles from './app.css';

export default class Mainpanel extends Component {

  render() {
    return (
      <div className="row center-block">
      <div className={styles.container}>
          <Switch>
            <Route exact path="/" component={GoogleMap}/>
            <Route path="/settings" component={Settings}/>
            <Route path="/map" component={GoogleMap}/>
            <Route path="/battery" component={Battery}/>
            <Route path="/thermal" component={Thermal}/>
          </Switch>
        </div>
      </div>
    )
  }
}
