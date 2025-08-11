// @flow
import React, { Component } from 'react';

type Props = {
  value: number,
  propName: string,
  change: (data: { [string]: any }) => void,
  className?: string,
  placeholder?: string,
  min?: number,
  max?: number
};

type State = {
  isEditing: boolean,
  value: string
};

export class RIENumber extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isEditing: false,
      value: String(props.value || '')
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.value !== this.props.value) {
      this.setState({ value: String(this.props.value || '') });
    }
  }

  startEditing = () => {
    this.setState({ isEditing: true, value: String(this.props.value || '') });
  };

  stopEditing = () => {
    this.setState({ isEditing: false });
    const numValue = parseFloat(this.state.value);
    if (!isNaN(numValue) && numValue !== this.props.value) {
      this.props.change({
        [this.props.propName]: numValue
      });
    }
  };

  handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ value: e.target.value });
  };

  handleKeyPress = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      this.stopEditing();
    } else if (e.key === 'Escape') {
      this.setState({ isEditing: false, value: String(this.props.value || '') });
    }
  };

  render() {
    const { className, placeholder, min, max } = this.props;
    const { isEditing, value } = this.state;

    if (isEditing) {
      return (
        <input
          type="number"
          value={value}
          onChange={this.handleChange}
          onBlur={this.stopEditing}
          onKeyDown={this.handleKeyPress}
          className={className}
          placeholder={placeholder}
          min={min}
          max={max}
          autoFocus
        />
      );
    }

    return (
      <span
        onClick={this.startEditing}
        className={`${className || ''} inline-editable`}
        style={{ cursor: 'pointer', minWidth: '20px', display: 'inline-block' }}
      >
        {this.props.value !== undefined ? this.props.value : (placeholder || 'Click to edit')}
      </span>
    );
  }
}
