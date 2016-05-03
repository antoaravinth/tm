import {FolderComponent} from './views/folder.jsx'
import React from 'react';
import ReactDOM from 'react-dom';
import FolderCollections from './collections/folders.js'
import Folder from './collections/folders.js'
import { Row,Tab,Nav,NavItem,Col,Table,FormGroup,ControlLabel,FormControl,Form,Button} from 'react-bootstrap';
import {BookmarkComponent} from './views/bookmark.jsx';

//for debugging
window.FolderCollections = FolderCollections
window.Folder = Folder

let folders = new FolderCollections();
folders.fetch({
	success : () => ReactDOM.render(<App folders={folders}/>, document.querySelector("#content"))
})

class App extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {newFolderName : ""};
  	}

	componentDidMount() {
		console.log("mounting happened")
	    // Whenever there may be a change in the Backbone data, trigger a reconcile.
	    this.getBackboneModels().forEach(function(model) {
	      model.on('add change remove', this.forceUpdate.bind(this, null), this);
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
		return [this.props.folders]
	}

	saveFolder(){

		//run few validations
		if(this.state.newFolderName.trim() === "")
			this.setState({errorMessage : "Folder name can't be empty"})
		else if(this.state.newFolderName.length >= 8)
			this.setState({errorMessage : "Folder name cant be more than 8 chars"})
		else{
			this.props.folders.add({name : this.state.newFolderName});
			let folder = folders.at(folders.length - 1)
			folder.save(null,{
				wait: true,
				error : (model,response) => {
					console.log(response.responseText)
					let errorMessage = JSON.parse(response.responseText)
					this.setState({errorMessage : errorMessage.message })
				}
			})
		}
	}

	render() {
		return (<div>

			<Form horizontal>
			    <FormGroup controlId="folderNameId">
			      <Col componentClass={ControlLabel} sm={1}>
			        Folder Name
			      </Col>
			      <Col sm={1}>
			        <FormControl type="textbox" placeholder="foldername" onChange={(e) => this.setState({newFolderName : e.target.value})} />
			        <Button onClick={this.saveFolder.bind(this)}>
			          Submit
			        </Button>
			      </Col>
			    </FormGroup>
		  </Form>

			<Tab.Container id="left-tabs-example" defaultActiveKey="first">
			    <Row className="clearfix">
			      <Col sm={4}>
				      {this.props.folders.map((folder) => { 
			      			return (<Nav bsStyle="pills" stacked key={folder.attributes._id}>
					          <NavItem eventKey={folder.attributes._id}>
					            	<FolderComponent folder={folder} folderCollection={this.props.folders}/>
					          </NavItem>
					        </Nav>)
			        	})}
			      </Col>
			      <Col sm={8}>
			      	{this.props.folders.map((folder) => { 
			     		return (<BookmarkComponent folderModel={folder} key={folder.attributes._id}/>)
			     	})}
			      </Col>
			    </Row>
		  	</Tab.Container>
		</div>)
	}
}