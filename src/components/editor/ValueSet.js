// @flow

import React, { Component } from 'react';
import { RIEInput } from 'riek';
import _ from 'lodash';

import type { ValueSet as ValueSetType } from '../../types/ValueSet';

type Props = {
  valueset: ValueSetType,
  onChange: any
}

export class ValueSet extends Component<Props> {

  render() {
    let valueset = this.props.valueset;
    return (
      <div>
        Url: <RIEInput className='editable-text' value={valueset ? valueset.url : ''} propName="url" change={this.props.onChange('url')} />
        <br />
        Display: <RIEInput className='editable-text' value={valueset ? valueset.display : ''} propName="display" change={this.props.onChange('display')} />
      </div>
    );
  }

}

type ValueSetsProps = {
    valuesets: ValueSetType[],
    onChange: any
}
export class ValueSets extends Component<ValueSetsProps> {
    render() {
      return (
        <div>
          {this.props.valuesets && this.props.valuesets.map((valueset, i) => {
            return (
              <div className='section' key={i}>
                <ValueSet onChange={this.props.onChange(i)} valueset={valueset} />
              </div>
            )
          })}
        </div>
      );
    }
}