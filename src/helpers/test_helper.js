import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-dom/test-utils';
import jsdom from 'jsdom';
import chai, { expect } from 'chai';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from '../reducers';

function renderComponent(ComponentClass, props= {}, state={}) {
  const div = document.createElement('div');
  return ReactDOM.render(
    <Provider store={createStore(reducers, state)}>
      <ComponentClass {...props} />
    </Provider>
  , div);

}

export {renderComponent, expect};
