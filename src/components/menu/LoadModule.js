import React, { Component } from 'react';
import './LoadModule.css';
import {generateDOT} from '../../utils/graphviz';
import StyledDropzone from './StyledDropZone';
import {
  getLocalStorageModules,
  removeLocalStorageModule,
} from "../../utils/localStorageHelpers";

class LoadModule extends Component {

  constructor(props) {
    super(props)
    this.state = {json: '', selectedOption: 'core'}
  }

  loadModule = (json) => {
    try {
      let module = JSON.parse(json)

      if(module.name === undefined){
        throw new Error('Module must have a name.')
      }

      if(module.states === undefined || Object.keys(module.states).length === 0){
        throw new Error('Module must have at least one state.')
      }

      let tableMessage =  ''

      // need to get the tables for any table transition
      for (var key in module.states)
      {
        if (module.states[key].lookup_table_transition != null)
        {
          tableMessage += key.toString() + ' & '

          // this is an awful hack to get around a data model mismatch
          const lttWrapper = { type: 'Table', transitions: module.states[key].lookup_table_transition };
          module.states[key].lookup_table_transition = lttWrapper;


          // put default data in for state of the table transition
          module.states[key].lookup_table_transition.lookup_table_name_ModuleBuilder = module.states[key].lookup_table_transition.transitions[0].lookup_table_name;
          module.states[key].lookup_table_transition.viewTable = false;
          module.states[key].lookup_table_transition.lookuptable = '';
        }
      }

      if (tableMessage.length > 0)
      {
        tableMessage = tableMessage.substr(0, tableMessage.length - 2);
        // make a pop-up to tell the user to enter the table data
        alert('Table Transition must be filled out in Module Builder for ' + tableMessage)
      }
      // this will throw an error if the module is incomprehensible
      let dot = generateDOT(module);

      this.props.newModule(module)
      this.setState({...this.state, json: '', selectedOption: 'core'})

    } catch (ex) {
      alert('Error creating module: ' + ex.message);
    }

  }

  onClick = (key) => {
    return () => {
      this.setState({...this.state, json: '', selectedOption: 'core'})
      this.props.push('#' + key);
    }
  }

  onDrop = (files) => {
    files.forEach(file => {
      const reader = new FileReader();

      reader.onload = () => {
        this.loadModule(reader.result);
      };
      reader.readAsText(file);
    });
  }

  onLoadJSON = () => {
    this.loadModule(this.state.json);
  };

  onOptionClick = (key) =>{
    return () => {
      this.setState({...this.state, selectedOption: key});
    }
  }

  updateJson = (event) => {
    this.setState({...this.state, json: event.target.value})
  }

  renderFooter = () => {
    let loadButton = <span/>
    if(this.state.selectedOption === 'json'){
        loadButton = <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this.onLoadJSON}>Load</button>
    }
    let closeButton = <span/>
    if(!this.props.welcome){
      closeButton = <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this.props.onHide}>Close</button>
    }

    return <div className="modal-footer" style={{height: 69}}>
      {loadButton}
      {closeButton}
    </div>

  }

  renderDetails = () => {

    switch(this.state.selectedOption){
      case 'core':
        return (
          <ul className='LoadModule-list'>
            { Object.keys(this.props.library).filter(n => (n.indexOf('/') === -1)).map( (key, index) => {
              let module = this.props.library[key]
              return (
                <li key={key}><button className='btn btn-link' onClick={this.onClick(key)}>{module.name}</button></li>
              )
            })}
          </ul>
        )

      case 'submodules':
        return (
          <ul className='LoadModule-list'>
            { Object.keys(this.props.library).filter(n => (n.indexOf('/') > -1)).map( (key, index) => {
              let module = this.props.library[key]
              return (
                <li key={key}><button className='btn btn-link' onClick={this.onClick(key)}>{key.split('/')[0] + ': ' + module.name}</button></li>
              )
            })}
          </ul>
        )

      case 'my':
        return (
          <ul className='LoadModule-list'>
            { Object.keys(this.props.modules).map( (key, index) => {
              let module = this.props.modules[key]
              return (
                <li key={key}><button className='btn btn-link' onClick={this.onClick(key)}>{module.name} ({key})</button></li>
              )
            })}
          </ul>
        )


      case 'json':
        return (
          <textarea id='loadJSON' value={this.state.json} onChange={this.updateJson}></textarea>
        )

      case 'git':
        const columns = 1 + (this.state.Modules ? 1 : 0) + (this.state.Submodules ? 1 : 0);
        const colsize = 12 / columns;

        return(
        <div className='row'>
          <div className={`col-${colsize} nopadding`}>
            <ul className='LoadModule-list'>
              {this.state.Branches}
            </ul>
          </div>
          {this.state.Modules && (
            <div className={`col-${colsize} nopadding`}>
              <ul className='LoadModule-list'>
                {this.state.Modules}
              </ul>
            </div>
            )}
          {this.state.Submodules && (
            <div className={`col-${colsize} nopadding`}>
                <ul className='LoadModule-list'>
                  {this.state.Submodules}
                </ul>
              </div>
            )}
        </div>
        )

    case 'local-storage':
      return (
        <ul className="LoadModule-list">
          {Object.keys(this.state.localStorageModules || {}).map(moduleName => { 
            const moduleEntry = this.state.localStorageModules[moduleName]
            return (
              <li key={moduleName}>
                <div className="d-flex">
                  <div className="flex-grow-1">
                    <button className='btn btn-link' onClick={() => {
                      this.loadModule(JSON.stringify(moduleEntry.module))
                    }}>
                      {moduleName} (Last saved: {moduleEntry.timestamp})
                    </button>
                  </div>
                  <div className="flex-shrink-1 mx-5">
                    <button className="close h-100 w-100" aria-label="Close" onClick={() => {
                      removeLocalStorageModule(moduleName);
                      this.updateLocalStorageModules();
                    }}>
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      );
    default:
      return;
    }
  }

  changeColor(ID, type) {
    if (type === 'submodule') return; // as of now, the submodule panel doesn't persist so don't bother coloring it

    document.getElementById(ID).style.backgroundColor = "#ddd";
    let list = []
    switch(type) {
      case 'branch':
        list = this.state.Branches
        break;
      case 'module':
        list = this.state.Modules
        break;
      default:
        break;
    }
    list.forEach((i) => {
      if (i.props.id !== ID) {
        document.getElementById(i.props.id).style.backgroundColor = "#eee";
      }
    });
  }

  updateLocalStorageModules() {
    const existingModules = getLocalStorageModules();

    this.setState({
      localStorageModules: existingModules,
    });
  }

  fetchBranchList() {
    fetch(`https://api.github.com/repos/synthetichealth/synthea/branches`)
    .then(response => response.json())
    .then(data => {
      this.setState({
        Branches: data.map((branch, i) => (
          <li key={i} id={branch.name}><button className='btn btn-link' onClick={() => {this.changeColor(branch.name, 'branch');this.fetchModuleList(branch.name)}}>{branch.name}</button></li>
        ))
      })
    })
    .catch(error => console.log('error: ', error));
  }

  fetchModuleList(branch) {
    this.setState({
      currentBranch: branch
    })
    fetch(`https://api.github.com/repos/synthetichealth/synthea/contents/src/main/resources/modules?ref=` + branch)
      .then(response => response.json())
      .then(data => {
        this.setState({
          Modules: this.mapFolderContentsToList(data, [], 'module'),
          Submodules: null // reset submodules to prevent 404 errors
        })
      })
      .catch(error => console.log('error: ', error));
  }

  fetchFile(path) {
    fetch(`https://raw.githubusercontent.com/synthetichealth/synthea/` + this.state.currentBranch + `/src/main/resources/modules/` + path.join('/'))
      .then(response => response.text())
      .then(data => this.loadModule(data))
      .then(this.setState ({
        Submodules: null,
        Modules: null
      }))
      .catch(error => console.log('error: ', error));
  }

  fetchFolder(path) {
    fetch(`https://api.github.com/repos/synthetichealth/synthea/contents/src/main/resources/modules/` + path.join('/') + `?ref=` + this.state.currentBranch)
      .then(response => response.json())
      .then(data => this.setState({
        Submodules: this.mapFolderContentsToList(data, path, 'submodule')
      }))
      .catch(error => console.log('error: ', error));
  }

  mapFolderContentsToList(data, path, type) {
    data.sort((a, b) => {
      // sort folders ahead of files, but both groups should use the usual alphabetical order
      const aIsFile = a.name.endsWith(".json");
      const bIsFile = b.name.endsWith(".json");

      if (aIsFile === bIsFile) return a.name.localeCompare(b.name);
      
      if (aIsFile) {
        // then we know B is a folder, B is first
        return 1;
      }
      // now we know A is a folder, A is first
      return -1;
    });
    const list = data.map((item, i) => {
      const name = item.name;
      const isFile = name.endsWith(".json");
      const displayName = isFile ? name : name + '/'; 
      return (
      <li key={i} id={item.name}>
        <button className='btn btn-link' onClick={() => { this.changeColor(item.name, type); isFile ? this.fetchFile(path.concat(name)) : this.fetchFolder(path.concat(name))}}>
          {displayName}
        </button>
      </li>
    )});

    if (path.length > 1) {
      // add a "go back" option at the top
      list.unshift((
        <li key={-1} id="go-up-one">
          <button className='btn btn-link' onClick={() => {this.fetchFolder(path.slice(0,-1))}}>
            ^ up one folder
          </button>
        </li>
        ));
    }

    return list;
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.selectedOption === "git" &&
      prevState.selectedOption !== "git"
    ) {
      this.fetchBranchList();
    } else if (
      this.state.selectedOption === "local-storage" &&
      prevState.selectedOption !== "local-storage"
    ) {
      this.updateLocalStorageModules();
    }
  }

  renderWelcomeMessage = () => {
    if(this.props.welcome){
      return (<div>
        Welcome to Synthea Module Builder.  Please visit the documentation first.
        </div>)
    }

    return <div />
  }

  render() {

    let classDetails = " hide", style = {display: 'none'}

    if(this.props.visible){
      classDetails = " show";
      style = {display: 'block'}
    }

    return (
      <div>
        <div className={'modal ' +  classDetails} style={style}>
            <div className="modal-content" style={{width:"900px", marginLeft: '15%', marginRight: '15%', marginTop: 50}}>
              <div className="modal-header">
                <h5 className="modal-title">{(!this.props.welcome ? 'Load Module' : 'Synthea Module Builder')}</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.props.onHide} style={{display: (this.props.welcome ? 'none' : '')}}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body LoadModule-body">
                <StyledDropzone onDrop={this.onDrop.bind(this)}/>
                <div className='container'>
                  <div className='row'>
                    <div className='col-3 nopadding'>
                      <ul className='LoadModule-options'>
                         <li className={(this.state.selectedOption === 'core') ? 'selected' : ''}><button className='btn btn-link' onClick={this.onOptionClick('core')}>Core Modules</button></li>
                         <li className={(this.state.selectedOption === 'submodules') ? 'selected' : ''}><button className='btn btn-link' onClick={this.onOptionClick('submodules')}>Submodules</button></li>
                         {Object.keys(this.props.modules).length > 0 ? <li className={(this.state.selectedOption === 'my') ? 'selected' : ''}><button className='btn btn-link' onClick={this.onOptionClick('my')}>My Modules</button></li> : ''}
                         <li className={(this.state.selectedOption === 'json') ? 'selected' : ''}><button className='btn btn-link' onClick={this.onOptionClick('json')}>Paste JSON</button></li>
                         <li className={(this.state.selectedOption === 'git') ? 'selected' : ''}><button className='btn btn-link' onClick={this.onOptionClick('git')}>GitHub Modules</button></li>
                         <li className={this.state.selectedOption === 'local-storage' ? 'selected' : '' }><button className='btn btn-link' onClick={this.onOptionClick('local-storage')} >Local Storage</button></li>
                      </ul>
                    </div>
                    <div className='col-9 nopadding'>
                      {this.renderDetails()}
                    </div>
                  </div>
                </div>
              </div>
              {this.renderFooter()}
          </div>
        </div>
        <div className={`modal-backdrop ${classDetails}`} style={style}/>
      </div>
    )
  }
}

export default LoadModule;
