// @flow
import React, { Component } from 'react';
import { RIESelect, RIEInput, RIENumber } from 'riek';
import _ from 'lodash';


import type { DistributedTransition as DistributedTransitionType } from '../../types/Transition';
import { getTemplate } from '../../templates/Templates';
import type { State } from '../../types/State';
import './Transition.css';


type Props = {
  options: State[],
  transition?: DistributedTransitionType,
  onChange: any
}

class DistributedTransition extends Component<Props> {
  render() {
    let currentValue = [];
    if (this.props.transition) {
      currentValue = this.props.transition.transition;
    }
    if(!this.props.transition) {
      return null;
    }
    let options = this.props.options.map((s) => {return {id: s.name, text: s.name}});

    return (
      <label>
        Distributed Transition:
        {currentValue.map((t, i) => {
          return <div key={i} className="transition-option">
            <label>To:
              <RIESelect className='editable-text' propName='transition' value={{id:t.to, text:t.to}} change={this.props.onChange(`[${i}].transition`)} options={options} />
            </label>
            <br/>
            {this.renderDistribution(t.distribution, i)}
            <br/>
            <a className='editable-text delete-button' onClick={() => this.props.onChange(`[${i}]`)({val: {id: null}})}>remove</a>
          </div>
        })}
        <a className='editable-text add-button' onClick={() => this.props.onChange(`[${currentValue.length}]`)({val: {id: getTemplate('Transition.Distributed[0]')}})}>+</a>
        <br/>
        {this.renderWarning()}
      </label>
    );
  }

  renderDistribution(distribution: mixed, index: number) {
    let sum = this.props.transition.transition.reduce( (acc, val) => acc + (typeof val.distribution === 'object' ? val.distribution.default : val.distribution),0);
    let remainder = 0;
    if(typeof distribution === 'object') {
      remainder = 1 - (sum - distribution.default);
      let remainderOption = null
      if (sum != 1) {
        remainderOption = <a className='editable-text' onClick={() => this.props.onChange(`[${index}].distribution.default`)({val: remainder})}>(Change to Remainder)</a>
      }
      return (
        <label>
          Attribute: <RIEInput className='editable-text' value={distribution.attribute} propName='attribute' change={this.props.onChange(`[${index}].distribution.attribute`)} />
          <br />
          Default Weight: <RIENumber className='editable-text' value={distribution.default} propName='default' editProps={{step: .01, min: 0, max: 1}} format={this.formatAsPercentage} validate={this.checkInRange} change={this.props.onChange(`[${index}].distribution.default`)} />
          {remainderOption}
          <br />
          <a className='editable-text' onClick={() => this.props.onChange(`[${index}].distribution`)({val: {id: getTemplate('Attribute.UnnamedDistribution')}})}>Change to Unnamed Distribution</a>
        </label>
      );
    } else {
      remainder = 1 - (sum - distribution);
      let remainderOption = null
      if (sum != 1) {
        remainderOption = <a className='editable-text' onClick={() => this.props.onChange(`[${index}].distribution`)({val: remainder})}>(Change to Remainder)</a>
      }
      return (
        <label> Weight:
          <RIENumber className='editable-text' value={distribution} propName='distribution' editProps={{step: .01, min: 0, max: 1}} format={this.formatAsPercentage} validate={this.checkInRange} change={this.props.onChange(`[${index}].distribution`)} />
          {remainderOption}
          <br />
          <a className='editable-text' onClick={() => this.props.onChange(`[${index}].distribution`)({val: {id: getTemplate('Attribute.NamedDistribution')}})}>Change to Named Distribution</a>
        </label>
      );
    }
  }

  renderWarning() {
    if(!this.props.transition) {
      return null;
    }
    let warn = (this.props.transition.transition.reduce((acc, val) => acc + (typeof val.distribution === 'object' ? val.distribution.default : val.distribution), 0) !== 1);
    if (warn) {
      return (
        <label className='warning'>Weights do not add up to 100%.</label>
      );
    }
  }

  formatAsPercentage(num: number) {
    return (num * 100) + "%";
  }

  checkInRange(num: number) {
    return ((num >= 0) && (num <= 1));
  }
}

export default DistributedTransition;
