// @flow
import React, { Component } from 'react';
import _ from 'lodash';

import './AttributeList.css';
import CancelButton from './cancel-button.png';
import AttributeData from './AttributeData.json';
import Attributes from '../editor/Attributes';
import Dropdown from 'react-dropdown';
import './Dropdown.css';

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

  attributeFilter(attribute){
    return attribute.attribute.toLowerCase().includes(this.state.search.toLowerCase()) || 
           attribute.stateName.toLowerCase().includes(this.state.search.toLowerCase());
  }
  
  onSelect = (option) =>  {
    // Open this module
    this.props.loadSelectedModule(option.label)
  }

  render() {
    const data = AttributeData;
    return (<div className='AttributeList'>
          <div className='Editor-panel-title'> 
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
                  <th scope="col">Other Modules</th>
                </tr>
              </thead>
              <tbody>
              {this.props.attributes.filter(this.attributeFilter.bind(this)).map((attribute, i) => {
                let others = [this.props.module.name];
                if (data[attribute.attribute]!= undefined) 
                {
                  Object.keys(data[attribute.attribute].read).forEach(i => {others.push(i)})                
                  Object.keys(data[attribute.attribute].write).forEach(i => {others.push(i)})
                }
                others = others.filter((x, i, a) => a.indexOf(x) == i)
                others.splice(others.indexOf[this.props.module.name], 1);
                let dropDown;
                if (others.length > 0)
                {
                  dropDown = <Dropdown className='code' options={others} onChange={this.onSelect} value="Jump To Module..." />
                }
                else
                {
                  dropDown = <td className={this.props.selectedState && (attribute.stateName === this.props.selectedState.name) ? "table-info" : ""} onClick={this.onClick(attribute)} >None</td>
                }

                
                return (
                  <tr key={i}>
                    <th className={this.props.selectedState && (attribute.stateName === this.props.selectedState.name) ? "table-info" : ""} onClick={this.onClick(attribute)} scope="row">{attribute.attribute}</th>
                    <td className={this.props.selectedState && (attribute.stateName === this.props.selectedState.name) ? "table-info" : ""} onClick={this.onClick(attribute)} >{attribute.stateName} </td>
                    {dropDown}
                  </tr>
                )
              })}
              </tbody>
            </table>
          </div>)
  }
}

export default AttributeList;
