import Folder from './models/folder.js'
import { zip } from 'lodash';
import FirstComponent from './views/main.jsx'
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(<FirstComponent />, document.querySelector("#content"));