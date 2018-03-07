// @flow
import React from 'react';
import ReactDOM from 'react-dom';

import { renderComponent , expect } from '../../helpers/test_helper';

import modulesJSON from '../../data/modules';
import StateEditor from './State';
import { extractStates } from '../../transforms/Module';

const onChange = () => () => onChange;
let renameNode = () => null;
let changeType = () => null;
let helpFunction = () => null;



describe(`renders state editor for all states in all modules propertly without errors`, () => {
  Object.keys(modulesJSON).map(k => (modulesJSON[k])).forEach( module => {
      let moduleStates = extractStates(module);
        moduleStates.forEach(state => {
          it(`renders ${module.name}:${state.name}`, () => {
            renderComponent(StateEditor, {  moduleName: module.name, state, otherStates: moduleStates, onChange, renameNode, changeType, helpFunction })
          });
        });
  });
});
