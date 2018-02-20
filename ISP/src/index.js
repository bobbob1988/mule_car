import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

import 'src/assets/stylesheets/base.scss';
import 'src/assets/stylesheets/creative.scss';
import 'src/assets/vendor/bootstrap/css/bootstrap.min.css';
import 'src/assets/css/creative.min.css';
import 'src/assets/vendor/font-awesome/css/font-awesome.min.css';

const element = <App />;

ReactDOM.render(
	element,
	document.getElementById('root')
);



