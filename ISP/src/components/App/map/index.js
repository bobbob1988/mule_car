import React, { Component } from 'react';
import Iframe from 'react-iframe';

const MapIFrame = () => ( 
<Iframe url="../map/map.html"
            position="absolute"
            width="98.5%"
            id="myId"
            className="myClassname"
            height="99%"
            allowFullScreen/>
)

export default MapIFrame