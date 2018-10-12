  import React, { Component } from 'react';
  import { Observable } from 'rxjs/Observable';
  import 'rxjs/add/observable/interval';
  import 'rxjs/add/operator/timeInterval';
  import * as d3 from "d3";
  import * as d3ScaleChromatic from 'd3-scale-chromatic';
  import { scaleSqrt, scaleThreshold, select, arc, scaleLinear, interpolate, scaleLog, line, polyline, range, easeCubicInOut, easeCircle} from 'd3';
  import styles from './lidar.css';
  import * as THREE from 'three';
  import Stats from 'stats.js';

  import OrbitControls from 'orbit-controls-es6';

  const HEIGHT_COLOR_MAPPING = {
    0.5: 0xFF0000,
    1.0: 0xFF7F00,
    1.5: 0xFFFF00,
    2.0: 0x00FF00,
    2.5: 0x0000FF,
    3.0: 0x4B0082,
    10.0: 0x9400D3,
  };

  let stats = new Stats();

  export default class Lidar extends Component {
    constructor() {
      super();

      this.state = {
        vertices:[],
        seq:0
      };

      this.points = null;
      this.initialized = false;
    }


//     websocketConnection(){
//       //const self = this;

//       const ws_url = "ws://192.168.50.141:8676"
//       const ws_position = new WebSocket(ws_url);

//       ws_position.onopen = () => {
//         console.log('Position Connection Open');
//       }

//       ws_position.onmessage = (msg) => {
//         console.log('Position Message')
//         const response = JSON.parse(msg.data)

//         if (response.lidar) {
//           var points_array = response.lidar.lidar_points
//           var vertices = []
//           for ( var i = 0; i < points_array.length; i ++ ) {
//             var x = points_array[i][0] ;
//             var y = points_array[i][1] ;
//             var z = points_array[i][2] ;
//             vertices.push( x, y, z );
//           }
//           this.setState({
//            vertices: vertices
//          });
//       //console.log(vertices)

//     }
//   }

//   ws_position.onerror = (e) => {
//     console.log(e.message);
//   }

//   ws_position.onclose = (e) => {
//     console.log('Position Connection Closed');
//   }

// }

componentDidMount() {

  const self = this;
  //Temperory disable for the test use
  // self.websocketConnection();

  const width = this.mount.clientWidth
  const height = this.mount.clientHeight
  //ADD SCENE
  this.scene = new THREE.Scene()
  //ADD CAMERA
  // this.camera = new THREE.PerspectiveCamera(
  //   75,
  //   width / height,
  //   0.1,
  //   2000
  //   )
  // this.camera.position.z = 60
  this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
  this.camera.position.set( 0, 0, 80);

  this.camera.lookAt(this.scene.position);
  //ADD RENDERER
  this.renderer = new THREE.WebGLRenderer({ antialias: true })
  this.renderer.setClearColor('#000000')
  this.renderer.setSize(width, height)
  this.mount.appendChild(this.renderer.domElement)
  this.mount.appendChild(stats.dom );

  this.controls = new OrbitControls(this.camera, this.renderer.domElement );
        // //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
  this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  this.controls.dampingFactor = 0.5;
  this.controls.screenSpacePanning = false;
  this.controls.minDistance = 20;
  this.controls.maxDistance = 500;
  this.controls.maxPolarAngle = Math.PI;

  // //ADD CUBE
  // const geometry = new THREE.BoxGeometry(1, 1, 1)
  // const material = new THREE.MeshBasicMaterial({ color: '#433F81'     })
  // this.cube = new THREE.Mesh(geometry, material)
  this.initialize()
  this.scene.add(this.points)
  this.start()
}

componentWillUpdate(nextProps) {
  //console.log('current', nextProps)
  if(this.props.value.seq !== nextProps.value.seq){
    if(nextProps.value.vertices.length > 0){

      //console.log('prev', this.props.value)
      //console.log('state', nextProps.value)

     //console.log('next seq:', nextProps.value.seq)
     //this.setState({seq: this.props.value.seq})
     //this.renderScene()
     this.updateBuffer(nextProps.value.vertices)
     //this.update(nextProps.value.vertices)
   }
 }
}

componentWillUnmount(){
  this.stop()
  this.mount.removeChild(this.renderer.domElement)
}

start = () => {
  if (!this.frameId) {
    this.frameId = requestAnimationFrame(this.animate)
  }
}

stop = () => {
  cancelAnimationFrame(this.frameId)
}



animate = () => {
  //console.log('state', this.state)
  // if(this.state.vertices.length > 0){

  // //this.update(this.state.vertices)
  //  this.updateBuffer(this.state.vertices)
  //  console.log('animate')
  //  }
  //  //console.log('points', this.points)
  //this.updateBuffer(this.state.vertices)
  //console.log('animate333333333333333333333')
  this.renderScene()
  this.frameId = window.requestAnimationFrame(this.animate)
  this.controls.update();
  stats.update()
}

renderScene = () => {
  this.renderer.render(this.scene, this.camera)
  //console.log('render')
}

initialize() {
  this.points = this.createPointCloudBuffer(HEIGHT_COLOR_MAPPING[0.5]);
  //this.points = this.createPointCloud(HEIGHT_COLOR_MAPPING[0.5]);
  this.initialized = true;
}

createPointCloud(hex_color) {
  const geometry = new THREE.Geometry();
  const colors = [];
  for (let i = 0; i < 100000; ++i) {
    const vertex = new THREE.Vector3();
    vertex.set(0, 0, -10);
    geometry.vertices.push(vertex);

    colors[i] = new THREE.Color(hex_color);
  }
  geometry.colors = colors;

  const material = new THREE.PointsMaterial({
    size: 0.015,
    transparent: true,
    opacity: 0.7,
    vertexColors: THREE.VertexColors
  });
  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  return points;
}

createPointCloudBuffer(hex_color) {
  const geometry = new THREE.BufferGeometry();
  const colors = [];
  var vertex = [];
  var color = new THREE.Color();
  for (let i = 0; i < 100000; ++i) {
    vertex.push(0);
    vertex.push(0);
    vertex.push(-10);

    color.setHSL( 0, 250, 0 );
    colors.push( color.r, color.g, color.b );
    //colors[i] = new THREE.Color(hex_color);
  }
  geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( vertex, 3 ) );
  geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

  const material = new THREE.PointsMaterial({
    size: 0.015,
    transparent: true,
    opacity: 0.9,
    vertexColors: THREE.VertexColors
  });
  const points = new THREE.Points(geometry, material);
  //points.frustumCulled = false;
  return points;
}

update(pointCloud) {
  //console.log('points',this.points)
  if (this.points === null) {
    return;
  }
  if (pointCloud.length % 3 !== 0) {
    console.warn('PointCloud length should be multiples of 3!');
    return;
  }
  const pointCloudSize = pointCloud.length / 3;
  //console.log('length',pointCloudSize)
  const total = (pointCloudSize < 100000) ? pointCloudSize : 100000;
  let color_key = 0.5;
  for (let i = 0; i < total; i++) {
    const x = pointCloud[i*3];
    const y = pointCloud[i*3 + 1];
    const z = pointCloud[i*3 + 2];
    this.points.geometry.vertices[i].set(x, y, z + 0.8);
          // Update color based on height.
          if (z < 0.5) {
            color_key = 0.5;
          } else if (z < 1.0) {
            color_key = 1.0;
          } else if (z < 1.5) {
            color_key = 1.5;
          } else if (z < 2.0) {
            color_key = 2.0;
          } else if (z < 2.5) {
            color_key = 2.5;
          } else if (z < 3.0) {
            color_key = 3.0;
          } else {
            color_key = 10.0;
          }
          this.points.geometry.colors[i].setHex(HEIGHT_COLOR_MAPPING[color_key]);
        }
      // Hide unused points.
      for (let i = total; i < 100000; ++i) {
        this.points.geometry.vertices[i].set(0, 0, -10);
      }
      this.points.geometry.verticesNeedUpdate = true;
      this.points.geometry.colorsNeedUpdate = true;
      //console.log('camera.x', this.camera.position.x)
      this.points.position.set(this.camera.position.x, this.camera.position.y, this.camera.position.z);
      // this.points.rotation.set(0, 0, adcMesh.rotation.y);
    }

  updateBuffer(pointCloud) {
  //console.log('this seq:',this.state.seq)
  if (this.points === null) {
    return;
  }
  if (pointCloud.length % 3 !== 0) {
    console.warn('PointCloud length should be multiples of 3!');
    return;
  }
  const pointCloudSize = pointCloud.length / 3;
  //console.log('length',pointCloudSize)
  const total = (pointCloudSize < 100000) ? pointCloudSize : 100000;
  //console.log('points', this.points)
  var positions = this.points.geometry.attributes.position.array;
  var colors = this.points.geometry.attributes.color.array;
  //console.log('length:', positions.length)
  for (let i = 0; i < total; i++) {
    const x = pointCloud[i*3];
    const y = pointCloud[i*3 + 1];
    const z = pointCloud[i*3 + 2];
    positions[i*3] = x;
    positions[i*3 + 1] = y;
    positions[i*3 + 2] = z + 0.8;
    if (z < 0.5) {
     colors[i*3] = 255;
     colors[i*3 + 1] = 0;
     colors[i*3 + 2] = 0;
   } else if (z < 1.0) {
     colors[i*3] = 255;
     colors[i*3 + 1] = 127;
     colors[i*3 + 2] = 0;
   } else if (z < 1.5) {
     colors[i*3] = 255;
     colors[i*3 + 1] = 255;
     colors[i*3 + 2] = 0;
   } else if (z < 2.0) {
     colors[i*3] = 0;
     colors[i*3 + 1] = 255;
     colors[i*3 + 2] = 0;
   } else if (z < 2.5) {
     colors[i*3] = 0;
     colors[i*3 + 1] = 0;
     colors[i*3 + 2] = 255;
   } else if (z < 3.0) {
     colors[i*3] = 75;
     colors[i*3 + 1] = 0;
     colors[i*3 + 2] = 130;
   } else {
     colors[i*3] = 148;
     colors[i*3 + 1] = 0;
     colors[i*3 + 2] = 211;
   }
 }

 for (let i = total; i < 100000; ++i) {
  positions[i*3] = 0;
  positions[i*3 + 1] = 0;
  positions[i*3 + 2] = -10;
}
this.points.geometry.attributes.position.needsUpdate = true;
this.points.geometry.attributes.color.needsUpdate = true;

  // var time = Date.now() * 0.001
  // this.points.rotation.x = time * 0.025;
  // this.points.rotation.y = time * 0.5;
      //this.points.position.set(this.camera.position.x, this.camera.position.y, this.camera.position.z);
      // this.points.rotation.set(0, 0, adcMesh.rotation.y);
    }

    render() {
      return (
       <div
       style={{ width: '1200px', height: '700px' }}
       ref={(mount) => { this.mount = mount }}
       />
       )
    }
  }
