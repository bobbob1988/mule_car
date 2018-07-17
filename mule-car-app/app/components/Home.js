// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.css';
import Menu from './menu';
import Mainpanel from './mainpanel';
import Dashboard from './dashboard';

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    return (
      <div>
        <div className="row">
            <Dashboard />
            <div className="col col-lg-8 col-md-6">
                <Mainpanel />
            </div>
        </div>
        <Menu />
      </div>
    );
  }
}
