// @flow
import React from 'react';
import { Provider } from 'react-redux'
import { Route } from 'react-router-dom'
import { ConnectedRouter} from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'

import createAppStore from './store';
import Editor from './containers/Editor';

const history = createHistory()

const store = createAppStore(history)

const App = () => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Route path="/" component={Editor} />
      </ConnectedRouter>
    </Provider>
  );
}

export default App;
