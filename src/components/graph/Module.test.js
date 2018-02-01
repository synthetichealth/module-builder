// @flow
import React from 'react';
import ReactDOM from 'react-dom';

import { renderComponent , expect } from '../../helpers/test_helper';

import modulesJSON from '../../mocks/modules';
import ModuleGraph from './Module';

const onClick = () => null;

Object.keys(modulesJSON).map(k => (modulesJSON[k])).forEach( module => {
  it(`renders ${module.name} module without crashing`, () => {
      renderComponent(ModuleGraph, { module, onClick })
  });
});
