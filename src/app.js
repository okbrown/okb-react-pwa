import React from 'react';
import { render } from 'react-dom';
import registerServiceWorker from './pwa/registerServiceWorker';
import Main from './components/main';

let newDiv = document.createElement("div");
let container = document.body.appendChild(newDiv);
render(<Main/>, container);
registerServiceWorker();