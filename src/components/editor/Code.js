// @flow

import React, { Component } from 'react';
import { RIEInput } from 'riek';
import _ from 'lodash';

import type { Code as CodeType } from '../../types/Code';
import { getTemplate } from '../../templates/Templates';

type Props = {
  code: CodeType,
  system: string,
  onChange: any,
  value_set: string
}

export class Code extends Component<Props> {

  checkValueSetKey() {
    if(this.props.code.value_set) {
      return (
        <div>
        Value Set (Optional): <RIEInput className='editable-text' value={this.props.code.value_set} propName="value_set" change={this.props.onChange('value_set')} />
        </div>
      );
    }else {
      return (
        <div>
        Value Set (Optional): <RIEInput className='editable-text' value="" propName="value_set" change={this.props.onChange('value_set')} />
        </div>
      );
    }
  }

  render() {
    let code = this.props.code;
    let system = this.props.system;
    return (
      <div>
        System: {system}
        <br />
        Code: <RIEInput className='editable-text' value={code.code} propName="code" change={this.props.onChange('code')} />
        <br />
        Display: <RIEInput className='editable-text' value={code.display} propName="display" change={this.props.onChange('display')} />
        {this.checkValueSetKey()}
      </div>
    );
  }

}

type CodesProps = {
  codes: CodeType[],
  system: string,
  onChange: any
}
export class Codes extends Component<CodesProps> {
  render() {

    if(!this.props.codes){
      return null;
    }
    let system = this.props.system;
    let templates = {
      "SNOMED-CT": getTemplate('Type.Code.Snomed'),
      "LOINC": getTemplate('Type.Code.Loinc'),
      "RxNorm": getTemplate('Type.Code.RxNorm'),
      "NUBC": getTemplate('Type.Code.Nubc'),
      "DICOM-DCM": getTemplate('Type.Code.DicomDCM'),
      "DICOM-SOP": getTemplate('Type.Code.DicomSOP')
    };
    return (
      <div>
        {this.props.codes.map((code, i) => {
          return (
            <div className='section' key={i}>
              <a className='editable-text delete-button' onClick={() => this.props.onChange(`[${i}]`)({val: {id: null}})}>remove</a>
              <Code onChange={this.props.onChange(i)} code={code} system={system}/>
            </div>
          )
        })}
        <a className='editable-text' onClick={() => this.props.onChange(`[${this.props.codes.length}]`)({val: {id: _.cloneDeep(templates[system])}})}>+</a>
      </div>
    );
  }
}
