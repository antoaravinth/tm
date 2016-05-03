import React from "react";
import { Button , FormGroup , ControlLabel , FormControl , Alert, Col } from 'react-bootstrap';
import {BookmarkComponent} from './bookmark.jsx';
import {Popup} from './popup.jsx';
import ReactDOM from 'react-dom';

export class FolderComponent extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {edit: false , newFolderName : props.folder.attributes.name , errorMessage: ""};
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
            <Button onClick={ () => this.setState({edit:!this.state.edit}) } style={this.state.edit === true ? {} : {float: "right"}} bsSize="xsmall">

            	{this.state.edit && 'Cancel'}
            	{!this.state.edit && 'Edit'}

            </Button>

            {this.state.edit === true &&
            	<Button onClick={this._updateFolderName.bind(this)} style={{float: "right"}} bsSize="xsmall">Save</Button>
            }			

            {!this.state.edit &&
				<Button onClick={this._deleteFolder.bind(this)} style={{float: "right"}} bsSize="xsmall">
					Delete
	            </Button>	
        	}
		</div>);
	}
}

export default FolderComponent; 	
