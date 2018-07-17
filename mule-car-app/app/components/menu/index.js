import React from 'react'
import { Link } from 'react-router-dom'

import electric from '../../../resources/images/battery_vehicle.svg';
import vehicle from '../../../resources/images/car-side.svg';
import map from '../../../resources/images/map.svg';
import thermal from '../../../resources/images/car-heating.svg';
import grid from '../../../resources/css/bootstrap-grid.css';

const Menu = () => (
 <section className="bg-black text-white">
  <div className="container-fluid text-center">
  	<div className= "row">
  	 <div className="col col-lg-4 col-md-6">
  	  <div className="container-fluid text-center">
  	   <div className = "row">
  	 	<div className = "col">
  	 	 <Link to="/settings"><i className="fa fa-3x mb-2 sr-icons"><img height="48" width="48" src={vehicle}></img></i></Link>
  	 	</div>
  	   </div>
  	  </div>
  	 </div>
  	 <div className="col col-lg-8 col-md-6">
  	 <div className="container-fluid text-center">
  	 <div className = "row">
  	   <div className="col col-lg-4 col-md-4">
  	 	<Link to="/map"><i className="fa fa-3x mb-2 sr-icons"><img height="40" width="40" src={map}></img></i></Link>
  	   </div>
  	   <div className="col col-lg-4 col-md-4">	
    	<Link to="/battery"><i className="fa fa-3x mb-2 sr-icons"><img height="40" width="40" src={electric}></img></i></Link>
       </div>
       <div className="col col-lg-4 col-md-4">	
    	<Link to="/thermal"><i className="fa fa-3x mb-2 sr-icons"><img height="40" width="40" src={thermal}></img></i></Link>
       </div>
      </div>
  	 </div>
  	</div>
  	</div>
  </div>
 </section>
)

export default Menu
