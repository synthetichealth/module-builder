// @flow
import React, { Component } from 'react';

type Props = {
  value: boolean,
  propName: string,
  change: (data: { [string]: any }) => void,
  className?: string
};

export class RIEToggle extends Component<Props> {
  handleToggle = () => {
    this.props.change({
      [this.props.propName]: !this.props.value
    });
  };

  render() {
    const { className, value } = this.props;

    return (
      <button
        type="button"
        onClick={this.handleToggle}
        className={`${className || ''} inline-editable toggle`}
        style={{ 
          cursor: 'pointer', 
          padding: '4px 8px', 
          backgroundColor: value ? '#007bff' : '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '4px'
        }}
      >
        {value ? 'ON' : 'OFF'}
      </button>
    );
  }
}
