import React, { Component } from 'react' 

class BatteryModule extends Component {

  constructor(props: any) {
    super(props); 
    this.state = {data: this.props.data};
  }

  componentWillReceiveProps(props) {
    this.setState({data: this.props.data});
  }

  renderVolts(){
    var cellVolts = this.state.data.cells.map(function(entry, i){
      return(<text x="0" y={15*i} fill="darkslateblue" fontFamily="Agency FB" fontSize="11" key={"k:"+i} >
               v{i+1}: {entry.volt}
             </text>);
    })
    return (
      <g transform="translate(2,20)">
        {cellVolts}
      </g>
    );
  }

  renderTemps(){
    var cellTemps = this.state.data.thermometers.map(function(entry, i){
      return(<text x="0" y={15*i} fill="darkslateblue" fontFamily="Agency FB" fontSize="11" key={"k:"+i} >
               t{i+1}: {entry.temp}
             </text>);
    })
    var x_offset = this.props.conf.w - 40;
    return (
      <g transform={"translate(" + x_offset + ", 20)"}>
        {cellTemps}
      </g>
    );
  }

  render() {
    var data = this.state.data;
    var mid = this.props.mid;
    var min_volt = data.cells.map(x => x.volt).reduce((min_volt, num) => Math.min(min_volt, num));
    var max_volt = data.cells.map(x => x.volt).reduce((max_volt, num) => Math.max(max_volt, num));
    var avg_volt = (data.cells.map(x => x.volt).reduce((total, num) => total+num) / data.cells.length).toFixed(3);
    var min_temp = data.thermometers.map(x => x.temp).reduce((min_temp, num) => Math.min(min_temp, num));
    var max_temp = data.thermometers.map(x => x.temp).reduce((max_temp, num) => Math.max(max_temp, num));
    var avg_temp = (data.thermometers.map(x => x.temp).reduce((total, num) => total+num) / data.cells.length).toFixed(3);
    var x = this.props.conf.x;
    var y = this.props.conf.y;
    var text_y = y + 33
    var color = "yellowgreen";
    if (avg_volt < 4.0){
      color = "tomato";
    } else if (avg_volt < 4.2){
      color = "khaki";
    }

    return (
        <g transform={"translate(" + x + ", " + y + ")"}>
          <rect width={this.props.conf.w} height={this.props.conf.h} rx="5" ry="5" x="0" y="0" fill={color} stroke="lightgrey" strokeWidth="2" />
          {this.renderVolts()}
          {this.renderTemps()}
          // average voltage
          <g transform={"translate(" + (this.props.conf.w-40) + ", 130)"}>
            <text x="0" y="0" fill="darkslateblue" fontFamily="Agency FB" fontSize="11">
              <tspan x="0" y="0">avg-volt:</tspan>
              <tspan x="12" y="15">{avg_volt}</tspan>
            </text>
          </g>
          // average temporature
          <g transform={"translate(" + (this.props.conf.w-45) + ", 160)"}>
            <text x="0" y="0" fill="darkslateblue" fontFamily="Agency FB" fontSize="11">
              <tspan x="0" y="0">avg-temp:</tspan>
              <tspan x="13" y="15">{avg_temp}</tspan>
            </text>
          </g>
          //module id
          <text x="5" y={this.props.conf.h - 5} fill="darkslateblue" fontFamily="Agency FB" fontSize="14">
            [{mid}]
          </text>
        </g>
    )
  }

}

export default BatteryModule;
