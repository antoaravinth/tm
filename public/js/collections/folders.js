import Backbone from 'backbone'
import _ from 'underscore'

var { Collection , Model } = Backbone;

//Model
export var Folder = Backbone.Model.extend({
    idAttribute: '_id',
    defaults: {
		name: "",
		bookmarks : []
	},
	initialize: function() {
		let bookmarkModels = []
		console.log(this.get('bookmarks'))
		this.get('bookmarks').forEach(function(bookmark){
			bookmarkModels.push(new Bookmark(bookmark)) 
		})
        this.set({ 
        	'bookmarks' : bookmarkModels
        })
    }
});

export var Bookmark = Backbone.Model.extend({
    idAttribute: '_id',
    defaults: {
		name: "",
		url : ""
	}
});

//Collection
var FolderCollections = Backbone.Collection.extend({
  url: "/api/folders",
  model: Folder,
});

// Folder.bind("remove", () => this.destroy());
// Bookmark.bind("remove", () => this.destroy());

export default FolderCollections