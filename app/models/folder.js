var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
var Bookmark = require("./bookmark")

var BookmarkSchema = new Schema({
	name : { type: String},
	url : { type : String}
});

var FolderSchema = new Schema({
	name : { type: String, required: true, unique: true },
	bookmarks : [BookmarkSchema]
});

FolderSchema.plugin(uniqueValidator, { message: 'Error, expected folder name to be unique.' });

module.exports = { 
	Folder : mongoose.model('Folder',FolderSchema),
	Bookmark : mongoose.model('Bookmark',BookmarkSchema)
}