import React, { Component } from 'react';
import FileSaver from 'file-saver';
import _ from 'lodash'

import './Download.css';

class Download extends Component {

  constructor(props){
    super(props)
    this.onDownload = this.onDownload.bind(this)
  }

  onDownload(){
    let blob = new Blob([this.extractTables(this.refs.codeInput.value)], {
       type: "text/plain;charset=utf-8"
    });

    let filename = this.props.module.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();

    FileSaver.saveAs(blob, `${filename}.json`, true); // true = no BOM, see https://github.com/eligrey/FileSaver.js/issues/160
  }

  extractTables(data){
    
    let restOfFile = data;
    let returnFile = data;
    const nameTextLength = 35;
    const tableTextLenth = 15;

    while ( restOfFile.search("lookup_table_name_ModuleBuilder") != -1)
    {
      let nameIndex = restOfFile.search("lookup_table_name_ModuleBuilder");
      let tempFile = restOfFile.substr(nameIndex+nameTextLength);
      let endNameIndex = tempFile.search("\"");
      let fileName = tempFile.substr(0,endNameIndex);

      let tableIndex = restOfFile.search("lookuptable")
      tempFile = restOfFile.substr(tableIndex+tableTextLenth);
      let endTableIndex = tempFile.search('\"');
      let table = tempFile.substr(0,endTableIndex);
      this.downloadCsv(fileName, table)
      let removeTable = "       \""+restOfFile.substr(tableIndex, (nameIndex+nameTextLength+endNameIndex)-tableIndex)+"\",\n";
      returnFile = returnFile.replace(removeTable,'')
      restOfFile = restOfFile.substr(nameIndex+nameTextLength+endNameIndex);
    }
    

    return returnFile;
  }

  downloadCsv(filename, data){
      // the \n are getting encoded to \ + n. replace that with a line break
      data = encodeURIComponent(data);
      data = data.replace(/%5Cn/g, "%0D%0A"); 

      var element = document.createElement('a');      
      element.setAttribute('href', 'data:text/csv;charset=utf-8,' + data);
      element.setAttribute('download', filename);

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
  }

  prepareJSON(){
    let module = _.cloneDeep(this.props.module);

    // We currently save name in the state for convenience
    // In lieu of a better solution, we will just remove it here
    Object.keys(module.states).map(k => module.states[k]).forEach( s => {
      if(s['name'] !== undefined){
        delete s.name;
      }
    })

    return JSON.stringify(module, null, 2)

  }

  render() {

    let classDetails = "hide", style = {display: 'none'}

    if(this.props.visible){
      classDetails = "show";
      style = {display: 'block'}
    }

    return (
      <div className='Download'>
        <div className={`modal ${classDetails}`} style={style}>
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Download Module</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.props.onHide}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body Download-body">
              <textarea ref="codeInput" disabled value={this.prepareJSON()} />
              </div>
              <div className="modal-footer">
                <label> NOTE: Table Transitions will appear slightly different in the downloaded file</label>
                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this.onDownload}>Download</button>
                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this.props.onHide}>Close</button>
              </div>
            </div>
          </div>
        </div>
        <div className={`modal-backdrop ${classDetails}`} style={style}/>
      </div>
    )
  }
}

export default Download;
