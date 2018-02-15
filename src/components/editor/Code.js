// @flow

import React, { Component } from 'react';
import { RIESelect, RIEInput, RIENumber } from 'riek';
import _ from 'lodash';

import type { Code as CodeType } from '../../types/Code';
import { TypeTemplates } from '../../templates/Templates';
import './Transition.css';


type Props = {
  code: CodeType,
  onChange: any
}

export class Code extends Component<Props> {

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
      </div>
    );
  }

}

type CodesProps = {
  codes: CodeType[],
  onChange: any
}
export class Codes extends Component<CodesProps> {
  render() {

    if(!this.props.codes){
      return null;
    }
    let system = this.props.system;
    let templates = {
      "SNOMED-CT": TypeTemplates.Code.Snomed,
      "LOINC": TypeTemplates.Code.Loinc,
      "RxNorm": TypeTemplates.Code.RxNorm,
      "NUBC": TypeTemplates.Code.Nubc
    };
    return (
      <div>
        {this.props.codes.map((code, i) => {
          return (
            <div className='transition-option' key={i}>
              <a className='delete-button' onClick={() => this.props.onChange(`[${i}]`)({val: {id: null}})}>remove</a>
              <Code onChange={this.props.onChange(i)} code={code} system={system}/>
            </div>
          )
        })}
        <a onClick={() => this.props.onChange(`[${this.props.codes.length}]`)({val: {id: _.cloneDeep(templates[system])}})}>+</a>

      </div>
    );
  }
}
