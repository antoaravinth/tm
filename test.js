var folders = new FolderCollections()
folders.fetch()

var bookmark = folders.at(0)


var bookmark = new Bookmark({name: "",url:""})
bookmark.get("bookmarks")

folders.at(0).save({folderid:"572868afd27e836b1c344465"},{url:"/api/bookmarks/",type: 'POST'})