import React, { Component } from 'react';
import { line, select, range } from 'd3';


import full_battery from '../../../resources/images/full-battery.svg';
import empty_battery from '../../../resources/images/empty-battery.svg';
import low_battery from '../../../resources/images/low-battery.svg';
import half_battery from '../../../resources/images/half-battery.svg';
import almost_full_battery from '../../../resources/images/battery-almost-full.svg';
import charging_battery from '../../../resources/images/charging-battery.svg';

export default class InfoTop extends Component {
  baseline = null;

  componentDidMount() {
    this.generate();
  }

  componentWillUpdate() {
    this.setGear(this.props.value.gear);
    this.setBatteryMile(this.props.value);
  }

  generate() {
    const el = select('.info-top');
    const svg = el.append('svg').attr('width', '100%').attr('height', '100%');
    const svgWidth = 480; //parseInt(svg.style("width"));
    const svgHeight = 150; //parseInt(svg.style("height"));
  
    const g = svg.append('g').attr('transform', `translate(${svgWidth/2}, ${svgHeight/2})`);
    const colors = ['#D1D1D1', '#AFAFAF', '#FFFFFF', '#FD3104',  '#171717', '#0aa8d8', '#0A0A0A', '#fd7804', '#10f249'];
    
    const tg = svg.append('g').attr('transform', `translate(${svgWidth/2}, ${svgHeight})`);
    const bg = svg.append('g').attr('transform', `translate(${svgWidth * 0.5}, ${svgHeight})`);

    // gear text in center
    this.gearText = tg.append('text')
    .attr('font-size', '80')
    .attr('font-family', 'Arial')
    .attr('text-anchor', 'middle')
    .attr('opacity', '0.9')
    .attr('fill', colors[2])
    .attr('x', '0')
    .attr('y', '-30%')
    .style('position', 'relative')
    .style('z-index', '10');

    this.batteryNumber = bg.append('text')
    .attr('font-size', '20')
    .attr('font-family', 'Arial')
    .attr('text-anchor', 'middle')
    .attr('opacity', '0.9')
    .attr('fill', colors[2])
    .attr('x', '32%')
    .attr('y', '-9%')
    .style('position', 'relative')
    .style('z-index', '10');

    this.batteryImage = bg.append('image')
      .attr('xlink:href', charging_battery)
      .attr('x', '35%')
      .attr('y', '-27%')
      .attr('width', '70')
      .attr('height', '40')
      //class to make it responsive
      .style('z-index', '10'); 


    //The line in the dasharea
    const lineData  = [
    [ 0, -svgWidth / 2 + 10],
    [ 0,  svgWidth / 2 - 10],
    ];

    const needleLine = line();
    const ng = svg.append('g')
    .data([lineData])
    .attr('class', 'pointer')
    .attr('stroke-width', '3')
    .attr('stroke-linecap', 'round')
    .attr('transform', `translate(${svgWidth/2}, ${svgHeight})`)
    .attr('z-index', '2');

    this.needle_kw = ng.append('path')
    .attr('d', needleLine)
    .attr('stroke', colors[2])
    .attr('transform', `rotate(${90})`);
    

  } 

  setGear(value) {
    this.gearText.transition()
    .text(function(d){
      var gearString = value;
      return gearString;
    });
  }

  setBatteryMile(value) {
    var mileage = value.battery_status;
    var percentage = parseFloat(value.battery_percentage).toFixed(0); 
    this.batteryNumber.transition()
    .text(`${percentage}` + '%');

    // this.batteryImage.transition()
    // .attr('xlink:href', function(d){
    //   if(percentage === 0){
    //     return empty_battery; 
    //   }else if(percentage > 0 && percentage <= 50){
    //     return low_battery;
    //   }else if(percentage > 50 && percentage <= 75){
    //     return half_battery;
    //   }else if(percentage > 75 && percentage < 100){
    //     return almost_full_battery;
    //   }else if(percentage === 100){
    //     return full_battery;
    //   }
    // })

  }

  render() {
    return (
      <div className="info-top center-block"></div>
    )
  }
}
