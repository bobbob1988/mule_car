    import React, { Component } from 'react';
    import { Observable } from 'rxjs/Observable';
    import 'rxjs/add/observable/interval';
    import 'rxjs/add/operator/timeInterval';
    import * as d3 from "d3";
    import * as d3ScaleChromatic from 'd3-scale-chromatic';
    import { scaleSqrt, scaleThreshold, select, arc, scaleLinear, interpolate, scaleLog, line, polyline, range, easeCubicInOut, easeCircle} from 'd3';
    import styles from './OTA.css';

    import axios from 'axios';
    import * as THREE from 'three';
    //Correct the style loader to match the webpack
    import '!style-loader!css-loader!bootstrap/dist/css/bootstrap.css';
    //import * as ReactBootstrap from 'react-bootstrap';
    import { Container, Row, Col, ButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap';

    import ProgressArc from './Progress';

    export default class OTAMain extends Component {

     constructor(){
        super();
        this.toggle = this.toggle.bind(this);
        this.toggleFile = this.toggleFile.bind(this);
        this.select = this.select.bind(this);
        this.state = { 
          teams: [],
          selectedVersion: "",
          validationError: "",
          dropdownOpen: false,
          dropdownOpenFile: false,
          percentComplete: 1
      };
    }

    componentDidMount() {
        fetch("http://10.21.32.153:8199/repoFileNames?repoName=powertrain")
        .then((response) => {
            //console.log(response.json())
            return response.json();
        })
        .then(data => {
            //console.log(data)
            let teamsFromApi = data.nexusFiles.map(team => { 
                //console.log(team)
                return {value: team.releaseVersion, display: team.releaseVersion, fileName: team.fileName, location: team.location} })
            this.setState({ teams: [{value: '', display: '(Select your version)'}].concat(teamsFromApi) });
        }).catch(error => {
            console.log(error);
        });
    }

    handleClick = (param) => (e) => { 
      console.log('Event', e);
      console.log('Parameter', param);
      fetch("http://10.21.71.39:8000/ADAS/nexus_data/download", {
        method: 'post',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({versionNumber: param, str: 'Some string: &=&'})
    })
     .then((resp) => {
        return resp.json()
    }) 
     .then((data) => {
        console.log(data)                    
    })
     .catch((error) => {
        console.log(error, "catch the hoop")
    })
    }

    handleClickFile = () => (e) => { 

    fetch("http://10.21.32.153:8199/zipFileInfo?releaseVersion=" + this.state.selectedVersion, {
        method: 'get'
    })
     .then((resp) => {
        return resp.json()
    }) 
     .then((data) => {
        console.log('data', data)
       let fileFromApi = data.srec_config.map(file => { 
        console.log(file)
        return {value: file.BMS} }) 
        this.setState({ teams: [{value: '', display: '(Select your version)'}].concat(teamsFromApi) });          
    })
     .catch((error) => {
        console.log(error, "catch the hoop")
    })
    }

    toggle() {
        this.setState({
          dropdownOpen: !this.state.dropdownOpen
        });
      }

    toggleFile() {
        this.handleClickFile()
        this.setState({
          dropdownOpenFile: !this.state.dropdownOpenFile
        });
      }

    select(event) {

        this.setState({
              dropdownOpen: !this.state.dropdownOpen,
              selectedVersion: event.target.innerText
        });    

      }


    render() {
        return (
          <div>
           <Container>
           <Row>
           <Col xs="6" sm="4">
           <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
            <DropdownToggle caret size="md">{this.state.selectedVersion}</DropdownToggle>
            <DropdownMenu modifiers={{setMaxHeight: {enabled: true,order: 890,fn: (data) => {return {...data,styles: {...data.styles,overflow: 'auto',maxHeight: 300,},};},},}}>
              {this.state.teams.map((team) => <DropdownItem key={team.value} value={team.value} onClick={this.select}>{team.display}</DropdownItem>)}
            </DropdownMenu>
          </ButtonDropdown>
           </Col>
           <Col xs="6" sm="4">
           <ButtonDropdown isOpen={this.state.dropdownOpenFile} toggle={this.handleClickFile(this.state.selectedVersion)}>
            <DropdownToggle caret size="md">{this.state.selectedVersion}</DropdownToggle>
            <DropdownMenu modifiers={{setMaxHeight: {enabled: true,order: 890,fn: (data) => {return {...data,styles: {...data.styles,overflow: 'auto',maxHeight: 300,},};},},}}>
              {this.state.teams.map((team) => <DropdownItem key={team.value} value={team.value} onClick={this.handleClickFile(this.state.selectedVersion)}>{team.display}</DropdownItem>)}
            </DropdownMenu>
          </ButtonDropdown>
           </Col>
           </Row>
           <Row>
            <Col xs="12" sm="12">
            <ProgressArc
          height={300}
          width={300}
          innerRadius={100}
          outerRadius={110}
          id="d3-arc"
          backgroundColor="#e6e6e6"
          foregroundColor="#00ff00"
          percentComplete={this.state.percentComplete} />
            </Col>
           </Row>
           </Container>
            </div>

            )
        }

    }
