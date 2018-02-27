import React, { Component } from 'react';
import { Router } from 'react-router-dom';

import Dashboard from './dashboard';
import Mainpanel from './mainpanel';
import Menu from './menu';

export default class App extends Component {
	render() {
		return (
		<div>
			<div class="row">
				  <Dashboard />
			    <div class="col col-lg-8 col-md-6">
			      <Mainpanel />
                </div>
		   </div>
		   <Menu />
		</div>
		);
	}
}
