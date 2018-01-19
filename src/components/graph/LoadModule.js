import React, { Component } from 'react';
import './LoadModule.css';

class LoadModule extends Component {

  render() {

    let classDetails = "hide", style = {display: 'none'}

    if(this.props.visible){
      classDetails = "show";
      style = {display: 'block'}
    }

    return (
      <div>
        <div className={`modal ${classDetails}`} style={style}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Load Module</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.props.onHide}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body LoadModule-body">
              <ul>
                { this.props.modules.map( (module, index) => {
                    return (
                       <li key={module.name}><button className='btn btn-link' onClick={this.props.onSelectModule.bind(this, index)}>{module.name}</button></li>
                    )
                  })
                }
                </ul>
              </div>
              <div className="modal-footer">
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

export default LoadModule;
