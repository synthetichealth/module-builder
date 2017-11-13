// @flow
import React, { Component } from 'react';

type Props = {
  label: string,
  value: string,
  onChange: ?any
};


class StringEditor extends Component<Props> {
  render() {
    return (
      <label>
        {this.props.label}:
        <input value={this.props.value} onChange={this.props.onChange} />
      </label>
    );
  }
}

export default StringEditor;
