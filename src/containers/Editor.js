import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import StateEditor from '../components/editor/State';
import ModuleGraph from '../components/graph/Module';
import Menu from '../components/graph/Menu';
import LoadModule from '../components/graph/LoadModule';
import Information from '../components/graph/Information';
import Code from '../components/graph/Code';
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
        showCode, 
        hideCode, 
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

        <Menu onNewModuleClick={this.props.newModule} 
          moduleCount={this.props.moduleCount} 
          onLoadModuleClick={this.props.showLoadModule} 
          onShowCodeClick={this.props.showCode}/>

        /* REFACTOR THESE MODALS */
        <LoadModule modules={this.props.modules} 
          visible={this.props.loadModuleVisible} 
          onHide={this.props.hideLoadModule} 
          onSelectModule={this.props.selectModule}/>

        <Code module={this.props.module} 
          visible={this.props.codeVisible} 
          onHide={this.props.hideCode}/>

        <div className='Editor-main'>

          <Information 
            module={this.props.module} 
            onStateClick={this.props.selectNode} 
            selectedState={this.props.selectedState} 
            attributes={this.props.attributes} 
            onNameChange={(name) => this.props.editModuleName(this.props.selectedModuleIndex, name)}
            onRemarksChange={(remarks) => this.props.editModuleRemarks(this.props.selectedModuleIndex, remarks)}/>

          <ModuleGraph 
            module={this.props.module} 
            onClick={this.props.selectNode} 
            selectedState={this.props.selectedState}/>

          <div className='button-holder'>
            <button className='btn btn-primary' onClick={() => this.props.addNode(this.props.selectedModuleIndex)}> Add State </button>
            <br/>
            <button className='btn btn-secondary' onClick={() => this.props.addStructure(this.props.selectedModuleIndex, 'CheckYearly')}> Add Structure </button>
          </div>

          <StateEditor
            renameNode={this.renameNode(this.props.selectedModuleIndex, this.props.selectedState)}
            changeType={this.changeStateType(this.props.selectedModuleIndex, this.props.selectedState)}
            state={this.props.selectedState}
            otherStates={this.props.states}
            onChange={this.onChange(this.props.selectedModuleIndex)} />

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
    codeVisible: state.editor.codeVisible,
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
  showCode,
  hideCode,
  editModuleName,
  editModuleRemarks
  
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
