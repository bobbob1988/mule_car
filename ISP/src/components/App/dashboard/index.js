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
        power: 0,
        speed: 0,
        gear: 'P',
        battery_percentage: '',
        battery_status: 0,
        acc: false,
        negative: false,
      };
      this.subscription = null;
      this.updateInterval = 100;
      this.fetchUrl = "http://10.21.51.156:7379/GET/speed";
      this.fetchUrlPower = "http://10.21.51.156:7379/GET/power";
      this.fetchGear = "http://10.21.51.156:7379/GET/gear";
      this.fetchBatteryStatus = "http://10.21.51.156:7379/GET/battery_status";

    }
    
    updateStatus(){
      const self = this;
      fetch(self.fetchUrl)
      .catch(err => console.log(err))
      .then(res => res.json())
      .then(json => {
        if (json["GET"]){
          var data = JSON.parse(json["GET"]);
          self.setState({speed: data});
        } else {
          console.log("no data");
        }
      });

      fetch(self.fetchUrlPower)
      .catch(err => console.log(err))
      .then(res => res.json())
      .then(json => {
        if (json["GET"]){
          var data = JSON.parse(json["GET"]);
          self.setState({power: data});
        } else {
          console.log("no data");
        }
      });

      fetch(self.fetchGear)
      .catch(err => console.log(err))
      .then(res => res.json())
      .then(json => {
        if (json["GET"]){
          var data = JSON.stringify(json["GET"]);
          data = JSON.parse(data);
          self.setState({gear: data});
        } else {
          console.log("no data");
        }
      });

      fetch(self.fetchBatteryStatus)
      .catch(err => console.log(err))
      .then(res => res.json())
      .then(json => {
        if (json["GET"]){
          var data = JSON.parse(json["GET"]);
          var mile = data.battery_mile;
          self.setState({battery_percentage: `${data.battery_percentage}`,
           battery_status: `${data.battery_mile}`});
        } else {
          console.log("no data");
        }
      });

    }


    handleKeyDown(e) {
      if (e.which === 38) { // up arrow key
        this.setState({ acc: true });
      }
    }

    handleKeyUp(e) {
      if (e.which === 38) {
        this.setState({ acc: false });
      }
    }

    componentDidMount() {
      // document.addEventListener('keydown', this.handleKeyDown.bind(this), false);
      // document.addEventListener('keyup', this.handleKeyUp.bind(this), false);

      // this.subscription = Observable
      // .interval(10)
      // .timeInterval()
      // .subscribe(() => {
      //   if (this.state.acc) {
      //     if (this.state.speed <= 199) {
      //       this.setState({ speed: this.state.speed += 1, power: this.state.power += 1 });
      //     }
      //   } else {
      //     if (this.state.speed >= 1) {
      //       this.setState({ speed: this.state.speed -= 1, power: this.state.power -= 1 });
      //     }
      //   }
      // });

      const self = this;
      //Temperory disable for the test use
      self.updateStatus();
      self.intervalId = setInterval(self.updateStatus.bind(self), self.updateInterval);
    }

    componentWillUnmount() {
      clearInterval(this.intervalId);
      document.removeEventListener('keydown', this.handleKeyDown, false);
      document.removeEventListener('keyup', this.handleKeyUp, false);

      if (this.subscription) {
        this.subscription.unsubscribe();
      }
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