import Backbone from 'backbone'
import {Folder} from '../models/folder.js'

var { Collection } = Backbone;

var FolderCollections = Backbone.Collection.extend({
  url: "/api/folders",
  model: Folder,
});
export default FolderCollections