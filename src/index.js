import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

// Do not use service workers because they cause unexpected behavior and we
// are not interested in offline modes currently. Unregister to clear out
// previous registered service workers for people that have already visited
// the app.
serviceWorker.unregister();
