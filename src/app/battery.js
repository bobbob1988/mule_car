import React, { Component } from 'react';
import fetch from 'node-fetch';
import BatteryModule from './battery_module';

class Battery extends Component {

  constructor() {
    super();
    this.updateInterval = 5000;
    this.fetchUrlPrefix = "http://10.21.51.156:7379/HGETALL/BatteryModuleInfo";
    var battery_module_ids = ["13", "12", "11", "10", "9", "8", "7",
                                    "1",  "2",  "3",  "4", "5", "6"];
    this.battery_module_ids = battery_module_ids;
    var top_y = 12;
    var bottom_y = 202;
    var full_w = 95;
    var half_w = 80;
    var height = 185;
    var gap = 6;
    // full module: "F", half module: "H"
    this.battery_module_conf = {
      [battery_module_ids[0]] : {type: 'F', w: full_w, h: height, x: gap, y: 110},   // 13
      [battery_module_ids[1]] : {type: 'H', w: half_w, h: height, x: full_w + gap * 2, y: top_y},  // 12
      [battery_module_ids[2]] : {type: 'F', w: full_w, h: height, x: full_w + half_w + gap * 3, y: top_y},  // 11
      [battery_module_ids[3]] : {type: 'F', w: full_w, h: height, x: full_w * 2 + half_w + gap * 4, y: top_y}, // 10
      [battery_module_ids[4]] : {type: 'F', w: full_w, h: height, x: full_w * 3 + half_w + gap * 5, y: top_y},  // 9
      [battery_module_ids[5]] : {type: 'F', w: full_w, h: height, x: full_w * 4 + half_w + gap * 6, y: top_y},  // 8
      [battery_module_ids[6]] : {type: 'F', w: full_w, h: height, x: full_w * 5 + half_w + gap * 7, y: top_y},   // 7
      [battery_module_ids[7]] : {type: 'H', w: half_w, h: height, x: full_w + gap * 2, y: bottom_y},  // 1
      [battery_module_ids[8]] : {type: 'F', w: full_w, h: height, x: full_w + half_w + gap * 3, y: bottom_y},  // 2
      [battery_module_ids[9]] : {type: 'F', w: full_w, h: height, x: full_w * 2 + half_w + gap * 4, y: bottom_y},  // 3
      [battery_module_ids[10]]: {type: 'F', w: full_w, h: height, x: full_w * 3 + half_w + gap * 5, y: bottom_y},  // 4
      [battery_module_ids[11]]: {type: 'F', w: full_w, h: height, x: full_w * 4 + half_w + gap * 6, y: bottom_y},  // 5
      [battery_module_ids[12]]: {type: 'F', w: full_w, h: height, x: full_w * 5 + half_w + gap * 7, y: bottom_y}   // 6
    };
  }

  updateBatteryStatus() {
    const self = this;
    fetch(self.fetchUrlPrefix).then(res => res.text()).then(body => {
      var json = JSON.parse(body);
      self.setState({batteries: json["HGETALL"]});
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

  renderBatteryModules() {
    var self = this;
    var modules = [];
    for (var key in self.state.batteries){
      var data = self.state.batteries[key];
      var mid = parseInt(key) + 1;
      var conf = self.battery_module_conf[mid.toString()];
      modules.push
        (<BatteryModule mid={mid} data={data} conf={conf} key={"m:"+mid} />);
    }
    return modules;
  }

  render() {
    if (!this.state || !this.state.batteries ){
      return null;
    }
    return (
      <div><svg viewBox="0 0 800 600">
        <g>
          <rect width="700" height="400" rx="4" ry="4" fill="darkgray" stroke="grey" strokeWidth="5" />
          <rect x="700" y="100" width="20" height="50" rx="3" ry="3" fill="grey" />
          <rect x="700" y="250" width="20" height="50" rx="3" ry="3" fill="grey" />
          {this.renderBatteryModules()}
        </g>
        <g transform="translate(10, 410)">
          <g transform="translate(0,0)">
            <rect x="0" y="0" width="75" height="20" rx="2" ry="2" fill="yellowgreen" />
            <text x="5" y="14" fill="darkslateblue" fontFamily="Agency FB" fontSize="12"> voltage &gt; 3.5 </text>
          </g>
          <g transform="translate(90,0)">
            <rect x="0" y="0" width="115" height="20" rx="2" ry="2" fill="khaki" />
            <text x="5" y="14" fill="darkslateblue" fontFamily="Agency FB" fontSize="12">  3.0 &lt;= voltage &lt;= 3.5 </text>
          </g>
          <g transform="translate(220,0)">
            <rect x="0" y="0" width="75" height="20" rx="2" ry="2" fill="tomato" />
            <text x="5" y="14" fill="darkslateblue" fontFamily="Agency FB" fontSize="12">  voltage &lt; 3.5 </text>
          </g>
        </g>
      </svg> </div>
    );
  }
}

export default Battery;
