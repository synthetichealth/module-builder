import React, { Component } from 'react';

import './TextBox.css';

class TextBox extends Component<Props> {
  render() {
    return (
      <textarea className="TextBox" onChange={this.props.onChange} value={JSON.stringify(this.props.module, undefined, 2)}></textarea>
    )
  }
}

export default TextBox;
