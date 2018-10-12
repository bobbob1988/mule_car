import React,  { Component } from 'react';
import { select, arc, scaleLinear, interpolate, scaleLog, line, range, easeCubicInOut, easeCircle } from 'd3';
import * as d3 from 'd3';

export default class ProgressArc extends Component {

	constructor() {
		super();
    //this.updateInterval = 1000;
    this.state = {

    };
}

componentDidMount() {
	this.generate();

}

componentWillUpdate() {

}

componentWillUnmount() {

}

generate() {

	const parent = d3.select('.widget')
	const size = parent.node().getBoundingClientRect()
	const svg = parent.append('svg')
	.attr('width', size.width)
	.attr('height', size.height);
	const outerRadius = Math.min(size.width, size.height) * 0.45;
	const thickness = 10;
	let value = 0;

	const mainArc = d3.arc()
	.startAngle(0)
	.endAngle(Math.PI * 2)
	.innerRadius(outerRadius-thickness)
	.outerRadius(outerRadius)

	svg.append("path")
	.attr('class', 'progress-bar-bg')
	.attr('transform', `translate(${size.width/2},${size.height/2})`)
	.attr('d', mainArc())

	const mainArcPath = svg.append("path")
	.attr('class', 'progress-bar')
	.attr('transform', `translate(${size.width/2},${size.height/2})`)

	svg.append("circle")
	.attr('class', 'progress-bar')
	.attr('transform', `translate(${size.width/2},${size.height/2-outerRadius+thickness/2})`)
	.attr('width', thickness)
	.attr('height', thickness)
	.attr('r', thickness/2)

	const end = svg.append("circle")
	.attr('class', 'progress-bar')
	.attr('transform', `translate(${size.width/2},${size.height/2-outerRadius+thickness/2})`)
	.attr('width', thickness)
	.attr('height', thickness)
	.attr('r', thickness/2)

	let percentLabel = svg.append("text")
	.attr('class', 'progress-label')
	.attr('transform', `translate(${size.width/2},${size.height/2})`)
	.text('0')

}

render() {
	return (
		<div className="widget"></div>
		)
	}
}