import React, { Component } from 'react';
import FileSaver from 'file-saver';

import './Code.css';

class Code extends Component {

  constructor(props){
    super(props)
    this.onDownload = this.onDownload.bind(this)
  }

  onDownload(){
    let blob = new Blob([this.refs.codeInput.value], {
       type: "text/plain;charset=utf-8"
    });

    FileSaver.saveAs(blob, 'synthea_module.json');
  }

  render() {

    let classDetails = "hide", style = {display: 'none'}

    if(this.props.visible){
      classDetails = "show";
      style = {display: 'block'}
    }

    return (
      <div className='Code'>
        <div className={`modal ${classDetails}`} style={style}>
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Module Code</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.props.onHide}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body Code-body">
              <textarea ref="codeInput" defaultValue={JSON.stringify(this.props.code,null, 2)} />
              </div>
              <div className="modal-footer">
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

export default Code;
