// @flow
import React, { Component } from 'react';

import './JsonEditor.css';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-monokai';
import {generateDOT} from '../../utils/graphviz';

import type { Module } from './types/Module';

type Props = {
  module: Module,
  onChange: mixed
}

class JsonEditor extends Component<Props> {

  clearTimeout = null;

  onChange = (value) => {
    if(this.clearTimeout){
      clearTimeout(this.clearTimeout);
    }

    this.clearTimeout = setTimeout(()=>{
      try {
        // Parse the JSON string back to object
        const module = JSON.parse(value);
        let dot = generateDOT(module);
        this.props.onChange(module);
      } catch (ex) {
        // JSON parsing error - could show user feedback here
        console.warn('JSON parsing error:', ex.message);
      }
    }, 1000) // wait a second for user to complete changes
  }

  render() {
    if(this.props.refreshCodeFlag){
      return <div/>
    }
    
    return (
      <div className='JsonEditor'>
        <AceEditor
          mode="json"
          theme="github"
          onChange={this.onChange}
          value={JSON.stringify(this.props.module, null, 2)}
          name="json-editor"
          editorProps={{$blockScrolling: true}}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: true,
            tabSize: 2,
          }}
          style={{
            width: '100%',
            height: '100%',
            minHeight: '400px'
          }}
        />
      </div>
    );
  }
}

export default JsonEditor;;
