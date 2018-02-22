// @flow

import React, { Component } from 'react';
import { RIESelect, RIEInput, RIENumber } from 'riek';
import _ from 'lodash';

import type { Goal as GoalType } from '../../types/Goal';
import { Codes } from './Code';
import { AttributeTemplates } from '../../templates/Templates';
import './Transition.css';


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
          <a onClick={() => this.props.onChange('observation')({val: {id: _.cloneDeep(AttributeTemplates.Observation)}})}>Add Goal Observation</a>
          <br />
        </div>
      );
    } else {
      return (
        <div className='section'>
          Observation
          <br />
          <div className='section'>
            Codes
            <br />
            <Codes codes={goal.observation.codes} system={"LOINC"} onChange={this.props.onChange('observation.codes')} />
            <br />
          </div>
          Goal Observation Operator: <RIESelect className='editable-text' value={{id: goal.observation.operator, text: goal.observation.operator}} propName={'operator'} change={this.props.onChange('observation.operator')} options={options} />
          <br/>
          Goal Observation Value: <RIENumber className='editable-text' value={goal.observation.value} propName={'value'} change={this.props.onChange('observation.value')} />
          <br/>
          <a onClick={() => this.props.onChange('observation')({val: {id: null}})}>Remove Observation</a>
          <br/>
        </div>
      );
    }
  }

  renderText() {
    let goal = this.props.goal;
    if (!goal.text) {
      return (
        <div>
          <a onClick={() => this.props.onChange('text')({val: {id: "text"}})}>Add Goal Text</a>
          <br />
        </div>
      );
    } else {
      return (
        <div>
          Goal Text: <RIEInput className='editable-text' value={goal.text} propName={'text'}  change={this.props.onChange('text')} />
          <a onClick={() => this.props.onChange('text')({val: {id: null}})}> (remove)</a>
          <br />
        </div>
      );
    }
  }

  // // TODO fix
  // renderAddresses() {
  //   let goal = this.props.goal;
  //   if (!goal.addresses) {
  //     return (
  //       <div>
  //         <a onClick={() => this.props.onChange('addresses')({val: {id: ["text"]}})}>Add Goal Addresses</a>
  //         <br />
  //       </div>
  //     );
  //   } else {
  //     return (
  //       <div>
  //         <div>
  //           {goal.addresses.map((address, i) => {
  //             return (
  //               <div className='transition-option' key={i}>
  //                 <a className='delete-button' onClick={() => this.props.onChange(`[${i}]`)({val: {id: null}})}>remove</a>
  //                 Address
  //               </div>
  //             );
  //           })}
  //           <a onClick={() => this.props.onChange(`[${goal.addresses.length}]`)({val: {id: "text"}})}>Add Goal Address</a>
  //         </div>
  //         <br />
  //         <a onClick={() => this.props.onChange('addresses')({val: {id: null}})}> (remove addresses)</a>
  //         <br />
  //       </div>
  //     );
  //   }
  // }

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
            <div className='transition-option' key={i}>
              <a className='delete-button' onClick={() => this.props.onChange(`[${i}]`)({val: {id: null}})}>remove</a>
              <Goal onChange={this.props.onChange(i)} goal={goal} />
            </div>
          )
        })}
        <a onClick={() => this.props.onChange(`[${this.props.goals.length}]`)({val: {id: _.cloneDeep(AttributeTemplates.Goal)}})}>+</a>
      </div>
    );
  }
}
