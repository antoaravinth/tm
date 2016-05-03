import React from "react";
import { Row,Tab,Nav,NavItem,Col,FormGroup,ControlLabel,Button,FormControl,Alert} from 'react-bootstrap';

export class BookmarkComponent extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {edit : false,newBookmarkname: props.bookmark.attributes.name, newUrl: props.bookmark.attributes.url,errorMessage: ""};
  	}

	componentDidMount() {
		console.log("mounting happened")
	    // Whenever there may be a change in the Backbone data, trigger a reconcile.
	    this.getBackboneModels().forEach(function(model) {
	      model.on('remove', this.forceUpdate.bind(this, null), this);
	    }, this);
	}

	componentWillUnmount() {
		// Ensure that we clean up any dangling references when the component is
		// destroyed.
		console.log("unmounting.")
		this.getBackboneModels().forEach(function(model) {
		  model.off(null, null, this);
		}, this);
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
	  		bookmark.save({name:this.state.newBookmarkname,url:this.state.newUrl},{
	  			url: '/api/folders/' + this.props.folder.attributes._id + '/bookmarks/' + bookmark.attributes._id,
	  			wait : true,
	  			error : (model,response) => {
					let errorMessage = JSON.parse(response.responseText)
					this.setState({errorMessage : errorMessage.message })
				},
				wait : true, 
				success : (model,response) => {
					this.setState({edit:!this.state.edit,newBookmarkname:"",errorMessage: "",newUrl:""})
				}
	  		});
	  	}
  	}

  	_newBookmark(){

  	}

  	_deleteBookmark(){
  		let folderId = this.props.folder.attributes._id;
		let removeBookmark = this.props.bookmark;
		console.log(removeBookmark)
		removeBookmark.destroy({ 
			wait : true,
			url: "/api/folders/" + folderId + "/bookmarks/" + this.props.bookmark.attributes._id, 
			success : (model,response) => {
				console.log(model)
				console.log("bookmark remvoed")
				// this.props.folder.collection.fetch()
			},
			error : (model,response) => {
				console.log(" error bookmark remvoed")
				console.log(response)
			}
		})
  	}

	render() {
		let bookmark = this.props.bookmark;
		return (
			<div>
				<Tab.Content animation>
			          <Tab.Pane eventKey={this.props.folder.attributes._id}>
		            		<div key={bookmark.attributes._id}>

		            			{this.state.errorMessage != "" &&
		            				<Alert bsStyle="warning">
									    <strong>Error</strong> {this.state.errorMessage}
									</Alert>
		            			}

		            			{!this.state.edit &&
		            				<div>
				            			<b>id :</b><p>{bookmark.attributes._id}</p>
				            			<b>name :</b><p>{bookmark.attributes.name}</p>
				            			<b>url :</b><p>{bookmark.attributes.url}</p>
			            			</div>
			            		}
			            		{this.state.edit &&
			            			<form>
									    <FormGroup controlId="formControlsText">
									      <ControlLabel>Edit bookmarkname Name</ControlLabel>
									      <FormControl type="text" placeholder="bookmarkname" onChange={(e) => this.setState({newBookmarkname : e.target.value})} defaultValue={bookmark.attributes.name}/>
									      <FormControl type="text" placeholder="url" onChange={(e) => this.setState({newUrl : e.target.value})} defaultValue={bookmark.attributes.url}/>
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