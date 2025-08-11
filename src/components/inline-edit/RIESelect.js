// @flow
import React, { Component } from 'react';

type Option = {
  id: string,
  text: string
};

type Props = {
  value: any,
  propName: string,
  change: (data: { [string]: any }) => void,
  className?: string,
  options: Option[]
};

type State = {
  isEditing: boolean,
  value: any
};

export class RIESelect extends Component<Props, State> {
  constructor(props) {
    super(props);
    const initialValue = this.getValueId(props.value);
    this.state = {
      isEditing: false,
      value: initialValue
    };
  }

  componentDidUpdate(prevProps) {
    // Update state when props change, but only if we're not currently editing
    if (prevProps.value !== this.props.value && !this.state.isEditing) {
      this.setState({ value: this.getValueId(this.props.value) });
    }
  }

  // Extract ID from value - handles both strings and {id, text} objects
  getValueId(value) {
    if (value === null || value === undefined) {
      return '';
    }
    if (typeof value === 'object' && value.id !== undefined) {
      return value.id;
    }
    return value;
  }

  startEditing = () => {
    this.setState({ isEditing: true, value: this.getValueId(this.props.value) });
  };

  stopEditing = () => {
    this.setState({ isEditing: false });
  };

  handleChange = (e) => {
    const newValue = e.target.value;
    
    this.setState({ 
      value: newValue,
      isEditing: false 
    });
    this.props.change({
      [this.props.propName]: newValue
    });
  }

  handleKeyPress = (e) => {
    if (e.key === 'Escape') {
      this.setState({ isEditing: false, value: this.getValueId(this.props.value) });
    }
  }

  getDisplayText = () => {
    // Use current editing value when editing, otherwise use props value
    const currentValue = this.state.isEditing ? this.state.value : this.props.value;
    const valueId = this.getValueId(currentValue);
    const option = this.props.options.find(opt => opt.id === valueId);
    
    if (option && option.text) {
      return option.text;
    }
    
    // Make sure we return a string, not an object
    if (typeof valueId === 'object') {
      return valueId && valueId.text ? valueId.text : 'Select...';
    }
    
    return valueId || 'Select...';
  };

  render() {
    const { className, options } = this.props;
    const { isEditing, value } = this.state;

    if (isEditing) {
      return (
        <select
          value={value}
          onChange={this.handleChange}
          onBlur={this.stopEditing}
          onKeyDown={this.handleKeyPress}
          className={className}
          autoFocus
        >
          {options.map(option => (
            <option key={option.id} value={option.id}>
              {option.text}
            </option>
          ))}
        </select>
      );
    }

    const displayText = this.getDisplayText();
    
    return (
      <span
        onClick={this.startEditing}
        className={`${className || ''} inline-editable`}
        style={{ cursor: 'pointer', minWidth: '20px', display: 'inline-block' }}
      >
        {displayText || 'Click to edit'}
      </span>
    );
  }
}
