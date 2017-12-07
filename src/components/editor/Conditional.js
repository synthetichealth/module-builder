// @flow
import React, { Component } from 'react';
import type { Conditional, GenderConditional, AttributeConditional } from '../../types/Conditional';

type Props = {
  conditional: Conditional,
  onChange: any
}

class ConditionalEditor extends Component<Props> {

  renderConditionalType() {
    switch (this.props.conditional.condition_type) {
      case "Attribute":
        return <Attribute {...this.props} />
      default:
        return this.props.conditional.condition_type

    }
  }

  render() {
    if (!this.props.conditional) {
      return null;
    }
    return (
      <div>
        {this.renderConditionalType()}
      </div>
    );
  }
}

class Gender extends Component<Props> {
  render() {
    let conditional = (this.props.conditional: GenderConditional)
    return (
      <label> Gender:
        <select value={conditional.gender} onChange={this.props.onChange}>
          <option value="M"> Male </option>
          <option value="F"> Female </option>
        </select>
      </label>
    );
  }
}

class Attribute extends Component<Props> {
  render() {
    let conditional = (this.props.conditional: AttributeConditional)
    return (
      <label> {conditional.attribute} {conditional.operator} {conditional.value}
      </label>
    );
  }
}

export default ConditionalEditor;
