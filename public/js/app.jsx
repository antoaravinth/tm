import Folder from './models/folder.js'
import FirstComponent from './views/main.jsx'
import React from 'react';
import ReactDOM from 'react-dom';
import FolderCollections from './collections/folders.js'

window.Folder = Folder
window.FolderCollections = FolderCollections
ReactDOM.render(<FirstComponent />, document.querySelector("#content"));