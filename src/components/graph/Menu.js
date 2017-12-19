import React, { Component } from 'react';

import './Menu.css';

import type { Module } from './types/Module';

export default function Menu(props) {
  return (
    <nav className="navbar fixed-top navbar-expand-lg navbar-light bg-light">
      <a className="navbar-brand" href="#">Synthea Module Builder</a>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div className="navbar-nav">
          <button className="btn btn-link nav-item nav-link" onClick={props.onNewModuleClick.bind(this, props.moduleCount)}>New Module</button>
          <button className="btn btn-link nav-item nav-link" onClick={props.onLoadModuleClick}>Load Module</button>
          <button className="btn btn-link nav-item nav-link" onClick={props.onShowCodeClick}>Save</button>
        </div>
      </div>
    </nav>
  );
}
