import React from "react";
import { Button , FormGroup , ControlLabel , FormControl , Alert, Col, Popover,Modal,Form} from 'react-bootstrap';
import {BookmarkComponent} from './bookmark.jsx';
import {Popup} from './popup.jsx';
import ReactDOM from 'react-dom';
import _ from 'underscore';

export class FolderComponent extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {
	    	edit: false , 
	    	newFolderName : props.folder != undefined ? props.folder.attributes.name : "" , 
	    	errorMessage: "",
	    	showNewFolderPopUp : false,
	    	newBookmarkName : "",
	    	newUrlLink : "",
	    	newFolderPopUp: false
	    };
  	}


  	_validateFolderName(){
  		if(this.state.newFolderName.trim() === "")
  		{
			this.setState({errorMessage : "Folder name can't be empty"})
			return false
  		}
		else if(this.state.newFolderName.length >= 8)
		{
			this.setState({errorMessage : "Folder name cant be more than 8 chars"})
			return false
		}

		return true;
  	}

	_saveFolder(){
		let folders = this.props.folders;
		if(this._validateFolderName()){
			this.setState({newFolderPopUp : false})
			folders.add({name : this.state.newFolderName});
			let newfolder = folders.at(folders.length - 1)
			newfolder.save(null,{
				wait: true,
				parse : false,
				error : (model,response) => {
					console.log(response.responseText)
					let errorMessage = JSON.parse(response.responseText)
					this.setState({errorMessage : errorMessage.message })
				}
			})
		}
	}

	_updateFolderName(){
		let model = this.props.folder
		
		if(this._validateFolderName()){
			//good to go update.
			model.save({name:this.state.newFolderName},{
				patch:true,
				error : (model,response) => {
					console.log(response.responseText)
					let errorMessage = JSON.parse(response.responseText)
					this.setState({errorMessage : errorMessage.message })
				},
				wait : true, 
				parse : false,
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
			wait: true,
			parse : false,
			url: "/api/folders/" + folderId, 
			success : (model,response) => {
			},
			error : (model,response) => {
				alert(response)
			}
		})
	}

	_saveNewBookmark(){

		if(this.state.newBookmarkName.trim() === "" || this.state.newUrlLink.trim() === "")
			this.setState({errorMessage : "Both url and name is required"});
		else{
			this.setState({showNewFolderPopUp: false})
			let bookmarkArray = _.clone(this.props.folder.get("bookmarks"));

			let newBookmark = {
				name : this.state.newBookmarkName,
				url : this.state.newUrlLink
			}

			this.props.folder.save({folderid:this.props.folder.attributes._id, bookmarkname:this.state.newBookmarkName, url : this.state.newUrlLink},
			{
				url: '/api/folders/' + this.props.folder.attributes._id + '/bookmarks/',
				parse  : false,
				type: 'POST',
				wait: true,
				dontchange: true,
				success : (model,response) => {
					newBookmark._id = response.bookmarkid;
					bookmarkArray.push(newBookmark)
					this.props.folder.set("bookmarks",bookmarkArray);
					this.setState({newBookmarkName:"",newUrlLink:""})
				},
				error : (model,response) => {
					alert(response.responseText);
				}
			})
		}
	}

	render() {
		let folder = this.props.folder;

		return (<div>

			{(this.props.newFolder ?
				<div>
					<center><Button onClick={() => this.setState({newFolderPopUp : true})}>New Folder</Button></center>
					<div className="modal-container">
				        <Modal
				          show={this.state.newFolderPopUp}
				          onHide={() => this.setState({newFolderPopUp: false})}
				          aria-labelledby="contained-modal-title"
				        >
				          <Modal.Header closeButton>
				            <Modal.Title id="contained-modal-title">New Folder Details</Modal.Title>
				          </Modal.Header>
				          <Modal.Body>
				            <form>
				            {this.state.errorMessage != "" &&
								<Alert bsStyle="warning">
								    <strong>Error</strong> {this.state.errorMessage}
								</Alert>
							}
							    <FormGroup controlId="formControlsText">
							      <ControlLabel>New Folder Name</ControlLabel>
							      <FormControl type="text" placeholder="Folder name" onChange={(e) => this.setState({newFolderName : e.target.value})}/>
							    </FormGroup>
						    </form>
				          </Modal.Body>
				          <Modal.Footer>
				            <Button onClick={this._saveFolder.bind(this)}>Save</Button>
				          </Modal.Footer>
				        </Modal>
			        </div>
			    </div>

				:

				<div>
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
					            {this.state.errorMessage != "" &&
									<Alert bsStyle="warning">
									    <strong>Error</strong> {this.state.errorMessage}
									</Alert>
								}
							    <FormGroup controlId="formControlsText">
							      <ControlLabel>New Bookmark</ControlLabel>
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
				</div>
			)}

		</div>);
	}
}

export default FolderComponent; 	


