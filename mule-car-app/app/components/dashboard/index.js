  import React, { Component }  from 'react';
  import { Observable } from 'rxjs/Observable';
  import 'rxjs/add/observable/interval';
  import 'rxjs/add/operator/timeInterval';

  import InfoTop from '../info-top';
  import InfoBottom from '../info-bottom';
  import InfoMap from '../info-map';
  import RpmGauge from '../rpm-gauge';
  import SpeedGauge from '../speed-gauge';
  var Redis = require('ioredis');
  var redis = new Redis();


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
    }

    updateStatus(){
      const self = this;
      redis.get('VehicleState', function(err, result){
          var data = JSON.parse(result);
          self.setState({speed: `${data.vehicleSpeed}`, 
                         battery_percentage: `${data.stateOfCharge}`, 
                         gear: `${data.vehicleGear}`,
                         frontPower: `${data.frontMotorTorque}`,
                         rearPower: `${data.rearMotorTorque}`
                         });
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
        <div className="col col-lg-4 col-md-6">
        <div className="row">
        <InfoTop value={this.state}/>
        </div>
        <div className="row">
        <RpmGauge value={this.state} />
        </div>
        </div>
        )
    }
  }
