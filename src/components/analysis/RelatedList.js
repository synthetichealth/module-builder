// @flow
import React, { Component } from 'react';
import _ from 'lodash';

import './RelatedList.css';

type Props = {
  related: mixed,
  selectedState: State
}

class RelatedList extends Component<Props> {

  onClick(related) {
    return () => { this.props.onClick(related.stateName)}
  }

  render() {
    return (<div className='RelatedList'>
          <div className='Editor-panel-title'> 
            Related Modules
          </div>

          <div>
            This currently only displays relationships based on submodules.  Additional relationships are in progress.
          </div>

          <table className="table table-sm table-hover">
              <thead className="thead-light">
                <tr>
                  <th scope="col">Type</th>
                  <th scope="col">Module</th>
                  <th scope="col">State</th>
                </tr>
              </thead>
              <tbody>
       
              {this.props.related.map( (related, i) => {
                return (
                  <tr key={i} onClick={this.onClick(related)} className={this.props.selectedState && (related.stateName === this.props.selectedState.name) ? "table-info" : ""}>
                    <th scope="row">{related.type}</th>
                    <td>{related.moduleKey}</td>
                    <td>{related.stateName}</td>
                  </tr>
                )
              })}
              </tbody>
            </table>
          </div>)
  }
}

export default RelatedList;
