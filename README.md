### Bookmark Application

An bookmark application in which user can add bookmarks to his account. And organise them into folders. Each bookmark will have a title and url. Bookmarks can be added to a folder. A folder will have a name. And allow the user to do the followings:

1. add & delete bookmarks.
2. create or delete folders.
3. move bookmarks to a folder.

The backend is developed in node/express and the front-end is consumed by BackBone and React. 

Backbone is used as models and React is for rendering views.

###Running:

```
1. Checkout the project
2. npm install # npm version >= 2.14.7 && node version >= v4.2.0
3. npm install -g webpack 
4. webpack --minimize
5. npm start # start the server
```

Make sure you have mongodb installed and running on the default port. 

###Helper Scripts

Run 

```
sh dev.sh
```

this will produces full js build and start node server, which will be helpful for dev mode. 

If you do:

```
sh prod.sh
```

webpack provides minified js file and starts the node server.

These scripts will work on Mac and Linux machines. 

