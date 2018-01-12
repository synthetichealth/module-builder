// @flow
import React from 'react';
import ReactDOM from 'react-dom';

import { renderComponent , expect } from '../../helpers/test_helper';

import modulesJSON from '../../mocks/modules';
import ModuleGraph from './Module';

const onClick = () => null;

modulesJSON.forEach( module => {
  it(`renders ${module.name} module without crashing`, () => {
      renderComponent(ModuleGraph, { module, onClick })
  });
});
