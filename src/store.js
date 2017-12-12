import { createStore, applyMiddleware, compose } from 'redux';

import rootReducer from './reducers';

import { extractStates } from './transforms/Module';

import moduleJSON from './mocks/module';



const initialState = {modules: [extractStates(moduleJSON)]};
const enhancers = [];
const middleware = [];

if (process.env.NODE_ENV === 'development') {
  const devToolsExtension = window.devToolsExtension

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension())
  }
}

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers
)

const store = createStore(
  rootReducer,
  initialState,
  composedEnhancers
)

export default store;
