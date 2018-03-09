import React, { Component } from 'react';
import fetch from 'node-fetch';
import * as d3 from "d3";
import * as d3ScaleChromatic from 'd3-scale-chromatic';
import { scaleSqrt, scaleThreshold, select, arc, scaleLinear, interpolate, scaleLog, line, polyline, range, easeCubicInOut, easeCircle} from 'd3';

export default class Battery extends Component {

  constructor() {
    super();
    this.updateInterval = 1000;
    this.state = {
        frontphA: 0,
        frontphB: 0,
        frontphC: 0,
        frontcoolant: 0,
        frontwinding1: 0,
        frontwinding2: 0,
        rearphA: 0,
        rearphB: 0,
        rearphC: 0,
        rearcoolant: 0,
        rearwinding1: 0,
        rearwinding2: 0,
      };
    this.subscription = null;
    this.updateInterval = 100;
    this.frontMotorfetchUrl = "http://10.21.51.156:7379/GET/FrontMotorData";
    this.rearMotorfetchUrl = "http://10.21.51.156:7379/GET/RearMotorData";
  }

  updateStatus() {
    const self = this;
    fetch(self.frontMotorfetchUrl)
    .catch(err => console.log(err))
    .then(res => res.json())
    .then(json => {
      if (json["GET"]){
        var data = JSON.parse(json["GET"]);
        self.setState({frontphA: `${data.frontMotorTemperature.frontMotorSinkPhaseATemp}`, frontphB: `${data.frontMotorTemperature.frontMotorSinkPhaseBTemp}`, frontphC: `${data.frontMotorTemperature.frontMotorSinkPhaseCTemp}`,
        frontcoolant:`${data.frontMotorTemperature.frontMotorCoolantTemp}`, frontwinding1: `${data.frontMotorTemperature.frontMotorWindingTemp1}`, frontwinding2: `${data.frontMotorTemperature.frontMotorWindingTemp2}`
      });
      } else {
        console.log("no data");
      }
    });

    fetch(self.rearMotorfetchUrl)
    .catch(err => console.log(err))
    .then(res => res.json())
    .then(json => {
      if (json["GET"]){
        var data = JSON.parse(json["GET"]);
        self.setState({
        rearphA: `${data.rearMotorTemperature.rearMotorSinkPhaseATemp}`, rearphB: `${data.rearMotorTemperature.rearMotorSinkPhaseBTemp}`, rearphC: `${data.rearMotorTemperature.rearMotorSinkPhaseCTemp}`,
        rearcoolant:`${data.rearMotorTemperature.rearMotorCoolantTemp}`, rearwinding1: `${data.rearMotorTemperature.rearMotorWindingTemp1}`, rearwinding2: `${data.rearMotorTemperature.rearMotorWindingTemp2}`
      });
      } else {
        console.log("no data");
      }
    });
  }
  componentDidMount() {
    this.generate();
    const self = this;
    self.updateStatus();
    self.intervalId = setInterval(self.updateStatus.bind(self), self.updateInterval);
  }

  componentWillUpdate() {
    this.setValue(this.state);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  generate() {
    const el = select('.thermal');
    const svg = el.append('svg').attr('width', '100%').attr('height', '100%');
    const svgWidth = parseInt(svg.style("width"));
    const svgHeight = parseInt(svg.style("height"));
    const g = svg.append('g').attr('transform', `translate(20, ${svgHeight/2.5})`);
    const colors = ['#FFFFFF', '#0A0A0A',"#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00", '#212529'];

    const tempColor = ["#313695","#4575b4","#74add1","#abd9e9","#fee090","#fdae61","#f46d43","#d73027","#a50026"];
    var colorScale = d3.scaleQuantile()
    .domain([-40, 0, 216])
    .range(tempColor);

    console.log(colorScale(19));
    // gradients
    const defs = svg.append('defs');

    // gradient color of the dashboard 
    const gradient = defs.append('linearGradient')
    .attr('id', 'thermal_gradient1')
    .attr('x1', '0%')
    .attr('y1', '0%')
    .attr('x2', '50%')
    .attr('y2', '100%');
    gradient.append('stop')
    .attr('offset', '10%')
    .attr('stop-color', colors[3])
    .attr('stop-opacity', 0.5);
    gradient.append('stop')
    .attr('offset', '100%')
    .attr('stop-color', colors[3])
    .attr('stop-opacity', 0.7);

    //The radiator area
    this.radiatorRect = g.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr('class', 'rect')
    .attr("width", svgWidth /30)
    .attr("height", svgHeight /6)
    .attr('fill', 'url(#thermal_gradient1)' )
    .attr('stroke', colors[9] )
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', '3')
    .attr('z-index', '2')

    this.radiatorText = g.append('text')
    .text('Radiator')
    .attr('font-size', '20')
    .attr('font-family', 'Agency FB')
    .attr('text-anchor', 'middle')
    .attr('opacity', '0.9')
    .attr('fill', colors[0])
    .attr('x', -svgHeight /12)
    .attr('y', '4.5%')
    .attr('transform', `rotate(${-90})`)
    .style('position', 'absolute')
    .attr('font-weight', 'bold')
    .style('z-index', '10');

    // const pointerHeadLength = 20 * 1.02;
    // const pointerCenterLength = 20 * 0.66
    // const lineData  = [
    // [ 0, -pointerHeadLength ],
    // [ 0, -pointerCenterLength ],
    // [ -pointerHeadLength, -pointerCenterLength*12 ],
    // ];
    // const needleLine = line();
    // const ng = svg.append('g')
    // .data([lineData])
    // .attr('class', 'pointer')
    // .attr('stroke-width', '3')
    // .attr('stroke-linecap', 'round')
    // .attr('transform', `translate(20, ${svgHeight/2})`)
    // .attr('z-index', '3');

    // this.needle_kw = ng.append('path')
    // .attr('d', needleLine)
    // .attr('stroke', colors[7])
    // .attr('transform', `rotate(${90})`);


    //The reservior area
    const tg = svg.append('g').attr('transform', `translate(${svgWidth/4},${svgHeight/9})`);


    this.reservoirRect = tg.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr('class', 'rect')
    .attr("width", svgWidth /10)
    .attr("height", svgHeight /12)
    .attr('fill', 'url(#thermal_gradient1)' )
    .attr('stroke', colors[9] )
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', '3')
    .attr('z-index', '2');

    this.reservoirText =tg.append('text')
    .text('Reservoir')
    .attr('font-size', '20')
    .attr('font-family', 'Agency FB')
    .attr('text-anchor', 'middle')
    .attr('opacity', '0.9')
    .attr('fill', colors[0])
    .attr('x', '5%')
    .attr('y', '5.5%')
    .attr('transform', `rotate(${0})`)
    .style('position', 'absolute')
    .attr('font-weight', 'bold')
    .style('z-index', '10');

    //temperature bar 
    var margin = { top: 50, right: 0, bottom: 100, left: 30 };
    var width = 960 - margin.left - margin.right;
    var height = 130 - margin.top - margin.bottom;
    var gridSize = Math.floor(width / 24);
    var legendElementWidth = gridSize*2;

    var legend = svg.selectAll(".legend")
    .data([0].concat(colorScale.quantiles()), function(d) { 
      return d; });

    legend.enter().append("g")
    .attr('transform', `translate(${svgWidth/1.5},${svgHeight/20})`)
    .attr("class", "legend")
    .append("rect")
    .attr("x", function(d, i) { 
      return legendElementWidth * i /2; })
    .attr("y", height)
    .attr("width", legendElementWidth/2)
    .attr("height", gridSize / 2)
    .style("fill", function(d, i) { return tempColor[i]; })
    .append("text")
    .attr("class", "mono")
    .text(function(d) { return "≥ " + Math.round(d); })
    .attr("x", function(d, i) { return legendElementWidth * i; })
    .attr("y", height + gridSize);

    //The Front Drive Unit
    const fg = svg.append('g').attr('transform', `translate(${svgWidth/2.5},${svgHeight/12})`);

    this.frontDriveUnitTag = fg.append("rect")
    .attr("rx", 6)
    .attr("ry", 6)
    .attr("x", '0.1%')
    .attr("y", '-6%')
    .attr('class', 'rect')
    .attr("width", svgWidth /8)
    .attr("height", svgHeight /12)
    .attr('fill', 'url(#thermal_gradient1)' )
    .attr('stroke',colors[1] )
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', '0')
    .attr('opacity', '0.9')
    .attr('z-index', '2');

    this.frontDriveUnitTagText = fg.append('text')
    .text('Front Drive Unit')
    .attr('font-size', '20')
    .attr('font-family', 'Agency FB')
    .attr('text-anchor', 'middle')
    .attr('opacity', '0.9')
    .attr('fill', colors[0])
    .attr('x', '6%')
    .attr('y', '-2%')
    .attr('transform', `rotate(${0})`)
    .style('position', 'absolute')
    .attr('font-weight', 'bold')
    .style('z-index', '10');

    this.FCURect = fg.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr('class', 'rect')
    .attr("width", svgWidth /4)
    .attr("height", svgHeight /2.5)
    .attr('fill', 'url(#thermal_gradient1)' )
    .attr('stroke', colors[9] )
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', '3')
    .attr('z-index', '2');

    this.frontMotorTag = fg.append("rect")
    .attr("rx", 6)
    .attr("ry", 6)
    .attr("x", '2.5%')
    .attr("y", '13%')
    .attr('class', 'rect')
    .attr("width", svgWidth /18)
    .attr("height", svgHeight /12)
    .attr('fill', 'url(#thermal_gradient1)' )
    .attr('stroke',colors[1] )
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', '1')
    .attr('opacity', '0.9')
    .attr('z-index', '2');

    this.frontMotorTagText = fg.append('text')
    .text('MOTOR')
    .attr('font-size', '20')
    .attr('font-family', 'Agency FB')
    .attr('text-anchor', 'middle')
    .attr('opacity', '0.9')
    .attr('fill', colors[1])
    .attr('x', '5.2%')
    .attr('y', '19%')
    .attr('transform', `rotate(${0})`)
    .style('position', 'absolute')
    .style('z-index', '10');

    this.frontMotor = fg.append("rect")
    .attr("x", '2.5%')
    .attr("y", '2%')
    .attr('class', 'rect')
    .attr("width", svgWidth /5)
    .attr("height", svgHeight /8)
    .attr('fill', 'url(#thermal_gradient1)' )
    .attr('stroke', colors[9] )
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', '3')
    .attr('z-index', '2');


    this.winding1FrontBox = fg.append("rect")
    .attr("x", '2.5%')
    .attr("y", '2%')
    .attr('class', 'rect')
    .attr("width", svgWidth /10)
    .attr("height", svgHeight /8)
    .attr('fill', 'url(#thermal_gradient1)' )
    .attr('stroke', colors[9] )
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', '3')
    .attr('z-index', '1');

    this.winding1FrontText = fg.append('text')
    .text('Winding Ⅰ')
    .attr('font-size', '20')
    .attr('font-family', 'Agency FB')
    .attr('text-anchor', 'middle')
    .attr('opacity', '0.9')
    .attr('fill', colors[0])
    .attr('x', '7.5%')
    .attr('y', '12%')
    .attr('transform', `rotate(${0})`)
    .attr('font-weight', 'bold')
    .style('position', 'absolute')
    .style('z-index', '10');

    this.winding1FrontTemperatureText = fg.append('text')
    .text('0')
    .attr('font-size', '20')
    .attr('font-family', 'Agency FB')
    .attr('text-anchor', 'middle')
    .attr('opacity', '0.9')
    .attr('fill', colors[0])
    .attr('x', '7.5%')
    .attr('y', '7%')
    .attr('transform', `rotate(${0})`)
    .attr('font-weight', 'bold')
    .style('position', 'absolute')
    .style('z-index', '10');

    this.winding2FrontBox = fg.append("rect")
    .attr("x", '12.5%')
    .attr("y", '2%')
    .attr('class', 'rect')
    .attr("width", svgWidth /10)
    .attr("height", svgHeight /8)
    .attr('fill', 'url(#thermal_gradient1)' )
    .attr('stroke', colors[9] )
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', '3')
    .attr('z-index', '1');

    this.winding2FrontText = fg.append('text')
    .text('Winding Ⅱ')
    .attr('font-size', '20')
    .attr('font-family', 'Agency FB')
    .attr('text-anchor', 'middle')
    .attr('opacity', '0.9')
    .attr('fill', colors[0])
    .attr('x', '17.5%')
    .attr('y', '12%')
    .attr('transform', `rotate(${0})`)
    .attr('font-weight', 'bold')
    .style('position', 'absolute')
    .style('z-index', '10');

    this.winding2FrontTemperatureText = fg.append('text')
    .text('0')
    .attr('font-size', '20')
    .attr('font-family', 'Agency FB')
    .attr('text-anchor', 'middle')
    .attr('opacity', '0.9')
    .attr('fill', colors[0])
    .attr('x', '17.5%')
    .attr('y', '7%')
    .attr('transform', `rotate(${0})`)
    .attr('font-weight', 'bold')
    .style('position', 'absolute')
    .style('z-index', '10');


    this.frontGearBox = fg.append("rect")
    .attr("rx", 6)
    .attr("ry", 6)
    .attr("x", '10%')
    .attr("y", '15.5%')
    .attr('class', 'rect')
    .attr("width", svgWidth /18)
    .attr("height", svgHeight /12)
    .attr('fill', 'url(#thermal_gradient1)' )
    .attr('stroke', colors[9] )
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', '1')
    .attr('opacity', '0.9')
    .attr('z-index', '10');

    this.frontGearBoxTagText = fg.append('text')
    .text('GearBox')
    .attr('font-size', '20')
    .attr('font-family', 'Agency FB')
    .attr('text-anchor', 'middle')
    .attr('opacity', '0.9')
    .attr('fill', colors[1])
    .attr('x', '12.8%')
    .attr('y', '21%')
    .attr('transform', `rotate(${0})`)
    .style('position', 'absolute')
    .style('z-index', '10');

    this.frontInverterTag = fg.append("rect")
    .attr("rx", 6)
    .attr("ry", 6)
    .attr("x", '17%')
    .attr("y", '18%')
    .attr('class', 'rect')
    .attr("width", svgWidth /18)
    .attr("height", svgHeight /12)
    .attr('fill', 'url(#thermal_gradient1)' )
    .attr('stroke',colors[1] )
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', '1')
    .attr('opacity', '0.9')
    .attr('z-index', '2');

    this.frontInverterTagText = fg.append('text')
    .text('Inverter')
    .attr('font-size', '20')
    .attr('font-family', 'Agency FB')
    .attr('text-anchor', 'middle')
    .attr('opacity', '0.9')
    .attr('fill', colors[1])
    .attr('x', '19.8%')
    .attr('y', '23%')
    .attr('transform', `rotate(${0})`)
    .style('position', 'absolute')
    .style('z-index', '10');

    this.frontInverter = fg.append("rect")
    .attr("x", '2.5%')
    .attr("y", '25%')
    .attr('class', 'rect')
    .attr("width", svgWidth /5)
    .attr("height", svgHeight /8)
    .attr('fill', 'url(#thermal_gradient1)' )
    .attr('stroke', colors[9] )
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', '3')
    .attr('z-index', '2');

    this.phAFrontBox = fg.append("rect")
    .attr("x", '2.5%')
    .attr("y", '25%')
    .attr('class', 'rect')
    .attr("width", svgWidth /20)
    .attr("height", svgHeight /8)
    .attr('fill', 'url(#thermal_gradient1)' )
    .attr('stroke', colors[9] )
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', '3')
    .attr('z-index', '1');

    this.phAFrontText = fg.append('text')
    .text('phA')
    .attr('font-size', '20')
    .attr('font-family', 'Agency FB')
    .attr('text-anchor', 'middle')
    .attr('opacity', '0.9')
    .attr('fill', colors[0])
    .attr('x', '5%')
    .attr('y', '35.5%')
    .attr('transform', `rotate(${0})`)
    .attr('font-weight', 'bold')
    .style('position', 'absolute')
    .style('z-index', '10');

    this.phAFrontTemperatureText = fg.append('text')
    .text('0')
    .attr('font-size', '20')
    .attr('font-family', 'Agency FB')
    .attr('text-anchor', 'middle')
    .attr('opacity', '0.9')
    .attr('fill', colors[0])
    .attr('x', '5%')
    .attr('y', '30%')
    .attr('transform', `rotate(${0})`)
    .attr('font-weight', 'bold')
    .style('position', 'absolute')
    .style('z-index', '10');

    this.phBFrontBox = fg.append("rect")
    .attr("x", '7.5%')
    .attr("y", '25%')
    .attr('class', 'rect')
    .attr("width", svgWidth /20)
    .attr("height", svgHeight /8)
    .attr('fill', 'url(#thermal_gradient1)' )
    .attr('stroke', colors[9] )
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', '3')
    .attr('z-index', '1');

    this.phBFrontText = fg.append('text')
    .text('phB')
    .attr('font-size', '20')
    .attr('font-family', 'Agency FB')
    .attr('text-anchor', 'middle')
    .attr('opacity', '0.9')
    .attr('fill', colors[0])
    .attr('x', '10%')
    .attr('y', '35.5%')
    .attr('transform', `rotate(${0})`)
    .attr('font-weight', 'bold')
    .style('position', 'absolute')
    .style('z-index', '10');

    this.phBFrontTemperatureText = fg.append('text')
    .text('0')
    .attr('font-size', '20')
    .attr('font-family', 'Agency FB')
    .attr('text-anchor', 'middle')
    .attr('opacity', '0.9')
    .attr('fill', colors[0])
    .attr('x', '10%')
    .attr('y', '30%')
    .attr('transform', `rotate(${0})`)
    .attr('font-weight', 'bold')
    .style('position', 'absolute')
    .style('z-index', '10');


    this.phCFrontBox = fg.append("rect")
    .attr("x", '12.5%')
    .attr("y", '25%')
    .attr('class', 'rect')
    .attr("width", svgWidth /20)
    .attr("height", svgHeight /8)
    .attr('fill', 'url(#thermal_gradient1)' )
    .attr('stroke', colors[9] )
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', '3')
    .attr('z-index', '1');

    this.phCFrontText = fg.append('text')
    .text('phC')
    .attr('font-size', '20')
    .attr('font-family', 'Agency FB')
    .attr('text-anchor', 'middle')
    .attr('opacity', '0.9')
    .attr('fill', colors[0])
    .attr('x', '15%')
    .attr('y', '35.5%')
    .attr('transform', `rotate(${0})`)
    .attr('font-weight', 'bold')
    .style('position', 'absolute')
    .style('z-index', '10');

    this.phCFrontTemperatureText = fg.append('text')
    .text('0')
    .attr('font-size', '20')
    .attr('font-family', 'Agency FB')
    .attr('text-anchor', 'middle')
    .attr('opacity', '0.9')
    .attr('fill', colors[0])
    .attr('x', '15%')
    .attr('y', '30%')
    .attr('transform', `rotate(${0})`)
    .attr('font-weight', 'bold')
    .style('position', 'absolute')
    .style('z-index', '10');

    this.coolantFrontBox = fg.append("rect")
    .attr("x", '17.5%')
    .attr("y", '25%')
    .attr('class', 'rect')
    .attr("width", svgWidth /20)
    .attr("height", svgHeight /8)
    .attr('fill', 'url(#thermal_gradient1)' )
    .attr('stroke', colors[9] )
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', '3')
    .attr('z-index', '1');

    this.coolantFrontText = fg.append('text')
    .text('coolant')
    .attr('font-size', '20')
    .attr('font-family', 'Agency FB')
    .attr('text-anchor', 'middle')
    .attr('opacity', '0.9')
    .attr('fill', colors[0])
    .attr('x', '20%')
    .attr('y', '35.5%')
    .attr('transform', `rotate(${0})`)
    .attr('font-weight', 'bold')
    .style('position', 'absolute')
    .style('z-index', '10');

    this.coolantFrontTemperatureText = fg.append('text')
    .text('0')
    .attr('font-size', '20')
    .attr('font-family', 'Agency FB')
    .attr('text-anchor', 'middle')
    .attr('opacity', '0.9')
    .attr('fill', colors[0])
    .attr('x', '20%')
    .attr('y', '30%')
    .attr('transform', `rotate(${0})`)
    .attr('font-weight', 'bold')
    .style('position', 'absolute')
    .style('z-index', '10');

    // fg.selectAll("rect")
    //  .data(color.range().map(function(d) {
    //   d = color.invertExtent(d);
    //   if (d[0] == null) d[0] = x.domain()[0];
    //   if (d[1] == null) d[1] = x.domain()[1];
    //   console.log(d);
    //   return d;
    // }))
    // .attr("fill", function(d) { return color(d[1]); });


    //The Rear Drive Unit
    const rg = svg.append('g').attr('transform', `translate(${svgWidth/1.5},${svgHeight/3})`);

    this.rearDriveUnitTag = rg.append("rect")
    .attr("rx", 6)
    .attr("ry", 6)
    .attr("x", '0.1%')
    .attr("y", '-6%')
    .attr('class', 'rect')
    .attr("width", svgWidth /8)
    .attr("height", svgHeight /12)
    .attr('fill', 'url(#thermal_gradient1)' )
    .attr('stroke',colors[1] )
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', '0')
    .attr('opacity', '0.9')
    .attr('z-index', '2');

    this.rearDriveUnitTagText = rg.append('text')
    .text('Rear Drive Unit')
    .attr('font-size', '20')
    .attr('font-family', 'Agency FB')
    .attr('text-anchor', 'middle')
    .attr('opacity', '0.9')
    .attr('fill', colors[0])
    .attr('x', '6%')
    .attr('y', '-2%')
    .attr('transform', `rotate(${0})`)
    .style('position', 'absolute')
    .attr('font-weight', 'bold')
    .style('z-index', '10');

    this.RCUirRect = rg.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr('class', 'rect')
    .attr("width", svgWidth /4)
    .attr("height", svgHeight /2.5)
    .attr('fill', 'url(#thermal_gradient1)' )
    .attr('stroke', colors[9] )
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', '3')
    .attr('z-index', '2');

    this.rearMotorTag = rg.append("rect")
    .attr("rx", 6)
    .attr("ry", 6)
    .attr("x", '2.5%')
    .attr("y", '13%')
    .attr('class', 'rect')
    .attr("width", svgWidth /18)
    .attr("height", svgHeight /12)
    .attr('fill', 'url(#thermal_gradient1)' )
    .attr('stroke',colors[1] )
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', '1')
    .attr('opacity', '0.9')
    .attr('z-index', '2');

    this.rearMotorTagText = rg.append('text')
    .text('MOTOR')
    .attr('font-size', '20')
    .attr('font-family', 'Agency FB')
    .attr('text-anchor', 'middle')
    .attr('opacity', '0.9')
    .attr('fill', colors[1])
    .attr('x', '5.2%')
    .attr('y', '19%')
    .attr('transform', `rotate(${0})`)
    .style('position', 'absolute')
    .style('z-index', '10');

    this.rearMotor = rg.append("rect")
    .attr("x", '2.5%')
    .attr("y", '2%')
    .attr('class', 'rect')
    .attr("width", svgWidth /5)
    .attr("height", svgHeight /8)
    .attr('fill', 'url(#thermal_gradient1)' )
    .attr('stroke', colors[9] )
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', '3')
    .attr('z-index', '2');

    this.winding1RearBox = rg.append("rect")
    .attr("x", '2.5%')
    .attr("y", '2%')
    .attr('class', 'rect')
    .attr("width", svgWidth /10)
    .attr("height", svgHeight /8)
    .attr('fill', 'url(#thermal_gradient1)' )
    .attr('stroke', colors[9] )
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', '3')
    .attr('z-index', '1');

    this.winding1RearText = rg.append('text')
    .text('Winding Ⅰ')
    .attr('font-size', '20')
    .attr('font-family', 'Agency FB')
    .attr('text-anchor', 'middle')
    .attr('opacity', '0.9')
    .attr('fill', colors[0])
    .attr('x', '7.5%')
    .attr('y', '12%')
    .attr('transform', `rotate(${0})`)
    .attr('font-weight', 'bold')
    .style('position', 'absolute')
    .style('z-index', '10');

    this.winding1RearTemperatureText = rg.append('text')
    .text('0')
    .attr('font-size', '20')
    .attr('font-family', 'Agency FB')
    .attr('text-anchor', 'middle')
    .attr('opacity', '0.9')
    .attr('fill', colors[0])
    .attr('x', '7.5%')
    .attr('y', '7%')
    .attr('transform', `rotate(${0})`)
    .attr('font-weight', 'bold')
    .style('position', 'absolute')
    .style('z-index', '10');

    this.winding2RearBox = rg.append("rect")
    .attr("x", '12.5%')
    .attr("y", '2%')
    .attr('class', 'rect')
    .attr("width", svgWidth /10)
    .attr("height", svgHeight /8)
    .attr('fill', 'url(#thermal_gradient1)' )
    .attr('stroke', colors[9] )
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', '3')
    .attr('z-index', '1');

    this.winding2RearText = rg.append('text')
    .text('Winding Ⅱ')
    .attr('font-size', '20')
    .attr('font-family', 'Agency FB')
    .attr('text-anchor', 'middle')
    .attr('opacity', '0.9')
    .attr('fill', colors[0])
    .attr('x', '17.5%')
    .attr('y', '12%')
    .attr('transform', `rotate(${0})`)
    .attr('font-weight', 'bold')
    .style('position', 'absolute')
    .style('z-index', '10');

    this.winding2RearTemperatureText = rg.append('text')
    .text('0')
    .attr('font-size', '20')
    .attr('font-family', 'Agency FB')
    .attr('text-anchor', 'middle')
    .attr('opacity', '0.9')
    .attr('fill', colors[0])
    .attr('x', '17.5%')
    .attr('y', '7%')
    .attr('transform', `rotate(${0})`)
    .attr('font-weight', 'bold')
    .style('position', 'absolute')
    .style('z-index', '10');

    this.rearGearBox = rg.append("rect")
    .attr("rx", 6)
    .attr("ry", 6)
    .attr("x", '10%')
    .attr("y", '15.5%')
    .attr('class', 'rect')
    .attr("width", svgWidth /18)
    .attr("height", svgHeight /12)
    .attr('fill', 'url(#thermal_gradient1)' )
    .attr('stroke', colors[9] )
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', '1')
    .attr('opacity', '0.9')
    .attr('z-index', '10');

    this.rearGearBoxTagText = rg.append('text')
    .text('GearBox')
    .attr('font-size', '20')
    .attr('font-family', 'Agency FB')
    .attr('text-anchor', 'middle')
    .attr('opacity', '0.9')
    .attr('fill', colors[1])
    .attr('x', '12.8%')
    .attr('y', '21%')
    .attr('transform', `rotate(${0})`)
    .style('position', 'absolute')
    .style('z-index', '10');

    this.rearInverterTag = rg.append("rect")
    .attr("rx", 6)
    .attr("ry", 6)
    .attr("x", '17%')
    .attr("y", '18%')
    .attr('class', 'rect')
    .attr("width", svgWidth /18)
    .attr("height", svgHeight /12)
    .attr('fill', 'url(#thermal_gradient1)' )
    .attr('stroke',colors[1] )
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', '1')
    .attr('opacity', '0.9')
    .attr('z-index', '2');

    this.rearInverterTagText = rg.append('text')
    .text('Inverter')
    .attr('font-size', '20')
    .attr('font-family', 'Agency FB')
    .attr('text-anchor', 'middle')
    .attr('opacity', '0.9')
    .attr('fill', colors[1])
    .attr('x', '19.8%')
    .attr('y', '23%')
    .attr('transform', `rotate(${0})`)
    .style('position', 'absolute')
    .style('z-index', '10');

    this.rearInverter = rg.append("rect")
    .attr("x", '2.5%')
    .attr("y", '25%')
    .attr('class', 'rect')
    .attr("width", svgWidth /5)
    .attr("height", svgHeight /8)
    .attr('fill', 'url(#thermal_gradient1)' )
    .attr('stroke', colors[9] )
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', '3')
    .attr('z-index', '2');

    this.phARearBox = rg.append("rect")
    .attr("x", '2.5%')
    .attr("y", '25%')
    .attr('class', 'rect')
    .attr("width", svgWidth /20)
    .attr("height", svgHeight /8)
    .attr('fill', 'url(#thermal_gradient1)' )
    .attr('stroke', colors[9] )
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', '3')
    .attr('z-index', '1');

    this.phARearText = rg.append('text')
    .text('phA')
    .attr('font-size', '20')
    .attr('font-family', 'Agency FB')
    .attr('text-anchor', 'middle')
    .attr('opacity', '0.9')
    .attr('fill', colors[0])
    .attr('x', '5%')
    .attr('y', '35.5%')
    .attr('transform', `rotate(${0})`)
    .style('position', 'absolute')
    .attr('font-weight', 'bold')
    .style('z-index', '10');

    this.phARearTemperatureText = rg.append('text')
    .text('0')
    .attr('font-size', '20')
    .attr('font-family', 'Agency FB')
    .attr('text-anchor', 'middle')
    .attr('opacity', '0.9')
    .attr('fill', colors[0])
    .attr('x', '5%')
    .attr('y', '30%')
    .attr('transform', `rotate(${0})`)
    .style('position', 'absolute')
    .attr('font-weight', 'bold')
    .style('z-index', '10');

    this.phBRearBox = rg.append("rect")
    .attr("x", '7.5%')
    .attr("y", '25%')
    .attr('class', 'rect')
    .attr("width", svgWidth /20)
    .attr("height", svgHeight /8)
    .attr('fill', 'url(#thermal_gradient1)' )
    .attr('stroke', colors[9] )
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', '3')
    .attr('z-index', '1');

    this.phBRearText = rg.append('text')
    .text('phB')
    .attr('font-size', '20')
    .attr('font-family', 'Agency FB')
    .attr('text-anchor', 'middle')
    .attr('opacity', '0.9')
    .attr('fill', colors[0])
    .attr('x', '10%')
    .attr('y', '35.5%')
    .attr('transform', `rotate(${0})`)
    .style('position', 'absolute')
    .attr('font-weight', 'bold')
    .style('z-index', '10');

    this.phBRearTemperatureText = rg.append('text')
    .text('0')
    .attr('font-size', '20')
    .attr('font-family', 'Agency FB')
    .attr('text-anchor', 'middle')
    .attr('opacity', '0.9')
    .attr('fill', colors[0])
    .attr('x', '10%')
    .attr('y', '30%')
    .attr('transform', `rotate(${0})`)
    .style('position', 'absolute')
    .attr('font-weight', 'bold')
    .style('z-index', '10');

    this.phCRearBox = rg.append("rect")
    .attr("x", '12.5%')
    .attr("y", '25%')
    .attr('class', 'rect')
    .attr("width", svgWidth /20)
    .attr("height", svgHeight /8)
    .attr('fill', 'url(#thermal_gradient1)' )
    .attr('stroke', colors[9] )
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', '3')
    .attr('z-index', '1');

    this.phCRearText = rg.append('text')
    .text('phC')
    .attr('font-size', '20')
    .attr('font-family', 'Agency FB')
    .attr('text-anchor', 'middle')
    .attr('opacity', '0.9')
    .attr('fill', colors[0])
    .attr('x', '15%')
    .attr('y', '35.5%')
    .attr('transform', `rotate(${0})`)
    .style('position', 'absolute')
    .attr('font-weight', 'bold')
    .style('z-index', '10');

    this.phCRearTemperatureText = rg.append('text')
    .text('0')
    .attr('font-size', '20')
    .attr('font-family', 'Agency FB')
    .attr('text-anchor', 'middle')
    .attr('opacity', '0.9')
    .attr('fill', colors[0])
    .attr('x', '15%')
    .attr('y', '30%')
    .attr('transform', `rotate(${0})`)
    .style('position', 'absolute')
    .attr('font-weight', 'bold')
    .style('z-index', '10');

    this.coolantRearBox = rg.append("rect")
    .attr("x", '17.5%')
    .attr("y", '25%')
    .attr('class', 'rect')
    .attr("width", svgWidth /20)
    .attr("height", svgHeight /8)
    .attr('fill', 'url(#thermal_gradient1)' )
    .attr('stroke', colors[9] )
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', '3')
    .attr('z-index', '1');

    this.coolantRearText = rg.append('text')
    .text('coolant')
    .attr('font-size', '20')
    .attr('font-family', 'Agency FB')
    .attr('text-anchor', 'middle')
    .attr('opacity', '0.9')
    .attr('fill', colors[0])
    .attr('x', '20%')
    .attr('y', '35.5%')
    .attr('transform', `rotate(${0})`)
    .style('position', 'absolute')
    .attr('font-weight', 'bold')
    .style('z-index', '10');

    this.coolantRearTemperatureText = rg.append('text')
    .text('0')
    .attr('font-size', '20')
    .attr('font-family', 'Agency FB')
    .attr('text-anchor', 'middle')
    .attr('opacity', '0.9')
    .attr('fill', colors[0])
    .attr('x', '20%')
    .attr('y', '30%')
    .attr('transform', `rotate(${0})`)
    .style('position', 'absolute')
    .attr('font-weight', 'bold')
    .style('z-index', '10');


    //DC area
    const dg = svg.append('g').attr('transform', `translate(${svgWidth/2},${svgHeight/1.9})`);

    this.dcRect = dg.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr('class', 'rect')
    .attr("width", svgWidth /12)
    .attr("height", svgHeight /12)
    .attr('fill', 'url(#thermal_gradient1)' )
    .attr('stroke', colors[9] )
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', '3')
    .attr('z-index', '2');

    this.dcText = dg.append('text')
    .text('DC/DC')
    .attr('font-size', '20')
    .attr('font-family', 'Agency FB')
    .attr('text-anchor', 'middle')
    .attr('opacity', '0.9')
    .attr('fill', colors[0])
    .attr('x', '4%')
    .attr('y', '5.5%')
    .attr('transform', `rotate(${0})`)
    .style('position', 'absolute')
    .attr('font-weight', 'bold')
    .style('z-index', '10');


    //The battery area
    const mg = svg.append('g').attr('transform', `translate(${svgWidth/2.5},${svgHeight/1.6})`);

    this.batteryRect = mg.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr('class', 'rect')
    .attr("width", svgWidth /5)
    .attr("height", svgHeight /4)
    .attr('fill', 'url(#thermal_gradient1)' )
    .attr('stroke', colors[9] )
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', '3')
    .attr('z-index', '2');

    this.batteryText = mg.append('text')
    .text('Battery')
    .attr('font-size', '20')
    .attr('font-family', 'Agency FB')
    .attr('text-anchor', 'middle')
    .attr('opacity', '0.9')
    .attr('fill', colors[0])
    .attr('x', '3%')
    .attr('y', '3.5%')
    .attr('transform', `rotate(${0})`)
    .style('position', 'absolute')
    .attr('font-weight', 'bold')
    .style('z-index', '10');


    this.batteryFrontRect = mg.append("rect")
    .attr("x", '-1%')
    .attr("y", '16.5%')
    .attr('class', 'rect')
    .attr("width", svgWidth /25)
    .attr("height", svgHeight /12)
    .attr('fill', 'url(#thermal_gradient1)' )
    .attr('stroke', colors[9] )
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', '3')
    .attr('z-index', '2');

    this.batteryRearRect = mg.append("rect")
    .attr("x", '17%')
    .attr("y", 0)
    .attr('class', 'rect')
    .attr("width", svgWidth /25)
    .attr("height", svgHeight /12)
    .attr('fill', 'url(#thermal_gradient1)' )
    .attr('stroke', colors[9] )
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', '3')
    .attr('z-index', '2');


    //The HVAC area
    const hg = svg.append('g').attr('transform', `translate(${svgWidth/3.5},${svgHeight/3})`);

    this.hvacRect = hg.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr('class', 'rect')
    .attr("width", svgWidth /12)
    .attr("height", svgHeight /2.5)
    .attr('fill', 'url(#thermal_gradient1)' )
    .attr('stroke', colors[9] )
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', '3')
    .attr('z-index', '2');

    this.hvacText = hg.append('text')
    .text('HVAC')
    .attr('font-size', '20')
    .attr('font-family', 'Agency FB')
    .attr('text-anchor', 'middle')
    .attr('opacity', '0.9')
    .attr('fill', colors[0])
    .attr('x', '6%')
    .attr('y', '3.5%')
    .attr('transform', `rotate(${0})`)
    .style('position', 'absolute')
    .attr('font-weight', 'bold')
    .style('z-index', '10');


    //The Chller area
    const cg = svg.append('g').attr('transform', `translate(${svgWidth/6},${svgHeight/3})`);

    this.chllerRect = cg.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr('class', 'rect')
    .attr("width", svgWidth /10)
    .attr("height", svgHeight /2.5)
    .attr('fill', 'url(#thermal_gradient1)' )
    .attr('stroke', colors[9] )
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', '3')
    .attr('z-index', '2');

    this.chillerText = cg.append('text')
    .text('Chiller')
    .attr('font-size', '20')
    .attr('font-family', 'Agency FB')
    .attr('text-anchor', 'middle')
    .attr('opacity', '0.9')
    .attr('fill', colors[0])
    .attr('x', '7.5%')
    .attr('y', '3.5%')
    .attr('transform', `rotate(${0})`)
    .style('position', 'absolute')
    .attr('font-weight', 'bold')
    .style('z-index', '10');

    this.evaportatorRect = cg.append("rect")
    .attr("x", '2.5%')
    .attr("y", '10%')
    .attr('class', 'rect')
    .attr("width", svgWidth /20)
    .attr("height", svgHeight /5)
    .attr('fill', 'url(#thermal_gradient1)' )
    .attr('stroke', colors[9] )
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', '3')
    .attr('z-index', '2');

    this.evaportatorText = cg.append('text')
    .text('Evaportator')
    .attr('font-size', '20')
    .attr('font-family', 'Agency FB')
    .attr('text-anchor', 'middle')
    .attr('opacity', '0.9')
    .attr('fill', colors[0])
    .attr('x', '-10%')
    .attr('y', '11%')
    .attr('transform', `rotate(${-90})`)
    .style('position', 'absolute')
    .attr('font-weight', 'bold')
    .style('z-index', '10');


    //The charger area
    const bg = svg.append('g').attr('transform', `translate(${svgWidth/2.5},${svgHeight/1.1})`);

    this.chargerRect = bg.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr('class', 'rect')
    .attr("width", svgWidth /10)
    .attr("height", svgHeight /12)
    .attr('fill', 'url(#thermal_gradient1)' )
    .attr('stroke', colors[9] )
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', '3')
    .attr('z-index', '2');

    this.chargerText = bg.append('text')
    .text('Charger')
    .attr('font-size', '20')
    .attr('font-family', 'Agency FB')
    .attr('text-anchor', 'middle')
    .attr('opacity', '0.9')
    .attr('fill', colors[0])
    .attr('x', '5%')
    .attr('y', '5%')
    .attr('transform', `rotate(${0})`)
    .style('position', 'absolute')
    .attr('font-weight', 'bold')
    .style('z-index', '10');

  }

  setValue(value, duration) {

    
    const colors = ['#FFFFFF', '#0A0A0A',"#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00", '#212529'];
    const tempColor = ["#313695","#4575b4","#74add1","#abd9e9","#fee090","#fdae61","#f46d43","#d73027","#a50026"];
    var colorScale = d3.scaleQuantile()
    .domain([-40, 10, 216])
    .range(tempColor);

    this.winding1FrontTemperatureText.transition()
    .attr('fill',function(d){
        if(value.frontwinding1 <= 90 && value.frontwinding1 >= -20){
            return colors[1];
        }else{
            return colors[0];
        }
    })
    .text(function(d){ return value.frontwinding1 + ' ℃' })

    this.winding1FrontText.transition()
    .attr('fill',function(d){
        if(value.frontwinding1 <= 90 && value.frontwinding1 >= -20){
            return colors[1];
        }else{
            return colors[0];
        }
    })

    this.winding1FrontBox.transition()
    .duration(500)
    .attr('fill',colorScale(value.frontwinding1));

    this.winding2FrontTemperatureText.transition()
    .attr('fill',function(d){
        if(value.frontwinding2 <= 90 && value.frontwinding2 >= -20){
            return colors[1];
        }else{
            return colors[0];
        }
    })
    .text(function(d){ return value.frontwinding2 + ' ℃' });

    this.winding2FrontText.transition()
    .attr('fill',function(d){
        if(value.frontwinding2 <= 90 && value.frontwinding2 >= -20){
            return colors[1];
        }else{
            return colors[0];
        }
    })

    this.winding2FrontBox.transition()
    .duration(500)
    .attr('fill',function(d){
        if(value.frontwinding2 <= 90 && value.frontwinding2 >= -20){
            return colors[1];
        }else{
            return colors[0];
        }
    })
    .attr('fill',colorScale(value.frontwinding2));

    this.phAFrontTemperatureText.transition()
    .attr('fill',function(d){
        if(value.frontphA <= 90 && value.frontphA >= -20){
            return colors[1];
        }else{
            return colors[0];
        }
    })
    .text(function(d){ return value.frontphA + ' ℃' })

    this.phAFrontText.transition()
    .attr('fill',function(d){
        if(value.frontphA <= 90 && value.frontphA >= -20){
            return colors[1];
        }else{
            return colors[0];
        }
    })
    
    this.phAFrontBox.transition()
    .duration(500)
    .attr('fill',colorScale(value.frontphA));

    this.phBFrontTemperatureText.transition()
    .attr('fill',function(d){
        if(value.frontphB <= 90 && value.frontphB >= -20){
            return colors[1];
        }else{
            return colors[0];
        }
    })
    .text(function(d){ return value.frontphB + ' ℃' });

    this.phBFrontText.transition()
    .attr('fill',function(d){
        if(value.frontphB <= 90 && value.frontphB >= -20){
            return colors[1];
        }else{
            return colors[0];
        }
    })

    this.phBFrontBox.transition()
    .duration(500)
    .attr('fill',colorScale(value.frontphB));

    this.phCFrontTemperatureText.transition()
    .attr('fill',function(d){
        if(value.frontphC <= 90 && value.frontphC >= -20){
            return colors[1];
        }else{
            return colors[0];
        }
    })
    .text(function(d){ return value.frontphC + ' ℃' });

    this.phCFrontText.transition()
    .attr('fill',function(d){
        if(value.frontphC <= 90 && value.frontphC >= -20){
            return colors[1];
        }else{
            return colors[0];
        }
    })

    this.phCFrontBox.transition()
    .duration(500)
    .attr('fill',colorScale(value.frontphC));

    this.coolantFrontTemperatureText.transition()
    .attr('fill',function(d){
        if(value.frontcoolant <= 90 && value.frontcoolant >= -20){
            return colors[1];
        }else{
            return colors[0];
        }
    })
    .text(function(d){ return value.frontcoolant + ' ℃' });

    this.coolantFrontText.transition()
    .attr('fill',function(d){
        if(value.frontcoolant <= 90 && value.frontcoolant >= -20){
            return colors[1];
        }else{
            return colors[0];
        }
    })

    this.coolantFrontBox.transition()
    .duration(500)
    .attr('fill',colorScale(value.frontcoolant));

    this.winding1RearTemperatureText.transition()
    .attr('fill',function(d){
        if(value.rearwinding1 <= 90 && value.rearwinding1 >= -20){
            return colors[1];
        }else{
            return colors[0];
        }
    })
    .text(function(d){ return value.rearwinding1 + ' ℃' })

    this.winding1RearText.transition()
    .attr('fill',function(d){
        if(value.rearwinding1 <= 90 && value.rearwinding1 >= -20){
            return colors[1];
        }else{
            return colors[0];
        }
    })

    this.winding1RearBox.transition()
    .duration(500)
    .attr('fill',colorScale(value.rearwinding1));

    this.winding2RearTemperatureText.transition()
    .attr('fill',function(d){
        if(value.rearwinding2 <= 90 && value.rearwinding2 >= -20){
            return colors[1];
        }else{
            return colors[0];
        }
    })
    .text(function(d){ return value.rearwinding2 + ' ℃' });

    this.winding2RearText.transition()
    .attr('fill',function(d){
        if(value.rearwinding2 <= 90 && value.rearwinding2 >= -20){
            return colors[1];
        }else{
            return colors[0];
        }
    })

    this.winding2RearBox.transition()
    .duration(500)
    .attr('fill',colorScale(value.rearwinding2));

    this.phARearTemperatureText.transition()
    .attr('fill',function(d){
        if(value.rearphA <= 90 && value.rearphA >= -20){
            return colors[1];
        }else{
            return colors[0];
        }
    })
    .text(function(d){ return value.rearphA + ' ℃' })

    this.phARearText.transition()
    .attr('fill',function(d){
        if(value.rearphA <= 90 && value.rearphA >= -20){
            return colors[1];
        }else{
            return colors[0];
        }
    })

    this.phARearBox.transition()
    .duration(500)
    .attr('fill',colorScale(value.rearphA));

    this.phBRearTemperatureText.transition()
    .attr('fill',function(d){
        if(value.rearphB <= 90 && value.rearphB >= -20){
            return colors[1];
        }else{
            return colors[0];
        }
    })
    .text(function(d){ return value.rearphB + ' ℃' });

    this.phBRearText.transition()
    .attr('fill',function(d){
        if(value.rearphB <= 90 && value.rearphB >= -20){
            return colors[1];
        }else{
            return colors[0];
        }
    })

    this.phBRearBox.transition()
    .duration(500)
    .attr('fill',colorScale(value.rearphB));

    this.phCRearTemperatureText.transition()
    .attr('fill',function(d){
        if(value.rearphC <= 90 && value.rearphC >= -20){
            return colors[1];
        }else{
            return colors[0];
        }
    })
    .text(function(d){ return value.rearphC + ' ℃' });

    this.phCRearText.transition()
    .attr('fill',function(d){
        if(value.rearphC <= 90 && value.rearphC >= -20){
            return colors[1];
        }else{
            return colors[0];
        }
    })

    this.phCRearBox.transition()
    .duration(500)
    .attr('fill',colorScale(value.rearphC));

    this.coolantRearTemperatureText.transition()
    .attr('fill',function(d){
        if(value.rearcoolant <= 90 && value.rearcoolant >= -20){
            return colors[1];
        }else{
            return colors[0];
        }
    })
    .text(function(d){ return value.rearcoolant + ' ℃' });

    this.coolantRearText.transition()
    .attr('fill',function(d){
        if(value.rearcoolant <= 90 && value.rearcoolant >= -20){
            return colors[1];
        }else{
            return colors[0];
        }
    })

    this.coolantRearBox.transition()
    .duration(500)
    .attr('fill',colorScale(value.rearcoolant));
  }

  render() {
    return (
     <div class="thermal center-block"></div>
     )
  }
}
