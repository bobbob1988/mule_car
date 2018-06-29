  import React, { Component }  from 'react';
  import { Observable } from 'rxjs/Observable';
  import 'rxjs/add/observable/interval';
  import 'rxjs/add/operator/timeInterval';

  import InfoTop from '../info-top';
  import InfoBottom from '../info-bottom';
  import InfoMap from '../info-map';
  import RpmGauge from '../rpm-gauge';
  import SpeedGauge from '../speed-gauge';
  import fetch from 'node-fetch';

  export default class Dashboard extends Component {
    constructor() {
      super();

      this.state = {
        frontPower: 0,
        rearPower: 0,
        power:0,
        speed: 0,
        gear: 0,
        battery_percentage: '',
        battery_status: 0,
        acc: false,
        negative: false,
      };
      this.subscription = null;
      this.updateInterval = 100;
      this.fetchUrlVehicleState = "http://localhost:7379/GET/VehicleState";
    }

    updateStatus(){
      const self = this;
      fetch(self.fetchUrlVehicleState)
      .catch(err => console.log(err))
      .then(res => res.json())
      .then(json => {
        if (json["GET"]){
          var data = JSON.parse(json["GET"]);
          self.setState({speed: `${data.vehicleSpeed}`, 
                         battery_percentage: `${data.stateOfCharge}`, 
                         gear: `${data.vehicleGear}`,
                         frontPower: `${data.frontMotorTorque}`,
                         rearPower: `${data.rearMotorTorque}`
                         });
        } else {
          console.log("no data");
        }
      });

      //console.log(self.state);
    }

    componentDidMount() {

      const self = this;
      //Temperory disable for the test use
      self.updateStatus();
      self.intervalId = setInterval(self.updateStatus.bind(self), self.updateInterval);
    }

    componentWillUnmount() {
      clearInterval(this.intervalId);

    }

    render() {
      return (
        <div class="col col-lg-4 col-md-6">
        <div class = "row">
        <InfoTop value={this.state}/>
        </div>
        <div class = "row">
        <RpmGauge value={this.state} />
        </div>
        </div>
        )
    }
  }
