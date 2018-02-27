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
        acc: false,
        negative: false,
      };
      this.subscription = null;
      this.updateInterval = 10;
      this.fetchUrl = "https://10.21.51.252/redis/GET/speed";
      this.fetchUrlPower = "https://10.21.51.252/redis/GET/power";
    }
    
    updateSpeedStatus(){
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
      //self.updateSpeedStatus();
      //self.intervalId = setInterval(self.updateSpeedStatus.bind(self), self.updateInterval);
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
              <InfoTop />
          </div>
          <div class = "row">
              <RpmGauge value={this.state} />
          </div>
        </div>
       )
    }
  }