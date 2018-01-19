import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import StateEditor from '../components/editor/State';
import ModulePropertiesEditor from '../components/editor/ModuleProperties';
import ModuleGraph from '../components/graph/Module';
import LoadModule from '../components/graph/LoadModule';
import Download from '../components/graph/Download';
import { extractStates, extractAttributes } from '../transforms/Module';

import './Editor.css';

import {selectNode, 
        addNode, 
        addStructure, 
        editNode, 
        renameNode, 
        newModule, 
        showLoadModule, 
        hideLoadModule, 
        selectModule, 
        showDownload, 
        hideDownload, 
        changeStateType, 
        editModuleName, 
        editModuleRemarks} from '../actions/editor';

class Editor extends Component {

  /*
    This is a recursive function to track the path that an edit action took through the Inspector
    It was written this way because there's multiple ways that one could get to, say, a Conditional Editor
    By keeping track of where it's been it means that the action can just look into the modules along the path
  */
  onChange  = (update, path=[]) => {
    if(typeof update != 'object') {
      return (val) => this.onChange(val, [].concat(path, [update]))
    }
    this.props.editNode(update, path)
  }

  renameNode = (targetModuleIndex, targetNode) => {
    return (newName) => {
        this.props.renameNode(targetModuleIndex, targetNode, newName);
    }
  }

  changeStateType = (targetModuleIndex, targetNode) => {
    return (newType) => {
      this.props.changeStateType(targetModuleIndex, targetNode, newType);
    }
  }

  render() {
    return (
      <div className='Editor'>

        <nav className="navbar fixed-top navbar-expand-lg navbar-light bg-light">
          <a className="navbar-brand" href="#">Synthea Module Builder</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              <button className="btn btn-link nav-item nav-link" onClick={this.props.newModule.bind(this, this.props.moduleCount)}>New Module</button>
              <button className="btn btn-link nav-item nav-link" onClick={this.props.showLoadModule}>Load Module</button>
              <button className="btn btn-link nav-item nav-link" onClick={this.props.showDownload}>Download</button>
              <button className='btn btn-secondary nav-action-button' onClick={() => this.props.addNode(this.props.selectedModuleIndex)}> Add State </button>
              <button className='btn btn-secondary nav-action-button' onClick={() => this.props.addStructure(this.props.selectedModuleIndex, 'CheckYearly')}> Add Structure </button>
            </div>
          </div>
        </nav>

        /* REFACTOR THESE MODALS */
        <LoadModule modules={this.props.modules} 
          visible={this.props.loadModuleVisible} 
          onHide={this.props.hideLoadModule} 
          onSelectModule={this.props.selectModule}/>

        <Download module={this.props.module} 
          visible={this.props.downloadVisible} 
          onHide={this.props.hideDownload}/>

        <div className='Editor-main'>
          

          <div className='Editor-panel'>

            <ModulePropertiesEditor
              module={this.props.module} 
              onNameChange={(name) => this.props.editModuleName(this.props.selectedModuleIndex, name)}
              onRemarksChange={(remarks) => this.props.editModuleRemarks(this.props.selectedModuleIndex, remarks)}/>

            <StateEditor
              renameNode={this.renameNode(this.props.selectedModuleIndex, this.props.selectedState)}
              changeType={this.changeStateType(this.props.selectedModuleIndex, this.props.selectedState)}
              state={this.props.selectedState}
              otherStates={this.props.states}
              onChange={this.onChange(this.props.selectedModuleIndex)} />

           </div>

          <ModuleGraph 
            module={this.props.module} 
            onClick={this.props.selectNode} 
            selectedState={this.props.selectedState}/>

        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  let selectedModule = state.modules[state.editor.currentModuleIndex];
  let states = extractStates(selectedModule)
  let selectedNode = states.find((s) => s.name == state.editor.currentNode)
  return {
    module: selectedModule,
    modules: state.modules,
    selectedState: selectedNode,
    states,
    selectedModuleIndex: state.editor.currentModuleIndex,
    moduleCount: state.modules.length,
    loadModuleVisible: state.editor.loadModuleVisible,
    downloadVisible: state.editor.downloadVisible,
    attributes: extractAttributes(selectedModule)
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  selectNode,
  addNode,
  addStructure,
  editNode,
  renameNode,
  changeStateType,
  newModule,
  showLoadModule,
  hideLoadModule,
  selectModule,
  showDownload,
  hideDownload,
  editModuleName,
  editModuleRemarks
  
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
