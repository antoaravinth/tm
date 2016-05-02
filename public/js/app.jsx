import {FolderComponent} from './views/folder.jsx'
import React from 'react';
import ReactDOM from 'react-dom';
import FolderCollections from './collections/folders.js'

window.FolderCollections = FolderCollections

let folders = new FolderCollections();
folders.fetch({
	success : () => ReactDOM.render(<FolderComponent folders={folders}/>, document.querySelector("#content"))
})

