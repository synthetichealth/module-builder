// @flow
import React from 'react';
import ReactDOM from 'react-dom';

import { renderComponent , expect } from '../../helpers/test_helper';

import { ValueSet, ValueSets } from './ValueSet';

const valueSets = [{url:"http://foo.com", display:'Foo Valueset'}]

const onChange = () => () => onChange;

it('renders without crashing', () => {
  renderComponent(ValueSet, {valueset: valueSets[0], onChange});
})

it('renders multiple codes without crashing', () => {
  renderComponent(ValueSets, {valueSets, onChange});
})
