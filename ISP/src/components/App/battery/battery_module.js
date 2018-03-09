import React, { Component } from 'react' 

class BatteryModule extends Component {

  constructor(props: any) {
    super(props); 
    this.state = {data: this.props.data};
  }

  componentWillReceiveProps(props) {
    this.setState({data: this.props.data});
  }

  renderVolts(cells){
    var cellVolts = [];
    for (var key in cells){
      var i = parseInt(key)-1;
      var volt = cells[key];
      cellVolts.push(<text x="0" y={15*i} fill="darkslateblue" fontFamily="Agency FB" fontSize="11" key={"k:"+i} >
               v{i+1}: {volt}
             </text>);
    }
    return (
      <g transform="translate(2,20)">
        {cellVolts}
      </g>
    );
  }

  renderTemps(temps){
    var cellTemps = [];
    for (var key in temps){
      var i = parseInt(key)-1;
      var temp = temps[key];
      cellTemps.push(<text x="0" y={15*i} fill="darkslateblue" fontFamily="Agency FB" fontSize="11" key={"k:"+i} >
               t{i+1}: {temp}
             </text>);
    }
    var x_offset = this.props.conf.w - 40;
    return (
      <g transform={"translate(" + x_offset + ", 20)"}>
        {cellTemps}
      </g>
    );
  }

  render() {
    var data = JSON.parse(this.state.data);
    var cells = {}
    var temps = {}
    for(var key in data){
      if (key.startsWith("cell")){
        var cellId = parseInt(key.replace("cellGroup", "").replace("Volt", ""));
        cells[cellId] = parseFloat(data[key]);
      }
      else if (key.startsWith("temp")){
        var tempId = parseInt(key.replace("tempSensor", ""));
        temps[tempId] = parseFloat(data[key]);
      }
    }

    var mid = this.props.mid;
    var min_volt = Object.values(cells).reduce((min_volt, num) => Math.min(min_volt, num));
    var max_volt = Object.values(cells).reduce((max_volt, num) => Math.max(max_volt, num));
    var avg_volt = (Object.values(cells).reduce((total, num) => total+num) / Object.keys(cells).length).toFixed(3);

    var min_temp = Object.values(temps).reduce((min_temp, num) => Math.min(min_temp, num));
    var max_temp = Object.values(temps).reduce((max_temp, num) => Math.max(max_temp, num));
    var avg_temp = (Object.values(temps).reduce((total, num) => total+num) / Object.keys(temps).length).toFixed(3);

    var x = this.props.conf.x;
    var y = this.props.conf.y;
    var text_y = y + 33
    var color = "yellowgreen";
    if (avg_volt < 3.0){
      color = "tomato";
    } else if (avg_volt < 3.5){
      color = "khaki";
    }

    return (
        <g transform={"translate(" + x + ", " + y + ")"}>
          <rect width={this.props.conf.w} height={this.props.conf.h} rx="5" ry="5" x="0" y="0" fill={color} stroke="lightgrey" strokeWidth="2" />
          {this.renderVolts(cells)}
          {this.renderTemps(temps)}
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