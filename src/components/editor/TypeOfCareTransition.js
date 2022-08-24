// @flow
import React, { Component } from 'react';
import { RIESelect } from 'riek';
import _ from 'lodash';


import type { TypeOfCareTransition as TypeOfCareTransitionType } from '../../types/Transition';
import type { State } from '../../types/State';
import TelemedicineConfig from '../../data/telemedicine_config';
import './Transition.css';

type Props = {
  options: State[],
  transition?: TypeOfCareTransitionType,
  onChange: any
}
  
class TypeOfCareTransition extends Component<Props> {
  render() {
    let options = this.props.options.map((s) => {return {id: s.name, text: s.name}});
    
    return (
      <div>
        <h4>During or after year {TelemedicineConfig.start_year}</h4>
        <table>
          <thead>
            <tr>
              <th>
                Transition
              </th>
              <th className="small-column">
                With Insurance
              </th>
              <th className="small-column">
                No Insurance
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <label>
                  Ambulatory:<br/>
                  <RIESelect className='editable-text' propName='ambulatory' value={{id:this.props.transition.ambulatory, text:this.props.transition.ambulatory}} change={this.props.onChange('ambulatory')} options={options} />
                </label>
              </td>
              <td className="small-column">
                {TelemedicineConfig.during_telemedicine.typical_emergency_distribution.ambulatory * 100}%
              </td>
              <td className="small-column">
                {TelemedicineConfig.during_telemedicine.high_emergency_distribution.ambulatory * 100}%
              </td>
            </tr>
            <tr>
              <td>
                <label>
                  Emergency:
                  <RIESelect className='editable-text' propName='emergency' value={{id:this.props.transition.emergency, text:this.props.transition.emergency}} change={this.props.onChange('emergency')} options={options} />
                </label>
              </td>
              <td className="small-column">
                {TelemedicineConfig.during_telemedicine.typical_emergency_distribution.emergency * 100}%
              </td>
              <td className="small-column">
                {TelemedicineConfig.during_telemedicine.high_emergency_distribution.emergency * 100}%
              </td>
            </tr>
            <tr>
              <td>
                <label>
                  Telemedicine:
                  <RIESelect className='editable-text' propName='telemedicine' value={{id:this.props.transition.telemedicine, text:this.props.transition.telemedicine}} change={this.props.onChange('telemedicine')} options={options} />
                </label>
              </td>
              <td className="small-column">
                {TelemedicineConfig.during_telemedicine.typical_emergency_distribution.telemedicine * 100}%
              </td>
              <td className="small-column">
                {TelemedicineConfig.during_telemedicine.high_emergency_distribution.telemedicine * 100}%
              </td>
            </tr>
          </tbody>
        </table>
        <h4>Before year {TelemedicineConfig.start_year}</h4>
        <table>
        <thead>
          <tr>
            <th>
              Transition
            </th>
            <th className="small-column">
              With Insurance
            </th>
            <th className="small-column">
              No Insurance
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <label>
                Ambulatory: {this.props.transition.ambulatory}
              </label>
            </td>
            <td className="small-column">
              {TelemedicineConfig.pre_telemedicine.typical_emergency_distribution.ambulatory * 100}%
            </td>
            <td className="small-column">
              {TelemedicineConfig.pre_telemedicine.high_emergency_distribution.ambulatory * 100}%
            </td>
          </tr>
          <tr>
            <td>
              <label>
                Emergency: {this.props.transition.emergency}
              </label>
            </td>
            <td className="small-column">
              {TelemedicineConfig.pre_telemedicine.typical_emergency_distribution.emergency * 100}%
            </td>
            <td className="small-column">
              {TelemedicineConfig.pre_telemedicine.high_emergency_distribution.emergency * 100}%
            </td>
          </tr>
        </tbody>
      </table>
      </div>
    );
  }

}


export default TypeOfCareTransition;