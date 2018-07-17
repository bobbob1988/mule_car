import React, { Component } from 'react';
import Battery from '../components/battery/battery.js';

type Props = {};

export default class BatteryPage extends Component<Props> {
    props: Props;

    render() {
        return <Battery />;
    }
}

