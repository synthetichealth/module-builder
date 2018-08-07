import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import './LoadModule.css';
import {generateDOT} from '../../utils/graphviz';

class LoadModule extends Component {

  constructor(props) {
    super(props)
    this.state = {json: '', selectedOption: 'core'}
  }

  loadModule = (json) => {
    try {
      let module = JSON.parse(json)

      if(module.name === undefined){
        throw new Error('Module must have a name.')
      }

      if(module.states === undefined || Object.keys(module.states).length === 0){
        throw new Error('Module must have at least one state.')
      }

      // this will throw an error if the module is incomprehensible
      let dot = generateDOT(module);

      this.props.newModule(module)
      this.setState({...this.state, json: '', selectedOption: 'core'})

    } catch (ex) {
      alert('Error creating module: ' + ex.message);
    }

  }

  onClick = (key) => {
    return () => {
      this.setState({...this.state, json: '', selectedOption: 'core'})
      this.props.push('#' + key);   
    }
  }

  onDrop = (files) => {

    files.forEach(file => {
      const reader = new FileReader();

      reader.onload = () => {
        this.loadModule(reader.result);
      };

      reader.readAsText(file);

    });

  }

  onLoadJSON = () => {
    this.loadModule(this.state.json);
  };

  onOptionClick = (key) =>{
    return () => {
      this.setState({...this.state, selectedOption: key});
    }
  }

  updateJson = (event) => {
    this.setState({...this.state, json: event.target.value})
  }

  renderFooter = () => {
    let loadButton = <span/>
    if(this.state.selectedOption === 'json'){
        loadButton = <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this.onLoadJSON}>Load</button>
    }
    let closeButton = <span/>
    if(!this.props.welcome){
      closeButton = <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this.props.onHide}>Close</button>
    }

    return <div className="modal-footer" style={{height: 69}}>
      {loadButton}
      {closeButton}
    </div>

  }

  renderDetails = () => {

    switch(this.state.selectedOption){
      case 'core':
        return (
          <ul className='LoadModule-list'>
            { Object.keys(this.props.library).filter(n => (n.indexOf('/') === -1)).map( (key, index) => {
              let module = this.props.library[key]
              return (
                <li key={key}><button className='btn btn-link' onClick={this.onClick(key)}>{module.name}</button></li>
              )
            })}
          </ul>
        )

      case 'submodules':
        return (
          <ul className='LoadModule-list'>
            { Object.keys(this.props.library).filter(n => (n.indexOf('/') > -1)).map( (key, index) => {
              let module = this.props.library[key]
              return (
                <li key={key}><button className='btn btn-link' onClick={this.onClick(key)}>{key.split('/')[0] + ': ' + module.name}</button></li>
              )
            })}
          </ul>
        )

      case 'my':
        return (
          <ul className='LoadModule-list'>
            { Object.keys(this.props.modules).map( (key, index) => {
              let module = this.props.modules[key]
              return (
                <li key={key}><button className='btn btn-link' onClick={this.onClick(key)}>{module.name} ({key})</button></li>
              )
            })}
          </ul>
        )


      case 'json':
        return (
          <textarea id='loadJSON' value={this.state.json} onChange={this.updateJson}></textarea>
        )

      case 'git':
        return(
        <div className='row'>  
          <ul className='LoadModule-list'>
            {this.state.Branch}  
          </ul>
          <div>
            <div>&ensp; On branch: {this.state.currentBranch}</div>
            <ul className='LoadModule-list'>
              {this.state.Modules}
            </ul>
          </div>
          <div>
            <div>&ensp; In folder: {this.state.currentModule}</div>
            <ul className='LoadModule-list'>
              {this.state.Submodules}
            </ul>
          </div>
        </div>  
        ) 

    default:
      return;

    }
  }
  
  fetchBranchList() {
    fetch(`https://api.github.com/repos/synthetichealth/synthea/branches`)
      .then(response => response.json())
      .then(data => this.setState({
        Branch: data.map((branch, i) => (
          <li key={i}><button className='btn btn-link' onClick={() => {this.fetchModuleList(branch.name)}}>{branch.name}</button></li>
        ))
      }))
      .catch(error => console.log('error: ', error));
  }

  fetchModuleList(branch) {
    this.setState({
      currentBranch: branch
    })
    fetch(`https://api.github.com/repos/synthetichealth/synthea/contents/src/main/resources/modules?ref=` + branch)  
      .then(response => response.json())
      .then(data => this.setState({
        Modules: data.map((name, i) => (
          <li key={i}><button className='btn btn-link' onClick={() => {this.fetchModule(name.name)}}>{name.name}</button></li>
        ))
      }))
      .catch(error => console.log('error: ', error));
  }

  fetchModule(name) {
    this.setState({
      currentModule: name
    })
    if (name.includes(".json")) {
      fetch(`https://raw.githubusercontent.com/synthetichealth/synthea/` + this.state.currentBranch + `/src/main/resources/modules/` + name)  
        .then(response => response.text())
        .then(data => this.loadModule(data))
        .catch(error => console.log('error: ', error));
    } else {
      console.log(`https://api.github.com/repos/synthetichealth/synthea/contents/src/main/resources/modules/` + name + `?ref=` + this.state.currentBranch)
      fetch(`https://api.github.com/repos/synthetichealth/synthea/contents/src/main/resources/modules/` + name + `?ref=` + this.state.currentBranch)  
      .then(response => response.json())
      .then(data => this.setState({
        Submodules: data.map((name, i) => (
          <li key={i}><button className='btn btn-link' onClick={() => {this.fetchSubmodule(name.name)}}>{name.name}</button></li>
        ))
      }))
      .catch(error => console.log('error: ', error));
    }
  }

  fetchSubmodule(name) {
    fetch(`https://raw.githubusercontent.com/synthetichealth/synthea/` + this.state.currentBranch + `/src/main/resources/modules/` + this.state.currentModule + `/` + name)  
      .then(response => response.text())
      .then(data => this.loadModule(data))
      .catch(error => console.log('error: ', error));
  }    

  componentDidMount() {
    this.fetchBranchList()
  }

  renderWelcomeMessage = () => {
    if(this.props.welcome){
      return (<div>
        Welcome to Synthea Module Builder.  Please visit the documentation first.
        </div>)
    }

    return <div />
  }

  render() {

    let classDetails = " hide", style = {display: 'none'}

    if(this.props.visible){
      classDetails = " show";
      style = {display: 'block'}
    }

    return (
      <div>
        <div className={'modal ' +  classDetails} style={style}>
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{(!this.props.welcome ? 'Load Module' : 'Synthea Module Builder')}</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.props.onHide} style={{display: (this.props.welcome ? 'none' : '')}}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body LoadModule-body">
                <Dropzone activeClassName='LoadModule-dropzoneActive' className='LoadModule-dropzone' onDrop={this.onDrop.bind(this)}>
                   Drop files here or click to open saved modules.
                </Dropzone>
                <div className='container'>
                  <div className='row'>
                    <div className='col-3 nopadding'>
                      <ul className='LoadModule-options'>
                         <li className={(this.state.selectedOption === 'core') ? 'selected' : ''}><button className='btn btn-link' onClick={this.onOptionClick('core')}>Core Modules</button></li>
                         <li className={(this.state.selectedOption === 'submodules') ? 'selected' : ''}><button className='btn btn-link' onClick={this.onOptionClick('submodules')}>Submodules</button></li>
                         {Object.keys(this.props.modules).length > 0 ? <li className={(this.state.selectedOption === 'my') ? 'selected' : ''}><button className='btn btn-link' onClick={this.onOptionClick('my')}>My Modules</button></li> : ''}
                         <li className={(this.state.selectedOption === 'json') ? 'selected' : ''}><button className='btn btn-link' onClick={this.onOptionClick('json')}>Paste JSON</button></li>
                         <li className={(this.state.selectedOption === 'git') ? 'selected' : ''}><button className='btn btn-link' onClick={this.onOptionClick('git')}>GitHub Modules</button></li>
                      </ul>
                    </div>
                    <div className='col-9 nopadding'>
                      {this.renderDetails()}
                    </div>
                  </div>
                </div>
              </div>
              {this.renderFooter()}
            </div>
          </div>
        </div>
        <div className={`modal-backdrop ${classDetails}`} style={style}/>
      </div>
    )
  }
}

export default LoadModule;
