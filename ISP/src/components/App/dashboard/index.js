  import React, { Component }  from 'react';
  import { Observable } from 'rxjs/Observable';
  import 'rxjs/add/observable/interval';
  import 'rxjs/add/operator/timeInterval';

  import RpmGauge from '../rpm-gauge';
 

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
      document.addEventListener('keydown', this.handleKeyDown.bind(this), false);
      document.addEventListener('keyup', this.handleKeyUp.bind(this), false);

      this.subscription = Observable
      .interval(10)
      .timeInterval()
      .subscribe(() => {
        if (this.state.acc) {
          if (this.state.speed <= 199) {
            this.setState({ speed: this.state.speed += 1, power: this.state.power += 1 });
          }
        } else {
          if (this.state.speed >= 1) {
            this.setState({ speed: this.state.speed -= 1, power: this.state.power -= 1 });
          }
        }
      });
    }

    componentWillUnmount() {
      document.removeEventListener('keydown', this.handleKeyDown, false);
      document.removeEventListener('keyup', this.handleKeyUp, false);

      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }

    render() {
      return (
      <div class="row">
        <div class="dashboard">
         <div class="col col-lg-6 col-md-6">
           <RpmGauge value={this.state} />
         </div>
         <div class="col col-lg-6 col-md-6">>
         </div>
        </div>
      </div>
      )
    }
  }