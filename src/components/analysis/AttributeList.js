// @flow
import React, { Component } from 'react';
import _ from 'lodash';

import './AttributeList.css';
import CancelButton from './cancel-button.svg';

type Props = {
  states: State[],
  modules: Module[],
  selectedState: State,
  onChange: any,
}

class AttributeList extends Component<Props> {

  constructor(props) {
    super(props);
    this.state = {search: ''};
  }

  onClick(attribute) {
    return () => { this.props.onClick(attribute.stateName)}
  }

  onChange(event){
    this.setState({search: event.target.value});
  }

  clearSearch(){
    this.setState({search: ''})
  }

  attributes(){
    const attributes = [];
    this.props.states.forEach( state => {
     if(state.type === 'SetAttribute'){
       attributes.push({attribute: state.attribute, stateName: state.name, stateType: state.type});
     } else if(state.assign_to_attribute){
       attributes.push({attribute: state.assign_to_attribute, stateName: state.name, stateType: state.type});
     }
    });

    return attributes.sort(function(a, b){
      var x = a.attribute.toLowerCase();
      var y = b.attribute.toLowerCase();
      if (x < y) {return -1;}
      if (x > y) {return 1;}
      return 0;
    })
  }

  attributeFilter(attribute){
    return attribute.attribute.toLowerCase().includes(this.state.search.toLowerCase()) || 
           attribute.stateName.toLowerCase().includes(this.state.search.toLowerCase());
  }

  render() {
    return (<div className='AttributeList'>
          <div className='AttributeList-header'> 
             Attribute List
          </div>

          <div className="btn-group">
            <input type="text" className="form-control" placeholder="Find" value={this.state.search} onChange={this.onChange.bind(this)}/>
            <img className="search-clear" src={CancelButton} onClick={this.clearSearch.bind(this)}/>
          </div>
          <div>
            Note: This currently only displays attributes being written in this module.  It does not include referenced attributes
            or attributes written in other modules.
          </div>
          <table className="table table-sm table-hover">
              <thead className="thead-light">
                <tr>
                  <th scope="col">Attribute</th>
                  <th scope="col">State</th>
                </tr>
              </thead>
              <tbody>
              {this.attributes().filter(this.attributeFilter.bind(this)).map((attribute, i) => {
                return (
                  <tr key={i} onClick={this.onClick(attribute)} className={this.props.selectedState && (attribute.stateName === this.props.selectedState.name) ? "table-info" : ""}>
                    <th scope="row">{attribute.attribute}</th>
                    <td>{attribute.stateName}</td>
                  </tr>
                )
              })}
              </tbody>
            </table>
          </div>)
  }
}

export default AttributeList;
