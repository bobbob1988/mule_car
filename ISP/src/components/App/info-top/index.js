import React, { Component } from 'react';
import { line, select, range } from 'd3';


import battery from '../../../assets/images/full-battery.svg';

export default class InfoTop extends Component {
  baseline = null;

  componentDidMount() {
    this.generate();
  }

  generate() {
    const el = select('.info-top');
    const svg = el.append('svg').attr('width', '100%').attr('height', '100%');
    const svgWidth = parseInt(svg.style("width"));
    const svgHeight = parseInt(svg.style("height"));
  
    const g = svg.append('g').attr('transform', `translate(${svgWidth/2}, ${svgHeight/2})`);
    const colors = ['#D1D1D1', '#AFAFAF', '#FFFFFF', '#FD3104',  '#171717', '#0aa8d8', '#0A0A0A', '#fd7804', '#10f249'];
    
    const tg = svg.append('g').attr('transform', `translate(${svgWidth/2}, ${svgHeight})`);
    const bg = svg.append('g').attr('transform', `translate(${svgWidth * 0.5}, ${svgHeight})`);

    // gear text in center
    this.gearText = tg.append('text')
    .text('D')
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
    .text('353 mi')
    .attr('font-size', '20')
    .attr('font-family', 'Arial')
    .attr('text-anchor', 'middle')
    .attr('opacity', '0.9')
    .attr('fill', colors[2])
    .attr('x', '30%')
    .attr('y', '-10%')
    .style('position', 'relative')
    .style('z-index', '10');

    bg.append('image')
      .attr('xlink:href', battery)
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

  render() {
    return (
      <div class="info-top center-block"></div>
    )
  }
}
