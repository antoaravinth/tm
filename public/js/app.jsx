import {FolderComponent} from './views/folder.jsx'
import React from 'react';
import ReactDOM from 'react-dom';
import FolderCollections from './collections/folders.js'
import Folder from './collections/folders.js'
import Bookmark from './collections/folders.js'
import { Row,Tab,Nav,NavItem,Col,Table,FormGroup,ControlLabel,FormControl,Form,Button} from 'react-bootstrap';
import {BookmarkComponent} from './views/bookmark.jsx';

//for debugging
// window.FolderCollections = FolderCollections
window.Folder = Folder
window.Bookmark = Bookmark

let folders = new FolderCollections();
folders.fetch({
	success : () => { 
		ReactDOM.render(<App folders={folders}/>, document.querySelector("#content"))
		window.FolderCollections = folders
	}
})

class App extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {newFolderName : ""};
  	}

	componentDidMount() {
	    // Whenever there may be a change in the Backbone data, trigger a reconcile.
	    this.getBackboneModels().forEach(function(model) {
	      model.on('add change remove', this.forceUpdate.bind(this, null), this);
	    }, this);
	}

	componentWillUnmount() {
		// Ensure that we clean up any dangling references when the component is
		// destroyed.
		this.getBackboneModels().forEach(function(model) {
		  model.off(null, null, this);
		}, this);
	}

	getBackboneModels() {
		return [this.props.folders]
	}
	render() {
		return (<div>

			<Col md={1} />
			<Col md={10}>
				<br />
				<FolderComponent newFolder={true} folders={folders}/>
				<br />
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
				      		return folder.attributes.bookmarks.map((bookmark) => {
				      			return (<BookmarkComponent bookmark={bookmark} key={bookmark._id} folder={folder}/>)
				      		})
				     	})}
				      </Col>
				    </Row>
			  	</Tab.Container>
		  	</Col>
		  	<Col md={1} />
		</div>)
	}
}