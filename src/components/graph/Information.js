// @flow
import React, { Component } from 'react';
import { RIEInput, RIETextArea } from 'riek';

import './Information.css';

import type { Module } from './types/Module';

type Props = {
  module: Module,
  onStateClick: (id:string) => mixed,
  selectedState: State,
  attributes: string[],
  onNameChange: (selectedModuleIndex: number, newName: string) => mixed

}

class Information extends Component<Props> {

  constructor(props) {
    super(props);
    this.onStateClick = this.onStateClick.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.onRemarksChange = this.onRemarksChange.bind(this);
  }

  onStateClick(key) {
    this.props.onStateClick(key)
  }

  onNameChange(name) {
    this.props.onNameChange(name)
  }

  onRemarksChange(remarks) {
    this.props.onRemarksChange(remarks)
  }

  render() {
    let remarks = "No remarks." 
    if(Array.isArray(this.props.module.remarks)){ 
      remarks = this.props.module.remarks.join(" ");
    }

    // NOTE: WHAT IF REMARKS SET TO BLANK?

    return (
      <div className='Information'>
        <div className='Information-name'>
          <RIEInput value={this.props.module.name} propName="name" change={(newval) => this.onNameChange(newval.name)} />
        </div>
        <div className='Information-remarks'>
          <RIETextArea value={remarks} propName="remarks" change={(newval) => this.onRemarksChange(newval.remarks)} />
        </div>
        <div className='Information-header'>States</div>
        <div className='Information-states'>
          <ul>
           {Object.keys(this.props.module.states).map((key) =>{
              let className = '';
              if(this.props.selectedState && this.props.selectedState.name === key){
                className = 'selected';
              }
              return (
                <li key={key} className={className} onClick={this.onStateClick.bind(this,key)}>{key}</li>
              )
           })} 
           </ul>
        </div>
        <div className='Information-header'>Attributes</div>
        <div className='Information-attributes'>
          <ul>
            {this.props.attributes.map((attribute) => ( 
              <li key={attribute}>{attribute}</li>
            ))}
          </ul>
        </div>

      </div>

    )
  }
}

export default Information;
