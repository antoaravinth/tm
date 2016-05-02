import Backbone from 'backbone'

var { Collection , Model } = Backbone;

//Model
var Folder = Backbone.Model.extend({
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


export default FolderCollections