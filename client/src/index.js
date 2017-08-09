import React from 'react';
import { render } from 'react-dom';
import './styles/styles.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

render(<App />, document.getElementById('root'));

registerServiceWorker();
