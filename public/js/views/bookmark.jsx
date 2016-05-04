import React from "react";
import { Row,Tab,Nav,NavItem,Col,FormGroup,ControlLabel,Button,FormControl,Alert} from 'react-bootstrap';
import _ from 'underscore';

export class BookmarkComponent extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {edit : false,newBookmarkname: props.bookmark.name, newUrl: props.bookmark.url,errorMessage: ""};
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

  	_newBookmark(){

  	}

  	_deleteBookmark(){
  		let bookmarkArray = _.clone(this.props.folder.get("bookmarks"));

  		let updateBookmark = _.filter(bookmarkArray,(bookmark) => {
  			return bookmark._id != this.props.bookmark._id;
  		})

  		this.props.folder.save({},{
  			url: '/api/folders/' + this.props.folder.attributes._id + '/bookmarks/' + this.props.bookmark._id,
  			type: 'DELETE',
  			wait : true,
  			parse : false,
  			success : (model,response) => {
				this.props.folder.set('bookmarks', updateBookmark);
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
				            			<b>id :</b><p>{bookmark._id}</p>
				            			<b>name :</b><p>{bookmark.name}</p>
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

			            		
			            		{!this.state.edit &&
				            		<Button style={{float: "right"}} bsSize="xsmall" onClick={this._deleteBookmark.bind(this)}>
				            			Delete
			            			</Button>
		            			}

			            		{this.state.edit &&
			            			<Button style={{float: "right"}} bsSize="xsmall" onClick={this._updateBookmark.bind(this)}>
			            				Save
			            			</Button>
			            		}

			            		<Button style={{float: "right"}} bsSize="xsmall" onClick={() => this.setState({edit : !this.state.edit})}>
			            			{this.state.edit && 'Cancel'}
			            			{!this.state.edit && 'Edit'}
			            		</Button>

			            		<br />
		            			<hr />
		            		</div>
			          </Tab.Pane>
			    </Tab.Content>
		    </div>)
	}
}

export default BookmarkComponent;