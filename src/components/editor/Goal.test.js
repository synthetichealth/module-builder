// @flow
import React from 'react';
import ReactDOM from 'react-dom';

import { renderComponent , expect } from '../../helpers/test_helper';

import { Goal, Goals } from './Goal';

const goals = [
  {
    observation: {
      codes: [{system:"LOINC", code: '1234', display:'none'}],
      operator: '==',
      value: 5
    },
    text: "text",
    addresses: ["foo", "bar"]
  },
  {
    observation: {
      codes: [{system:"LOINC", code: '1234', display:'none'}, {system:"LOINC", code: '5678', display:'none'}],
      operator: '!=',
      value: 3
    },
    text: "text",
    addresses: ["baz"]
  }
];

const onChange = () => () => onChange;

it('renders without crashing', () => {
  renderComponent(Goal, {goal: goals[0], onChange});
})

it('renders multiple goals without crashing', () => {
  renderComponent(Goals, {goals, onChange});
})
