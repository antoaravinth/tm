import React from "react";
import { Row,Tab,Nav,NavItem,Col,FormGroup,ControlLabel,Button,FormControl,Alert} from 'react-bootstrap';
import _ from 'underscore';

export class BookmarkComponent extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {
	    	edit : false,
	    	newBookmarkname: props.bookmark.name, 
	    	newUrl: props.bookmark.url,
	    	errorMessage: "",
	    	move : false,
	    	destFolderId : "default"
	    };
  	}

	getBackboneModels() {
		return [this.props.bookmark]
	}

  	_updateBookmark(){
  		let bookmark = this.props.bookmark;

  		if(this.state.newBookmarkname.trim() == "")
  			this.setState({errorMessage : "Bookmarkname shouldn't be empty"})
  		else if(this.state.newBookmarkname.length >= 8)
  			this.setState({errorMessage : "Bookmarkname can't be more than 8 chars"})
  		else if(this.state.newUrl.trim() == "")
  			this.setState({errorMessage : "Url can't be empty"})
  		else
  		{
  			bookmark.name = this.state.newBookmarkname;
  			bookmark.url = this.state.newUrl;
  			this.props.folder.save({bookmarkname:this.state.newBookmarkname ,url:this.state.newUrl},
  			{
				url: '/api/folders/' + this.props.folder.attributes._id + '/bookmarks/' + bookmark._id,
				type: 'PUT',
				wait : true,
				parse: false,
				success : (model,response) => {
					this.setState({edit:!this.state.edit,newBookmarkname:"",errorMessage: "",newUrl:""})
				},
				error : (model,response) => {
					alert(response)
				}
			});
	  	}
  	}

  	_moveBookmark(){
  		let bookmark = this.props.bookmark , 
  		    bookmarkname = bookmark.name, url = bookmark.url, 
  		    destFolder , folderCollection = this.props.folder.collection , newBookmark ,
  		    bookmarkArray;

  		if(this.state.destFolderId === "default")
  			this.setState({errorMessage : "Specify folder to be moved"})
  		else{
  			this._deleteBookmark(this.props.bookmark._id,() => {

  				destFolder = folderCollection.get({_id : this.state.destFolderId});
  				bookmarkArray = destFolder.get("bookmarks");
				newBookmark = {
					name : bookmarkname,
					url : url
				}
				bookmarkArray.push(newBookmark)
				destFolder.set("bookmarks",bookmarkArray);

				destFolder.save({folderid:this.state.destFolderId, bookmarkname:bookmarkname, url : url},
				{
					url: '/api/folders/' + this.props.folder.attributes._id + '/bookmarks/',
					parse  : false,
					type: 'POST',
					wait: true,
					success : (model,response) => {
						newBookmark._id = response.bookmarkid;
						alert("Bookmark moved successfully");
					},
					error : (model,response) => {
						alert(response.responseText);
					}
				})
  			})
  		}
  	}

  	_deleteBookmark(bookmarkId,cb){
  		let bookmarkArray = _.clone(this.props.folder.get("bookmarks"));

  		let updateBookmark = _.filter(bookmarkArray,(bookmark) => {
  			return bookmark._id != bookmarkId;
  		})

  		this.props.folder.save({},{
  			url: '/api/folders/' + this.props.folder.attributes._id + '/bookmarks/' + this.props.bookmark._id,
  			type: 'DELETE',
  			wait : true,
  			parse : false,
  			success : (model,response) => {
				this.props.folder.set('bookmarks', updateBookmark);
				if(typeof cb === "function")
					cb();
				else
					alert("Bookmark deleted successfully");
			},
			error : (model,response) => {
				alert(response)
			}
  		})
  	}

	render() {
		let bookmark = this.props.bookmark;
		return (
			<div>
				<Tab.Content animation>
			          <Tab.Pane eventKey={this.props.folder.attributes._id}>
		            		<div key={bookmark._id}>

		            			{this.state.errorMessage != "" &&
		            				<Alert bsStyle="warning">
									    <strong>Error</strong> {this.state.errorMessage}
									</Alert>
		            			}

		            			{!this.state.edit &&
		            				<div>
				            			<b>Bookmarkname :</b><p>{bookmark.name}</p>
				            			<b>url :</b><p>{bookmark.url}</p>
			            			</div>
			            		}
			            		{this.state.edit &&
			            			<form>
									    <FormGroup controlId="formControlsText">
									      <ControlLabel>Edit bookmarkname Name</ControlLabel>
									      <FormControl type="text" placeholder="bookmarkname" onChange={(e) => this.setState({newBookmarkname : e.target.value})} defaultValue={bookmark.name}/>
									      <FormControl type="text" placeholder="url" onChange={(e) => this.setState({newUrl : e.target.value})} defaultValue={bookmark.url}/>
									    </FormGroup>
								    </form>
			            		}

			            		{!this.state.move && !this.state.edit && this.props.folder.collection.length != 1 &&
				            		<Button style={{float: "right"}} bsSize="xsmall" onClick={() => this.setState({move : true})}>
				            			Move
			            			</Button>
			            		}

		            			{this.state.move && 
		            				<FormGroup controlId="formControlsSelect">
								      <ControlLabel>Move To</ControlLabel>
								      <FormControl componentClass="select" placeholder="select" onChange={(e) => this.setState({destFolderId : e.target.value})} defaultValue="default">
								        <option value="default">select</option>
								        {
								        	this.props.folder.collection.map((folder) => {
								        		if(this.props.folder.attributes._id !== folder.attributes._id)
								        			return <option key={folder.attributes._id} value={folder.attributes._id}>{folder.attributes.name}</option>
		            						})
		            					}
								      </FormControl>
								      <Button style={{float: "right"}} bsSize="xsmall" onClick={this._moveBookmark.bind(this)}>
								      	Move Now!
								      </Button>

								    </FormGroup>
		            			}

			            		
			            		{!this.state.edit && !this.state.move &&
				            		<Button style={{float: "right"}} bsSize="xsmall" onClick={this._deleteBookmark.bind(this,this.props.bookmark._id)}>
				            			Delete
			            			</Button>
		            			}

			            		{this.state.edit && !this.state.move &&
			            			<Button style={{float: "right"}} bsSize="xsmall" onClick={this._updateBookmark.bind(this)}>
			            				Save
			            			</Button>
			            		}

			            		{!this.state.move &&
				            		<Button style={{float: "right"}} bsSize="xsmall" onClick={() => this.setState({edit : !this.state.edit})}>
				            			{this.state.edit && 'Cancel'}
				            			{!this.state.edit && 'Edit'}
				            		</Button>
				            	}

			            		<br />
		            			<hr />
		            		</div>
			          </Tab.Pane>
			    </Tab.Content>
		    </div>)
	}
}

export default BookmarkComponent;