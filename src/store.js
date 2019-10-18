import { createBrowserHistory } from 'history';
import { applyMiddleware, compose, createStore } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';

import createRootReducer from './reducers';

const initialState = {}
const enhancers = [];
const middleware = [];

if (process.env.NODE_ENV === 'development') {
  const devToolsExtension = window.devToolsExtension

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension())
  }
}

export const history = createBrowserHistory({basename: '/module-builder'})

const createAppStore = (history) => {
  middleware.push(routerMiddleware(history))
  middleware.push(thunk)
  const composedEnhancers = compose(
    applyMiddleware(...middleware),
    ...enhancers
  )

  const store = createStore(
    createRootReducer(history), // root reducer with router state
    initialState,
    composedEnhancers
  )
  return store;
}

export default createAppStore;
