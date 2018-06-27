// @flow
import React, { Component } from 'react';

import './JsonEditor.css';
import { JsonEditor as Editor } from 'jsoneditor-react';
import 'jsoneditor-react/es/editor.min.css';
import ace from 'brace';
import 'brace/mode/json';
import {generateDOT} from '../../utils/graphviz';

import type { Module } from './types/Module';

type Props = {
  module: Module,
  onChange: mixed
}

class JsonEditor extends Component<Props> {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(module) {
    
    if(this.clearTimeout){
      clearTimeout(this.clearTimeout);
    }

    this.clearTimeout = setTimeout(()=>{

      try {
        let dot = generateDOT(module);

        this.props.onChange(module)

      } catch (ex) {
        // currently silently fails on this
        // alert('Error creating module: ' + ex.message);
      }

    }, 1000) // wait a second for user to complete changes
  }


  render() {
    if(this.props.refreshCodeFlag){
      return <div/>
    }
    return (
      <div className='JsonEditor'>
        <Editor
          value={this.props.module}
          mode='code'
          ace={ace}
          onChange={this.onChange}
        />
      </div>
    );
  }
}

export default JsonEditor;;
