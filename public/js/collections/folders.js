import Backbone from 'backbone'
import _ from 'underscore'

var { Collection , Model } = Backbone;

//Model
export var Folder = Backbone.Model.extend({
    idAttribute: '_id',
    defaults: function() {
    	return {
			name: "",
			bookmarks : []
		}
	},
	parse: function(resp,options) {
	  // don't update model with the server response if {parse:false} is passed to save
	  if (!options.parse)  {
	  	return this.attributes;
	  }

	  return resp;
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

export default FolderCollections