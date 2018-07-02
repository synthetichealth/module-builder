// @flow
import React, { Component } from 'react';
import { RIEInput, RIETextArea } from 'riek';

import './ModuleProperties.css';

import type { Module } from './types/Module';

type Props = {
  module: Module,
  onRemarksChange: (selectedModuleIndex: number, newName: string) => mixed
}

class ModulePropertiesEditor extends Component<Props> {

  constructor(props) {
    super(props);
    this.onRemarksChange = this.onRemarksChange.bind(this);
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
        <div className='Editor-panel-title'> 
           Module Remarks
        </div>
        <div className='ModuleProperties-remarks'>
          <RIETextArea value={remarks} propName="remarks" change={(newval) => this.onRemarksChange(newval.remarks)} />
        </div>
      </div>
    )
  }
}

export default ModulePropertiesEditor;
