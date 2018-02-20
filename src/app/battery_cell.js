import React, { Component } from 'react' 

class BatteryCell extends Component {

  constructor(props: any) {
    super(props); 
    this.state = {volt: parseInt(this.props.batteryVolt)};
  }

  componentWillReceiveProps(props) {
    this.setState({volt: parseInt(this.props.batteryVolt)})
  }

  render() {
    var x = parseInt(this.props.x);
    var y = parseInt(this.props.y);
    var id = parseInt(this.props.id);
    var volt = parseInt(this.state.volt);
    var text_y = y+30;
    var color = "limegreen";
    if (this.state.volt < 4.0){
      color = "red";
    } else if (this.state.volt < 9.0){
      color = "orange";
    }
    var id_x = x + 78;
    if (id < 10) {
      id_x += 5;
    }

    return (
        <g>
          <rect width="100" height="50" rx="5" ry="5" x={x} y={y} fill={color} stroke="lightgrey" strokeWidth="2" />
          <text x={x+35} y={text_y} fill="white" fontFamily="Palatino">
            {volt}V 
          </text>
          <text x={id_x} y={text_y+17} fill="white" fontFamily="Palatino" fontSize="12">
            [{id}]
          </text>
        </g>
    )
  }

}

export default BatteryCell
