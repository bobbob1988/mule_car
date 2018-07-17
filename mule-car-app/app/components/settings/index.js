import React, { Component } from 'react';
import Switch from 'react-switch';


class Settings extends Component {

  constructor(){
    super();
    this.state = { 
      battery_checked: true,
      dual_motors_checked: false
    };
    this.handleBatteryDebug = this.handleBatteryDebug.bind(this);
    this.handleDualMotors = this.handleDualMotors.bind(this);
  }

  handleBatteryDebug(checked){
    this.setState({ battery_checked: checked });
  }
  
  handleDualMotors(checked){
    this.setState({ dual_motors_checked: checked });
  }

  render() {
    return (
      <div className="container white-font"> 
        <div className="row top-20 x-large-font">
          Settings
        </div>

        <div className="row top-20">
          <div className="col-md-auto">
            <span>Battery Debug Mode</span>
          </div>
          <div className="col">
          <Switch
            onChange={this.handleBatteryDebug}
            checked={this.state.battery_checked}
            id="battery-debug"
          />
          </div>
        </div>

        <div className="row top-10">
          <div className="col-md-auto">
            <span>Dual Motors Mode</span>
          </div>
          <div className="col">
          <Switch
            onChange={this.handleDualMotors}
            checked={this.state.dual_motors_checked}
            id="dual-motors"
          />
          </div>
        </div>

      </div>
    );
  }

}

export default Settings;
