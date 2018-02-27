import React, { Component } from 'react';
import { select } from 'd3';

import redLine from '../../../assets/images/red-line.svg';
import whiteLine from '../../../assets/images/white-line.svg';
import musicalNote from '../../../assets/images/musical-note.svg';

export default class InfoBottom extends Component {
  componentDidMount() {
    this.generate();
  }

  generate() {
    const el = select('.info-bottom');
    const svg = el.append('svg').attr('width', '100%').attr('height', '100%');
    const g = svg.append('g');

    // red line
    g.append('image')
      .attr('xlink:href', redLine)
      .attr('x', '280px')
      .attr('y', '22px')
      .attr('width', '25px')
      .attr('height', '25px');

    // mileage
    g.append('text')
      .text('21341km')
      .attr('x', '370px')
      .attr('y', '40px')
      .attr('font-size', '18')
      .attr('text-anchor', 'middle')
      .attr('fill', '#FFFFFF');

    // white line
    g.append('image')
      .attr('xlink:href', whiteLine)
      .attr('x', '65px')
      .attr('y', '70px')
      .attr('width', '320px')
      .attr('height', '10px');

    // iPhone text
    g.append('text')
      .text('iPhone')
      .attr('x', '120px')
      .attr('y', '100px')
      .attr('font-size', '16')
      .attr('text-anchor', 'middle')
      .attr('fill', '#FFFFFF');

  }

  render() {
    return (
      <div class="info-bottom"></div>
    )
  }
}
