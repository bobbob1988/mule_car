  import React, { Component } from 'react';
  import { Observable } from 'rxjs/Observable';
  import 'rxjs/add/observable/interval';
  import 'rxjs/add/operator/timeInterval';

  import Lidar from './lidar'

  //import * as redis from 'redis';
  //var client = redis.createClient();

  export default class lidarWebsocket extends Component {
    constructor() {
      super();
      //this.websocketConnection = this.websocketConnection.bind(this);
      //this.update = this.update.bind(this);
      this.state = {
        vertices:[]
      };
      this.updateInterval = 100;
    }

    updateStatus(){
      const self = this;
      client.get('lidar', function(err, result){
        var data = JSON.parse(result);
        //console.log(data)
        self.setState({
           vertices: data.lidar_points
         });
      });

      //console.log(self.state);
    }


    websocketConnection(){
      //const self = this;

      const ws_url = "ws://192.168.50.141:8675"
      const ws_position = new WebSocket(ws_url);

      ws_position.onopen = () => {
        console.log('Position Connection Open');
      }

      ws_position.onmessage = (msg) => {
        //console.log('Position Message')
        const response = JSON.parse(msg.data)
        //console.log('msg',msg.data)

        if (response.lidar) {
          var points_array = response.lidar.lidar_points
          // var vertices = []
          // for ( var i = 0; i < points_array.length; i ++ ) {
          //   var x = points_array[i][0] ;
          //   var y = points_array[i][1] ;
          //   var z = points_array[i][2] ;
          //   vertices.push( x, y, z );
          // }
          this.setState({
           vertices: points_array
         });
      //console.log(vertices)

    }
  }

  ws_position.onerror = (e) => {
    console.log(e.message);
  }

  ws_position.onclose = (e) => {
    console.log('Position Connection Closed');
  }

}

componentDidMount() {

  const self = this;
  //Temperory disable for the test use
  //self.websocketConnection();
  self.updateStatus();
  self.intervalId = setInterval(self.updateStatus.bind(self), self.updateInterval);

}

componentDidUpdate() {

}

componentWillUnmount(){
  clearInterval(this.intervalId);
  
}


render() {
    return (
       <div>
       <Lidar value={this.state} />
       </div>
       )
    }
  }