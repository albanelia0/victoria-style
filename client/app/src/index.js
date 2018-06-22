import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import 'bulma/css/bulma.css'
import 'font-awesome/css/font-awesome.min.css'
import './design/index.css'
import './design/home.css'
import './design/dropdown.css'
import './design/App.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'


ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
   document.getElementById('root')
);
registerServiceWorker();
