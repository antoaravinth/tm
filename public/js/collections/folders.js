import Backbone from 'backbone'
import _ from 'underscore'

var { Collection , Model } = Backbone;

//Model
export var Folder = Backbone.Model.extend({
    idAttribute: '_id',
    defaults: {
		name: "",
		bookmarks : []
	}
});

//Collection
var FolderCollections = Backbone.Collection.extend({
  url: "/api/folders",
  model: Folder,
});

Folder.bind("remove", () => this.destroy());

export default FolderCollections