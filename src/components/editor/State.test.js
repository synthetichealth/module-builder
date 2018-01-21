// @flow
import React from 'react';
import ReactDOM from 'react-dom';

import { renderComponent , expect } from '../../helpers/test_helper';

import modulesJSON from '../../mocks/modules';
import StateEditor from './State';

const onChange = () => () => onChange;
let renameNode = () => null;
let changeType = () => null;

it(`renders state editor for all states in all modules propertly without errors`, () => {
  modulesJSON.forEach( module => {
    // array of states in module
    Object.keys(module.states).map(s => (module.states[s]._key = s, module.states[s])).forEach( state => {
      // other states are all states with a different key than the one we are on
      let otherStates = Object.keys(module.states).filter( s => (s !== state._key)).map(s => (module.states[s]))
      renderComponent(StateEditor, { state, otherStates, onChange, renameNode, changeType })
    });
  });
});
