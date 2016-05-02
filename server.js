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
  			folder.name = req.body.foldername;

  			folder.save(function(err){
  				if(err)
	  				res.send(err);
	  			else
	  				res.json({message : 'Folder saved successfully'});
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
router.route('/folders/:foldername')
	.get(function(req,res){
		  	Folder.find({name:req.params.foldername},function(err,folder){
		  		if(err)
		  			res.send(err);
		  		else
		  			res.json(folder)
		  	})
	  })
	  .put(function(req,res){
		  	Folder.find({name:req.params.foldername},function(err,folder){
		  		if(err)
		  			res.send(err);

		  		if(folder.length != 0)
		  		{
			  		folder[0].name = req.body.foldername;

			  		folder[0].save(function(err){
			  			if(err)
			  				res.send(err);
			  			
			  			res.json({ message: 'Folder updated successfully' });
			  		})
			  	} 
			  	else
			  		res.json({ message: 'Folder not found' });
		  	})
	  })
	  .delete(function(req,res){
	  		Folder.find({name:req.params.foldername})
	  			  .remove(function(err,success){
	  			  		if(err)
	  			  			res.send(err);
	  			  		else
	  			  			res.json({message : 'Folder deleted successfully'});
	  			  })
	  })

//REST API for bookmarks
router.route('/bookmarks')
	  .post(function(req,res){

	  		var query = {name : req.body.foldername} , updatedBookmarksRef ,
	  			bookmark = new Bookmark();

			Folder.findOne(query,'bookmarks',function(err, folder){

				if(err || folder === null)
					return res.send({error: "Folder not found."});

				updatedBookmarksRef = folder.bookmarks
				bookmark.name = req.body.bookmarkname;
	  			bookmark.url = req.body.url;

	  			updatedBookmarksRef.push(bookmark)
	  			console.log(updatedBookmarksRef)

				Folder.findOneAndUpdate(
	  			query,
	  			{ $set: { "bookmarks": updatedBookmarksRef } }, 
	  			{upsert:true}, 
	  			function(err, doc){
				    if (err) return res.send(err);
				    return res.json({message : "Bookmark saved successfully"});
				});
			})
		})

//REST API for single documents
router.route('/folders/:foldername/bookmarks/:bookmarkid')
	  .delete(function(req,res){
	  		var query = {name : req.params.foldername} , bookmark;

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
	  		var query = {name : req.params.foldername} , bookmark;

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
	  		var query = {name : req.params.foldername} , updatedBookmarksRef ,
	  			bookmark = new Bookmark();

			Folder.findOne(query,'bookmarks',function(err, folder){

				if(err || folder === null)
					return res.send({error: "Folder not found."});

				bookmark = folder.bookmarks.id(req.params.bookmarkid);
				if(bookmark != undefined || bookmark != null)
				{
					bookmark.name = req.body.bookmarkname;
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


