import React from 'react';
import { render } from 'react-dom';
import { HashRouter } from 'react-router-dom';
import App from './components/App';

import 'src/assets/stylesheets/base.scss';
import 'src/assets/stylesheets/creative.scss';
import 'src/assets/vendor/bootstrap/css/bootstrap.min.css';
import 'src/assets/css/creative.min.css';
import 'src/assets/vendor/font-awesome/css/font-awesome.min.css';

render((
  <HashRouter>
    <App />
  </HashRouter>
), document.getElementById('root'));



