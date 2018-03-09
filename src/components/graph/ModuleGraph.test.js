// @flow
import React from 'react';
import ReactDOM from 'react-dom';

import { renderComponent , expect } from '../../helpers/test_helper';

import modulesJSON from '../../data/modules';
import ModuleGraph from './ModuleGraph';

const onClick = () => null;

Object.keys(modulesJSON).map(k => (modulesJSON[k])).forEach( module => {
  it(`renders ${module.name} module without crashing`, () => {
    renderComponent(ModuleGraph, { module, onClick })
  });
});

it('does not crash when a passed a module with a state of the wrong type', () => {
  renderComponent(ModuleGraph, { module: {name: 'Test', states: {state1: 'string and not an object as it should be'}}, onClick })
})
