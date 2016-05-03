import React from "react";
import { Button , FormGroup , ControlLabel , FormControl , Alert, Col, Popover,Modal} from 'react-bootstrap';
import {BookmarkComponent} from './bookmark.jsx';
import {Popup} from './popup.jsx';
import ReactDOM from 'react-dom';

export class FolderComponent extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {
	    	edit: false , 
	    	newFolderName : props.folder.attributes.name , 
	    	errorMessage: "",
	    	showNewFolderPopUp : false,
	    	newBookmarkName : "",
	    	newUrlLink : ""
	    };
  	}

	_updateFolderName(){
		// console.log(this.props.folder)
		let model = this.props.folder

		//run few validations
		if(this.state.newFolderName.trim() === "")
			this.setState({errorMessage : "Folder name can't be empty"})
		else if(this.state.newFolderName.length >= 8)
			this.setState({errorMessage : "Folder name cant be more than 8 chars"})
		else{
			//good to go update.
			model.save({name:this.state.newFolderName},{
				patch:true,
				error : (model,response) => {
					console.log(response.responseText)
					let errorMessage = JSON.parse(response.responseText)
					if(errorMessage.name != undefined){
						this.setState({errorMessage : errorMessage.errors.name.message })
					} else
						this.setState({errorMessage : errorMessage.message })
				},
				wait : true, 
				success : (model,response) => {
					this.setState({edit:!this.state.edit,newFolderName:"",errorMessage: ""})
				}
			});
		}
	}

	_deleteFolder(){
		let folderId = this.props.folder.attributes._id;
		let removeFolder = this.props.folderCollection.get({_id:folderId});
		removeFolder.destroy({ 
			url: "/api/folders/" + folderId, 
			success : (model,response) => {
				// removeFolder.collection.remove(removeFolder)
				// ReactDOM.render(<Popup />,document.querySelector("#error"));
			},
			error : (model,response) => {

			}
		})
	}

	_saveNewBookmark(){
		this.setState({showNewFolderPopUp: false})
		this.props.folder.save(
			{folderid:this.props.folder.attributes._id, name:this.state.newBookmarkName, url : this.state.newUrlLink},
			{
				url:"/api/bookmarks/",
				type: 'POST',
				success : (model,response) => {
					// this.props.folderCollection.fetch()
					model.trigger('add')
				}
			})
	}

	render() {
		let folder = this.props.folder;

		return (<div>
			{!this.state.edit && folder.attributes.name}

			{" "}
			{this.state.errorMessage != "" && this.state.edit &&
				<Alert bsStyle="warning">
				    <strong>Error</strong> {this.state.errorMessage}
				</Alert>
			}
			{this.state.edit &&
				<form>
				    <FormGroup controlId="formControlsText">
				      <ControlLabel>Edit Folder Name</ControlLabel>
				      <FormControl type="text" placeholder="Enter text" required onChange={(e) => this.setState({newFolderName : e.target.value})} defaultValue={folder.attributes.name}/>
				    </FormGroup>
			    </form>
			}

            {!this.state.edit &&
				<Button onClick={this._deleteFolder.bind(this)} style={{float: "right"}} bsSize="xsmall">
					Delete
	            </Button>	
        	}

            <Button onClick={ () => this.setState({edit:!this.state.edit}) } style={this.state.edit === true ? {} : {float: "right"}} bsSize="xsmall">

            	{this.state.edit && 'Cancel'}
            	{!this.state.edit && 'Edit'}

            </Button>

            {this.state.edit === true &&
            	<Button onClick={this._updateFolderName.bind(this)} style={{float: "right"}} bsSize="xsmall">Save</Button>
            }			

            {!this.state.edit &&
            	<Button style={{float: "right"}} bsSize="xsmall" onClick={() => this.setState({showNewFolderPopUp: true})}>Add new bookmark</Button>
            }

            {this.state.showNewFolderPopUp &&
	          <div className="modal-container" style={{height: 200}}>
		        <Modal
		          show={true}
		          onHide={() => this.setState({showNewFolderPopUp: false})}
		          aria-labelledby="contained-modal-title"
		        >
		          <Modal.Header closeButton>
		            <Modal.Title id="contained-modal-title">New Bookmark Details</Modal.Title>
		          </Modal.Header>
		          <Modal.Body>
		            <form>
					    <FormGroup controlId="formControlsText">
					      <ControlLabel>Edit Folder Name</ControlLabel>
					      <FormControl type="text" placeholder="Bookmark name" onChange={(e) => this.setState({newBookmarkName : e.target.value})} defaultValue=""/>
					      <FormControl type="text" placeholder="Bookmark url" onChange={(e) => this.setState({newUrlLink : e.target.value})} defaultValue=""/>
					    </FormGroup>
				    </form>
		          </Modal.Body>
		          <Modal.Footer>
		            <Button onClick={this._saveNewBookmark.bind(this)}>Save</Button>
		          </Modal.Footer>
		        </Modal>
		      </div>
			}

		</div>);
	}
}

export default FolderComponent; 	
