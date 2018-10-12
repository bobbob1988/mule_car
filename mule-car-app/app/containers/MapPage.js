import React, { Component } from 'react';
import GoogleMap from '../components/googlemap';

type Props = {};

export default class MapPage extends Component<Props> {
    props: Props;

    render() {
        return <GoogleMap />;
    }
}

