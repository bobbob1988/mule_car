  import React, { Component }  from 'react';
  import { Observable } from 'rxjs/Observable';
  import 'rxjs/add/observable/interval';
  import 'rxjs/add/operator/timeInterval';

  import InfoTop from '../info-top';
  import InfoBottom from '../info-bottom';
  import InfoMap from '../info-map';
  import RpmGauge from '../rpm-gauge';
  import SpeedGauge from '../speed-gauge';
  import map from '../../../assets/images/map.png';
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
      //this.fetchUrlVehicleState = "http://10.21.51.156:7379/GET/VehicleState";
      //this.fetchUrlFrontMotor = "http://10.21.51.156:7379/GET/FrontMotorData";
      //this.fetchUrlRearMotor = "http://10.21.51.156:7379/GET/RearMotorData";
      //this.fetchGear = "http://10.21.51.156:7379/GET/gear";
      //this.fetchUrlVehicleState = "http://127.0.0.1:7379/GET/VehicleState";
      //this.fetchUrlFrontMotor = "http://127.0.0.1:7379/GET/FrontMotorData";
      //this.fetchUrlRearMotor = "http://127.0.0.1:7379/GET/RearMotorData";
      this.fetchUrlVehicleState = "http://10.0.75.2:7379/GET/VehicleState";
      this.fetchUrlFrontMotor = "http://10.0.75.2:7379/GET/FrontMotorData";
      this.fetchUrlRearMotor = "http://10.0.75.2:7379/GET/RearMotorData";
      // this.fetchGear = "http://10.21.51.156:7379/GET/gear";

    }

    // async fetchURLs() {
    //   const self = this;
    //   try {
    //   // Promise.all() lets us coalesce multiple promises into a single super-promise
    //   var data = await Promise.all([
    //     fetch(self.fetchUrlVehicleState).then((response) => response.json()).then((json) => {
    //     if (json["GET"]){
    //       return JSON.parse(json["GET"]);
    //      }else {
    //       console.log("no data");
    //      }
    //    }),// parse each response as json
    //     fetch(self.fetchUrlFrontMotor).then((response) => response.json()).then((json) => {
    //     if (json["GET"]){
    //       return JSON.parse(json["GET"]);
    //      }else {
    //       console.log("no data");
    //      }
    //    }),
    //     fetch(self.fetchUrlRearMotor).then((response) => response.json()).then((json) => {
    //     if (json["GET"]){
    //       return JSON.parse(json["GET"]);
    //      }else {
    //       console.log("no data");
    //      }
    //    })
    //   ]);

    //   self.setState({speed: `${data[0].vehicleSpeed}`, battery_percentage: `${data[0].stateOfCharge}`, gear: `${data[0].vehicleGear}`,
    //     frontPower: `${data[1].frontMotorTorque}`, rearPower: `${data[2].rearMotorTorque}`});
    //    //console.log(self.state);

    //   } catch (error) {
    //     console.log(error);
    //   }
    // }

    
    updateStatus(){
      const self = this;
      fetch(self.fetchUrlVehicleState)
      .catch(err => console.log(err))
      .then(res => res.json())
      .then(json => {
        if (json["GET"]){
          var data = JSON.parse(json["GET"]);
          self.setState({speed: `${data.vehicleSpeed}`, battery_percentage: `${data.stateOfCharge}`, gear: `${data.vehicleGear}`});
        } else {
          console.log("no data");
        }
      });

      fetch(self.fetchUrlFrontMotor)
      .catch(err => console.log(err))
      .then(res => res.json())
      .then(json => {
        if (json["GET"]){
          var data = JSON.parse(json["GET"]);
          self.setState({frontPower: `${data.frontMotorTorque}`});
        } else {
          console.log("no data");
        }
      });

      fetch(self.fetchUrlRearMotor)
      .catch(err => console.log(err))
      .then(res => res.json())
      .then(json => {
        if (json["GET"]){
          var data = JSON.parse(json["GET"]);
          self.setState({rearPower: `${data.rearMotorTorque}`});
        } else {
          console.log("no data");
        }
      });
      // fetch(self.fetchGear)
      // .catch(err => console.log(err))
      // .then(res => res.json())
      // .then(json => {
      //   if (json["GET"]){
      //     var data = JSON.stringify(json["GET"]);
      //     data = JSON.parse(data);
      //     self.setState({gear: data});
      //   } else {
      //     console.log("no data");
      //   }
      // });

      console.log(self.state);
    }

    componentDidMount() {
    //  const self = this
    //  this.subscription = Observable
    //  .interval(100)
    //  .timeInterval()
    //  .subscribe(() => {
    //   self.fetchURLs();
    // });

      const self = this;
      //Temperory disable for the test use
      self.updateStatus();
      self.intervalId = setInterval(self.updateStatus.bind(self), self.updateInterval);
    }

    componentWillUnmount() {
      clearInterval(this.intervalId);

      // if (this.subscription) {
      //   this.subscription.unsubscribe();
      // }
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