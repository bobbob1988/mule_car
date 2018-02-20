import React, { Component } from 'react';
import { HashRouter, Route, Redirect, Switch, Link } from 'react-router-dom';
import Battery from './battery';
import styles from './app.css';
import Iframe from 'react-iframe';

class App extends Component {
  render() {
    return (
      <HashRouter>
        <div className={styles.container}>
        <div className={styles.sidePanel}>
          <ul className={styles.ul}>
            <li className={styles.li}><Link to="/map">Map</Link></li>
            <li className={styles.li}><Link to="/battery">Battery</Link></li>
            <li className={styles.li}><Link to="/thermo">Thermo</Link></li>
          </ul>
        </div>
        <div className={styles.mainPanel}>
          <Switch>
            <Redirect exact from="/" to="/battery" />
            <Route path="/map" component={MapIFrame}/>
            <Route path="/battery" component={Battery}/>
            <Route path="/thermo" component={Thermo}/>
          </Switch>
        </div>
        </div>
      </HashRouter>
    )
  }
}

const MapIFrame = () => 
<Iframe url="./map.html"
            position="absolute"
            width="100%"
            id="myId"
            className="myClassname"
            height="100%"
            styles={{height: "500px"}}
            allowFullScreen/>

const Home = () => <h1> This is Home </h1>
const Thermo = () => <h1> The thermostats </h1>

export default App
