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
    var text_y = y+84;
    var color = "yellowgreen";
    if (this.state.volt < 4.0){
      color = "tomato";
    } else if (this.state.volt < 9.0){
      color = "khaki";
    }
    var id_x = x + 100;
    if (id < 10) {
      id_x += 5;
    }

    return (
        <g>
          <rect width="130" height="155" rx="5" ry="5" x={x} y={y} fill={color} stroke="lightgrey" strokeWidth="2" />
          <text x={x+55} y={text_y} fill="darkslateblue" fontFamily="Agency FB" fontSize="28">
            {volt}v
          </text>
          <text x={id_x} y={text_y+60} fill="darkslateblue" fontFamily="Arial" fontSize="12">
            [{id}]
          </text>
        </g>
    )
  }

}

export default BatteryCell
