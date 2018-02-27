import React, { Component } from 'react';
import fetch from 'node-fetch';

class Thermal extends Component {

	render() {
    return (
      <svg width="1200" height="1200" viewBox="0 0 1200 1200">
  <g>
    <line x1="41" y1="25" x2="41" y2="200" stroke="red" stroke-width="3" />
    <line x1="41" y1="300" x2="41" y2="500" stroke="red" stroke-width="3" />
    <g transform="translate(30,200)">
      <rect x="0" y="0" rx="2" ry="2" width="20" height="100" fill="black" stroke="darkgrey" stroke-width="2"/>
      <text x="-80" y="-5" transform="rotate(-90)" font-family="Verdana" font-size="15"> Radiator </text>
    </g>
  </g>
  <g>
    <line x1="40" y1="25" x2="350" y2="25" stroke="red" stroke-width="3" />
    <g transform="translate(150,0)">
      <rect x="0" y="2" width="100" height="50" fill="beige" stroke="darkgrey" stroke-width="2"/>
      <text x="13" y="32" font-family="Verdana" font-size="15"> Reservoir </text>
    </g>
  </g>
  <g transform="translate(350,0)">
    <rect x="0" y="2" width="160" height="185" fill="white" stroke="darkgrey" stroke-dasharray="5, 5" stroke-width="2"/>
    <text font-family="Verdana" font-size="12" font-color="grey">
      <tspan x="92" y="28"> Front </tspan>
      <tspan x="92" y="48"> Drive Unit </tspan>
    </text>
    <g transform="translate(15,10)">
      <g transform="translate(0,0)">
        <rect x="0" y="5" width="70" height="50" fill="beige" stroke="darkgrey" stroke-width="2"/>
        <text x="13" y="34" font-family="Verdana" font-size="15"> Motor </text>
      </g>
      <g transform="translate(0,55)">
        <rect x="0" y="5" width="70" height="50" fill="beige" stroke="darkgrey" stroke-width="2"/>
        <text x="3" y="34" font-family="Verdana" font-size="15"> GearBox </text>
      </g>
      <g transform="translate(0,110)">
        <rect x="0" y="5" width="70" height="50" fill="beige" stroke="darkgrey" stroke-width="2"/>
        <text x="5" y="34" font-family="Verdana" font-size="15"> Inverter </text>
      </g>
    </g>
  </g>
  <line x1="435" y1="150" x2="650" y2="150" stroke="red" stroke-width="3" />
  <g transform="translate(600,250)">
    <rect x="0" y="2" width="160" height="185" fill="white" stroke="darkgrey" stroke-dasharray="5, 5" stroke-width="2"/>
    <text font-family="Verdana" font-size="12" font-color="grey">
      <tspan x="92" y="28"> Rear </tspan>
      <tspan x="92" y="48"> Drive Unit </tspan>
    </text>
    <g transform="translate(15,10)">
      <g transform="translate(0,0)">
        <rect x="0" y="5" width="70" height="50" fill="beige" stroke="darkgrey" stroke-width="2"/>
        <text x="13" y="34" font-family="Verdana" font-size="15"> Motor </text>
      </g>
      <g transform="translate(0,55)">
        <rect x="0" y="5" width="70" height="50" fill="beige" stroke="darkgrey" stroke-width="2"/>
        <text x="3" y="34" font-family="Verdana" font-size="15"> GearBox </text>
      </g>
      <g transform="translate(0,110)">
        <rect x="0" y="5" width="70" height="50" fill="beige" stroke="darkgrey" stroke-width="2"/>
        <text x="5" y="34" font-family="Verdana" font-size="15"> Inverter </text>
      </g>
    </g>
  </g>
  <line x1="650" y1="150" x2="650" y2="265" stroke="red" stroke-width="3" />
  <g>
    <line x1="40" y1="500" x2="650" y2="500" stroke="red" stroke-width="3" />
    <line x1="650" y1="425" x2="650" y2="500" stroke="red" stroke-width="3" />
    <g transform="translate(500,475)">
      <rect x="0" y="5" width="70" height="40" fill="beige" stroke="darkgrey" stroke-width="2"/>
      <text x="5" y="30" font-family="Verdana" font-size="15"> Charger </text>
    </g>
  </g>
  <g transform="translate(390,230)">
    <rect x="0" y="5" width="150" height="200" fill="beige" stroke="darkgrey" stroke-width="2"/>
    <rect x="-13" y="160" width="15" height="30" fill="beige" stroke="darkgrey" stroke-width="2"/>
    <rect x="147" y="20" width="15" height="30" fill="beige" stroke="darkgrey" stroke-width="2"/>
    <text x="45" y="104" font-family="Verdana" font-size="15"> Battery </text>
  </g>
  <g transform="translate(130,210)">
    <rect x="0" y="2" width="80" height="185" fill="white" stroke="darkgrey" stroke-dasharray="5, 5" stroke-width="2"/>
    <g transform="translate(30,60)">
      <rect x="0" y="0" width="20" height="75" fill="beige" stroke="darkgrey" stroke-width="2"/>
      <text x="-71" y="14" transform="rotate(-90)" font-family="Verdana" font-size="12"> Evaporator </text>
    </g>
    <text x="-51" y="74" transform="rotate(-90)" font-family="Verdana" font-size="14"> Chiller </text>
  </g>
  <g transform="translate(240,210)">
    <rect x="0" y="2" width="100" height="185" fill="white" stroke="darkgrey" stroke-dasharray="5, 5" stroke-width="2"/>
    <text x="-51" y="92" transform="rotate(-90)" font-family="Verdana" font-size="14"> HVAC </text>
  </g>
  <line x1="220" y1="200" x2="565" y2="200" stroke="skyblue" stroke-width="3" />
  <line x1="565" y1="200" x2="565" y2="265" stroke="skyblue" stroke-width="3" />
  <line x1="552" y1="265" x2="565" y2="265" stroke="skyblue" stroke-width="3" />
  <line x1="220" y1="200" x2="220" y2="290" stroke="skyblue" stroke-width="3" />
  <line x1="180" y1="290" x2="220" y2="290" stroke="skyblue" stroke-width="3" />
  <line x1="220" y1="410" x2="378" y2="410" stroke="skyblue" stroke-width="3" />
  <line x1="220" y1="410" x2="220" y2="320" stroke="skyblue" stroke-width="3" />
  <line x1="179" y1="320" x2="220" y2="320" stroke="skyblue" stroke-width="3" />
  <g>
    <g transform="translate(480,185)">
      <rect x="0" y="2" width="60" height="22" fill="beige" stroke="darkgrey" stroke-width="2"/>
      <text x="7" y="18" font-family="Verdana" font-size="14"> DC/DC </text>
    </g>
  </g>
  <g transform="translate(675,460)">
    <g transform="rotate(90)">
      <polygon points="4,0 6,0 10,5 6,10 4,10 0,5" fill="white" stroke="grey" stroke-width="1.5" />
      <rect x="3.5" y="10" width="3" height="14" fill="white" stroke="grey" stroke-width="1.3" />
    </g>
    <text x="10" y="10" font-size="16" font-weight="bold" fill="purple" stroke="purple"> 90&#8457; [T1] </text>
  </g>
  <g transform="translate(675,220)">
    <g transform="rotate(90)">
      <polygon points="4,0 6,0 10,5 6,10 4,10 0,5" fill="white" stroke="grey" stroke-width="1.5" />
      <rect x="3.5" y="10" width="3" height="14" fill="white" stroke="grey" stroke-width="1.3" />
    </g>
    <text x="10" y="10" font-size="16" font-weight="bold" fill="purple" stroke="purple"> 70&#8457; [T2] </text>
  </g>
  <g transform="translate(275,1)">
    <g>
      <polygon points="4,0 6,0 10,5 6,10 4,10 0,5" fill="white" stroke="grey" stroke-width="1.5" />
      <rect x="3.5" y="10" width="3" height="14" fill="white" stroke="grey" stroke-width="1.3" />
    </g>
    <text x="14" y="16" font-size="16" font-weight="bold" fill="purple" stroke="purple"> 50&#8457; [T3] </text>
  </g>
  <g transform="translate(380,175)">
    <g>
      <polygon points="4,0 6,0 10,5 6,10 4,10 0,5" fill="white" stroke="grey" stroke-width="1.5" />
      <rect x="3.5" y="10" width="3" height="14" fill="white" stroke="grey" stroke-width="1.3" />
    </g>
    <text x="14" y="16" font-size="16" font-weight="bold" fill="purple" stroke="purple"> 60&#8457; [T4] </text>
  </g>
  <g transform="translate(590,210)">
    <g transform="rotate(90)">
      <polygon points="4,0 6,0 10,5 6,10 4,10 0,5" fill="white" stroke="grey" stroke-width="1.5" />
      <rect x="3.5" y="10" width="3" height="14" fill="white" stroke="grey" stroke-width="1.3" />
    </g>
    <text font-size="16" font-weight="bold" fill="purple" stroke="purple"> 
      <tspan x="5" y="10">55&#8457;</tspan>
      <tspan x="5" y="27">[T5]</tspan>
    </text>
  </g>
  <g transform="translate(285,385)">
    <g>
      <polygon points="4,0 6,0 10,5 6,10 4,10 0,5" fill="white" stroke="grey" stroke-width="1.5" />
      <rect x="3.5" y="10" width="3" height="14" fill="white" stroke="grey" stroke-width="1.3" />
    </g>
    <text x="14" y="20" font-size="16" font-weight="bold" fill="purple" stroke="purple"> 60&#8457; [T6] </text>
  </g>
</svg>

    );
  }

}

export default Thermal;