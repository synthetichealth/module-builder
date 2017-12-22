// @flow
import React, { Component } from 'react';
import type { Conditional, GenderConditional, AttributeConditional } from '../../types/Conditional';
import { RIESelect, RIEInput, RIENumber } from 'riek';

type Props = {
  conditional: Conditional,
  onChange: any
}

class ConditionalEditor extends Component<Props> {

  renderConditionalType() {
    switch (this.props.conditional.condition_type) {
      case "Attribute":
        return <Attribute {...this.props} />
      case "Socioeconomic Status":
        return <SocioeconomicStatus {...this.props} />
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
        <RIESelect value={conditional.gender} onChange={this.props.onChange} options={[{id:'m', text: 'male'}, {id:'f', text: 'female'}]} />
      </label>
    );
  }
}

class Attribute extends Component<Props> {

  render() {
    let conditional = (this.props.conditional: AttributeConditional)
    let options = [{id: '==' , text:'==' }, {id: '!=' , text:'!=' }, {id: "<" , text:"<" }, {id: "<=" , text:"<=" }, {id: ">" , text:">" }, {id: ">=", text:">="}];
    return (
      <label>
        <RIEInput value={conditional.attribute} propName="attribute" change={this.props.onChange('attribute')} />
        <RIESelect value={{id: conditional.operator, text: conditional.operator}} propName="operator" change={this.props.onChange('operator')} options={options} />
        <RIENumber value={conditional.value} propName='value' change={this.props.onChange('value')} />
      </label>
    );
  }
}

class SocioeconomicStatus extends Component<Props> {
  render() {
    //TODO:  Typecast to SocioeconomicStatusConditional type
    let options = [
      {id: 'Low', text: 'Low'},
      {id: 'Middle', text: 'Middle'},
      {id: 'High', text: 'High'}
    ];
    return (
      <label>
        <RIESelect value={{id: conditional.category, text: conditional.category}} propName="category" change={this.props.onChange('category')} options={options} />
      </label>
    )
  }
}

export default ConditionalEditor;
