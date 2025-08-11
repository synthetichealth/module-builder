// @flow
import React, { Component } from 'react';

type Props = {
  value: string,
  propName: string,
  change: (data: { [string]: any }) => void,
  className?: string,
  placeholder?: string
};

type State = {
  isEditing: boolean,
  value: string
};

export class RIEInput extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isEditing: false,
      value: props.value || ''
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.value !== this.props.value) {
      this.setState({ value: this.props.value || '' });
    }
  }

  startEditing = () => {
    this.setState({ isEditing: true, value: this.props.value || '' });
  };

  stopEditing = () => {
    this.setState({ isEditing: false });
    const newValue = this.state.value;
    if (newValue !== this.props.value) {
      this.props.change({
        [this.props.propName]: newValue
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
      this.setState({ isEditing: false, value: this.props.value || '' });
    }
  };

  render() {
    const { className, placeholder } = this.props;
    const { isEditing, value } = this.state;

    if (isEditing) {
      return (
        <input
          type="text"
          value={value}
          onChange={this.handleChange}
          onBlur={this.stopEditing}
          onKeyDown={this.handleKeyPress}
          className={className}
          placeholder={placeholder}
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
        {this.props.value || placeholder || 'Click to edit'}
      </span>
    );
  }
}
