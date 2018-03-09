// @flow
import React from 'react';
import ReactDOM from 'react-dom';

import { renderComponent , expect } from '../../helpers/test_helper';

import modulesJSON from '../../data/modules';
import LoadModule from './LoadModule';

const onHide = () => null;
const push = () => null;
const onLoadJSON = () => null;

it('renders load module modal wthout errors', () => {
  renderComponent(LoadModule, { modules: modulesJSON, visible: false, onHide, push, onLoadJSON })
});
