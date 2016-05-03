var express = require('express'), app = express(), bodyParser = require('body-parser') , mongoose = require('mongoose'),
 	port = 8080 , router = express.Router() , Schema = require('./app/models/folder.js') , Folder = Schema.Folder , 
 	Bookmark = Schema.Bookmark;


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

router.get('/', function(req, res) {
    res.sendfile('./public/index.html');
});

router.get('/dist/bundle.js', function(req, res) {
    res.sendfile('./public/dist/bundle.js');
});

//REST API for folders
router.route('/folders')
	  .post(function(req,res){
	  		var folder = new Folder();
  			folder.name = req.body.name;

  			folder.save(function(err,response){
  				if(err)
	  				res.status(500).send(err);
	  			else
	  				res.json({message : 'Folder saved successfully',_id:response._id});
  			})
	  })
  	  .get(function(req,res){
		  	Folder.find(function(err,folders){
		  		if(err)
		  			res.send(err);
		  		else
		  			res.json(folders)
		  	})
	  })

//REST for single documents
router.route('/folders/:folderid')
	.get(function(req,res){
		  	Folder.find({_id:req.params.folderid},function(err,folder){
		  		if(err)
		  			res.send(err);
		  		else
		  			res.json(folder)
		  	})
	  })
	  .put(function(req,res){
		  	Folder.find({_id:req.params.folderid},function(err,folder){
		  		if(err)
		  			res.send(err);

		  		if(folder.length != 0)
		  		{
			  		folder[0] = req.body;

			  		folder[0].save(function(err){
			  			if(err)
			  				res.send(err);
			  			else
			  				res.json({ message: 'Folder updated successfully' });
			  		})
			  	} 
			  	else
			  		res.json({ message: 'Folder not found' });
		  	})
	  })
	  .delete(function(req,res){
	  		Folder.find({_id:req.params.folderid})
	  			  .remove(function(err,success){
	  			  		if(err)
	  			  			res.send(err);
	  			  		else
	  			  			res.json({message : 'Folder deleted successfully'});
	  			  })
	  })
	  .patch(function(req,res){
	  		Folder.find({_id:req.params.folderid},function(err,folder){
		  		if(err)
		  			res.send(err);

		  		if(folder.length != 0)
		  		{
			  		folder[0].name = req.body.name;

			  		folder[0].save(function(err){
			  			if(err)
			  				res.status(500).send(err);
			  			else
			  				res.status(200).json({ message: 'Folder updated successfully' });
			  		})
			  	} 
			  	else
			  		res.json({ message: 'Folder not found' });
		  	})
	  })

//REST API for bookmarks
router.route('/bookmarks')
	  .post(function(req,res){

	  		var query = {_id : req.body.folderid} , updatedBookmarksRef ,
	  			bookmark = new Bookmark();

			Folder.findOne(query,'bookmarks',function(err, folder){

				if(err || folder === null)
					return res.send({error: "Folder not found."});

				updatedBookmarksRef = folder.bookmarks
				bookmark.name = req.body.name;
	  			bookmark.url = req.body.url;

	  			updatedBookmarksRef.push(bookmark)
	  			console.log(updatedBookmarksRef)

				Folder.findOneAndUpdate(
	  			query,
	  			{ $set: { "bookmarks": updatedBookmarksRef } }, 
	  			{upsert:true}, 
	  			function(err, response){
				    if (err) return res.send(err);
				    return res.json({message : "Bookmark saved successfully",_id:response._id});
				});
			})
		})

//REST API for single documents
router.route('/folders/:folderid/bookmarks/:bookmarkid')
	  .delete(function(req,res){
	  		var query = {_id : req.params.folderid} , bookmark;

			Folder.findOne(query,'bookmarks',function(err, folder){

				if(err || folder === null)
					return res.send({error: "Folder not found."});

				bookmark = folder.bookmarks.id(req.params.bookmarkid);
				if(bookmark != undefined || bookmark != null)
				{
					bookmark.remove();
					folder.save(function (err) {
				  	if(err)
				  		res.send(err);
				  	  else
	  			  		res.json({message : 'Bookmark deleted successfully'});
					});
				}
				else
					res.json({error: 'Bookmark not found'})
			})
	  })
	  .get(function(req,res){
	  		var query = {_id : req.params.folderid} , bookmark;

			Folder.findOne(query,'bookmarks',function(err, folder){

				if(err || folder === null)
					return res.send({error: "Folder not found."});

				bookmark = folder.bookmarks.id(req.params.bookmarkid);
				if(bookmark != undefined || bookmark != null) 
					res.send(bookmark)
				else
					res.json({error: 'Bookmark not found'})
			})
	  })
	  .put(function(req,res){
	  		var query = {_id : req.params.folderid} , updatedBookmarksRef ,
	  			bookmark = new Bookmark();

			Folder.findOne(query,'bookmarks',function(err, folder){

				if(err || folder === null)
					return res.send({error: "Folder not found."});

				bookmark = folder.bookmarks.id(req.params.bookmarkid);
				if(bookmark != undefined || bookmark != null)
				{
					bookmark.name = req.body.name;
					bookmark.url = req.body.url;
					folder.save(function (err) {
				  	if(err)
				  		res.send(err);
				  	  else
	  			  		res.json({message : 'Bookmark updated successfully'});
					});
				}
				else
					res.json({error: 'Bookmark not found'})
			})
	  })

//routes will be prefixed with apis
app.use('/api', router);

//connect to the remote db
mongoose.connect('localhost:27017/collections')

app.listen(port);
console.log('server started on ' + port);



/*
let folders = new FolderCollections();
var model = folder.at(0)
model.set({name:"frombackbone1"})
*/


