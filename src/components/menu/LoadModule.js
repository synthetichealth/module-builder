import React, { Component } from 'react';
import './LoadModule.css';
import {generateDOT} from '../../utils/graphviz';

class LoadModule extends Component {

  constructor(props) {
    super(props)
    this.state = {json: '', selectedOption: 'core'}
  }

  onClick = (key) => {
    return () => {
      this.setState({...this.state, json: '', selectedOption: 'core'})
      this.props.push('#' + key);   
    }
  }

  onLoadJSON = () => {
    const json = ''
    try {
      let module = JSON.parse(this.state.json)

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
  };

  onOptionClick = (key) =>{
    return () => {
      this.setState({...this.state, selectedOption: key});
    }
  }

  updateJson = (event) => {
    this.setState({...this.state, json: event.target.value})
  }

  renderLoadButton = () => {
    if(this.state.selectedOption === 'json'){
      return (
        <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this.onLoadJSON}>Load</button>
      )
    }
  }

  renderDetails = () => {

    switch(this.state.selectedOption){
      case 'core':
        return (
          <ul className='LoadModule-list'>
            { Object.keys(this.props.modules).filter(n => (n.indexOf('/') === -1)).map( (key, index) => {
              let module = this.props.modules[key]
              return (
                <li key={key}><button className='btn btn-link' onClick={this.onClick(key)}>{module.name}</button></li>
              )
            })}
          </ul>
        )

      case 'submodules':
        return (
          <ul className='LoadModule-list'>
            { Object.keys(this.props.modules).filter(n => (n.indexOf('/') > -1)).map( (key, index) => {
              let module = this.props.modules[key]
              return (
                <li key={key}><button className='btn btn-link' onClick={this.onClick(key)}>{key.split('/')[0] + ': ' + module.name}</button></li>
              )
            })}
          </ul>
        )

      case 'json':
        return (
          <textarea id='loadJSON' value={this.state.json} onChange={this.updateJson}></textarea>
        )
      default:
        return;

    }
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
                <h5 className="modal-title">Load Module</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.props.onHide}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body LoadModule-body">
                <div className='container'>
                  <div className='row'>
                    <div className='col-3 nopadding'>
                      <ul className='LoadModule-options'>
                         <li className={(this.state.selectedOption === 'core') ? 'selected' : ''}><button className='btn btn-link' onClick={this.onOptionClick('core')}>Core Modules</button></li>
                         <li className={(this.state.selectedOption === 'submodules') ? 'selected' : ''}><button className='btn btn-link' onClick={this.onOptionClick('submodules')}>Submodules</button></li>
                         <li className={(this.state.selectedOption === 'json') ? 'selected' : ''}><button className='btn btn-link' onClick={this.onOptionClick('json')}>Paste JSON</button></li>
                      </ul>
                    </div>
                    <div className='col-9 nopadding'>
                      {this.renderDetails()}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">

                {this.renderLoadButton()}
                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this.props.onHide}>Close</button>
              </div>
            </div>
          </div>
        </div>
        <div className={`modal-backdrop ${classDetails}`} style={style}/>
      </div>
    )
  }
}

export default LoadModule;
