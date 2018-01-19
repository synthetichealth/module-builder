// @flow
import React, { Component } from 'react';
import { RIEInput, RIETextArea } from 'riek';

import './ModuleProperties.css';

import type { Module } from './types/Module';

type Props = {
  module: Module,
  onNameChange: (selectedModuleIndex: number, newName: string) => mixed,
  onRemarksChange: (selectedModuleIndex: number, newName: string) => mixed
}

class ModulePropertiesEditor extends Component<Props> {

  constructor(props) {
    super(props);
    this.onNameChange = this.onNameChange.bind(this);
    this.onRemarksChange = this.onRemarksChange.bind(this);
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
      remarks = this.props.module.remarks.join("\n");
    }

    // NOTE: WHAT IF REMARKS SET TO BLANK?

    return (
      <div className='ModuleProperties'>
        <div className='ModuleProperties-name'>
          <RIEInput value={this.props.module.name} propName="name" change={(newval) => this.onNameChange(newval.name)} />
        </div>
        <div className='ModuleProperties-remarks'>
          <RIETextArea value={remarks} propName="remarks" change={(newval) => this.onRemarksChange(newval.remarks)} />
        </div>
      </div>
    )
  }
}

export default ModulePropertiesEditor;
