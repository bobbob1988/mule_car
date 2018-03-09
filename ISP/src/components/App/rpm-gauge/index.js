import React,  { Component } from 'react';
import { select, arc, scaleLinear, interpolate, scaleLog, line, range, easeCubicInOut, easeCircle } from 'd3';

import lights from '../../../assets/images/lights.svg';
import seatBelt from '../../../assets/images/seat-belt.svg';
import rearWindowDefrost from '../../../assets/images/rear-window-defrost.svg';
//import fetch from 'node-fetch'

export default class RpmGauge extends Component {  
    needle_kw = null;
    needle_mph = null;
    model_arc = null;
    arc_mph = null;
    arc_power = null;
    rpmText = null;
    speedText = null;
    logoText = null;
    torqueText = null;

  componentDidMount() {
    this.generate();
  }

  componentWillUpdate() {
    this.setValue(this.props.value.speed, 500);
    this.setValuePower(this.props.value.power, 500);
  }

  generate() {
    const el = select('.rpm-gauge');
    const svg = el.append('svg').attr('width', '100%').attr('height', '100%');
    const svgWidth = parseInt(svg.style("width"));
    const svgHeight = parseInt(svg.style("height"));
    const bg = svg.append('g').attr('class', 'status').attr('transform', `translate(${svgWidth/2}, ${svgHeight/2})`);
    const g = svg.append('g').attr('transform', `translate(${svgWidth/2}, ${svgHeight/2})`);
    const colors = ['#D1D1D1', '#AFAFAF', '#FFFFFF', '#FD3104',  '#171717', '#0aa8d8', '#0A0A0A', '#fd7804', '#10f249','#212529'];
    const MPHticksData = [
    { value: 0 },
    { value: 20 },
    { value: 40 },
    { value: 60 },
    { value: 80 },
    { value: 100 },
    { value: 120 },
    { value: 140 },
    { value: 160 },
    { value: 180 },
    { value: 200 }
    ];
    const KWticksData = [
    { value: -100},
    { value: -80 },
    { value: -60 },      
    { value: -40 },
    { value: -20 },
    { value: 0 },
    { value: 20 },
    { value: 40 },
    { value: 80 },
    { value: 160 },
    { value: 320 },
    { value: 640 },
    { value: 800 }
    ];
    const r = 200; // width / 2

    // gradients
    const defs = svg.append('defs');
    
    // gradient color of the dashboard 
    const gradient = defs.append('linearGradient')
    .attr('id', 'gradient1')
    .attr('x1', '0%')
    .attr('y1', '0%')
    .attr('x2', '50%')
    .attr('y2', '100%');
    gradient.append('stop')
    .attr('offset', '10%')
    .attr('stop-color', colors[5])
    .attr('stop-opacity', 0.7);
    gradient.append('stop')
    .attr('offset', '100%')
    .attr('stop-color', colors[9])
    .attr('stop-opacity', 1);

    const gradientPower = defs.append('linearGradient')
    .attr('id', 'gradient3')
    .attr('x1', '0%')
    .attr('y1', '0%')
    .attr('x2', '50%')
    .attr('y2', '100%');
    gradientPower.append('stop')
    .attr('offset', '10%')
    .attr('stop-color', colors[7])
    .attr('stop-opacity', 0.7);
    gradientPower.append('stop')
    .attr('offset', '100%')
    .attr('stop-color', colors[9])
    .attr('stop-opacity', 1);

    const gradientPowerNegative = defs.append('linearGradient')
    .attr('id', 'gradient4')
    .attr('x1', '0%')
    .attr('y1', '0%')
    .attr('x2', '50%')
    .attr('y2', '100%');
    gradientPowerNegative.append('stop')
    .attr('offset', '0%')
    .attr('stop-color', colors[8])
    .attr('stop-opacity', 0.7);
    gradientPowerNegative.append('stop')
    .attr('offset', '90%')
    .attr('stop-color', colors[9])
    .attr('stop-opacity', 1);

    const gradientBackground = defs.append('linearGradient')
    .attr('id', 'gradient2')
    .attr('x1', '0%')
    .attr('y1', '20%')
    .attr('x2', '0%')
    .attr('y2', '100%');
    gradientBackground.append('stop')
    .attr('offset', '5%')
    .attr('stop-color', colors[1])
    .attr('stop-opacity', 0.5);
    gradientBackground.append('stop')
    .attr('offset', '90%')
    .attr('stop-color', colors[9])
    .attr('stop-opacity', 0);
    gradientBackground.append('stop')
    .attr('offset', '100%')
    .attr('stop-color', colors[1])
    .attr('stop-opacity', 0.5);
    
    var radialGradient = defs.append("radialGradient")
    .attr("id", "radial-gradient");

    radialGradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", colors[5])
    .attr('stop-opacity', 0.8);

    radialGradient.append("stop")
    .attr("offset", "80%")
    .attr("stop-color", colors[9])
    .attr('stop-opacity', 0.1);


    // outer circle
    const outerRadius = r - 10;
    const outerRadius_background = r + 1;
    const innerRadius = 0;
    const outerRadius_status = r + 10;
    const innerRadius_status = r - 20;
    
    // dashboard for the center round part
    const circle = arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
    .startAngle(0)
    .endAngle(2 * Math.PI);

    const circleBackground = arc()
    .innerRadius(outerRadius)
    .outerRadius(outerRadius_background)
    .startAngle(0)
    .endAngle(2 * Math.PI);
    
    // the round circle which will be updated by the angle
    var circle_speed = arc()
    .innerRadius(innerRadius_status)
    .outerRadius(outerRadius_status)
    .startAngle(this.degToRad(-150));

    // power round circle part
    var circle_power = arc()
    .innerRadius(innerRadius_status)
    .outerRadius(outerRadius_status)
    .startAngle(this.degToRad(90));

    this.arc_mph = bg.append('path')
    .datum({endAngle: this.degToRad(-150)})
    .attr('d', circle_speed)
    .attr('fill', 'url(#gradient1)')
    .attr('stroke', colors[5])
    .attr('stroke-width', '0.1')
    .attr('z-index', '2');
    
    this.arc_power = bg.append('path')
    .datum({endAngle: this.degToRad(90)})
    .attr('d', circle_power)
    .attr('fill', 'url(#gradient3)')
    .attr('stroke', colors[7])
    .attr('stroke-width', '0.1')
    .attr('z-index', '2');

    g.append('path')
    .attr('d', circle)
    .attr('fill', 'url(#radial-gradient)')
    .attr('stroke', colors[1])
    .attr('stroke-width', '0.1')
    .attr('z-index', '1');

    g.append('path')
    .attr('d', circleBackground)
    .attr('fill', 'url(#gradient2)')
    .attr('stroke', colors[1])
    .attr('opacity', '1')
    .attr('stroke-width', '0')
    .attr('z-index', '1');

    const lg = svg.append('g').attr('class', 'label').attr('transform', `translate(${svgWidth/2}, ${svgHeight/2})`);
    const rg = svg.append('g').attr('class', 'KWlabel').attr('transform', `translate(${svgWidth/2}, ${svgHeight/2})`);
    // MPH ticks angle range
    const minAngle = -150;
    const maxAngle = -10;
    const angleRange = maxAngle - minAngle;
    
    // KW ticks angle range (positive part)
    const minAngle_kw_positive = 10;
    const maxAngle_kw_positive = 78;

    // KW ticks angle range (negative part)
    const minAngle_kw_negative = 78;
    const maxAngle_kw_negative = 138;

    const MPHticks = MPHticksData.reduce((acc, curr, i) => {
     if (curr.value === 0) {
      return acc;
    } else {
     return acc.concat(range(curr.value - 20, curr.value + 20));
   }
 }, []).filter(d => d % 4 === 0 && d <= 200);
    
    const KWticks = KWticksData.reduce((acc, curr, i) => {
     if (curr.value >= -100 && curr.value < 20) {
       return acc.concat(range(curr.value, curr.value + 20));    
     } else {
       return acc.concat(range(curr.value, curr.value * 2 ));
     }
   }, []).filter(d => d % 20 === 0 && d <= 800);

    
    //MPH ticks
    lg.selectAll('line')
    .data(MPHticks)
    .enter().append('line')
    .attr('class', 'tickline')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', 0)
    .attr('y2', d => d % 5 === 0 ? '12' : '7')
    .attr('transform', d => {
      const scale = scaleLinear().range([0, 1]).domain([0, 200]);
      const ratio = scale(d);
      const newAngle = minAngle + (ratio * angleRange);
      const deviation = d % 5 === 0 ? 12 : 17;
      return `rotate(${newAngle}) translate(0, ${deviation - r})`;
    })
    .style('stroke', d => d >= 160 ? colors[3] : colors[2])
    .style('stroke-width', d => d % 5 === 0 ? '3' : '1')
    .attr('z-index', '2');


    //KW ticks
    rg.selectAll('line')
    .data(KWticks)
    .enter().append('line')
    .attr('class', 'KWtickline')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', 0)
    .attr('y2', 12)
    .attr('transform', d => {
      const scalelog = scaleLog().base(2).range([0, 1]).domain([1, 40]);
      const scalelinear = scaleLinear().range([0, 1]).domain([-100, 20]); 
      const ratio = d >= 20 ? scalelog(d / 20) : scalelinear(d);
      const minAngle = d >= 20 ? minAngle_kw_positive : minAngle_kw_negative;
      const maxAngle = d >= 20 ? maxAngle_kw_positive : maxAngle_kw_negative;
      const newAngle = maxAngle - (ratio * (maxAngle - minAngle)); 
      const deviation = Math.abs(d) === 0 ? 17 : 12;
      return `rotate(${newAngle}) translate(0, ${deviation - r})`;
    })
    .style('stroke', function(d){
      if (d === -100 || d === -80 || d === -60 || d === -40 || d === -20 || d === 0 || d === 20 || d === 40
      || d === 80 || d === 160 ){
        return colors[2];
      }else if(d === 320 || d === 800){
        return colors[3];
      } 
    })
    .style('stroke-width', d => d === -100 || d === -80 || d === -60 || d === -40 || d === -20 || d === 20 || d === 40
     || d === 80 || d === 160 || d === 320 || d === 800
     ? '3' : '0')
    .attr('z-index', '2');

    // tick texts
    lg.selectAll('text')
    .data(MPHticksData)
    .enter().append('text')
    .attr('transform', d => {
      const scale = scaleLinear().range([0, 1]).domain([0, 200]);
      const ratio = scale(d.value);
      const newAngle = this.degToRad(minAngle + (ratio * angleRange));
      const y = (40 - r) * Math.cos(newAngle);
      const x = -1 * (40 - r) * Math.sin(newAngle);
      return `translate(${x}, ${y + 5})`;
    })
    .text(d => d.value !== 0 ? d.value : '')
    .attr('fill', d => d.value >= 160 ? colors[3] : colors[2])
    .attr('font-size', '10')
    .attr('text-anchor', 'middle')
    .attr('z-index', '2');

    //Power tick texts
    rg.selectAll('text')
    .data(KWticksData)
    .enter().append('text')
    .attr('transform', d => {
      const scalelog = scaleLog().base(2).range([0, 1]).domain([1, 40]);
      const scalelinear = scaleLinear().range([0, 1]).domain([-100, 20]); 
      const ratio = d.value >= 20 ? scalelog(d.value / 20) : scalelinear(d.value);
      const minAngle = d.value >= 20 ? minAngle_kw_positive : minAngle_kw_negative;
      const maxAngle = d.value >= 20 ? maxAngle_kw_positive : maxAngle_kw_negative;
      const newAngle = this.degToRad(maxAngle - (ratio * (maxAngle - minAngle))); 
      const y = (40 - r) * Math.cos(newAngle);
      const x = -1 * (40 - r) * Math.sin(newAngle);
      return `translate(${x}, ${y + 5})`;
    })
    .text(function(d) {
        if(d.value === 0){ return 'Nm';}
        else if(d.value === -100 || d.value === -80 || d.value === -60 || d.value === -40 || d.value === -20 || d.value === 20 || d.value === 40
     || d.value === 80 || d.value === 160 || d.value === 320 || d.value === 800){ return Math.abs(d.value); }
        else { return '';}    
    })
    .attr('fill', function(d){
        if(d.value === 320 || d.value === 800){
            return colors[3];
        }else { return colors[2]; }
    })
    .attr('font-size', '10')
    .attr('text-anchor', 'middle')
    .attr('z-index', '2');


    // kw needle
    const pointerHeadLength = r * 1.02;
    const pointerCenterLength = r * 0.66
    const lineData  = [
    [ 0, -pointerHeadLength ],
    [ 0, -pointerCenterLength ],
    ];
    const needleLine = line();
    const ng = svg.append('g')
    .data([lineData])
    .attr('class', 'pointer')
    .attr('stroke-width', '3')
    .attr('stroke-linecap', 'round')
    .attr('transform', `translate(${svgWidth/2}, ${svgHeight/2})`)
    .attr('z-index', '2');

    this.needle_kw = ng.append('path')
    .attr('d', needleLine)
    .attr('stroke', colors[7])
    .attr('transform', `rotate(${90})`);

    this.needle_mph = ng.append('path')
    .attr('d', needleLine)
    .attr('stroke', colors[5])
    .attr('transform', `rotate(${-150})`);

    // inner circle
    const tg = svg.append('g').attr('transform', `translate(${svgWidth/2}, ${svgHeight/2})`);

    const innerArcOuterRadius = r - 80;
    const innerArcInnerRadius = 0;

    const innerArc = arc()
    .innerRadius(innerArcInnerRadius)
    .outerRadius(innerArcOuterRadius)
    .startAngle(0)
    .endAngle(2 * Math.PI);

    // tg.append('path')
    // .attr('d', innerArc)
    // .attr('stroke', colors[0])
    // .attr('stroke-width', '2')
    // .attr('fill', 'url(#gradient1)')
    // .attr('z-index', '10');

    // speed text in center
    this.speedText = tg.append('text')
    .text('0')
    .attr('font-size', '80')
    .attr('font-family', 'Arial')
    .attr('text-anchor', 'middle')
    .attr('opacity', '0.9')
    .attr('fill', colors[2])
    .attr('x', '0')
    .attr('y', '3%')
    .style('position', 'absolute')
    .style('z-index', '10');

    // Speed unit text
    this.speedUnitText = tg.append('text')
    .text('km/h')
    .attr('font-size', '15')
    .attr('font-family', 'Arial')
    .attr('text-anchor', 'middle')
    .attr('opacity', '0.9')
    .attr('fill', colors[2])
    .attr('x', '0')
    .attr('y', '7%')
    .style('position', 'absolute')
    .style('z-index', '10');

    // Torgue text

    this.torqueText = tg.append('text')
    .text('0')
    .attr('font-size', '40')
    .attr('font-family', 'Arial')
    .attr('text-anchor', 'middle')
    .attr('opacity', '0.9')
    .attr('fill', colors[2])
    .attr('x', '0')
    .attr('y', '20%')
    .style('position', 'absolute')
    .style('z-index', '10');
    
    // Torque unit

    this.torqueUnitText = tg.append('text')
    .text('Nm')
    .attr('font-size', '10')
    .attr('font-family', 'Arial')
    .attr('text-anchor', 'middle')
    .attr('opacity', '0.9')
    .attr('fill', colors[2])
    .attr('x', '0')
    .attr('y', '23%')
    .style('position', 'absolute')
    .style('z-index', '10');

  }



  degToRad(deg) {
    return deg * Math.PI / 180;
  }

  scale(value) {
    const s = scaleLinear().range([0, 1]).domain([0, 200]);
    return s(value);
  }

  scalePower(value) {
    const scalelog = scaleLog().base(2).range([0, 1]).domain([1, 40]);
    const scalelinear = scaleLinear().range([0, 1]).domain([-100, 20]);

    if(value >= 20){
      return scalelog(value/20);
    } else {
      return scalelinear(value);
    }
  }

  setValue(value, duration) {
    const minAngle = -150;
    const maxAngle = -10;
    const angleRange = maxAngle - minAngle;
    const angle = minAngle + (this.scale(value) * angleRange);
    const chartangle = this.degToRad(minAngle + (this.scale(value) * angleRange));

    this.speedText.transition()
    .ease(easeCubicInOut)
    .text(value);

    this.needle_mph.transition()
    .duration(duration)
    .ease(easeCubicInOut)
    .attr('transform', `rotate(${angle})`);

    // outer circle
    const outerRadius_status = 200 + 10;
    const innerRadius_status = 200 - 20;
    
    // the round circle which will be updated by the angle
    var circle_speed = arc()
    .innerRadius(innerRadius_status)
    .outerRadius(outerRadius_status)
    .startAngle(this.degToRad(-150))

    function arcTween(newEndAngle){
        return function(d){
        var i = interpolate(d.endAngle, newEndAngle);
        return function(t) {
          d.endAngle = i(t);
          //console.log(d.endAngle);
          return circle_speed(d);
        };
      };
    }

    this.arc_mph.transition()
    .duration(duration)
    .ease(easeCubicInOut)
    .attrTween("d", arcTween(chartangle));

  }

  setValuePower(value, duration) {
     // KW ticks angle range (positive part)
    const minAngle_kw_positive = 10;
    const maxAngle_kw_positive = 78;

    // KW ticks angle range (negative part)
    const minAngle_kw_negative = 78;
    const maxAngle_kw_negative = 138;

    const minAngle = value >= 20 ? minAngle_kw_positive : minAngle_kw_negative;
    const maxAngle = value >= 20 ? maxAngle_kw_positive : maxAngle_kw_negative;

    const angle = maxAngle - (this.scalePower(value) * (maxAngle - minAngle));
    const chartangle = this.degToRad(maxAngle - (this.scalePower(value) * (maxAngle - minAngle)));

    this.torqueText.transition()
    .ease(easeCubicInOut)
    .text(value);

    this.needle_kw.transition()
    .duration(duration)
    .ease(easeCubicInOut)
    .attr('transform', `rotate(${angle})`);

    // outer circle
    const outerRadius_status = 200 + 10;
    const innerRadius_status = 200 - 20;
    
    // the round circle which will be updated by the angle
   
    var circle_power = arc()
    .innerRadius(innerRadius_status)
    .outerRadius(outerRadius_status)
    .startAngle(this.degToRad(90))

    function arcTween(newEndAngle){
        return function(d){
        var i = interpolate(d.endAngle, newEndAngle);
        return function(t) {
          d.endAngle = i(t);
          //console.log(d.endAngle);
          return circle_power(d);
        };
      };
    }

    this.arc_power
    .transition()
    .duration(duration)
    .ease(easeCubicInOut)
    .attrTween("d", arcTween(chartangle));

  }

  render() {
    return (
      <div class="rpm-gauge center-block"></div>
      )
  }
}
