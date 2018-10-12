import React, { Component } from 'react';
import Switch from 'react-switch';
import ButtonGroup from 'react-ions/lib/components/ButtonGroup/ButtonGroup'

const drive_modes = [
  {
    value: "awd",
    label: "AWD"
  },
  {
    value: "rwd",
    label: "RWD"
  },
  {
    value: "fwd",
    label: "FWD"
  }
]


class Settings extends Component {

  constructor(){
    super();
    this.state = { 
      BMS_debug_checked: true,
      VCU_debug_checked: true,
      MCUR0_debug_checked: true,
      MCUF0_debug_checked: true,
      default_drive_mode: 2
    };
    this.handle_BMS_debug = this.handle_BMS_debug.bind(this);
    this.handle_VCU_debug = this.handle_VCU_debug.bind(this);
    this.handle_MCUF0_debug = this.handle_MCUF0_debug.bind(this);
    this.handle_MCUR0_debug = this.handle_MCUR0_debug.bind(this);
    this.handleDriveMode = this.handleDriveMode.bind(this);
  }

  handle_BMS_debug(checked){
    this.setState({ BMS_debug_checked: checked });
  }

  handle_VCU_debug(checked){
    this.setState({ VCU_debug_checked: checked });
  }

  handle_MCUF0_debug(checked){
    this.setState({ MCUF0_debug_checked: checked });
  }

  handle_MCUR0_debug(checked){
    this.setState({ MCUR0_debug_checked: checked });
  }

  handle_BMS_debug(checked){
    this.setState({ BMS_debug_checked: checked });
  }
  
  handleDriveMode(event, value){
    console.log("drive mode selected: " + value);
  }

  render() {
    return (
      <div className="container white-font"> 
        <div className="row top-20 x-large-font">
          Settings
        </div>

        <div className="row top-20">
          <div className="col-md-auto">
            <span>Drive Mode</span>
          </div>
          <div className="col">
            <ButtonGroup
              name="drive mode"
              options={drive_modes}
              defaultOption={this.state.default_drive_mode}
              changeCallback={this.handleDriveMode}>
            </ButtonGroup>
          </div>
        </div>

        <div className="row top-20">
          <div className="col-md-auto">
            <span>BMS Debug Mode</span>
          </div>
          <div className="col">
          <Switch
            onChange={this.handle_BMS_debug}
            checked={this.state.BMS_debug_checked}
            id="battery-debug"
          />
          </div>
        </div>

        <div className="row top-20">
          <div className="col-md-auto">
            <span>VCU Debug Mode</span>
          </div>
          <div className="col">
          <Switch
            onChange={this.handle_VCU_debug}
            checked={this.state.VCU_debug_checked}
            id="battery-debug"
          />
          </div>
        </div>

        <div className="row top-20">
          <div className="col-md-auto">
            <span>MCUF0 Debug Mode</span>
          </div>
          <div className="col">
          <Switch
            onChange={this.handle_MCUF0_debug}
            checked={this.state.MCUF0_debug_checked}
            id="battery-debug"
          />
          </div>
        </div>

        <div className="row top-20">
          <div className="col-md-auto">
            <span>MCUR0 Debug Mode</span>
          </div>
          <div className="col">
          <Switch
            onChange={this.handle_MCUR0_debug}
            checked={this.state.MCUR0_debug_checked}
            id="battery-debug"
          />
          </div>
        </div>

      </div>
    );
  }

}

export default Settings;
