import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { HashRouter as Router } from 'react-router-dom';
import App from './App';
import { Provider } from 'react-redux';
import store from './app/redux/store/store';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
);
