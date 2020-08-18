// @flow
import React from 'react';
import ReactDOM from 'react-dom';

import { renderComponent , expect } from '../../helpers/test_helper';

import { Code, Codes } from './Code';

const codes = [{system:"RxNorm", code: '1234', display:'none', value_set: 'http://snomed.info/sct?fhir_vs=ecl/<<404684003:363698007=<<66019005&filter=ilium'},
{system:"SNOMED", code: '5678', display:'none'}]

const onChange = () => () => onChange;

it('renders without crashing', () => {
  renderComponent(Code, {code: codes[0], onChange});
})

it('renders multiple codes without crashing', () => {
  renderComponent(Codes, {codes, onChange});
})
