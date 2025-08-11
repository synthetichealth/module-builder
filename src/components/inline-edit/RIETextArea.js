// @flow
import React, { Component } from 'react';

type Props = {
  value: string,
  propName: string,
  change: (data: { [string]: any }) => void,
  className?: string,
  placeholder?: string,
  rows?: number
};

type State = {
  isEditing: boolean,
  value: string
};

export class RIETextArea extends Component<Props, State> {
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

  handleChange = (e: SyntheticInputEvent<HTMLTextAreaElement>) => {
    this.setState({ value: e.target.value });
  };

  handleKeyPress = (e: SyntheticKeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') {
      this.setState({ isEditing: false, value: this.props.value || '' });
    }
    // Note: For textarea, we don't submit on Enter as it's expected to be multi-line
  };

  render() {
    const { className, placeholder, rows = 3 } = this.props;
    const { isEditing, value } = this.state;

    if (isEditing) {
      return (
        <textarea
          value={value}
          onChange={this.handleChange}
          onBlur={this.stopEditing}
          onKeyDown={this.handleKeyPress}
          className={className}
          placeholder={placeholder}
          rows={rows}
          autoFocus
        />
      );
    }

    return (
      <span
        onClick={this.startEditing}
        className={`${className || ''} inline-editable`}
        style={{ cursor: 'pointer', minWidth: '50px', display: 'inline-block' }}
      >
        {this.props.value || placeholder || 'Click to edit'}
      </span>
    );
  }
}
