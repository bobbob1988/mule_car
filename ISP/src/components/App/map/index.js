import React, { Component } from 'react';
import Iframe from 'react-iframe';

const MapIFrame = () => ( 
<Iframe url="../map/map.html"
            position="absolute"
            width="100%"
            id="myId"
            className="myClassname"
            height="100%"
            allowFullScreen/>
)

export default MapIFrame