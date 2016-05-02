import $ from 'jquery'
import Backbone from 'backbone'

var { Model, View, Collection, Router, LocalStorage } = Backbone;

var Folder = Backbone.Model.extend({
    idAttribute: '_id',
    defaults: {
		name: "",
		bookmarks : []
	}
});
export default Folder