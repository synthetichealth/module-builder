// @flow

import React, { Component } from 'react';
import { RIESelect, RIEInput, RIENumber } from 'riek';
import _ from 'lodash';

import type { Goal as GoalType } from '../../types/Attributes';
import { Codes } from './Code';
import { ValueSets } from './ValueSet';
import { StringsEditor } from './String';
import { getTemplate } from '../../templates/Templates';

type Props = {
  goal: GoalType,
  onChange: any
}

export class Goal extends Component<Props> {

  render() {
    let goal = this.props.goal;
    return (
      <div>
        {this.renderObservation()}
        {this.renderText()}
        <div className='section'>
          Addresses
          <br />
          <StringsEditor values={goal.addresses} label={"Address"} onChange={this.props.onChange('addresses')} />
          <br />
        </div>
      </div>
    );
  }

  renderObservation() {
    let goal = this.props.goal;
    let options = [
      {id: '==' , text: '==' },
      {id: '!=' , text: '!=' },
      {id: "<" , text: "<" },
      {id: "<=" , text: "<=" },
      {id: ">" , text: ">" },
      {id: ">=", text: ">="},
      {id: "is nil", text: "is nil"},
      {id: "is not nil", text: "is not nil"}
    ];
    if (!goal.observation) {
      return (
        <div>
          <a className='editable-text' onClick={() => this.props.onChange('observation')({val: {id: getTemplate('Attribute.Observation')}})}>Add Observation</a>
          <br />
        </div>
      );
    } else {
      let goalObservationValue = (
        <div>
          Goal Observation Value: <RIENumber className='editable-text' value={goal.observation.value} propName={'value'} change={this.props.onChange('observation.value')} />
        </div>
      );

      if(goal.observation.operator === 'is nil' || goal.observation.operator === 'is not nil'){
        goalObservationValue = <div/>
      }
      
      return (
        <div className='section'>
          Observation
          <br />
          <div>
            {this.renderCodeOrValueSetForObservation()}
          </div>
          Goal Observation Operator: <RIESelect className='editable-text' value={{id: goal.observation.operator, text: goal.observation.operator}} propName={'operator'} change={this.props.onChange('observation.operator')} options={options} />
          {goalObservationValue}
          <br/>
          <a className='editable-text' onClick={() => this.props.onChange('observation')({val: {id: null}})}>Remove Observation</a>
          <br/>
        </div>
      );
    }
  }

  renderCodeOrValueSetForObservation() {
    let goal = this.props.goal;
     if (goal.observation.codes && goal.observation.codes[0].system) {
       return (
         <div className='section'>
           Codes <a className='editable-text' onClick={() => {this.props.onChange('observation.codes')({val: {id: [{url: '', display: ''}]}})}}>Add ValueSet</a>
           <br />
           <Codes codes={goal.observation.codes} system={"LOINC"} onChange={this.props.onChange('observation.codes')} />
         </div>
       );
     } else {
       return (
         <div className='section'>
           <a className='editable-text' onClick={() => {this.props.onChange('observation.codes')({val: {id: null}}); this.props.onChange('observation.codes')({val: {id: [getTemplate('Type.Code.Loinc')]}}); }}>Add Code</a> ValueSet
           <br />
           <ValueSets valuesets={goal.observation.codes} onChange={this.props.onChange('observation.codes')} />
         </div>
       );
     }
   }

  renderText() {
    let goal = this.props.goal;
    if (!goal.text) {
      return (
        <div>
          <a className='editable-text' onClick={() => this.props.onChange('text')({val: {id: "text"}})}>Add Text</a>
          <br />
        </div>
      );
    } else {
      return (
        <div>
          Goal Text: <RIEInput className='editable-text' value={goal.text} propName={'text'}  change={this.props.onChange('text')} />
          <a className='editable-text' onClick={() => this.props.onChange('text')({val: {id: null}})}>(remove)</a>
          <br />
        </div>
      );
    }
  }

}

type GoalsProps = {
  goals: GoalType[],
  onChange: any
}
export class Goals extends Component<GoalsProps> {
  render() {

    if(!this.props.goals){
      return null;
    }
    return (
      <div>
        {this.props.goals.map((goal, i) => {
          return (
            <div className='section' key={i}>
              <a className='editable-text delete-button' onClick={() => this.props.onChange(`[${i}]`)({val: {id: null}})}>remove</a>
              <Goal onChange={this.props.onChange(i)} goal={goal} />
            </div>
          )
        })}
        <a className='editable-text' onClick={() => this.props.onChange(`[${this.props.goals.length}]`)({val: {id: getTemplate('Attribute.Goal')}})}>+</a>
      </div>
    );
  }
}
