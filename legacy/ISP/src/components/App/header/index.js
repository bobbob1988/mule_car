import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => (

  <div class="container-fluid">
   <div class="row">
    <div  class="col-lg-4 col-md-4 text-left" >
      <i class="fa fa-2x text-primary mb-2 sr-icons"></i>
    </div>
    <div  class="col-lg-4 col-md-4 text-center" >
      <h2 class="navbar-brand js-scroll-trigger text-primary" href="#page-top"></h2>
      <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    </div>
    <div  class="col-lg-4 col-md-4 text-right">
      <i class="fa fa-2x fa-battery-full text-primary mb-2 sr-icons"></i>
    </div>
    <div class="collapse navbar-collapse" id="navbarResponsive">
    </div>
  </div>
</div>

)

export default Header