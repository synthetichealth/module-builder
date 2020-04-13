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
        Url: <RIEInput className='editable-text' value={valueSet ? valueSet.url : ''} propName="url" change={this.props.onChange('url')} />
        <br />
        Display: <RIEInput className='editable-text' value={valueSet ? valueSet.display : ''} propName="display" change={this.props.onChange('display')} />
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
                <ValueSet onChange={this.props.onChange(i)} valueSet={valueSet} />
              </div>
            )
          })}
        </div>
      );
    }
}