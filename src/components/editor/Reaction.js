// @flow

import React, { Component } from 'react';
import { RIENumber, RIESelect } from 'riek';
import _ from 'lodash';

import type { Code as CodeType } from '../../types/Code';
import type { Reaction as ReactionType, Severity as SeverityType } from '../../types/State';
import { getTemplate } from '../../templates/Templates';
import { Code }  from './Code';

type SeverityComponent = SeverityType & {
  onChange: any
}

export class Severity extends Component<SeverityComponent> {
  render() {
    let level = this.props.level;
    let value = this.props.value;
    return (
      <div>
        Level: <RIESelect className='editable-text'
                          value={{id: level, text: level}} propName="level"
                          change={this.props.onChange('level')}
                          options={[{id:'severe', text: 'Severe'},
                                    {id:'moderate', text: 'Moderate'},
                                    {id:'mild', text: 'Mild'},
                                    {id:'none', text: 'None'}]}/>
        <br />
        Probability: <RIENumber className='editable-text'
                                value={value} propName="value"
                                change={this.props.onChange('value')}
                                editProps={{step: .01, min: 0, max: 1}}
                                format={this.formatAsPercentage} validate={this.checkInRange}/>
      </div>
    );
  }

  formatAsPercentage(num: number) {
    return (num * 100) + "%";
  }

  checkInRange(num: number) {
    return ((num >= 0) && (num <= 1));
  }
}

type ReactionComponent = ReactionType & {
  onChange: any
}

export class Reaction extends Component<ReactionComponent> {
  render() {
    return (
      <div>
        <Code onChange={this.props.onChange('reaction')}
              code={this.props.reaction.reaction} system={"SNOMED-CT"}/>
        Severity Probabilities:
        {this.props.reaction.possible_severities.map((ps, i) => {
            return (
              <div className='section' key={i}>
                <a className='editable-text delete-button' onClick={() => this.props.onChange(`possible_severities[${i}]`)({val: {id: null}})}>remove</a>
                <Severity onChange={this.props.onChange(`possible_severities[${i}]`)} level={ps.level} value={ps.value}/>
              </div>
            )
        })}
        {this.renderWarning()}
        <a className='editable-text' onClick={() => this.props.onChange(`possible_severities[${this.props.reaction.possible_severities.length}]`)({val: {id: {level: "none", value: 0}}})}>+</a>
      </div>
    );
  }

  renderWarning() {
    if(this.props.reaction.possible_severities.length == 0) {
      return null;
    }
    let warn = (this.props.reaction.possible_severities.reduce((acc, val) => acc + val.value, 0) !== 1);
    if (warn) {
      return (
        <label className='warning'>Probabilities do not add up to 100%.</label>
      );
    }
  }
}
