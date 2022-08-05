// @flow
import React, { Component } from 'react';
import { RIESelect, RIEInput, RIENumber } from 'riek';
import _ from 'lodash';


import type { TelemedicineTransition as TelemedicineTransitionType } from '../../types/Transition';
import { getTemplate } from '../../templates/Templates';
import type { State } from '../../types/State';
import './Transition.css';

type Props = {
  options: State[],
  transition?: TelemedicineTransitionType,
  onChange: any
}
  
class TelemedicineTransition extends Component<Props> {
  render() {
    let options = this.props.options.map((s) => {return {id: s.name, text: s.name}});
    
    return (
      <div>
        <label>
          Ambulatory:
          <RIESelect className='editable-text' propName='ambulatory' value={{id:this.props.transition.ambulatory, text:this.props.transition.ambulatory}} change={this.props.onChange('ambulatory')} options={options} />
        </label>
        <br/>
        <label>
          Emergency:
          <RIESelect className='editable-text' propName='emergency' value={{id:this.props.transition.emergency, text:this.props.transition.emergency}} change={this.props.onChange('emergency')} options={options} />
        </label>
        <br/>
        <label>
          Telemedicine:
          <RIESelect className='editable-text' propName='telemedicine' value={{id:this.props.transition.telemedicine, text:this.props.transition.telemedicine}} change={this.props.onChange('telemedicine')} options={options} />
        </label>
      </div>

    );
  }

}


export default TelemedicineTransition;