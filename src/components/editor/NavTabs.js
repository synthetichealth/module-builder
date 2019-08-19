// @flow
import React, { Component } from 'react';

import './NavTabs.css';

import type { Module } from './types/Module';

import CancelButton from './cancel-button.png';

type Props = {
  modules: Module[],
  selectedModuleKey: string,
  onChange: any
}


class NavTabs extends Component<Props> {

  constructor(props) {
    super(props);
  }

  onClick = (selectedModuleKey) => {
    if(selectedModuleKey === this.props.selectedModuleKey){
      return () => {}
    }

    return () => this.props.onChangeModule(selectedModuleKey);
  }

  onClose = (selectedModuleKey) => {
    return () => this.props.onCloseModule(selectedModuleKey);
  }


  render() {
    return (
      <div className='NavTabs'>
        <ul>
         {
           Object.keys(this.props.modules).map( m => {
             return (<li key={m} className={(m === this.props.selectedModuleKey ? 'NavTabs-active' : '')} ><button onClick={this.onClick(m)}>
                 {/*this.props.modules[m].name*/}
                 {m}.json
               </button>
              <img className="NavTabs-close" src={CancelButton} onClick={this.onClose(m)} alt="Close"/>
             </li>
             )})
           }
         </ul>
      </div>
    );
  }
}

export default NavTabs;
