import React, { Component } from 'react';
import fetch from 'node-fetch';
import BatteryCell from './battery_cell';

class Battery extends Component {

  constructor() {
    super();
    this.updateInterval = 1000;
    this.fetchUrl = "https://10.21.51.252/redis/GET/batteries";
  }

  updateBatteryStatus() {
    const self = this;
    fetch(self.fetchUrl)
      .catch(err => console.log(err))
      .then(res => res.json())
      .then(json => {
        if (json["GET"]){
          var data = JSON.parse(json["GET"]);
          self.setState({batteries: data});
        } else {
          console.log("no data");
        }
      });
  }

  componentDidMount() {
    const self = this;
    self.updateBatteryStatus();
    self.intervalId = setInterval(self.updateBatteryStatus.bind(self), self.updateInterval);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  render() {
    if (!this.state || !this.state.batteries ){
      return null;
    }
    var num_x = 8;
    var offset_x = 10;
    var offset_y = 10;
    return (
        <svg width="960" height="600">
          <rect width="855" height="345" rx="4" ry="4" fill="darkgray" stroke="grey" strokeWidth="5" />
          <rect x="855" y="80" width="20" height="50" rx="3" ry="3" fill="grey" />
          <rect x="855" y="220" width="20" height="50" rx="3" ry="3" fill="grey" />
          { this.state.batteries.map((battery, i) =>
          <BatteryCell batteryVolt={battery["voltage"]} key={"b"+i} id={battery["battery_id"]}
           x={offset_x + 105*(i%num_x)} y={offset_y + 55*Math.floor(i/num_x)} />
        )}
      </svg>
    );
  }
}

export default Battery;
