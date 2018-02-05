import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'


ReactDOM.render(<App />, document.getElementById('root'));

// Do not use service workers because they cause unexpected behavior and we
// are not interested in offline modes currently. Unregister to clear out
// previous registered service workers for people that have already visited
// the app.
serviceWorker.unregister();
