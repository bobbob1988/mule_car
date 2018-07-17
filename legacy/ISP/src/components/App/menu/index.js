import React from 'react'
import { Link } from 'react-router-dom'

import electric from '../../../assets/images/battery_vehicle.svg';
import vehicle from '../../../assets/images/car-side.svg';
import map from '../../../assets/images/map.svg';
import thermal from '../../../assets/images/car-heating.svg';

const Menu = () => (
 <section class="bg-black text-white">
  <div class="container-fluid text-center">
  	<div class= "row">
  	 <div class="col col-lg-4 col-md-6">
  	  <div class="container-fluid text-center">
  	   <div class = "row">
  	 	<div class = "col">
  	 	 <Link to="/map"><i class="fa fa-3x mb-2 sr-icons"><img height="48" width="48" src={vehicle}></img></i></Link>
  	 	</div>
  	   </div>
  	  </div>
  	 </div>
  	 <div class="col col-lg-8 col-md-6">
  	 <div class="container-fluid text-center">
  	 <div class = "row">
  	   <div class="col col-lg-4 col-md-4">
  	 	<Link to="/map"><i class="fa fa-3x mb-2 sr-icons"><img height="40" width="40" src={map}></img></i></Link>
  	   </div>
  	   <div class="col col-lg-4 col-md-4">	
    	<Link to="/battery"><i class="fa fa-3x mb-2 sr-icons"><img height="40" width="40" src={electric}></img></i></Link>
       </div>
       <div class="col col-lg-4 col-md-4">	
    	<Link to="/thermal"><i class="fa fa-3x mb-2 sr-icons"><img height="40" width="40" src={thermal}></img></i></Link>
       </div>
      </div>
  	 </div>
  	</div>
  	</div>
  </div>
 </section>
)

export default Menu