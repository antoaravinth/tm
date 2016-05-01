var express = require('express'), app = express(), bodyParser = require('body-parser') , mongoose = require('mongoose'),
 	port = 8080 , router = express.Router() , Schema = require('./app/models/folder.js') , Folder = Schema.Folder , 
 	Bookmark = Schema.Bookmark;


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

router.get('/', function(req, res) {
    // res.json({ message: 'Hello world' });   
    res.sendfile('./public/index.html');
});

//REST API for bookmarks
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
	  .delete(function(req,res){
	  		Folder.find({name:req.body.foldername})
	  			  .remove(function(err,success){
	  			  		if(err)
	  			  			res.send(err);
	  			  		else
	  			  			res.json({message : 'Folder deleted successfully'});
	  			  })
	  })

router.route('/bookmarks')
	  .post(function(req,res){

	  		var query = {name : req.body.foldername} , updatedBookmarks ,
	  			bookmark = new Bookmark();

			Folder.findOne(query,'bookmarks',function(err, oldBookmarks){

				if(err || oldBookmarks === null)
					return res.send({error: "Folder not found."});

				updatedBookmarks = oldBookmarks
				bookmark.name = req.body.bookmarkname;
	  			bookmark.url = req.body.url;

	  			updatedBookmarks.bookmarks.push(bookmark)
	  			console.log(updatedBookmarks)

				Folder.findOneAndUpdate(
	  			query,
	  			{ $set: { "bookmarks": updatedBookmarks.bookmarks } }, 
	  			{upsert:true}, 
	  			function(err, doc){
				    if (err) return res.send(err);
				    return res.send("succesfully saved");
				});
			})
		})

//routes will be prefixed with apis
app.use('/api', router);

//connect to the remote db
mongoose.connect('localhost:27017/collections')

app.listen(port);
console.log('server started on ' + port);


