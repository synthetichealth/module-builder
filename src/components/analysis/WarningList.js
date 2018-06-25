// @flow
import React, { Component } from 'react';
import _ from 'lodash';

import './WarningList.css';

type Props = {
  warnings: mixed,
  selectedState: State
}

class WarningList extends Component<Props> {

  onClick(warning) {
    return () => { this.props.onClick(warning.stateName)}
  }

  render() {
    return (<div className='WarningList'>
          <div className='WarningList-header'> 
            Warnings
          </div>

          <table className="table table-sm table-hover">
              <thead className="thead-light">
                <tr>
                  <th scope="col">Warning</th>
                  <th scope="col">State</th>
                </tr>
              </thead>
              <tbody>
       
              {this.props.warnings.map( (warning, i) => {
                return (
                  <tr key={i} onClick={this.onClick(warning)} className={this.props.selectedState && (warning.stateName === this.props.selectedState.name) ? "table-info" : ""}>
                    <th scope="row">{warning.message}</th>
                    <td>{warning.stateName}</td>
                  </tr>
                )
              })}
              </tbody>
            </table>
          </div>)
  }
}

export default WarningList;
