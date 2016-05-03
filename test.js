var folders = new FolderCollections()
folders.fetch()

var bookmark = folders.at(0)


var bookmark = new Bookmark({name: "",url:""})
bookmark.get("bookmarks")

folders.at(0).save({folderid:"572868afd27e836b1c344465"},{url:"/api/bookmarks/",type: 'POST'})


/*
				<Form horizontal>
				    <FormGroup controlId="folderNameId">
				      <Col componentClass={ControlLabel} sm={1}>
				        Folder Name
				      </Col>
				      <Col sm={1}>
				        <FormControl type="textbox" placeholder="foldername" onChange={(e) => this.setState({newFolderName : e.target.value})} />
				        <Button onClick={this._saveFolder.bind(this)}>
				          Submit
				        </Button>
				      </Col>
				    </FormGroup>
				</Form>
*/