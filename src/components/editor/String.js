// @flow
import React, { Component } from 'react';
import { RIEInput } from 'riek';

type Props = {
  label: string,
  value: string,
  onChange: any
};

export class StringEditor extends Component<Props> {
  render() {
    let value = this.props.value;
    return (
      <div>
        {this.props.label}: <RIEInput className='editable-text' value={value} propName="value" change={this.props.onChange('value')} />
        <br />
      </div>
    );
  }
}

type StringsProps = {
  label: string,
  values: string[],
  onChange: any
};
export class StringsEditor extends Component<StringsProps> {
  render() {
    if(!this.props.values){
      return null;
    }
    return (
      <div>
        {this.props.values.map((value, i) => {
          return (
            <div className='section' key={i}>
              <a className='editable-text delete-button' onClick={() => this.props.onChange(`[${i}]`)({val: {id: null}})}>remove</a>
              <StringEditor onChange={this.props.onChange(i)} value={value} label={this.props.label} />
            </div>
          )
        })}
        <a className='editable-text' onClick={() => this.props.onChange(`[${this.props.values.length}]`)({val: {id: "text"}})}>+</a>
      </div>
    );
  }
}
