import React from "react"
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"

const car_svg = "M45.961,18.702c-0.033-0.038-0.061-0.075-0.1-0.112l-1.717-1.657c1.424-0.323,2.957-1.516,2.957-2.74   c0-1.426-1.979-1.932-3.668-1.932c-1.766,0-1.971,1.21-1.992,2.065l-4.43-4.271c-0.9-0.891-2.607-1.592-3.883-1.592H24.5h-0.002   h-8.63c-1.275,0-2.981,0.701-3.882,1.592l-4.429,4.271c-0.023-0.855-0.228-2.065-1.992-2.065c-1.691,0-3.669,0.506-3.669,1.932   c0,1.224,1.534,2.417,2.958,2.74l-1.717,1.657c-0.039,0.037-0.066,0.074-0.1,0.112C1.2,20.272,0,23.184,0,25.297v6.279   c0,1.524,0.601,2.907,1.572,3.938v2.435c0,1.424,1.192,2.585,2.658,2.585h3.214c1.466,0,2.657-1.159,2.657-2.585v-0.623h14.397   H24.5h14.396v0.623c0,1.426,1.19,2.585,2.658,2.585h3.213c1.467,0,2.657-1.161,2.657-2.585v-2.435   c0.972-1.031,1.572-2.414,1.572-3.938v-6.279C48.998,23.184,47.798,20.272,45.961,18.702z M13.613,11.953   c0.623-0.519,1.712-0.913,2.255-0.913h8.63H24.5h8.63c0.543,0,1.632,0.394,2.255,0.913l5.809,5.63H24.5h-0.002H7.805L13.613,11.953   z M1.993,24.347c0-1.546,1.21-2.801,2.704-2.801c1.493,0,6.372,2.864,6.372,4.41s-4.879,1.188-6.372,1.188   C3.203,27.144,1.993,25.894,1.993,24.347z M10.102,34.573H9.587H9.072l-3.055,0.005c-0.848-0.264-1.446-0.572-1.869-0.903   c-0.214-0.167-0.378-0.341-0.506-0.514c-0.129-0.175-0.223-0.347-0.284-0.519c-0.38-1.074,0.405-2.061,0.405-2.061h5.214   l3.476,3.99L10.102,34.573L10.102,34.573z M31.996,34.575H24.5h-0.002h-7.496c-1.563,0-2.832-1.269-2.832-2.831h10.328H24.5h10.328   C34.828,33.308,33.559,34.575,31.996,34.575z M32.654,29.812H24.5h-0.002h-8.154c-1.7,0-3.08-2.096-3.08-4.681h11.234H24.5h11.234   C35.734,27.717,34.354,29.812,32.654,29.812z M45.641,32.644c-0.062,0.172-0.156,0.344-0.285,0.518   c-0.127,0.173-0.291,0.347-0.506,0.514c-0.422,0.331-1.021,0.641-1.869,0.903l-3.055-0.005h-0.515h-0.515h-2.353l3.478-3.99h5.213   C45.234,30.583,46.02,31.568,45.641,32.644z M44.301,27.144c-1.492,0-6.371,0.356-6.371-1.188s4.879-4.41,6.371-4.41   c1.494,0,2.704,1.255,2.704,2.801C47.005,25.892,45.795,27.144,44.301,27.144z";

const car_icon = {
  path: car_svg,
  scale: .6,
  strokeColor: 'blue',
  strokeWeight: .10,
  fillOpacity: 1,
  fillColor: "#EAECEE",
  offset: '5%',
};

const dark_map_styles = [
        {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
        {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
        {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
        {
          featureType: 'administrative.locality',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'poi',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry',
          stylers: [{color: '#263c3f'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'labels.text.fill',
          stylers: [{color: '#6b9a76'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{color: '#38414e'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry.stroke',
          stylers: [{color: '#212a37'}]
        },
        {
          featureType: 'road',
          elementType: 'labels.text.fill',
          stylers: [{color: '#9ca5b3'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [{color: '#746855'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [{color: '#1f2835'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'labels.text.fill',
          stylers: [{color: '#f3d19c'}]
        },
        {
          featureType: 'transit',
          elementType: 'geometry',
          stylers: [{color: '#2f3948'}]
        },
        {
          featureType: 'transit.station',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{color: '#17263c'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [{color: '#515c6d'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.stroke',
          stylers: [{color: '#17263c'}]
        }
];

const GMapComponent = withScriptjs(withGoogleMap((props) =>
  <GoogleMap
    zoom={props.zoom}
    center={props.center}
    ref={(map) => map && map.panTo(props.center)}
    defaultOptions={{ styles: dark_map_styles }}
  >
    {<Marker position={props.center} onClick={props.onMarkerClick} icon={car_icon}/>}
  </GoogleMap>
))

class GoogleMapComponent extends React.PureComponent {
  state = {
    center: { lat: 37.380221, lng: -121.9822608 },
    zoom: 15
  }

  constructor() {
    super();
    this.updateInterval = 1000;
    this.i = 1;
  }

  handleMarkerClick = () => {
    console.log("HANDLE MARKER CLICK");
  }
  
  updateLocation() {
    const self = this;
    navigator.geolocation.getCurrentPosition(function success(position){
      //console.log(position);
      self.setState({center: {lat: position.coords.latitude, lng: position.coords.longitude}});
    }, function error(err){
      console.log("Cannot get current location!");
      console.log(err);
    });
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  componentDidMount() {
    const self = this;
    navigator.geolocation.getCurrentPosition(function success(position){
      self.setState({center: {lat: position.coords.latitude, lng: position.coords.longitude}});
    }, function error(err){
      console.log("Cannot get current location!");
      console.log(err);
    });
    self.intervalId = setInterval(self.updateLocation.bind(self), self.updateInterval);
  }

  render() {
    let googleMapURL= "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=" + process.env.GOOGLE_API_KEY;
    return (
      <GMapComponent 
        googleMapURL={ googleMapURL }
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `640px` }} />}
        mapElement={<div style={{ marginTop: `30px`, height: `100%` }} />}
        zoom={this.state.zoom}
        center={this.state.center}
        onMarkerClick={this.handleMarkerClick}
      />
    )
  }
}

export default GoogleMapComponent;