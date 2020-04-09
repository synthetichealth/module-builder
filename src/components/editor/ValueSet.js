// @flow

import React, { Component } from 'react';
import { RIEInput } from 'riek';
import _ from 'lodash';

import type { ValueSet as ValueSetType } from '../../types/ValueSet';

type Props = {
  valueSet: ValueSetType,
  onChange: any
}

export class ValueSet extends Component<Props> {

  render() {
    let valueSet = this.props.valueSet;
    return (
      <div>
        Url: <RIEInput className='editable-text' value={valueSet.url} propName="url" change={this.props.onChange('url')} />
        <br />
        Display: <RIEInput className='editable-text' value={valueSet.display} propName="display" change={this.props.onChange('display')} />
      </div>
    );
  }

}

type ValueSetsProps = {
    valueSets: ValueSetType[],
    onChange: any
}
export class ValueSets extends Component<ValueSetsProps> {
    render() {
      return (
        <div>
          {this.props.valueSets && this.props.valueSets.map((valueSet, i) => {
            return (
              <div className='section' key={i}>
                <a className='editable-text delete-button' onClick={() => this.props.onChange(`[${i}]`)({val: {id: null}})}>remove</a>
                <ValueSet onChange={this.props.onChange(i)} valueSet={valueSet} />
              </div>
            )
          })}
          <a className='editable-text' onClick={() => this.props.onChange(`[${this.props.valueSets ? this.props.valueSets.length : 0}]`)({val: {id: {url: '', display: ''}}})}>+</a>
        </div>
      );
    }
}